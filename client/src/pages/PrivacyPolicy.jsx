import React from 'react';
import PageTransition from '../components/common/PageTransition';
import SEO from '../components/common/SEO';
import LandingNavbar from '../components/landing/LandingNavbar';
import Footer from '../components/landing/Footer';

const PrivacyPolicy = () => {
    return (
        <PageTransition>
            <SEO title="Privacy Policy" description="Read about how BidSense collects and uses your data." />

            <LandingNavbar />

            <main className="pt-32 pb-24 px-6 bg-white dark:bg-gray-950 min-h-screen">
                <div className="max-w-4xl mx-auto prose dark:prose-invert">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Privacy Policy</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-12">Last updated: January 20, 2026</p>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Data Collection</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            We collect information from you when you register on our site, place an order, subscribe to our newsletter, respond to a survey or fill out a form.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                            <li>Name / Username</li>
                            <li>Phone Numbers</li>
                            <li>Email Addresses</li>
                            <li>Mailing Addresses</li>
                            <li>Job Titles</li>
                            <li>Billing Information</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Use of Information</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            Any of the information we collect from you may be used in one of the following ways:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                            <li>To personalize your experience (your information helps us to better respond to your individual needs)</li>
                            <li>To improve our website (we continually strive to improve our website offerings based on the information and feedback we receive from you)</li>
                            <li>To improve customer service (your information helps us to more effectively respond to your customer service requests and support needs)</li>
                            <li>To process transactions</li>
                            <li>To send periodic emails</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Data Protection</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. We offer the use of a secure server. All supplied sensitive/credit information is transmitted via Secure Socket Layer (SSL) technology and then encrypted into our Payment gateway providers database only to be accessible by those authorized with special access rights to such systems, and are required to keep the information confidential.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Cookies</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            BidSense uses "Cookies" to identify the areas of our website that you have visited. A Cookie is a small piece of data stored on your computer or mobile device by your web browser. We use Cookies to enhance the performance and functionality of our website but are non-essential to their use. However, without these cookies, certain functionality like videos may become unavailable or you would be required to enter your login details every time you visit the website as we would not be able to remember that you had logged in previously.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Contact Us</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            Don't hesitate to contact us if you have any questions.
                        </p>
                        <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-600 dark:text-gray-300">
                            <li>Via verify Email: <a href="mailto:support@bidsense.ai" className="text-indigo-600 hover:text-indigo-500 underline">support@bidsense.ai</a></li>
                        </ul>
                    </section>
                </div>
            </main>

            <Footer />
        </PageTransition>
    );
};

export default PrivacyPolicy;
