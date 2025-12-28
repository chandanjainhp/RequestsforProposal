// Route constants to avoid hardcoding and improve maintainability
export const ROUTES = {
  // Public routes
  HOME: '/public',
  ROOT: '/',

  // Auth routes
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  VERIFY_OTP: '/auth/verify-otp',

  // Protected routes
  DASHBOARD: '/app/dashboard',
  CHAT: '/app/chat',
  EDITOR: '/app/editor',
  SEND: '/app/send',
  PROPOSALS: '/app/proposals',
  COMPARE: '/app/compare',
  VENDORS: '/app/vendors',
  HISTORY: '/app/history',
  SETTINGS: '/app/settings',
  HELP: '/app/help',

  // Admin routes
  ADMIN_USERS: '/app/admin/users',
  ADMIN_SETTINGS: '/app/admin/settings',

  // Error routes
  ERROR_403: '/403',
  ERROR_404: '/404',
  ERROR_500: '/500',
};