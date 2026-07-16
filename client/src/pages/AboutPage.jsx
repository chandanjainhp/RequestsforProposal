import React from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import Footer from '../components/landing/Footer';
import SEO from '../components/common/SEO';
import PageTransition from '../components/common/PageTransition';

const AboutPage = () => {
    const team = [
        { name: "Sarah Chen", role: "CEO & Co-Founder", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah" },
        { name: "Michael Ross", role: "CTO & Co-Founder", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael" },
        { name: "Emily Johnson", role: "VP of Product", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily" },
        { name: "David Kim", role: "VP of Engineering", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=david" }
    ];

    const values = [
        { title: "Customer First", description: "Every decision we make starts with our customers' needs." },
        { title: "Transparency", description: "We believe in open communication and honest relationships." },
        { title: "Innovation", description: "We constantly push boundaries to deliver cutting-edge solutions." },
        { title: "Excellence", description: "We hold ourselves to the highest standards in everything we do." }
    ];

    return (
        <PageTransition className="min-h-screen font-sans bg-black">
            <SEO title="About Us - BidSense" description="Learn about BidSense, our mission, team, and values." />
            <LandingNavbar />

            <main className="pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Hero */}
                    <div className="text-center mb-20">
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                            Redefining procurement<br />for the modern era.
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            BidSense was founded with a simple mission: make procurement smarter, faster, and more transparent. We're building the future of RFP management with AI.
                        </p>
                    </div>

                    {/* Mission */}
                    <div className="bg-gray-900 rounded-3xl p-12 mb-20 border border-gray-800">
                        <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
                        <p className="text-xl text-gray-400 leading-relaxed">
                            We believe procurement teams deserve better tools. Legacy systems are slow, complex, and frustrating. BidSense brings modern design, AI intelligence, and seamless collaboration to help teams make confident decisions in a fraction of the time.
                        </p>
                    </div>

                    {/* Values */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold text-white mb-10 text-center">Our Values</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {values.map((value, idx) => (
                                <div key={idx} className="p-6 rounded-2xl bg-gray-900 border border-gray-800 text-center">
                                    <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                                    <p className="text-gray-500 text-sm">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Team */}
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-10 text-center">Leadership Team</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {team.map((member, idx) => (
                                <div key={idx} className="p-6 rounded-2xl bg-gray-900 border border-gray-800 text-center">
                                    <img src={member.image} alt={member.name} className="w-20 h-20 rounded-full mx-auto mb-4 bg-gray-800" />
                                    <h3 className="text-lg font-bold text-white">{member.name}</h3>
                                    <p className="text-gray-500 text-sm">{member.role}</p>
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

export default AboutPage;
