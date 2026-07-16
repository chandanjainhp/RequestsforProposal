import React, { useState } from 'react';
import useScrollReveal from '../../hooks/useScrollReveal';

const WorkflowsSection = () => {
    const { ref, hasAnimated } = useScrollReveal();
    const [hoveredStep, setHoveredStep] = useState(null);

    const steps = [
        { num: '01', title: 'Create RFP', desc: 'Use AI templates to draft clear requirements in minutes.' },
        { num: '02', title: 'Invite Vendors', desc: 'Publish to the marketplace or invite your private list.' },
        { num: '03', title: 'Receive Proposals', desc: 'Secure submission portal ensures fairness and organization.' },
        { num: '04', title: 'AI Scoring', desc: 'BidSense analyzes responses against your criteria instantly.' },
        { num: '05', title: 'Decision & Award', desc: 'Compare side-by-side and award the best value contract.' },
    ];

    return (
        <section ref={ref} className="py-32 bg-gray-50 dark:bg-gray-950">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className={`mb-20 transition-all duration-1000 ease-out ${hasAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                        Explore the entire journey.
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-500 max-w-2xl">
                        From the first draft to the final handshake, BidSense provides a unified workflow.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid md:grid-cols-5 gap-3">
                    {steps.map((step, idx) => (
                        <div
                            key={idx}
                            onMouseEnter={() => setHoveredStep(idx)}
                            onMouseLeave={() => setHoveredStep(null)}
                            className={`
                                relative group cursor-pointer
                                transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                                ${hasAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
                            `}
                            style={{ transitionDelay: `${idx * 100}ms` }}
                        >
                            <div className={`
                                h-full p-6 rounded-2xl border-2
                                transition-all duration-500 ease-out
                                ${hoveredStep === idx
                                    ? 'bg-gray-100 dark:bg-white border-gray-200 dark:border-white scale-[1.02]'
                                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
                                }
                                ${hoveredStep !== null && hoveredStep !== idx ? 'opacity-40 scale-[0.98]' : ''}
                            `}>
                                {/* Step Number */}
                                <span className={`
                                    text-5xl font-black block mb-6 transition-colors duration-300
                                    ${hoveredStep === idx ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-700'}
                                `}>
                                    {step.num}
                                </span>

                                {/* Title */}
                                <h3 className={`
                                    text-lg font-bold mb-3 transition-colors duration-300
                                    ${hoveredStep === idx ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'}
                                `}>
                                    {step.title}
                                </h3>

                                {/* Description */}
                                <p className={`
                                    text-sm leading-relaxed transition-colors duration-300
                                    ${hoveredStep === idx ? 'text-gray-600 dark:text-gray-400' : 'text-gray-600 dark:text-gray-500'}
                                `}>
                                    {step.desc}
                                </p>
                            </div>

                            {/* Connector Line (Desktop) */}
                            {idx !== steps.length - 1 && (
                                <div className={`
                                    hidden md:block absolute top-1/2 -right-1.5 w-3 h-0.5 z-10
                                    transition-colors duration-300
                                    ${hoveredStep === idx || hoveredStep === idx + 1 ? 'bg-gray-900 dark:bg-white' : 'bg-gray-300 dark:bg-gray-700'}
                                `} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WorkflowsSection;
