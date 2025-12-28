import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken, 
  generatePasswordResetToken,
  hashToken,
  TokenExpiredError,
  InvalidTokenError
} from '../utils/tokenUtils.js';
import { validatePasswordStrength, validatePhone, validateCompany } from '../utils/passwordValidator.js';
import { ValidationError } from '../errors/ValidationError.js';
import { AuthenticationError } from '../errors/AuthenticationError.js';
import { ConflictError } from '../errors/ConflictError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { sendPasswordResetEmail } from '../utils/email.js';
import logger from '../utils/logger.js';

/**
 * Register new user
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req, res, next) => {
  const { email, password, name, company, phone } = req.body;

  // Validate required fields
  if (!email || !password || !name) {
    throw new ValidationError('Email, password, and name are required');
  }

  // Validate password strength
  const passwordValidation = validatePasswordStrength(password);
  if (!passwordValidation.isValid) {
    throw new ValidationError('Password validation failed', passwordValidation.errors);
  }

  // Validate company (optional)
  if (company) {
    const companyValidation = validateCompany(company);
    if (!companyValidation.isValid) {
      throw new ValidationError(companyValidation.error);
    }
  }

  // Validate phone (optional)
  if (phone) {
    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.isValid) {
      throw new ValidationError(phoneValidation.error);
    }
  }

  // Check if user already exists
  const existingUser = await User.findActiveByEmail(email);
  if (existingUser) {
    throw new ConflictError('Email already registered');
  }

  // Create new user
  const user = new User({
    email: email.toLowerCase().trim(),
    password_hash: password, // Will be hashed by pre-save hook
    name: name.trim(),
    company: company?.trim(),
    phone: phone?.trim()
  });

  await user.save();

  // Generate tokens
  const accessToken = generateAccessToken(user._id.toString(), user.email, user.role);
  const refreshTokenData = generateRefreshToken(user._id.toString());
  
  // Calculate expiry time for access token
  const expiresIn = 15 * 60; // 15 minutes in seconds

  // Hash refresh token before storing
  const hashedRefreshToken = hashToken(refreshTokenData.token);
  
  // Save refresh token to user with tokenId for rotation support
  await user.addRefreshToken(
    refreshTokenData.tokenId,
    hashedRefreshToken,
    refreshTokenData.expiresAt,
    req.headers['user-agent'] || null // Optional device info
  );

  // Return user data (password_hash excluded by schema transform)
  const userData = {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    company: user.company,
    phone: user.phone
  };

  res.status(201).json({
    ok: true,
    message: 'User registered successfully',
    data: {
      user: userData,
      access_token: accessToken,
      refresh_token: refreshTokenData.token, // Return unhashed token to client
      expires_in: expiresIn
    }
  });
});

/**
 * Login user
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  // Find user with password_hash selected
  const user = await User.findOne({ 
    email: email.toLowerCase().trim(),
    deleted_at: null
  }).select('+password_hash +lock_until +login_attempts');

  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Check if account is locked
  if (user.isLocked) {
    const lockUntil = user.lock_until;
    const remainingTime = Math.ceil((lockUntil - Date.now()) / 1000 / 60); // minutes
    throw new AuthenticationError(`Account is locked. Try again in ${remainingTime} minute(s)`);
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  
  if (!isPasswordValid) {
    // Increment login attempts
    await user.incLoginAttempts();
    throw new AuthenticationError('Invalid email or password');
  }

  // Reset login attempts on successful login
  await user.resetLoginAttempts();

  // Generate tokens
  const accessToken = generateAccessToken(user._id.toString(), user.email, user.role);
  const refreshTokenData = generateRefreshToken(user._id.toString());
  
  const expiresIn = 15 * 60; // 15 minutes in seconds

  // Hash refresh token before storing
  const hashedRefreshToken = hashToken(refreshTokenData.token);
  
  // Save refresh token to user with tokenId for rotation support
  await user.addRefreshToken(
    refreshTokenData.tokenId,
    hashedRefreshToken,
    refreshTokenData.expiresAt,
    req.headers['user-agent'] || null // Optional device info
  );

  // Update last login
  user.last_login = new Date();
  await user.save();

  // Return user data
  const userData = {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    company: user.company,
    phone: user.phone,
    last_login: user.last_login
  };

  res.json({
    ok: true,
    message: 'Login successful',
    data: {
      user: userData,
      access_token: accessToken,
      refresh_token: refreshTokenData.token, // Return unhashed token to client
      expires_in: expiresIn
    }
  });
});

/**
 * Refresh access token
 * POST /api/auth/refresh
 * 
 * Implements token rotation: issues new refresh token and invalidates old one
 */
export const refreshToken = asyncHandler(async (req, res, next) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    throw new ValidationError('Refresh token is required');
  }

  // Verify refresh token JWT signature and expiry
  let decoded;
  try {
    decoded = verifyRefreshToken(refresh_token);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new AuthenticationError('Refresh token has expired. Please login again.');
    } else if (error instanceof InvalidTokenError) {
      throw new AuthenticationError('Invalid refresh token');
    }
    throw new AuthenticationError('Refresh token verification failed');
  }

  // Find user
  const user = await User.findById(decoded.userId);
  if (!user || !user.isActive()) {
    throw new AuthenticationError('User not found or inactive');
  }

  // Find refresh token by tokenId in user's refresh_tokens array
  const tokenRecord = user.findRefreshTokenByTokenId(decoded.tokenId);
  
  if (!tokenRecord) {
    throw new AuthenticationError('Refresh token not found or has been revoked');
  }

  // Verify token hash matches (defense in depth)
  const hashedToken = hashToken(refresh_token);
  if (tokenRecord.token !== hashedToken) {
    throw new AuthenticationError('Refresh token mismatch');
  }

  // Check if token is expired (additional check)
  if (tokenRecord.expires_at && new Date(tokenRecord.expires_at) < new Date()) {
    // Remove expired token
    await user.removeRefreshTokenByTokenId(decoded.tokenId);
    throw new AuthenticationError('Refresh token expired');
  }

  // Generate new access token
  const accessToken = generateAccessToken(user._id.toString(), user.email, user.role);
  const expiresIn = 15 * 60; // 15 minutes in seconds

  // TOKEN ROTATION: Issue new refresh token and invalidate old one
  // This prevents token reuse attacks and limits the window of compromise
  const newRefreshTokenData = generateRefreshToken(user._id.toString());
  const newHashedToken = hashToken(newRefreshTokenData.token);

  // Remove old token and add new one
  await user.removeRefreshTokenByTokenId(decoded.tokenId);
  await user.addRefreshToken(
    newRefreshTokenData.tokenId,
    newHashedToken,
    newRefreshTokenData.expiresAt,
    req.headers['user-agent'] || null
  );

  res.json({
    ok: true,
    message: 'Token refreshed successfully',
    data: {
      access_token: accessToken,
      refresh_token: newRefreshTokenData.token, // New rotated token
      expires_in: expiresIn
    }
  });
});

/**
 * Get current user profile
 * GET /api/auth/me
 */
export const getCurrentUser = asyncHandler(async (req, res, next) => {
  const userId = req.user?.userId || req.user?._id?.toString();
  
  if (!userId) {
    throw new AuthenticationError('User not authenticated');
  }

  const user = await User.findById(userId);
  if (!user || !user.isActive()) {
    throw new NotFoundError('User not found');
  }

  const userData = {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    company: user.company,
    phone: user.phone,
    created_at: user.created_at,
    updated_at: user.updated_at,
    last_login: user.last_login
  };

  res.json({
    ok: true,
    data: {
      user: userData
    }
  });
});

/**
 * Update user profile
 * PUT /api/auth/profile
 */
export const updateProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user?.userId || req.user?._id?.toString();
  const { name, company, phone } = req.body;

  if (!userId) {
    throw new AuthenticationError('User not authenticated');
  }

  const user = await User.findById(userId);
  if (!user || !user.isActive()) {
    throw new NotFoundError('User not found');
  }

  // Validate name if provided
  if (name !== undefined) {
    if (!name || name.trim().length < 2) {
      throw new ValidationError('Name must be at least 2 characters');
    }
    user.name = name.trim();
  }

  // Validate company if provided
  if (company !== undefined) {
    if (company === null || company === '') {
      user.company = undefined;
    } else {
      const companyValidation = validateCompany(company);
      if (!companyValidation.isValid) {
        throw new ValidationError(companyValidation.error);
      }
      user.company = company.trim();
    }
  }

  // Validate phone if provided
  if (phone !== undefined) {
    if (phone === null || phone === '') {
      user.phone = undefined;
    } else {
      const phoneValidation = validatePhone(phone);
      if (!phoneValidation.isValid) {
        throw new ValidationError(phoneValidation.error);
      }
      user.phone = phone.trim();
    }
  }

  user.updated_at = new Date();
  await user.save();

  const userData = {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    company: user.company,
    phone: user.phone,
    updated_at: user.updated_at
  };

  res.json({
    ok: true,
    message: 'Profile updated successfully',
    data: {
      user: userData
    }
  });
});

/**
 * Change password
 * POST /api/auth/change-password
 */
export const changePassword = asyncHandler(async (req, res, next) => {
  const userId = req.user?.userId || req.user?._id?.toString();
  const { old_password, new_password } = req.body;

  if (!userId) {
    throw new AuthenticationError('User not authenticated');
  }

  if (!old_password || !new_password) {
    throw new ValidationError('Old password and new password are required');
  }

  // Validate new password strength
  const passwordValidation = validatePasswordStrength(new_password);
  if (!passwordValidation.isValid) {
    throw new ValidationError('New password validation failed', passwordValidation.errors);
  }

  // Find user with password_hash
  const user = await User.findById(userId).select('+password_hash');
  if (!user || !user.isActive()) {
    throw new NotFoundError('User not found');
  }

  // Verify old password
  const isOldPasswordValid = await user.comparePassword(old_password);
  if (!isOldPasswordValid) {
    throw new AuthenticationError('Current password is incorrect');
  }

  // Update password (will be hashed by pre-save hook)
  user.password_hash = new_password;
  
  // Clear all refresh tokens to force re-login on all devices
  await user.clearRefreshTokens();
  await user.save();

  res.json({
    ok: true,
    message: 'Password changed successfully. Please login again.'
  });
});

/**
 * Delete account (soft delete)
 * DELETE /api/auth/account
 */
export const deleteAccount = asyncHandler(async (req, res, next) => {
  const userId = req.user?.userId || req.user?._id?.toString();

  if (!userId) {
    throw new AuthenticationError('User not authenticated');
  }

  const user = await User.findById(userId);
  if (!user || !user.isActive()) {
    throw new NotFoundError('User not found');
  }

  // Soft delete: set deleted_at timestamp
  user.deleted_at = new Date();
  user.updated_at = new Date();
  
  // Clear all refresh tokens
  await user.clearRefreshTokens();
  await user.save();

  res.json({
    ok: true,
    message: 'Account deleted successfully'
  });
});

/**
 * Forgot password - send reset token via email
 * POST /api/auth/forgot-password
 */
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    throw new ValidationError('Email is required');
  }

  // Find user
  const user = await User.findActiveByEmail(email);
  
  // Don't reveal if user exists or not (security best practice)
  // Always return success message
  
  if (user) {
    // Generate reset token
    const resetToken = generatePasswordResetToken();
    
    // Hash the token before storing
    const hashedToken = hashToken(resetToken);

    // Set reset token and expiry (30 minutes)
    user.password_reset_token = hashedToken;
    user.password_reset_expires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await user.save();

    try {
      // Send reset email with unhashed token
      await sendPasswordResetEmail(user, resetToken);
      logger.info(`Password reset email sent to ${user.email}`);
    } catch (emailError) {
      logger.error(`Failed to send password reset email to ${user.email}`, { error: emailError.message });
      // Don't throw error, just log it - user still gets success message
    }
  }

  // Always return success to prevent email enumeration
  res.json({
    ok: true,
    message: 'If an account with that email exists, a password reset link has been sent.'
  });
});

/**
 * Reset password
 * POST /api/auth/reset-password
 */
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { token, password } = req.body;

  if (!token || !password) {
    throw new ValidationError('Token and password are required');
  }

  // Validate password strength
  const passwordValidation = validatePasswordStrength(password);
  if (!passwordValidation.isValid) {
    throw new ValidationError('Password validation failed', passwordValidation.errors);
  }

  // Hash the token to compare with stored hash
  const hashedToken = hashToken(token);

  // Find user with reset token (not expired)
  const user = await User.findOne({
    password_reset_token: hashedToken,
    password_reset_expires: { $gt: Date.now() },
    deleted_at: null
  }).select('+password_reset_token +password_reset_expires');

  if (!user) {
    throw new AuthenticationError('Invalid or expired reset token');
  }

  // Update password
  user.password_hash = password; // Will be hashed by pre-save hook
  user.password_reset_token = undefined;
  user.password_reset_expires = undefined;
  
  // Clear all refresh tokens to force re-login
  await user.clearRefreshTokens();
  await user.save();

  res.json({
    ok: true,
    message: 'Password reset successful. Please login with your new password.'
  });
});

/**
 * Logout user (invalidate refresh token)
 * POST /api/auth/logout
 * 
 * Invalidates the current refresh token
 */
export const logout = asyncHandler(async (req, res, next) => {
  const { refresh_token } = req.body;
  const userId = req.user?.userId || req.user?._id?.toString();

  // If authenticated user, use their ID, otherwise require refresh_token
  if (userId) {
    const user = await User.findById(userId);
    if (user) {
      // Clear all refresh tokens (logout from all devices)
      await user.clearRefreshTokens();
      logger.info(`User ${userId} logged out from all devices`);
    }
  } else if (refresh_token) {
    // Verify and find token to invalidate
    try {
      const decoded = verifyRefreshToken(refresh_token);
      const user = await User.findById(decoded.userId);
      
      if (user) {
        // Remove specific refresh token
        await user.removeRefreshTokenByTokenId(decoded.tokenId);
        logger.info(`Refresh token ${decoded.tokenId} invalidated for user ${decoded.userId}`);
      }
    } catch (error) {
      // Token invalid, but return success anyway (idempotent)
      logger.warn('Invalid refresh token provided for logout', { error: error.message });
    }
  } else {
    throw new ValidationError('Either authentication or refresh_token is required');
  }

  res.json({
    ok: true,
    message: 'Logged out successfully'
  });
});

/**
 * Logout from all devices
 * POST /api/auth/logout-all
 * 
 * Invalidates all refresh tokens for the authenticated user
 */
export const logoutAll = asyncHandler(async (req, res, next) => {
  const userId = req.user?.userId || req.user?._id?.toString();

  if (!userId) {
    throw new AuthenticationError('Authentication required');
  }

  const user = await User.findById(userId);
  if (!user || !user.isActive()) {
    throw new NotFoundError('User not found');
  }

  // Clear all refresh tokens
  await user.clearRefreshTokens();
  logger.info(`User ${userId} logged out from all devices`);

  res.json({
    ok: true,
    message: 'Logged out from all devices successfully'
  });
});

