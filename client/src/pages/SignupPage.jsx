import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotificationStore } from '../store/notificationStore';

// Debounce utility function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Constants
const LEGAL_LINKS = {
  terms: '/terms',
  privacy: '/privacy'
};

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[a-zA-Z\s\-'.]{2,50}$/;

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { showToast } = useNotificationStore();
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    company_name: '',
    password: '',
    confirm_password: '',
    terms: false
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  // Memoized password strength
  const passwordStrength = useMemo(() => {
    if (!formData.password) return 0;
    let strength = 0;
    if (formData.password.length >= 8) strength++;
    if (/[a-z]/.test(formData.password)) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/\d/.test(formData.password)) strength++;
    if (/[@$!%*?&]/.test(formData.password)) strength++;
    return strength;
  }, [formData.password]);

  const getStrengthText = (strength) => {
    if (strength < 2) return 'Weak';
    if (strength < 4) return 'Medium';
    return 'Strong';
  };

  const getStrengthColor = (strength) => {
    if (strength < 2) return '#DC2626';
    if (strength < 4) return '#F59E0B';
    return '#10B981';
  };

  // Validation function
  const validateField = useCallback((name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'full_name':
        if (!value.trim()) {
          newErrors.full_name = 'Full name is required';
        } else if (!NAME_REGEX.test(value)) {
          newErrors.full_name = 'Name must be 2-50 characters, letters only';
        } else {
          delete newErrors.full_name;
        }
        break;
        
      case 'email':
        const normalizedEmail = value.toLowerCase().trim();
        if (!normalizedEmail) {
          newErrors.email = 'Email is required';
        } else if (!EMAIL_REGEX.test(normalizedEmail)) {
          newErrors.email = 'Invalid email format';
        } else {
          delete newErrors.email;
        }
        break;
        
      case 'password':
        if (!value) {
          newErrors.password = 'Password is required';
        } else if (!PASSWORD_REGEX.test(value)) {
          newErrors.password = 'Password must be 8+ chars with uppercase, lowercase, number, and special character';
        } else {
          delete newErrors.password;
        }
        
        // Validate confirm password if exists
        if (formData.confirm_password) {
          if (value !== formData.confirm_password) {
            newErrors.confirm_password = 'Passwords do not match';
          } else {
            delete newErrors.confirm_password;
          }
        }
        break;
        
      case 'confirm_password':
        if (!value) {
          newErrors.confirm_password = 'Please confirm your password';
        } else if (value !== formData.password) {
          newErrors.confirm_password = 'Passwords do not match';
        } else {
          delete newErrors.confirm_password;
        }
        break;
        
      case 'terms':
        if (!value) {
          newErrors.terms = 'You must agree to continue';
        } else {
          delete newErrors.terms;
        }
        break;
    }
    
    setErrors(newErrors);
  }, [errors, formData.password, formData.confirm_password]);

  // Debounced validation
  const debouncedValidate = useMemo(
    () => debounce((name, value) => validateField(name, value), 300),
    [validateField]
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let fieldValue = type === 'checkbox' ? checked : value;
    
    // Normalize email as user types
    if (name === 'email') {
      fieldValue = fieldValue.toLowerCase().trim();
    }
    
    setFormData(prev => ({ ...prev, [name]: fieldValue }));
    debouncedValidate(name, fieldValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Rate limiting
    const now = Date.now();
    if (now - lastSubmitTime < 3000) {
      showToast({
        type: 'warning',
        title: 'Please Wait',
        message: 'Please wait a moment before submitting again.'
      });
      return;
    }
    
    // Validate all fields
    Object.entries(formData).forEach(([key, value]) => {
      validateField(key, value);
    });

    // Check for errors
    if (Object.keys(errors).length > 0) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fix the errors below.'
      });
      return;
    }

    setIsLoading(true);
    setLastSubmitTime(now);

    try {
      await signup({
        full_name: formData.full_name.trim(),
        email: formData.email.toLowerCase().trim(),
        company_name: formData.company_name.trim(),
        password: formData.password,
        confirm_password: formData.confirm_password
      });
      
      showToast({
        type: 'success',
        title: 'Success',
        message: 'Account created! Check your email for verification.'
      });
      
      navigate('/auth/verify-otp', { 
        state: { 
          email: formData.email,
          masked_email: `${formData.email[0]}***${formData.email.substring(formData.email.indexOf('@'))}`
        }
      });
      
    } catch (error) {
      // Minimal logging in production
      if (import.meta.env.DEV) {
        console.error('Signup error:', error);
      }
      
      // Handle validation errors
      if (error.response?.data?.error?.errors) {
        const serverErrors = {};
        error.response.data.error.errors.forEach(err => {
          serverErrors[err.field] = err.message;
        });
        setErrors(serverErrors);
      }
      
      showToast({
        type: 'error',
        title: 'Signup Failed',
        message: error.response?.data?.message || 'An error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Memoized form validity
  const isFormValid = useMemo(() => {
    return (
      formData.full_name.trim() &&
      formData.email.trim() &&
      formData.password &&
      formData.confirm_password &&
      formData.terms &&
      Object.keys(errors).length === 0
    );
  }, [formData, errors]);

  return (
    <div className="min-h-screen bg-[#FFFFE3] flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Form Column */}
        <div className="bg-white border border-[#CBCBCB] rounded-[14px] p-8 shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-[640] text-[#4A4A4A] mb-2">Create Account</h1>
            <p className="text-[#6D8196]">Join BidSense today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-[560] text-[#4A4A4A] mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                onBlur={() => validateField('full_name', formData.full_name)}
                aria-invalid={!!errors.full_name}
                aria-describedby={errors.full_name ? "full_name-error" : undefined}
                className={`w-full px-4 py-3 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#6D8196] transition-all ${
                  errors.full_name ? 'border-[#DC2626] bg-red-50' : 'border-[#CBCBCB]'
                }`}
                placeholder="Enter your full name"
                autoComplete="name"
              />
              {errors.full_name && (
                <p id="full_name-error" role="alert" className="mt-1 text-sm text-[#DC2626]">
                  {errors.full_name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-[560] text-[#4A4A4A] mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => validateField('email', formData.email)}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`w-full px-4 py-3 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#6D8196] transition-all ${
                  errors.email ? 'border-[#DC2626] bg-red-50' : 'border-[#CBCBCB]'
                }`}
                placeholder="your@email.com"
                autoComplete="email"
              />
              {errors.email && (
                <p id="email-error" role="alert" className="mt-1 text-sm text-[#DC2626]">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Company Name */}
            <div>
              <label htmlFor="company_name" className="block text-sm font-[560] text-[#4A4A4A] mb-2">
                Company Name (Optional)
              </label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#CBCBCB] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#6D8196] transition-all"
                placeholder="Your company"
                autoComplete="organization"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-[560] text-[#4A4A4A] mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => validateField('password', formData.password)}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : "password-strength"}
                  className={`w-full px-4 py-3 pr-12 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#6D8196] transition-all ${
                    errors.password ? 'border-[#DC2626] bg-red-50' : 'border-[#CBCBCB]'
                  }`}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {/* Password Strength */}
              {formData.password && (
                <div id="password-strength" className="mt-2">
                  <div className="flex justify-between text-xs text-[#6D8196] mb-1">
                    <span>Password Strength</span>
                    <span style={{ color: getStrengthColor(passwordStrength) }}>
                      {getStrengthText(passwordStrength)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(passwordStrength / 5) * 100}%`,
                        backgroundColor: getStrengthColor(passwordStrength)
                      }}
                    />
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p id="password-error" role="alert" className="mt-1 text-sm text-[#DC2626]">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm_password" className="block text-sm font-[560] text-[#4A4A4A] mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirm_password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  onBlur={() => validateField('confirm_password', formData.confirm_password)}
                  aria-invalid={!!errors.confirm_password}
                  aria-describedby={errors.confirm_password ? "confirm_password-error" : undefined}
                  className={`w-full px-4 py-3 pr-12 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#6D8196] transition-all ${
                    errors.confirm_password ? 'border-[#DC2626] bg-red-50' : 'border-[#CBCBCB]'
                  }`}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirm_password && (
                <p id="confirm_password-error" role="alert" className="mt-1 text-sm text-[#DC2626]">
                  {errors.confirm_password}
                </p>
              )}
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  aria-invalid={!!errors.terms}
                  aria-describedby={errors.terms ? "terms-error" : undefined}
                  className="mt-1 h-4 w-4 text-[#6D8196] focus:ring-[#6D8196] border-gray-300 rounded"
                />
                <div>
                  <span className="text-sm text-[#4A4A4A]">
                    I agree to the{' '}
                    <a 
                      href={LEGAL_LINKS.terms} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[#6D8196] hover:underline"
                    >
                      Terms
                    </a>
                    {' '}and{' '}
                    <a 
                      href={LEGAL_LINKS.privacy} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[#6D8196] hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </span>
                  {errors.terms && (
                    <p id="terms-error" role="alert" className="mt-1 text-sm text-[#DC2626]">
                      {errors.terms}
                    </p>
                  )}
                </div>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`w-full py-4 px-6 rounded-[10px] font-[600] text-[#FFFFE3] transition-all ${
                isFormValid && !isLoading
                  ? 'bg-[#6D8196] hover:bg-[#5A6B7F]'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={20} className="animate-spin" />
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#6D8196]">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-[#6D8196] hover:underline font-[560]">
              Sign In
            </Link>
          </div>
        </div>

        {/* Benefits Column - Keep existing code */}
        {/* ... */}
      </div>
    </div>
  );
};

export default SignupPage;
