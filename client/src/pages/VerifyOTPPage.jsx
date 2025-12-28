import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Loader2, RefreshCw } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotificationStore } from '../store/notificationStore';

const VerifyOTPPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, resendOTP } = useAuth();
  const { showToast } = useNotificationStore();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  
  const inputsRef = useRef([]);
  const countdownInterval = useRef(null);

  const email = location.state?.email || '';
  const maskedEmail = location.state?.masked_email || '';

  // Handle OTP input changes
  const handleInputChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    const fullOtp = newOtp.join('');
    if (fullOtp.length === 6) {
      handleVerify(fullOtp);
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      
      // Focus on last input
      inputsRef.current[5]?.focus();
      
      // Auto-submit
      handleVerify(pastedData);
    } else {
      // Fill what we can
      const newOtp = [...otp];
      for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
    }
  };

  // Verify OTP
  const handleVerify = async (otpCode = otp.join('')) => {
    if (otpCode.length !== 6) return;

    setIsLoading(true);

    try {
      await verifyOTP({
        email: email,
        otp_code: otpCode
      });
      
      showToast({
        type: 'success',
        title: 'Success',
        message: 'Email verified successfully! Welcome to BidSense.'
      });
      
      // Navigation will be handled by route protection
      
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
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (resendDisabled) return;

    setIsResending(true);

    try {
      await resendOTP({ email: email });
      
      showToast({
        type: 'success',
        title: 'OTP Resent',
        message: 'New OTP sent to your email.'
      });
      
      // Start countdown
      setResendCountdown(60);
      setResendDisabled(true);
      
    } catch (error) {
      console.error('Resend OTP error:', error);
      showToast({
        type: 'error',
        title: 'Resend Failed',
        message: error.message || 'Failed to send new OTP. Please try again.'
      });
    } finally {
      setIsResending(false);
    }
  };

  // Countdown timer
  useEffect(() => {
    if (resendCountdown > 0) {
      countdownInterval.current = setInterval(() => {
        setResendCountdown(prev => prev - 1);
      }, 1000);
    } else if (resendCountdown === 0 && resendDisabled) {
      setResendDisabled(false);
      clearInterval(countdownInterval.current);
    }

    return () => clearInterval(countdownInterval.current);
  }, [resendCountdown, resendDisabled]);

  // Check if OTP expired (10 minutes)
  useEffect(() => {
    const checkExpiration = () => {
      const now = new Date();
      const otpTime = new Date(location.state?.otpTime || Date.now());
      const diffMinutes = (now - otpTime) / (1000 * 60);
      
      if (diffMinutes > 10) {
        setIsExpired(true);
      }
    };

    checkExpiration();
    const interval = setInterval(checkExpiration, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [location.state?.otpTime]);

  // Focus first input on mount
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const allFilled = otp.every(digit => digit !== '');
  const hasErrors = otp.some(digit => digit === '');

  return (
    <div className="min-h-screen bg-[#FFFFE3] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-[#CBCBCB] rounded-[14px] p-8 shadow-lg">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-[640] text-[#4A4A4A] mb-2">Verify Your Email</h1>
          <p className="text-[#6D8196]">
            We've sent a 6-digit code to <span className="font-[560]">{maskedEmail || email}</span>
          </p>
          {isExpired && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-[10px]">
              <p className="text-sm text-red-600">OTP has expired. Please request a new one.</p>
            </div>
          )}
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
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-16 h-16 text-center text-2xl font-[600] border-2 rounded-[12px] transition-all duration-200 ${
                  digit
                    ? 'bg-[#FFFFE3] border-[#6D8196] text-[#4A4A4A]'
                    : 'border-[#CBCBCB] text-[#6D8196]'
                } ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#6D8196]'
                } focus:outline-none focus:border-[#6D8196] focus:scale-105`}
                disabled={isLoading}
                style={{
                  boxShadow: digit ? '0 4px 6px rgba(109, 129, 150, 0.1)' : 'none'
                }}
              />
            ))}
          </div>
          
          {/* Error State Animation */}
          {hasErrors && (
            <div className="flex justify-center mt-4">
              <div className="animate-shake">
                <p className="text-sm text-[#DC2626]">Please enter all 6 digits</p>
              </div>
            </div>
          )}
        </div>

        {/* Timer */}
        <div className="text-center mb-6">
          <p className={`text-sm ${
            resendCountdown < 10 ? 'text-red-600 font-[560]' : 'text-[#6D8196]'
          }`}>
            {resendDisabled 
              ? `Code expires in ${resendCountdown}s` 
              : 'Code expires in 10 minutes'
            }
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => handleVerify()}
            disabled={!allFilled || isLoading || isExpired}
            className={`w-full py-4 px-6 rounded-[10px] font-[600] text-[#FFFFE3] transition-all duration-300 ${
              allFilled && !isLoading && !isExpired
                ? 'bg-[#6D8196] hover:bg-[#5A6B7F] transform hover:scale-[1.02] hover:shadow-lg'
                : 'bg-gray-400 cursor-not-allowed opacity-50'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 size={20} className="animate-spin" />
                <span>Verifying...</span>
              </div>
            ) : (
              'Verify Email'
            )}
          </button>

          <div className="flex justify-center">
            <button
              onClick={handleResend}
              disabled={resendDisabled || isResending || isExpired}
              className={`text-[#6D8196] hover:text-[#4A4A4A] font-[560] transition-colors ${
                resendDisabled || isResending || isExpired
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:underline'
              }`}
            >
              {isResending ? (
                <div className="flex items-center space-x-2">
                  <Loader2 size={16} className="animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : resendDisabled ? (
                `Resend OTP (${resendCountdown}s)`
              ) : (
                'Resend OTP'
              )}
            </button>
          </div>
        </div>

        {/* Alternative Actions */}
        <div className="mt-8 pt-6 border-t border-[#CBCBCB]">
          <div className="text-center space-y-2">
            <p className="text-sm text-[#6D8196]">Having trouble?</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link
                to="/auth/login"
                className="text-[#6D8196] hover:text-[#4A4A4A] font-[560] text-sm underline"
              >
                Try logging in
              </Link>
              <span className="text-[#CBCBCB]">•</span>
              <button
                onClick={() => navigate('/signup')}
                className="text-[#6D8196] hover:text-[#4A4A4A] font-[560] text-sm underline"
              >
                Create new account
              </button>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="mt-6 p-4 bg-[#FFFFE3] border border-[#CBCBCB] rounded-[10px]">
          <p className="text-xs text-[#4A4A4A] text-center">
            Need help? Contact us at{' '}
            <a href="mailto:support@bidsense.com" className="text-[#6D8196] hover:text-[#4A4A4A] underline">
              support@bidsense.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTPPage;