import React from 'react';

const RfpFilterBar = ({ filter, setFilter }) => {
    const statuses = ['All', 'Active', 'Draft', 'Evaluation', 'Closed'];

    return (
        <section className="max-w-7xl mx-auto mb-8 flex flex-wrap items-center gap-4">
            <div className="flex bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                {statuses.map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${filter === status
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="relative flex-1 min-w-[280px]">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    placeholder="Search projects..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium dark:text-white dark:placeholder-gray-500"
                />
            </div>
        </section>
    );
};

export default RfpFilterBar;
