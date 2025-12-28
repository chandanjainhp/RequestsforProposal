import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { 
  TOKEN_TYPES, 
  TOKEN_EXPIRY, 
  JWT_SECRETS, 
  JWT_ISSUER, 
  JWT_ALGORITHM,
  TOKEN_LIMITS 
} from '../config/jwt.config.js';

/**
 * Custom Token Errors
 */
export class TokenExpiredError extends Error {
  constructor(message = 'Token has expired') {
    super(message);
    this.name = 'TokenExpiredError';
    this.code = 'TOKEN_EXPIRED';
  }
}

export class InvalidTokenError extends Error {
  constructor(message = 'Invalid token') {
    super(message);
    this.name = 'InvalidTokenError';
    this.code = 'INVALID_TOKEN';
  }
}

export class MalformedTokenError extends Error {
  constructor(message = 'Malformed token') {
    super(message);
    this.name = 'MalformedTokenError';
    this.code = 'MALFORMED_TOKEN';
  }
}

/**
 * Generate Access Token
 * Short-lived bearer token for API authentication
 * 
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @param {string} role - User role (user, admin)
 * @returns {string} JWT access token
 */
export const generateAccessToken = (userId, email, role) => {
  const payload = {
    userId,
    email,
    role,
    type: TOKEN_TYPES.ACCESS
  };

  const options = {
    expiresIn: TOKEN_EXPIRY.ACCESS,
    issuer: JWT_ISSUER,
    algorithm: JWT_ALGORITHM
  };

  return jwt.sign(payload, JWT_SECRETS.ACCESS, options);
};

/**
 * Generate Refresh Token
 * Long-lived token for obtaining new access tokens
 * Includes unique tokenId for tracking and rotation
 * 
 * @param {string} userId - User ID
 * @returns {Object} { token: string, tokenId: string, expiresAt: Date }
 */
export const generateRefreshToken = (userId) => {
  const tokenId = uuidv4(); // Unique identifier for this refresh token
  
  const payload = {
    userId,
    type: TOKEN_TYPES.REFRESH,
    tokenId
  };

  const options = {
    expiresIn: TOKEN_EXPIRY.REFRESH,
    issuer: JWT_ISSUER,
    algorithm: JWT_ALGORITHM
  };

  const token = jwt.sign(payload, JWT_SECRETS.REFRESH, options);

  // Calculate expiry date
  const decoded = jwt.decode(token);
  const expiresAt = new Date(decoded.exp * 1000);

  return {
    token,
    tokenId,
    expiresAt
  };
};

/**
 * Generate Password Reset Token
 * One-time use token for password reset
 * 
 * @returns {string} 32-character random hex string
 */
export const generatePasswordResetToken = () => {
  return crypto.randomBytes(TOKEN_LIMITS.PASSWORD_RESET_TOKEN_LENGTH / 2).toString('hex');
};

/**
 * Generate Email Verification Token
 * One-time use token for email verification
 * Can be 6-digit OTP or 32-char string
 * 
 * @param {boolean} useOTP - If true, generate 6-digit OTP; otherwise 32-char string
 * @returns {string} Verification token
 */
export const generateEmailVerificationToken = (useOTP = true) => {
  if (useOTP) {
    // Generate 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  } else {
    // Generate 32-character random string
    return crypto.randomBytes(16).toString('hex');
  }
};

/**
 * Hash Token
 * Hash a token before storing in database
 * Uses SHA-256 for deterministic hashing
 * 
 * @param {string} token - Token to hash
 * @returns {string} Hashed token
 */
export const hashToken = (token) => {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
};

/**
 * Verify Access Token
 * Verifies JWT signature and expiry
 * 
 * @param {string} token - Access token to verify
 * @returns {Object} Decoded token payload
 * @throws {TokenExpiredError} If token is expired
 * @throws {InvalidTokenError} If token signature is invalid
 * @throws {MalformedTokenError} If token format is invalid
 */
export const verifyAccessToken = (token) => {
  if (!token || typeof token !== 'string') {
    throw new MalformedTokenError('Token must be a non-empty string');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRETS.ACCESS, {
      issuer: JWT_ISSUER,
      algorithms: [JWT_ALGORITHM]
    });

    // Verify token type
    if (decoded.type !== TOKEN_TYPES.ACCESS) {
      throw new InvalidTokenError('Invalid token type');
    }

    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new TokenExpiredError('Access token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      if (error.message.includes('invalid signature')) {
        throw new InvalidTokenError('Invalid token signature');
      } else if (error.message.includes('jwt malformed')) {
        throw new MalformedTokenError('Token format is invalid');
      }
      throw new InvalidTokenError(error.message);
    } else if (error instanceof TokenExpiredError || error instanceof InvalidTokenError || error instanceof MalformedTokenError) {
      throw error;
    }
    throw new InvalidTokenError('Token verification failed');
  }
};

/**
 * Verify Refresh Token
 * Verifies JWT signature, expiry, and token type
 * 
 * @param {string} token - Refresh token to verify
 * @returns {Object} Decoded token payload
 * @throws {TokenExpiredError} If token is expired
 * @throws {InvalidTokenError} If token signature is invalid
 * @throws {MalformedTokenError} If token format is invalid
 */
export const verifyRefreshToken = (token) => {
  if (!token || typeof token !== 'string') {
    throw new MalformedTokenError('Token must be a non-empty string');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRETS.REFRESH, {
      issuer: JWT_ISSUER,
      algorithms: [JWT_ALGORITHM]
    });

    // Verify token type
    if (decoded.type !== TOKEN_TYPES.REFRESH) {
      throw new InvalidTokenError('Invalid token type');
    }

    // Verify tokenId exists
    if (!decoded.tokenId) {
      throw new InvalidTokenError('Token ID is missing');
    }

    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new TokenExpiredError('Refresh token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      if (error.message.includes('invalid signature')) {
        throw new InvalidTokenError('Invalid token signature');
      } else if (error.message.includes('jwt malformed')) {
        throw new MalformedTokenError('Token format is invalid');
      }
      throw new InvalidTokenError(error.message);
    } else if (error instanceof TokenExpiredError || error instanceof InvalidTokenError || error instanceof MalformedTokenError) {
      throw error;
    }
    throw new InvalidTokenError('Token verification failed');
  }
};

/**
 * Verify Password Reset Token
 * Compares hashed token with stored hash and checks expiry
 * 
 * @param {string} token - Plain token from request
 * @param {string} storedHash - Hashed token from database
 * @param {Date} expiresAt - Expiry timestamp from database
 * @returns {boolean} True if token is valid
 */
export const verifyPasswordResetToken = (token, storedHash, expiresAt) => {
  if (!token || !storedHash || !expiresAt) {
    return false;
  }

  // Check expiry
  if (new Date(expiresAt) < new Date()) {
    return false;
  }

  // Compare hashes
  const tokenHash = hashToken(token);
  return tokenHash === storedHash;
};

/**
 * Verify Email Verification Token
 * Compares token with stored hash and checks expiry
 * 
 * @param {string} token - Plain token from request
 * @param {string} storedHash - Hashed token from database
 * @param {Date} expiresAt - Expiry timestamp from database
 * @returns {boolean} True if token is valid
 */
export const verifyEmailVerificationToken = (token, storedHash, expiresAt) => {
  if (!token || !storedHash || !expiresAt) {
    return false;
  }

  // Check expiry
  if (new Date(expiresAt) < new Date()) {
    return false;
  }

  // Compare hashes
  const tokenHash = hashToken(token);
  return tokenHash === storedHash;
};

/**
 * Decode Token Without Verification
 * Decodes JWT without verifying signature (useful for inspection)
 * 
 * @param {string} token - Token to decode
 * @returns {Object} Decoded payload (not verified)
 */
export const decodeToken = (token) => {
  return jwt.decode(token, { complete: true });
};

/**
 * Get Token Expiry Date
 * Extracts expiry date from token
 * 
 * @param {string} token - JWT token
 * @returns {Date|null} Expiry date or null if invalid
 */
export const getTokenExpiry = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (decoded && decoded.exp) {
      return new Date(decoded.exp * 1000);
    }
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Check if Token is Expired
 * Checks if token is expired without full verification
 * 
 * @param {string} token - JWT token
 * @returns {boolean} True if expired
 */
export const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (decoded && decoded.exp) {
      return new Date(decoded.exp * 1000) < new Date();
    }
    return true;
  } catch (error) {
    return true;
  }
};
