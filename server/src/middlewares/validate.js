import { validationResult } from 'express-validator';
import { ValidationError } from '../utils/errors.js';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg,
      value: err.value
    }));

    // Log detailed validation errors for debugging
    console.error('Validation failed for request:', {
      path: req.path,
      method: req.method,
      body: req.body,
      errors: formattedErrors
    });

    throw new ValidationError('Validation failed', formattedErrors);
  }
  
  next();
};

export default validate;