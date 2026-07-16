import React from 'react';
import { Link } from 'react-router-dom';

const BackToLoginLink = () => {
    return (
        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <Link
                to="/login"
                className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-indigo-400 transition-colors group"
            >
                <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Sign In
            </Link>
        </div>
    );
};

export default BackToLoginLink;
