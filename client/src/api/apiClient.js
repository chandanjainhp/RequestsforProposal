import axios from 'axios';
// import { handleError } from '../utils/errorHandler';
// import { useNotificationStore } from '../store/notificationStore';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token (but not for login/signup requests)
    const token = localStorage.getItem('rfp_access_token');
    const isAuthRequest = config.url?.includes('/auth/login') ||
                         config.url?.includes('/auth/signup') ||
                         config.url?.includes('/auth/verify-otp') ||
                         config.url?.includes('/auth/resend-otp') ||
                         config.url?.includes('/auth/verify-login-otp') ||
                         config.url?.includes('/auth/refresh'); // Add refresh endpoint
    
    if (token && !isAuthRequest) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracking
    config.headers['X-Request-ID'] = Math.random().toString(36).substring(7);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 - Unauthorized (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('rfp_refresh_token');
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await apiClient.post('/auth/refresh', { refreshToken });
        
        const { token } = response.data;
        localStorage.setItem('rfp_access_token', token);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('rfp_access_token');
        localStorage.removeItem('rfp_refresh_token');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle network errors
    if (!error.response) {
      // Network error - let the error propagate naturally
    }

    return Promise.reject(error);
  }
);

export default apiClient;