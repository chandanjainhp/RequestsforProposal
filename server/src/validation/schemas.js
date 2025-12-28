/**
 * Joi Validation Schemas
 * 
 * All validation schemas for request validation.
 * Uses Joi for schema validation with custom rules for async validation.
 */

import Joi from 'joi';
import { 
  isEmailUnique, 
  isVendorEmailUnique,
  validatePasswordStrength,
  isValidE164Phone,
  isValidCurrency,
  isValidObjectId,
  isValidObjectIdArray
} from './customRules.js';

// Common validators
const emailValidator = Joi.string()
  .email({ tlds: { allow: false } })
  .lowercase()
  .trim()
  .max(100)
  .messages({
    'string.email': 'Email must be a valid email address',
    'string.max': 'Email must not exceed 100 characters',
    'any.required': 'Email is required'
  });

const phoneValidator = Joi.string()
  .custom((value, helpers) => {
    if (!value) return value; // Optional field
    if (!isValidE164Phone(value)) {
      return helpers.message('Phone must be in E.164 format (e.g., +1234567890)');
    }
    return value;
  })
  .messages({
    'string.base': 'Phone must be a string'
  });

const passwordValidator = Joi.string()
  .min(8)
  .custom((value, helpers) => {
    const validation = validatePasswordStrength(value);
    if (!validation.valid) {
      return helpers.message(validation.errors.join('; '));
    }
    return value;
  })
  .messages({
    'string.min': 'Password must be at least 8 characters long',
    'any.required': 'Password is required'
  });

const objectIdValidator = Joi.string()
  .custom((value, helpers) => {
    if (!isValidObjectId(value)) {
      return helpers.message('Invalid ID format');
    }
    return value;
  });

const objectIdArrayValidator = Joi.array()
  .items(objectIdValidator)
  .messages({
    'array.base': 'Must be an array',
    'array.includesRequiredUnknowns': 'All IDs must be valid'
  });

const currencyValidator = Joi.string()
  .valid('USD', 'EUR', 'INR', 'GBP', 'CAD', 'AUD')
  .uppercase()
  .messages({
    'any.only': 'Currency must be one of: USD, EUR, INR, GBP, CAD, AUD'
  });

// ============================================
// AUTHENTICATION SCHEMAS
// ============================================

/**
 * Registration Schema
 */
export const REGISTRATION_SCHEMA = Joi.object({
  email: emailValidator.required(),
  password: passwordValidator.required(),
  confirm_password: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords must match',
      'any.required': 'Password confirmation is required'
    }),
  name: Joi.string()
    .min(2)
    .max(100)
    .trim()
    .required()
    .messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must not exceed 100 characters',
      'any.required': 'Name is required'
    }),
  company: Joi.string()
    .min(3)
    .max(100)
    .trim()
    .optional()
    .messages({
      'string.min': 'Company name must be at least 3 characters',
      'string.max': 'Company name must not exceed 100 characters'
    }),
  phone: phoneValidator.optional(),
  accept_terms: Joi.boolean()
    .valid(true)
    .required()
    .messages({
      'any.only': 'You must accept the terms and conditions',
      'any.required': 'Terms acceptance is required'
    })
}).custom(async (value, helpers) => {
  // Check email uniqueness
  const isUnique = await isEmailUnique(value.email);
  if (!isUnique) {
    return helpers.message('Email is already registered');
  }
  return value;
});

/**
 * Login Schema
 */
export const LOGIN_SCHEMA = Joi.object({
  email: emailValidator.required(),
  password: Joi.string()
    .min(1)
    .required()
    .messages({
      'string.min': 'Password is required',
      'any.required': 'Password is required'
    }),
  remember_me: Joi.boolean().optional()
});

/**
 * Forgot Password Schema
 */
export const FORGOT_PASSWORD_SCHEMA = Joi.object({
  email: emailValidator.required()
});

/**
 * Reset Password Schema
 */
export const RESET_PASSWORD_SCHEMA = Joi.object({
  token: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.min': 'Reset token is invalid',
      'any.required': 'Reset token is required'
    }),
  new_password: passwordValidator.required(),
  confirm_password: Joi.string()
    .valid(Joi.ref('new_password'))
    .required()
    .messages({
      'any.only': 'Passwords must match',
      'any.required': 'Password confirmation is required'
    })
});

/**
 * Change Password Schema
 */
export const CHANGE_PASSWORD_SCHEMA = Joi.object({
  old_password: Joi.string()
    .min(1)
    .required()
    .messages({
      'string.min': 'Current password is required',
      'any.required': 'Current password is required'
    }),
  new_password: passwordValidator.required(),
  confirm_password: Joi.string()
    .valid(Joi.ref('new_password'))
    .required()
    .messages({
      'any.only': 'Passwords must match',
      'any.required': 'Password confirmation is required'
    })
});

/**
 * Update Profile Schema
 */
export const UPDATE_PROFILE_SCHEMA = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .trim()
    .optional()
    .messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must not exceed 100 characters'
    }),
  company: Joi.string()
    .min(3)
    .max(100)
    .trim()
    .allow(null, '')
    .optional()
    .messages({
      'string.min': 'Company name must be at least 3 characters',
      'string.max': 'Company name must not exceed 100 characters'
    }),
  phone: phoneValidator.allow(null, '').optional()
});

// ============================================
// RFP SCHEMAS
// ============================================

/**
 * Line Item Schema (nested)
 */
const LINE_ITEM_SCHEMA = Joi.object({
  name: Joi.string()
    .max(200)
    .trim()
    .required()
    .messages({
      'string.max': 'Line item name must not exceed 200 characters',
      'any.required': 'Line item name is required'
    }),
  quantity: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be an integer',
      'number.positive': 'Quantity must be positive',
      'any.required': 'Quantity is required'
    }),
  unit_price: Joi.number()
    .positive()
    .optional()
    .messages({
      'number.base': 'Unit price must be a number',
      'number.positive': 'Unit price must be positive'
    }),
  specs: Joi.any().optional()
});

/**
 * Create RFP Schema
 */
export const CREATE_RFP_SCHEMA = Joi.object({
  title: Joi.string()
    .min(3)
    .max(200)
    .trim()
    .required()
    .messages({
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title must not exceed 200 characters',
      'any.required': 'Title is required'
    }),
  description: Joi.string()
    .max(2000)
    .trim()
    .optional()
    .allow('')
    .messages({
      'string.max': 'Description must not exceed 2000 characters'
    }),
  summary: Joi.string()
    .max(500)
    .trim()
    .optional()
    .allow(''),
  budget: Joi.number()
    .positive()
    .min(100)
    .required()
    .messages({
      'number.base': 'Budget must be a number',
      'number.positive': 'Budget must be positive',
      'number.min': 'Budget must be at least 100',
      'any.required': 'Budget is required'
    }),
  currency: currencyValidator.required(),
  delivery_days: Joi.number()
    .integer()
    .positive()
    .max(365)
    .required()
    .messages({
      'number.base': 'Delivery days must be a number',
      'number.integer': 'Delivery days must be an integer',
      'number.positive': 'Delivery days must be positive',
      'number.max': 'Delivery days must not exceed 365',
      'any.required': 'Delivery days is required'
    }),
  delivery_date: Joi.date().optional(),
  delivery_by: Joi.date().optional(),
  payment_terms: Joi.string()
    .max(100)
    .trim()
    .optional()
    .allow(''),
  warranty_months: Joi.number()
    .integer()
    .min(0)
    .optional(),
  warranty: Joi.string()
    .max(500)
    .trim()
    .optional()
    .allow(''),
  line_items: Joi.array()
    .items(LINE_ITEM_SCHEMA)
    .min(1)
    .max(50)
    .required()
    .messages({
      'array.base': 'Line items must be an array',
      'array.min': 'At least one line item is required',
      'array.max': 'Maximum 50 line items allowed',
      'any.required': 'Line items are required'
    }),
  vendor_ids: objectIdArrayValidator.optional(),
  notes: Joi.string()
    .max(1000)
    .trim()
    .optional()
    .allow('')
}).custom(async (value, helpers) => {
  // Validate budget is at least sum of line items (if unit prices provided)
  if (value.line_items && value.budget) {
    const totalLineItems = value.line_items.reduce((sum, item) => {
      return sum + (item.unit_price ? item.unit_price * item.quantity : 0);
    }, 0);
    
    if (totalLineItems > 0 && value.budget < totalLineItems) {
      return helpers.message(`Budget must be at least ${totalLineItems} (sum of line items)`);
    }
  }
  
  // If status is 'sent', vendor_ids should be provided (warning, not error)
  if (value.status === 'sent' && (!value.vendor_ids || value.vendor_ids.length === 0)) {
    // This is a warning, not an error - we'll handle this in the controller
  }
  
  return value;
});

/**
 * Update RFP Schema
 */
export const UPDATE_RFP_SCHEMA = Joi.object({
  title: Joi.string()
    .min(3)
    .max(200)
    .trim()
    .optional()
    .messages({
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title must not exceed 200 characters'
    }),
  description: Joi.string()
    .max(2000)
    .trim()
    .optional()
    .allow(''),
  summary: Joi.string()
    .max(500)
    .trim()
    .optional()
    .allow(''),
  budget: Joi.number()
    .positive()
    .min(100)
    .optional(),
  currency: currencyValidator.optional(),
  delivery_days: Joi.number()
    .integer()
    .positive()
    .max(365)
    .optional(),
  delivery_date: Joi.date().optional(),
  delivery_by: Joi.date().optional(),
  payment_terms: Joi.string()
    .max(100)
    .trim()
    .optional()
    .allow(''),
  warranty_months: Joi.number()
    .integer()
    .min(0)
    .optional(),
  warranty: Joi.string()
    .max(500)
    .trim()
    .optional()
    .allow(''),
  line_items: Joi.array()
    .items(LINE_ITEM_SCHEMA)
    .min(1)
    .max(50)
    .optional(),
  status: Joi.string()
    .valid('draft', 'sent', 'active', 'pending_responses', 'closed')
    .optional()
    .messages({
      'any.only': 'Status must be one of: draft, sent, active, pending_responses, closed'
    }),
  vendor_ids: objectIdArrayValidator.optional(),
  notes: Joi.string()
    .max(1000)
    .trim()
    .optional()
    .allow('')
});

// ============================================
// VENDOR SCHEMAS
// ============================================

/**
 * Create Vendor Schema
 */
export const CREATE_VENDOR_SCHEMA = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .trim()
    .required()
    .messages({
      'string.min': 'Vendor name must be at least 3 characters',
      'string.max': 'Vendor name must not exceed 100 characters',
      'any.required': 'Vendor name is required'
    }),
  contact_email: emailValidator.required(),
  contact_person: Joi.string()
    .min(2)
    .max(100)
    .trim()
    .required()
    .messages({
      'string.min': 'Contact person name must be at least 2 characters',
      'string.max': 'Contact person name must not exceed 100 characters',
      'any.required': 'Contact person is required'
    }),
  phone: phoneValidator.optional(),
  address: Joi.string()
    .max(500)
    .trim()
    .optional()
    .allow(''),
  notes: Joi.string()
    .max(1000)
    .trim()
    .optional()
    .allow(''),
  rating: Joi.number()
    .min(0)
    .max(5)
    .optional()
    .messages({
      'number.min': 'Rating must be at least 0',
      'number.max': 'Rating must not exceed 5'
    }),
  website: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .optional()
    .allow('')
    .messages({
      'string.uri': 'Website must be a valid URL'
    }),
  categories: Joi.array()
    .items(Joi.string().trim())
    .optional(),
  active: Joi.boolean().optional()
}).custom(async (value, helpers) => {
  // Check vendor email uniqueness
  if (value.contact_email) {
    const isUnique = await isVendorEmailUnique(value.contact_email);
    if (!isUnique) {
      return helpers.message('Vendor with this email already exists');
    }
  }
  return value;
});

/**
 * Update Vendor Schema
 */
export const UPDATE_VENDOR_SCHEMA = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .trim()
    .optional(),
  contact_email: emailValidator.optional(),
  contact_person: Joi.string()
    .min(2)
    .max(100)
    .trim()
    .optional(),
  phone: phoneValidator.allow(null, '').optional(),
  address: Joi.string()
    .max(500)
    .trim()
    .optional()
    .allow(''),
  notes: Joi.string()
    .max(1000)
    .trim()
    .optional()
    .allow(''),
  rating: Joi.number()
    .min(0)
    .max(5)
    .optional(),
  website: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .optional()
    .allow(''),
  categories: Joi.array()
    .items(Joi.string().trim())
    .optional(),
  active: Joi.boolean().optional()
});

// ============================================
// FILE UPLOAD SCHEMAS
// ============================================

/**
 * File Upload Schema
 */
export const FILE_UPLOAD_SCHEMA = Joi.object({
  filename: Joi.string()
    .required()
    .messages({
      'any.required': 'Filename is required'
    }),
  size: Joi.number()
    .positive()
    .max(10 * 1024 * 1024) // 10MB
    .required()
    .messages({
      'number.max': 'File size must not exceed 10MB',
      'any.required': 'File size is required'
    }),
  type: Joi.string()
    .valid('application/pdf', 'application/msword', 
           'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
           'application/vnd.ms-excel',
           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
           'text/plain', 'image/png', 'image/jpeg', 'image/jpg')
    .required()
    .messages({
      'any.only': 'File type must be one of: PDF, DOCX, XLSX, TXT, PNG, JPG',
      'any.required': 'File type is required'
    })
});

/**
 * Multiple File Upload Schema
 */
export const MULTIPLE_FILE_UPLOAD_SCHEMA = Joi.array()
  .items(FILE_UPLOAD_SCHEMA)
  .min(1)
  .max(5)
  .messages({
    'array.min': 'At least one file is required',
    'array.max': 'Maximum 5 files allowed per request'
  });

// ============================================
// PARAM VALIDATION SCHEMAS
// ============================================

/**
 * ObjectId Parameter Schema
 */
export const OBJECT_ID_PARAM_SCHEMA = Joi.object({
  id: objectIdValidator.required()
    .messages({
      'any.required': 'ID is required',
      'string.base': 'Invalid ID format'
    })
});

// Export all schemas
export default {
  // Auth
  REGISTRATION_SCHEMA,
  LOGIN_SCHEMA,
  FORGOT_PASSWORD_SCHEMA,
  RESET_PASSWORD_SCHEMA,
  CHANGE_PASSWORD_SCHEMA,
  UPDATE_PROFILE_SCHEMA,
  
  // RFP
  CREATE_RFP_SCHEMA,
  UPDATE_RFP_SCHEMA,
  
  // Vendor
  CREATE_VENDOR_SCHEMA,
  UPDATE_VENDOR_SCHEMA,
  
  // File
  FILE_UPLOAD_SCHEMA,
  MULTIPLE_FILE_UPLOAD_SCHEMA,
  
  // Params
  OBJECT_ID_PARAM_SCHEMA
};

