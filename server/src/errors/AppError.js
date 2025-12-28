/**
 * Base Error Class (AppError)
 * 
 * This is the base class for all custom application errors.
 * Should never be thrown directly - use specific error subclasses instead.
 * 
 * @class AppError
 * @extends Error
 */
export class AppError extends Error {
  /**
   * Creates an instance of AppError
   * 
   * @param {number} statusCode - HTTP status code (400, 401, 404, etc.)
   * @param {string} message - User-friendly error message
   * @param {string} code - Error code enum (e.g., 'VALIDATION_ERROR', 'NOT_FOUND')
   * @param {Object} details - Optional details object for field-level errors or additional context
   */
  constructor(statusCode, message, code = 'APP_ERROR', details = null) {
    super(message);
    
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true; // Mark as operational error (vs programming error)
    this.timestamp = new Date().toISOString();
    
    // Capture stack trace, excluding constructor call
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Convert error to JSON format for API responses
   * 
   * @param {boolean} includeStack - Whether to include stack trace (dev only)
   * @param {string} requestId - Request ID for tracing
   * @returns {Object} JSON representation of error
   */
  toJSON(includeStack = false, requestId = null) {
    const errorResponse = {
      ok: false,
      error: {
        code: this.code,
        message: this.message,
        timestamp: this.timestamp
      }
    };

    // Add request ID if provided
    if (requestId) {
      errorResponse.error.request_id = requestId;
    }

    // Add details if present
    if (this.details) {
      errorResponse.error.details = this.details;
    }

    // Add stack trace only in development
    if (includeStack && this.stack) {
      errorResponse.error.stack = this.stack;
    }

    return errorResponse;
  }

  /**
   * Get error message for logging
   * 
   * @returns {string} Error message with context
   */
  getLogMessage() {
    return `[${this.code}] ${this.message}`;
  }
}

