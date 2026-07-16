import React from 'react';

const HistoryTimeline = ({ historyItems }) => {
    // Grouping logic for the UI display
    const groupedHistory = {
        'Today': historyItems.filter(item => item.date === 'Today'),
        'Yesterday': historyItems.filter(item => item.date === 'Yesterday'),
        'Earlier': historyItems.filter(item => !['Today', 'Yesterday'].includes(item.date))
    };

    return (
        <main className="max-w-5xl mx-auto">
            {Object.entries(groupedHistory).map(([date, items]) => (
                items.length > 0 && (
                    <div key={date} className="mb-10">
                        <h2 className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-6 px-4">
                            {date}
                        </h2>
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="group bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all flex flex-col md:flex-row md:items-center gap-4"
                                >
                                    {/* Icon Column */}
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color.includes('bg-') ? item.color.replace('bg-', 'bg-opacity-10 bg-').replace('text-', 'text-') : item.color} dark:bg-opacity-20`}>
                                        {item.type === 'rfp' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                                        {item.type === 'ai' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                                        {item.type === 'proposal' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>}
                                        {item.type === 'vendor' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                                    </div>

                                    {/* Content Column */}
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                            <h3 className="font-bold text-gray-900 dark:text-white">{item.action}</h3>
                                            <span className="text-xs font-bold text-gray-400 dark:text-gray-500">{item.time}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 leading-relaxed">
                                            {item.description}
                                        </p>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center text-[11px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-tight">
                                                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                {item.entity}
                                            </div>
                                            <div className="flex items-center text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight">
                                                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                {item.user}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick View Action */}
                                    <div className="flex-shrink-0">
                                        <button className="px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white dark:hover:text-white hover:border-indigo-600 dark:hover:border-indigo-600 transition-all opacity-0 group-hover:opacity-100 shadow-sm">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            ))}

            {/* --- Empty State Placeholder --- */}
            {historyItems.length === 0 && (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No activity history available yet</h3>
                    <p className="text-gray-500 max-w-xs mx-auto">Actions related to RFPs, proposals, and AI analysis will appear here.</p>
                </div>
            )}
        </main>
    );
};

export default HistoryTimeline;
