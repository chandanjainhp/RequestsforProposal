

import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => (
  <section className="px-6 py-20 max-w-7xl mx-auto text-center">
    <h1 className="text-5xl lg:text-6xl font-semibold text-charcoal mb-6 leading-tight">
      Turn Vendor Bids Into<br />
      <span className="text-muted-blue">Confident Decisions</span>
    </h1>
    <p className="text-xl text-charcoal mb-8 max-w-3xl mx-auto leading-relaxed">
      AI-powered RFP parsing, automatic proposal scoring, and intelligent vendor comparison
      via email-native workflow. Make procurement decisions with unprecedented clarity and speed.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
      <button className="btn-primary">Start Free Trial</button>
      <button className="btn-secondary">Watch Demo</button>
    </div>

    {/* Demo Card */}
    <div className="card max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold text-charcoal">Live Vendor Comparison</span>
        <span className="text-sm text-muted-blue">Real-time Scores</span>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 border border-soft-gray rounded-lg">
          <div>
            <p className="font-semibold text-charcoal">TechCorp Solutions</p>
            <p className="text-sm text-soft-gray">Price: $45,000</p>
          </div>
          <div className="px-3 py-1 rounded-full text-sm font-semibold bg-primary text-warm-off-white">
            92
          </div>
        </div>
        <div className="flex justify-between items-center p-3 border border-soft-gray rounded-lg">
          <div>
            <p className="font-semibold text-charcoal">Global Systems Inc</p>
            <p className="text-sm text-soft-gray">Price: $42,000</p>
          </div>
          <div className="px-3 py-1 rounded-full text-sm font-semibold bg-charcoal text-warm-off-white">
            85
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;