import React from 'react';
import { useNavigate } from 'react-router-dom';

const ComparisonHeader = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div>
                <nav className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    <span
                        onClick={() => navigate('/dashboard')}
                        className="hover:text-indigo-600 cursor-pointer transition-colors"
                    >
                        Dashboard
                    </span>
                    <span className="mx-2">/</span>
                    <span
                        onClick={() => navigate('/proposals')}
                        className="hover:text-indigo-600 cursor-pointer transition-colors"
                    >
                        Proposals
                    </span>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 dark:text-white font-bold">Comparison Matrix</span>
                </nav>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                    Vendor <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Comparison Analysis</span>
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    AI-powered side-by-side comparison of top vendor proposals.
                </p>
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-3">
                <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Export Report
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                    Share Analysis
                </button>
            </div>
        </div>
    );
};

export default ComparisonHeader;
