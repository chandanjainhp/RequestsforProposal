import React from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import Footer from '../components/landing/Footer';
import SEO from '../components/common/SEO';
import PageTransition from '../components/common/PageTransition';

const DocumentationPage = () => {
    const sections = [
        {
            title: "Getting Started",
            items: [
                { name: "Quick Start Guide", description: "Get up and running in 5 minutes" },
                { name: "Account Setup", description: "Configure your organization settings" },
                { name: "User Management", description: "Add team members and set permissions" }
            ]
        },
        {
            title: "RFP Management",
            items: [
                { name: "Creating RFPs", description: "Build and customize your RFPs" },
                { name: "Templates", description: "Use and create RFP templates" },
                { name: "Publishing", description: "Distribute RFPs to vendors" }
            ]
        },
        {
            title: "Vendor Portal",
            items: [
                { name: "Inviting Vendors", description: "Send invitations and manage access" },
                { name: "Proposal Submission", description: "How vendors submit proposals" },
                { name: "Communication", description: "Q&A and clarifications" }
            ]
        },
        {
            title: "AI Features",
            items: [
                { name: "Auto-Scoring", description: "How AI evaluates proposals" },
                { name: "Risk Analysis", description: "Identifying potential issues" },
                { name: "Recommendations", description: "AI-powered vendor suggestions" }
            ]
        }
    ];

    return (
        <PageTransition className="min-h-screen font-sans bg-black">
            <SEO title="Documentation - BidSense" description="Learn how to use BidSense with our comprehensive documentation." />
            <LandingNavbar />

            <main className="pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Hero */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">Documentation</h1>
                        <p className="text-xl text-gray-400">Everything you need to know about using BidSense.</p>
                    </div>

                    {/* Search */}
                    <div className="max-w-2xl mx-auto mb-16">
                        <div className="relative">
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search documentation..."
                                className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* Sections */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {sections.map((section, idx) => (
                            <div key={idx} className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                                <h2 className="text-xl font-bold text-white mb-6">{section.title}</h2>
                                <div className="space-y-4">
                                    {section.items.map((item, iIdx) => (
                                        <div key={iIdx} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer group">
                                            <svg className="w-5 h-5 text-gray-600 group-hover:text-indigo-400 mt-0.5 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <div>
                                                <h3 className="text-white font-medium group-hover:text-indigo-400 transition-colors">{item.name}</h3>
                                                <p className="text-gray-500 text-sm">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </PageTransition>
    );
};

export default DocumentationPage;
