import { useState, useEffect } from 'react';
import { getVendors, createVendor, updateVendor, deleteVendor } from '../api/vendors';
import { AlertCircle, CheckCircle, Plus, Edit2, Trash2, Search, Filter, ArrowUpDown, Star, Mail, Phone, User, Briefcase, MapPin } from 'lucide-react';
import { useNotificationStore } from '../store/notificationStore';

export default function VendorPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedVendors, setSelectedVendors] = useState(new Set());
  const [expandedCards, setExpandedCards] = useState(new Set());
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  
  // Notification system
  const { addSuccess, addError } = useNotificationStore();
  
  const [formData, setFormData] = useState({ 
    name: '', 
    contact_email: '',
    contact_person: '',
    phone: '',
    address: '',
    notes: '',
    categories: [],
    rating: 0,
    status: 'active'
  });

  // Load vendors
  const loadVendors = async () => {
    try {
      setLoading(true);
      const data = await getVendors();
      
      console.log('Vendors response:', data);
      
      // Handle different response formats
      let vendorList = [];
      if (Array.isArray(data)) {
        vendorList = data;
      } else if (data.vendors && Array.isArray(data.vendors)) {
        vendorList = data.vendors;
      } else if (data.data && Array.isArray(data.data)) {
        vendorList = data.data;
      } else {
        console.warn('Unexpected response format:', data);
        vendorList = [];
      }

      setVendors(vendorList);
    } catch (err) {
      console.error('Error loading vendors:', err);
      addError('Failed to load vendors. Please try again.');
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  // Load vendors on component mount
  useEffect(() => {
    loadVendors();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter and sort vendors
  const filteredAndSortedVendors = vendors
    .filter(vendor => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return vendor.name?.toLowerCase().includes(query) || 
               vendor.contact_email?.toLowerCase().includes(query) ||
               vendor.contact_person?.toLowerCase().includes(query) ||
               vendor.phone?.includes(query);
      }
      return true;
    })
    .filter(vendor => {
      // Category filter
      if (categoryFilter === 'all') return true;
      return vendor.categories?.includes(categoryFilter);
    })
    .filter(vendor => {
      // Rating filter
      if (ratingFilter === 'all') return true;
      const rating = vendor.rating || 0;
      const hasRating = vendor.rating && vendor.rating > 0;
      switch (ratingFilter) {
        case '5': return hasRating && rating === 5;
        case '4+': return hasRating && rating >= 4;
        case '3+': return hasRating && rating >= 3;
        case 'unrated': return !hasRating;
        default: return true;
      }
    })
    .filter(vendor => {
      // Status filter
      if (statusFilter === 'all') return true;
      return vendor.status === statusFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return (a.name || '').localeCompare(b.name || '');
        case 'name-desc':
          return (b.name || '').localeCompare(a.name || '');
        case 'rating-high':
          return (b.rating || 0) - (a.rating || 0);
        case 'rating-low':
          return (a.rating || 0) - (b.rating || 0);
        case 'recent':
          return new Date(b.lastActivity) - new Date(a.lastActivity);
        case 'rfps':
          return (b.rfpCount || 0) - (a.rfpCount || 0);
        default:
          return 0;
      }
    });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.contact_email.trim()) {
      addError('Please fill in Vendor Name and Contact Email');
      return;
    }

    setLoading(true);

    try {
      if (editingId) {
        await updateVendor(editingId, formData);
        addSuccess('✓ Vendor updated successfully!');
      } else {
        await createVendor(formData);
        addSuccess('✓ Vendor created successfully!');
      }

      setFormData({ 
        name: '', 
        contact_email: '', 
        contact_person: '', 
        phone: '', 
        address: '', 
        notes: '',
        categories: [],
        rating: 0,
        status: 'active'
      });
      setEditingId(null);
      setShowForm(false);
      await loadVendors();
    } catch (err) {
      console.error('Error saving vendor:', err);
      addError('❌ Failed to save vendor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vendor) => {
    setFormData({ 
      name: vendor.name, 
      contact_email: vendor.contact_email,
      contact_person: vendor.contact_person || '',
      phone: vendor.phone || '',
      address: vendor.address || '',
      notes: vendor.notes || '',
      categories: vendor.categories || [],
      rating: vendor.rating || 0,
      status: vendor.status || 'active'
    });
    setEditingId(vendor._id);
    setShowForm(true);
  };

  const handleDelete = async (vendorId) => {
    const { showConfirm } = useNotificationStore.getState();
    
    // Find the vendor to show name in confirmation
    const vendorToDelete = vendors.find(v => v._id === vendorId);
    
    const confirmed = await showConfirm({
      title: 'Delete Vendor',
      message: `Are you sure you want to delete "${vendorToDelete?.name || 'this vendor'}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });
    
    if (!confirmed) return;
    
    setLoading(true);

    try {
      await deleteVendor(vendorId);
      addSuccess('🗑️ Vendor deleted successfully!');
      await loadVendors();
    } catch (err) {
      console.error('Error deleting vendor:', err);
      addError('❌ Failed to delete vendor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ 
      name: '', 
      contact_email: '', 
      contact_person: '', 
      phone: '', 
      address: '', 
      notes: '',
      categories: [],
      rating: 0,
      status: 'active'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return { text: 'Active', bgColor: 'bg-green-100', textColor: 'text-green-800' };
      case 'inactive':
        return { text: 'Inactive', bgColor: 'bg-gray-100', textColor: 'text-gray-600' };
      case 'new':
        return { text: 'New', bgColor: 'bg-blue-100', textColor: 'text-blue-800' };
      case 'preferred':
        return { text: 'Preferred', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' };
      default:
        return { text: 'Active', bgColor: 'bg-green-100', textColor: 'text-green-800' };
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          className={i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
        />
      );
    }
    return stars;
  };

  const formatLastActivity = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - new Date(date));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  const toggleVendorSelection = (vendorId) => {
    const newSelected = new Set(selectedVendors);
    if (newSelected.has(vendorId)) {
      newSelected.delete(vendorId);
    } else {
      newSelected.add(vendorId);
    }
    setSelectedVendors(newSelected);
  };

  const toggleCardExpansion = (vendorId) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(vendorId)) {
      newExpanded.delete(vendorId);
    } else {
      newExpanded.add(vendorId);
    }
    setExpandedCards(newExpanded);
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content - Optimized layout with more space for content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        
        {/* Header Section - Simplified and Functional */}
        <div className="mb-6">
          {/* Title and Action Row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Vendors ({filteredAndSortedVendors.length})
              </h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition flex items-center gap-2 font-medium"
            >
              <Plus size={20} />
              Add Vendor
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or contact person..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="IT Services">IT Services</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Furniture">Furniture</option>
                <option value="IT Equipment">IT Equipment</option>
              </select>
              <Filter size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Rating Filter */}
            <div className="relative">
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Ratings</option>
                <option value="5">⭐⭐⭐⭐⭐ Only</option>
                <option value="4+">⭐⭐⭐⭐ & Up</option>
                <option value="3+">⭐⭐⭐ & Up</option>
                <option value="unrated">Unrated</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="new">New</option>
                <option value="preferred">Preferred</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="rating-high">Rating (High to Low)</option>
                <option value="rating-low">Rating (Low to High)</option>
                <option value="recent">Most Recent Activity</option>
                <option value="rfps">Most RFPs</option>
              </select>
              <ArrowUpDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>



        {/* Bulk Actions Bar - Show when vendors are selected */}
        {selectedVendors.size > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <span className="font-medium text-blue-900">
              {selectedVendors.size} vendor{selectedVendors.size > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Export
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                Delete
              </button>
              <button 
                onClick={() => setSelectedVendors(new Set())}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Deselect All
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit Vendor' : 'Add New Vendor'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Vendor Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter vendor name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Contact Email *
                </label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  placeholder="Enter vendor email"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={formData.contact_person}
                  onChange={(e) => handleInputChange('contact_person', e.target.value)}
                  placeholder="Enter contact person name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter vendor address"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Enter vendor notes or description"
                  rows="3"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition font-medium"
                >
                  {editingId ? 'Update Vendor' : 'Create Vendor'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2.5 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading State */}
        {loading && !showForm && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {/* Vendors Grid - Responsive 2-column layout */}
        {!loading && filteredAndSortedVendors.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAndSortedVendors.map((vendor) => {
              const statusBadge = getStatusBadge(vendor.status);
              const isExpanded = expandedCards.has(vendor._id);
              const isSelected = selectedVendors.has(vendor._id);
              
              return (
                <div
                  key={vendor._id}
                  className={`bg-white border rounded-lg p-4 transition-all duration-200 cursor-pointer group ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-500 hover:shadow-lg'
                  } ${isExpanded ? 'transform scale-105' : ''}`}
                >
                  {/* Selection checkbox */}
                  <div className="flex items-start justify-between mb-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleVendorSelection(vendor._id)}
                      className="mt-1"
                    />
                    <button
                      onClick={() => toggleCardExpansion(vendor._id)}
                      className="text-blue-600 text-sm hover:text-blue-800"
                    >
                      {isExpanded ? 'Collapse ▲' : 'Expand ▼'}
                    </button>
                  </div>

                  {/* Row 1: Vendor Name + Rating */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                      {vendor.name}
                    </h3>
                    {(vendor.rating && vendor.rating > 0) && (
                      <div className="flex items-center gap-1 ml-4">
                        <div className="flex">
                          {renderStars(vendor.rating)}
                        </div>
                        {vendor.reviewCount > 0 && (
                          <span className="text-sm text-gray-600 ml-1">
                            ({vendor.reviewCount})
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Row 2: Categories + Status Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {vendor.categories?.slice(0, 2).map((category, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {category}
                        </span>
                      ))}
                      {vendor.categories?.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{vendor.categories.length - 2} more
                        </span>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${statusBadge.bgColor} ${statusBadge.textColor}`}
                    >
                      {statusBadge.text}
                    </span>
                  </div>

                  {/* Row 3: Contact Information (2 columns) */}
                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm text-gray-600">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail size={14} />
                        <span className="truncate">{vendor.contact_email}</span>
                      </div>
                      {vendor.phone && (
                        <div className="flex items-center gap-2">
                          <Phone size={14} />
                          <span>{vendor.phone}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      {vendor.contact_person && (
                        <div className="flex items-center gap-2">
                          <User size={14} />
                          <span className="truncate">{vendor.contact_person}</span>
                        </div>
                      )}
                      {(vendor.rfpCount && vendor.rfpCount > 0) && (
                        <div className="flex items-center gap-2">
                          <Briefcase size={14} />
                          <span>{vendor.rfpCount} past RFPs</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 4: Metadata + Actions (visible on hover) */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    {vendor.lastActivity && (
                      <span className="text-sm text-gray-500">
                        Last activity: {formatLastActivity(vendor.lastActivity)}
                      </span>
                    )}
                    {!vendor.lastActivity && <div></div>}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(vendor);
                        }}
                        disabled={loading}
                        className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition disabled:opacity-50"
                        title="Edit vendor"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(vendor._id);
                        }}
                        disabled={loading}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition disabled:opacity-50"
                        title="Delete vendor"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="space-y-3">
                        {vendor.address && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Address:</h4>
                            <div className="flex items-start gap-2 text-sm text-gray-600">
                              <MapPin size={14} className="mt-0.5" />
                              <span>{vendor.address}</span>
                            </div>
                          </div>
                        )}
                        
                        {vendor.categories && vendor.categories.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Categories:</h4>
                            <div className="flex flex-wrap gap-1">
                              {vendor.categories.map((category, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                  {category}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {vendor.notes && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Notes:</h4>
                            <p className="text-sm text-gray-600">{vendor.notes}</p>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => handleEdit(vendor)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                          >
                            Edit Details
                          </button>
                          <button className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition text-sm">
                            View Full Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State - No vendors at all */}
        {!loading && vendors.length === 0 && !showForm && (
          <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <User className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Vendors Added Yet</h3>
            <p className="text-gray-600 mb-6">
              Add vendors to receive proposals and manage your procurement.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Add Your First Vendor
            </button>
          </div>
        )}

        {/* Empty State - No search results */}
        {!loading && vendors.length > 0 && filteredAndSortedVendors.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <Search className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Vendors Found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search query or filters.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setSearchQuery('')}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
              >
                Clear Search
              </button>
              <button
                onClick={() => {
                  setCategoryFilter('all');
                  setRatingFilter('all');
                  setStatusFilter('all');
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
