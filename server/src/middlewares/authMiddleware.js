import { asyncHandler } from '../utils/asyncHandler.js';
import { 
  verifyAccessToken, 
  TokenExpiredError, 
  InvalidTokenError, 
  MalformedTokenError 
} from '../utils/tokenUtils.js';
import { AuthenticationError } from '../errors/AuthenticationError.js';
import { AuthorizationError } from '../errors/AuthorizationError.js';
import User from '../models/User.js';

/**
 * JWT Authentication Middleware
 * Verifies access token and attaches user to request
 * 
 * Usage:
 * router.get('/protected', authenticate, controller.handler);
 * 
 * On success: req.user = { userId, email, role }
 * On error: Returns 401 Unauthorized
 */
export const authenticate = asyncHandler(async (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthenticationError('No token provided. Please include Authorization header with Bearer token.');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    throw new AuthenticationError('Token is missing from Authorization header');
  }

  // Verify token
  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new AuthenticationError('Token has expired. Please refresh your token.');
    } else if (error instanceof InvalidTokenError) {
      throw new AuthenticationError('Invalid token signature');
    } else if (error instanceof MalformedTokenError) {
      throw new AuthenticationError('Malformed token format');
    }
    throw new AuthenticationError('Token verification failed');
  }

  // Find user and verify they exist and are active
  const user = await User.findById(decoded.userId);
  
  if (!user || !user.isActive()) {
    throw new AuthenticationError('User not found or account has been deactivated');
  }

  // Attach user info to request
  req.user = {
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role,
    _id: decoded.userId
  };

  next();
});

/**
 * Optional Authentication Middleware
 * Verifies token if provided, but doesn't fail if no token
 * Useful for endpoints that work for both authenticated and anonymous users
 * 
 * Usage:
 * router.get('/public', optionalAuth, controller.handler);
 * 
 * If token provided: req.user = { userId, email, role }
 * If no token: req.user = undefined
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  
  // If no token provided, continue without authentication
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = undefined;
    return next();
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    req.user = undefined;
    return next();
  }

  // Try to verify token, but don't fail if invalid
  try {
    const decoded = verifyAccessToken(token);

    // Find user and verify they exist and are active
    const user = await User.findById(decoded.userId);
    
    if (user && user.isActive()) {
      // Attach user info to request
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        _id: decoded.userId
      };
    } else {
      req.user = undefined;
    }
  } catch (error) {
    // Silently fail and continue without authentication
    req.user = undefined;
  }

  next();
});

/**
 * Role-Based Authorization Middleware
 * Checks if authenticated user has required role
 * Must be used after authenticate middleware
 * 
 * Usage:
 * router.get('/admin', authenticate, authorize('admin'), controller.handler);
 * router.get('/admin-or-user', authenticate, authorize('admin', 'user'), controller.handler);
 * 
 * @param {...string} roles - Allowed roles
 * @returns {Function} Express middleware function
 */
export const authorize = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    // Check if user role is in allowed roles
    if (!roles.includes(req.user.role)) {
      throw new AuthorizationError(`Access forbidden. Required role: ${roles.join(' or ')}`);
    }

    next();
  });
};

/**
 * Admin Only Authorization
 * Convenience middleware for admin-only routes
 * 
 * Usage:
 * router.get('/admin', authenticate, adminOnly, controller.handler);
 */
export const adminOnly = authorize('admin');

/**
 * User or Admin Authorization
 * Convenience middleware for routes accessible to both users and admins
 * 
 * Usage:
 * router.get('/protected', authenticate, userOrAdmin, controller.handler);
 */
export const userOrAdmin = authorize('user', 'admin');
