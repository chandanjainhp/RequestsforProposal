import React, { useEffect, useRef, useState } from 'react';
import { Save, Save as SaveIcon, AlertCircle } from 'lucide-react';
import { useNotificationStore } from '../store/notificationStore';

const AutoSave = ({ 
  data, 
  onSave, 
  interval = 30000, 
  debounce = 2000,
  isSaving: externalSaving = false 
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const saveTimeoutRef = useRef(null);
  const lastDataRef = useRef(data);
  const { showToast } = useNotificationStore();

  // Debounced save function
  const debouncedSave = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      if (!hasChanges || externalSaving) return;

      setIsSaving(true);
      setHasChanges(false);

      try {
        await onSave(data);
        setLastSaved(new Date());
        showToast({
          type: 'success',
          title: 'Auto-saved',
          message: 'Your changes have been saved.',
          duration: 2000
        });
      } catch (error) {
        console.error('Auto-save failed:', error);
        showToast({
          type: 'error',
          title: 'Save Failed',
          message: 'Failed to auto-save. Please save manually.',
          duration: 5000
        });
        setHasChanges(true); // Mark as unsaved on failure
      } finally {
        setIsSaving(false);
      }
    }, debounce);
  };

  // Regular interval save
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (hasChanges && !isSaving && !externalSaving) {
        debouncedSave();
      }
    }, interval);

    return () => clearInterval(intervalId);
  }, [hasChanges, isSaving, externalSaving, interval]);

  // Watch for data changes
  useEffect(() => {
    if (JSON.stringify(data) !== JSON.stringify(lastDataRef.current)) {
      setHasChanges(true);
      lastDataRef.current = data;
      debouncedSave();
    }
  }, [data, debouncedSave]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleManualSave = async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setIsSaving(true);
    setHasChanges(false);

    try {
      await onSave(data);
      setLastSaved(new Date());
      showToast({
        type: 'success',
        title: 'Saved',
        message: 'Your changes have been saved successfully.',
        duration: 3000
      });
    } catch (error) {
      console.error('Manual save failed:', error);
      showToast({
        type: 'error',
        title: 'Save Failed',
        message: 'Failed to save. Please try again.',
        duration: 5000
      });
      setHasChanges(true); // Mark as unsaved on failure
    } finally {
      setIsSaving(false);
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex items-center space-x-3 text-sm text-[#6D8196]">
      {/* Status Indicator */}
      <div className="flex items-center space-x-2">
        {isSaving || externalSaving ? (
          <div className="flex items-center space-x-2 text-[#6D8196]">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#6D8196] border-t-transparent"></div>
            <span>Saving...</span>
          </div>
        ) : hasChanges ? (
          <div className="flex items-center space-x-2 text-yellow-600">
            <AlertCircle size={16} />
            <span>Unsaved changes</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-green-600">
            <SaveIcon size={16} />
            <span>Saved</span>
          </div>
        )}
      </div>

      {/* Last Saved Time */}
      {lastSaved && (
        <span className="text-xs text-[#6D8196]">
          Last saved: {formatTime(lastSaved)}
        </span>
      )}

      {/* Manual Save Button */}
      <button
        onClick={handleManualSave}
        disabled={isSaving || externalSaving}
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-[10px] text-sm font-[560] transition-all ${
          isSaving || externalSaving
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-[#6D8196] text-[#FFFFE3] hover:bg-[#5A6B7F] hover:scale-[1.02]'
        }`}
      >
        <Save size={16} />
        <span>{isSaving || externalSaving ? 'Saving...' : 'Save Now'}</span>
      </button>
    </div>
  );
};

export default AutoSave;