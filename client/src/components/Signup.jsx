import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';

// Utility for email validation
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Main Signup component
const Signup = ({ onSignupSuccess }) => {
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  // State for field-level errors
  const [fieldErrors, setFieldErrors] = useState({});
  // State for form-level error
  const [formError, setFormError] = useState(null);
  // State for loading
  const [loading, setLoading] = useState(false);
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Ref for email input
  const emailRef = useRef(null);
  // Navigation hook
  const navigate = useNavigate();
  // Auth context
  const { register, error, clearError } = useAuth();

  // Effect: Autofocus email field
  useEffect(() => {
    if (emailRef.current) emailRef.current.focus();
  }, []);

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
    if (!formData.name) {
      errors.name = 'Name is required.';
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    }
    if (!formData.email) {
      errors.email = 'Email is required.';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter.';
    } else if (!/[a-z]/.test(formData.password)) {
      errors.password = 'Password must contain at least one lowercase letter.';
    } else if (!/[0-9]/.test(formData.password)) {
      errors.password = 'Password must contain at least one number.';
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    return errors;
  }, [formData]);

  // Debounced email validation
  const emailValidationTimeout = useRef(null);
  const handleEmailBlur = () => {
    if (emailValidationTimeout.current) clearTimeout(emailValidationTimeout.current);
    emailValidationTimeout.current = setTimeout(() => {
      setFieldErrors((prev) => ({ ...prev, email: validateEmail(formData.email) ? undefined : 'Please enter a valid email address.' }));
    }, 200);
  };

  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormError(null);
  }, []);

  // Handle password visibility toggle
  const handleTogglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleToggleConfirmPassword = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  // Handle form submit
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setFormError(null);
    clearError();
    const errors = validateFields();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setLoading(true);
    try {
      const result = await register({ name: formData.name, email: formData.email, password: formData.password });
      setLoading(false);
      if (onSignupSuccess) onSignupSuccess(result);
      // Redirect to login or dashboard
      navigate('/login', { state: { message: 'Account created successfully. Please log in.' } });
    } catch {
      setLoading(false);
      setFormError(error?.message || 'Signup failed');
    }
  }, [formData.name, formData.email, formData.password, register, clearError, navigate, onSignupSuccess, error, validateFields]);

  // Handle login navigation
  const handleLogin = useCallback(() => {
    setFormError(null);
    navigate('/login');
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
          <h1 className="text-3xl font-bold text-charcoal mb-2">Create Account</h1>
          <p className="text-soft-gray text-center">Join BidSense to streamline your procurement process</p>
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
          </div>
        )}
        {/* Signup Form */}
        <form onSubmit={handleSubmit} autoComplete="off" aria-label="Signup form">
          {/* Name Field */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-charcoal font-medium mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              autoComplete="name"
              className={`w-full px-4 py-3 rounded-lg border bg-white text-charcoal placeholder-soft-gray focus:border-muted-blue focus:ring-2 focus:ring-muted-blue focus:ring-opacity-20 transition outline-none ${fieldErrors.name ? 'border-red-400' : 'border-soft-gray'}`}
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!fieldErrors.name}
              aria-describedby={fieldErrors.name ? 'name-error' : undefined}
              disabled={loading}
              tabIndex={0}
            />
            {fieldErrors.name && (
              <span id="name-error" className="text-red-500 text-sm mt-1 block" role="alert">
                {fieldErrors.name}
              </span>
            )}
          </div>
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
              autoComplete="new-password"
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
            <p className="text-soft-gray text-sm mt-2">At least 8 characters, 1 uppercase, 1 lowercase, 1 number</p>
            {fieldErrors.password && (
              <span id="password-error" className="text-red-500 text-sm mt-1 block" role="alert">
                {fieldErrors.password}
              </span>
            )}
          </div>
          {/* Confirm Password Field */}
          <div className="mb-8 relative">
            <label htmlFor="confirmPassword" className="block text-charcoal font-medium mb-2">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              className={`w-full px-4 py-3 rounded-lg border bg-white text-charcoal placeholder-soft-gray focus:border-muted-blue focus:ring-2 focus:ring-muted-blue focus:ring-opacity-20 transition outline-none ${fieldErrors.confirmPassword ? 'border-red-400' : 'border-soft-gray'}`}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!fieldErrors.confirmPassword}
              aria-describedby={fieldErrors.confirmPassword ? 'confirm-password-error' : undefined}
              disabled={loading}
              tabIndex={0}
            />
            <button
              type="button"
              onClick={handleToggleConfirmPassword}
              className="absolute right-4 top-11 text-soft-gray hover:text-muted-blue focus:outline-none transition-colors"
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              tabIndex={0}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {fieldErrors.confirmPassword && (
              <span id="confirm-password-error" className="text-red-500 text-sm mt-1 block" role="alert">
                {fieldErrors.confirmPassword}
              </span>
            )}
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary w-full py-3 font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-muted-blue focus:ring-offset-2"
            disabled={loading}
            aria-disabled={loading}
            tabIndex={0}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
        {/* Login Link */}
        <div className="mt-8 text-center">
          <span className="text-soft-gray">Already have an account?</span>
          <button
            type="button"
            className="ml-2 text-muted-blue underline hover:text-charcoal focus:outline-none transition-colors"
            onClick={handleLogin}
            tabIndex={0}
            aria-label="Sign in"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Signup);