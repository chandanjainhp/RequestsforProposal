import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import SEO from '../components/common/SEO';
import { useTheme } from '../context/ThemeContext';

const RfpAnalyticsPage = () => {
    const [searchParams] = useSearchParams();
    const rfpId = searchParams.get('id') || 'RFP-123456';
    const navigate = useNavigate();
    const { theme } = useTheme();

    const [timeRange, setTimeRange] = useState('7d');

    // Mock Data
    const analyticsData = {
        totalBids: 12,
        avgBidAmount: '$75,400',
        lowestBid: '$68,000',
        highestBid: '$92,500',
        vendorsInvited: 24,
        vendorsViewed: 18,
        vendorsBidding: 12,
        bidSpread: [
            { range: '$60k - $70k', count: 2, height: 'h-16' },
            { range: '$70k - $80k', count: 6, height: 'h-32' },
            { range: '$80k - $90k', count: 3, height: 'h-24' },
            { range: '$90k+', count: 1, height: 'h-8' },
        ],
        timeline: [
            { date: 'Jan 10', event: 'RFP Published', type: 'success' },
            { date: 'Jan 12', event: 'Invitation Sent to 24 Vendors', type: 'info' },
            { date: 'Jan 15', event: 'First Bid Received from Acme Corp', type: 'primary' },
            { date: 'Jan 18', event: 'Clarification Request by TechSolutions', type: 'warning' },
        ]
    };

    return (
        <PageTransition>
            <SEO title={`Analytics: #${rfpId} | BidSense`} description="Detailed analytics for your Request for Proposal." />

            <div className="p-6 md:p-8 max-w-7xl mx-auto min-h-screen space-y-8 bg-gray-50 dark:bg-black transition-colors duration-300">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">RFP Analytics</h1>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm ml-7">Evaluating performance for <span className="font-mono font-medium text-indigo-600 dark:text-indigo-400">#{rfpId}</span></p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="bg-white dark:bg-gray-900 p-1 rounded-lg border border-gray-200 dark:border-gray-800 flex">
                            {['24h', '7d', '30d'].map(range => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${timeRange === range ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                        <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Export Report
                        </button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KpiCard title="Total Bids" value={analyticsData.totalBids} trend="+2 today" icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" color="indigo" />
                    <KpiCard title="Avg. Bid Amount" value={analyticsData.avgBidAmount} trend="-4.2% vs est" icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" color="emerald" />
                    <KpiCard title="Lowest Bid" value={analyticsData.lowestBid} trend="Best Offer" icon="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" color="blue" />
                    <KpiCard title="Engagement" value="75%" trend="High Interest" icon="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" color="amber" />
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Bid Distribution Chart */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Bid Distribution Spread</h3>
                        <div className="flex items-end justify-between h-64 gap-4 px-4">
                            {analyticsData.bidSpread.map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center w-full group relative">
                                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-1 px-2 rounded mb-2">
                                        {item.count} Bids
                                    </div>
                                    <div className={`w-full max-w-[80px] ${item.height} bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-xl opacity-80 group-hover:opacity-100 transition-all hover:scale-105`}></div>
                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-3">{item.range}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Vendor Funnel */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Vendor Funnel</h3>
                        <div className="space-y-6">
                            <FunnelStage label="Invited" count={analyticsData.vendorsInvited} total={analyticsData.vendorsInvited} color="bg-gray-200 dark:bg-gray-700" />
                            <FunnelStage label="Viewed RFP" count={analyticsData.vendorsViewed} total={analyticsData.vendorsInvited} color="bg-blue-200 dark:bg-blue-900" />
                            <FunnelStage label="Started Draft" count={analyticsData.vendorsBidding} total={analyticsData.vendorsInvited} color="bg-indigo-300 dark:bg-indigo-800" />
                            <FunnelStage label="Submitted Bid" count={analyticsData.totalBids} total={analyticsData.vendorsInvited} color="bg-emerald-400 dark:bg-emerald-600" />
                        </div>
                    </div>
                </div>

                {/* Recent Activity Timeline */}
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Timeline Events</h3>
                    <div className="space-y-8 pl-4 border-l-2 border-gray-100 dark:border-gray-800">
                        {analyticsData.timeline.map((event, idx) => (
                            <div key={idx} className="relative pl-6">
                                <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 ${event.type === 'success' ? 'bg-emerald-500' :
                                    event.type === 'primary' ? 'bg-indigo-500' :
                                        event.type === 'warning' ? 'bg-amber-500' : 'bg-gray-400'
                                    }`}></div>
                                <p className="text-xs font-bold text-gray-400 mb-1">{event.date}</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{event.event}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

// Helper Components
const KpiCard = ({ title, value, trend, icon, color }) => {
    const colorMap = {
        indigo: {
            bg: 'bg-indigo-50 dark:bg-indigo-500/10',
            text: 'text-indigo-600 dark:text-indigo-400',
        },
        emerald: {
            bg: 'bg-emerald-50 dark:bg-emerald-500/10',
            text: 'text-emerald-600 dark:text-emerald-400',
        },
        blue: {
            bg: 'bg-blue-50 dark:bg-blue-500/10',
            text: 'text-blue-600 dark:text-blue-400',
        },
        amber: {
            bg: 'bg-amber-50 dark:bg-amber-500/10',
            text: 'text-amber-600 dark:text-amber-400',
        },
    };

    const colorStyles = colorMap[color] || colorMap.indigo;

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-start justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1">{value}</h3>
                <span className={`text-xs font-bold ${trend.includes('+') ? 'text-emerald-500' : 'text-gray-400'}`}>{trend}</span>
            </div>
            <div className={`p-3 rounded-xl ${colorStyles.bg} ${colorStyles.text}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} /></svg>
            </div>
        </div>
    );
};

const FunnelStage = ({ label, count, total, color }) => {
    const percentage = Math.round((count / total) * 100);
    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-600 dark:text-gray-300">{label}</span>
                <span className="font-bold text-gray-900 dark:text-white">{count} ({percentage}%)</span>
            </div>
            <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

export default RfpAnalyticsPage;
