import React from 'react';
import logo from '../../assets/logo-round.jpg';

const AuthSideBanner = () => {
    return (
        <div className="hidden lg:flex lg:w-1/2 bg-gray-950 text-white p-8 lg:p-16 flex-col justify-center border-r border-gray-800">
            <div className="max-w-md mx-auto lg:mx-0">
                {/* Logo Placeholder */}
                <div className="mb-10 flex items-center space-x-3">
                    <img src={logo} alt="BidSense Logo" className="w-12 h-12 rounded-full border-2 border-gray-700" />
                    <span className="text-2xl font-bold tracking-tight">BidSense</span>
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                    Welcome to <span className="text-indigo-400">BidSense</span>
                </h1>
                <p className="text-lg text-gray-400 mb-10">
                    AI-powered RFP Management & Intelligent Bid Scoring.
                </p>

                <ul className="space-y-6">
                    {[
                        "Automated RFP creation",
                        "Vendor & proposal management",
                        "AI-driven comparison & scoring",
                        "Data-backed procurement decisions"
                    ].map((feature, index) => (
                        <li key={index} className="flex items-center space-x-3">
                            <div className="bg-emerald-500/20 p-1 rounded-full">
                                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-gray-300 font-medium">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AuthSideBanner;
