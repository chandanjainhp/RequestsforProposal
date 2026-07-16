import React from 'react';
import { useNavigate } from 'react-router-dom';

const AddVendorHeader = () => {
    const navigate = useNavigate();

    return (
        <div className="mb-8">
            <button
                onClick={() => navigate('/vendors')}
                className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center mb-4 transition-colors text-sm font-bold"
            >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                Back to Vendors
            </button>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Add New Vendor</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Register a new supplier for approval and tracking.</p>
        </div>
    );
};

export default AddVendorHeader;
