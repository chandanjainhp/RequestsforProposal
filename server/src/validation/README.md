# Validation & Sanitization System

Comprehensive input validation and sanitization system using Joi.

## Features

- **Joi Schema Validation** - Type-safe, comprehensive validation
- **Custom Async Validators** - Email uniqueness, database checks
- **Input Sanitization** - XSS prevention, data normalization
- **File Upload Validation** - MIME type, size, security checks
- **Field-Level Errors** - Detailed validation messages
- **Integration** - Works seamlessly with error handling system

## Usage

### Basic Validation

```javascript
import { validateBody } from '../middlewares/validateRequest.js';
import { REGISTRATION_SCHEMA } from '../validation/schemas.js';

router.post('/register',
  validateBody(REGISTRATION_SCHEMA),
  authController.register
);
```

### Validate Multiple Sources

```javascript
import { validateMultiple } from '../middlewares/validateRequest.js';
import { UPDATE_PROFILE_SCHEMA, OBJECT_ID_PARAM_SCHEMA } from '../validation/schemas.js';

router.put('/users/:id/profile',
  validateMultiple({
    params: OBJECT_ID_PARAM_SCHEMA,
    body: UPDATE_PROFILE_SCHEMA
  }),
  userController.updateProfile
);
```

### File Upload Validation

```javascript
import { validateFileUpload } from '../utils/fileValidation.js';

router.post('/upload',
  upload.array('files', 5), // Multer middleware
  validateFileUpload({ maxFiles: 5 }),
  fileController.upload
);
```

## Available Schemas

### Authentication
- `REGISTRATION_SCHEMA` - User registration
- `LOGIN_SCHEMA` - User login
- `FORGOT_PASSWORD_SCHEMA` - Password reset request
- `RESET_PASSWORD_SCHEMA` - Password reset
- `CHANGE_PASSWORD_SCHEMA` - Change password
- `UPDATE_PROFILE_SCHEMA` - Update user profile

### RFP
- `CREATE_RFP_SCHEMA` - Create new RFP
- `UPDATE_RFP_SCHEMA` - Update existing RFP

### Vendor
- `CREATE_VENDOR_SCHEMA` - Create new vendor
- `UPDATE_VENDOR_SCHEMA` - Update existing vendor

### File Upload
- `FILE_UPLOAD_SCHEMA` - Single file upload
- `MULTIPLE_FILE_UPLOAD_SCHEMA` - Multiple file uploads

### Parameters
- `OBJECT_ID_PARAM_SCHEMA` - MongoDB ObjectId validation

## Custom Validation Rules

### Async Validators

```javascript
import { isEmailUnique, isVendorEmailUnique } from '../validation/customRules.js';

// Check email uniqueness in database
const unique = await isEmailUnique('user@example.com');
```

### Available Custom Rules
- `isEmailUnique(email, excludeUserId)` - Check user email uniqueness
- `isVendorEmailUnique(email, excludeVendorId)` - Check vendor email uniqueness
- `validatePasswordStrength(password)` - Password strength validation
- `isValidE164Phone(phone)` - E.164 phone format validation
- `isValidObjectId(id)` - MongoDB ObjectId validation
- `isValidCurrency(currency)` - Currency code validation
- `isRfpTitleUnique(title, excludeRfpId)` - RFP title uniqueness

## Sanitization

### Text Sanitization

```javascript
import { sanitizeText, sanitizeEmail, sanitizePhone } from '../utils/sanitizers.js';

const cleanText = sanitizeText(userInput);
const cleanEmail = sanitizeEmail(userInput);
const cleanPhone = sanitizePhone(userInput);
```

### Request Body Sanitization

Validation middleware automatically sanitizes validated data. Manual sanitization:

```javascript
import { sanitizeRequestBody } from '../utils/sanitizers.js';

const cleanBody = sanitizeRequestBody(req.body, schema);
```

## Error Response Format

Validation errors return field-level details:

```json
{
  "ok": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "timestamp": "2025-01-15T10:30:00.000Z",
    "request_id": "uuid-here",
    "details": {
      "email": "Email must be a valid email address",
      "password": "Password must be at least 8 characters long",
      "name": "Name is required"
    }
  }
}
```

## Security Features

1. **XSS Prevention** - HTML tags removed from text inputs
2. **SQL Injection Prevention** - Parameterized queries (Mongoose)
3. **File Type Validation** - Whitelist approach (MIME type + extension)
4. **File Size Limits** - Prevents DoS attacks
5. **Input Sanitization** - Automatic sanitization of validated data
6. **Path Traversal Prevention** - Filename sanitization

## Best Practices

1. **Always validate** - Use validation middleware for all user inputs
2. **Sanitize on output** - Don't trust client data
3. **Use async validators** - For database-dependent checks
4. **Field-level errors** - Provide clear, actionable error messages
5. **Whitelist file types** - Never trust file extensions alone
6. **Validate file size** - Prevent DoS attacks
7. **Sanitize filenames** - Prevent path traversal attacks

