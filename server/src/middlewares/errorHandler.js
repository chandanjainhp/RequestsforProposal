import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../errors/AppError.js';
import { ValidationError } from '../errors/ValidationError.js';
import { AuthenticationError } from '../errors/AuthenticationError.js';
import { AuthorizationError } from '../errors/AuthorizationError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { ConflictError } from '../errors/ConflictError.js';
import { RateLimitError } from '../errors/RateLimitError.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { 
  TokenExpiredError, 
  InvalidTokenError, 
  MalformedTokenError 
} from '../utils/tokenUtils.js';
import { ERROR_CODES } from '../errors/errorCodes.js';
import logger from '../utils/logger.js';

/**
 * Generate or retrieve request ID from request
 * 
 * @param {Object} req - Express request object
 * @returns {string} Request ID
 */
const getRequestId = (req) => {
  if (!req.id) {
    req.id = uuidv4();
  }
  return req.id;
};

/**
 * Global Error Handler Middleware
 * 
 * This middleware catches all errors (sync and async) and:
 * 1. Determines error type (custom vs native)
 * 2. Converts native errors to custom AppError instances
 * 3. Logs errors with context
 * 4. Formats error response based on environment
 * 5. Sets appropriate HTTP status code
 * 
 * Must be the last middleware in the Express app.
 * 
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const errorHandler = (err, req, res, next) => {
  const requestId = getRequestId(req);
  const isDevelopment = process.env.NODE_ENV === 'development';
  let error = err;

  // If error is not an AppError instance, convert it
  if (!(error instanceof AppError)) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError' && error.errors) {
      // Mongoose schema validation error
      const details = {};
      for (const field in error.errors) {
        details[field] = error.errors[field].message;
      }
      error = new ValidationError('Validation failed', details);
    }
    // Handle Mongoose cast errors (invalid ObjectId, etc.)
    else if (error.name === 'CastError') {
      error = new ValidationError(`Invalid ${error.path}: ${error.value}`, {
        [error.path]: `Invalid format`
      });
    }
    // Handle MongoDB duplicate key errors
    else if (error.name === 'MongoServerError' && error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];
      error = new ConflictError(`${field} already exists`, field);
    }
    // Handle JWT errors from jsonwebtoken
    else if (error.name === 'JsonWebTokenError') {
      if (error.message.includes('invalid signature')) {
        error = new AuthenticationError('Invalid token signature', ERROR_CODES.TOKEN_INVALID);
      } else if (error.message.includes('jwt malformed')) {
        error = new AuthenticationError('Malformed token', ERROR_CODES.MALFORMED_TOKEN);
      } else {
        error = new AuthenticationError('Invalid token', ERROR_CODES.TOKEN_INVALID);
      }
    }
    // Handle JWT token expired errors
    else if (error.name === 'TokenExpiredError') {
      error = new AuthenticationError('Token expired', ERROR_CODES.TOKEN_EXPIRED);
    }
    // Handle custom token errors from tokenUtils
    else if (error instanceof TokenExpiredError) {
      error = new AuthenticationError(error.message, ERROR_CODES.TOKEN_EXPIRED);
    }
    else if (error instanceof InvalidTokenError) {
      error = new AuthenticationError(error.message, ERROR_CODES.TOKEN_INVALID);
    }
    else if (error instanceof MalformedTokenError) {
      error = new ValidationError(error.message, { token: 'Malformed format' });
    }
    // Handle SyntaxError (JSON parse errors)
    else if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
      error = new ValidationError('Invalid JSON in request body', {
        body: 'JSON parse error'
      });
    }
    // Handle network/database connection errors
    else if (error.name === 'MongoNetworkError' || error.name === 'MongooseServerSelectionError') {
      error = new InternalServerError('Database connection failed', requestId, error);
    }
    // Handle other unexpected errors
    else {
      // Log the original error for debugging
      logger.error('Unhandled error:', {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        },
        requestId,
        url: req.url,
        method: req.method
      });

      // Convert to InternalServerError (never expose original error details)
      error = new InternalServerError(
        'An unexpected error occurred',
        requestId,
        error
      );
    }
  }

  // Ensure error has requestId if it's an InternalServerError
  if (error instanceof InternalServerError && !error.requestId) {
    error.requestId = requestId;
  }

  // Log error with full context
  if (error.statusCode >= 500) {
    // Server errors - log with full details
    logger.logError(error, req, requestId);
  } else if (error.statusCode >= 400) {
    // Client errors - log with context (warnings)
    logger.logError(error, req, requestId);
  }

  // Format error response using error's toJSON method
  const errorResponse = error.toJSON(isDevelopment, requestId);

  // Set retry-after header for rate limit errors
  if (error instanceof RateLimitError && error.retryAfter) {
    res.set('Retry-After', error.retryAfter.toString());
  }

  // Send error response
  res.status(error.statusCode).json(errorResponse);
};

/**
 * 404 Not Found Handler
 * 
 * Handles requests to non-existent routes.
 * Must be placed after all routes but before error handler.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const notFoundHandler = (req, res, next) => {
  const requestId = getRequestId(req);
  const error = new NotFoundError(
    `Route not found: ${req.method} ${req.path}`,
    'Route',
    req.path
  );
  
  logger.warn(`404 Not Found: ${req.method} ${req.path}`, {
    requestId,
    method: req.method,
    path: req.path
  });
  
  next(error);
};

export default errorHandler;
