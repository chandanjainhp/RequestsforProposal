import React from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import Footer from '../components/landing/Footer';
import SEO from '../components/common/SEO';
import PageTransition from '../components/common/PageTransition';

const GuidesPage = () => {
    const guides = [
        {
            title: "Complete Guide to RFP Writing",
            description: "Learn how to write effective RFPs that attract quality vendor responses.",
            duration: "15 min read",
            level: "Beginner"
        },
        {
            title: "Vendor Evaluation Best Practices",
            description: "A comprehensive framework for evaluating and comparing vendors.",
            duration: "20 min read",
            level: "Intermediate"
        },
        {
            title: "Using AI for Proposal Analysis",
            description: "How to leverage BidSense AI to automate proposal scoring.",
            duration: "10 min read",
            level: "Intermediate"
        },
        {
            title: "Setting Up Your Procurement Workflow",
            description: "Configure BidSense to match your organization's procurement process.",
            duration: "25 min read",
            level: "Advanced"
        },
        {
            title: "Compliance and Audit Preparation",
            description: "Ensure your procurement process is audit-ready.",
            duration: "12 min read",
            level: "Intermediate"
        },
        {
            title: "Integrating with Your Tech Stack",
            description: "Connect BidSense with your existing ERP, CRM, and other tools.",
            duration: "18 min read",
            level: "Advanced"
        }
    ];

    const getLevelColor = (level) => {
        switch (level) {
            case 'Beginner': return 'bg-emerald-500/10 text-emerald-400';
            case 'Intermediate': return 'bg-amber-500/10 text-amber-400';
            case 'Advanced': return 'bg-red-500/10 text-red-400';
            default: return 'bg-gray-500/10 text-gray-400';
        }
    };

    return (
        <PageTransition className="min-h-screen font-sans bg-black">
            <SEO title="Guides - BidSense" description="Step-by-step guides to help you get the most out of BidSense." />
            <LandingNavbar />

            <main className="pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Hero */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">Guides</h1>
                        <p className="text-xl text-gray-400">Step-by-step tutorials to master BidSense.</p>
                    </div>

                    {/* Guides Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {guides.map((guide, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded ${getLevelColor(guide.level)}`}>{guide.level}</span>
                                    <span className="text-gray-600 text-xs">{guide.duration}</span>
                                </div>
                                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">{guide.title}</h2>
                                <p className="text-gray-500 text-sm leading-relaxed">{guide.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </PageTransition>
    );
};

export default GuidesPage;
