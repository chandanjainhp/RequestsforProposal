import React from 'react';
import { Wifi, WifiOff, AlertTriangle, Clock } from 'lucide-react';
import { useSyncStore, SYNC_STATUS } from '../store/syncStore';
import { useNotificationStore } from '../store/notificationStore';

// Network status indicator for header/sidebar
export const NetworkStatusIndicator = ({ className = '' }) => {
  const { isOnline, pendingChanges, syncStatus } = useSyncStore();
  
  if (!isOnline) {
    return (
      <div className={`flex items-center space-x-2 text-orange-600 ${className}`}>
        <WifiOff className="w-4 h-4" />
        <span className="text-sm font-medium">Offline</span>
        {pendingChanges.length > 0 && (
          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
            {pendingChanges.length}
          </span>
        )}
      </div>
    );
  }

  if (pendingChanges.length > 0) {
    return (
      <div className={`flex items-center space-x-2 text-amber-600 ${className}`}>
        <Clock className="w-4 h-4 animate-pulse" />
        <span className="text-sm">Syncing...</span>
        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
          {pendingChanges.length}
        </span>
      </div>
    );
  }

  if (syncStatus === SYNC_STATUS.ERROR) {
    return (
      <div className={`flex items-center space-x-2 text-red-600 ${className}`}>
        <AlertTriangle className="w-4 h-4" />
        <span className="text-sm">Sync Error</span>
      </div>
    );
  }

  // Online and synced
  return (
    <div className={`flex items-center space-x-2 text-green-600 ${className}`}>
      <Wifi className="w-4 h-4" />
      <span className="text-sm">Online</span>
    </div>
  );
};

// Offline mode banner that shows specific disabled features
export const OfflineModeBanner = () => {
  const { isOnline } = useSyncStore();
  
  if (isOnline) return null;
  
  return (
    <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <WifiOff className="h-5 w-5 text-orange-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-orange-800">
            Working in offline mode
          </h3>
          <div className="mt-2 text-sm text-orange-700">
            <p>You can continue editing RFPs. Changes will sync when you're back online.</p>
            <div className="mt-2">
              <p className="font-medium">Disabled while offline:</p>
              <ul className="list-disc list-inside ml-2 text-xs space-y-1">
                <li>Sending RFPs to vendors</li>
                <li>Adding new vendors</li>
                <li>Checking for new proposals</li>
                <li>Real-time updates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sync progress indicator
export const SyncProgressIndicator = () => {
  const { pendingChanges, syncStatus } = useSyncStore();
  const { addSuccess, addError } = useNotificationStore();
  
  if (pendingChanges.length === 0 || syncStatus !== SYNC_STATUS.SAVING) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white shadow-lg rounded-lg border p-4 flex items-center space-x-3">
        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div>
          <p className="text-sm font-medium text-gray-900">
            Syncing changes...
          </p>
          <p className="text-xs text-gray-600">
            {pendingChanges.length} item{pendingChanges.length !== 1 ? 's' : ''} remaining
          </p>
        </div>
      </div>
    </div>
  );
};

// Connection recovery component
export const ConnectionRecovery = () => {
  const { isOnline, pendingChanges, syncPendingChanges } = useSyncStore();
  const [justConnected, setJustConnected] = React.useState(false);
  
  React.useEffect(() => {
    if (isOnline && pendingChanges.length > 0) {
      setJustConnected(true);
      
      // Auto-start sync after brief delay
      const timer = setTimeout(() => {
        syncPendingChanges();
        setJustConnected(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isOnline, pendingChanges.length, syncPendingChanges]);
  
  if (!justConnected) return null;
  
  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Wifi className="h-5 w-5 text-green-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Connection restored
            </h3>
            <p className="mt-1 text-sm text-green-700">
              Syncing {pendingChanges.length} pending change{pendingChanges.length !== 1 ? 's' : ''}...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Badge component for navigation items
export const NotificationBadge = ({ count, className = '' }) => {
  if (!count || count === 0) return null;
  
  return (
    <span className={`
      inline-flex items-center justify-center px-2 py-1 text-xs font-bold 
      leading-none text-white transform translate-x-1/2 -translate-y-1/2 
      bg-red-500 rounded-full ${className}
    `}>
      {count > 99 ? '99+' : count}
    </span>
  );
};

// Main network status manager component
export const NetworkStatusManager = () => {
  const { setOnlineStatus } = useSyncStore();
  
  React.useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnlineStatus]);
  
  return (
    <>
      <OfflineModeBanner />
      <SyncProgressIndicator />
      <ConnectionRecovery />
    </>
  );
};