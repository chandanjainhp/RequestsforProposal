import { AppError } from './AppError.js';
import { ERROR_CODES } from './errorCodes.js';

/**
 * Rate Limit Error - 429 Too Many Requests
 * 
 * Used when rate limiting is triggered.
 * Includes retry-after time for client.
 * 
 * @class RateLimitError
 * @extends AppError
 * 
 * @example
 * throw new RateLimitError('Too many requests', 60); // 60 seconds
 * throw new RateLimitError('Account locked', 900, ERROR_CODES.ACCOUNT_LOCKED);
 */
export class RateLimitError extends AppError {
  /**
   * Creates a RateLimitError
   * 
   * @param {string} message - Error message
   * @param {number} retryAfter - Seconds to wait before retrying
   * @param {string} code - Error code (defaults to RATE_LIMITED)
   */
  constructor(message = 'Too many requests', retryAfter = 60, code = ERROR_CODES.RATE_LIMITED) {
    super(429, message, code);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
    
    // Include retry-after in details
    this.details = {
      retry_after: retryAfter,
      retry_after_seconds: retryAfter
    };
  }

  /**
   * Override toJSON to include retry-after header info
   */
  toJSON(includeStack = false, requestId = null) {
    const json = super.toJSON(includeStack, requestId);
    // Retry-after is already in details, but we keep it here for clarity
    return json;
  }
}

