import React from 'react';

const RfpEditorHeader = ({ rfpTitle, setRfpTitle, status, deadline, setDeadline, onSave, onPublish }) => {
    return (
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 px-6 py-4 transition-all duration-300">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col">
                    <nav className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-1 space-x-2">
                        <span className="hover:text-indigo-600 transition-colors cursor-pointer">Dashboard</span>
                        <span>/</span>
                        <span className="text-gray-900">RFP Editor</span>
                    </nav>
                    <div className="flex items-center space-x-3">
                        <input
                            type="text"
                            value={rfpTitle}
                            onChange={(e) => setRfpTitle(e.target.value)}
                            className="bg-transparent text-xl font-bold text-gray-900 dark:text-white border-none focus:ring-0 p-0 placeholder-gray-400 max-w-md"
                        />
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${status === 'Draft' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                            }`}>
                            {status}
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-0.5">Deadline</label>
                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 border border-transparent rounded-lg px-3 py-1.5 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        />
                    </div>
                    <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 mx-2 hidden md:block"></div>
                    <button
                        onClick={onSave}
                        className="px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all"
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={onPublish}
                        className="px-6 py-2.5 text-sm font-bold text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:scale-105 rounded-xl shadow-lg shadow-gray-900/20 dark:shadow-white/10 transition-all"
                    >
                        Publish RFP
                    </button>
                </div>
            </div>
        </header>
    );
};

export default RfpEditorHeader;
