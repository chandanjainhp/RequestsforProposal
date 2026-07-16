import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProposalHeader = () => {
    const navigate = useNavigate();

    return (
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Proposal Inbox</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Review and manage vendor submissions across all active RFPs.</p>
            </div>
            <div className="flex items-center space-x-3">
                <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm shadow-sm">
                    Export CSV
                </button>
                <button
                    onClick={() => navigate('/proposals/compare')}
                    className="px-4 py-2 bg-indigo-600 dark:bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-all text-sm shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20"
                >
                    Compare Proposals
                </button>
            </div>
        </header>
    );
};

export default ProposalHeader;
