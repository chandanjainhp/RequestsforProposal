import React from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import Footer from '../components/landing/Footer';
import SEO from '../components/common/SEO';
import PageTransition from '../components/common/PageTransition';

const SupportPage = () => {
    const supportOptions = [
        {
            title: "Help Center",
            description: "Browse our knowledge base for answers to common questions.",
            icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
            action: "Browse Articles"
        },
        {
            title: "Email Support",
            description: "Send us a message and we'll respond within 24 hours.",
            icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
            action: "Contact Support"
        },
        {
            title: "Live Chat",
            description: "Chat with our support team in real-time.",
            icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
            action: "Start Chat"
        },
        {
            title: "Schedule a Call",
            description: "Book a call with our customer success team.",
            icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
            action: "Book Call"
        }
    ];

    const faqs = [
        { q: "How do I reset my password?", a: "Go to the login page and click 'Forgot Password' to receive a reset link via email." },
        { q: "Can I export my RFP data?", a: "Yes, you can export all your data in CSV, Excel, or PDF format from the dashboard." },
        { q: "How does AI scoring work?", a: "Our AI analyzes proposals against your RFP requirements and assigns scores based on compliance, quality, and risk factors." },
        { q: "What integrations are available?", a: "We integrate with popular tools like Salesforce, SAP, Oracle, Slack, and many more via our API." }
    ];

    return (
        <PageTransition className="min-h-screen font-sans bg-black">
            <SEO title="Support - BidSense" description="Get help with BidSense. Access our help center, contact support, or schedule a call." />
            <LandingNavbar />

            <main className="pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Hero */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">How can we help?</h1>
                        <p className="text-xl text-gray-400">Our team is here to support you every step of the way.</p>
                    </div>

                    {/* Support Options */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                        {supportOptions.map((option, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-gray-900 border border-gray-800 text-center hover:border-gray-700 transition-colors cursor-pointer group">
                                <div className="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-500/20 transition-colors">
                                    <svg className="w-7 h-7 text-gray-400 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={option.icon} />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{option.title}</h3>
                                <p className="text-gray-500 text-sm mb-4">{option.description}</p>
                                <button className="text-indigo-400 text-sm font-semibold hover:text-indigo-300 transition-colors">
                                    {option.action} →
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* FAQs */}
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
                        <div className="max-w-3xl mx-auto space-y-4">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="p-6 rounded-2xl bg-gray-900 border border-gray-800">
                                    <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                                    <p className="text-gray-500 text-sm">{faq.a}</p>
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

export default SupportPage;
