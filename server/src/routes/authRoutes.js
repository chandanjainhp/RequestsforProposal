import express from 'express';
import { 
  signup, 
  verifySignupOTP, 
  resendOTP, 
  login, 
  verifyLoginOTP, 
  verifyToken, 
  refreshToken,
  updateProfile,
  changePassword
} from '../controllers/auth.Controller.js';
import validate from '../middlewares/validate.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { body } from 'express-validator';

const router = express.Router();

// Validation rules
const signupValidation = [
  body('full_name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Full name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9\s\-'\.]+$/)
    .withMessage('Full name can only contain letters, numbers, spaces, hyphens, apostrophes, and periods'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('company_name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  body('confirm_password')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];

const otpValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('otp_code')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be exactly 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only numbers')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const profileUpdateValidation = [
  body('full_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Full name must be between 2 and 50 characters'),
  
  body('company_name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters')
];

const changePasswordValidation = [
  body('current_password')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('new_password')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character')
];

// Routes
router.post('/signup', signupValidation, validate, signup);
router.post('/verify-otp', otpValidation, validate, verifySignupOTP);
router.post('/resend-otp', validate, resendOTP);
router.post('/login', loginValidation, validate, login);
router.post('/verify-login-otp', otpValidation, validate, verifyLoginOTP);
router.post('/refresh', refreshToken);
router.get('/verify', authenticate, verifyToken);

// Protected profile routes
router.put('/profile', authenticate, profileUpdateValidation, validate, updateProfile);
router.post('/change-password', authenticate, changePasswordValidation, validate, changePassword);

export default router;
