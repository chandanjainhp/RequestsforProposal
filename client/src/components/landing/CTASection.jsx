import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useScrollReveal from '../../hooks/useScrollReveal';

const CTASection = () => {
    const navigate = useNavigate();
    const { ref, hasAnimated } = useScrollReveal();
    const [hoveredWord, setHoveredWord] = useState(null);

    const words = [
        { text: 'From', highlight: false },
        { text: 'RFP', highlight: true },
        { text: 'creation', highlight: false },
        { text: 'to', highlight: false },
        { text: 'confident', highlight: true },
        { text: 'decisions.', highlight: false },
    ];

    return (
        <section ref={ref} className="py-32 lg:py-48 bg-white dark:bg-black text-center relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 relative z-10">

                {/* Main Headline with Interactive Words */}
                <h2 className={`
                    text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-16 leading-[1.1]
                    transition-all duration-1000 ease-out
                    ${hasAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
                `}>
                    <span className="flex flex-wrap justify-center gap-x-4 md:gap-x-6">
                        {words.map((word, idx) => (
                            <span
                                key={idx}
                                onMouseEnter={() => setHoveredWord(idx)}
                                onMouseLeave={() => setHoveredWord(null)}
                                className={`
                                    inline-block cursor-default
                                    transition-all duration-500 ease-out
                                    ${word.highlight
                                        ? 'text-gray-900 dark:text-white'
                                        : 'text-gray-600 dark:text-gray-400'
                                    }
                                    ${hoveredWord === idx ? 'scale-110 text-gray-900 dark:text-white' : ''}
                                    ${hoveredWord !== null && hoveredWord !== idx ? 'opacity-30' : ''}
                                `}
                                style={{ transitionDelay: `${idx * 50}ms` }}
                            >
                                {word.text}
                            </span>
                        ))}
                    </span>
                </h2>

                {/* Subtitle */}
                <p className={`
                    text-xl text-gray-600 dark:text-gray-500 max-w-2xl mx-auto mb-12
                    transition-all duration-1000 ease-out delay-200
                    ${hasAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                `}>
                    Join thousands of procurement teams making smarter decisions with AI.
                </p>

                {/* CTA Buttons */}
                <div className={`
                    flex flex-col sm:flex-row items-center justify-center gap-4
                    transition-all duration-1000 ease-out delay-300
                    ${hasAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                `}>
                    <button
                        onClick={() => navigate('/signup')}
                        className="
                            group relative w-full sm:w-auto px-10 py-5
                            bg-gray-900 dark:bg-white
                            text-white dark:text-gray-900
                            text-lg font-semibold rounded-2xl
                            transition-all duration-300
                            hover:scale-105 hover:shadow-2xl
                            overflow-hidden
                        "
                    >
                        <span className="relative z-10">Start Using BidSense</span>
                        <div className="absolute inset-0 bg-gray-800 dark:bg-gray-100 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </button>

                    <button
                        className="
                            w-full sm:w-auto px-10 py-5
                            bg-transparent
                            text-gray-900 dark:text-white
                            border-2 border-gray-200 dark:border-gray-800
                            text-lg font-semibold rounded-2xl
                            transition-all duration-300
                            hover:border-gray-900 dark:hover:border-white
                            hover:scale-105
                        "
                    >
                        Request a Demo
                    </button>
                </div>

                {/* Decorative Elements */}
                <div className={`
                    mt-20 flex justify-center items-center gap-8
                    transition-all duration-1000 ease-out delay-500
                    ${hasAnimated ? 'opacity-100' : 'opacity-0'}
                `}>
                    <div className="w-16 h-px bg-gray-300 dark:bg-gray-800" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">No credit card required</span>
                    <div className="w-16 h-px bg-gray-300 dark:bg-gray-800" />
                </div>
            </div>
        </section>
    );
};

export default CTASection;
