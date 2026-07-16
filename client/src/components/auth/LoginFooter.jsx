import React from 'react';
import { Link } from 'react-router-dom';

const LoginFooter = () => {
    return (
        <>
            <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                <p className="text-sm text-gray-500">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                        Request access
                    </Link>
                </p>
            </div>

            {/* Footer Branding for Mobile */}
            <div className="mt-8 text-center lg:hidden">
                <p className="text-sm text-gray-600 font-medium tracking-wide uppercase">
                    BidSense © 2026
                </p>
            </div>
        </>
    );
};

export default LoginFooter;
