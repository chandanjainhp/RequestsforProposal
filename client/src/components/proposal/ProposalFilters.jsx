import React from 'react';

const ProposalFilters = ({ searchTerm, setSearchTerm }) => {
    return (
        <section className="bg-white dark:bg-gray-900/50 backdrop-blur-xl p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-8 flex flex-col md:flex-row gap-4 items-center transition-colors">
            <div className="relative flex-1 w-full">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    placeholder="Search by vendor or RFP title..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white dark:placeholder-gray-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex items-center space-x-2 w-full md:w-auto">
                <select className="flex-1 md:w-40 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 outline-none focus:border-indigo-500 transition-colors">
                    <option>All Statuses</option>
                    <option>Scored</option>
                    <option>Under Review</option>
                    <option>Pending</option>
                </select>
                <select className="flex-1 md:w-40 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 outline-none focus:border-indigo-500 transition-colors">
                    <option>Sort by Score</option>
                    <option>Newest First</option>
                    <option>Budget: Low to High</option>
                </select>
            </div>
        </section>
    );
};

export default ProposalFilters;
