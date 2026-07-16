import React from 'react';
import PageTransition from '../components/common/PageTransition';
import SEO from '../components/common/SEO';
import LandingNavbar from '../components/landing/LandingNavbar';
import Footer from '../components/landing/Footer';

const TermsOfService = () => {
    return (
        <PageTransition>
            <SEO title="Terms of Service" description="Read the Terms of Service for using the BidSense platform." />

            <LandingNavbar />

            <main className="pt-32 pb-24 px-6 bg-white dark:bg-gray-950 min-h-screen">
                <div className="max-w-4xl mx-auto prose dark:prose-invert">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Terms of Service</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-12">Last updated: January 20, 2026</p>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            By accessing and placing an order with BidSense, you confirm that you are in agreement with and bound by the terms of service contained in the Terms & Conditions outlined below. These terms apply to the entire website and any email or other type of communication between you and BidSense.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. License</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            BidSense grants you a revocable, non-exclusive, non-transferable, limited license to download, install and use the website strictly in accordance with the terms of this Agreement.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            These Terms & Conditions are a contract between you and BidSense (referred to in these Terms & Conditions as "BidSense", "us", "we" or "our"), the provider of the BidSense website and the services accessible from the BidSense website (which are collectively referred to in these Terms & Conditions as the "BidSense Service").
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Restrictions</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">You agree not to, and you will not permit others to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                            <li>License, sell, rent, lease, assign, distribute, transmit, host, outsource, disclose or otherwise commercially exploit the website or make the platform available to any third party.</li>
                            <li>Modify, make derivative works of, disassemble, decrypt, reverse compile or reverse engineer any part of the website.</li>
                            <li>Remove, alter or obscure any proprietary notice (including any notice of copyright or trademark) of BidSense or its affiliates, partners, suppliers or the licensors of the website.</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Intellectual Property</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            The website and its entire contents, features and functionality (including but not limited to all information, software, text, displays, images, video and audio, and the design, selection and arrangement thereof), are owned by BidSense, its licensors or other providers of such material and are protected by international copyright, trademark, patent, trade secret and other intellectual property or proprietary rights laws.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Account Termination</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </PageTransition>
    );
};

export default TermsOfService;
