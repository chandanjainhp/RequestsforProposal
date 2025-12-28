import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useNotificationStore } from '../store/notificationStore';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { showToast } = useNotificationStore();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast({
        type: 'success',
        title: 'Connection Restored',
        message: 'You are now online.',
        duration: 3000
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      showToast({
        type: 'error',
        title: 'Connection Lost',
        message: 'You are now offline. Some features may not work.',
        duration: 0 // Don't auto-dismiss
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToast]);

  if (isOnline) {
    return null; // Don't show when online
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-50 border-b border-red-200 z-[9999]">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-center space-x-2 text-red-600">
          <WifiOff size={16} />
          <span className="text-sm font-[560]">You are offline</span>
          <span className="text-xs text-red-500">Some features may not work</span>
        </div>
      </div>
    </div>
  );
};

// Network Status Indicator Component
export const NetworkStatusIndicator = ({ className = "" }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {isOnline ? (
        <>
          <Wifi size={14} className="text-green-500" />
          <span className="text-green-600 text-xs">Online</span>
        </>
      ) : (
        <>
          <WifiOff size={14} className="text-red-500" />
          <span className="text-red-600 text-xs">Offline</span>
        </>
      )}
    </div>
  );
};

// Notification Badge Component
export const NotificationBadge = ({ count, className = "" }) => {
  if (!count || count <= 0) return null;

  return (
    <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-[#6D8196] rounded-full ${className}`}>
      {count > 99 ? '99+' : count}
    </span>
  );
};

export default NetworkStatus;