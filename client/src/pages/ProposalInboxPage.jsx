import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { getComparison, getRfpList } from '../api/compare';
import { AlertCircle, Search, Plus, TrendingUp, Inbox, DollarSign, Package, Calendar, Users, ExternalLink, Filter, ArrowUpDown } from 'lucide-react';

export default function ProposalInboxPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [proposals, setProposals] = useState([]);
  const [rfpList, setRfpList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    const loadProposals = async () => {
      setLoading(true);
      setError(null);
      setProposals([]);
      try {
        // Try to get rfpId from URL params first, then from state
        const rfpId = params.rfpId || location.state?.rfpId;
        
        if (!rfpId) {
          // Fetch list of RFPs to show user
          const data = await getRfpList();
          console.log('RFP List loaded:', data);
          setRfpList(data.rfps || []);
          return;
        }

        // Use getComparison which returns proposals with scores
        console.log('Loading proposals for RFP:', rfpId);
        const data = await getComparison(rfpId);
        console.log('Proposals loaded:', data);
        setProposals(data.proposals || []);
        setRfpList([]); // Clear RFP list when we have proposals
      } catch (err) {
        console.error('Error loading proposals:', err);
        setError(err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Failed to load proposals');
        setProposals([]);
      } finally {
        setLoading(false);
      }
    };

    loadProposals();
  }, [params.rfpId, location.state?.rfpId]);

  const handleCompare = () => {
    const rfpId = params.rfpId || location.state?.rfpId;
    navigate(`/compare/${rfpId}`);
  };

  const handleProposalClick = (proposalId) => {
    // Navigate to proposal details page (can be implemented later)
    console.log('Viewing proposal:', proposalId);
  };

  // Filter and sort RFPs
  const filteredAndSortedRfps = rfpList
    .filter(rfp => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return rfp.title?.toLowerCase().includes(query) || 
               rfp.description?.toLowerCase().includes(query) ||
               rfp._id.toLowerCase().includes(query);
      }
      return true;
    })
    .filter(rfp => {
      // Status filter
      if (statusFilter === 'all') return true;
      if (statusFilter === 'awaiting') return (rfp.proposalCount || 0) === 0;
      if (statusFilter === 'active') return (rfp.proposalCount || 0) > 0;
      if (statusFilter === 'selected') return rfp.status === 'vendor_selected';
      if (statusFilter === 'archived') return rfp.status === 'archived';
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'budget-high':
          return (b.budget || 0) - (a.budget || 0);
        case 'budget-low':
          return (a.budget || 0) - (b.budget || 0);
        case 'proposals':
          return (b.proposalCount || 0) - (a.proposalCount || 0);
        case 'alphabetical':
          return (a.title || '').localeCompare(b.title || '');
        default:
          return 0;
      }
    });

  const getStatusBadge = (rfp) => {
    const proposalCount = rfp.proposalCount || 0;
    const status = rfp.status || 'active';
    
    if (status === 'vendor_selected') {
      return { text: '✓ Vendor Selected', bgColor: 'bg-green-100', textColor: 'text-green-800' };
    } else if (status === 'archived') {
      return { text: 'Archived', bgColor: 'bg-gray-100', textColor: 'text-gray-600' };
    } else if (proposalCount === 0) {
      return { text: 'Awaiting Proposals', bgColor: 'bg-gray-100', textColor: 'text-gray-700' };
    } else if (proposalCount > 0) {
      return { text: `${proposalCount} Proposals`, bgColor: 'bg-blue-100', textColor: 'text-blue-800' };
    }
    return { text: 'Active', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' };
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Budget TBD';
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content - Optimized for sidebar width of 240px */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        
        {/* Header Section - Simplified and Functional */}
        <div className="mb-8">
          {/* Title and Action Row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Proposals</h1>
              <p className="text-gray-600">
                {filteredAndSortedRfps.length} RFP{filteredAndSortedRfps.length !== 1 ? 's' : ''} available
              </p>
            </div>
            <button
              onClick={() => navigate('/chat')}
              className="btn-primary flex items-center gap-2 font-medium"
            >
              <Plus size={20} />
              New RFP
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, description, or ID..."
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

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All RFPs</option>
                <option value="awaiting">Awaiting Proposals</option>
                <option value="active">Active (Has Proposals)</option>
                <option value="selected">Vendor Selected</option>
                <option value="archived">Archived</option>
              </select>
              <Filter size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="budget-high">Budget (High to Low)</option>
                <option value="budget-low">Budget (Low to High)</option>
                <option value="proposals">By Proposal Count</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
              <ArrowUpDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-500 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {/* RFP Cards Grid - Responsive 3-column layout */}
        {!loading && filteredAndSortedRfps.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedRfps.map((rfp) => {
              const statusBadge = getStatusBadge(rfp);
              const proposalCount = rfp.proposalCount || 0;
              
              return (
                <div
                  key={rfp._id}
                  onClick={() => navigate(`/proposals/${rfp._id}`)}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-500 transition-all duration-200 cursor-pointer group"
                >
                  {/* Top Row: Status Badge + Date */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${statusBadge.bgColor} ${statusBadge.textColor}`}
                    >
                      {statusBadge.text}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(rfp.created_at)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 text-base leading-tight">
                    {rfp.title}
                  </h3>

                  {/* Metrics Row */}
                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <DollarSign size={14} />
                      <span className="font-medium">{formatCurrency(rfp.budget)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Package size={14} />
                      <span>{rfp.itemCount || 1} items</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      <span>{rfp.timeline || '30 days'}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                    {rfp.description}
                  </p>

                  {/* Bottom Row: Action Button + Proposal Count */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          proposalCount > 0 ? 'text-blue-600' : 'text-gray-500'
                        }`}
                      >
                        View Details
                      </span>
                      <ExternalLink size={14} className="text-gray-400 group-hover:text-blue-500 transition" />
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users size={14} />
                      <span>{proposalCount} {proposalCount === 1 ? 'proposal' : 'proposals'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Proposals View - When viewing specific RFP */}
        {!loading && proposals.length > 0 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {proposals.map((proposal) => (
                <div
                  key={proposal.proposal_id || proposal._id}
                  onClick={() => handleProposalClick(proposal.proposal_id || proposal._id)}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-500 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-gray-900">{proposal.vendor_name}</h3>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(proposal.total_amount)}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Score:</span>
                      <span className="font-medium">{proposal.score || 'N/A'}/100</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Timeline:</span>
                      <span>{proposal.delivery_timeline || 'TBD'}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 line-clamp-3">
                    {proposal.summary || proposal.description || 'No description available'}
                  </p>
                </div>
              ))}
            </div>

            {/* Compare Button for Proposals */}
            {proposals.length > 1 && (
              <div className="flex justify-center">
                <button
                  onClick={handleCompare}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 font-medium"
                >
                  <TrendingUp size={20} />
                  Compare Proposals
                </button>
              </div>
            )}
          </div>
        )}

        {/* Empty State - No RFPs at all */}
        {!loading && filteredAndSortedRfps.length === 0 && rfpList.length === 0 && !error && (
          <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <Inbox className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No RFPs Created Yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first RFP to receive proposals from vendors.
            </p>
            <button
              onClick={() => navigate('/chat')}
              className="btn-primary font-medium"
            >
              Create RFP
            </button>
          </div>
        )}

        {/* Empty State - No search results */}
        {!loading && filteredAndSortedRfps.length === 0 && rfpList.length > 0 && (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <Search className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No RFPs Found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search query or filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
