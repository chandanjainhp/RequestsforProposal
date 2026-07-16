import React from 'react';

const RfpSelection = ({ rfps, selectedRfp, setSelectedRfp }) => {
    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs mr-3">1</span>
                Select RFP Document
            </h3>
            <div className="space-y-3">
                {rfps.map(rfp => (
                    <div
                        key={rfp.id}
                        onClick={() => setSelectedRfp(rfp.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${selectedRfp === rfp.id ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20 ring-1 ring-indigo-600 dark:ring-indigo-500' : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700'}`}
                    >
                        <div>
                            <p className={`font-bold ${selectedRfp === rfp.id ? 'text-indigo-900 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'}`}>{rfp.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Status: <span className="font-medium text-gray-700 dark:text-gray-400">{rfp.status}</span></p>
                        </div>
                        {selectedRfp === rfp.id && (
                            <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RfpSelection;
