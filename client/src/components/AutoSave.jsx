import { useEffect, useRef, useState } from 'react';
import { useSyncStore, SYNC_STATUS } from '../store/syncStore';
import { useNotificationStore } from '../store/notificationStore';

// Auto-save hook for form fields
export const useAutoSave = (rfpId, fieldName, value, options = {}) => {
  const { updateRfp, syncStatus } = useSyncStore();
  const saveTimerRef = useRef(null);
  const previousValueRef = useRef(value);
  
  const {
    delay = 2000,        // Debounce delay in milliseconds
    enabled = true,      // Whether auto-save is enabled
    onSaveStart,        // Callback when save starts
    onSaveComplete,     // Callback when save completes
    onSaveError         // Callback when save fails
  } = options;

  useEffect(() => {
    // Don't save if auto-save is disabled or value hasn't changed
    if (!enabled || value === previousValueRef.current) {
      return;
    }

    // Clear existing timer
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    // Set up new save timer
    saveTimerRef.current = setTimeout(() => {
      if (onSaveStart) onSaveStart();
      
      updateRfp(rfpId, { [fieldName]: value });
      
      previousValueRef.current = value;
    }, delay);

    // Cleanup timer on unmount or value change
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [value, rfpId, fieldName, delay, enabled, updateRfp]);

  // Monitor sync status for callbacks
  useEffect(() => {
    if (syncStatus === SYNC_STATUS.SAVED && onSaveComplete) {
      onSaveComplete();
    } else if (syncStatus === SYNC_STATUS.ERROR && onSaveError) {
      onSaveError();
    }
  }, [syncStatus, onSaveComplete, onSaveError]);

  return {
    isSaving: syncStatus === SYNC_STATUS.SAVING,
    isSaved: syncStatus === SYNC_STATUS.SAVED,
    hasError: syncStatus === SYNC_STATUS.ERROR,
    isOfflinePending: syncStatus === SYNC_STATUS.OFFLINE_PENDING
  };
};

// Enhanced form field component with auto-save
export const AutoSaveInput = ({ 
  rfpId, 
  fieldName, 
  value, 
  onChange, 
  className = '',
  placeholder = '',
  type = 'text',
  showSaveStatus = true,
  ...props 
}) => {
  const [localValue, setLocalValue] = useState(value);
  const { isSaving, isSaved, hasError } = useAutoSave(rfpId, fieldName, localValue);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (onChange) onChange(e);
  };

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className="relative">
      <input
        type={type}
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`
          ${className}
          ${hasError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
        `}
        {...props}
      />
      
      {showSaveStatus && (
        <AutoSaveStatus 
          isSaving={isSaving}
          isSaved={isSaved}
          hasError={hasError}
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        />
      )}
    </div>
  );
};

// Enhanced textarea with auto-save
export const AutoSaveTextarea = ({ 
  rfpId, 
  fieldName, 
  value, 
  onChange, 
  className = '',
  placeholder = '',
  showSaveStatus = true,
  rows = 3,
  ...props 
}) => {
  const [localValue, setLocalValue] = useState(value);
  const { isSaving, isSaved, hasError } = useAutoSave(rfpId, fieldName, localValue);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (onChange) onChange(e);
  };

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className="relative">
      <textarea
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        className={`
          ${className}
          ${hasError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
        `}
        {...props}
      />
      
      {showSaveStatus && (
        <AutoSaveStatus 
          isSaving={isSaving}
          isSaved={isSaved}
          hasError={hasError}
          className="absolute right-2 top-2"
        />
      )}
    </div>
  );
};

// Auto-save status indicator
export const AutoSaveStatus = ({ 
  isSaving, 
  isSaved, 
  hasError, 
  isOfflinePending = false,
  className = '' 
}) => {
  const [showSaved, setShowSaved] = useState(false);

  // Show saved indicator briefly
  useEffect(() => {
    if (isSaved) {
      setShowSaved(true);
      const timer = setTimeout(() => setShowSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSaved]);

  if (isSaving) {
    return (
      <div className={`flex items-center space-x-1 text-gray-500 text-xs ${className}`}>
        <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        <span>Saving...</span>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`flex items-center space-x-1 text-red-500 text-xs ${className}`}>
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span>Failed</span>
      </div>
    );
  }

  if (isOfflinePending) {
    return (
      <div className={`flex items-center space-x-1 text-orange-500 text-xs ${className}`}>
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        <span>Queued</span>
      </div>
    );
  }

  if (showSaved) {
    return (
      <div className={`flex items-center space-x-1 text-green-500 text-xs ${className}`}>
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span>Saved</span>
      </div>
    );
  }

  return null;
};

// Global auto-save status component (for header or corner)
export const GlobalAutoSaveStatus = () => {
  const { syncStatus, pendingChanges, lastSyncTime } = useSyncStore();
  const [timeAgo, setTimeAgo] = useState('');

  // Update "time ago" display
  useEffect(() => {
    if (!lastSyncTime) return;

    const updateTimeAgo = () => {
      const now = Date.now();
      const diff = now - lastSyncTime;
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      if (minutes > 0) {
        setTimeAgo(`${minutes}m ago`);
      } else if (seconds > 5) {
        setTimeAgo(`${seconds}s ago`);
      } else {
        setTimeAgo('just now');
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 1000);
    return () => clearInterval(interval);
  }, [lastSyncTime]);

  if (syncStatus === SYNC_STATUS.SAVING) {
    return (
      <div className="flex items-center space-x-2 text-gray-600 text-sm">
        <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        <span>Saving changes...</span>
      </div>
    );
  }

  if (syncStatus === SYNC_STATUS.ERROR) {
    return (
      <div className="flex items-center space-x-2 text-red-600 text-sm">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span>Failed to save</span>
      </div>
    );
  }

  if (pendingChanges.length > 0) {
    return (
      <div className="flex items-center space-x-2 text-orange-600 text-sm">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        <span>{pendingChanges.length} changes pending sync</span>
      </div>
    );
  }

  if (lastSyncTime && timeAgo) {
    return (
      <div className="flex items-center space-x-2 text-gray-500 text-sm">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span>Saved {timeAgo}</span>
      </div>
    );
  }

  return null;
};