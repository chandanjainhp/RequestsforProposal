import { MoreVertical, MessageCircle, Clock, TrendingUp, AlertCircle, CheckCircle, Inbox, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function HistoryCard({ conversation, onViewChat, onContinueEditing, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);

  // Format time relative to now
  const formatTime = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get status badge styling
  const getStatusBadge = () => {
    const statusConfig = {
      draft: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Draft', icon: '📝' },
      sent: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Sent', icon: '📤' },
      'in-progress': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'In Progress', icon: '📊' },
      complete: { bg: 'bg-green-100', text: 'text-green-800', label: 'Complete', icon: '✓' },
      archived: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Archived', icon: '📦' },
    };

    const config = statusConfig[conversation.status] || statusConfig.draft;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        <span>{config.icon}</span>
        {config.label}
      </span>
    );
  };

  // Get confidence indicator
  const getConfidenceIndicator = () => {
    const confidence = conversation.confidence;
    let color = 'text-red-600';
    let icon = <AlertCircle size={16} />;
    let label = 'Low';

    if (confidence >= 90) {
      color = 'text-green-600';
      icon = <CheckCircle size={16} />;
      label = 'High';
    } else if (confidence >= 70) {
      color = 'text-yellow-600';
      icon = <TrendingUp size={16} />;
      label = 'Good';
    } else if (confidence >= 50) {
      color = 'text-orange-600';
      icon = <AlertCircle size={16} />;
      label = 'Fair';
    }

    return (
      <div className={`flex items-center gap-1 ${color}`}>
        {icon}
        <span className="text-sm font-medium">{confidence}%</span>
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow overflow-hidden">
      {/* Card Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{conversation.title}</h3>
              {getStatusBadge()}
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <MoreVertical size={20} />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
                <button
                  onClick={() => {
                    onContinueEditing();
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                >
                  ✏️ Edit RFP
                </button>
                <button
                  onClick={() => {
                    onViewChat();
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                >
                  💬 View Chat
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                >
                  📋 Duplicate
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                >
                  📥 Export as PDF
                </button>
                <div className="border-t border-gray-100" />
                <button
                  onClick={() => {
                    onDelete();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-6 py-4 space-y-3">
        {/* Details Row 1: Budget and Items */}
        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span>💰</span>
            <span>
              <strong className="text-gray-900">${conversation.budget.toLocaleString()}</strong>
              {' '}{conversation.currency}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>📦</span>
            <span>{conversation.itemsSummary}</span>
          </div>
          {conversation.vendorCount > 0 && (
            <div className="flex items-center gap-2">
              <span>👥</span>
              <span>Sent to {conversation.vendorCount} vendor{conversation.vendorCount !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Details Row 2: Timestamps */}
        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            <span>Created {formatTime(conversation.createdAt)}</span>
          </div>
          {conversation.lastEditedAt && (
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              <span>Edited {formatTime(conversation.lastEditedAt)}</span>
            </div>
          )}
        </div>

        {/* Details Row 3: Confidence Score */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Parse Quality:</span>
          {getConfidenceIndicator()}
        </div>

        {/* Message Preview */}
        <div className="bg-gray-50 rounded-lg p-3 mt-3 border-l-4 border-blue-200">
          <p className="text-sm text-gray-700 italic line-clamp-2">
            "{conversation.messagePreview}"
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {conversation.messageCount} message{conversation.messageCount !== 1 ? 's' : ''} in conversation
          </p>
        </div>
      </div>

      {/* Card Footer - Action Buttons */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3 flex-wrap">
        <button
          onClick={onViewChat}
          className="flex-1 md:flex-none px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
        >
          <span className="flex items-center justify-center gap-2">
            <MessageCircle size={16} />
            View Chat
          </span>
        </button>
        <button
          onClick={onContinueEditing}
          className="flex-1 md:flex-none px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
        >
          <span className="flex items-center justify-center gap-2">
            ✏️
            Continue Editing
          </span>
        </button>
        {conversation.status === 'sent' && (
          <button
            className="flex-1 md:flex-none px-4 py-2 text-sm font-medium text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition"
          >
            <span className="flex items-center justify-center gap-2">
              <Inbox size={16} />
              View Proposals
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
