/**
 * Request Validation Middleware
 * 
 * Validates request body, params, or query against Joi schemas.
 * Automatically formats validation errors and throws ValidationError.
 */

import { ValidationError } from '../errors/ValidationError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sanitizeRequestBody } from '../utils/sanitizers.js';

/**
 * Validate request data against a Joi schema
 * 
 * @param {string} source - Source of data to validate ('body', 'params', 'query')
 * @param {Object} schema - Joi schema to validate against
 * @param {Object} options - Validation options
 * @returns {Function} Express middleware function
 * 
 * @example
 * router.post('/api/auth/register',
 *   validateRequest('body', REGISTRATION_SCHEMA),
 *   authController.register
 * );
 */
export const validateRequest = (source, schema, options = {}) => {
  return asyncHandler(async (req, res, next) => {
    // Get data from specified source
    const data = req[source];

    // Set default Joi options
    const joiOptions = {
      abortEarly: false, // Return all errors, not just first
      stripUnknown: true, // Remove unknown fields
      convert: true, // Type coercion
      ...options.joiOptions
    };

    // Validate data (use validateAsync for async custom validators)
    const { error, value } = await schema.validateAsync(data, joiOptions);

    if (error) {
      // Format Joi errors to field-level error details
      const details = {};
      
      error.details.forEach((detail) => {
        const path = detail.path.join('.');
        const message = detail.message.replace(/"/g, '');
        
        // If multiple errors for same field, combine them
        if (details[path]) {
          details[path] = `${details[path]}; ${message}`;
        } else {
          details[path] = message;
        }
      });

      throw new ValidationError('Validation failed', details);
    }

    // Sanitize the validated data (XSS prevention)
    const sanitized = sanitizeRequestBody(value, options.sanitizeSchema || {});

    // Replace request data with validated and sanitized data
    req[source] = sanitized;
    
    // Also store in req.validated for convenience
    if (!req.validated) {
      req.validated = {};
    }
    req.validated[source] = sanitized;

    next();
  });
};

/**
 * Validate request body
 * Shorthand for validateRequest('body', schema)
 * 
 * @param {Object} schema - Joi schema
 * @param {Object} options - Validation options
 * @returns {Function} Express middleware
 */
export const validateBody = (schema, options = {}) => {
  return validateRequest('body', schema, options);
};

/**
 * Validate request parameters
 * Shorthand for validateRequest('params', schema)
 * 
 * @param {Object} schema - Joi schema
 * @param {Object} options - Validation options
 * @returns {Function} Express middleware
 */
export const validateParams = (schema, options = {}) => {
  return validateRequest('params', schema, options);
};

/**
 * Validate request query string
 * Shorthand for validateRequest('query', schema)
 * 
 * @param {Object} schema - Joi schema
 * @param {Object} options - Validation options
 * @returns {Function} Express middleware
 */
export const validateQuery = (schema, options = {}) => {
  return validateRequest('query', schema, options);
};

/**
 * Validate multiple sources at once
 * 
 * @param {Object} schemas - Object with source: schema pairs
 * @param {Object} options - Validation options
 * @returns {Function} Express middleware
 * 
 * @example
 * validateMultiple({
 *   body: REGISTRATION_SCHEMA,
 *   params: OBJECT_ID_PARAM_SCHEMA
 * })
 */
export const validateMultiple = (schemas, options = {}) => {
  return asyncHandler(async (req, res, next) => {
    const errors = {};
    let hasErrors = false;

    // Validate each source
    for (const [source, schema] of Object.entries(schemas)) {
      const data = req[source];
      
      const joiOptions = {
        abortEarly: false,
        stripUnknown: true,
        convert: true,
        ...options.joiOptions
      };

      const { error, value } = await schema.validateAsync(data, joiOptions);

      if (error) {
        hasErrors = true;
        error.details.forEach((detail) => {
          const path = `${source}.${detail.path.join('.')}`;
          const message = detail.message.replace(/"/g, '');
          
          if (errors[path]) {
            errors[path] = `${errors[path]}; ${message}`;
          } else {
            errors[path] = message;
          }
        });
      } else {
        // Sanitize and store validated data
        const sanitized = sanitizeRequestBody(value, options.sanitizeSchema || {});
        req[source] = sanitized;
        
        if (!req.validated) {
          req.validated = {};
        }
        req.validated[source] = sanitized;
      }
    }

    if (hasErrors) {
      throw new ValidationError('Validation failed', errors);
    }

    next();
  });
};

export default {
  validateRequest,
  validateBody,
  validateParams,
  validateQuery,
  validateMultiple
};

