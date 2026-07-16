import React from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import Footer from '../components/landing/Footer';
import SEO from '../components/common/SEO';
import PageTransition from '../components/common/PageTransition';

const SecurityPage = () => {
    const securityFeatures = [
        {
            title: "SOC 2 Type II Certified",
            description: "Our systems and processes are audited annually by independent third parties to ensure the highest standards of security.",
            icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        },
        {
            title: "End-to-End Encryption",
            description: "All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.",
            icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        },
        {
            title: "GDPR Compliant",
            description: "Full compliance with GDPR and other data protection regulations. Your data, your control.",
            icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
        },
        {
            title: "Role-Based Access Control",
            description: "Granular permissions ensure users only access the data and features they need.",
            icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        },
        {
            title: "Complete Audit Trails",
            description: "Every action is logged with timestamps, user IDs, and IP addresses for complete traceability.",
            icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        },
        {
            title: "99.99% Uptime SLA",
            description: "Enterprise-grade infrastructure with redundant systems across multiple regions.",
            icon: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
        }
    ];

    return (
        <PageTransition className="min-h-screen font-sans bg-black">
            <SEO title="Security - BidSense" description="Learn about BidSense's enterprise-grade security measures and compliance certifications." />
            <LandingNavbar />

            <main className="pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Hero */}
                    <div className="text-center mb-20">
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                            Security you can trust.
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Enterprise-grade security with industry-leading certifications and compliance standards.
                        </p>
                    </div>

                    {/* Security Features */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {securityFeatures.map((feature, idx) => (
                            <div key={idx} className="p-8 rounded-3xl bg-gray-900 border border-gray-800">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
                                    <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={feature.icon} />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-500">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </PageTransition>
    );
};

export default SecurityPage;
