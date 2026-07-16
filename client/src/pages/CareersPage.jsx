import React from 'react';
import { useNavigate } from 'react-router-dom';
import LandingNavbar from '../components/landing/LandingNavbar';
import Footer from '../components/landing/Footer';
import SEO from '../components/common/SEO';
import PageTransition from '../components/common/PageTransition';

const CareersPage = () => {
    const navigate = useNavigate();

    const openings = [
        { title: "Senior Full-Stack Engineer", department: "Engineering", location: "Remote", type: "Full-time" },
        { title: "Product Designer", department: "Design", location: "San Francisco, CA", type: "Full-time" },
        { title: "AI/ML Engineer", department: "Engineering", location: "Remote", type: "Full-time" },
        { title: "Customer Success Manager", department: "Customer Success", location: "New York, NY", type: "Full-time" },
        { title: "DevOps Engineer", department: "Engineering", location: "Remote", type: "Full-time" },
        { title: "Technical Writer", department: "Product", location: "Remote", type: "Contract" }
    ];

    const perks = [
        "Competitive salary & equity",
        "Remote-first culture",
        "Unlimited PTO",
        "Health, dental & vision",
        "Learning & development budget",
        "Home office stipend"
    ];

    return (
        <PageTransition className="min-h-screen font-sans bg-black">
            <SEO title="Careers - BidSense" description="Join the BidSense team and help build the future of procurement." />
            <LandingNavbar />

            <main className="pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Hero */}
                    <div className="text-center mb-20">
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                            Build the future<br />of procurement.
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Join a team of passionate individuals working to transform how enterprises manage their procurement processes.
                        </p>
                    </div>

                    {/* Perks */}
                    <div className="bg-gray-900 rounded-3xl p-10 mb-16 border border-gray-800">
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">Why BidSense?</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {perks.map((perk, idx) => (
                                <div key={idx} className="text-center p-4">
                                    <p className="text-gray-300 text-sm font-medium">{perk}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Openings */}
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-8">Open Positions</h2>
                        <div className="space-y-4">
                            {openings.map((job, idx) => (
                                <div key={idx} className="p-6 rounded-2xl bg-gray-900 border border-gray-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:border-gray-700 transition-colors cursor-pointer">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{job.title}</h3>
                                        <p className="text-gray-500 text-sm">{job.department}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-gray-400 text-sm">{job.location}</span>
                                        <span className="px-3 py-1 bg-gray-800 text-gray-300 text-xs font-medium rounded-full">{job.type}</span>
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
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

export default CareersPage;
