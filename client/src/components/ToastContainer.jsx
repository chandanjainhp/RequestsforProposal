import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Loader } from 'lucide-react';
import { useNotificationStore, NOTIFICATION_TYPES } from '../store/notificationStore';

// Icon mapping for different notification types
const iconMap = {
  [NOTIFICATION_TYPES.SUCCESS]: CheckCircle,
  [NOTIFICATION_TYPES.ERROR]: AlertCircle,
  [NOTIFICATION_TYPES.WARNING]: AlertTriangle,
  [NOTIFICATION_TYPES.INFO]: Info,
  [NOTIFICATION_TYPES.LOADING]: Loader
};

// Color classes for different notification types
const colorClasses = {
  [NOTIFICATION_TYPES.SUCCESS]: {
    container: 'bg-green-50 border-green-200 text-green-800',
    border: 'border-l-green-500',
    icon: 'text-green-500',
    button: 'bg-green-100 hover:bg-green-200 text-green-700'
  },
  [NOTIFICATION_TYPES.ERROR]: {
    container: 'bg-red-50 border-red-200 text-red-800',
    border: 'border-l-red-500',
    icon: 'text-red-500',
    button: 'bg-red-100 hover:bg-red-200 text-red-700'
  },
  [NOTIFICATION_TYPES.WARNING]: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    border: 'border-l-yellow-500',
    icon: 'text-yellow-500',
    button: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
  },
  [NOTIFICATION_TYPES.INFO]: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    border: 'border-l-blue-500',
    icon: 'text-blue-500',
    button: 'bg-blue-100 hover:bg-blue-200 text-blue-700'
  },
  [NOTIFICATION_TYPES.LOADING]: {
    container: 'bg-gray-50 border-gray-200 text-gray-800',
    border: 'border-l-gray-500',
    icon: 'text-gray-500',
    button: 'bg-gray-100 hover:bg-gray-200 text-gray-700'
  }
};

const ToastNotification = ({ notification }) => {
  const { dismissToast } = useNotificationStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const IconComponent = iconMap[notification.type];
  const colors = colorClasses[notification.type];

  // Handle animations
  useEffect(() => {
    // Slide in animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsLeaving(true);
    // Allow animation to complete before removing
    setTimeout(() => {
      dismissToast(notification.id);
    }, 300);
  };

  const handleAction = () => {
    if (notification.onAction) {
      notification.onAction();
    }
    handleDismiss();
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
        }
        max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto
        border border-l-4 ${colors.container} ${colors.border}
      `}
    >
      <div className="p-4">
        <div className="flex items-start">
          {/* Icon */}
          <div className="flex-shrink-0">
            <IconComponent 
              className={`h-5 w-5 ${colors.icon} ${
                notification.type === NOTIFICATION_TYPES.LOADING ? 'animate-spin' : ''
              }`} 
            />
          </div>
          
          {/* Message */}
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium">
              {notification.message}
            </p>
            
            {/* Action button */}
            {notification.actionButton && (
              <div className="mt-2">
                <button
                  type="button"
                  className={`
                    text-xs font-medium px-2 py-1 rounded
                    transition-colors duration-200
                    ${colors.button}
                  `}
                  onClick={handleAction}
                >
                  {notification.actionButton}
                </button>
              </div>
            )}
          </div>
          
          {/* Close button */}
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className={`
                inline-flex text-gray-400 hover:text-gray-600
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                rounded-md p-1
              `}
              onClick={handleDismiss}
            >
              <span className="sr-only">Close</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToastContainer = () => {
  const { notifications } = useNotificationStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50">
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {notifications.map((notification) => (
          <ToastNotification
            key={notification.id}
            notification={notification}
          />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;