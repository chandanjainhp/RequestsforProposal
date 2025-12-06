import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronDown, Plus } from 'lucide-react';
import HistoryCard from '../components/HistoryCard';
import Breadcrumb from '../components/Breadcrumb';

export default function HistoryPage() {
  const navigate = useNavigate();
  // const { drafts } = useRfpStore(); // For future use with real data
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [mockHistory, setMockHistory] = useState([]);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Load conversation history (replace with real API call when available)
  useEffect(() => {
    // TODO: Replace with actual API call to get conversation history
    // For now, start with empty state
    setMockHistory([]);
    setFilteredHistory([]);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = mockHistory.slice();

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Time filter
    const now = new Date();
    if (timeFilter !== 'all') {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.createdAt);
        const daysDiff = Math.floor((now - itemDate) / (1000 * 60 * 60 * 24));

        if (timeFilter === 'today') return daysDiff === 0;
        if (timeFilter === 'week') return daysDiff < 7;
        if (timeFilter === 'month') return daysDiff < 30;
        if (timeFilter === 'quarter') return daysDiff < 90;
        return true;
      });
    }

    // Search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.messagePreview.toLowerCase().includes(searchLower) ||
        item.itemsSummary.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.lastEditedAt) - new Date(a.lastEditedAt));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'budget-high') {
      filtered.sort((a, b) => b.budget - a.budget);
    } else if (sortBy === 'budget-low') {
      filtered.sort((a, b) => a.budget - b.budget);
    } else if (sortBy === 'alphabetical') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredHistory(filtered);
  }, [searchTerm, statusFilter, timeFilter, sortBy, mockHistory]);

  const handleViewChat = (conversationId) => {
    // In production, would navigate to chat view with history
    navigate(`/chat/${conversationId}`);
  };

  const handleContinueEditing = (rfpId) => {
    navigate(`/editor/${rfpId}`);
  };

  const handleStartNew = () => {
    navigate('/chat');
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleResetFilters = () => {
    setStatusFilter('all');
    setTimeFilter('all');
    setSortBy('recent');
    setSearchTerm('');
  };

  const handleDeleteItem = (conversationId) => {
    // Confirm before delete
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      setMockHistory(mockHistory.filter(item => item.id !== conversationId));
    }
  };

  return (
    <div className="w-full overflow-x-hidden overflow-y-auto">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        <Breadcrumb items={[
          { label: 'Chat History', href: null }
        ]} />
        <div className="mt-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Chat History</h1>
          <button
            onClick={handleStartNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            New RFP
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 md:px-6 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search conversations, budgets, items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className="mb-6 flex flex-wrap gap-3 items-center">
          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <span className="text-sm font-medium text-gray-700">
                {statusFilter === 'all' ? 'All Status' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              </span>
              <ChevronDown size={16} className={`transition ${showStatusDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showStatusDropdown && (
              <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-40">
                <button
                  onClick={() => { setStatusFilter('all'); setShowStatusDropdown(false); }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${statusFilter === 'all' ? 'bg-blue-50 text-blue-600 font-medium' : ''}`}
                >
                  All Status
                </button>
                <button
                  onClick={() => { setStatusFilter('draft'); setShowStatusDropdown(false); }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${statusFilter === 'draft' ? 'bg-blue-50 text-blue-600 font-medium' : ''}`}
                >
                  Draft
                </button>
                <button
                  onClick={() => { setStatusFilter('sent'); setShowStatusDropdown(false); }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${statusFilter === 'sent' ? 'bg-blue-50 text-blue-600 font-medium' : ''}`}
                >
                  Sent
                </button>
                <button
                  onClick={() => { setStatusFilter('complete'); setShowStatusDropdown(false); }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${statusFilter === 'complete' ? 'bg-blue-50 text-blue-600 font-medium' : ''}`}
                >
                  Complete
                </button>
              </div>
            )}
          </div>

          {/* Time Filter */}
          <div className="relative">
            <button
              onClick={() => setShowTimeDropdown(!showTimeDropdown)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <span className="text-sm font-medium text-gray-700">
                {timeFilter === 'all' ? 'All Time' : timeFilter === 'today' ? 'Today' : timeFilter === 'week' ? 'This Week' : timeFilter === 'month' ? 'This Month' : 'This Quarter'}
              </span>
              <ChevronDown size={16} className={`transition ${showTimeDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showTimeDropdown && (
              <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-40">
                <button
                  onClick={() => { setTimeFilter('all'); setShowTimeDropdown(false); }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${timeFilter === 'all' ? 'bg-blue-50 text-blue-600 font-medium' : ''}`}
                >
                  All Time
                </button>
                <button
                  onClick={() => { setTimeFilter('today'); setShowTimeDropdown(false); }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${timeFilter === 'today' ? 'bg-blue-50 text-blue-600 font-medium' : ''}`}
                >
                  Today
                </button>
                <button
                  onClick={() => { setTimeFilter('week'); setShowTimeDropdown(false); }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${timeFilter === 'week' ? 'bg-blue-50 text-blue-600 font-medium' : ''}`}
                >
                  This Week
                </button>
                <button
                  onClick={() => { setTimeFilter('month'); setShowTimeDropdown(false); }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${timeFilter === 'month' ? 'bg-blue-50 text-blue-600 font-medium' : ''}`}
                >
                  This Month
                </button>
                <button
                  onClick={() => { setTimeFilter('quarter'); setShowTimeDropdown(false); }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${timeFilter === 'quarter' ? 'bg-blue-50 text-blue-600 font-medium' : ''}`}
                >
                  Last 3 Months
                </button>
              </div>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <span className="text-sm font-medium text-gray-700">
                Sort: {sortBy === 'recent' ? 'Recent' : sortBy === 'oldest' ? 'Oldest' : sortBy === 'budget-high' ? 'Budget (High)' : sortBy === 'budget-low' ? 'Budget (Low)' : 'Alphabetical'}
              </span>
              <ChevronDown size={16} className={`transition ${showSortDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showSortDropdown && (
              <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-40">
                <button
                  onClick={() => { setSortBy('recent'); setShowSortDropdown(false); }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${sortBy === 'recent' ? 'bg-blue-50 text-blue-600 font-medium' : ''}`}
                >
                  Most Recent
                </button>
                <button
                  onClick={() => { setSortBy('oldest'); setShowSortDropdown(false); }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${sortBy === 'oldest' ? 'bg-blue-50 text-blue-600 font-medium' : ''}`}
                >
                  Oldest First
                </button>
                <button
                  onClick={() => { setSortBy('budget-high'); setShowSortDropdown(false); }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${sortBy === 'budget-high' ? 'bg-blue-50 text-blue-600 font-medium' : ''}`}
                >
                  Budget (High to Low)
                </button>
                <button
                  onClick={() => { setSortBy('budget-low'); setShowSortDropdown(false); }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${sortBy === 'budget-low' ? 'bg-blue-50 text-blue-600 font-medium' : ''}`}
                >
                  Budget (Low to High)
                </button>
                <button
                  onClick={() => { setSortBy('alphabetical'); setShowSortDropdown(false); }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${sortBy === 'alphabetical' ? 'bg-blue-50 text-blue-600 font-medium' : ''}`}
                >
                  Alphabetical
                </button>
              </div>
            )}
          </div>

          {/* Active filters indicator */}
          {(searchTerm || statusFilter !== 'all' || timeFilter !== 'all' || sortBy !== 'recent') && (
            <button
              onClick={handleResetFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* History List */}
        {filteredHistory.length === 0 ? (
          <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 py-12 text-center">
            {searchTerm || statusFilter !== 'all' || timeFilter !== 'all' ? (
              <>
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-sm text-gray-600 mb-4">Try different keywords or clear your filters</p>
                <div className="flex gap-3 justify-center">
                  {searchTerm && (
                    <button
                      onClick={handleClearSearch}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                    >
                      Clear Search
                    </button>
                  )}
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                  >
                    Reset Filters
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-4xl mb-3">📜</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Chat History Yet</h3>
                <p className="text-sm text-gray-600 mb-4">Start a conversation to create your first RFP. Your chat history will appear here.</p>
                <button
                  onClick={handleStartNew}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-2"
                >
                  <Plus size={18} />
                  Start New RFP
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((item) => (
              <HistoryCard
                key={item.id}
                conversation={item}
                onViewChat={() => handleViewChat(item.id)}
                onContinueEditing={() => handleContinueEditing(item.rfpId)}
                onDelete={() => handleDeleteItem(item.id)}
              />
            ))}
          </div>
        )}

        {/* Results count */}
        {filteredHistory.length > 0 && (
          <div className="mt-6 text-sm text-gray-600 text-center">
            Showing {filteredHistory.length} of {mockHistory.length} conversations
          </div>
        )}
      </div>
    </div>
  );
}
