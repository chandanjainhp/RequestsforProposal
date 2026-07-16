import React from 'react';

const AiPreferences = ({ isAiAutoPilot, setIsAiAutoPilot }) => {
    return (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center space-x-3 mb-8">
                <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-xl">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">BidSense AI Configuration</h3>
            </div>

            <div className="space-y-6">
                {/* AI Toggle */}
                <div className="flex items-center justify-between p-6 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
                    <div className="max-w-md">
                        <h4 className="font-bold text-indigo-900 dark:text-indigo-200 mb-1">AI Autopilot Mode</h4>
                        <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70 font-medium leading-relaxed">
                            Allow BidSense to automatically draft initial evaluation summaries as soon as proposals are submitted.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsAiAutoPilot(!isAiAutoPilot)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isAiAutoPilot ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAiAutoPilot ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>

                {/* AI Detail Level */}
                <div className="space-y-3 pt-4">
                    <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Analysis Depth</label>
                    <div className="grid grid-cols-3 gap-4">
                        {['Standard', 'Advanced', 'Full Audit'].map((level) => (
                            <button
                                key={level}
                                className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all ${level === 'Advanced'
                                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                    : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-white/50 dark:hover:bg-gray-800'
                                    }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiPreferences;
