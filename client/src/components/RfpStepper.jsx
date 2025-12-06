/**
 * WORKFLOW STEPPER COMPONENT
 * Shows current progress through RFP creation workflow
 * PRINCIPLE: VISIBILITY - User always knows where they are
 * PRINCIPLE: MAPPING - Visual representation matches mental model
 */

import { CheckCircle2, Circle } from 'lucide-react';

export default function RfpStepper({ currentStep = 1 }) {
  const steps = [
    { number: 1, label: 'Create', path: '/chat' },
    { number: 2, label: 'Review', path: '/editor' },
    { number: 3, label: 'Vendors', path: '/send' },
    { number: 4, label: 'Compare', path: '/compare' },
  ];

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center flex-1">
          {/* Step Circle */}
          <div className="flex flex-col items-center relative">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step.number < currentStep
                  ? 'bg-green-500 text-white'
                  : step.number === currentStep
                  ? 'bg-blue-500 text-white border-2 border-blue-600 shadow-lg'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step.number < currentStep ? (
                <CheckCircle2 size={24} />
              ) : (
                <span>{step.number}</span>
              )}
            </div>
            {/* Label */}
            <p
              className={`text-xs font-medium mt-2 ${
                step.number <= currentStep ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              {step.label}
            </p>
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                step.number < currentStep ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
