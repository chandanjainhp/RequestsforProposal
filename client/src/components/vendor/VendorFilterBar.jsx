import React from 'react';

const VendorFilterBar = ({ searchTerm, setSearchTerm, filterStatus, setFilterStatus }) => {
    return (
        <div className="bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800 p-2 mb-6 flex flex-col md:flex-row items-center gap-4 justify-between">
            <div className="relative w-full md:w-96">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    placeholder="Search vendors by name or industry..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-900 border-none rounded-xl outline-none font-medium transition-all shadow-sm focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 dark:text-white"
                />
            </div>

            <div className="flex items-center space-x-1 w-full md:w-auto bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm border border-gray-100 dark:border-gray-700">
                {['All', 'Active', 'Pending', 'Inactive'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterStatus === status
                            ? 'bg-gray-900 dark:bg-indigo-600 text-white shadow-md'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                        {status}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default VendorFilterBar;
