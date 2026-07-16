import React from 'react';
import { useNavigate } from 'react-router-dom';
import useScrollReveal from '../../hooks/useScrollReveal';

const HeroSection = () => {
    const navigate = useNavigate();
    const { ref, hasAnimated } = useScrollReveal();

    return (
        <section ref={ref} className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden bg-white dark:bg-black">
            <div className="relative max-w-7xl mx-auto px-6 text-center z-10">

                {/* Badge */}
                <div className={`inline-flex items-center space-x-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full px-5 py-2 mb-10 transition-all duration-1000 ease-out ${hasAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">New: AI Auto-Scoring</span>
                </div>

                {/* Headline */}
                <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white tracking-tight mb-8 leading-[1.05] transition-all duration-1000 ease-out delay-100 ${hasAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    Discover smarter <br className="hidden md:block" />
                    RFP decisions with AI.
                </h1>

                {/* Subheading */}
                <p className={`max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400 mb-12 leading-relaxed transition-all duration-1000 ease-out delay-200 ${hasAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    AI-powered RFP creation, proposal comparison, and intelligent vendor scoring — all in one platform.
                </p>

                {/* CTAs */}
                <div className={`flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 transition-all duration-1000 ease-out delay-300 ${hasAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <button
                        onClick={() => navigate('/signup')}
                        className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 text-lg font-semibold rounded-2xl hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                    >
                        Get Started Free
                    </button>
                    <button
                        className="w-full sm:w-auto px-8 py-4 bg-transparent text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-800 text-lg font-semibold rounded-2xl hover:border-gray-400 dark:hover:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-300"
                    >
                        See How It Works
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
