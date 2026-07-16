import React from 'react';
import useScrollReveal from '../../hooks/useScrollReveal';

const TestimonialsSection = () => {
    const { ref, hasAnimated } = useScrollReveal();

    const testimonials = [
        { name: "Sarah Jenkins", role: "CPO at TechGlobal", quote: "BidSense reduced our RFP cycle time by 50%. The AI scoring is basically magic for technical proposals." },
        { name: "Michael Ross", role: "Procurement Lead", quote: "Finally, a tool that looks like it was built in this decade. My team actually enjoys using it." },
        { name: "David Chen", role: "Director of Sourcing", quote: "The transparency it provides for our audit trails is invaluable. A must-have for compliance." },
    ];

    return (
        <section ref={ref} className="py-24 bg-white dark:bg-black border-y border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className={`text-4xl font-bold text-center text-gray-900 dark:text-white mb-16 ${hasAnimated ? 'opacity-100 translate-y-0 transition-all duration-700 ease-out' : 'opacity-0 translate-y-6'}`}>What procurement leaders are saying</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, idx) => (
                        <div key={idx} className={`p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-500 ${hasAnimated ? `opacity-100 translate-y-0 transition-all duration-700 ease-out delay-[${idx * 150}ms]` : 'opacity-0 translate-y-6'}`}>

                            {/* Header: Avatar & Info */}
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg border border-indigo-100 dark:border-indigo-500/20">
                                    {t.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{t.name}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">{t.role}</p>
                                </div>
                            </div>

                            {/* Stars */}
                            <div className="flex items-center space-x-1 mb-4">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <svg key={star} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed">"{t.quote}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
