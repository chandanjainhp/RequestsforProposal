import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const AlertsDemoSection = () => (
  <section className="px-6 py-20 bg-warm-off-white">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold text-charcoal text-center mb-12">System Notifications</h2>
      <div className="space-y-4">
        <div className="alert-success">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} />
            <span className="font-medium">Success!</span>
          </div>
          <p className="mt-1">Your RFP has been successfully sent to all vendors.</p>
        </div>

        <div className="alert-info">
          <div className="flex items-center gap-2">
            <Info size={16} />
            <span className="font-medium">Information</span>
          </div>
          <p className="mt-1">New vendor proposal received from TechCorp Solutions.</p>
        </div>

        <div className="alert-warning">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span className="font-medium">Warning</span>
          </div>
          <p className="mt-1">Incomplete proposal detected. Missing pricing information.</p>
        </div>

        <div className="alert-error">
          <div className="flex items-center gap-2">
            <X size={16} />
            <span className="font-medium">Error</span>
          </div>
          <p className="mt-1">Failed to parse vendor email. Please check attachment format.</p>
        </div>
      </div>
    </div>
  </section>
);
export default AlertsDemoSection;