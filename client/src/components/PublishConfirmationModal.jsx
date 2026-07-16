import React, { useState, useEffect } from 'react';

/**
 * PublishConfirmationModal
 * @param {boolean} isOpen - Controls visibility
 * @param {function} onClose - Function to close the modal
 * @param {function} onConfirm - Function to trigger the publish logic
 * @param {string} rfpTitle - The name of the RFP being published
 */
const PublishConfirmationModal = ({ isOpen, onClose, onConfirm, rfpTitle }) => {
  const [isPublishing, setIsPublishing] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handlePublish = () => {
    setIsPublishing(true);
    // Simulate API delay before calling parent onConfirm
    setTimeout(() => {
      onConfirm();
      setIsPublishing(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto outline-none">
      {/* --- Backdrop --- */}
      <div 
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
        aria-hidden="true"
      ></div>

      {/* --- Modal Card --- */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="px-8 pt-8 pb-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-50 rounded-2xl mb-6 border border-amber-100">
            <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Publish RFP?
          </h2>
        </div>

        {/* Modal Body */}
        <div className="px-8 pb-8">
          <p className="text-center text-gray-600 mb-6">
            You are about to publish <span className="font-bold text-indigo-600">"{rfpTitle || 'this RFP'}"</span>. 
            Once published, vendors will be notified immediately.
          </p>

          {/* Readiness Checklist */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-6">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Readiness Checklist</h4>
            <ul className="space-y-3">
              {[
                "All RFP sections completed",
                "Evaluation criteria defined",
                "Submission deadline set"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center text-sm font-semibold text-gray-700">
                  <svg className="w-4 h-4 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start space-x-3">
            <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              Note: Core document structures may be restricted from editing after publication to maintain bidding integrity.
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-8 pb-8 flex flex-col sm:flex-row-reverse gap-3">
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className={`flex-1 inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${isPublishing ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isPublishing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Publishing...
              </>
            ) : (
              "Confirm & Publish"
            )}
          </button>
          <button
            onClick={onClose}
            disabled={isPublishing}
            className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishConfirmationModal;