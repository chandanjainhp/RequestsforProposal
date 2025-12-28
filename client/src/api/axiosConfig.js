import axios from 'axios';
import { isTokenExpired, getStoredToken, getStoredRefreshToken, setStoredToken, clearStoredTokens } from '../utils/tokenStorage';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request queue for handling concurrent requests during token refresh
let isRefreshing = false;
let failedQueue = [];

// Process failed queue
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Check if request is an auth request (shouldn't include token)
const isAuthRequest = (url) => {
  const authPaths = ['/auth/login', '/auth/signup', '/auth/verify-otp', '/auth/resend-otp', '/auth/verify-login-otp', '/auth/refresh'];
  return authPaths.some(path => url?.includes(path));
};

// Request interceptor: Add auth header
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token && !isTokenExpired(token) && !isAuthRequest(config.url)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If refreshing already in progress, queue the request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      }).catch(err => {
        return Promise.reject(err);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Attempt to refresh token
      const refreshToken = getStoredRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/api/auth/refresh', { refreshToken });
      const newToken = response.data.data?.token || response.data.token;
      
      if (newToken) {
        setStoredToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return api(originalRequest);
      }
      
      throw new Error('No token in refresh response');
    } catch (refreshError) {
      // Refresh failed, clear tokens and redirect to login
      processQueue(refreshError, null);
      clearStoredTokens();
      
      // Only redirect if not already on auth page
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth/login';
      }
      
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
