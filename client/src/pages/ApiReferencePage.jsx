import React from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import Footer from '../components/landing/Footer';
import SEO from '../components/common/SEO';
import PageTransition from '../components/common/PageTransition';

const ApiReferencePage = () => {
    const endpoints = [
        {
            method: "GET",
            path: "/api/v1/rfps",
            description: "List all RFPs in your organization"
        },
        {
            method: "POST",
            path: "/api/v1/rfps",
            description: "Create a new RFP"
        },
        {
            method: "GET",
            path: "/api/v1/rfps/:id",
            description: "Get details of a specific RFP"
        },
        {
            method: "PUT",
            path: "/api/v1/rfps/:id",
            description: "Update an existing RFP"
        },
        {
            method: "DELETE",
            path: "/api/v1/rfps/:id",
            description: "Delete an RFP"
        },
        {
            method: "GET",
            path: "/api/v1/vendors",
            description: "List all vendors"
        },
        {
            method: "POST",
            path: "/api/v1/proposals/analyze",
            description: "Submit a proposal for AI analysis"
        },
        {
            method: "GET",
            path: "/api/v1/analytics/dashboard",
            description: "Get dashboard analytics data"
        }
    ];

    const getMethodColor = (method) => {
        switch (method) {
            case 'GET': return 'bg-emerald-500/10 text-emerald-400';
            case 'POST': return 'bg-blue-500/10 text-blue-400';
            case 'PUT': return 'bg-amber-500/10 text-amber-400';
            case 'DELETE': return 'bg-red-500/10 text-red-400';
            default: return 'bg-gray-500/10 text-gray-400';
        }
    };

    return (
        <PageTransition className="min-h-screen font-sans bg-black">
            <SEO title="API Reference - BidSense" description="Complete API documentation for integrating with BidSense." />
            <LandingNavbar />

            <main className="pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Hero */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">API Reference</h1>
                        <p className="text-xl text-gray-400">Build powerful integrations with the BidSense API.</p>
                    </div>

                    {/* Quick Start */}
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 mb-12">
                        <h2 className="text-2xl font-bold text-white mb-4">Quick Start</h2>
                        <p className="text-gray-400 mb-6">Authenticate your requests with your API key in the header.</p>
                        <div className="bg-gray-950 rounded-xl p-4 font-mono text-sm">
                            <code className="text-gray-300">
                                <span className="text-gray-500">curl</span> -H <span className="text-emerald-400">"Authorization: Bearer YOUR_API_KEY"</span> \<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;https://api.bidsense.io/v1/rfps
                            </code>
                        </div>
                    </div>

                    {/* Endpoints */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">Endpoints</h2>
                        <div className="space-y-3">
                            {endpoints.map((endpoint, idx) => (
                                <div key={idx} className="p-4 rounded-xl bg-gray-900 border border-gray-800 flex items-center gap-4 hover:border-gray-700 transition-colors cursor-pointer">
                                    <span className={`px-3 py-1 text-xs font-bold rounded ${getMethodColor(endpoint.method)}`}>
                                        {endpoint.method}
                                    </span>
                                    <code className="text-gray-300 font-mono text-sm flex-1">{endpoint.path}</code>
                                    <span className="text-gray-500 text-sm hidden md:block">{endpoint.description}</span>
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </PageTransition>
    );
};

export default ApiReferencePage;
