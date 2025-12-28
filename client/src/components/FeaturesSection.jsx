import React from 'react';
import { FileText, BarChart3, Mail } from 'lucide-react';

const FeaturesSection = () => (
  <section className="py-16 px-6 max-w-7xl mx-auto">
    <h2 className="text-3xl font-[640] text-charcoal text-center mb-12">Core Capabilities</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
        <FileText className="w-10 h-10 text-muted-blue mb-4" />
        <h3 className="font-[560] text-charcoal mb-3">AI Proposal Parsing</h3>
        <p className="text-sm text-soft-gray leading-relaxed">Automatically extracts pricing, delivery, and warranty details from vendor emails and attachments in seconds.</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
        <BarChart3 className="w-10 h-10 text-muted-blue mb-4" />
        <h3 className="font-[560] text-charcoal mb-3">Intelligent Vendor Scoring</h3>
        <p className="text-sm text-soft-gray leading-relaxed">Weighted scoring system for price, delivery, warranty, and completeness — fully transparent and configurable.</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
        <Mail className="w-10 h-10 text-muted-blue mb-4" />
        <h3 className="font-[560] text-charcoal mb-3">Email-Native Workflow</h3>
        <p className="text-sm text-soft-gray leading-relaxed">Vendors simply reply via email. BidSense handles matching, parsing, and scoring automatically.</p>
      </div>
    </div>
  </section>
);
export default FeaturesSection; 
