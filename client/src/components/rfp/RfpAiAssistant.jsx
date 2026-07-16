import React from 'react';

const RfpAiAssistant = ({ isAiLoading, aiInsight, onAiAction }) => {
    const actions = [
        'Improve clarity',
        'Detect missing sections',
        'Optimize evaluation criteria',
        'Generate vendor questions'
    ];

    return (
        <div className="w-full lg:w-80 xl:w-96 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sticky top-28 transition-colors duration-300">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">BidSense AI</h2>
                        <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Active Assistant</p>
                    </div>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-6">
                    Use BidSense AI to refine your content and ensure competitive vendor responses.
                </p>

                <div className="space-y-2 mb-8">
                    {actions.map((action) => (
                        <button
                            key={action}
                            onClick={() => onAiAction(action)}
                            className="w-full flex items-center px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl text-left text-sm font-bold text-gray-700 dark:text-gray-300 hover:border-indigo-500/30 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all group"
                        >
                            <span className="w-2 h-2 rounded-full bg-cyan-400 mr-3 group-hover:scale-125 transition-all"></span>
                            {action}
                        </button>
                    ))}
                </div>

                {/* AI Response Placeholder */}
                <div className="relative bg-gray-900 rounded-2xl p-6 min-h-[180px] flex flex-col justify-center overflow-hidden">
                    <div className="absolute top-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full -ml-12 -mt-12 blur-3xl"></div>

                    {isAiLoading ? (
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Analyzing RFP...</p>
                        </div>
                    ) : aiInsight ? (
                        <div className="animate-fade-in">
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3 block">BidSense Insight</span>
                            <p className="text-sm text-indigo-50 font-medium leading-relaxed italic">
                                "{aiInsight}"
                            </p>
                        </div>
                    ) : (
                        <div className="text-center opacity-40">
                            <p className="text-xs text-gray-400 font-medium italic">Select an action above to trigger AI analysis of your draft.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RfpAiAssistant;
