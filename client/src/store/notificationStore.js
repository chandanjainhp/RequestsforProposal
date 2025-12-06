import { create } from 'zustand';

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  LOADING: 'loading'
};

// Notification positions
export const NOTIFICATION_POSITIONS = {
  TOAST: 'toast',        // Top-right corner
  BANNER: 'banner',      // Top of page
  INLINE: 'inline',      // Next to fields
  MODAL: 'modal'         // Center overlay
};

// Auto-dismiss timings (milliseconds)
export const DISMISS_TIMERS = {
  QUICK: 3000,      // Simple confirmations
  STANDARD: 5000,   // Most messages
  IMPORTANT: 10000, // Messages with actions
  PERSISTENT: -1    // Manual dismiss only
};

let notificationId = 0;

export const useNotificationStore = create((set, get) => ({
  // State
  notifications: [],
  banners: [],
  isOffline: !navigator.onLine,
  
  // Confirmation dialog state
  confirmDialog: null,
  
  // Show confirmation dialog (returns promise)
  showConfirm: (options) => {
    return new Promise((resolve) => {
      set({
        confirmDialog: {
          title: options.title || 'Confirm',
          message: options.message || 'Are you sure?',
          confirmText: options.confirmText || 'Confirm',
          cancelText: options.cancelText || 'Cancel',
          type: options.type || 'warning', // 'warning', 'danger', 'info'
          onConfirm: () => {
            set({ confirmDialog: null });
            resolve(true);
          },
          onCancel: () => {
            set({ confirmDialog: null });
            resolve(false);
          }
        }
      });
    });
  },
  
  // Close confirmation dialog
  closeConfirm: () => {
    const dialog = get().confirmDialog;
    if (dialog?.onCancel) {
      dialog.onCancel();
    }
    set({ confirmDialog: null });
  },
  
  // Toast notifications (top-right corner)
  addToast: (message, type = NOTIFICATION_TYPES.INFO, options = {}) => {
    const id = ++notificationId;
    const notification = {
      id,
      message,
      type,
      position: NOTIFICATION_POSITIONS.TOAST,
      timestamp: Date.now(),
      dismissTimer: options.dismissTimer ?? DISMISS_TIMERS.STANDARD,
      actionButton: options.actionButton,
      onAction: options.onAction,
      ...options
    };

    set(state => {
      // Keep max 3 toast notifications
      let newNotifications = [...state.notifications, notification];
      if (newNotifications.length > 3) {
        newNotifications = newNotifications.slice(-3);
      }
      
      return { notifications: newNotifications };
    });

    // Auto-dismiss if timer is set
    if (notification.dismissTimer > 0) {
      setTimeout(() => {
        const store = get();
        store.dismissToast(id);
      }, notification.dismissTimer);
    }

    return id;
  },

  // Success toast helper
  addSuccess: (message, options = {}) => {
    return get().addToast(message, NOTIFICATION_TYPES.SUCCESS, {
      dismissTimer: DISMISS_TIMERS.QUICK,
      ...options
    });
  },

  // Error toast helper
  addError: (message, options = {}) => {
    return get().addToast(message, NOTIFICATION_TYPES.ERROR, {
      dismissTimer: DISMISS_TIMERS.IMPORTANT,
      actionButton: options.retry ? 'Retry' : undefined,
      onAction: options.onRetry,
      ...options
    });
  },

  // Warning toast helper
  addWarning: (message, options = {}) => {
    return get().addToast(message, NOTIFICATION_TYPES.WARNING, {
      dismissTimer: DISMISS_TIMERS.STANDARD,
      ...options
    });
  },

  // Loading toast helper
  addLoading: (message, options = {}) => {
    return get().addToast(message, NOTIFICATION_TYPES.LOADING, {
      dismissTimer: DISMISS_TIMERS.PERSISTENT,
      ...options
    });
  },

  // Dismiss specific toast
  dismissToast: (id) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },

  // Clear all toasts
  clearToasts: () => {
    set({ notifications: [] });
  },

  // Banner notifications (top of page)
  addBanner: (message, type = NOTIFICATION_TYPES.INFO, options = {}) => {
    const id = ++notificationId;
    const banner = {
      id,
      message,
      type,
      position: NOTIFICATION_POSITIONS.BANNER,
      timestamp: Date.now(),
      actionButton: options.actionButton,
      onAction: options.onAction,
      dismissible: options.dismissible !== false,
      ...options
    };

    set(state => ({
      banners: [...state.banners, banner]
    }));

    return id;
  },

  // Dismiss specific banner
  dismissBanner: (id) => {
    set(state => ({
      banners: state.banners.filter(b => b.id !== id)
    }));
  },

  // Clear all banners
  clearBanners: () => {
    set({ banners: [] });
  },

  // Update a notification (useful for changing loading to success/error)
  updateNotification: (id, updates) => {
    set(state => ({
      notifications: state.notifications.map(n => 
        n.id === id ? { ...n, ...updates } : n
      )
    }));
  },

  // Network status
  setOfflineStatus: (isOffline) => {
    const wasOffline = get().isOffline;
    
    set({ isOffline });
    
    if (wasOffline && !isOffline) {
      // Came back online
      get().dismissBanner('offline-banner');
      get().addSuccess('Back online. Syncing changes...');
    } else if (!wasOffline && isOffline) {
      // Went offline
      get().addBanner(
        '📡 You\'re offline. Changes will sync when reconnected.',
        NOTIFICATION_TYPES.WARNING,
        {
          id: 'offline-banner',
          dismissible: false
        }
      );
    }
  },

  // Batch notifications helper
  addBatch: (notifications) => {
    if (notifications.length === 0) return;
    
    if (notifications.length === 1) {
      return get().addToast(notifications[0].message, notifications[0].type);
    }
    
    // Group similar notifications
    const successCount = notifications.filter(n => n.type === NOTIFICATION_TYPES.SUCCESS).length;
    const errorCount = notifications.filter(n => n.type === NOTIFICATION_TYPES.ERROR).length;
    
    if (successCount > 1) {
      get().addSuccess(`${successCount} items processed successfully`);
    }
    if (errorCount > 1) {
      get().addError(`${errorCount} items failed to process`);
    }
    
    // Show individual notifications for single items
    notifications.forEach(n => {
      if ((n.type === NOTIFICATION_TYPES.SUCCESS && successCount === 1) ||
          (n.type === NOTIFICATION_TYPES.ERROR && errorCount === 1) ||
          (n.type !== NOTIFICATION_TYPES.SUCCESS && n.type !== NOTIFICATION_TYPES.ERROR)) {
        get().addToast(n.message, n.type);
      }
    });
  }
}));

// Initialize network status monitoring
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useNotificationStore.getState().setOfflineStatus(false);
  });

  window.addEventListener('offline', () => {
    useNotificationStore.getState().setOfflineStatus(true);
  });
}