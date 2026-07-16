import React from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import Footer from '../components/landing/Footer';
import SEO from '../components/common/SEO';
import PageTransition from '../components/common/PageTransition';

const BlogPage = () => {
    const posts = [
        {
            title: "The Future of AI in Procurement",
            excerpt: "How artificial intelligence is transforming the way enterprises manage RFPs and vendor relationships.",
            date: "Jan 15, 2026",
            readTime: "5 min read",
            category: "AI & Technology"
        },
        {
            title: "10 Best Practices for Writing Effective RFPs",
            excerpt: "Learn the key strategies that lead to better vendor responses and faster decision-making.",
            date: "Jan 10, 2026",
            readTime: "8 min read",
            category: "Best Practices"
        },
        {
            title: "Building a Modern Procurement Tech Stack",
            excerpt: "A guide to selecting and integrating the right tools for your procurement team.",
            date: "Jan 5, 2026",
            readTime: "6 min read",
            category: "Guides"
        },
        {
            title: "How We Reduced RFP Cycle Time by 50%",
            excerpt: "A case study on how TechGlobal transformed their procurement process with BidSense.",
            date: "Dec 28, 2025",
            readTime: "4 min read",
            category: "Case Studies"
        },
        {
            title: "Compliance and Audit Trails in Procurement",
            excerpt: "Why transparency and traceability are critical for modern procurement teams.",
            date: "Dec 20, 2025",
            readTime: "7 min read",
            category: "Compliance"
        },
        {
            title: "Introducing AI Auto-Scoring",
            excerpt: "Our latest feature uses machine learning to automatically evaluate vendor proposals.",
            date: "Dec 15, 2025",
            readTime: "3 min read",
            category: "Product Updates"
        }
    ];

    return (
        <PageTransition className="min-h-screen font-sans bg-black">
            <SEO title="Blog - BidSense" description="Insights, guides, and updates from the BidSense team." />
            <LandingNavbar />

            <main className="pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Hero */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">Blog</h1>
                        <p className="text-xl text-gray-400">Insights and updates from the BidSense team.</p>
                    </div>

                    {/* Posts Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post, idx) => (
                            <article key={idx} className="p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs font-medium rounded">{post.category}</span>
                                </div>
                                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">{post.title}</h2>
                                <p className="text-gray-500 text-sm mb-4 leading-relaxed">{post.excerpt}</p>
                                <div className="flex items-center justify-between text-xs text-gray-600">
                                    <span>{post.date}</span>
                                    <span>{post.readTime}</span>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </PageTransition>
    );
};

export default BlogPage;
