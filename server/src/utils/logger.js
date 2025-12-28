import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Sanitize sensitive data from objects
 * Removes passwords, tokens, API keys, etc.
 */
const sanitize = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const sensitiveKeys = [
    'password',
    'password_hash',
    'passwordHash',
    'token',
    'access_token',
    'refresh_token',
    'api_key',
    'apiKey',
    'secret',
    'auth',
    'authorization',
    'credit_card',
    'creditCard',
    'ssn',
    'social_security'
  ];

  const sanitized = Array.isArray(obj) ? [...obj] : { ...obj };

  for (const key in sanitized) {
    const lowerKey = key.toLowerCase();
    
    // Check if key contains sensitive keywords
    if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      // Recursively sanitize nested objects
      sanitized[key] = sanitize(sanitized[key]);
    }
  }

  return sanitized;
};

/**
 * Custom format for console output (development)
 */
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    
    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(sanitize(meta))}`;
    }
    
    return log;
  })
);

/**
 * Custom format for file output (production)
 * JSON structured logging
 */
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

/**
 * Create Winston logger instance
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  format: fileFormat,
  defaultMeta: {
    service: 'rfp-management-api',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: []
});

// Console transport (development only, or always with filtered level)
if (isDevelopment) {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
    level: 'debug'
  }));
} else {
  // In production, only log errors and warnings to console
  logger.add(new winston.transports.Console({
    format: winston.format.json(),
    level: 'warn'
  }));
}

// File transports (production)
if (isProduction || process.env.ENABLE_FILE_LOGGING === 'true') {
  // Error log file (daily rotation)
  logger.add(new DailyRotateFile({
    filename: path.join(logsDir, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxSize: '20m',
    maxFiles: '30d', // Keep 30 days of error logs
    format: fileFormat
  }));

  // Combined log file (all levels, daily rotation)
  logger.add(new DailyRotateFile({
    filename: path.join(logsDir, 'combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '30d', // Keep 30 days of logs
    format: fileFormat
  }));
}

/**
 * Logger utility with enhanced methods
 */
const enhancedLogger = {
  /**
   * Log info message
   * 
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata (will be sanitized)
   */
  info: (message, meta = {}) => {
    logger.info(message, sanitize(meta));
  },

  /**
   * Log warning message
   * 
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata (will be sanitized)
   */
  warn: (message, meta = {}) => {
    logger.warn(message, sanitize(meta));
  },

  /**
   * Log error message
   * 
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata (will be sanitized)
   */
  error: (message, meta = {}) => {
    logger.error(message, sanitize(meta));
  },

  /**
   * Log debug message (development only)
   * 
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata (will be sanitized)
   */
  debug: (message, meta = {}) => {
    logger.debug(message, sanitize(meta));
  },

  /**
   * Log HTTP request
   * 
   * @param {Object} req - Express request object
   * @param {number} statusCode - HTTP status code
   * @param {number} responseTime - Response time in ms
   */
  http: (req, statusCode, responseTime) => {
    const logData = {
      method: req.method,
      url: req.url,
      statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('user-agent'),
      ip: req.ip || req.connection.remoteAddress
    };

    if (req.user) {
      logData.userId = req.user.userId || req.user._id;
    }

    if (statusCode >= 500) {
      logger.error(`HTTP ${statusCode}`, logData);
    } else if (statusCode >= 400) {
      logger.warn(`HTTP ${statusCode}`, logData);
    } else {
      logger.info(`HTTP ${statusCode}`, logData);
    }
  },

  /**
   * Log error with full context
   * 
   * @param {Error} error - Error object
   * @param {Object} req - Express request object (optional)
   * @param {string} requestId - Request ID (optional)
   */
  logError: (error, req = null, requestId = null) => {
    const logData = {
      error: {
        name: error.name,
        message: error.message,
        code: error.code || 'UNKNOWN_ERROR',
        stack: isDevelopment ? error.stack : undefined
      },
      requestId
    };

    if (req) {
      logData.request = {
        method: req.method,
        url: req.url,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent')
      };

      // Include sanitized request body (no passwords/tokens)
      if (req.body && Object.keys(req.body).length > 0) {
        logData.request.body = sanitize(req.body);
      }

      if (req.user) {
        logData.request.userId = req.user.userId || req.user._id;
      }
    }

    // Include original error if present (InternalServerError)
    if (error.originalError) {
      logData.originalError = {
        name: error.originalError.name,
        message: error.originalError.message
      };
      if (isDevelopment) {
        logData.originalError.stack = error.originalError.stack;
      }
    }

    logger.error(error.getLogMessage ? error.getLogMessage() : error.message, sanitize(logData));
  }
};

export default enhancedLogger;
