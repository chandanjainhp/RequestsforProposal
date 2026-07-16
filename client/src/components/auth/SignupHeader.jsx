import React from 'react';

const SignupHeader = () => {
    return (
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-800 rounded-xl border border-gray-700 mb-4">
                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
                Request Access to <span className="text-indigo-400">BidSense</span>
            </h2>
            <p className="mt-2 text-gray-500">
                Start managing RFPs smarter with AI-driven insights.
            </p>
        </div>
    );
};

export default SignupHeader;
