import React, { useEffect, useRef, useState } from 'react';

const FlowCard = ({ title, description, visual, animationType = 'fade-up', stepNumber }) => {
    const cardRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.2, // Trigger when 20% of card is visible
                rootMargin: '0px 0px -50px 0px'
            }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            if (cardRef.current) observer.unobserve(cardRef.current);
        };
    }, []);

    const getAnimationClass = () => {
        if (!isVisible) return 'opacity-0 translate-y-10'; // Default hidden state

        switch (animationType) {
            case 'fade-up':
                return 'opacity-100 translate-y-0';
            case 'slide-right':
                return 'opacity-100 translate-x-0'; // Start was -translate-x-10
            case 'slide-left':
                return 'opacity-100 translate-x-0'; // Start was translate-x-10
            case 'scale-in':
                return 'opacity-100 scale-100'; // Start was scale-90
            case 'progress':
                return 'opacity-100 translate-y-0';
            default:
                return 'opacity-100 translate-y-0';
        }
    };

    const getInitialClass = () => {
        switch (animationType) {
            case 'fade-up': return 'translate-y-10';
            case 'slide-right': return '-translate-x-10';
            case 'slide-left': return 'translate-x-10';
            case 'scale-in': return 'scale-90';
            case 'progress': return 'translate-y-5';
            default: return 'translate-y-10';
        }
    };

    return (
        <div
            ref={cardRef}
            className={`
                relative p-8 rounded-2xl overflow-hidden
                bg-white dark:bg-slate-900 
                border border-slate-200 dark:border-slate-800 
                shadow-sm hover:shadow-lg
                transition-all duration-500 ease-out
                group
                ${isVisible ? getAnimationClass() : `opacity-0 ${getInitialClass()}`}
            `}
        >
            {/* Step Number Badge */}
            <div className="absolute top-6 right-6 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 z-20">
                {stepNumber}
            </div>

            <div className="relative z-10 flex flex-col h-full">
                {/* Visual Height Placeholder/Container */}
                <div className="mb-6 w-full h-48 bg-slate-50 dark:bg-slate-800/50 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 flex items-center justify-center p-4">
                    {/* Visual Content Injected Here */}
                    <div className="transform transition-transform duration-500 group-hover:scale-105">
                        {visual}
                    </div>
                </div>

                <div className="mt-auto">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        {title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FlowCard;
