/**
 * Validate password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
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
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate phone number (E.164 format)
 */
export const validatePhone = (phone) => {
  if (!phone) return { isValid: true }; // Optional field
  
  const e164Pattern = /^\+[1-9]\d{1,14}$/;
  return {
    isValid: e164Pattern.test(phone),
    error: phone && !e164Pattern.test(phone) ? 'Phone must be in E.164 format (e.g., +1234567890)' : null
  };
};

/**
 * Validate company name (optional but if provided, 3-100 chars)
 */
export const validateCompany = (company) => {
  if (!company) return { isValid: true }; // Optional field
  
  if (company.length < 3 || company.length > 100) {
    return {
      isValid: false,
      error: 'Company name must be between 3 and 100 characters'
    };
  }
  
  return { isValid: true };
};

