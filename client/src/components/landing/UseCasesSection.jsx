import React, { useState } from 'react';
import useScrollReveal from '../../hooks/useScrollReveal';

const UseCasesSection = () => {
    const { ref, hasAnimated } = useScrollReveal();
    const [hoveredCard, setHoveredCard] = useState(null);

    const cases = [
        { title: "Enterprise Procurement", desc: "Centralize spend and standardize vendor evaluation across global teams.", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
        { title: "Government Tenders", desc: "Ensure strict compliance and audit-ready decision trails.", icon: "M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" },
        { title: "IT & Cloud RFPs", desc: "Complex technical requirements met with precise scoring capabilities.", icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" },
        { title: "Vendor Shortlisting", desc: "Rapidly filter hundreds of proposals to find the top contenders.", icon: "M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" },
        { title: "AI-driven Evaluation", desc: "Let AI handle the heavy lifting of proposal analysis and risk detection.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
        { title: "Contract Lifecycle", desc: "Seamless handover from award to contract management.", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    ];

    return (
        <section id="use-cases" ref={ref} className="py-32 bg-white dark:bg-black">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className={`text-center mb-20 transition-all duration-1000 ease-out ${hasAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                        Built for every<br />procurement need.
                    </h2>
                    <p className="text-xl text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                        Flexible workflows for any industry or complexity.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cases.map((item, idx) => (
                        <div
                            key={idx}
                            onMouseEnter={() => setHoveredCard(idx)}
                            onMouseLeave={() => setHoveredCard(null)}
                            className={`
                                relative p-8 rounded-3xl cursor-pointer
                                border-2 border-transparent
                                transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                                ${hasAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
                                ${hoveredCard === idx
                                    ? 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 scale-[1.02]'
                                    : 'bg-transparent'
                                }
                                ${hoveredCard !== null && hoveredCard !== idx ? 'opacity-50' : ''}
                            `}
                            style={{ transitionDelay: `${idx * 80}ms` }}
                        >
                            {/* Icon */}
                            <div className={`
                                w-14 h-14 rounded-2xl flex items-center justify-center mb-6
                                transition-all duration-500 ease-out
                                ${hoveredCard === idx
                                    ? 'bg-gray-900 dark:bg-white scale-110'
                                    : 'bg-gray-100 dark:bg-gray-900'
                                }
                            `}>
                                <svg
                                    className={`w-7 h-7 transition-colors duration-300 ${hoveredCard === idx ? 'text-white dark:text-gray-900' : 'text-gray-600 dark:text-gray-400'}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={item.icon} />
                                </svg>
                            </div>

                            {/* Title */}
                            <h3 className={`
                                text-xl font-bold mb-3 transition-colors duration-300
                                ${hoveredCard === idx ? 'text-gray-900 dark:text-white' : 'text-gray-800 dark:text-gray-200'}
                            `}>
                                {item.title}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-500 dark:text-gray-500 leading-relaxed">
                                {item.desc}
                            </p>

                            {/* Arrow indicator on hover */}
                            <div className={`
                                absolute bottom-8 right-8
                                transition-all duration-500 ease-out
                                ${hoveredCard === idx ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
                            `}>
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UseCasesSection;
