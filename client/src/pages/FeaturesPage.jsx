import React from 'react';
import { useNavigate } from 'react-router-dom';
import LandingNavbar from '../components/landing/LandingNavbar';
import Footer from '../components/landing/Footer';
import SEO from '../components/common/SEO';
import PageTransition from '../components/common/PageTransition';

const FeaturesPage = () => {
    const navigate = useNavigate();

    const features = [
        {
            title: "AI-Powered Scoring",
            description: "Automatically evaluate and score vendor proposals using advanced AI that understands technical requirements, compliance needs, and budget constraints.",
            icon: "M13 10V3L4 14h7v7l9-11h-7z"
        },
        {
            title: "Smart RFP Templates",
            description: "Start with industry-specific templates for IT, SaaS, Government, and more. Customize to match your exact procurement needs.",
            icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        },
        {
            title: "Vendor Management",
            description: "Maintain a centralized database of all your vendors with performance tracking, contact management, and historical data.",
            icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        },
        {
            title: "Real-time Collaboration",
            description: "Work together with your team in real-time. Comment, review, and approve proposals without endless email chains.",
            icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        },
        {
            title: "Compliance & Audit Trails",
            description: "Every action is logged. Generate audit-ready reports for SOC2, GDPR, and other compliance frameworks.",
            icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        },
        {
            title: "Analytics Dashboard",
            description: "Track RFP performance, vendor response rates, and procurement metrics with beautiful, actionable dashboards.",
            icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        }
    ];

    return (
        <PageTransition className="min-h-screen font-sans bg-black">
            <SEO title="Features - BidSense" description="Explore the powerful features of BidSense that make RFP management smarter and faster." />
            <LandingNavbar />

            <main className="pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Hero */}
                    <div className="text-center mb-20">
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                            Powerful features for<br />modern procurement.
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Everything you need to manage RFPs, evaluate vendors, and make confident decisions.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="p-8 rounded-3xl bg-gray-900 border border-gray-800 hover:border-gray-700 transition-all duration-300 group"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center mb-6 group-hover:bg-white transition-colors duration-300">
                                    <svg className="w-7 h-7 text-gray-400 group-hover:text-gray-900 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={feature.icon} />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="text-center mt-20">
                        <button
                            onClick={() => navigate('/signup')}
                            className="px-10 py-5 bg-white text-gray-900 text-lg font-semibold rounded-2xl hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                        >
                            Get Started Free
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </PageTransition>
    );
};

export default FeaturesPage;
