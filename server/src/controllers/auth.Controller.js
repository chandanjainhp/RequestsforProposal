import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateAccessToken } from '../utils/tokenUtils.js';
import crypto from 'crypto';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import EmailLog from '../models/EmailLog.js';
import {
  ValidationError,
  ConflictError,
  NotFoundError,
  AuthenticationError,
  DatabaseError
} from '../utils/errors.js';
import { generateOTP, hashOTP, verifyOTP, isOTPExpired } from '../utils/otpGenerator.js';
import {
  generateWelcomeEmail,
  generateResendEmail,
  generateWelcomeConfirmationEmail
} from '../utils/emailTemplates.js';
import emailAdapter from '../adapters/emailAdapter.js';
import logger from '../utils/logger.js';
import { authFlowLogger, testSessionManager } from '../utils/testLogger.js';

/**
 * Signup with OTP verification
 */
export const signup = async (req, res, next) => {
  const sessionId = testSessionManager.startSession('signup', req.body.email);
  testSessionManager.addOperation(sessionId, 'validation', { body: req.body });
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      authFlowLogger.signupError(req.body.email, new ValidationError('Validation failed', errors.array()));
      throw new ValidationError('Validation failed', errors.array());
    }

    const { full_name, email, company_name, password } = req.body;

    authFlowLogger.signupAttempt(email, full_name, company_name);
    testSessionManager.addOperation(sessionId, 'signup_attempt', { email, full_name, company_name });

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      authFlowLogger.signupError(email, new ConflictError('Email already registered. Please login.'));
      throw new ConflictError('Email already registered. Please login.');
    }

    // Check rate limiting (3 signups per email per 24 hours)
    const recentSignups = await User.countDocuments({
      email: email.toLowerCase(),
      created_at: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });
    
    if (recentSignups >= 3) {
      authFlowLogger.signupError(email, new ValidationError('Too many signup attempts. Please try again later.'));
      throw new ValidationError('Too many signup attempts. Please try again later.');
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create temporary user record (pending verification)
    const tempUser = new User({
      name: full_name,
      email: email.toLowerCase(),
      company: company_name,
      password_hash: passwordHash,
      is_verified: false,
      verification_status: 'pending',
      role: 'user'
    });

    await tempUser.save();

    // Generate OTP
    const otpCode = generateOTP();
    const otpHash = hashOTP(otpCode);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    authFlowLogger.otpGenerated(email, 'signup', otpCode, expiresAt);
    testSessionManager.addOperation(sessionId, 'otp_generated', { otpCode, expiresAt });

    // Create OTP record
    const otp = new OTP({
      user_id: tempUser._id,
      email: tempUser.email,
      otp_code: otpCode,
      otp_hash: otpHash,
      purpose: 'signup',
      expires_at: expiresAt
    });

    await otp.save();

    // Send OTP email
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const forceEmailTest = true; // Enable email sending in development for testing
    
    authFlowLogger.emailSendAttempt(tempUser.email, 'Welcome to BidSense - Verify Your Email', 'otp_verification');
    testSessionManager.addOperation(sessionId, 'email_send_attempt', { email: tempUser.email });
    
    if (!isDevelopment || forceEmailTest) {
      const emailData = generateWelcomeEmail(tempUser, otpCode);
      
      try {
        authFlowLogger.emailSendAttempt(tempUser.email, emailData.subject, 'otp_verification');
        
        // Import the centralized email configuration
        const { transporter } = await import('../email/email.config.js');
        
        // Test the connection
        await transporter.verify();
        
        const mailOptions = {
          from: `"BidSense" <${process.env.GMAIL_USER || process.env.SENDER_EMAIL || 'noreply@bidsense.com'}>`,
          to: tempUser.email,
          subject: emailData.subject,
          html: emailData.html,
          text: emailData.text
        };
        
        const info = await transporter.sendMail(mailOptions);
        
        authFlowLogger.emailSendSuccess(tempUser.email, emailData.subject, info.messageId);
        authFlowLogger.otpSent(tempUser.email, 'signup');
        testSessionManager.addOperation(sessionId, 'email_sent_success', { messageId: info.messageId });

        // Log successful email
        await EmailLog.create({
          user_id: tempUser._id,
          recipient_email: tempUser.email,
          email_type: 'otp_verification',
          subject: emailData.subject,
          status: 'sent'
        });

        authFlowLogger.signupSuccess(tempUser.email, tempUser._id);
        testSessionManager.addOperation(sessionId, 'signup_success', { userId: tempUser._id });

        res.status(201).json({
          success: true,
          message: 'Account created! Check your email for OTP.',
          data: {
            email: tempUser.email,
            masked_email: `${tempUser.email.substring(0, 1)}***${tempUser.email.substring(tempUser.email.indexOf('@'))}`
          }
        });

      } catch (emailError) {
        authFlowLogger.emailSendError(tempUser.email, emailData.subject, emailError);
        testSessionManager.addOperation(sessionId, 'email_send_error', { error: emailError.message });
        
        // Log failed email
        await EmailLog.create({
          user_id: tempUser._id,
          recipient_email: tempUser.email,
          email_type: 'otp_verification',
          subject: emailData.subject,
          status: 'failed',
          error_message: emailError.message
        });

        // Clean up user record on email failure
        await User.deleteOne({ _id: tempUser._id });

        throw new DatabaseError('Failed to send verification email. Please try again.');
      }
    } else {
      // In development, log the OTP code instead of sending email
      authFlowLogger.emailSendSuccess(tempUser.email, 'Welcome to BidSense - Verify Your Email', 'development_mode');
      authFlowLogger.otpSent(tempUser.email, 'signup');
      testSessionManager.addOperation(sessionId, 'email_sent_development', { otpCode });
      
      // Log mock email
      await EmailLog.create({
        user_id: tempUser._id,
        recipient_email: tempUser.email,
        email_type: 'otp_verification',
        subject: 'Welcome to BidSense - Verify Your Email',
        status: 'sent',
        error_message: 'Development mode - email not sent'
      });

      authFlowLogger.signupSuccess(tempUser.email, tempUser._id);
      testSessionManager.addOperation(sessionId, 'signup_success', { userId: tempUser._id });

      res.status(201).json({
        success: true,
        message: 'Account created! Check your email for OTP.',
        data: {
          email: tempUser.email,
          masked_email: `${tempUser.email.substring(0, 1)}***${tempUser.email.substring(tempUser.email.indexOf('@'))}`,
          otp_code: otpCode // Include OTP in development response
        }
      });
    }

    testSessionManager.endSession(sessionId);

  } catch (error) {
    next(error);
  }
};

/**
 * Verify OTP and complete registration
 */
export const verifySignupOTP = async (req, res, next) => {
  const sessionId = testSessionManager.startSession('verify_signup_otp', req.body.email);
  testSessionManager.addOperation(sessionId, 'otp_verification_attempt', { email: req.body.email });
  
  try {
    const { email, otp_code } = req.body;

    authFlowLogger.otpVerificationAttempt(email, 'signup');

    // Find OTP record
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      purpose: 'signup',
      is_used: false
    }).sort({ created_at: -1 });

    if (!otpRecord) {
      authFlowLogger.otpVerificationError(email, 'signup', new NotFoundError('No active OTP found for this email.'));
      throw new NotFoundError('No active OTP found for this email.');
    }

    // Check if OTP is expired
    if (isOTPExpired(otpRecord.expires_at)) {
      authFlowLogger.otpExpired(email, 'signup');
      throw new AuthenticationError('OTP has expired. Please request a new one.');
    }

    // Check if max attempts reached
    if (otpRecord.attempts >= otpRecord.max_attempts) {
      authFlowLogger.otpMaxAttempts(email, 'signup', otpRecord.attempts);
      throw new AuthenticationError('Too many failed attempts. Account locked for 15 minutes.');
    }

    // Verify OTP
    if (!verifyOTP(otp_code, otpRecord.otp_hash)) {
      // Increment attempts
      otpRecord.attempts += 1;
      await otpRecord.save();

      authFlowLogger.otpVerificationError(email, 'signup', new AuthenticationError(`Invalid OTP. Please check and try again. (${otpRecord.max_attempts - otpRecord.attempts} attempts remaining)`));
      throw new AuthenticationError(`Invalid OTP. Please check and try again. (${otpRecord.max_attempts - otpRecord.attempts} attempts remaining)`);
    }

    // Find user
    const user = await User.findById(otpRecord.user_id);
    if (!user) {
      authFlowLogger.otpVerificationError(email, 'signup', new NotFoundError('User not found.'));
      throw new NotFoundError('User not found.');
    }

    // Complete verification
    user.is_verified = true;
    user.verification_status = 'verified';
    user.verified_at = new Date();
    await user.save();

    // Mark OTP as used
    otpRecord.is_used = true;
    otpRecord.verified_at = new Date();
    await otpRecord.save();

    // Generate JWT token
    const token = generateAccessToken(user._id, user.email, user.role);

    authFlowLogger.tokenGenerated(user.email, 'access', process.env.JWT_EXPIRES_IN || '7d');
    testSessionManager.addOperation(sessionId, 'token_generated', { tokenType: 'access' });

    // Send welcome email
    try {
      const welcomeEmail = generateWelcomeConfirmationEmail(user);
      
      authFlowLogger.emailSendAttempt(user.email, welcomeEmail.subject, 'welcome');
      
      // Import the centralized email configuration
      const { transporter } = await import('../email/email.config.js');
      
      // Test the connection
      await transporter.verify();
      
      const mailOptions = {
        from: `"BidSense" <${process.env.GMAIL_USER || process.env.SENDER_EMAIL || 'noreply@bidsense.com'}>`,
        to: user.email,
        subject: welcomeEmail.subject,
        html: welcomeEmail.html,
        text: welcomeEmail.text
      };
      
      const info = await transporter.sendMail(mailOptions);
      
      authFlowLogger.emailSendSuccess(user.email, welcomeEmail.subject, info.messageId);
      testSessionManager.addOperation(sessionId, 'welcome_email_sent', { messageId: info.messageId });

      await EmailLog.create({
        user_id: user._id,
        recipient_email: user.email,
        email_type: 'welcome',
        subject: welcomeEmail.subject,
        status: 'sent'
      });
    } catch (emailError) {
      authFlowLogger.emailSendError(user.email, 'Welcome to BidSense', emailError);
      testSessionManager.addOperation(sessionId, 'welcome_email_error', { error: emailError.message });
    }

    authFlowLogger.otpVerificationSuccess(user.email, 'signup', user._id);
    authFlowLogger.tokenGenerated(user.email, 'access', process.env.JWT_EXPIRES_IN || '7d');
    testSessionManager.addOperation(sessionId, 'otp_verification_success', { userId: user._id });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! Welcome to BidSense',
      data: {
        token,
        user: {
          id: user._id,
          full_name: user.name,
          email: user.email,
          company_name: user.company,
          role: user.role,
          is_verified: user.is_verified
        }
      }
    });

    testSessionManager.endSession(sessionId);

  } catch (error) {
    testSessionManager.addOperation(sessionId, 'error', { error: error.message });
    testSessionManager.endSession(sessionId);
    next(error);
  }
};

/**
 * Resend OTP
 */
export const resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      verification_status: 'pending'
    });

    if (!user) {
      throw new NotFoundError('No pending verification found for this email.');
    }

    // Check rate limiting (5 OTP requests per hour)
    const recentOTPs = await OTP.countDocuments({
      email: email.toLowerCase(),
      purpose: 'signup',
      created_at: { $gte: new Date(Date.now() - 60 * 60 * 1000) }
    });

    if (recentOTPs >= 5) {
      throw new ValidationError('Too many OTP requests. Please try again later.');
    }

    // Invalidate previous OTPs
    await OTP.updateMany(
      {
        email: email.toLowerCase(),
        purpose: 'signup',
        is_used: false
      },
      { $set: { is_used: true, verified_at: new Date() } }
    );

    // Generate new OTP
    const otpCode = generateOTP();
    const otpHash = hashOTP(otpCode);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Create new OTP record
    const otp = new OTP({
      user_id: user._id,
      email: user.email,
      otp_code: otpCode,
      otp_hash: otpHash,
      purpose: 'signup',
      expires_at: expiresAt
    });

    await otp.save();

    // Send new OTP email
    const emailData = generateResendEmail(user, otpCode);
    
    try {
      // Import the centralized email configuration
      const { transporter } = await import('../email/email.config.js');
      
      // Test the connection
      await transporter.verify();
      logger.info("✅ SMTP Server is ready to send emails");
      
      const mailOptions = {
        from: `"BidSense" <${process.env.GMAIL_USER || process.env.SENDER_EMAIL || 'noreply@bidsense.com'}>`,
        to: user.email,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text
      };
      
      await transporter.sendMail(mailOptions);

      await EmailLog.create({
        user_id: user._id,
        recipient_email: user.email,
        email_type: 'otp_resend',
        subject: emailData.subject,
        status: 'sent'
      });

      logger.info(`New OTP sent to ${user.email}`);

      res.status(200).json({
        success: true,
        message: 'New OTP sent to your email.',
        data: {
          email: user.email,
          masked_email: `${user.email.substring(0, 1)}***${user.email.substring(user.email.indexOf('@'))}`
        }
      });

    } catch (emailError) {
      await EmailLog.create({
        user_id: user._id,
        recipient_email: user.email,
        email_type: 'otp_resend',
        subject: emailData.subject,
        status: 'failed',
        error_message: emailError.message
      });

      throw new DatabaseError('Failed to send OTP. Please try again later.');
    }

  } catch (error) {
    next(error);
  }
};

/**
 * Login with OTP
 */
export const login = async (req, res, next) => {
  const sessionId = testSessionManager.startSession('login', req.body.email);
  testSessionManager.addOperation(sessionId, 'login_attempt', { email: req.body.email });
  
  try {
    const { email, password } = req.body;

    authFlowLogger.loginAttempt(email);

    // Validate required fields
    if (!email || !password) {
      authFlowLogger.loginError(email, new ValidationError('Email and password are required.'));
      throw new ValidationError('Email and password are required.');
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password_hash');
    if (!user) {
      authFlowLogger.loginError(email, new AuthenticationError('Invalid credentials.'));
      throw new AuthenticationError('Invalid credentials.');
    }

    // Check if password_hash exists and is valid
    if (!user.password_hash || typeof user.password_hash !== 'string') {
      authFlowLogger.loginError(email, new AuthenticationError('Authentication error. Please contact support.'));
      throw new AuthenticationError('Authentication error. Please contact support.');
    }

    // Check if verified
    if (!user.is_verified) {
      authFlowLogger.loginError(email, new AuthenticationError('Please verify your email before logging in.'));
      throw new AuthenticationError('Please verify your email before logging in.');
    }

    // Verify password with explicit error handling
    let isPasswordValid;
    try {
      isPasswordValid = await bcrypt.compare(password, user.password_hash);
    } catch (bcryptError) {
      authFlowLogger.loginError(email, new AuthenticationError('Authentication error. Please try again.'));
      throw new AuthenticationError('Authentication error. Please try again.');
    }

    if (!isPasswordValid) {
      authFlowLogger.loginError(email, new AuthenticationError('Invalid credentials.'));
      throw new AuthenticationError('Invalid credentials.');
    }

    // Generate OTP for login
    const otpCode = generateOTP();
    const otpHash = hashOTP(otpCode);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    authFlowLogger.otpGenerated(email, 'login', otpCode, expiresAt);
    authFlowLogger.tokenGenerated(email, 'otp', '10m');
    testSessionManager.addOperation(sessionId, 'otp_generated', { otpCode, expiresAt });

    const otp = new OTP({
      user_id: user._id,
      email: user.email,
      otp_code: otpCode,
      otp_hash: otpHash,
      purpose: 'login',
      expires_at: expiresAt
    });

    await otp.save();

    // Send OTP email
    const emailData = generateWelcomeEmail(user, otpCode);
    
    authFlowLogger.emailSendAttempt(user.email, 'Login Verification - BidSense', 'otp_verification');
    testSessionManager.addOperation(sessionId, 'email_send_attempt', { email: user.email });
    
    try {
      // Import the centralized email configuration
      const { transporter } = await import('../email/email.config.js');
      
      // Test the connection
      await transporter.verify();
      
      const mailOptions = {
        from: `"BidSense" <${process.env.GMAIL_USER || process.env.SENDER_EMAIL || 'noreply@bidsense.com'}>`,
        to: user.email,
        subject: 'Login Verification - BidSense',
        html: emailData.html,
        text: emailData.text
      };
      
      const info = await transporter.sendMail(mailOptions);
      
      authFlowLogger.emailSendSuccess(user.email, 'Login Verification - BidSense', info.messageId);
      authFlowLogger.otpSent(user.email, 'login');
      testSessionManager.addOperation(sessionId, 'email_sent_success', { messageId: info.messageId });

      await EmailLog.create({
        user_id: user._id,
        recipient_email: user.email,
        email_type: 'otp_verification',
        subject: 'Login Verification - BidSense',
        status: 'sent'
      });

      authFlowLogger.loginSuccess(user.email, user._id);
      testSessionManager.addOperation(sessionId, 'login_success', { userId: user._id });

      res.status(200).json({
        success: true,
        message: 'OTP sent to your email for verification.',
        data: {
          email: user.email,
          masked_email: `${user.email.substring(0, 1)}***${user.email.substring(user.email.indexOf('@'))}`
        }
      });

    } catch (emailError) {
      authFlowLogger.emailSendError(user.email, 'Login Verification - BidSense', emailError);
      testSessionManager.addOperation(sessionId, 'email_send_error', { error: emailError.message });
      
      await EmailLog.create({
        user_id: user._id,
        recipient_email: user.email,
        email_type: 'otp_verification',
        subject: 'Login Verification - BidSense',
        status: 'failed',
        error_message: emailError.message
      });

      throw new DatabaseError('Failed to send verification email. Please try again.');
    }

    testSessionManager.endSession(sessionId);

  } catch (error) {
    testSessionManager.addOperation(sessionId, 'error', { error: error.message });
    testSessionManager.endSession(sessionId);
    next(error);
  }
};

/**
 * Verify login OTP
 */
export const verifyLoginOTP = async (req, res, next) => {
  const sessionId = testSessionManager.startSession('verify_login_otp', req.body.email);
  testSessionManager.addOperation(sessionId, 'otp_verification_attempt', { email: req.body.email });
  
  try {
    const { email, otp_code } = req.body;

    authFlowLogger.otpVerificationAttempt(email, 'login');

    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      purpose: 'login',
      is_used: false
    }).sort({ created_at: -1 });

    if (!otpRecord) {
      // Check if there are any OTPs for this email to provide better error
      const anyOtp = await OTP.findOne({ email: email.toLowerCase(), purpose: 'login' }).sort({ created_at: -1 });
      if (anyOtp) {
        if (anyOtp.is_used) {
          throw new AuthenticationError('OTP has already been used. Please login again.');
        } else if (isOTPExpired(anyOtp.expires_at)) {
          throw new AuthenticationError('OTP has expired. Please login again.');
        } else {
          throw new AuthenticationError('Invalid OTP state. Please login again.');
        }
      } else {
        authFlowLogger.otpVerificationError(email, 'login', new NotFoundError('No login OTP found. Please login again to receive a new OTP.'));
        throw new NotFoundError('No login OTP found. Please login again to receive a new OTP.');
      }
    }

    if (isOTPExpired(otpRecord.expires_at)) {
      authFlowLogger.otpExpired(email, 'login');
      throw new AuthenticationError('OTP has expired. Please request a new one.');
    }

    if (otpRecord.attempts >= otpRecord.max_attempts) {
      authFlowLogger.otpMaxAttempts(email, 'login', otpRecord.attempts);
      throw new AuthenticationError('Too many failed attempts. Account locked for 15 minutes.');
    }

    // Debug OTP comparison
    const isMatch = verifyOTP(otp_code, otpRecord.otp_hash);

    if (!isMatch) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      authFlowLogger.otpVerificationError(email, 'login', new AuthenticationError(`Invalid OTP. Please check and try again. (${otpRecord.max_attempts - otpRecord.attempts} attempts remaining)`));
      throw new AuthenticationError(`Invalid OTP. Please check and try again. (${otpRecord.max_attempts - otpRecord.attempts} attempts remaining)`);
    }

    const user = await User.findById(otpRecord.user_id);
    if (!user) {
      authFlowLogger.otpVerificationError(email, 'login', new NotFoundError('User not found.'));
      throw new NotFoundError('User not found.');
    }

    otpRecord.is_used = true;
    otpRecord.verified_at = new Date();
    await otpRecord.save();

    user.last_login = new Date();
    await user.save();

    const token = generateAccessToken(user._id, user.email, user.role);

    authFlowLogger.tokenGenerated(user.email, 'access', process.env.JWT_EXPIRES_IN || '7d');
    authFlowLogger.otpVerificationSuccess(user.email, 'login', user._id);
    testSessionManager.addOperation(sessionId, 'otp_verification_success', { userId: user._id });

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      data: {
        token,
        user: {
          id: user._id,
          full_name: user.name,
          email: user.email,
          company_name: user.company,
          role: user.role,
          is_verified: user.is_verified
        }
      }
    });

    testSessionManager.endSession(sessionId);

  } catch (error) {
    testSessionManager.addOperation(sessionId, 'error', { error: error.message });
    testSessionManager.endSession(sessionId);
    next(error);
  }
};

/**
 * Refresh Access Token
 * POST /api/auth/refresh
 * Refreshes an expired access token using a valid refresh token
 */
export const refreshToken = async (req, res, next) => {
  const sessionId = testSessionManager.startSession('refresh_token', 'unknown');
  testSessionManager.addOperation(sessionId, 'token_refresh_attempt', { hasRefreshToken: !!req.body.refreshToken });
  
  try {
    const { refreshToken } = req.body;

    authFlowLogger.tokenRefreshAttempt('unknown');

    // Validate refresh token
    if (!refreshToken) {
      authFlowLogger.tokenRefreshError('unknown', new AuthenticationError('Refresh token is required.'));
      throw new AuthenticationError('Refresh token is required.');
    }

    // Verify refresh token format (should be JWT)
    if (typeof refreshToken !== 'string') {
      authFlowLogger.tokenRefreshError('unknown', new AuthenticationError('Invalid refresh token format.'));
      throw new AuthenticationError('Invalid refresh token format.');
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        authFlowLogger.tokenRefreshError('unknown', new AuthenticationError('Refresh token has expired. Please login again.'));
        throw new AuthenticationError('Refresh token has expired. Please login again.');
      }
      authFlowLogger.tokenRefreshError('unknown', new AuthenticationError('Invalid refresh token.'));
      throw new AuthenticationError('Invalid refresh token.');
    }

    // Find user to ensure they still exist and are active
    const user = await User.findById(decoded.userId).select('-password_hash -refresh_tokens');
    if (!user) {
      authFlowLogger.tokenRefreshError(decoded.email || 'unknown', new AuthenticationError('User not found.'));
      throw new AuthenticationError('User not found.');
    }

    if (!user.is_verified) {
      authFlowLogger.tokenRefreshError(user.email, new AuthenticationError('User account not verified.'));
      throw new AuthenticationError('User account not verified.');
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    authFlowLogger.tokenGenerated(user.email, 'access', process.env.JWT_EXPIRES_IN || '7d');
    authFlowLogger.tokenRefreshSuccess(user.email);
    testSessionManager.addOperation(sessionId, 'token_refresh_success', { userId: user._id });

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully.',
      data: {
        token: newAccessToken
      }
    });

    testSessionManager.endSession(sessionId);

  } catch (error) {
    testSessionManager.addOperation(sessionId, 'error', { error: error.message });
    testSessionManager.endSession(sessionId);
    next(error);
  }
};

/**
 * Verify Token
 * GET /api/auth/verify
 * Verifies the access token and returns user information
 */
export const verifyToken = async (req, res, next) => {
  try {
    // Token is already verified by authenticate middleware
    // User info is attached to req.user by the middleware
    const user = await User.findById(req.user.userId).select('-password_hash -refresh_tokens');
    
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        full_name: user.name,
        email: user.email,
        company_name: user.company,
        role: user.role,
        is_verified: user.is_verified
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Update Profile
 * PUT /api/auth/profile
 * Updates user profile information
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { full_name, company_name, notification_preferences } = req.body;
    
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Update fields if provided
    if (full_name !== undefined) {
      user.name = full_name.trim();
    }
    if (company_name !== undefined) {
      user.company = company_name.trim();
    }
    if (notification_preferences !== undefined) {
      user.notification_preferences = notification_preferences;
    }

    await user.save();

    logger.info(`Profile updated for user: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        full_name: user.name,
        email: user.email,
        company_name: user.company,
        role: user.role,
        notification_preferences: user.notification_preferences
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Change Password
 * POST /api/auth/change-password
 * Changes user password
 */
export const changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;
    
    const user = await User.findById(req.user.userId).select('+password_hash');
    
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(current_password, user.password_hash);
    if (!isPasswordValid) {
      throw new AuthenticationError('Current password is incorrect');
    }

    // Check if new password is different
    const isSamePassword = await bcrypt.compare(new_password, user.password_hash);
    if (isSamePassword) {
      throw new ValidationError('New password must be different from current password');
    }

    // Hash and update password
    const saltRounds = 12;
    user.password_hash = await bcrypt.hash(new_password, saltRounds);
    await user.save();

    logger.info(`Password changed for user: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    next(error);
  }
};