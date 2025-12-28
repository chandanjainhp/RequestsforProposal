/**
 * JWT Configuration
 * Centralized configuration for JWT token management
 */

// Token Types
export const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  PASSWORD_RESET: 'password_reset',
  EMAIL_VERIFY: 'email_verify'
};

// Token Expiry Times
export const TOKEN_EXPIRY = {
  ACCESS: process.env.JWT_EXPIRY || '15m',
  REFRESH: process.env.JWT_REFRESH_EXPIRY || '7d',
  PASSWORD_RESET: '30m',
  EMAIL_VERIFY: '24h'
};

// JWT Secrets
export const JWT_SECRETS = {
  ACCESS: process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET,
  REFRESH: process.env.JWT_REFRESH_SECRET || process.env.REFRESH_TOKEN_SECRET
};

// JWT Issuer
export const JWT_ISSUER = process.env.JWT_ISSUER || process.env.CLIENT_URL || 'rfp-management-system';

// Algorithm
export const JWT_ALGORITHM = 'HS256';

// Token Limits
export const TOKEN_LIMITS = {
  MAX_REFRESH_TOKENS_PER_USER: 5, // Maximum number of refresh tokens per user
  PASSWORD_RESET_TOKEN_LENGTH: 32, // Length of password reset token
  EMAIL_VERIFY_TOKEN_LENGTH: 6 // Length of email verification OTP
};

// Validation
if (!JWT_SECRETS.ACCESS || JWT_SECRETS.ACCESS.length < 32) {
  throw new Error('JWT_SECRET or ACCESS_TOKEN_SECRET must be at least 32 characters long');
}

if (!JWT_SECRETS.REFRESH || JWT_SECRETS.REFRESH.length < 32) {
  throw new Error('JWT_REFRESH_SECRET or REFRESH_TOKEN_SECRET must be at least 32 characters long');
}

export default {
  TOKEN_TYPES,
  TOKEN_EXPIRY,
  JWT_SECRETS,
  JWT_ISSUER,
  JWT_ALGORITHM,
  TOKEN_LIMITS
};

