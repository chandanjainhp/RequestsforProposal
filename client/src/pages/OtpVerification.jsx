import React, { useState } from 'react';
import OtpHeader from '../components/auth/OtpHeader';
import OtpInputGroup from '../components/auth/OtpInputGroup';
import OtpTimer from '../components/auth/OtpTimer';
import OtpActions from '../components/auth/OtpActions';
import OtpFooter from '../components/auth/OtpFooter';

const OtpVerification = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API verification
    setTimeout(() => setIsLoading(false), 2000);
  };

  const handleResend = () => {
    setIsResending(true);
    // Simulate resend API
    setTimeout(() => setIsResending(false), 1500);
  };

  const isFormValid = !otp.some(v => v === "");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">

        {/* --- Card Container --- */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10 text-center">

          <OtpHeader email="user@company.com" />

          {/* OTP Input Form */}
          <form onSubmit={handleVerify} className="space-y-8">

            <OtpInputGroup otp={otp} setOtp={setOtp} />

            {/* Timer & Resend Section */}
            <OtpTimer onResend={handleResend} isResending={isResending} />

            {/* Action Buttons */}
            <OtpActions isLoading={isLoading} isDisabled={!isFormValid || isLoading} />

          </form>
        </div>

        <OtpFooter />
      </div>
    </div>
  );
};

export default OtpVerification;