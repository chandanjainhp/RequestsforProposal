import React from 'react';

const ReviewProposal = ({ isOpen, onClose, proposal }) => {
    if (!isOpen || !proposal) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm z-50 transition-opacity"
                onClick={onClose}
            />

            {/* Slide-over Panel */}
            <aside className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300 transition-colors border-l border-gray-100 dark:border-gray-800">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Review Proposal</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            {proposal.vendor} <span className="mx-2">•</span> {proposal.rfp}
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-500/20">
                            Score: {proposal.score || 'N/A'}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">

                    {/* Executive Summary */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Executive Summary
                        </h3>
                        <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            Based on our extensive experience with similar cloud migration projects, {proposal.vendor} proposes a phased approach to migrate your infrastructure to AWS. We estimate a total timeline of 6 months with a dedicated team of 5 certified engineers. Our solution prioritizes zero-downtime cutover and robust security compliance (SOC2 Type II).
                        </div>
                    </section>

                    {/* Pricing Breakdown */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-emerald-500 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Financials
                        </h3>
                        <div className="border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-bold border-b border-gray-100 dark:border-gray-700">
                                    <tr>
                                        <th className="px-5 py-3">Item</th>
                                        <th className="px-5 py-3 text-right">Cost</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    <tr>
                                        <td className="px-5 py-3 text-gray-700 dark:text-gray-300">Initial Discovery & Planning</td>
                                        <td className="px-5 py-3 text-right font-mono text-gray-900 dark:text-white">$15,000</td>
                                    </tr>
                                    <tr>
                                        <td className="px-5 py-3 text-gray-700 dark:text-gray-300">Migration Execution (Phase 1-3)</td>
                                        <td className="px-5 py-3 text-right font-mono text-gray-900 dark:text-white">$85,000</td>
                                    </tr>
                                    <tr>
                                        <td className="px-5 py-3 text-gray-700 dark:text-gray-300">Post-Migration Support (3 Months)</td>
                                        <td className="px-5 py-3 text-right font-mono text-gray-900 dark:text-white">$20,000</td>
                                    </tr>
                                    <tr className="bg-gray-50 dark:bg-gray-800/50 font-bold">
                                        <td className="px-5 py-3 text-gray-900 dark:text-white">Total</td>
                                        <td className="px-5 py-3 text-right font-mono text-indigo-600 dark:text-indigo-400">{proposal.amount}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* AI Analysis */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-cyan-500 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            BidSense AI Insights
                        </h3>
                        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/10 dark:to-blue-900/10 border border-cyan-100 dark:border-cyan-500/20 rounded-2xl p-5">
                            <div className="flex items-start space-x-3 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0">
                                    <span className="font-bold text-xs">AI</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">Strong Technical Alignment</h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">This proposal matches 94% of your technical requirements, specifically in Kubernetes orchestration and AWS Lambda integration. However, the timeline is 2 weeks longer than average.</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">Compliance Check</h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Vendor certification expires in 3 months. Verify renewal status before contracting.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
                    >
                        Close Review
                    </button>
                    <button className="px-6 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 transition-all flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                        Download PDF
                    </button>
                    <button className="px-6 py-3 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20 transition-all">
                        Shortlist Vendor
                    </button>
                </div>

            </aside>
        </>
    );
};

export default ReviewProposal;
