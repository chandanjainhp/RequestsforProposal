import React from 'react';
import { Clock, Shield, Zap, TrendingDown } from 'lucide-react';

const BenefitsSection = () => (
  <section className="px-6 py-20">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-semibold text-charcoal mb-4">Business Outcomes</h2>
        <p className="text-xl text-charcoal">Measurable results that matter to procurement teams</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="flex items-start gap-6">
          <Clock size={32} className="text-muted-blue flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-2xl font-semibold text-charcoal mb-3">70% Faster Decisions</h3>
            <p className="text-charcoal text-lg leading-relaxed">
              Reduce evaluation cycles from weeks to days with automated parsing and scoring.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-6">
          <Shield size={32} className="text-muted-blue flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-2xl font-semibold text-charcoal mb-3">100% Objective Selection</h3>
            <p className="text-charcoal text-lg leading-relaxed">
              Eliminate human bias with transparent, configurable scoring algorithms.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-6">
          <Zap size={32} className="text-muted-blue flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-2xl font-semibold text-charcoal mb-3">Zero Workflow Disruption</h3>
            <p className="text-charcoal text-lg leading-relaxed">
              Vendors use existing email; no training or portal adoption required.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-6">
          <TrendingDown size={32} className="text-muted-blue flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-2xl font-semibold text-charcoal mb-3">30% Cost Reduction</h3>
            <p className="text-charcoal text-lg leading-relaxed">
              Eliminate manual data entry and spreadsheet error correction overhead.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default BenefitsSection;