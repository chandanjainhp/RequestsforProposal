import React from 'react';
import ComparisonHeader from '../components/proposal/ComparisonHeader';
import ComparisonGrid from '../components/proposal/ComparisonGrid';

const ProposalComparisonPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300 p-6 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <ComparisonHeader />

                <div className="mt-8">
                    <ComparisonGrid />
                </div>

                {/* AI Insight Summary Block */}
                <div className="mt-10 p-6 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl shadow-xl text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10 flex items-start gap-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center flex-shrink-0 border border-white/30 shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">AI Recommendation: Acme Corp</h3>
                            <p className="text-indigo-100 leading-relaxed max-w-3xl">
                                Based on the weighted analysis of <strong>Cost Efficiency (30%)</strong>, <strong>Technical Compliance (40%)</strong>, and <strong>Risk Assessment (30%)</strong>,
                                Acme Corp emerges as the optimal choice. Their timeline is the shortest, and while slightly more expensive than Soylent Corp, the "Low Risk" profile justifies the premium.
                            </p>
                            <button className="mt-4 px-5 py-2 bg-white text-indigo-700 font-bold rounded-lg hover:bg-indigo-50 transition-colors shadow-md">
                                Draft Award Letter
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProposalComparisonPage;
