import React, { useState } from 'react';

/**
 * Reusable Alert Component for RFP Management & BidSense Platform
 * @param {string} type - 'success' | 'error' | 'warning' | 'info'
 * @param {string} title - Optional bold heading
 * @param {string} message - The main content of the alert
 * @param {boolean} dismissible - Whether to show the close button
 * @param {function} onClose - Callback function when dismissed
 */
const Alert = ({ 
  type = 'info', 
  title, 
  message, 
  dismissible = false, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  // Define style mappings based on the alert type
  const typeStyles = {
    success: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-800',
      iconColor: 'text-emerald-500',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      iconColor: 'text-red-500',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      iconColor: 'text-amber-500',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    info: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      text: 'text-indigo-800',
      iconColor: 'text-indigo-500',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  const style = typeStyles[type] || typeStyles.info;

  return (
    <div 
      role="alert" 
      className={`flex items-start p-4 mb-4 rounded-xl border transition-all duration-300 animate-fade-in ${style.bg} ${style.border} ${style.text}`}
    >
      {/* Icon Section */}
      <div className={`flex-shrink-0 ${style.iconColor}`}>
        {style.icon}
      </div>

      {/* Content Section */}
      <div className="ml-3 flex-1">
        {title && (
          <h3 className="text-sm font-bold leading-none mb-1">
            {title}
          </h3>
        )}
        <div className="text-sm font-medium opacity-90">
          {message}
        </div>
      </div>

      {/* Dismiss Button */}
      {dismissible && (
        <button
          onClick={handleClose}
          className={`ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-lg inline-flex items-center justify-center h-8 w-8 hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent ${style.text}`}
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Alert;