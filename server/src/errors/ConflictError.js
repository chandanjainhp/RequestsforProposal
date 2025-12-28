import { AppError } from './AppError.js';
import { ERROR_CODES } from './errorCodes.js';

/**
 * Conflict Error - 409 Conflict
 * 
 * Used when resource conflicts (e.g., duplicate entries).
 * Includes field that caused conflict.
 * 
 * @class ConflictError
 * @extends AppError
 * 
 * @example
 * throw new ConflictError('Email already exists', 'email');
 * throw new ConflictError('RFP title already exists', 'title');
 */
export class ConflictError extends AppError {
  /**
   * Creates a ConflictError
   * 
   * @param {string} message - Error message
   * @param {string} field - Field that caused conflict (optional)
   */
  constructor(message = 'Resource conflict', field = null) {
    super(409, message, ERROR_CODES.ALREADY_EXISTS);
    this.name = 'ConflictError';
    
    // Include conflicting field in details
    if (field) {
      this.details = { conflicting_field: field };
    }
  }
}
