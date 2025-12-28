import { create } from 'zustand';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  
  showToast: ({ type, title, message, duration = 4000 }) => {
    const id = Date.now();
    const notification = { id, type, title, message };
    
    set((state) => ({
      notifications: [...state.notifications, notification]
    }));

    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => {
        get().dismissToast(id);
      }, duration);
    }

    return id;
  },

  dismissToast: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },

  // Helper methods for common notification types
  addSuccess: (message, options = {}) => {
    return get().showToast({
      type: 'success',
      title: 'Success',
      message,
      duration: options.dismissTimer || 4000
    });
  },

  addError: (message, options = {}) => {
    return get().showToast({
      type: 'error',
      title: 'Error',
      message,
      duration: options.dismissTimer || 6000
    });
  },

  addWarning: (message, options = {}) => {
    return get().showToast({
      type: 'warning',
      title: 'Warning',
      message,
      duration: options.dismissTimer || 5000
    });
  },

  addLoading: (message) => {
    return get().showToast({
      type: 'loading',
      title: 'Loading',
      message,
      duration: 0 // Don't auto-dismiss loading notifications
    });
  },

  addInfo: (message, options = {}) => {
    return get().showToast({
      type: 'info',
      title: 'Info',
      message,
      duration: options.dismissTimer || 4000
    });
  },

  showConfirm: ({ title, message }) => {
    return new Promise((resolve) => {
      // Implement custom confirm dialog
      const confirmed = window.confirm(`${title}\n\n${message}`);
      resolve(confirmed);
    });
  }
}));