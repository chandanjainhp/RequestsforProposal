import React from 'react';
import { useNavigate } from 'react-router-dom';

const RfpListHeader = () => {
    const navigate = useNavigate();

    return (
        <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">RFP Projects</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Manage your active procurement cycles and AI-driven evaluations.</p>
            </div>
            <button
                onClick={() => navigate('/rfps/create')}
                className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
                Create New RFP
            </button>
        </header>
    );
};

export default RfpListHeader;
