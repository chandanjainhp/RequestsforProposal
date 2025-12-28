import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useNotificationStore } from '../store/notificationStore';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  // Use global Zustand store for shared state
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    setUser, 
    setLoading, 
    logout: storeLogout
  } = useAuthStore();
  
  const navigate = useNavigate();
  const { showToast } = useNotificationStore();
  
  // Track if we've already initialized to prevent multiple runs
  const initializedRef = useRef(false);

  // Check authentication on mount - only once
  useEffect(() => {
    // Prevent running twice (React StrictMode or re-renders)
    if (initializedRef.current) return;
    initializedRef.current = true;
    
    const initializeAuth = async () => {
      const token = localStorage.getItem('rfp_access_token') || localStorage.getItem('token');
      
      if (token) {
        // Migrate old token format
        if (localStorage.getItem('token')) {
          localStorage.setItem('rfp_access_token', localStorage.getItem('token'));
          localStorage.removeItem('token');
        }
        
        try {
          const response = await apiClient.get('/auth/verify');
          setUser(response.data.user);
        } catch (error) {
          // Handle errors silently for 401 (expected when not logged in)
          if (error.response?.status !== 401) {
            console.error('Token verification failed:', error.message);
          }
          // Clear invalid tokens
          localStorage.removeItem('rfp_access_token');
          localStorage.removeItem('rfp_refresh_token');
          storeLogout();
        }
      } else {
        // No token - just mark as not loading
        setLoading(false);
      }
    };
    
    initializeAuth();
  }, [setLoading, setUser, storeLogout]); // Zustand functions are stable references

  const signup = async (userData) => {
    setLoading(true);
    try {
      // Send data with field names that match server validation expectations
      const signupData = {
        full_name: userData.full_name, // Server validation expects 'full_name'
        email: userData.email,
        company_name: userData.company_name, // Server validation expects 'company_name'
        password: userData.password,
        confirm_password: userData.confirm_password // Use the actual confirm_password from form
      };
      
      const response = await apiClient.post('/auth/signup', signupData);
      showToast({
        type: 'success',
        title: 'Success',
        message: response.data.message
      });
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (otpData) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/verify-otp', otpData);
      
      // Handle different response structures
      const token = response.data?.data?.token || response.data?.token;
      const refreshTokenValue = response.data?.data?.refreshToken || response.data?.refreshToken || '';
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      // Store tokens
      localStorage.setItem('rfp_access_token', token);
      localStorage.setItem('rfp_refresh_token', refreshTokenValue);
      
      // Get user data
      const verifyResponse = await apiClient.get('/auth/verify');
      const userData = verifyResponse.data?.user || verifyResponse.data?.data?.user;
      
      if (!userData) {
        throw new Error('No user data received from server');
      }
      
      // setUser also sets isAuthenticated = true
      setUser(userData);
      
      return response.data;
    } catch (error) {
      // If token validation fails, clear tokens
      localStorage.removeItem('rfp_access_token');
      localStorage.removeItem('rfp_refresh_token');
      storeLogout();
      
      // Enhance error message
      if (!error.response) {
        error.message = 'Unable to connect to server. Please check if the backend is running.';
      } else if (error.response?.data?.message) {
        error.message = error.response.data.message;
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async (emailData) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/resend-otp', emailData);
      showToast({
        type: 'success',
        title: 'Success',
        message: response.data.message
      });
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      // Enhance error message for network errors
      if (!error.response) {
        error.message = 'Unable to connect to server. Please check if the backend is running at http://localhost:5000';
      } else if (error.response?.data?.message) {
        error.message = error.response.data.message;
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyLoginOTP = async (otpData) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/verify-login-otp', otpData);
      
      // Handle different response structures
      const token = response.data?.data?.token || response.data?.token;
      const refreshTokenValue = response.data?.data?.refreshToken || response.data?.refreshToken || '';
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      // Store tokens
      localStorage.setItem('rfp_access_token', token);
      localStorage.setItem('rfp_refresh_token', refreshTokenValue);
      
      // Get user data - token is now in localStorage so interceptor will add it
      const verifyResponse = await apiClient.get('/auth/verify');
      
      // Handle different response structures for user
      const userData = verifyResponse.data?.user || verifyResponse.data?.data?.user;
      
      if (!userData) {
        throw new Error('No user data received from server');
      }
      
      // setUser also sets isAuthenticated = true
      setUser(userData);
      
      return response.data;
    } catch (error) {
      // If token validation fails, clear tokens
      localStorage.removeItem('rfp_access_token');
      localStorage.removeItem('rfp_refresh_token');
      storeLogout();
      
      // Enhance error message for network errors
      if (!error.response) {
        error.message = 'Unable to connect to server. Please check if the backend is running.';
      } else if (error.response?.data?.message) {
        error.message = error.response.data.message;
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('rfp_access_token');
    localStorage.removeItem('rfp_refresh_token');
    storeLogout();
    showToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been logged out successfully'
    });
    navigate('/auth/login');
  };

  // Update user profile data in state
  const updateUser = (updatedUserData) => {
    const updatedUser = { ...user, ...updatedUserData };
    setUser(updatedUser);
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('rfp_refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post('/auth/refresh', { refreshToken });
      
      localStorage.setItem('rfp_access_token', response.data.token);
      return response.data.token;
    } catch (error) {
      logout();
      throw error;
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    signup,
    verifyOTP,
    resendOTP,
    login,
    verifyLoginOTP,
    logout,
    refreshToken,
    updateUser
  };
};
