import { AppError } from './AppError.js';
import { ERROR_CODES } from './errorCodes.js';

/**
 * Validation Error - 400 Bad Request
 * 
 * Used when request data fails validation.
 * Includes field-level error details.
 * 
 * @class ValidationError
 * @extends AppError
 * 
 * @example
 * throw new ValidationError('Validation failed', {
 *   email: 'Invalid email format',
 *   password: 'Must be at least 8 characters',
 *   name: 'Name is required'
 * });
 */
export class ValidationError extends AppError {
  /**
   * Creates a ValidationError
   * 
   * @param {string} message - Error message
   * @param {Object} details - Field-level error details (optional)
   */
  constructor(message = 'Validation failed', details = null) {
    super(400, message, ERROR_CODES.VALIDATION_ERROR, details);
    this.name = 'ValidationError';
  }
}
