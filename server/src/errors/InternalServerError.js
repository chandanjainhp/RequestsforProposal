import { AppError } from './AppError.js';
import { ERROR_CODES } from './errorCodes.js';

/**
 * Internal Server Error - 500 Internal Server Error
 * 
 * Used for unexpected server errors.
 * Never exposes sensitive details in production.
 * 
 * @class InternalServerError
 * @extends AppError
 * 
 * @example
 * throw new InternalServerError('Database connection failed', requestId);
 * throw new InternalServerError('Unexpected error occurred', requestId, originalError);
 */
export class InternalServerError extends AppError {
  /**
   * Creates an InternalServerError
   * 
   * @param {string} message - User-friendly error message (never expose sensitive info)
   * @param {string} requestId - Request ID for tracking (optional)
   * @param {Error} originalError - Original error for logging (optional, never exposed)
   */
  constructor(message = 'Internal server error', requestId = null, originalError = null) {
    super(500, message, ERROR_CODES.INTERNAL_ERROR);
    this.name = 'InternalServerError';
    this.requestId = requestId;
    this.originalError = originalError; // Store for logging, never expose in response
    
    // Never include original error details in response
    // This is only for internal logging
  }

  /**
   * Get detailed message for logging (includes original error if present)
   * Never expose this in API responses
   * 
   * @returns {string} Detailed error message for logs
   */
  getLogMessage() {
    let logMessage = super.getLogMessage();
    
    if (this.requestId) {
      logMessage += ` [Request ID: ${this.requestId}]`;
    }
    
    if (this.originalError) {
      logMessage += ` [Original: ${this.originalError.message}]`;
    }
    
    return logMessage;
  }
}

