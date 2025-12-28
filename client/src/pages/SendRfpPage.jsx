import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBidSenses, sendRfp } from '../api/bidsense';
import { getVendors } from '../api/vendors';
import BidSenseStepper from '../components/BidSenseStepper';
import Breadcrumb from '../components/Breadcrumb';
import { useNotificationStore } from '../store/notificationStore';
import { AlertCircle, CheckCircle, ChevronLeft, Send, Search, Filter, Calendar, Mail } from 'lucide-react';

const useSyncStore = () => ({
  updateRfp: (id, updates) => console.log('Update RFP:', id, updates),
  broadcastChange: (type, data) => console.log('Broadcast:', type, data),
  isOnline: navigator.onLine
});

export default function SendRfpPage() {
  const navigate = useNavigate();
  const params = useParams();

  // Notification system
  const { addSuccess, addError, addLoading } = useNotificationStore();
  const { updateRfp, broadcastChange, isOnline } = useSyncStore();

  // State Management
  const [loading, setLoading] = useState(true);
  const [sendingRfp, setSendingRfp] = useState(false);
  const [error, setError] = useState(null);

  // RFP Selection State
  const [rfpList, setRfpList] = useState([]);
  const [selectedRfp, setSelectedRfp] = useState(null);
  const [rfpSearchTerm, setRfpSearchTerm] = useState('');
  const [rfpFilter, setRfpFilter] = useState('all');

  // Vendor Selection State - LOCAL (not from store)
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]); // LOCAL state
  const [vendorSearchTerm, setVendorSearchTerm] = useState('');
  const [vendorCategoryFilter, setVendorCategoryFilter] = useState('all');
  const [vendorRatingFilter, setVendorRatingFilter] = useState('all');

  // Email Settings State
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [responseDeadline, setResponseDeadline] = useState('');
  const [sendCopy, setSendCopy] = useState(false);
  const [notifyOnResponse, setNotifyOnResponse] = useState(true);

  // Load initial data
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Show loading notification for longer loads
      addLoading('Loading RFPs and vendors...');
      
      // Load RFPs
      const rfpsData = await getBidSenses();
      const rfps = rfpsData.rfps || [];
      console.log('📋 RFPs loaded:', rfps.length);
      setRfpList(rfps);

      // If rfpId in URL, select it
      if (params.rfpId) {
        const selectedRfp = rfps.find(r => r._id === params.rfpId);
        if (selectedRfp) {
          console.log('✅ RFP selected from URL:', selectedRfp.title);
          setSelectedRfp(selectedRfp);
          setEmailSubject(`RFP: ${selectedRfp.title}`);
        }
      }

      // Load Vendors
      const vendorsData = await getVendors();
      const vendorsList = vendorsData.vendors || vendorsData.data || [];
      console.log('👥 Vendors loaded:', vendorsList.length);
      setVendors(vendorsList);
      setFilteredVendors(vendorsList);

      addSuccess(`✓ Loaded ${rfps.length} RFPs and ${vendorsList.length} vendors`);
    } catch (err) {
      console.error('Failed to load data:', err);
      const errorMsg = err.response?.data?.message || 'Failed to load data';
      setError(errorMsg);
      addError(errorMsg, {
        actionButton: 'Retry',
        onAction: loadData
      });
    } finally {
      setLoading(false);
    }
  }, [params.rfpId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter RFPs
  const filteredRfps = rfpList.filter(rfp => {
    const matchesSearch = rfp.title.toLowerCase().includes(rfpSearchTerm.toLowerCase());
    const matchesStatus = rfpFilter === 'all' || rfp.status === rfpFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter vendors
  useEffect(() => {
    let filtered = vendors;

    // Search filter
    if (vendorSearchTerm) {
      filtered = filtered.filter(v => 
        v.name.toLowerCase().includes(vendorSearchTerm.toLowerCase())
      );
    }

    // Category filter
    if (vendorCategoryFilter !== 'all') {
      filtered = filtered.filter(v => 
        v.categories?.includes(vendorCategoryFilter)
      );
    }

    // Rating filter
    if (vendorRatingFilter !== 'all') {
      if (vendorRatingFilter === 'unrated') {
        filtered = filtered.filter(v => !v.rating || v.rating === 0);
      } else {
        const minRating = parseInt(vendorRatingFilter);
        filtered = filtered.filter(v => v.rating && v.rating >= minRating);
      }
    }

    // Sort: recommended first (matching RFP categories)
    if (selectedRfp?.categories) {
      filtered.sort((a, b) => {
        const aMatches = a.categories?.some(c => selectedRfp.categories.includes(c)) ? 1 : 0;
        const bMatches = b.categories?.some(c => selectedRfp.categories.includes(c)) ? 1 : 0;
        return bMatches - aMatches;
      });
    }

    setFilteredVendors(filtered);
  }, [vendorSearchTerm, vendorCategoryFilter, vendorRatingFilter, vendors, selectedRfp]);

  // Handle RFP selection
  const handleSelectRfp = (rfp) => {
    console.log('🎯 RFP selected:', rfp.title, 'ID:', rfp._id);
    setSelectedRfp(rfp);
    setEmailSubject(`RFP: ${rfp.title}`);
    setError(null);
  };

  // Handle vendor toggle - optimized with useCallback
  const handleToggleVendor = useCallback((vendorId) => {
    setSelectedVendors(prevSelected => {
      const isAlreadySelected = prevSelected.includes(vendorId);
      if (isAlreadySelected) {
        return prevSelected.filter(id => id !== vendorId);
      } else {
        return [...prevSelected, vendorId];
      }
    });
  }, []);

  // Handle send RFP
  const handleSendRfp = async () => {
    // Validation
    if (!selectedRfp) {
      setError('Please select an RFP');
      addError('Please select an RFP to send');
      return;
    }
    if (selectedVendors.length === 0) {
      setError('Please select at least one vendor');
      addError('Please select at least one vendor to receive the RFP');
      return;
    }
    if (!isOnline) {
      addError('Cannot send RFP while offline. Please check your connection.');
      return;
    }

    setSendingRfp(true);
    setError(null);

    // Show loading notification
    addLoading(`Sending RFP to ${selectedVendors.length} vendor${selectedVendors.length !== 1 ? 's' : ''}...`);

    try {
      await sendRfp(selectedRfp._id, {
        vendor_ids: selectedVendors,
        subject: emailSubject,
        message: emailMessage,
        deadline: responseDeadline,
      });

      // Update RFP status in sync store
      updateRfp(selectedRfp._id, { 
        status: 'sent',
        sent_at: new Date().toISOString(),
        vendor_count: selectedVendors.length
      });

      // Broadcast change to other tabs
      broadcastChange('RFP_STATUS_CHANGED', {
        _id: selectedRfp._id,
        status: 'sent',
        vendor_count: selectedVendors.length
      });

      // Show success and redirect
      const vendorNames = vendors
        .filter(v => selectedVendors.includes(v._id || v.id))
        .map(v => v.name)
        .slice(0, 2)
        .join(', ');
      
      const successMsg = selectedVendors.length <= 2 
        ? `✓ RFP sent to ${vendorNames}`
        : `✓ RFP sent to ${vendorNames} and ${selectedVendors.length - 2} others`;

      addSuccess(successMsg, {
        actionButton: 'View Proposals',
        onAction: () => navigate(`/proposals`)
      });

      // Redirect after brief delay
      setTimeout(() => {
        navigate(`/proposals`);
      }, 2000);

    } catch (err) {
      console.error('Error sending RFP:', err);
      const errorMsg = err.response?.data?.message || 'Failed to send RFP';
      setError(errorMsg);
      addError(errorMsg, {
        actionButton: 'Retry',
        onAction: handleSendRfp
      });
    } finally {
      setSendingRfp(false);
    }
  };

  // Calculate default deadline (7 days from now)
  const getDefaultDeadline = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <Breadcrumb items={[
          { label: 'Create RFP', href: '/chat' },
          { label: 'Send RFP', href: null }
        ]} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading RFPs and vendors...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <Breadcrumb items={[
        { label: 'Create RFP', href: '/chat' },
        { label: 'Send RFP', href: null }
      ]} />
      <BidSenseStepper currentStep={3} />

      {/* Main Content with Sticky Summary */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* Left Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto lg:overflow-y-auto">
          <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-4 space-y-4 pb-32 lg:pb-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-100 border border-red-500 text-red-700 px-6 py-4 rounded-lg flex items-center gap-3">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {/* SECTION 1: SELECT RFP */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-warm-off-white font-bold text-xs">1</span>
              <h2 className="text-lg lg:text-xl font-bold text-gray-900">Select an RFP</h2>
            </div>
            <div className="border-t border-gray-300 mb-4"></div>

            {/* RFP Search and Filter */}
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search RFPs..."
                  value={rfpSearchTerm}
                  onChange={(e) => setRfpSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={rfpFilter}
                onChange={(e) => setRfpFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
              </select>
            </div>

            {/* RFP Cards - Responsive grid layout for wider screens */}
            {filteredRfps.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredRfps.map((rfp) => (
                  <div
                    key={rfp._id}
                    onClick={() => handleSelectRfp(rfp)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedRfp?._id === rfp._id
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`shrink-0 w-5 h-5 rounded-full border-2 mt-0.5 ${
                        selectedRfp?._id === rfp._id
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-gray-300'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm md:text-base font-semibold text-gray-900 truncate">{rfp.title}</h3>
                        <p className="text-xs md:text-sm text-gray-600 mt-1">
                          💰 ${rfp.budget?.toLocaleString() || 'N/A'} • 
                          📦 {rfp.line_items?.length || 0} items • 
                          📅 {new Date(rfp.created_at).toLocaleDateString()}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded">
                          Ready to Send
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-white rounded border-2 border-dashed border-gray-300">
                <p className="text-gray-500 font-medium mb-1">📧 No RFPs Ready to Send</p>
                <p className="text-gray-400 text-sm mb-3">Create and complete an RFP in the Editor before sending.</p>
                <button
                  onClick={() => navigate('/chat')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  ← Go to Editor
                </button>
              </div>
            )}
          </div>

          {/* SECTION 2: SELECT VENDORS (Only show if RFP selected) */}
          {selectedRfp && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-warm-off-white font-bold text-xs">2</span>
                <h2 className="text-lg lg:text-xl font-bold text-gray-900">Select Vendors</h2>
              </div>
              <div className="border-t border-gray-300 mb-3"></div>
              <p className="text-xs text-gray-600 mb-3">Select at least 1 vendor</p>

              {/* Vendor Search and Filters - Compact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
                <div className="sm:col-span-1 relative">
                  <Search className="absolute left-2 top-2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={vendorSearchTerm}
                    onChange={(e) => setVendorSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={vendorCategoryFilter}
                  onChange={(e) => setVendorCategoryFilter(e.target.value)}
                  className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="hardware">Hardware</option>
                  <option value="software">Software</option>
                  <option value="services">Services</option>
                </select>
                <select
                  value={vendorRatingFilter}
                  onChange={(e) => setVendorRatingFilter(e.target.value)}
                  className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Ratings</option>
                  <option value="4">4+ Stars</option>
                  <option value="5">5 Stars</option>
                  <option value="unrated">Unrated</option>
                </select>
              </div>

              {/* Vendor Cards Grid - Optimized for wider screens */}
              {filteredVendors.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 mb-4 max-h-[400px] overflow-y-auto">
                    {filteredVendors.map((vendor) => {
                      const vendorId = vendor._id || vendor.id;
                      const isSelected = selectedVendors.includes(vendorId);
                      
                      return (
                      <div
                        key={vendorId}
                        className={`p-3 rounded-lg border-2 transition-all text-sm cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border-blue-500'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={(e) => {
                          // Don't trigger if clicking on the checkbox itself
                          if (e.target.type !== 'checkbox') {
                            handleToggleVendor(vendorId);
                          }
                        }}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleVendor(vendorId)}
                            className="w-4 h-4 mt-0.5 cursor-pointer"
                          />
                          <h3 className="text-xs font-semibold text-gray-900 flex-1 leading-tight">{vendor.name}</h3>
                        </div>
                        <div className="flex items-center gap-1 mb-1">
                          {(vendor.rating && vendor.rating > 0) ? (
                            <>
                              <span className="text-xs text-yellow-600">
                                {'★'.repeat(vendor.rating)}
                              </span>
                              {vendor.reviewCount > 0 && (
                                <span className="text-xs text-gray-500">({vendor.reviewCount})</span>
                              )}
                            </>
                          ) : (
                            <span className="text-xs text-gray-500">Not rated</span>
                          )}
                        </div>
                        {vendor.categories && (
                          <div className="flex flex-wrap gap-0.5">
                            {vendor.categories.slice(0, 1).map((cat, idx) => (
                              <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                                {cat}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      );
                    })}
                  </div>

                  {/* Vendor Actions - Compact */}
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => {
                        filteredVendors.forEach(v => {
                          if (!selectedVendors.includes(v._id || v.id)) {
                            handleToggleVendor(v._id || v.id);
                          }
                        });
                      }}
                      className="px-3 py-1.5 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
                    >
                      Select All
                    </button>
                    <button
                      onClick={() => {
                        filteredVendors.forEach(v => {
                          if (selectedVendors.includes(v._id || v.id)) {
                            handleToggleVendor(v._id || v.id);
                          }
                        });
                      }}
                      className="px-3 py-1.5 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
                    >
                      Clear All
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 bg-white rounded border-2 border-dashed border-gray-300">
                  <p className="text-gray-500 text-sm font-medium">👥 No Vendors Found</p>
                </div>
              )}
            </div>
          )}

          {/* SECTION 3: EMAIL SETTINGS (Optional) */}
          {selectedRfp && selectedVendors.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-warm-off-white font-bold text-xs">3</span>
                <h2 className="text-lg lg:text-xl font-bold text-gray-900">Email Settings</h2>
              </div>
              <div className="border-t border-gray-300 mb-4"></div>

              <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
                {/* Subject Line */}
                <div>
                  <label className="block text-xs font-medium text-gray-900 mb-1">Subject</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Email Message */}
                <div>
                  <label className="block text-xs font-medium text-gray-900 mb-1">Message (Optional)</label>
                  <textarea
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    rows={2}
                    placeholder="Dear Vendor..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Response Deadline */}
                <div>
                  <label className="block text-xs font-medium text-gray-900 mb-1">Response Deadline</label>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <input
                      type="date"
                      value={responseDeadline || getDefaultDeadline()}
                      onChange={(e) => setResponseDeadline(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="border-t border-gray-200 pt-2 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={sendCopy}
                      onChange={(e) => setSendCopy(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700">Send me a copy</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={notifyOnResponse}
                      onChange={(e) => setNotifyOnResponse(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700">Notify on response</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          </div>
        </div>

        {/* RIGHT SIDEBAR - Sticky Summary & Send Button (Desktop + Mobile Bottom Drawer) */}
        {selectedRfp && selectedVendors.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 lg:static lg:w-80 lg:border-l lg:border-gray-200 lg:bg-white lg:flex lg:flex-col">
            {/* Mobile Bottom Drawer */}
            <div className="lg:hidden bg-white border-t border-gray-200 p-4 space-y-4">
              {/* Summary for Mobile */}
              <div className="space-y-2 text-sm">
                <h3 className="font-bold text-gray-900">Ready to Send</h3>
                <div className="space-y-1">
                  <p className="text-gray-700"><strong>RFP:</strong> {selectedRfp.title}</p>
                  <p className="text-gray-700"><strong>Vendors:</strong> {selectedVendors.length}</p>
                  {responseDeadline && (
                    <p className="text-gray-700"><strong>Deadline:</strong> {new Date(responseDeadline).toLocaleDateString()}</p>
                  )}
                </div>
              </div>

              {/* Vendors List */}
              <div className="bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">
                <p className="text-xs font-semibold text-gray-600 mb-2">SENDING TO:</p>
                <div className="space-y-1">
                  {vendors
                    .filter(v => selectedVendors.includes(v._id || v.id))
                    .map(v => (
                      <p key={v._id || v.id} className="text-xs text-gray-600">• {v.name}</p>
                    ))
                  }
                </div>
              </div>

              {/* Send Button */}
              <button
                onClick={handleSendRfp}
                disabled={sendingRfp}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded transition font-medium text-sm ${
                  !sendingRfp
                    ? 'btn-primary'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send size={18} />
                {sendingRfp ? 'Sending...' : 'Send RFP'}
              </button>
            </div>

            {/* Desktop Sticky Panel */}
            <div className="hidden lg:flex lg:flex-col lg:h-full lg:bg-gray-50 lg:overflow-y-auto lg:sticky lg:top-0">
              <div className="p-4 space-y-4 flex-1">
                {/* Header */}
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Summary</h3>
                  <div className="border-t border-gray-300 mt-2"></div>
                </div>

                {/* RFP Info */}
                <div className="bg-white p-3 rounded border border-gray-200 space-y-2">
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase">RFP</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{selectedRfp.title}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase">Budget</p>
                    <p className="text-sm font-medium text-gray-900">${selectedRfp.budget?.toLocaleString() || 'N/A'}</p>
                  </div>
                  {responseDeadline && (
                    <div>
                      <p className="text-xs text-gray-600 font-semibold uppercase">Response Deadline</p>
                      <p className="text-sm font-medium text-gray-900">{new Date(responseDeadline).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                {/* Vendors Selection Info */}
                <div className="bg-white p-3 rounded border border-gray-200">
                  <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Sending To</p>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {vendors
                      .filter(v => selectedVendors.includes(v._id || v.id))
                      .map(v => (
                        <div key={v._id || v.id} className="flex items-start gap-2 p-2 bg-blue-50 rounded border border-blue-200">
                          <CheckCircle size={14} className="text-blue-600 mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-900 truncate">{v.name}</p>
                            <p className="text-xs text-gray-600">{v.contact_email}</p>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>

              {/* Send Button - Sticky at Bottom */}
              <div className="border-t border-gray-300 p-4">
                <button
                  onClick={handleSendRfp}
                  disabled={sendingRfp}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition font-medium ${
                    !sendingRfp
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Send size={18} />
                  {sendingRfp ? 'Sending...' : `Send (${selectedVendors.length})`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
