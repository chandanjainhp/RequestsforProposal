import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, Save, Trash2, X } from 'lucide-react';
import ChatInput from '../components/ChatInput';
import ChatBubble from '../components/ChatBubble';
import BidSenseStepper from '../components/BidSenseStepper';
import BidSensePreviewExpanded from '../components/BidSensePreviewExpanded';
import Breadcrumb from '../components/Breadcrumb';
import StickyActionBar from '../components/StickyActionBar';
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

      addMessage({
        text: `✅ RFP parsed successfully! (Confidence: ${confidencePercent}%)`,
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
      setError(err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Failed to parse RFP. Please try again.');
      addMessage({
        text: 'Sorry, I encountered an error while parsing. Please try again.',
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
    setSuccess('Field updated successfully');
    setTimeout(() => setSuccess(null), 2000);
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
    <div className="w-full min-h-screen flex flex-col bg-warm-off-white">
      {/* Page Header */}
      <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* Breadcrumb Navigation */}
          <div className="flex-1 min-w-0">
            <Breadcrumb items={[
              { label: 'Create RFP', href: null }
            ]} />
          </div>

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
                  onClick={handleSaveRfp}
                  loading={savingBidSense}
                  className="text-sm whitespace-nowrap"
                >
                  <Save size={16} className="inline mr-1" />
                  Save as Draft
                </PrimaryButton>
                <SecondaryButton
                  onClick={handleStartNew}
                  className="text-sm whitespace-nowrap"
                >
                  Start New
                </SecondaryButton>
                <SecondaryButton
                  onClick={handleStartNew}
                  className="text-sm whitespace-nowrap text-red-600 border-red-300"
                >
                  <Trash2 size={16} className="inline mr-1" />
                  Discard
                </SecondaryButton>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Workflow Stepper */}
      <BidSenseStepper currentStep={1} />

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
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4">
            {chatMessages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center">
                <div className="max-w-2xl px-4">
                  <div className="text-4xl mb-3">📝</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Your First RFP</h3>
                  <p className="text-sm text-gray-600 mb-4">Start by describing what you need to procure. Be specific!</p>
                  <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
                    <p className="text-xs font-semibold text-gray-700 mb-2">💡 Example:</p>
                    <p className="text-xs text-gray-600 italic">
                      "I need 50 ergonomic office chairs with lumbar support, total budget of $5,000, delivery within 2 weeks to NYC"
                    </p>
                  </div>

                  {/* Recent Drafts */}
                  {drafts.length > 0 && (
                    <div className="mt-8">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-md font-semibold text-gray-900">Recent Drafts</h4>
                        <button
                          onClick={handleClearAllDrafts}
                          className="text-xs text-red-600 hover:text-red-800 px-2 py-1 border border-red-200 hover:border-red-300 rounded transition"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="space-y-3">
                        {drafts.slice(0, 3).map((draft) => (
                          <div key={draft.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium text-gray-900 truncate flex-1">{draft.title}</h5>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded ml-2">Draft</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {draft.rfpData?.budget ? `$${draft.rfpData.budget.toLocaleString()}` : 'No budget set'} • 
                              {draft.chatHistory?.length || 0} messages
                            </p>
                            <p className="text-xs text-gray-500 mb-3">
                              Last edited {new Date(draft.lastSavedAt).toLocaleDateString()}
                            </p>
                            <button
                              onClick={() => handleLoadDraft(draft.id)}
                              className="w-full text-sm bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                            >
                              Continue Editing
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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

          {/* Refine Suggestions & Chat Input */}
          <div className="shrink-0 px-4 md:px-6 py-3 border-t bg-gray-50">
            {parsedBidSense && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-blue-900 mb-2">💡 Refine Your RFP</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setInputValue('Add specifications: ')}
                    className="px-3 py-1.5 text-xs sm:text-sm border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition"
                  >
                    + Add Specifications
                  </button>
                  <button
                    onClick={() => setInputValue('Add delivery address: ')}
                    className="px-3 py-1.5 text-xs sm:text-sm border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition"
                  >
                    + Add Delivery Address
                  </button>
                  <button
                    onClick={() => setInputValue('Add warranty: ')}
                    className="px-3 py-1.5 text-xs sm:text-sm border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition"
                  >
                    + Add Warranty
                  </button>
                </div>
              </div>
            )}

            <ChatInput
              onSend={handleSendMessage}
              loading={loading}
              placeholder={parsedBidSense
                ? "Refine your RFP or type details to add..."
                : "Describe what you need to procure (e.g., '50 office chairs under $5K, delivery in 2 weeks')"}
              value={inputValue}
              onChange={setInputValue}
            />
          </div>
        </div>

        {/* Desktop Preview - Right Side */}
        <div className="hidden lg:block lg:flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
          </div>

          {parsedBidSense ? (
            <BidSensePreviewExpanded
              rfp={parsedBidSense}
              onEdit={handleEditRfp}
              editLoading={savingBidSense}
              onFieldChange={handleFieldChange}
            />
          ) : (
            <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center text-gray-500">
              <div className="text-4xl mb-3">👁️</div>
              <p className="font-medium mb-1">Your RFP will appear here</p>
              <p className="text-sm">As you describe your requirements, we'll extract and display the details</p>
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

      {/* Floating Preview Button - Mobile Only */}
      {parsedBidSense && isMobile && !showMobilePreview && (
        <button
          onClick={() => setShowMobilePreview(true)}
          className="lg:hidden fixed bottom-20 right-4 btn-primary rounded-full px-4 py-3 shadow-lg hover:bg-opacity-90 transition z-40 flex items-center gap-2"
        >
          <span className="text-sm font-medium">View Preview</span>
          <span className="bg-white text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            1
          </span>
        </button>
      )}

      {/* Sticky Action Bar - Mobile Only */}
      {parsedBidSense && isMobile && (
        <StickyActionBar
          onSave={handleSaveRfp}
          onCancel={handleStartNew}
          saveLoading={savingBidSense}
          showActions={true}
        />
      )}
    </div>
  );
}
