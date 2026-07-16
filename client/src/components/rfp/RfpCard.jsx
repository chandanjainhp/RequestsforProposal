import React from 'react';
import { useNavigate } from 'react-router-dom';

const RfpCard = ({ rfp }) => {
    const navigate = useNavigate();

    const handleEditDraft = () => {
        navigate(`/rfps/editor?id=${rfp.id}`);
    };

    const handleViewAnalysis = () => {
        navigate(`/rfps/analytics?id=${rfp.id}`);
    };

    return (
        <div className="group bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">

            {/* Card Header */}
            <div className="p-6 pb-4">
                <div className="flex justify-between items-start mb-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${rfp.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' :
                        rfp.status === 'Draft' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' :
                            rfp.status === 'Evaluation' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' :
                                'bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20'
                        }`}>
                        {rfp.status}
                    </span>
                    <button className="text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                    </button>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2 line-clamp-1">
                    {rfp.title}
                </h3>
                <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 font-bold mb-4 uppercase tracking-tighter">
                    <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Deadline: {rfp.deadline}
                </div>
            </div>

            {/* AI Status Badge */}
            <div className="px-6 mb-4">
                <div className="bg-indigo-50/50 dark:bg-indigo-500/10 rounded-xl p-3 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest">BidSense: {rfp.aiStatus}</span>
                    </div>
                    <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
            </div>

            {/* Progress & Stats */}
            <div className="px-6 pb-6 mt-auto">
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                    <span>RFP Completion</span>
                    <span className="text-gray-900 dark:text-white">{rfp.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mb-6 overflow-hidden">
                    <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${rfp.progress}%` }}
                    />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                    <div className="flex -space-x-2 overflow-hidden">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-900 bg-gray-200 dark:bg-gray-700 border border-gray-100 dark:border-gray-800 flex items-center justify-center text-[8px] font-bold text-gray-500 dark:text-gray-400">
                                V{i + 1}
                            </div>
                        ))}
                        <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-900 bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-[8px] font-bold text-indigo-600 dark:text-indigo-400">
                            +{rfp.vendors}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Proposals</p>
                        <p className="text-sm font-black text-gray-900 dark:text-white leading-none">{rfp.proposals}</p>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex gap-3 group-hover:bg-indigo-50/20 dark:group-hover:bg-indigo-500/5 transition-colors">
                <button
                    onClick={handleEditDraft}
                    className="flex-1 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                >
                    Edit Draft
                </button>
                <button
                    onClick={handleViewAnalysis}
                    className="flex-1 py-2 text-xs font-bold text-white bg-gray-900 dark:bg-indigo-600 rounded-lg hover:bg-indigo-600 dark:hover:bg-indigo-700 transition-all shadow-sm"
                >
                    View Analysis
                </button>
            </div>
        </div>
    );
};

export default RfpCard;
