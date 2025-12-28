/**
 * Custom Validation Rules
 * 
 * Async validation functions that check against database or perform
 * complex validation logic not possible with standard Joi validators.
 */

import User from '../models/User.js';
import Vendor from '../models/Vendor.js';
import Rfp from '../models/Rfp.js';
import mongoose from 'mongoose';

/**
 * Check if email is unique in User collection
 * 
 * @param {string} email - Email to check
 * @param {string} excludeUserId - User ID to exclude (for update operations)
 * @returns {Promise<boolean>} True if email is unique
 */
export const isEmailUnique = async (email, excludeUserId = null) => {
  if (!email) return true;

  const query = { email: email.toLowerCase(), deleted_at: null };
  
  if (excludeUserId) {
    query._id = { $ne: excludeUserId };
  }

  const existing = await User.findOne(query);
  return !existing;
};

/**
 * Check if vendor email is unique
 * 
 * @param {string} email - Email to check
 * @param {string} excludeVendorId - Vendor ID to exclude (for update operations)
 * @returns {Promise<boolean>} True if email is unique
 */
export const isVendorEmailUnique = async (email, excludeVendorId = null) => {
  if (!email) return true;

  const query = { contact_email: email.toLowerCase() };
  
  if (excludeVendorId) {
    query._id = { $ne: excludeVendorId };
  }

  const existing = await Vendor.findOne(query);
  return !existing;
};

/**
 * Validate password strength
 * 
 * @param {string} password - Password to validate
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export const validatePasswordStrength = (password) => {
  const errors = [];

  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validate E.164 phone format
 * E.164 format: +[country code][number] (10-15 digits total)
 * 
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid E.164 format
 */
export const isValidE164Phone = (phone) => {
  if (!phone) return true; // Optional field
  
  // E.164 format: + followed by 1-3 digit country code, then 1-15 digits
  const e164Pattern = /^\+[1-9]\d{1,14}$/;
  return e164Pattern.test(phone);
};

/**
 * Validate MongoDB ObjectId
 * 
 * @param {string} id - ID to validate
 * @returns {boolean} True if valid ObjectId
 */
export const isValidObjectId = (id) => {
  if (!id) return false;
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Validate array of MongoDB ObjectIds
 * 
 * @param {Array} ids - Array of IDs to validate
 * @returns {boolean} True if all are valid ObjectIds
 */
export const isValidObjectIdArray = (ids) => {
  if (!Array.isArray(ids)) return false;
  return ids.every(id => isValidObjectId(id));
};

/**
 * Check if RFP title is unique
 * 
 * @param {string} title - Title to check
 * @param {string} excludeRfpId - RFP ID to exclude (for update operations)
 * @returns {Promise<boolean>} True if title is unique
 */
export const isRfpTitleUnique = async (title, excludeRfpId = null) => {
  if (!title) return true;

  const query = { title: title.trim() };
  
  if (excludeRfpId) {
    query._id = { $ne: excludeRfpId };
  }

  const existing = await Rfp.findOne(query);
  return !existing;
};

/**
 * Validate currency code (ISO 4217)
 * Supported currencies: USD, EUR, GBP, INR, CAD, AUD
 * 
 * @param {string} currency - Currency code to validate
 * @returns {boolean} True if valid currency code
 */
export const isValidCurrency = (currency) => {
  const validCurrencies = ['USD', 'EUR', 'INR', 'GBP', 'CAD', 'AUD'];
  return validCurrencies.includes(currency?.toUpperCase());
};

/**
 * Validate file type based on MIME type
 * 
 * @param {string} mimeType - MIME type to validate
 * @param {Array<string>} allowedTypes - Allowed MIME types
 * @returns {boolean} True if valid file type
 */
export const isValidFileType = (mimeType, allowedTypes = []) => {
  if (!mimeType) return false;
  
  const defaultAllowed = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'image/png',
    'image/jpeg',
    'image/jpg'
  ];
  
  const types = allowedTypes.length > 0 ? allowedTypes : defaultAllowed;
  return types.includes(mimeType);
};

/**
 * Validate file size (in bytes)
 * 
 * @param {number} size - File size in bytes
 * @param {number} maxSize - Maximum size in bytes (default: 10MB)
 * @returns {boolean} True if file size is valid
 */
export const isValidFileSize = (size, maxSize = 10 * 1024 * 1024) => {
  if (!size || typeof size !== 'number') return false;
  return size <= maxSize && size > 0;
};

/**
 * Check if user exists and is active
 * 
 * @param {string} userId - User ID to check
 * @returns {Promise<boolean>} True if user exists and is active
 */
export const userExists = async (userId) => {
  if (!userId || !isValidObjectId(userId)) return false;
  
  const user = await User.findById(userId);
  return user && !user.deleted_at;
};

/**
 * Check if vendor exists
 * 
 * @param {string} vendorId - Vendor ID to check
 * @returns {Promise<boolean>} True if vendor exists
 */
export const vendorExists = async (vendorId) => {
  if (!vendorId || !isValidObjectId(vendorId)) return false;
  
  const vendor = await Vendor.findById(vendorId);
  return !!vendor;
};

/**
 * Check if RFP exists
 * 
 * @param {string} rfpId - RFP ID to check
 * @returns {Promise<boolean>} True if RFP exists
 */
export const rfpExists = async (rfpId) => {
  if (!rfpId || !isValidObjectId(rfpId)) return false;
  
  const rfp = await Rfp.findById(rfpId);
  return !!rfp;
};

export default {
  isEmailUnique,
  isVendorEmailUnique,
  validatePasswordStrength,
  isValidE164Phone,
  isValidObjectId,
  isValidObjectIdArray,
  isRfpTitleUnique,
  isValidCurrency,
  isValidFileType,
  isValidFileSize,
  userExists,
  vendorExists,
  rfpExists
};

