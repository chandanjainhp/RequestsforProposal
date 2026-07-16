import React from 'react';

const DashboardHeader = ({ onCreateRfp }) => {
    return (
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Welcome back 👋</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Here’s what’s happening with your RFPs today.</p>
            </div>
            <button
                onClick={onCreateRfp}
                className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 transition-all duration-200 active:scale-95"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
                Create New RFP
            </button>
        </header>
    );
};

export default DashboardHeader;
