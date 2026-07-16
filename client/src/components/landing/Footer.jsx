import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const footerLinks = [
        {
            title: "Product",
            links: [
                { name: "Features", path: "/features" },
                { name: "Pricing", path: "/pricing" },
                { name: "Enterprise", path: "/enterprise" },
                { name: "Security", path: "/security" }
            ]
        },
        {
            title: "Company",
            links: [
                { name: "About", path: "/about" },
                { name: "Careers", path: "/careers" },
                { name: "Blog", path: "/blog" },
                { name: "Contact", path: "/contact" }
            ]
        },
        {
            title: "Resources",
            links: [
                { name: "Documentation", path: "/docs" },
                { name: "API Reference", path: "/api" },
                { name: "Guides", path: "/guides" },
                { name: "Support", path: "/support" }
            ]
        }
    ];

    return (
        <footer className="bg-black pt-20 pb-10 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-black text-lg">B</span>
                            </div>
                            <span className="text-lg font-bold text-gray-400 tracking-tight">BidSense</span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            The intelligent platform for modern procurement teams. Smarter RFPs, faster decisions.
                        </p>
                    </div>

                    {footerLinks.map((col, idx) => (
                        <div key={idx}>
                            <h4 className="font-bold text-white mb-6">{col.title}</h4>
                            <ul className="space-y-4">
                                {col.links.map(link => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.path}
                                            className="text-gray-500 hover:text-indigo-400 transition-colors text-sm font-medium"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
                    <p>© 2026 BidSense Platform. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-gray-400 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
