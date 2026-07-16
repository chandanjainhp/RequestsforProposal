import React from 'react';
import { useNavigate } from 'react-router-dom';

const AiInsights = () => {
    const navigate = useNavigate();

    const insights = [
        { text: "Top 3 vendors identified based on score", tag: "Analysis" },
        { text: "Cost vs quality imbalance detected", tag: "Risk" },
        { text: "High-risk proposal flagged in Cloud Mig.", tag: "Alert" }
    ];

    const handleNavigate = (tag) => {
        if (tag === 'Analysis') navigate('/proposals/compare');
        if (tag === 'Risk') navigate('/rfps');
        if (tag === 'Alert') navigate('/rfps/history');
    };

    return (
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500 animate-pulse">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" /></svg>
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                        <div className="bg-cyan-400 p-1.5 rounded-lg shadow-inner">
                            <svg className="w-5 h-5 text-indigo-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight">BidSense AI Insights</h2>
                    </div>
                </div>

                <ul className="space-y-4">
                    {insights.map((insight, i) => (
                        <li
                            key={i}
                            onClick={() => handleNavigate(insight.tag)}
                            className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/20 transition-colors cursor-pointer group/item"
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest">{insight.tag}</span>
                                <svg className="w-4 h-4 text-cyan-200 opacity-0 group-hover/item:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                            </div>
                            <p className="text-sm font-medium leading-relaxed">{insight.text}</p>
                        </li>
                    ))}
                </ul>

                <button
                    onClick={() => navigate('/settings')}
                    className="w-full mt-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors border border-white/10 text-cyan-100"
                >
                    Configure AI Settings
                </button>
            </div>
        </div>
    );
};

export default AiInsights;
