// Schema validation utilities

const RFP_SCHEMA = {
  title: { type: 'string', required: false, maxLength: 200 },
  description: { type: 'string', required: false, maxLength: 2000 },
  budget: { type: 'number', required: false, min: 0 },
  currency: { type: 'string', required: false, enum: ['USD', 'GBP', 'EUR', 'INR', 'CAD', 'AUD'] },
  delivery_days: { type: 'number', required: false, min: 1, max: 365 },
  delivery_date: { type: 'date', required: false },
  payment_terms: { type: 'string', required: false, maxLength: 100 },
  warranty_months: { type: 'number', required: false, min: 0 },
  line_items: { type: 'array', required: false, maxItems: 100 },
  notes: { type: 'string', required: false, maxLength: 1000 }
};

function validateRfp(rfpData) {
  const errors = [];

  if (!rfpData || typeof rfpData !== 'object') {
    return { valid: false, errors: ['RFP data must be an object'] };
  }

  // Check each field
  for (const [field, fieldSchema] of Object.entries(RFP_SCHEMA)) {
    const value = rfpData[field];

    if (value === null || value === undefined) {
      if (fieldSchema.required) {
        errors.push(`${field} is required`);
      }
      continue;
    }

    // Type validation
    if (fieldSchema.type === 'string' && typeof value !== 'string') {
      errors.push(`${field} must be a string`);
      continue;
    }
    if (fieldSchema.type === 'number' && typeof value !== 'number') {
      errors.push(`${field} must be a number`);
      continue;
    }
    if (fieldSchema.type === 'array' && !Array.isArray(value)) {
      errors.push(`${field} must be an array`);
      continue;
    }
    if (fieldSchema.type === 'date' && !(value instanceof Date) && isNaN(Date.parse(value))) {
      errors.push(`${field} must be a valid date`);
      continue;
    }

    // Enum validation
    if (fieldSchema.enum && !fieldSchema.enum.includes(value)) {
      errors.push(`${field} must be one of: ${fieldSchema.enum.join(', ')}`);
    }

    // String length validation
    if (fieldSchema.type === 'string' && fieldSchema.maxLength && value.length > fieldSchema.maxLength) {
      errors.push(`${field} exceeds maximum length of ${fieldSchema.maxLength}`);
    }

    // Number range validation
    if (fieldSchema.type === 'number') {
      if (fieldSchema.min !== undefined && value < fieldSchema.min) {
        errors.push(`${field} must be at least ${fieldSchema.min}`);
      }
      if (fieldSchema.max !== undefined && value > fieldSchema.max) {
        errors.push(`${field} must not exceed ${fieldSchema.max}`);
      }
    }

    // Array length validation
    if (fieldSchema.type === 'array' && fieldSchema.maxItems && value.length > fieldSchema.maxItems) {
      errors.push(`${field} has too many items (max ${fieldSchema.maxItems})`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: []
  };
}

export default {
  validateRfp
};
