import React from 'react';

const HistoryFilterBar = () => {
    return (
        <section className="max-w-5xl mx-auto bg-white dark:bg-gray-900/50 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-8 flex flex-wrap gap-4 items-center transition-colors">
            <select className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg px-3 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 outline-none focus:border-indigo-500 transition-all cursor-pointer">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Custom Range</option>
            </select>
            <select className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg px-3 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 outline-none focus:border-indigo-500 transition-all cursor-pointer">
                <option>All Action Types</option>
                <option>RFP Changes</option>
                <option>AI Analysis</option>
                <option>Vendor Actions</option>
            </select>
            <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 ml-auto transition-colors">
                Clear Filters
            </button>
        </section>
    );
};

export default HistoryFilterBar;
