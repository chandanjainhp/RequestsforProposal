import React from 'react';

const ForgotPasswordHeader = () => {
    return (
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-2xl mb-6 border border-gray-700">
                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
                Forgot your password?
            </h2>
            <p className="text-gray-500 mt-2">
                No worries. Enter your email and we'll send you a reset link.
            </p>
        </div>
    );
};

export default ForgotPasswordHeader;
