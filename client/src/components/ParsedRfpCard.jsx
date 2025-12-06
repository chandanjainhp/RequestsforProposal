import { FileText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ParsedRfpCard({ rfp, onEdit = null, onClick = null }) {
  const statusColors = {
    draft: 'bg-warning text-warning-dark',
    sent: 'bg-info text-white',
    received: 'bg-success text-white',
  };

  const handleClick = () => {
    if (onClick) onClick(rfp._id);
    else if (onEdit) onEdit(rfp._id);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <FileText className="text-blue-500" size={24} />
          <div>
            <h3 className="font-semibold text-gray-900">{rfp.title || 'Untitled RFP'}</h3>
            <p className="text-sm text-gray-500">
              {rfp.vendor_count || 0} vendors
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[rfp.status] || 'bg-gray-200'}`}>
          {rfp.status || 'draft'}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{rfp.summary || 'No summary'}</p>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <span>{rfp.created_at ? new Date(rfp.created_at).toLocaleDateString() : 'Just now'}</span>
        {rfp.line_items && <span>{rfp.line_items.length} line items</span>}
      </div>

      <div className="flex gap-2">
        {/* Removed - Use "Edit Details" button in Details section instead */}
      </div>
    </div>
  );
}
