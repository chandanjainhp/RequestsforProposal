import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotificationStore } from '../store/notificationStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, verifyLoginOTP } = useAuth();
  const { showToast } = useNotificationStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  
  const inputsRef = React.useRef([]);

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.email = 'Please provide a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
        
      case 'password':
        if (!value) {
          newErrors.password = 'Password is required';
        } else {
          delete newErrors.password;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Real-time validation
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Build errors object synchronously
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    // Update errors state
    setErrors(newErrors);

    // Check if there are any errors
    if (Object.keys(newErrors).length > 0) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fix the errors below before submitting.'
      });
      return;
    }

    setIsLoading(true);

    try {
      await login({
        email: formData.email.toLowerCase().trim(),
        password: formData.password
      });
      
      showToast({
        type: 'success',
        title: 'Success',
        message: 'OTP sent to your email for verification.'
      });
      
      setShowOTP(true);
      
    } catch (error) {
      console.error('Login error:', error);
      showToast({
        type: 'error',
        title: 'Login Failed',
        message: error.message || 'Invalid credentials. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleOTPPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      
      // Focus on last input
      inputsRef.current[5]?.focus();
      
      // Auto-submit
      handleVerifyOTP(pastedData);
    } else {
      // Fill what we can
      const newOtp = [...otp];
      for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
    }
  };

  const handleVerifyOTP = async (otpCode = otp.join('')) => {
    if (otpCode.length !== 6) return;

    setOtpLoading(true);

    try {
      await verifyLoginOTP({
        email: formData.email.toLowerCase().trim(),
        otp_code: otpCode
      });
      
      showToast({
        type: 'success',
        title: 'Success',
        message: 'Login successful!'
      });
      
      // Hide OTP form and navigate
      setShowOTP(false);
      navigate('/app/dashboard');
      
    } catch (error) {
      console.error('OTP verification error:', error);
      
      // Clear OTP inputs on error
      setOtp(['', '', '', '', '', '']);
      inputsRef.current[0]?.focus();
      
      showToast({
        type: 'error',
        title: 'Verification Failed',
        message: error.message || 'Invalid OTP. Please try again.'
      });

      // If no OTP found, go back to login form
      if (error.message && error.message.includes('No OTP found')) {
        setShowOTP(false);
      }
    } finally {
      setOtpLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.email.trim() &&
      /\S+@\S+\.\S+/.test(formData.email) &&
      formData.password
    );
  };

  const isOTPValid = () => {
    return otp.every(digit => digit !== '');
  };

  return (
    <div className="min-h-screen bg-[#FFFFE3] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-[#CBCBCB] rounded-[14px] p-8 shadow-lg">
        
        {!showOTP ? (
          <>
            {/* Login Form */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-[640] text-[#4A4A4A] mb-2">Welcome Back</h1>
              <p className="text-[#6D8196]">Sign in to your BidSense account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-[560] text-[#4A4A4A] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => validateField('email', formData.email)}
                  className={`w-full px-4 py-3 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#6D8196] focus:border-transparent transition-all ${
                    errors.email ? 'border-[#DC2626] bg-red-50' : 'border-[#CBCBCB]'
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-[#DC2626]">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-[560] text-[#4A4A4A] mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => validateField('password', formData.password)}
                    className={`w-full px-4 py-3 pr-12 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#6D8196] focus:border-transparent transition-all ${
                      errors.password ? 'border-[#DC2626] bg-red-50' : 'border-[#CBCBCB]'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff size={20} className="text-[#6D8196] hover:text-[#4A4A4A]" />
                    ) : (
                      <Eye size={20} className="text-[#6D8196] hover:text-[#4A4A4A]" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-[#DC2626]">{errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid() || isLoading}
                className={`w-full py-4 px-6 rounded-[10px] font-[600] text-[#FFFFE3] transition-all duration-300 ${
                  isFormValid() && !isLoading
                    ? 'bg-[#6D8196] hover:bg-[#5A6B7F] transform hover:scale-[1.02]'
                    : 'bg-gray-400 cursor-not-allowed opacity-50'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 size={20} className="animate-spin" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6 p-4 bg-[#FFFFE3] border border-[#CBCBCB] rounded-[10px]">
              <p className="text-sm text-[#4A4A4A] text-center">
                Don't have an account?{' '}
                <Link to="/auth/signup" className="text-[#6D8196] hover:text-[#4A4A4A] font-[560] underline">
                  Sign up here
                </Link>
              </p>
            </div>
          </>
        ) : (
          <>
            {/* OTP Verification */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-[640] text-[#4A4A4A] mb-2">Verify Your Login</h1>
              <p className="text-[#6D8196]">
                We've sent a 6-digit code to <span className="font-[560]">{formData.email}</span>
              </p>
            </div>

            {/* OTP Input */}
            <div className="mb-8">
              <div className="flex justify-center space-x-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleOTPKeyDown(index, e)}
                    onPaste={handleOTPPaste}
                    className={`w-16 h-16 text-center text-2xl font-[600] border-2 rounded-[12px] transition-all duration-200 ${
                      digit
                        ? 'bg-[#FFFFE3] border-[#6D8196] text-[#4A4A4A]'
                        : 'border-[#CBCBCB] text-[#6D8196]'
                    } ${
                      otpLoading ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#6D8196]'
                    } focus:outline-none focus:border-[#6D8196] focus:scale-105`}
                    disabled={otpLoading}
                    style={{
                      boxShadow: digit ? '0 4px 6px rgba(109, 129, 150, 0.1)' : 'none'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <button
              onClick={() => handleVerifyOTP()}
              disabled={!isOTPValid() || otpLoading}
              className={`w-full py-4 px-6 rounded-[10px] font-[600] text-[#FFFFE3] transition-all duration-300 ${
                isOTPValid() && !otpLoading
                  ? 'bg-[#6D8196] hover:bg-[#5A6B7F] transform hover:scale-[1.02]'
                  : 'bg-gray-400 cursor-not-allowed opacity-50'
              }`}
            >
              {otpLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 size={20} className="animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : (
                'Verify & Sign In'
              )}
            </button>

            {/* Alternative Actions */}
            <div className="mt-6 pt-6 border-t border-[#CBCBCB]">
              <div className="text-center space-y-2">
                <p className="text-sm text-[#6D8196]">Having trouble?</p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <button
                    onClick={() => setShowOTP(false)}
                    className="text-[#6D8196] hover:text-[#4A4A4A] font-[560] text-sm underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;