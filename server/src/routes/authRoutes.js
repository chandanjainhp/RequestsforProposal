// Auth Routes
// POST /api/auth/register - Register new user
// POST /api/auth/login - Login user
// POST /api/auth/refresh - Refresh access token (with rotation)
// POST /api/auth/logout - Logout (invalidate refresh token)
// POST /api/auth/logout-all - Logout from all devices
// GET /api/auth/me - Get current user profile
// PUT /api/auth/profile - Update user profile
// POST /api/auth/change-password - Change password
// DELETE /api/auth/account - Delete account (soft delete)
// POST /api/auth/forgot-password - Request password reset
// POST /api/auth/reset-password - Reset password with token

import express from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/refresh', userController.refreshToken);
router.post('/logout', userController.logout); // Can work with or without auth
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

// Protected routes (require authentication)
router.get('/me', authenticate, userController.getCurrentUser);
router.put('/profile', authenticate, userController.updateProfile);
router.post('/change-password', authenticate, userController.changePassword);
router.post('/logout-all', authenticate, userController.logoutAll); // Requires auth
router.delete('/account', authenticate, userController.deleteAccount);

export default router;

