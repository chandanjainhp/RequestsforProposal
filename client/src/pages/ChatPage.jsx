import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, Save, Trash2 } from 'lucide-react';
import ChatInput from '../components/ChatInput';
import ChatBubble from '../components/ChatBubble';
import RfpStepper from '../components/RfpStepper';
import RfpPreviewExpanded from '../components/RfpPreviewExpanded';
import Breadcrumb from '../components/Breadcrumb';
import StickyActionBar from '../components/StickyActionBar';
import { parseRfp, saveRfp } from '../api/rfp';
import { useRfpStore } from '../store/rfpStore';
import { useNotificationStore } from '../store/notificationStore';
import SaveStatusIndicator from '../components/SaveStatusIndicator';
import { PrimaryButton, SecondaryButton } from '../components/Button';

export default function ChatPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [savingRfp, setSavingRfp] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const {
    chatMessages,
    parsedRfp,
    addMessage,
    clearMessages,
    setParsedRfp,
    setChatLoading,
    saveStatus,
    lastSavedAt,
    isDirty,
    drafts,
    loadDraft,
    startNewDraft,
    clearAllDrafts,
  } = useRfpStore();

  // Debug: Log when parsedRfp changes
  useEffect(() => {
    if (parsedRfp) {
      console.log('📊 Parsed RFP updated:', {
        title: parsedRfp.title,
        budget: parsedRfp.budget,
        delivery_days: parsedRfp.delivery_days,
        items: parsedRfp.line_items?.length || 0,
        confidence: parsedRfp.confidence
      });
    }
  }, [parsedRfp]);

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

  // Ensure preview persists when navigating back from Editor
  // Also refresh data when component mounts or RFP data changes
  useEffect(() => {
    // parsedRfp is already restored from localStorage by the store
    // Ensure it stays in sync
  }, []);

  const handleSendMessage = async (message) => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    setChatLoading(true);

    // Add user message
    addMessage({
      text: message,
      isUser: true,
      timestamp: new Date(),
    });

    try {
      // Call parse endpoint
      const result = await parseRfp(message);

      // Add AI response
      addMessage({
        text: `✅ RFP parsed successfully! (Confidence: ${(result.parse_confidence * 100).toFixed(0)}%)`,
        isUser: false,
        timestamp: new Date(),
      });

      // Store parsed RFP - handle both old and new response formats
      let rfpToStore;
      console.log('📦 API Result:', result);
      console.log('🎯 Parse Confidence from API:', result.parse_confidence, 'Type:', typeof result.parse_confidence);
      
      if (result.parsed_rfp) {
        rfpToStore = {
          ...result.parsed_rfp,
          confidence: result.parse_confidence !== undefined ? result.parse_confidence : 0.3,
          title: result.parsed_rfp.title || 'Untitled RFP',
          description: result.parsed_rfp.description || result.parsed_rfp.summary || '',
        };
      } else if (result.parsed_data) {
        rfpToStore = {
          ...result.parsed_data,
          confidence: result.parse_confidence !== undefined ? result.parse_confidence : 0.3,
          title: result.parsed_data.title || 'Untitled RFP',
          description: result.parsed_data.description || result.parsed_data.summary || '',
        };
      }

      console.log('💾 RFP to Store:', rfpToStore);
      console.log('✅ Confidence value:', rfpToStore?.confidence, '=', (rfpToStore?.confidence * 100).toFixed(0) + '%');

      // Fallback parsing for budget and delivery if AI missed them
      if (!rfpToStore.budget && message.toLowerCase().includes('budget')) {
        const budgetMatch = message.match(/\$([0-9,]+(?:\.[0-9]+)?)/);
        if (budgetMatch) {
          rfpToStore.budget = parseInt(budgetMatch[1].replace(/,/g, ''));
          rfpToStore.currency = rfpToStore.currency || 'USD';
        }
      }

      if (!rfpToStore.delivery_days && message.toLowerCase().includes('week')) {
        const weekMatch = message.match(/(\d+)\s*week/);
        if (weekMatch) {
          rfpToStore.delivery_days = parseInt(weekMatch[1]) * 7;
        }
      }

      setParsedRfp(rfpToStore);
      
      // Log warnings if any
      if (result.warnings && result.warnings.length > 0) {
        addMessage({
          text: `⚠️ Note: ${result.warnings.join(', ')}`,
          isUser: false,
          timestamp: new Date(),
        });
      }
    } catch (err) {
      console.error('Parse error:', err);
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to parse RFP. Please try again.');
      addMessage({
        text: 'Sorry, I encountered an error while parsing. Please try again.',
        isUser: false,
        timestamp: new Date(),
      });
    } finally {
      setLoading(false);
      setChatLoading(false);
      setInputValue(''); // Clear input after sending
    }
  };

  const handleSaveRfp = async () => {
    if (!parsedRfp) {
      setError('No parsed RFP to save');
      return;
    }

    setSavingRfp(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await saveRfp(parsedRfp);
      console.log('Save RFP result:', result);
      
      const rfpId = result._id || result.rfp_id;
      if (!rfpId) {
        setError('Failed to get RFP ID from server');
        return;
      }
      
      setSuccess('RFP saved successfully! Redirecting to editor...');
      
      setTimeout(() => {
        navigate(`/editor/${rfpId}`);
      }, 1500);
    } catch (err) {
      console.error('Save RFP error:', err);
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to save RFP');
    } finally {
      setSavingRfp(false);
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
    setParsedRfp(null);
    setError(null);
    setSuccess(null);
  };

  const handleFieldChange = (field, value) => {
    if (!parsedRfp) return;
    
    const updatedRfp = { ...parsedRfp };
    
    // Handle special cases for numeric fields
    if (field === 'budget' && value) {
      updatedRfp.budget = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    } else if (field === 'delivery_days' && value) {
      updatedRfp.delivery_days = parseInt(value) || 0;
    } else if (field === 'warranty_months' && value) {
      updatedRfp.warranty_months = parseInt(value) || 0;
    } else {
      updatedRfp[field] = value;
    }
    
    setParsedRfp(updatedRfp);
    setSuccess('Field updated successfully');
    setTimeout(() => setSuccess(null), 2000);
  };

  // Handle Edit button - Save RFP first, then navigate to editor
  const handleEditRfp = async () => {
    if (!parsedRfp) {
      setError('No parsed RFP to edit');
      return;
    }

    setSavingRfp(true);
    setError(null);
    setSuccess(null);

    try {
      // Ensure all current data is included
      const rfpToSave = {
        ...parsedRfp,
        // Make sure title and description are set
        title: parsedRfp.title || 'Untitled RFP',
        description: parsedRfp.description || parsedRfp.summary || '',
        // Preserve all parsed fields
        budget: parsedRfp.budget,
        currency: parsedRfp.currency,
        delivery_days: parsedRfp.delivery_days,
        warranty_months: parsedRfp.warranty_months,
        payment_terms: parsedRfp.payment_terms,
        line_items: parsedRfp.line_items || [],
        confidence: parsedRfp.confidence || 0,
      };

      console.log('Saving RFP data:', rfpToSave);

      const result = await saveRfp(rfpToSave);
      console.log('Edit RFP - Save result:', result);
      
      const rfpId = result._id || result.rfp_id;
      if (!rfpId) {
        setError('Failed to get RFP ID from server');
        setSavingRfp(false);
        return;
      }
      
      setSuccess('RFP saved! Opening editor...');
      
      // Navigate immediately to editor with the saved RFP ID
      navigate(`/editor/${rfpId}`);
    } catch (err) {
      console.error('Edit RFP error:', err);
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to save RFP');
      setSavingRfp(false);
    }
  };

  return (
    <div className="w-full overflow-x-hidden overflow-y-auto">
      {/* Page Header */}
      <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Breadcrumb Navigation */}
          <div className="flex-1">
            <Breadcrumb items={[
              { label: 'Create RFP', href: null }
            ]} />
          </div>

          {/* Right: Save Status + Action Buttons */}
          <div className="flex flex-col items-end gap-3">
            {/* Save Status Indicator */}
            <SaveStatusIndicator
              status={saveStatus}
              lastSavedAt={lastSavedAt}
              isDirty={isDirty}
            />

            {/* Action Buttons - Top Right */}
            {parsedRfp && (
              <div className="flex gap-2">
                <PrimaryButton
                  onClick={handleSaveRfp}
                  loading={savingRfp}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm whitespace-nowrap"
                >
                  <Save size={16} className="inline mr-1" />
                  Save as Draft
                </PrimaryButton>
                <SecondaryButton
                  onClick={handleStartNew}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap"
                >
                  Start New
                </SecondaryButton>
                <SecondaryButton
                  onClick={handleStartNew}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 text-sm whitespace-nowrap"
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
      <RfpStepper currentStep={1} />

      {/* Main Layout - Flexbox for Chat + Preview */}
      <div className="flex h-[calc(100vh-10rem)] overflow-hidden">
        {/* LEFT: Chat Section */}
        <div className="w-full md:w-[45%] lg:w-[640px] max-w-full flex flex-col border-r border-gray-200">
          {/* Alert Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-500 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-500 text-green-700 rounded-lg flex items-center gap-2">
              <CheckCircle size={20} />
              {success}
            </div>
          )}

          {/* Chat Messages - Scrollable Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-4 space-y-4">
            {chatMessages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center">
                <div className="max-w-2xl">
                  <div className="text-4xl mb-3">📝</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Your First RFP</h3>
                  <p className="text-sm text-gray-600 mb-4">Start by describing what you need to procure. Be specific!</p>
                  <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left inline-block">
                    <p className="text-xs font-semibold text-gray-700 mb-2">💡 Example:</p>
                    <p className="text-xs text-gray-600 italic">
                      "I need 50 ergonomic office chairs with lumbar support, total budget of $5,000, delivery within 2 weeks to NYC"
                    </p>
                  </div>

                  {/* Recent Drafts Section */}
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
                      <div className="space-y-3 max-w-md mx-auto">
                        {drafts.slice(0, 3).map((draft) => (
                          <div key={draft.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium text-gray-900 truncate">{draft.title}</h5>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Draft</span>
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

          {/* Refine Suggestions - Fixed Bottom Section */}
          <div className="shrink-0 px-6 py-3 border-t bg-gray-50">
            {parsedRfp && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-blue-900 mb-2">💡 Refine Your RFP</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setInputValue('Add specifications: ')}
                    className="px-3 py-1.5 text-sm border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition"
                  >
                    + Add Specifications
                  </button>
                  <button
                    onClick={() => setInputValue('Add delivery address: ')}
                    className="px-3 py-1.5 text-sm border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition"
                  >
                    + Add Delivery Address
                  </button>
                  <button
                    onClick={() => setInputValue('Add warranty: ')}
                    className="px-3 py-1.5 text-sm border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition"
                  >
                    + Add Warranty
                  </button>
                </div>
              </div>
            )}

            {/* Chat Input */}
            <ChatInput
              onSend={handleSendMessage}
              loading={loading}
              placeholder={parsedRfp
                ? "Refine your RFP or type details to add..."
                : "Describe what you need to procure (e.g., '50 office chairs under $5K, delivery in 2 weeks')"}
              value={inputValue}
              onChange={setInputValue}
            />
          </div>

          {/* Action Buttons - Desktop Only */}
          {parsedRfp && (
            <div className="hidden lg:flex gap-3 px-6 py-4 border-t bg-white">
            </div>
          )}
        </div>
        <div className="hidden md:block md:w-[55%] lg:w-[calc(100%-640px)] overflow-y-auto overflow-x-hidden px-6 py-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Preview</h3>

          {parsedRfp ? (
            <RfpPreviewExpanded
              rfp={parsedRfp}
              onEdit={handleEditRfp}
              editLoading={savingRfp}
              onFieldChange={handleFieldChange}
            />
          ) : (
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center text-gray-500">
              <div>
                <p className="font-medium mb-1">Your RFP will appear here</p>
                <p className="text-sm">As you describe your requirements, we'll extract and display the details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Preview - Bottom Drawer */}
      {parsedRfp && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 max-h-96 bg-white border-t border-gray-200 overflow-y-auto rounded-t-lg">
          <div className="p-4 sticky top-0 bg-white border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
            <button className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          <div className="p-4">
            <RfpPreviewExpanded
              rfp={parsedRfp}
              onEdit={handleEditRfp}
              editLoading={savingRfp}
              onFieldChange={handleFieldChange}
            />
          </div>
        </div>
      )}

      {/* Sticky Action Bar - Mobile Only */}
      <StickyActionBar
        onSave={handleSaveRfp}
        onCancel={handleStartNew}
        saveLoading={savingRfp}
        showActions={parsedRfp !== null && window.innerWidth < 1024}
      />
    </div>
  );
}
