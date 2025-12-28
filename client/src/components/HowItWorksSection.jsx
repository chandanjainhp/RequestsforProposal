import React from 'react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: "Create RFP",
      description: "Natural language builder",
      icon: "📝"
    },
    {
      number: 2,
      title: "Send via Email",
      description: "One-click distribution",
      icon: "📧"
    },
    {
      number: 3,
      title: "Vendors Reply",
      description: "No portal required",
      icon: "💬"
    },
    {
      number: 4,
      title: "AI Parses & Scores",
      description: "Automatic extraction",
      icon: "🤖"
    },
    {
      number: 5,
      title: "Compare & Select",
      description: "Side-by-side view",
      icon: "✅"
    }
  ];

  return (
    <section className="py-16 px-6 bg-warm-off-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-[640] text-charcoal text-center mb-12">
          How It Works
        </h2>

        {/* Desktop Layout - Horizontal */}
        <div className="hidden lg:flex justify-between items-start relative">
          {/* Connection Line */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-soft-gray -z-10" 
               style={{ width: 'calc(100% - 96px)', left: '48px' }} />
          
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center flex-1 relative">
              {/* Circle with Number */}
              <div className="w-12 h-12 bg-muted-blue text-warm-off-white rounded-full flex items-center justify-center font-[640] text-lg mb-4 shadow-lg relative z-10">
                {step.number}
              </div>
              
              {/* Content */}
              <div className="text-center max-w-[180px]">
                <h3 className="font-[560] text-charcoal text-base mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-blue font-[460]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile/Tablet Layout - Vertical */}
        <div className="lg:hidden space-y-6">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-4 relative">
              {/* Vertical Line */}
              {idx < steps.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-soft-gray -z-10" />
              )}
              
              {/* Circle with Number */}
              <div className="w-12 h-12 bg-muted-blue text-warm-off-white rounded-full flex items-center justify-center font-[640] text-lg flex-shrink-0 shadow-lg relative z-10">
                {step.number}
              </div>
              
              {/* Content */}
              <div className="flex-1 pt-2">
                <h3 className="font-[560] text-charcoal text-base mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-blue font-[460]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
