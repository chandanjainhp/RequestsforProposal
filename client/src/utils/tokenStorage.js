/**
 * Token storage utilities for authentication
 */

// Storage keys
const ACCESS_TOKEN_KEY = 'rfp_access_token';
const REFRESH_TOKEN_KEY = 'rfp_refresh_token';
const REFRESH_TOKEN_EXPIRY_KEY = 'rfp_refresh_token_expiry';

/**
 * Decode JWT token to get payload
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded payload or null if invalid
 */
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if expired
 */
export const isTokenExpired = (token) => {
  if (!token) return true;

  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  // Add 60 seconds buffer (refresh 1 minute before expiry)
  const currentTime = Date.now() / 1000;
  return decoded.exp < (currentTime + 60);
};

/**
 * Get stored access token
 * @returns {string|null} Access token or null
 */
export const getStoredToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Set stored access token
 * @param {string} token - Access token
 */
export const setStoredToken = (token) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

/**
 * Get stored refresh token
 * @returns {string|null} Refresh token or null
 */
export const getStoredRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Set stored refresh token
 * @param {string} token - Refresh token
 */
export const setStoredRefreshToken = (token) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

/**
 * Get refresh token expiry
 * @returns {number|null} Expiry timestamp or null
 */
export const getRefreshTokenExpiry = () => {
  const expiry = localStorage.getItem('rfp_refresh_token_expiry');
  return expiry ? parseInt(expiry, 10) : null;
};

/**
 * Set refresh token expiry
 * @param {number} expiry - Expiry timestamp
 */
export const setRefreshTokenExpiry = (expiry) => {
  localStorage.setItem('rfp_refresh_token_expiry', expiry.toString());
};

/**
 * Check if refresh token is expired
 * @returns {boolean} True if expired
 */
export const isRefreshTokenExpired = () => {
  const expiry = localStorage.getItem('rfp_refresh_token_expiry');
  if (!expiry) return true;
  return Date.now() > parseInt(expiry, 10);
};

/**
 * Clear all stored tokens
 */
export const clearStoredTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem('rfp_refresh_token_expiry');
};

/**
 * Get remembered email
 * @returns {string|null} Remembered email or null
 */
export const getRememberedEmail = () => {
  return localStorage.getItem('rfp_remembered_email');
};

/**
 * Set remembered email
 * @param {string} email - Email to remember
 */
export const setRememberedEmail = (email) => {
  localStorage.setItem('rfp_remembered_email', email);
};

/**
 * Clear remembered email
 */
export const clearRememberedEmail = () => {
  localStorage.removeItem('rfp_remembered_email');
};

/**
 * Check if user has valid authentication
 * @returns {boolean} True if authenticated
 */
export const hasValidAuth = () => {
  const token = getStoredToken();
  return token && !isTokenExpired(token);
};

/**
 * Get token expiry time
 * @param {string} token - JWT token
 * @returns {number|null} Expiry timestamp or null
 */
export const getTokenExpiry = (token) => {
  const decoded = decodeToken(token);
  return decoded?.exp ? decoded.exp * 1000 : null; // Convert to milliseconds
};
