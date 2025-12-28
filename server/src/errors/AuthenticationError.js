import { AppError } from './AppError.js';
import { ERROR_CODES } from './errorCodes.js';

/**
 * Authentication Error - 401 Unauthorized
 * 
 * Used when authentication fails.
 * Messages should not expose sensitive information.
 * 
 * @class AuthenticationError
 * @extends AppError
 * 
 * @example
 * throw new AuthenticationError('Invalid credentials');
 * throw new AuthenticationError('Token expired', ERROR_CODES.TOKEN_EXPIRED);
 */
export class AuthenticationError extends AppError {
  /**
   * Creates an AuthenticationError
   * 
   * @param {string} message - Error message (should not expose sensitive info)
   * @param {string} code - Error code (defaults to UNAUTHORIZED)
   */
  constructor(message = 'Authentication failed', code = ERROR_CODES.UNAUTHORIZED) {
    super(401, message, code);
    this.name = 'AuthenticationError';
  }
}
