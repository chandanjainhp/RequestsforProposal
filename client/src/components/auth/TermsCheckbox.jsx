import React from 'react';
import { Link } from 'react-router-dom';

const TermsCheckbox = ({ checked, onChange, name = "agreeToTerms" }) => {
    return (
        <div className="flex items-start">
            <div className="flex items-center h-5">
                <input
                    name={name}
                    id="terms"
                    type="checkbox"
                    required
                    checked={checked}
                    onChange={onChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                />
            </div>
            <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-600 cursor-pointer">
                    I agree to the <Link to="/terms" className="text-indigo-600 font-semibold hover:underline">Terms</Link> and <Link to="/privacy" className="text-indigo-600 font-semibold hover:underline">Privacy Policy</Link>
                </label>
                <p className="text-xs text-gray-400 mt-1">Access requests are reviewed by administrators.</p>
            </div>
        </div>
    );
};

export default TermsCheckbox;
