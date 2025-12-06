import { CheckCircle, Clock, AlertTriangle, Loader } from 'lucide-react';

export default function SaveStatusIndicator({ status, lastSavedAt, isDirty }) {
  const getStatusDisplay = () => {
    switch (status) {
      case 'saving':
        return {
          icon: <Loader size={16} className="animate-spin text-blue-500" />,
          text: 'Saving...',
          color: 'text-blue-600'
        };
      case 'failed':
        return {
          icon: <AlertTriangle size={16} className="text-red-500" />,
          text: 'Failed to save',
          color: 'text-red-600'
        };
      case 'saved':
        if (isDirty) {
          return {
            icon: <Clock size={16} className="text-orange-500" />,
            text: 'Unsaved changes',
            color: 'text-orange-600'
          };
        }
        return {
          icon: <CheckCircle size={16} className="text-green-500" />,
          text: lastSavedAt ? `Saved ${getTimeAgo(lastSavedAt)}` : 'All changes saved',
          color: 'text-green-600'
        };
      default:
        return {
          icon: <CheckCircle size={16} className="text-gray-400" />,
          text: 'Ready',
          color: 'text-gray-500'
        };
    }
  };

  const { icon, text, color } = getStatusDisplay();

  return (
    <div className={`flex items-center gap-2 text-sm ${color}`}>
      {icon}
      <span>{text}</span>
    </div>
  );
}

function getTimeAgo(timestamp) {
  if (!timestamp) return 'just now';

  const now = new Date();
  const saved = new Date(timestamp);
  const diffMs = now - saved;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}