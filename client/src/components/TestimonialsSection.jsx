import React from 'react';

const TestimonialsSection = () => (
  <section className="py-20 px-6" style={{ backgroundColor: '#FFFFE3' }}>
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-semibold text-charcoal mb-4">
          Trusted by Procurement Teams Worldwide
        </h2>
        <p className="text-xl text-charcoal max-w-3xl mx-auto">
          See how BidSense is transforming procurement decisions for organizations like yours.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-muted-blue flex items-center justify-center text-warm-off-white font-bold">
              SJ
            </div>
            <div className="ml-4">
              <h4 className="font-semibold text-charcoal">Sarah Johnson</h4>
              <p className="text-sm text-soft-gray">Procurement Director, TechCorp</p>
            </div>
          </div>
          <p className="text-charcoal italic">
            "BidSense reduced our RFP evaluation time by 70%. The AI scoring is incredibly accurate and the email integration makes it seamless for our vendors."
          </p>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-muted-blue flex items-center justify-center text-warm-off-white font-bold">
              MR
            </div>
            <div className="ml-4">
              <h4 className="font-semibold text-charcoal">Michael Rodriguez</h4>
              <p className="text-sm text-soft-gray">VP Procurement, Global Systems</p>
            </div>
          </div>
          <p className="text-charcoal italic">
            "The automated scoring and comparison features have eliminated bias from our vendor selection process. Our decisions are now data-driven and transparent."
          </p>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-muted-blue flex items-center justify-center text-warm-off-white font-bold">
              AL
            </div>
            <div className="ml-4">
              <h4 className="font-semibold text-charcoal">Amanda Liu</h4>
              <p className="text-sm text-soft-gray">Procurement Manager, InnovateNow</p>
            </div>
          </div>
          <p className="text-charcoal italic">
            "BidSense's email-native workflow means our vendors can respond naturally without learning new systems. It's revolutionized how we handle RFPs."
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default TestimonialsSection;