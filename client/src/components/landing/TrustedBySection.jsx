import React from 'react';
import useScrollReveal from '../../hooks/useScrollReveal';

const TrustedBySection = () => {
    const { ref, hasAnimated } = useScrollReveal();

    const logos = [
        "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
        "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/c/c1/Oracle_Logo.svg"
    ];

    return (
        <section ref={ref} className="py-12 border-b border-gray-800 bg-black">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <p className={`text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-8 ${hasAnimated ? 'opacity-100 translate-y-0 transition-opacity duration-700' : 'opacity-0 translate-y-4'}`}>
                    Trusted by procurement teams worldwide
                </p>
                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
                    {logos.map((logo, index) => (
                        <img
                            key={index}
                            src={logo}
                            alt="Brand Logo"
                            className={`h-6 md:h-8 w-auto grayscale transition-all duration-700 hover:grayscale-0 hover:opacity-100 dark:invert dark:opacity-50 dark:hover:opacity-100 ${hasAnimated ? `opacity-40 translate-y-0 delay-[${index * 100}ms]` : 'opacity-0 translate-y-4'}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustedBySection;
