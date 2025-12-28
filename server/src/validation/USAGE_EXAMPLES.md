# Validation System Usage Examples

## Example: Adding Validation to Auth Routes

```javascript
// server/src/routes/authRoutes.js
import express from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validateRequest.js';
import {
  REGISTRATION_SCHEMA,
  LOGIN_SCHEMA,
  FORGOT_PASSWORD_SCHEMA,
  RESET_PASSWORD_SCHEMA,
  CHANGE_PASSWORD_SCHEMA,
  UPDATE_PROFILE_SCHEMA
} from '../validation/schemas.js';

const router = express.Router();

// Public routes with validation
router.post('/register', validateBody(REGISTRATION_SCHEMA), userController.register);
router.post('/login', validateBody(LOGIN_SCHEMA), userController.login);
router.post('/forgot-password', validateBody(FORGOT_PASSWORD_SCHEMA), userController.forgotPassword);
router.post('/reset-password', validateBody(RESET_PASSWORD_SCHEMA), userController.resetPassword);

// Protected routes with validation
router.put('/profile', 
  authenticate, 
  validateBody(UPDATE_PROFILE_SCHEMA), 
  userController.updateProfile
);
router.post('/change-password', 
  authenticate, 
  validateBody(CHANGE_PASSWORD_SCHEMA), 
  userController.changePassword
);

export default router;
```

## Example: Adding Validation to RFP Routes

```javascript
// server/src/routes/rfp.router.js
import express from 'express';
import { validateBody, validateParams } from '../middlewares/validateRequest.js';
import { CREATE_RFP_SCHEMA, UPDATE_RFP_SCHEMA, OBJECT_ID_PARAM_SCHEMA } from '../validation/schemas.js';
import rfpController from '../controllers/rfp.controller.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create',
  authenticate,
  validateBody(CREATE_RFP_SCHEMA),
  rfpController.create
);

router.put('/:id',
  authenticate,
  validateParams(OBJECT_ID_PARAM_SCHEMA),
  validateBody(UPDATE_RFP_SCHEMA),
  rfpController.update
);
```

## Example: Adding Validation to Vendor Routes

```javascript
// server/src/routes/vendor.router.js
import express from 'express';
import { validateBody, validateParams, validateMultiple } from '../middlewares/validateRequest.js';
import { CREATE_VENDOR_SCHEMA, UPDATE_VENDOR_SCHEMA, OBJECT_ID_PARAM_SCHEMA } from '../validation/schemas.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import vendorController from '../controllers/vendor.controller.js';

const router = express.Router();

router.post('/',
  authenticate,
  validateBody(CREATE_VENDOR_SCHEMA),
  vendorController.create
);

router.put('/:id',
  authenticate,
  validateMultiple({
    params: OBJECT_ID_PARAM_SCHEMA,
    body: UPDATE_VENDOR_SCHEMA
  }),
  vendorController.update
);
```

## Example: File Upload with Validation

```javascript
// server/src/routes/upload.router.js
import express from 'express';
import multer from 'multer';
import { validateFileUpload } from '../utils/fileValidation.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import uploadController from '../controllers/upload.controller.js';

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

const router = express.Router();

router.post('/files',
  authenticate,
  upload.array('files', 5),
  validateFileUpload({ maxFiles: 5 }),
  uploadController.upload
);
```

## Example: Using Validated Data in Controller

```javascript
// server/src/controllers/userController.js
import { asyncHandler } from '../utils/asyncHandler.js';
import { NotFoundError } from '../errors/index.js';
import User from '../models/User.js';

export const updateProfile = asyncHandler(async (req, res) => {
  // Data is already validated and sanitized in req.body or req.validated.body
  const { name, company, phone } = req.body; // or req.validated.body
  
  const user = await User.findById(req.user.userId);
  if (!user) {
    throw new NotFoundError('User not found', 'User', req.user.userId);
  }
  
  // Update user with validated data
  user.name = name;
  user.company = company;
  user.phone = phone;
  await user.save();
  
  res.json({ ok: true, data: { user } });
});
```

## Example: Custom Async Validation in Schema

Custom async validators are already built into schemas (like email uniqueness).
To add your own:

```javascript
import Joi from 'joi';
import { isEmailUnique } from '../validation/customRules.js';

const CUSTOM_SCHEMA = Joi.object({
  email: Joi.string().email().required()
    .external(async (value) => {
      const unique = await isEmailUnique(value);
      if (!unique) {
        throw new Error('Email already exists');
      }
      return value;
    })
});
```

## Example: Conditional Validation

```javascript
import Joi from 'joi';

const CONDITIONAL_SCHEMA = Joi.object({
  status: Joi.string().valid('draft', 'sent', 'active').required(),
  vendor_ids: Joi.array().items(Joi.string()).when('status', {
    is: 'sent',
    then: Joi.required(),
    otherwise: Joi.optional()
  })
});
```

