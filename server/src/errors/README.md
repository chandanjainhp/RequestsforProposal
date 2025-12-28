# Error Handling System

Comprehensive error handling system for the RFP Management API.

## Error Classes

All error classes extend `AppError` base class and follow a consistent structure.

### Available Error Classes

1. **AppError** - Base class (never throw directly)
2. **ValidationError** (400) - Input validation failures
3. **AuthenticationError** (401) - Authentication failures
4. **AuthorizationError** (403) - Permission failures
5. **NotFoundError** (404) - Resource not found
6. **ConflictError** (409) - Duplicate/conflict situations
7. **RateLimitError** (429) - Rate limiting
8. **InternalServerError** (500) - Unexpected server errors

## Usage Examples

### In Controllers

```javascript
import { asyncHandler } from '../utils/asyncHandler.js';
import { 
  ValidationError, 
  NotFoundError, 
  AuthenticationError,
  ConflictError 
} from '../errors/index.js';

// Using asyncHandler (automatically catches errors)
export const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const user = await User.findById(id);
  if (!user) {
    throw new NotFoundError('User not found', 'User', id);
  }
  
  res.json({ ok: true, data: { user } });
});

// With validation
export const createUser = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  
  // Field-level validation errors
  if (!email) {
    throw new ValidationError('Validation failed', {
      email: 'Email is required'
    });
  }
  
  if (!password || password.length < 8) {
    throw new ValidationError('Validation failed', {
      password: 'Password must be at least 8 characters'
    });
  }
  
  // Check for duplicates
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ConflictError('Email already exists', 'email');
  }
  
  const user = await User.create({ email, password, name });
  res.status(201).json({ ok: true, data: { user } });
});
```

### With Authentication

```javascript
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) {
    throw new AuthenticationError('Invalid credentials');
  }
  
  const isValid = await user.comparePassword(password);
  if (!isValid) {
    throw new AuthenticationError('Invalid credentials');
  }
  
  // ... generate tokens
  res.json({ ok: true, data: { user, token } });
});
```

### With Authorization

```javascript
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Check permissions (authorization middleware already checked role)
  if (req.user.role !== 'admin') {
    throw new AuthorizationError('Admin access required', 'admin');
  }
  
  const user = await User.findById(id);
  if (!user) {
    throw new NotFoundError('User not found', 'User', id);
  }
  
  await user.remove();
  res.json({ ok: true, message: 'User deleted' });
});
```

## Error Response Format

### Standard Format
```json
{
  "ok": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found",
    "timestamp": "2025-01-15T10:30:00.000Z",
    "request_id": "uuid-here",
    "details": {
      "resource_type": "User",
      "resource_id": "123"
    }
  }
}
```

### Validation Error with Details
```json
{
  "ok": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "timestamp": "2025-01-15T10:30:00.000Z",
    "request_id": "uuid-here",
    "details": {
      "email": "Invalid email format",
      "password": "Must be at least 8 characters"
    }
  }
}
```

### Development Mode (includes stack trace)
```json
{
  "ok": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Internal server error",
    "timestamp": "2025-01-15T10:30:00.000Z",
    "request_id": "uuid-here",
    "stack": "Error: ...\n    at ..."
  }
}
```

## Error Codes

All error codes are defined in `errorCodes.js`:

```javascript
import { ERROR_CODES } from '../errors/errorCodes.js';

throw new AuthenticationError('Token expired', ERROR_CODES.TOKEN_EXPIRED);
```

## Best Practices

1. **Always use asyncHandler** - Wraps async route handlers to catch errors automatically
2. **Use specific error classes** - Don't throw generic AppError
3. **Include context** - Add resource type/ID for NotFoundError
4. **Field-level details** - Use ValidationError with details object for form validation
5. **Never expose sensitive info** - Error messages should be user-friendly, not technical
6. **Use error codes** - Import ERROR_CODES for consistency
7. **Log errors properly** - Logger automatically sanitizes sensitive data

## Integration with Express

Error handler middleware must be the last middleware:

```javascript
import { errorHandler, notFoundHandler } from './src/middlewares/errorHandler.js';

// ... routes ...

// 404 handler (before error handler)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);
```

