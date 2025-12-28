import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';

// Utility for email validation
const validateEmail = (email) => {
  // Simple regex for email validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Main Login component
const Login = ({ onLoginSuccess, defaultEmail = '', loading: externalLoading = false, error: externalError = null }) => {
  // State for form data
  const [formData, setFormData] = useState(() => {
    const rememberedEmail = localStorage.getItem('bidsense_remembered_email');
    return {
      email: defaultEmail || rememberedEmail || '',
      password: '',
      rememberMe: !!rememberedEmail,
    };
  });
  // State for field-level errors
  const [fieldErrors, setFieldErrors] = useState({});
  // State for form-level error
  const [formError, setFormError] = useState(null);
  // State for success message
  const [successMessage, setSuccessMessage] = useState(null);
  // State for loading
  const [loading, setLoading] = useState(false);
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  // Ref for email input (for autofocus)
  const emailRef = useRef(null);
  // Navigation and location hooks
  const navigate = useNavigate();
  const location = useLocation();
  // Auth context
  const { login, error, clearError } = useAuth();

  // Effect: Autofocus email field
  useEffect(() => {
    if (emailRef.current) emailRef.current.focus();
  }, []);

  // Effect: Handle external error/loading props
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (externalError) setFormError(externalError);
    if (externalLoading) setLoading(true);
    // Check for success message from signup
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setFormError(null);
    }
  }, [externalError, externalLoading, location.state?.message]);

  // Effect: Auto-dismiss form error after 5s
  useEffect(() => {
    if (formError) {
      const timer = setTimeout(() => setFormError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [formError]);

  // Validate fields
  const validateFields = useCallback(() => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }
    return errors;
  }, [formData]);

  // Debounced email validation (for performance)
  const emailValidationTimeout = useRef(null);
  const handleEmailBlur = () => {
    if (emailValidationTimeout.current) clearTimeout(emailValidationTimeout.current);
    emailValidationTimeout.current = setTimeout(() => {
      setFieldErrors((prev) => ({ ...prev, email: validateEmail(formData.email) ? undefined : 'Please enter a valid email address.' }));
    }, 200);
  };

  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormError(null);
    setSuccessMessage(null);
  }, []);

  // Handle password visibility toggle
  const handleTogglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // Handle form submit
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);
    clearError();
    const errors = validateFields();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setLoading(true);
    try {
      // Never log password
      const result = await login(formData.email, formData.password, formData.rememberMe);
      setFormData((prev) => ({ ...prev, password: '' })); // Clear password
      setLoading(false);
      if (onLoginSuccess) onLoginSuccess(result);
      // Redirect to dashboard or intended page
      const redirectTo = location.state?.from || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch {
      setLoading(false);
      setFormData((prev) => ({ ...prev, password: '' })); // Clear password
      // Error is already set in context, but for local display
      setFormError(error?.message || 'Login failed');
    }
  }, [formData.email, formData.password, formData.rememberMe, login, clearError, navigate, location.state, onLoginSuccess, error, validateFields]);

  // Handle forgot password navigation
  const handleForgotPassword = useCallback(() => {
    navigate(`/forgot-password${formData.email ? `?email=${encodeURIComponent(formData.email)}` : ''}`);
  }, [formData.email, navigate]);

  // Handle sign up navigation
  const handleSignUp = useCallback(() => {
    setFormError(null);
    navigate('/register');
  }, [navigate]);

  // Accessibility: ARIA live region for error/success
  const ariaLive = useMemo(() => (formError ? 'assertive' : 'polite'), [formError]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFFE3', fontFamily: 'Inter, sans-serif' }}>
      <div className="w-full max-w-md p-8 rounded-lg border border-soft-gray" style={{ backgroundColor: '#FFFFE3' }}>
        {/* Logo/Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#4A4A4A' }}>
            <span className="text-xl font-bold text-white">B</span>
          </div>
          <h1 className="text-3xl font-bold text-charcoal mb-2">Welcome Back</h1>
          <p className="text-soft-gray text-center">Sign in to your BidSense account</p>
        </div>
        {/* Error Message */}
        {formError && (
          <div
            className="alert-error mb-6"
            role="alert"
            aria-live={ariaLive}
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">Error</span>
            </div>
            <p className="mt-1">{formError}</p>
            {formError.includes('Network') && (
              <button
                type="button"
                className="mt-2 underline hover:text-charcoal focus:outline-none"
                onClick={handleSubmit}
                aria-label="Retry login"
              >
                Retry
              </button>
            )}
          </div>
        )}
        {/* Success Message */}
        {successMessage && (
          <div
            className="alert-success mb-6"
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">Success!</span>
            </div>
            <p className="mt-1">{successMessage}</p>
          </div>
        )}
        {/* Login Form */}
        <form onSubmit={handleSubmit} autoComplete="off" aria-label="Login form">
          {/* Email Field */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-charcoal font-medium mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              ref={emailRef}
              type="email"
              id="email"
              name="email"
              autoComplete="username"
              className={`w-full px-4 py-3 rounded-lg border bg-white text-charcoal placeholder-soft-gray focus:border-muted-blue focus:ring-2 focus:ring-muted-blue focus:ring-opacity-20 transition outline-none ${fieldErrors.email ? 'border-red-400' : 'border-soft-gray'}`}
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleEmailBlur}
              aria-required="true"
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              disabled={loading}
              tabIndex={0}
            />
            {fieldErrors.email && (
              <span id="email-error" className="text-red-500 text-sm mt-1 block" role="alert">
                {fieldErrors.email}
              </span>
            )}
          </div>
          {/* Password Field */}
          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-charcoal font-medium mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              autoComplete="current-password"
              className={`w-full px-4 py-3 rounded-lg border bg-white text-charcoal placeholder-soft-gray focus:border-muted-blue focus:ring-2 focus:ring-muted-blue focus:ring-opacity-20 transition outline-none ${fieldErrors.password ? 'border-red-400' : 'border-soft-gray'}`}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
              disabled={loading}
              tabIndex={0}
            />
            <button
              type="button"
              onClick={handleTogglePassword}
              className="absolute right-4 top-11 text-soft-gray hover:text-muted-blue focus:outline-none transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={0}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <p className="text-soft-gray text-sm mt-2">Minimum 8 characters</p>
            {fieldErrors.password && (
              <span id="password-error" className="text-red-500 text-sm mt-1 block" role="alert">
                {fieldErrors.password}
              </span>
            )}
          </div>
          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between mb-8">
            <label className="flex items-center text-charcoal text-sm">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={loading}
                className="mr-3 w-4 h-4 accent-muted-blue rounded focus:ring-muted-blue focus:ring-2"
                tabIndex={0}
                aria-label="Remember me"
              />
              Remember me
            </label>
            <button
              type="button"
              className="text-muted-blue text-sm underline hover:text-charcoal focus:outline-none transition-colors"
              onClick={handleForgotPassword}
              tabIndex={0}
              aria-label="Forgot password"
            >
              Forgot password?
            </button>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary w-full py-3 font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-muted-blue focus:ring-offset-2"
            disabled={loading || Object.values(fieldErrors).some(error => error !== undefined)}
            aria-disabled={loading || Object.values(fieldErrors).some(error => error !== undefined)}
            tabIndex={0}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        {/* Sign Up Link */}
        <div className="mt-8 text-center">
          <span className="text-soft-gray">Don't have an account?</span>
          <button
            type="button"
            className="ml-2 text-muted-blue underline hover:text-charcoal focus:outline-none transition-colors"
            onClick={handleSignUp}
            tabIndex={0}
            aria-label="Sign up"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Login);
