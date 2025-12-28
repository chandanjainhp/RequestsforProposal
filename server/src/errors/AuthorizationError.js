import { AppError } from './AppError.js';
import { ERROR_CODES } from './errorCodes.js';

/**
 * Authorization Error - 403 Forbidden
 * 
 * Used when user is authenticated but lacks required permissions.
 * Includes required role information for debugging.
 * 
 * @class AuthorizationError
 * @extends AppError
 * 
 * @example
 * throw new AuthorizationError('Access forbidden', 'admin');
 * throw new AuthorizationError('Insufficient permissions', ['admin', 'moderator']);
 */
export class AuthorizationError extends AppError {
  /**
   * Creates an AuthorizationError
   * 
   * @param {string} message - Error message
   * @param {string|string[]} requiredRole - Required role(s) for debugging
   */
  constructor(message = 'Access forbidden', requiredRole = null) {
    super(403, message, ERROR_CODES.FORBIDDEN);
    this.name = 'AuthorizationError';
    
    // Include required role info in details for debugging
    if (requiredRole) {
      this.details = {
        required_role: Array.isArray(requiredRole) ? requiredRole : [requiredRole]
      };
    }
  }
}
