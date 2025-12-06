import React from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Wifi, WifiOff } from 'lucide-react';
import { useNotificationStore, NOTIFICATION_TYPES } from '../store/notificationStore';

// Icon mapping for different notification types
const iconMap = {
  [NOTIFICATION_TYPES.SUCCESS]: CheckCircle,
  [NOTIFICATION_TYPES.ERROR]: AlertCircle,
  [NOTIFICATION_TYPES.WARNING]: AlertTriangle,
  [NOTIFICATION_TYPES.INFO]: Info,
  [NOTIFICATION_TYPES.LOADING]: WifiOff // Offline indicator
};

// Color classes for different banner types
const bannerColorClasses = {
  [NOTIFICATION_TYPES.SUCCESS]: {
    container: 'bg-green-100 border-green-400',
    border: 'border-l-green-500',
    icon: 'text-green-600',
    text: 'text-green-800',
    button: 'bg-green-200 hover:bg-green-300 text-green-800 border-green-400'
  },
  [NOTIFICATION_TYPES.ERROR]: {
    container: 'bg-red-100 border-red-400',
    border: 'border-l-red-500',
    icon: 'text-red-600',
    text: 'text-red-800',
    button: 'bg-red-200 hover:bg-red-300 text-red-800 border-red-400'
  },
  [NOTIFICATION_TYPES.WARNING]: {
    container: 'bg-yellow-100 border-yellow-400',
    border: 'border-l-yellow-500',
    icon: 'text-yellow-600',
    text: 'text-yellow-800',
    button: 'bg-yellow-200 hover:bg-yellow-300 text-yellow-800 border-yellow-400'
  },
  [NOTIFICATION_TYPES.INFO]: {
    container: 'bg-blue-100 border-blue-400',
    border: 'border-l-blue-500',
    icon: 'text-blue-600',
    text: 'text-blue-800',
    button: 'bg-blue-200 hover:bg-blue-300 text-blue-800 border-blue-400'
  },
  [NOTIFICATION_TYPES.LOADING]: {
    container: 'bg-gray-100 border-gray-400',
    border: 'border-l-gray-500',
    icon: 'text-gray-600',
    text: 'text-gray-800',
    button: 'bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-400'
  }
};

const BannerNotification = ({ banner }) => {
  const { dismissBanner } = useNotificationStore();
  
  const IconComponent = iconMap[banner.type];
  const colors = bannerColorClasses[banner.type];

  const handleDismiss = () => {
    dismissBanner(banner.id);
  };

  const handleAction = () => {
    if (banner.onAction) {
      banner.onAction();
    }
    if (!banner.keepOpen) {
      handleDismiss();
    }
  };

  return (
    <div className={`
      border ${colors.container} ${colors.border}
      border-l-4 p-4 mb-4 rounded-md
      animate-in slide-in-from-top duration-300
    `}>
      <div className="flex items-start">
        {/* Icon */}
        <div className="flex-shrink-0">
          <IconComponent className={`h-5 w-5 ${colors.icon}`} />
        </div>
        
        {/* Content */}
        <div className="ml-3 flex-1">
          <div className={`text-sm ${colors.text}`}>
            {typeof banner.message === 'string' ? (
              <p>{banner.message}</p>
            ) : (
              banner.message
            )}
          </div>
          
          {/* Action button */}
          {banner.actionButton && (
            <div className="mt-3">
              <button
                type="button"
                className={`
                  text-sm font-medium px-3 py-1 rounded border
                  transition-colors duration-200
                  ${colors.button}
                `}
                onClick={handleAction}
              >
                {banner.actionButton}
              </button>
            </div>
          )}
        </div>
        
        {/* Close button */}
        {banner.dismissible !== false && (
          <div className="ml-4 flex-shrink-0">
            <button
              className={`
                inline-flex text-gray-400 hover:text-gray-600
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                rounded-md p-1
              `}
              onClick={handleDismiss}
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Network status banner component
const NetworkStatusBanner = () => {
  const { isOffline, addSuccess } = useNotificationStore();
  
  if (!isOffline) return null;
  
  return (
    <div className="bg-orange-100 border-orange-400 border-l-4 border-l-orange-500 p-3 mb-4 rounded-md">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <WifiOff className="h-5 w-5 text-orange-600" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-orange-800">
            📡 You're offline. Changes will sync when reconnected.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-orange-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main banner container component
const BannerContainer = () => {
  const { banners } = useNotificationStore();
  
  return (
    <div className="relative">
      {/* Network status banner (always shows when offline) */}
      <NetworkStatusBanner />
      
      {/* Regular banner notifications */}
      {banners.map((banner) => (
        <BannerNotification
          key={banner.id}
          banner={banner}
        />
      ))}
    </div>
  );
};

export default BannerContainer;