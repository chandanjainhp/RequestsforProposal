import { FileText, Mail, Award } from 'lucide-react';

export default function ProposalCard({ proposal, onClick = null }) {
  const statusColors = {
    received: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    rejected: 'bg-red-100 text-red-800',
    accepted: 'bg-blue-100 text-blue-800',
  };

  // Calculate score color based on final_score
  const getScoreColor = (score) => {
    if (score >= 90) return 'bg-green-50 border-green-200';
    if (score >= 75) return 'bg-blue-50 border-blue-200';
    return 'bg-yellow-50 border-yellow-200';
  };

  const getScoreBadgeColor = (score) => {
    if (score >= 90) return 'bg-green-500 text-white';
    if (score >= 75) return 'bg-blue-500 text-white';
    return 'bg-yellow-500 text-white';
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white border-2 rounded-lg p-4 hover:shadow-md transition cursor-pointer ${getScoreColor(proposal.final_score)}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <FileText className="text-purple-500" size={24} />
          <div>
            <h3 className="font-semibold text-gray-900">{proposal.vendor_name || 'Unknown Vendor'}</h3>
            <p className="text-sm text-gray-500">
              {proposal.created_at ? new Date(proposal.created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreBadgeColor(proposal.final_score)}`}>
          {Math.round(proposal.final_score)}/100
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-3 line-clamp-2 font-medium">
        {proposal.reasoning || 'No details available'}
      </p>

      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
        <Mail size={16} />
        <span>{proposal.vendor_email || 'No email'}</span>
      </div>

      {/* Score Breakdown */}
      {proposal.score_breakdown && (
        <div className="bg-gray-50 rounded p-2 mb-2 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-gray-600">Price:</span>
              <span className="ml-2 font-semibold">{Math.round(proposal.score_breakdown.price_score * 100)}%</span>
            </div>
            <div>
              <span className="text-gray-600">Delivery:</span>
              <span className="ml-2 font-semibold">{Math.round(proposal.score_breakdown.delivery_score * 100)}%</span>
            </div>
            <div>
              <span className="text-gray-600">Warranty:</span>
              <span className="ml-2 font-semibold">{Math.round(proposal.score_breakdown.warranty_score * 100)}%</span>
            </div>
            <div>
              <span className="text-gray-600">Completeness:</span>
              <span className="ml-2 font-semibold">{Math.round(proposal.score_breakdown.completeness_score * 100)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Price Info */}
      {proposal.score_breakdown?.total_price && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Award size={16} />
          <span>Price: ${proposal.score_breakdown.total_price.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}
