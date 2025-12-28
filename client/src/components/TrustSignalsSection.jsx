import React from 'react';
import { Shield, Mail, BarChart3, Users } from 'lucide-react';

const TrustSignalsSection = () => (
  <section className="px-6 py-16" style={{ backgroundColor: 'white' }}>
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-wrap justify-center gap-8 text-sm text-soft-gray">
        <div className="flex items-center gap-2">
          <Shield size={16} />
          <span>SOC 2 Type II Compliant</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail size={16} />
          <span>Works with 50+ email providers</span>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 size={16} />
          <span>10,000+ proposals parsed monthly</span>
        </div>
        <div className="flex items-center gap-2">
          <Users size={16} />
          <span>Trusted by procurement teams</span>
        </div>
      </div>
    </div>
  </section>
);

export default TrustSignalsSection;