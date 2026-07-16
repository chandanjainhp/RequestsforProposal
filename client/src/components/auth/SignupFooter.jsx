import React from 'react';
import { Link } from 'react-router-dom';

const SignupFooter = () => {
    return (
        <>
            <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                <p className="text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link to="/login" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>

            <p className="mt-8 text-center text-xs text-gray-600 font-medium uppercase tracking-widest">
                BidSense Procurement Intelligence
            </p>
        </>
    );
};

export default SignupFooter;
