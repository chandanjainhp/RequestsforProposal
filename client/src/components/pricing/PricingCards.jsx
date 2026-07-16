import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PricingCards = ({ id }) => {
    const navigate = useNavigate();
    const [annual, setAnnual] = useState(true);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const plans = [
        {
            name: "Starter",
            price: annual ? "49" : "59",
            desc: "Essential RFP tools for small teams.",
            features: ["Up to 5 Active RFPs", "Basic AI Scoring", "Email Support", "1 User Seat"],
            cta: "Start Free Trial",
            popular: false
        },
        {
            name: "Professional",
            price: annual ? "149" : "179",
            desc: "Advanced AI & collaboration for growing agencies.",
            features: ["Unlimited Active RFPs", "Advanced AI Insights", "Priority Support", "Up to 5 User Seats", "Vendor Portal Access"],
            cta: "Get Started",
            popular: true
        },
        {
            name: "Enterprise",
            price: "Custom",
            desc: "Full-scale solution for global procurement teams.",
            features: ["Unlimited Everything", "Custom AI Models", "Dedicated Account Manager", "SSO & Audit Logs", "SLA Guarantees"],
            cta: "Contact Sales",
            popular: false
        }
    ];

    return (
        <section id={id} className="py-24 bg-black">
            <div className="max-w-7xl mx-auto px-6">

                {/* Toggle */}
                <div className="flex justify-center mb-20">
                    <div className="bg-gray-100 dark:bg-gray-900 p-1.5 rounded-2xl inline-flex relative">
                        <div
                            className={`absolute inset-y-1.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${annual ? 'left-[calc(50%)]' : 'left-1.5'}`}
                            style={{ width: 'calc(50% - 6px)' }}
                        />
                        <button
                            onClick={() => setAnnual(false)}
                            className={`relative z-10 px-8 py-3 text-sm font-semibold transition-all duration-300 ${!annual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-500'}`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setAnnual(true)}
                            className={`relative z-10 px-8 py-3 text-sm font-semibold transition-all duration-300 ${annual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-500'}`}
                        >
                            Yearly <span className="text-emerald-500 text-xs font-bold ml-1">Save 20%</span>
                        </button>
                    </div>
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            onMouseEnter={() => setHoveredCard(idx)}
                            onMouseLeave={() => setHoveredCard(null)}
                            className={`
                                relative p-8 lg:p-10 rounded-3xl border-2 cursor-pointer
                                transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
                                ${plan.popular
                                    ? 'bg-gray-900 dark:bg-white border-gray-900 dark:border-white'
                                    : 'bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800'
                                }
                                ${hoveredCard === idx ? 'scale-[1.02] shadow-2xl' : 'scale-100 shadow-none'}
                                ${hoveredCard !== null && hoveredCard !== idx ? 'opacity-60 scale-[0.98]' : ''}
                            `}
                            style={{
                                transitionDelay: `${idx * 100}ms`,
                            }}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <div className="bg-indigo-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                                        Most Popular
                                    </div>
                                </div>
                            )}

                            {/* Plan Name */}
                            <h3 className={`text-sm font-bold uppercase tracking-wider mb-6 ${plan.popular ? 'text-gray-400 dark:text-gray-600' : 'text-gray-500 dark:text-gray-500'}`}>
                                {plan.name}
                            </h3>

                            {/* Price */}
                            <div className="flex items-baseline mb-2">
                                {plan.price !== "Custom" && (
                                    <span className={`text-2xl font-bold mr-1 ${plan.popular ? 'text-gray-400 dark:text-gray-600' : 'text-gray-400 dark:text-gray-600'}`}>$</span>
                                )}
                                <span className={`text-6xl font-black tracking-tight ${plan.popular ? 'text-white dark:text-gray-900' : 'text-gray-900 dark:text-white'}`}>
                                    {plan.price}
                                </span>
                                {plan.price !== "Custom" && (
                                    <span className={`ml-2 font-medium ${plan.popular ? 'text-gray-400 dark:text-gray-600' : 'text-gray-400 dark:text-gray-600'}`}>/month</span>
                                )}
                            </div>

                            {/* Description */}
                            <p className={`text-sm mb-8 ${plan.popular ? 'text-gray-400 dark:text-gray-600' : 'text-gray-500 dark:text-gray-500'}`}>
                                {plan.desc}
                            </p>

                            {/* CTA Button */}
                            <button
                                onClick={() => navigate('/signup')}
                                className={`
                                    w-full py-4 rounded-2xl font-bold text-sm mb-10
                                    transition-all duration-300 ease-out
                                    ${plan.popular
                                        ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                                        : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                                    }
                                    ${hoveredCard === idx ? 'scale-105' : 'scale-100'}
                                `}
                            >
                                {plan.cta}
                            </button>

                            {/* Features */}
                            <ul className="space-y-4">
                                {plan.features.map((feat, fIdx) => (
                                    <li
                                        key={fIdx}
                                        className={`
                                            flex items-center text-sm font-medium
                                            transition-all duration-300
                                            ${plan.popular ? 'text-gray-300 dark:text-gray-700' : 'text-gray-600 dark:text-gray-400'}
                                        `}
                                        style={{ transitionDelay: `${fIdx * 50}ms` }}
                                    >
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${plan.popular ? 'bg-white/20 dark:bg-gray-900/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                            <svg className={`w-3 h-3 ${plan.popular ? 'text-white dark:text-gray-900' : 'text-gray-900 dark:text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingCards;
