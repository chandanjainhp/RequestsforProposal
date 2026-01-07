import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, Save, Trash2, X } from 'lucide-react';
import ChatInput from '../components/ChatInput';
import ChatBubble from '../components/ChatBubble';
import BidSenseStepper from '../components/BidSenseStepper';
import BidSensePreviewExpanded from '../components/BidSensePreviewExpanded';
import { parseBidSense, saveBidSense } from '../api/bidsense';
import { useBidSenseStore } from '../store/bidsenseStore';
import { useNotificationStore } from '../store/notificationStore';
import SaveStatusIndicator from '../components/SaveStatusIndicator';
import { PrimaryButton, SecondaryButton } from '../components/Button';

export default function ChatPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [savingBidSense, setSavingBidSense] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const messagesEndRef = useRef(null);

  const {
    chatMessages,
    parsedBidSense,
    addMessage,
    clearMessages,
    setParsedBidSense,
    setChatLoading,
    saveStatus,
    lastSavedAt,
    isDirty,
    drafts,
    loadDraft,
    startNewDraft,
    clearAllDrafts,
  } = useBidSenseStore();

  // Mobile detection with proper hydration handling
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Handle unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleSendMessage = async (message) => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    setChatLoading(true);

    addMessage({
      text: message,
      isUser: true,
      timestamp: new Date(),
    });

    try {
      const result = await parseBidSense(message);
      const confidence = typeof result.parse_confidence === 'number' ? result.parse_confidence : 0.3;
      const confidencePercent = Math.round(confidence * 100);
      
      // Translate confidence into user-friendly quality indicator
      let qualityLabel = 'Good';
      if (confidencePercent >= 80) {
        qualityLabel = 'Excellent';
      } else if (confidencePercent < 60) {
        qualityLabel = 'Getting there';
      }

      addMessage({
        text: qualityLabel === 'Excellent' 
          ? "Perfect! Ready to review your RFP whenever you are." 
          : qualityLabel === 'Good'
          ? "Looking good. Want to add more details, or ready to review?"
          : "I got most of it. A few more details would help:\n• Quantity (how many?)\n• Timeline (when?)\n• Budget (if you have one)",
        isUser: false,
        timestamp: new Date(),
      });

      const parsedData = result.parsed_rfp || result.parsed_data || result;
      const bidsenseToStore = {
        ...parsedData,
        confidence: confidence,
        title: parsedData.title || 'Untitled RFP',
        description: parsedData.description || parsedData.summary || '',
      };

      // Fallback parsing for budget and delivery
      if (!bidsenseToStore.budget && message.toLowerCase().includes('budget')) {
        const budgetMatch = message.match(/\$([0-9,]+(?:\.[0-9]+)?)/);
        if (budgetMatch) {
          bidsenseToStore.budget = parseInt(budgetMatch[1].replace(/,/g, ''));
          bidsenseToStore.currency = bidsenseToStore.currency || 'USD';
        }
      }

      if (!bidsenseToStore.delivery_days && message.toLowerCase().includes('week')) {
        const weekMatch = message.match(/(\d+)\s*week/);
        if (weekMatch) {
          bidsenseToStore.delivery_days = parseInt(weekMatch[1]) * 7;
        }
      }

      setParsedBidSense(bidsenseToStore);
      setShowMobilePreview(true);

      if (result.warnings?.length > 0) {
        addMessage({
          text: `⚠️ Note: ${result.warnings.join(', ')}`,
          isUser: false,
          timestamp: new Date(),
        });
      }
    } catch (err) {
      console.error('Parse error:', err);
      // Convert errors into constructive guidance, not apologies
      let guidanceText = 'I understood most of what you need, but I\'m missing a few details. Try adding:';
      let details = [];
      
      const lowerMessage = message.toLowerCase();
      if (!lowerMessage.includes('how many') && !lowerMessage.match(/\d+\s*(units?|items?|pieces?|chairs?|laptops?|servers?)/i)) {
        details.push('• Quantity (how many items)');
      }
      if (!lowerMessage.includes('when') && !lowerMessage.match(/(days?|weeks?|months?|by|deadline)/i)) {
        details.push('• Timeline (when you need them)');
      }
      if (!lowerMessage.includes('budget') && !lowerMessage.match(/\$|\busd\b|budget/i)) {
        details.push('• Budget (if you have one)');
      }
      
      if (details.length === 0) {
        guidanceText = 'That helps! Let me know if there are any other details—specifications, location, or preferences?';
      }
      
      addMessage({
        text: guidanceText + (details.length > 0 ? '\n' + details.join('\n') : ''),
        isUser: false,
        timestamp: new Date(),
      });
    } finally {
      setLoading(false);
      setChatLoading(false);
      setInputValue('');
    }
  };

  const handleSaveRfp = async () => {
    if (!parsedBidSense) {
      setError('No parsed RFP to save');
      return;
    }

    setSavingBidSense(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await saveBidSense(parsedBidSense);
      const bidsenseId = result._id || result.bidsense_id;
      
      if (!bidsenseId) {
        setError('Failed to get RFP ID from server');
        return;
      }
      
      setSuccess('RFP saved successfully! Redirecting to editor...');
      setTimeout(() => navigate(`/editor/${bidsenseId}`), 1500);
    } catch (err) {
      console.error('Save RFP error:', err);
      setError(err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Failed to save RFP');
    } finally {
      setSavingBidSense(false);
    }
  };

  const handleLoadDraft = (draftId) => {
    if (loadDraft(draftId)) {
      setSuccess('Draft loaded successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError('Failed to load draft');
    }
  };

  const handleClearAllDrafts = async () => {
    const { showConfirm } = useNotificationStore.getState();
    
    const confirmed = await showConfirm({
      title: 'Clear All Drafts',
      message: 'Are you sure you want to clear all draft data? This cannot be undone.',
      confirmText: 'Clear All',
      cancelText: 'Cancel',
      type: 'danger'
    });
    
    if (confirmed) {
      clearAllDrafts();
      setSuccess('All drafts cleared successfully!');
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleStartNew = () => {
    startNewDraft();
    clearMessages();
    setParsedBidSense(null);
    setShowMobilePreview(false);
    setError(null);
    setSuccess(null);
  };

  const handleFieldChange = (field, value) => {
    if (!parsedBidSense) return;
    
    const updatedBidSense = { ...parsedBidSense };
    
    if (field === 'budget' && value) {
      updatedBidSense.budget = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    } else if (field === 'delivery_days' && value) {
      updatedBidSense.delivery_days = parseInt(value) || 0;
    } else if (field === 'warranty_months' && value) {
      updatedBidSense.warranty_months = parseInt(value) || 0;
    } else {
      updatedBidSense[field] = value;
    }
    
    setParsedBidSense(updatedBidSense);
    // No notification - preview updating IS the feedback
  };

  const handleEditRfp = async () => {
    if (!parsedBidSense) {
      setError('No parsed RFP to edit');
      return;
    }

    setSavingBidSense(true);
    setError(null);
    setSuccess(null);

    try {
      const bidsenseToSave = {
        ...parsedBidSense,
        title: parsedBidSense.title || 'Untitled RFP',
        description: parsedBidSense.description || parsedBidSense.summary || '',
      };

      const result = await saveBidSense(bidsenseToSave);
      const bidsenseId = result._id || result.bidsense_id;
      
      if (!bidsenseId) {
        setError('Failed to get RFP ID from server');
        setSavingBidSense(false);
        return;
      }
      
      setSuccess('RFP saved! Opening editor...');
      navigate(`/editor/${bidsenseId}`);
    } catch (err) {
      console.error('Edit RFP error:', err);
      setError(err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Failed to save RFP');
      setSavingBidSense(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      {/* Page Header */}
      <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Save Status & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Save Status Indicator */}
            {parsedBidSense && (
              <SaveStatusIndicator
                status={saveStatus}
                lastSavedAt={lastSavedAt}
                isDirty={isDirty}
              />
            )}

            {/* Action Buttons */}
            {parsedBidSense && (
              <div className="flex flex-wrap gap-2">
                <PrimaryButton
                  onClick={handleEditRfp}
                  loading={savingBidSense}
                  className="text-sm whitespace-nowrap"
                >
                  Continue to Review →
                </PrimaryButton>
                <SecondaryButton
                  onClick={handleStartNew}
                  className="text-sm whitespace-nowrap"
                >
                  Start Over
                </SecondaryButton>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Workflow Stepper - Compact */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3">
        <BidSenseStepper currentStep={1} />
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Chat Section */}
        <div className="w-full lg:w-[640px] flex-shrink-0 flex flex-col border-r border-gray-200">
          {/* Alert Messages */}
          {error && (
            <div className="m-4 p-4 bg-red-100 border border-red-500 text-red-700 rounded-lg flex items-center gap-2 flex-shrink-0">
              <AlertCircle size={20} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="m-4 p-4 bg-green-100 border border-green-500 text-green-700 rounded-lg flex items-center gap-2 flex-shrink-0">
              <CheckCircle size={20} />
              <span className="text-sm">{success}</span>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-2 bg-gray-50">
            {chatMessages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center">
                <div className="max-w-2xl">
                  <h1 className="text-3xl font-600 text-gray-900 mb-2">Describe your purchase. We'll create the RFP for you.</h1>
                  <p className="text-base text-gray-600 leading-relaxed mb-6">
                    Include items, budget, and timeline — we'll structure everything automatically.
                  </p>
                  <button
                    onClick={() => document.querySelector('textarea')?.focus()}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-sm mb-6"
                  >
                    Generate RFP Preview →
                  </button>
                  <p className="text-sm text-gray-500 mb-8">You can edit everything before sending. Nothing is final yet.</p>
                </div>
              </div>
            ) : (
              <>
                {chatMessages.map((msg, idx) => (
                  <ChatBubble
                    key={idx}
                    message={msg.text}
                    isUser={msg.isUser}
                    timestamp={msg.timestamp}
                  />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Chat Input */}
          <div className="shrink-0 px-4 md:px-6 py-4 border-t bg-white">
            <ChatInput
              onSend={handleSendMessage}
              loading={loading}
              placeholder="List what you need, budget, and delivery timeline. Example: 20 laptops, ₹12L budget, delivery in 2 weeks."
              value={inputValue}
              onChange={setInputValue}
              autoFocus={true}
            />
          </div>
        </div>

          {/* Desktop Preview - Right Side */}
          <div className="hidden lg:block lg:flex-1 overflow-y-auto px-6 py-6 bg-white">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Your RFP</h3>
            </div>

            {parsedBidSense ? (
              <>
                <BidSensePreviewExpanded
                  rfp={parsedBidSense}
                  onEdit={handleEditRfp}
                  editLoading={savingBidSense}
                  onFieldChange={handleFieldChange}
                />
                <div className="mt-6 flex gap-2">
                  <button
                    onClick={handleEditRfp}
                    disabled={savingBidSense}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {savingBidSense ? 'Saving...' : 'Review & Send RFP'}
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-base font-medium text-gray-900 mb-2">Your RFP will appear here</p>
                <p className="text-sm text-gray-600">
                  Start typing on the left to see a live preview.
                </p>
              </div>
            )}
          </div>
      </div>

      {/* Mobile Preview - Bottom Drawer */}
      {parsedBidSense && showMobilePreview && isMobile && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowMobilePreview(false)}>
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] bg-white rounded-t-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 sticky top-0 bg-white border-b border-gray-200 flex justify-between items-center z-10">
              <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
              <button 
                onClick={() => setShowMobilePreview(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-64px)]">
              <BidSensePreviewExpanded
                rfp={parsedBidSense}
                onEdit={handleEditRfp}
                editLoading={savingBidSense}
                onFieldChange={handleFieldChange}
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile CTA Bar */}
      {parsedBidSense && isMobile && (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 space-y-2">
          <button
            onClick={handleEditRfp}
            disabled={savingBidSense}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {savingBidSense ? 'Saving...' : 'Review & Send RFP'}
          </button>
          <button
            onClick={handleStartNew}
            className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}
