/**
 * WORKFLOW STEPPER COMPONENT
 * Shows current progress through RFP creation workflow
 * PRINCIPLE: VISIBILITY - User always knows where they are
 * PRINCIPLE: MAPPING - Verb-based steps match user's mental model
 */

import { CheckCircle2 } from 'lucide-react';

export default function BidSenseStepper({ currentStep = 1 }) {
  const steps = [
    { number: 1, label: 'Describe need' },
    { number: 2, label: 'Review RFP' },
    { number: 3, label: 'Select vendors' },
    { number: 4, label: 'Send & compare' },
  ];

  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center flex-1 min-w-0">
          {/* Step Circle with Label */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step.number < currentStep
                  ? 'bg-green-500 text-white'
                  : step.number === currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step.number < currentStep ? (
                <CheckCircle2 size={16} />
              ) : (
                <span>{step.number}</span>
              )}
            </div>
            <span className={`text-sm font-medium whitespace-nowrap ${
              step.number <= currentStep ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {step.label}
            </span>
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 rounded-full transition-all ${
                step.number < currentStep ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
