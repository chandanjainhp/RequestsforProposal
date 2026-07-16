import React, { useState } from 'react';
import useScrollReveal from '../../hooks/useScrollReveal';

const ProductPreviewSection = () => {
    const [activeTab, setActiveTab] = useState('RFP Editor');
    const { ref, hasAnimated, isActive } = useScrollReveal(0.2);

    const tabs = ['RFP Editor', 'Proposal Inbox', 'AI Comparison'];

    return (
        <section id="features" ref={ref} className="py-24 bg-gray-950 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className={`text-center max-w-3xl mx-auto mb-16 ${hasAnimated ? 'opacity-100 translate-y-0 transition-all duration-700 ease-out' : 'opacity-0 translate-y-6'}`}>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
                        Everything you need <br /> to manage RFPs.
                    </h2>
                    <p className="text-xl text-gray-500 dark:text-gray-400">
                        From drafting requirements to scoring vendors, see how BidSense assists every step of the way.
                    </p>
                </div>

                {/* Tabs */}
                <div className={`flex justify-center mb-12 ${hasAnimated ? 'opacity-100 translate-y-0 transition-all duration-700 ease-out delay-100' : 'opacity-0 translate-y-6'}`}>
                    <div className="bg-white dark:bg-gray-800 p-1.5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 inline-flex space-x-2">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab
                                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Preview Window */}
                <div className={`relative rounded-3xl bg-gray-900 p-2 md:p-4 shadow-2xl shadow-indigo-500/20 mx-auto max-w-5xl ring-1 ring-white/10 transition-transform duration-1000 ease-out ${hasAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${isActive ? 'scale-[1.02]' : 'scale-100'}`}>
                    <div className="rounded-2xl bg-white dark:bg-gray-800 overflow-hidden aspect-[16/10] md:aspect-[16/9] relative">
                        {/* Mock UI Header */}
                        <div className="h-10 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center px-4 space-x-2">
                            <div className="flex space-x-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                            </div>
                            <div className="w-full flex justify-center">
                                <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                            </div>
                        </div>

                        {/* Mock UI Body */}
                        <div className="p-8 h-full bg-slate-50 dark:bg-gray-800/50">
                            {activeTab === 'RFP Editor' && (
                                <div className="animate-in fade-in zoom-in-95 duration-500 h-full flex flex-col">
                                    <div className="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center font-bold text-xs">AI</div>
                                            <div className="text-sm font-bold text-gray-800 dark:text-white">Drafting: Cloud Migration RFP</div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">Save Draft</button>
                                            <button className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-indigo-700">Publish RFP</button>
                                        </div>
                                    </div>
                                    <div className="space-y-4 flex-1 overflow-hidden bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">1. Project Overview</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                                We are seeking a vendor to migrate our on-premise infrastructure to AWS. The scope includes 150+ virtual machines and 20TB of data...
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">2. Technical Requirements</h3>
                                            <ul className="space-y-2">
                                                <li className="flex items-center text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                                                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mr-2 text-[10px]">✓</span>
                                                    Must support SOC2 Compliance
                                                </li>
                                                <li className="flex items-center text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                                                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mr-2 text-[10px]">✓</span>
                                                    24/7 dedicated support team required
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'Proposal Inbox' && (
                                <div className="animate-in fade-in zoom-in-95 duration-500 h-full flex gap-6">
                                    <div className="w-1/4 h-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-4 hidden md:block">
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Filters</div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg cursor-pointer">
                                                <span>All Proposals</span>
                                                <span className="bg-white dark:bg-gray-600 text-gray-500 dark:text-gray-300 px-1.5 py-0.5 rounded text-xs border border-gray-200 dark:border-gray-600">12</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm font-medium text-gray-500 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                                                <span>Shortlisted</span>
                                                <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 px-1.5 py-0.5 rounded text-xs">4</span>
                                            </div>
                                            {/* ... more filters */}
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        {[
                                            { vendor: "TechFlow Systems", score: 98, status: "Recommended", price: "$145k" },
                                            { vendor: "Global IT Sol.", score: 85, status: "Reviewing", price: "$132k" },
                                            { vendor: "Apex Data", score: 72, status: "Flagged", price: "$160k" }
                                        ].map((item, i) => (
                                            <div key={i} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 hover:border-indigo-300 transition-colors cursor-pointer">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${i === 0 ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                                                    {item.vendor[0]}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between mb-1">
                                                        <div>
                                                            <span className="font-bold text-gray-900 dark:text-white text-sm block">{item.vendor}</span>
                                                            <span className="text-xs text-gray-500">Bid Amount: {item.price}</span>
                                                        </div>
                                                        <span className={`text-xs font-bold px-2 py-1 rounded-full h-fit ${i === 0 ? 'bg-emerald-100 text-emerald-700' :
                                                            item.status === 'Flagged' ? 'bg-red-50 dark:bg-red-900/10 text-red-600' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                                                            {item.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'AI Comparison' && (
                                <div className="animate-in fade-in zoom-in-95 duration-500 h-full space-y-6">
                                    <div className="flex space-x-4">
                                        <div className="flex-1 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl relative overflow-hidden">
                                            <div className="absolute top-2 right-2 flex space-x-0.5">
                                                <div className="w-1 h-1 bg-indigo-300 rounded-full"></div>
                                                <div className="w-1 h-1 bg-indigo-300 rounded-full"></div>
                                            </div>
                                            <div className="text-sm font-medium text-indigo-900 dark:text-indigo-200 mb-1">TechFlow</div>
                                            <div className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">98.5</div>
                                            <div className="text-xs text-indigo-600 dark:text-indigo-300 mt-1 font-bold bg-indigo-100 dark:bg-indigo-900/40 inline-block px-2 py-0.5 rounded-full">Top Choice</div>
                                        </div>
                                        <div className="flex-1 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-opacity-50">
                                            <div className="text-sm font-medium text-gray-500 mb-1">Global IT</div>
                                            <div className="text-3xl font-bold text-gray-400">84.2</div>
                                            <div className="text-xs text-gray-400 mt-1">Strong contender</div>
                                        </div>
                                        <div className="flex-1 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl opacity-75">
                                            <div className="text-sm font-medium text-gray-500 mb-1">Apex Data</div>
                                            <div className="text-3xl font-bold text-gray-400">76.0</div>
                                            <div className="text-xs text-gray-400 mt-1">High Risk</div>
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Capability Breakdown</h4>
                                            <button className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline">View Full Report</button>
                                        </div>
                                        {/* Bars */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-24 text-xs font-bold text-gray-500 text-right">Security</div>
                                                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex">
                                                    <div className="h-full bg-emerald-500 w-[95%]" title="TechFlow"></div>
                                                    <div className="h-full bg-gray-300 w-[1%]" title="Gap"></div>
                                                    <div className="h-full bg-gray-400 w-[80%]" title="Global IT"></div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-24 text-xs font-bold text-gray-500 text-right">Pricing</div>
                                                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex">
                                                    <div className="h-full bg-blue-500 w-[88%]"></div>
                                                    <div className="h-full bg-gray-300 w-[1%]"></div>
                                                    <div className="h-full bg-gray-400 w-[92%]"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductPreviewSection;
