import React from 'react';
import { useNavigate } from 'react-router-dom';
import LandingNavbar from '../components/landing/LandingNavbar';
import Footer from '../components/landing/Footer';
import SEO from '../components/common/SEO';
import PageTransition from '../components/common/PageTransition';

const EnterprisePage = () => {
    const navigate = useNavigate();

    const benefits = [
        { title: "Custom AI Models", description: "Train AI on your specific procurement terminology and requirements." },
        { title: "SSO Integration", description: "Seamless authentication with SAML 2.0, Okta, Azure AD, and more." },
        { title: "Dedicated Support", description: "24/7 priority support with a dedicated customer success manager." },
        { title: "SLA Guarantees", description: "99.99% uptime SLA with enterprise-grade infrastructure." },
        { title: "Custom Integrations", description: "Connect with your existing ERP, CRM, and procurement systems." },
        { title: "Advanced Security", description: "SOC2 Type II, GDPR compliant with custom data residency options." }
    ];

    return (
        <PageTransition className="min-h-screen font-sans bg-black">
            <SEO title="Enterprise - BidSense" description="Enterprise-grade RFP management for global procurement teams." />
            <LandingNavbar />

            <main className="pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Hero */}
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center space-x-2 bg-gray-900 border border-gray-800 rounded-full px-5 py-2 mb-8">
                            <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Enterprise Grade</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                            Built for scale.<br />Ready for enterprise.
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                            Full-scale RFP management solution for global procurement teams with advanced security, custom integrations, and dedicated support.
                        </p>
                        <button
                            onClick={() => navigate('/contact')}
                            className="px-10 py-5 bg-white text-gray-900 text-lg font-semibold rounded-2xl hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                        >
                            Contact Sales
                        </button>
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                        {benefits.map((benefit, idx) => (
                            <div key={idx} className="p-8 rounded-3xl bg-gray-900 border border-gray-800">
                                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                                <p className="text-gray-500">{benefit.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Logos Section */}
                    <div className="text-center">
                        <p className="text-sm font-bold text-gray-600 uppercase tracking-widest mb-8">Trusted by leading enterprises</p>
                        <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
                            <div className="text-2xl font-bold text-gray-600">Fortune 500</div>
                            <div className="text-2xl font-bold text-gray-600">Global Banks</div>
                            <div className="text-2xl font-bold text-gray-600">Government</div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </PageTransition>
    );
};

export default EnterprisePage;
