import api from './axiosConfig';

/**
 * Authentication API calls
 */
export const authAPI = {
  /**
   * Signup user (sends OTP)
   * @param {Object} userData - User registration data
   * @param {string} userData.full_name
   * @param {string} userData.email
   * @param {string} userData.company_name
   * @param {string} userData.password
   * @returns {Promise} API response
   */
  signup: async (userData) => {
    const response = await api.post('/api/auth/signup', userData);
    return response;
  },

  /**
   * Verify signup OTP
   * @param {string} email - User email
   * @param {string} otp_code - OTP code
   * @returns {Promise} API response
   */
  verifySignupOTP: async (email, otp_code) => {
    const response = await api.post('/api/auth/verify-otp', { email, otp_code });
    return response;
  },

  /**
   * Resend signup OTP
   * @param {string} email - User email
   * @returns {Promise} API response
   */
  resendOTP: async (email) => {
    const response = await api.post('/api/auth/resend-otp', { email });
    return response;
  },

  /**
   * Login user (sends OTP)
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} API response
   */
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response;
  },

  /**
   * Verify login OTP
   * @param {string} email - User email
   * @param {string} otp_code - OTP code
   * @returns {Promise} API response
   */
  verifyLoginOTP: async (email, otp_code) => {
    const response = await api.post('/api/auth/verify-login-otp', { email, otp_code });
    return response;
  },

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise} API response
   */
  refreshToken: async (refreshToken) => {
    const response = await api.post('/api/auth/refresh', { refreshToken });
    return response;
  },

  /**
   * Get current user profile (verify token)
   * @returns {Promise} User data
   */
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/verify');
    return response.data.user || response.data.data;
  },

  /**
   * Update user profile
   * @param {Object} data - Profile update data
   * @returns {Promise} Updated user data
   */
  updateProfile: async (data) => {
    const response = await api.put('/api/auth/profile', data);
    return response.data.data || response.data;
  },

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise} API response
   */
  forgotPassword: async (email) => {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response;
  },

  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise} API response
   */
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/api/auth/reset-password', { token, password: newPassword });
    return response;
  },

  /**
   * Change password (authenticated)
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise} API response
   */
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/api/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword
    });
    return response;
  },

  /**
   * Logout from all devices
   * @returns {Promise} API response
   */
  logoutAll: async () => {
    const response = await api.post('/api/auth/logout-all');
    return response;
  }
};
