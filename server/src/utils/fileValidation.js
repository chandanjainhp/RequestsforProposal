/**
 * File Upload Validation Utilities
 * 
 * Functions to validate file uploads, check file types, sizes, and sanitize filenames.
 */

import { isValidFileType, isValidFileSize, sanitizeFilename } from './sanitizers.js';
import { ValidationError } from '../errors/ValidationError.js';

/**
 * Allowed MIME types for file uploads
 */
export const ALLOWED_MIME_TYPES = [
  'application/pdf', // PDF
  'application/msword', // DOC
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  'application/vnd.ms-excel', // XLS
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
  'text/plain', // TXT
  'image/png', // PNG
  'image/jpeg', // JPEG
  'image/jpg' // JPG
];

/**
 * Allowed file extensions
 */
export const ALLOWED_EXTENSIONS = [
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.txt',
  '.png',
  '.jpg',
  '.jpeg'
];

/**
 * Maximum file size (10MB in bytes)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Maximum files per request
 */
export const MAX_FILES_PER_REQUEST = 5;

/**
 * Maximum attachments per RFP
 */
export const MAX_ATTACHMENTS_PER_RFP = 10;

/**
 * MIME type to extension mapping
 */
const MIME_TO_EXTENSION = {
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'text/plain': '.txt',
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg'
};

/**
 * Validate single file
 * 
 * @param {Object} file - File object with properties: filename, size, mimetype
 * @returns {Object} { valid: boolean, error?: string, sanitizedFilename?: string }
 */
export const validateFile = (file) => {
  if (!file) {
    return { valid: false, error: 'File is required' };
  }

  const { filename, size, mimetype } = file;

  // Validate file size
  if (!isValidFileSize(size, MAX_FILE_SIZE)) {
    return { 
      valid: false, 
      error: `File size must not exceed ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
    };
  }

  // Validate MIME type
  if (!isValidFileType(mimetype, ALLOWED_MIME_TYPES)) {
    return { 
      valid: false, 
      error: `File type not allowed. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}` 
    };
  }

  // Sanitize filename
  const extension = MIME_TO_EXTENSION[mimetype] || '';
  const sanitizedFilename = sanitizeFilename(filename, extension);

  return {
    valid: true,
    sanitizedFilename,
    extension,
    mimetype
  };
};

/**
 * Validate multiple files
 * 
 * @param {Array} files - Array of file objects
 * @param {Object} options - Options { maxFiles: number }
 * @returns {Object} { valid: boolean, errors?: Array, sanitizedFiles?: Array }
 */
export const validateFiles = (files, options = {}) => {
  const maxFiles = options.maxFiles || MAX_FILES_PER_REQUEST;

  if (!Array.isArray(files)) {
    return { valid: false, errors: ['Files must be an array'] };
  }

  if (files.length === 0) {
    return { valid: false, errors: ['At least one file is required'] };
  }

  if (files.length > maxFiles) {
    return { 
      valid: false, 
      errors: [`Maximum ${maxFiles} files allowed per request`] 
    };
  }

  const errors = [];
  const sanitizedFiles = [];

  files.forEach((file, index) => {
    const validation = validateFile(file);
    
    if (!validation.valid) {
      errors.push(`File ${index + 1}: ${validation.error}`);
    } else {
      sanitizedFiles.push({
        ...file,
        filename: validation.sanitizedFilename,
        extension: validation.extension,
        mimetype: validation.mimetype
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    sanitizedFiles
  };
};

/**
 * Validate file from Multer upload
 * 
 * @param {Object} multerFile - Multer file object
 * @returns {Object} Validation result
 */
export const validateMulterFile = (multerFile) => {
  if (!multerFile) {
    return { valid: false, error: 'File is required' };
  }

  const file = {
    filename: multerFile.originalname,
    size: multerFile.size,
    mimetype: multerFile.mimetype
  };

  return validateFile(file);
};

/**
 * Validate file upload middleware
 * Validates files from req.files (Multer) or req.file
 * 
 * @param {Object} options - Options { maxFiles: number, maxSize: number }
 * @returns {Function} Express middleware
 */
export const validateFileUpload = (options = {}) => {
  return (req, res, next) => {
    try {
      const files = req.files || (req.file ? [req.file] : []);
      const maxFiles = options.maxFiles || MAX_FILES_PER_REQUEST;

      if (files.length === 0) {
        throw new ValidationError('File upload required', {
          files: 'At least one file is required'
        });
      }

      if (files.length > maxFiles) {
        throw new ValidationError('Too many files', {
          files: `Maximum ${maxFiles} files allowed`
        });
      }

      const errors = {};
      
      files.forEach((file, index) => {
        const validation = validateFile({
          filename: file.originalname || file.filename,
          size: file.size,
          mimetype: file.mimetype
        });

        if (!validation.valid) {
          errors[`file_${index + 1}`] = validation.error;
        } else {
          // Update filename to sanitized version
          file.filename = validation.sanitizedFilename;
          file.extension = validation.extension;
        }
      });

      if (Object.keys(errors).length > 0) {
        throw new ValidationError('File validation failed', errors);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Get file extension from filename
 * 
 * @param {string} filename - Filename
 * @returns {string} File extension (with dot)
 */
export const getFileExtension = (filename) => {
  if (!filename || typeof filename !== 'string') {
    return '';
  }

  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) {
    return '';
  }

  return filename.substring(lastDot).toLowerCase();
};

/**
 * Get MIME type from filename
 * 
 * @param {string} filename - Filename
 * @returns {string|null} MIME type or null if unknown
 */
export const getMimeTypeFromFilename = (filename) => {
  const extension = getFileExtension(filename);
  
  const extensionToMime = {
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.txt': 'text/plain',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg'
  };

  return extensionToMime[extension] || null;
};

export default {
  validateFile,
  validateFiles,
  validateMulterFile,
  validateFileUpload,
  getFileExtension,
  getMimeTypeFromFilename,
  ALLOWED_MIME_TYPES,
  ALLOWED_EXTENSIONS,
  MAX_FILE_SIZE,
  MAX_FILES_PER_REQUEST,
  MAX_ATTACHMENTS_PER_RFP
};

