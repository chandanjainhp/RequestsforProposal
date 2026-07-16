import React from 'react';
import { useNavigate } from 'react-router-dom';

const VendorHeader = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Vendor Directory</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Manage approved suppliers and monitor performance scores.</p>
            </div>
            <button
                onClick={() => navigate('/vendors/add')}
                className="flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 transition-all transform hover:-translate-y-0.5"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
                Add Vendor
            </button>
        </div>
    );
};

export default VendorHeader;
