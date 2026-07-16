import React from 'react';
import useScrollReveal from '../../hooks/useScrollReveal';

const MetricsSection = () => {
    const { ref, hasAnimated } = useScrollReveal();
    const metrics = [
        { value: "10,000+", label: "RFPs managed" },
        { value: "50,000+", label: "Proposals analyzed" },
        { value: "95%", label: "Faster evaluation" },
        { value: "100%", label: "Audit-ready" },
    ];

    return (
        <section ref={ref} className="py-24 bg-white dark:bg-black border-y border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {metrics.map((metric, idx) => (
                        <div key={idx} className={`p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-500 flex flex-col items-center justify-center text-center group ${hasAnimated ? `opacity-100 translate-y-0 transition-all duration-700 ease-out delay-[${idx * 150}ms]` : 'opacity-0 translate-y-6'}`}>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{metric.value}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-500 font-medium">{metric.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MetricsSection;
