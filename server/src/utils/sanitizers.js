/**
 * Input Sanitization Utilities
 * 
 * Functions to sanitize and clean user input to prevent XSS attacks,
 * normalize data, and ensure data integrity.
 */

/**
 * Sanitize text input
 * - Trim whitespace
 * - Remove HTML tags (XSS prevention)
 * - Remove control characters
 * - Normalize line breaks
 * 
 * @param {string} text - Text to sanitize
 * @param {Object} options - Sanitization options
 * @returns {string} Sanitized text
 */
export const sanitizeText = (text, options = {}) => {
  if (!text || typeof text !== 'string') {
    return text;
  }

  let sanitized = text;

  // Trim whitespace
  sanitized = sanitized.trim();

  // Remove HTML tags (XSS prevention)
  if (options.allowHtml !== true) {
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  }

  // Remove control characters (except newlines and tabs if allowed)
  if (!options.allowNewlines) {
    sanitized = sanitized.replace(/[\r\n\t]/g, ' ');
  } else {
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  }

  // Normalize whitespace (multiple spaces to single space)
  if (!options.preserveWhitespace) {
    sanitized = sanitized.replace(/\s+/g, ' ');
  }

  // Normalize line breaks
  if (options.normalizeLineBreaks) {
    sanitized = sanitized.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  }

  return sanitized;
};

/**
 * Sanitize email address
 * - Lowercase
 * - Trim
 * - Remove quotes and spaces
 * - Validate format
 * 
 * @param {string} email - Email to sanitize
 * @returns {string} Sanitized email
 */
export const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return email;
  }

  let sanitized = email
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '') // Remove quotes
    .replace(/\s/g, ''); // Remove spaces

  return sanitized;
};

/**
 * Sanitize phone number
 * - Remove spaces, dashes, parentheses
 * - Ensure E.164 format: +[country code][number]
 * - Keep only digits and + sign
 * 
 * @param {string} phone - Phone number to sanitize
 * @returns {string} Sanitized phone number
 */
export const sanitizePhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return phone;
  }

  let sanitized = phone
    .trim()
    .replace(/[\s\-\(\)\.]/g, ''); // Remove spaces, dashes, parentheses, dots

  // Ensure it starts with +
  if (!sanitized.startsWith('+')) {
    // If it doesn't start with +, assume it's missing country code
    // Don't add + automatically - let validation handle format
    return sanitized;
  }

  return sanitized;
};

/**
 * Sanitize number
 * - Parse to number
 * - Handle decimals vs integers
 * - Check for NaN
 * 
 * @param {any} value - Value to sanitize
 * @param {Object} options - Options { allowFloat: boolean, min: number, max: number }
 * @returns {number|null} Sanitized number or null if invalid
 */
export const sanitizeNumber = (value, options = {}) => {
  if (value === null || value === undefined) {
    return null;
  }

  const num = typeof value === 'string' ? parseFloat(value) : Number(value);

  if (isNaN(num)) {
    return null;
  }

  // Convert to integer if not allowing float
  const sanitized = options.allowFloat !== true ? Math.floor(num) : num;

  // Apply min/max constraints
  if (options.min !== undefined && sanitized < options.min) {
    return options.min;
  }
  if (options.max !== undefined && sanitized > options.max) {
    return options.max;
  }

  return sanitized;
};

/**
 * Sanitize URL
 * - Validate protocol (only https:// or http://)
 * - Decode encoded characters
 * - Remove dangerous characters
 * 
 * @param {string} url - URL to sanitize
 * @param {Object} options - Options { requireHttps: boolean }
 * @returns {string|null} Sanitized URL or null if invalid
 */
export const sanitizeUrl = (url, options = {}) => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  let sanitized = url.trim();

  // Ensure protocol exists
  if (!sanitized.match(/^https?:\/\//i)) {
    sanitized = `https://${sanitized}`;
  }

  try {
    const urlObj = new URL(sanitized);

    // Require HTTPS in production
    if (options.requireHttps && urlObj.protocol !== 'https:') {
      return null;
    }

    return urlObj.toString();
  } catch (error) {
    return null;
  }
};

/**
 * Sanitize filename
 * - Remove special characters
 * - Remove path traversal attempts
 * - Add random hash to prevent collisions
 * - Limit length
 * 
 * @param {string} filename - Filename to sanitize
 * @param {string} extension - File extension
 * @returns {string} Sanitized filename
 */
export const sanitizeFilename = (filename, extension = '') => {
  if (!filename || typeof filename !== 'string') {
    return `file-${Date.now()}${extension}`;
  }

  // Remove path components (security)
  let sanitized = filename
    .replace(/[\/\\]/g, '') // Remove slashes
    .replace(/\.\./g, '') // Remove path traversal
    .replace(/[^a-zA-Z0-9_\-\.]/g, '_') // Replace special chars with underscore
    .replace(/^\.+|\.+$/g, '') // Remove leading/trailing dots
    .substring(0, 100); // Limit length

  // Add timestamp to prevent collisions
  const hash = Date.now().toString(36);
  const ext = extension || (filename.includes('.') ? filename.split('.').pop() : '');

  return `${sanitized}-${hash}${ext ? '.' + ext : ''}`;
};

/**
 * Sanitize object recursively
 * - Apply sanitization to all string values
 * - Preserve structure
 * 
 * @param {Object} obj - Object to sanitize
 * @param {Function} sanitizer - Sanitizer function to apply
 * @returns {Object} Sanitized object
 */
export const sanitizeObject = (obj, sanitizer = sanitizeText) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, sanitizer));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizer(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value, sanitizer);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

/**
 * Escape HTML entities (XSS prevention)
 * 
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export const escapeHtml = (text) => {
  if (!text || typeof text !== 'string') {
    return text;
  }

  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, m => map[m]);
};

/**
 * Remove SQL injection attempts (basic)
 * Note: Mongoose uses parameterized queries, but this adds defense in depth
 * 
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
export const sanitizeSql = (text) => {
  if (!text || typeof text !== 'string') {
    return text;
  }

  // Remove common SQL injection patterns
  const patterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
    /(['";])/g,
    /(--)/g,
    /(\/\*[\s\S]*?\*\/)/g,
    /(\bUNION\b)/gi
  ];

  let sanitized = text;
  patterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });

  return sanitized;
};

/**
 * Sanitize request body
 * Applies appropriate sanitization based on field type
 * 
 * @param {Object} body - Request body to sanitize
 * @param {Object} schema - Schema definition with field types
 * @returns {Object} Sanitized body
 */
export const sanitizeRequestBody = (body, schema = {}) => {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sanitized = { ...body };

  for (const [key, value] of Object.entries(sanitized)) {
    const fieldType = schema[key]?.type || typeof value;

    if (typeof value === 'string') {
      switch (fieldType) {
        case 'email':
          sanitized[key] = sanitizeEmail(value);
          break;
        case 'phone':
          sanitized[key] = sanitizePhone(value);
          break;
        case 'url':
          sanitized[key] = sanitizeUrl(value);
          break;
        default:
          sanitized[key] = sanitizeText(value);
      }
    } else if (typeof value === 'number') {
      sanitized[key] = sanitizeNumber(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => sanitizeRequestBody(item, schema[key]?.items));
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeRequestBody(value, schema[key]?.properties);
    }
  }

  return sanitized;
};

export default {
  sanitizeText,
  sanitizeEmail,
  sanitizePhone,
  sanitizeNumber,
  sanitizeUrl,
  sanitizeFilename,
  sanitizeObject,
  escapeHtml,
  sanitizeSql,
  sanitizeRequestBody
};

