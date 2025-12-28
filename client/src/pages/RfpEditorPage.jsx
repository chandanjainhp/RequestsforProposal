import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useBidSenseStore } from '../store/bidsenseStore';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import Breadcrumb from '../components/Breadcrumb';
import SaveStatusIndicator from '../components/SaveStatusIndicator';
import { ChevronDown, ChevronRight, AlertCircle, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import api from '../api/axiosConfig';

// API functions
const getRfp = async (id) => {
  const response = await api.get(`/api/bidsense/${id}`);
  return response.data;
};

const updateRfp = async (id, data) => {
  const response = await api.put(`/api/bidsense/${id}`, data);
  return response.data;
};

// Helper component for collapsible sections
const CollapsibleSection = ({ title, status, expanded, onToggle, children, fullWidth = true }) => {
  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${fullWidth ? 'w-full' : ''}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-warm-off-white hover:bg-soft-gray transition-colors"
      >
        <div className="flex items-center gap-3">
          {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          <span className="font-semibold text-charcoal">{title}</span>
          {status && <span className="text-sm text-gray-500 ml-2">{status}</span>}
        </div>
      </button>
      {expanded && (
        <div className="p-6 bg-warm-off-white space-y-6">
          {children}
        </div>
      )}
    </div>
  );
};

// Form field component with auto-save
const FormField = ({ label, value, onChange, placeholder, required, type = 'text', helpText, rows }) => {
  const [savedStatus, setSavedStatus] = useState('saved');
  const saveTimeoutRef = useRef(null);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setSavedStatus('unsaved');
    
    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Debounce save
    saveTimeoutRef.current = setTimeout(() => {
      onChange(newValue);
      setSavedStatus('saved');
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const stringValue = String(value || '');
  const isValid = !required || stringValue.trim() !== '';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-charcoal">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {!isValid && <AlertTriangle size={18} className="text-orange-500" />}
        {isValid && savedStatus === 'saved' && <CheckCircle size={18} className="text-green-500" />}
        {savedStatus === 'unsaved' && <Clock size={18} className="text-gray-400 animate-spin" />}
      </div>
      {type === 'textarea' ? (
        <textarea
          value={value || ''}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows || 4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
      {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
    </div>
  );
};

// Confidence Alert Component
const ConfidenceAlert = ({ confidence, message }) => {
  let alertConfig = {
    bgColor: 'bg-warm-off-white',
    borderColor: 'border-gray-300',
    textColor: 'text-gray-700',
    icon: null,
    barColor: 'bg-gray-400'
  };

  if (confidence < 50) {
    alertConfig = {
      bgColor: 'bg-red-50',
      borderColor: 'border-l-4 border-red-500',
      textColor: 'text-red-700',
      icon: <AlertCircle className="text-red-500" size={24} />,
      barColor: 'bg-red-500'
    };
  } else if (confidence < 70) {
    alertConfig = {
      bgColor: 'bg-orange-50',
      borderColor: 'border-l-4 border-orange-500',
      textColor: 'text-orange-700',
      icon: <AlertTriangle className="text-orange-500" size={24} />,
      barColor: 'bg-orange-400'
    };
  } else if (confidence < 90) {
    alertConfig = {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-l-4 border-yellow-500',
      textColor: 'text-yellow-700',
      icon: <CheckCircle className="text-yellow-500" size={24} />,
      barColor: 'bg-yellow-400'
    };
  } else {
    alertConfig = {
      bgColor: 'bg-green-50',
      borderColor: 'border-l-4 border-green-500',
      textColor: 'text-green-700',
      icon: <CheckCircle className="text-green-500" size={24} />,
      barColor: 'bg-green-500'
    };
  }

  return (
    <div className={`${alertConfig.bgColor} ${alertConfig.borderColor} rounded-lg p-6 mb-8 space-y-4`}>
      <div className="flex items-start gap-4">
        {alertConfig.icon}
        <div className="flex-1">
          <p className={`font-semibold ${alertConfig.textColor} mb-2`}>Parse Confidence: {confidence}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div
              className={`${alertConfig.barColor} h-2 rounded-full`}
              style={{ width: `${Math.min(confidence, 100)}%` }}
            />
          </div>
          {message && <p className={`text-sm ${alertConfig.textColor}`}>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default function RfpEditorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    budget: true,
    items: true,
    timeline: true,
    requirements: false
  });
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    summary: '',
    line_items: [],
    vendor_count: 0,
    budget: null,
    currency: 'USD',
    payment_terms: '',
    delivery_days: null,
    warranty_months: null,
    confidence: 0,
    confidence_message: ''
  });

  const [newLineItem, setNewLineItem] = useState('');
  const [bidsenseId] = useState(null);
  const [rfpId, setRfpId] = useState(null);
  const { parsedBidSense, currentBidSense, setParsedBidSense } = useBidSenseStore();
  const autoSaveTimeoutRef = useRef(null);

  // Auto-save function with debounce
  const autoSaveRfp = useRef((data) => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(async () => {
      if (!rfpId) return;

      try {
        await updateRfp(rfpId, data);
        setSuccess('Changes saved automatically');
        setTimeout(() => setSuccess(null), 2000);
      } catch (err) {
        console.error('Auto-save failed:', err);
        setError('Failed to save changes');
        setTimeout(() => setError(null), 3000);
      }
    }, 1500); // Save after 1.5 seconds of inactivity
  }).current;

  // Load data from parsed RFP, current RFP, or from API
  useEffect(() => {
    const id = params.rfpId;
    const parsedData = location.state?.parsedData;
    
    if (!id || id === 'undefined') {
      const data = parsedData || parsedBidSense || currentBidSense;
      if (data) {
        setFormData({
          title: data.title || '',
          description: data.description || '',
          summary: data.summary || data.description || data.parsed_rfp?.summary || '',
          line_items: data.line_items || data.parsed_rfp?.line_items || [],
          vendor_count: data.vendor_count || 0,
          budget: data.budget || data.parsed_rfp?.budget || null,
          currency: data.currency || data.parsed_rfp?.currency || 'USD',
          payment_terms: data.payment_terms || data.parsed_rfp?.payment_terms || '',
          delivery_days: data.delivery_days || data.parsed_rfp?.delivery_days || null,
          warranty_months: data.warranty_months || data.parsed_rfp?.warranty_months || null,
          confidence: data.confidence || 0,
          confidence_message: data.confidence_message || ''
        });
        setRfpId(data._id || null);
      } else {
        setError('No RFP data found. Redirecting to chat...');
        setTimeout(() => navigate('/chat'), 2000);
      }
      return;
    }
    
    setRfpId(id);
    const loadRfp = async () => {
      setLoading(true);
      try {
        const data = await getRfp(id);
        setFormData({
          title: data.title || data.parsed_rfp?.title || '',
          description: data.description || data.parsed_rfp?.description || '',
          summary: data.summary || data.parsed_rfp?.summary || '',
          line_items: data.line_items || data.parsed_rfp?.line_items || [],
          vendor_count: data.vendor_count || 0,
          budget: data.budget || data.parsed_rfp?.budget || null,
          currency: data.currency || data.parsed_rfp?.currency || 'USD',
          payment_terms: data.payment_terms || data.parsed_rfp?.payment_terms || '',
          delivery_days: data.delivery_days || data.parsed_rfp?.delivery_days || null,
          warranty_months: data.warranty_months || data.parsed_rfp?.warranty_months || null,
          confidence: data.confidence || 0,
          confidence_message: data.confidence_message || ''
        });
      } catch (err) {
        console.error('Failed to load RFP:', err);
        setError('Failed to load RFP. It may not exist or has been deleted.');
      } finally {
        setLoading(false);
      }
    };
    loadRfp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.rfpId, navigate]);

  const handleInputChange = (field, value) => {
    const updatedData = {
      ...formData,
      [field]: value,
    };
    setFormData(updatedData);
    setParsedBidSense({ ...updatedData, _id: bidsenseId });
    
    // Auto-save after user stops typing
    autoSaveRfp(updatedData);
  };

  const handleAddLineItem = () => {
    if (newLineItem.trim()) {
      const updatedItems = [...formData.line_items, newLineItem];
      const updatedData = {
        ...formData,
        line_items: updatedItems,
      };
      setFormData(updatedData);
      setNewLineItem('');
      setParsedBidSense({ ...updatedData, _id: bidsenseId });
      autoSaveRfp(updatedData);
    }
  };

  const handleRemoveLineItem = (index) => {
    const updatedItems = formData.line_items.filter((_, i) => i !== index);
    const updatedData = {
      ...formData,
      line_items: updatedItems,
    };
    setFormData(updatedData);
    setParsedBidSense({ ...updatedData, _id: bidsenseId });
    autoSaveRfp(updatedData);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      setError('Please enter an RFP title');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!rfpId) {
        setError('RFP ID not found. Please save the RFP first from the chat page.');
        return;
      }

      await updateRfp(rfpId, formData);
      setSuccess('RFP updated successfully!');

      setTimeout(() => {
        navigate(`/send/${rfpId}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save RFP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-warm-off-white overflow-x-hidden">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Create RFP', href: '/chat' },
        { label: formData.title || 'Edit RFP', href: null }
      ]} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
          
          {/* Header Section */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-charcoal">{formData.title || 'Untitled RFP'}</h1>
                <p className="text-sm text-gray-500 mt-2">Created just now</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                  Draft
                </span>
                <SaveStatusIndicator />
              </div>
            </div>
          </div>

          {/* Confidence Alert */}
          {formData.confidence !== undefined && formData.confidence > 0 && (
            <ConfidenceAlert 
              confidence={formData.confidence} 
              message={formData.confidence_message}
            />
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-100 border border-red-500 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-4 bg-green-100 border border-green-500 text-green-700 rounded-lg flex items-center gap-2">
              <CheckCircle size={20} />
              {success}
            </div>
          )}

          {/* SECTION 1: Basic Information */}
          <CollapsibleSection
            title="✓ Basic Information"
            status="(Complete)"
            expanded={expandedSections.basic}
            onToggle={() => toggleSection('basic')}
          >
            <div className="space-y-6">
              <FormField
                label="RFP Title"
                value={formData.title}
                onChange={(value) => handleInputChange('title', value)}
                placeholder="Enter RFP title"
                required
              />
              
              <FormField
                label="Summary"
                value={formData.summary}
                onChange={(value) => handleInputChange('summary', value)}
                placeholder="Enter RFP summary"
                rows={4}
                type="textarea"
                helpText="This summary will be shown to vendors"
              />
              
              <FormField
                label="Expected Vendor Count"
                value={formData.vendor_count}
                onChange={(value) => handleInputChange('vendor_count', parseInt(value) || 0)}
                type="number"
                helpText="Recommended: 3-5 vendors"
              />
            </div>
          </CollapsibleSection>

          {/* SECTION 2: Budget & Payment */}
          <CollapsibleSection
            title="⚠️ Budget & Payment"
            status="(2 of 3 complete)"
            expanded={expandedSections.budget}
            onToggle={() => toggleSection('budget')}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Total Budget"
                  value={formData.budget || ''}
                  onChange={(value) => handleInputChange('budget', value ? parseInt(value) : null)}
                  placeholder="Enter amount"
                  type="number"
                  required
                  helpText="Parsed from your chat: '$5,000 total'"
                />
                
                <FormField
                  label="Currency"
                  value={formData.currency}
                  onChange={(value) => handleInputChange('currency', value)}
                  placeholder="USD"
                  helpText="Currency type"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-charcoal block mb-3">Payment Terms *</label>
                <input
                  type="text"
                  value={formData.payment_terms}
                  onChange={(e) => handleInputChange('payment_terms', e.target.value)}
                  placeholder="Select or type payment terms"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                />
                <div className="flex flex-wrap gap-2">
                  {['Net 30', 'Net 60', 'Due on Receipt', 'COD'].map((term) => (
                    <button
                      key={term}
                      onClick={() => handleInputChange('payment_terms', term)}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* SECTION 3: Line Items */}
          <CollapsibleSection
            title="✓ Line Items"
            status={`(${formData.line_items.length} item${formData.line_items.length !== 1 ? 's' : ''})`}
            expanded={expandedSections.items}
            onToggle={() => toggleSection('items')}
          >
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLineItem}
                  onChange={(e) => setNewLineItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddLineItem()}
                  placeholder="Add a line item (e.g., 50x office chairs)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <PrimaryButton onClick={handleAddLineItem}>Add</PrimaryButton>
              </div>

              <div className="space-y-3">
                {formData.line_items.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white rounded border border-soft-gray hover:border-muted-blue transition-colors flex items-start gap-3"
                  >
                    <div className="shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-700">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-charcoal text-base word-wrap">
                        {typeof item === 'object' ? `${item.quantity || ''}x ${item.name || 'Item'}` : item}
                      </p>
                      {typeof item === 'object' && item.specs && (
                        <p className="text-sm text-muted-blue mt-1">
                          {typeof item.specs === 'string' ? item.specs : Object.entries(item.specs).map(([key, val]) => `${key}: ${val}`).join(', ')}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveLineItem(index)}
                      className="shrink-0 text-red-600 hover:text-red-800 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {formData.line_items.length === 0 && (
                <p className="text-sm text-gray-500 italic px-3 py-2">No line items added yet</p>
              )}
            </div>
          </CollapsibleSection>

          {/* SECTION 4: Timeline & Delivery */}
          <CollapsibleSection
            title="⚠️ Timeline & Delivery"
            status="(1 of 3 required)"
            expanded={expandedSections.timeline}
            onToggle={() => toggleSection('timeline')}
          >
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-charcoal block mb-3">Delivery Timeline *</label>
                <input
                  type="text"
                  value={formData.delivery_days ? `Within ${Math.ceil(formData.delivery_days / 7)} weeks` : ''}
                  onChange={(e) => {
                    const match = e.target.value.match(/(\d+)/);
                    const weeks = match ? parseInt(match[1]) : null;
                    handleInputChange('delivery_days', weeks ? weeks * 7 : null);
                  }}
                  placeholder="Enter delivery timeline"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                />
                <p className="text-xs text-gray-500 mt-1">Parsed from your chat</p>
                <div className="flex flex-wrap gap-2">
                  {['ASAP', '1 week', '2 weeks', '1 month'].map((timeline) => (
                    <button
                      key={timeline}
                      onClick={() => {
                        const days = timeline === 'ASAP' ? 1 : timeline === '1 week' ? 7 : timeline === '2 weeks' ? 14 : 30;
                        handleInputChange('delivery_days', days);
                      }}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors"
                    >
                      {timeline}
                    </button>
                  ))}
                </div>
              </div>

              <FormField
                label="Warranty Period"
                value={formData.warranty_months || ''}
                onChange={(value) => handleInputChange('warranty_months', value ? parseInt(value) : null)}
                placeholder="Select warranty period (optional)"
                type="number"
              />
            </div>
          </CollapsibleSection>

          {/* SECTION 5: Additional Requirements (Optional) */}
          <CollapsibleSection
            title="ℹ️ Additional Requirements"
            status="(Optional)"
            expanded={expandedSections.requirements}
            onToggle={() => toggleSection('requirements')}
          >
            <div className="space-y-6">
              <FormField
                label="Technical Specifications"
                value={formData.technical_specs || ''}
                onChange={(value) => handleInputChange('technical_specs', value)}
                placeholder="Describe technical requirements..."
                rows={3}
                type="textarea"
                helpText="Example: Ergonomic design, adjustable height 17-21 inches, weight capacity 250+ lbs, lumbar support"
              />

              <FormField
                label="Quality Certifications"
                value={formData.certifications || ''}
                onChange={(value) => handleInputChange('certifications', value)}
                placeholder="Add required certifications..."
                rows={2}
                type="textarea"
                helpText="Example: BIFMA, GREENGUARD, ISO 9001"
              />

              <FormField
                label="Special Requirements"
                value={formData.special_requirements || ''}
                onChange={(value) => handleInputChange('special_requirements', value)}
                placeholder="Any other requirements..."
                rows={3}
                type="textarea"
                helpText="Example: Eco-friendly materials, assembly included, color preferences"
              />
            </div>
          </CollapsibleSection>

        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-soft-gray shadow-lg sm:pl-55 lg:pl-64">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/chat')}
            className="text-muted-blue hover:text-charcoal hover:underline transition-colors flex items-center gap-1"
          >
            ← Back to Chat
          </button>

          <div className="flex gap-3">
            <SecondaryButton onClick={handleSave} disabled={loading}>
              💾 Save as Draft
            </SecondaryButton>
            
            <PrimaryButton
              onClick={handleSave}
              loading={loading}
              className="flex items-center gap-2"
            >
              Continue to Vendors →
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
