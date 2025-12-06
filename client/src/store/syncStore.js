import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useNotificationStore } from './notificationStore';
import api from '../api/axios';

// Sync status constants
export const SYNC_STATUS = {
  IDLE: 'idle',
  SAVING: 'saving',
  SAVED: 'saved',
  ERROR: 'error',
  OFFLINE_PENDING: 'offline_pending'
};

// Data change types for cross-tab communication
export const DATA_CHANGE_TYPES = {
  RFP_UPDATED: 'rfp_updated',
  RFP_CREATED: 'rfp_created',
  RFP_DELETED: 'rfp_deleted',
  RFP_STATUS_CHANGED: 'rfp_status_changed',
  VENDOR_UPDATED: 'vendor_updated',
  PROPOSAL_RECEIVED: 'proposal_received'
};

// Auto-save debounce delay (milliseconds)
const AUTO_SAVE_DELAY = 2000;

// Storage keys for offline data
const STORAGE_KEYS = {
  PENDING_CHANGES: 'sync_pending_changes',
  LAST_SYNC: 'sync_last_sync_time',
  RFPS_CACHE: 'sync_rfps_cache',
  VENDORS_CACHE: 'sync_vendors_cache',
  PROPOSALS_CACHE: 'sync_proposals_cache'
};

// Utility functions for localStorage
const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(`Failed to read ${key} from localStorage:`, e);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to save ${key} to localStorage:`, e);
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Failed to remove ${key} from localStorage:`, e);
    }
  }
};

export const useSyncStore = create(subscribeWithSelector((set, get) => ({
  // Core data state
  rfps: storage.get(STORAGE_KEYS.RFPS_CACHE, []),
  vendors: storage.get(STORAGE_KEYS.VENDORS_CACHE, []),
  proposals: storage.get(STORAGE_KEYS.PROPOSALS_CACHE, []),
  
  // Sync state
  syncStatus: SYNC_STATUS.IDLE,
  lastSyncTime: storage.get(STORAGE_KEYS.LAST_SYNC),
  pendingChanges: storage.get(STORAGE_KEYS.PENDING_CHANGES, []),
  isOnline: navigator.onLine,
  
  // Auto-save state
  autoSaveTimers: {},
  
  // Set online/offline status
  setOnlineStatus: (isOnline) => {
    const wasOffline = !get().isOnline;
    set({ isOnline });
    
    if (wasOffline && isOnline) {
      // Just came back online - sync pending changes
      get().syncPendingChanges();
    }
  },

  // Update sync status
  setSyncStatus: (status) => {
    set({ syncStatus: status });
    
    // Update last sync time if successfully saved
    if (status === SYNC_STATUS.SAVED) {
      const now = Date.now();
      set({ lastSyncTime: now });
      storage.set(STORAGE_KEYS.LAST_SYNC, now);
    }
  },

  // Add a pending change for offline sync
  addPendingChange: (changeType, data) => {
    const change = {
      id: Date.now() + Math.random(),
      type: changeType,
      data,
      timestamp: Date.now()
    };
    
    set(state => {
      const newPendingChanges = [...state.pendingChanges, change];
      storage.set(STORAGE_KEYS.PENDING_CHANGES, newPendingChanges);
      return { pendingChanges: newPendingChanges };
    });
    
    return change.id;
  },

  // Remove a pending change (after successful sync)
  removePendingChange: (changeId) => {
    set(state => {
      const newPendingChanges = state.pendingChanges.filter(c => c.id !== changeId);
      storage.set(STORAGE_KEYS.PENDING_CHANGES, newPendingChanges);
      return { pendingChanges: newPendingChanges };
    });
  },

  // Sync all pending changes
  syncPendingChanges: async () => {
    const { pendingChanges, isOnline } = get();
    
    if (!isOnline || pendingChanges.length === 0) return;
    
    const notifications = useNotificationStore.getState();
    
    notifications.addLoading(`Syncing ${pendingChanges.length} changes...`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const change of pendingChanges) {
      try {
        await get().applyChange(change);
        get().removePendingChange(change.id);
        successCount++;
      } catch (error) {
        console.error('Failed to sync change:', error);
        errorCount++;
      }
    }
    
    // Show sync results
    if (errorCount === 0) {
      notifications.addSuccess(`✓ All ${successCount} changes synced successfully`);
    } else {
      notifications.addWarning(`${successCount} synced, ${errorCount} failed. [Retry]`, {
        onRetry: () => get().syncPendingChanges()
      });
    }
  },

  // Apply a single change (helper for sync)
  applyChange: async (change) => {
    switch (change.type) {
      case DATA_CHANGE_TYPES.RFP_UPDATED:
        return await get().saveRfpToBackend(change.data);
      case DATA_CHANGE_TYPES.RFP_CREATED:
        return await get().createRfpInBackend(change.data);
      case DATA_CHANGE_TYPES.RFP_DELETED:
        return await get().deleteRfpFromBackend(change.data.id);
      default:
        throw new Error(`Unknown change type: ${change.type}`);
    }
  },

  // RFP operations
  updateRfp: (rfpId, updates) => {
    set(state => {
      const newRfps = state.rfps.map(rfp => 
        rfp._id === rfpId ? { ...rfp, ...updates } : rfp
      );
      storage.set(STORAGE_KEYS.RFPS_CACHE, newRfps);
      return { rfps: newRfps };
    });
    
    // Trigger auto-save
    get().scheduleAutoSave(rfpId, { _id: rfpId, ...updates });
    
    // Broadcast change to other tabs
    get().broadcastChange(DATA_CHANGE_TYPES.RFP_UPDATED, { _id: rfpId, ...updates });
  },

  // Schedule auto-save with debouncing
  scheduleAutoSave: (rfpId, data) => {
    const { autoSaveTimers } = get();
    
    // Clear existing timer for this RFP
    if (autoSaveTimers[rfpId]) {
      clearTimeout(autoSaveTimers[rfpId]);
    }
    
    // Set new timer
    const timerId = setTimeout(() => {
      get().performAutoSave(rfpId, data);
    }, AUTO_SAVE_DELAY);
    
    set(state => ({
      autoSaveTimers: {
        ...state.autoSaveTimers,
        [rfpId]: timerId
      }
    }));
  },

  // Perform the actual auto-save
  performAutoSave: async (rfpId, data) => {
    const { isOnline } = get();
    const notifications = useNotificationStore.getState();
    
    get().setSyncStatus(SYNC_STATUS.SAVING);
    
    try {
      if (isOnline) {
        await get().saveRfpToBackend(data);
        get().setSyncStatus(SYNC_STATUS.SAVED);
        notifications.addSuccess('✓ Changes saved', { dismissTimer: 2000 });
      } else {
        // Queue for later sync
        get().addPendingChange(DATA_CHANGE_TYPES.RFP_UPDATED, data);
        get().setSyncStatus(SYNC_STATUS.OFFLINE_PENDING);
        notifications.addWarning('Changes queued for sync when online');
      }
    } catch (error) {
      get().setSyncStatus(SYNC_STATUS.ERROR);
      notifications.addError('Failed to save changes', {
        actionButton: 'Retry',
        onAction: () => get().performAutoSave(rfpId, data)
      });
    }
    
    // Clear the timer
    set(state => {
      const newTimers = { ...state.autoSaveTimers };
      delete newTimers[rfpId];
      return { autoSaveTimers: newTimers };
    });
  },

  // Backend API calls
  saveRfpToBackend: async (rfpData) => {
    const response = await api.put(`/api/rfps/${rfpData._id}`, rfpData);
    return response.data;
  },

  createRfpInBackend: async (rfpData) => {
    const response = await api.post('/api/rfps', rfpData);
    return response.data;
  },

  deleteRfpFromBackend: async (rfpId) => {
    await api.delete(`/api/rfps/${rfpId}`);
  },

  fetchRfps: async () => {
    try {
      const response = await api.get('/api/rfps');
      const rfps = response.data;
      
      set({ rfps });
      storage.set(STORAGE_KEYS.RFPS_CACHE, rfps);
      
      return rfps;
    } catch (error) {
      const notifications = useNotificationStore.getState();
      notifications.addError('Failed to load RFPs');
      throw error;
    }
  },

  fetchVendors: async () => {
    try {
      const response = await api.get('/api/vendors');
      const vendors = response.data;
      
      set({ vendors });
      storage.set(STORAGE_KEYS.VENDORS_CACHE, vendors);
      
      return vendors;
    } catch (error) {
      const notifications = useNotificationStore.getState();
      notifications.addError('Failed to load vendors');
      throw error;
    }
  },

  // Cross-tab communication
  broadcastChange: (type, data) => {
    const message = { type, data, timestamp: Date.now() };
    localStorage.setItem('sync_broadcast', JSON.stringify(message));
    localStorage.removeItem('sync_broadcast'); // Trigger storage event
  },

  // Handle received broadcast from other tabs
  handleBroadcast: (message) => {
    const { type, data } = message;
    
    switch (type) {
      case DATA_CHANGE_TYPES.RFP_UPDATED:
        // Update RFP in current tab if it exists
        set(state => ({
          rfps: state.rfps.map(rfp => 
            rfp._id === data._id ? { ...rfp, ...data } : rfp
          )
        }));
        break;
        
      case DATA_CHANGE_TYPES.PROPOSAL_RECEIVED:
        const notifications = useNotificationStore.getState();
        notifications.addSuccess(`📬 New proposal from ${data.vendorName}`, {
          actionButton: 'View',
          onAction: () => {
            // Navigate to proposals page
            window.location.href = '/proposals';
          }
        });
        break;
    }
  },

  // Initialize the store
  initialize: async () => {
    // Set up cross-tab communication
    window.addEventListener('storage', (e) => {
      if (e.key === 'sync_broadcast' && e.newValue) {
        try {
          const message = JSON.parse(e.newValue);
          get().handleBroadcast(message);
        } catch (error) {
          console.error('Failed to parse broadcast message:', error);
        }
      }
    });

    // Set up online/offline listeners
    window.addEventListener('online', () => get().setOnlineStatus(true));
    window.addEventListener('offline', () => get().setOnlineStatus(false));

    // Periodic sync check (every 30 seconds)
    setInterval(() => {
      const { pendingChanges, isOnline } = get();
      if (isOnline && pendingChanges.length > 0) {
        get().syncPendingChanges();
      }
    }, 30000);

    // Initial data load
    try {
      await Promise.all([
        get().fetchRfps(),
        get().fetchVendors()
      ]);
    } catch (error) {
      console.error('Failed to initialize data:', error);
    }
  }
})));

// Auto-initialize when store is created
if (typeof window !== 'undefined') {
  useSyncStore.getState().initialize();
}