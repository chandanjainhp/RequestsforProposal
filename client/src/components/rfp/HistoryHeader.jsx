import React from 'react';

const HistoryHeader = () => {
    return (
        <header className="max-w-5xl mx-auto mb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Audit History</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Track every action, update, and decision in your procurement workspace.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search history..."
                            className="pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 outline-none w-64 dark:text-white dark:placeholder-gray-500 transition-colors"
                        />
                        <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default HistoryHeader;
