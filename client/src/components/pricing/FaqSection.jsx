import React, { useState } from 'react';

const FaqSection = () => {
    const faqs = [
        { q: "Can I switch plans later?", a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect on the next billing cycle." },
        { q: "Do you offer discounts for non-profits?", a: "Yes, we offer a 50% discount for registered non-profits. Contact sales for details." },
        { q: "Is there a free trial?", a: "We offer a 14-day free trial for the Professional plan. The Starter plan has a free tier for up to 1 RFP." },
        { q: "What payment methods do you accept?", a: "We accept all major credit cards (Visa, Mastercard, Amex) and ACH transfers for enterprise accounts." },
    ];

    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section className="py-20 bg-white">
            <div className="max-w-3xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full text-left px-6 py-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <span className="font-bold text-gray-900">{faq.q}</span>
                                <svg className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === idx ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            {openIndex === idx && (
                                <div className="px-6 py-4 bg-white text-gray-600 leading-relaxed border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FaqSection;
