import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { useNotificationStore } from '../store/notificationStore';

const CreateBidSenseForm = () => {
  const [formData, setFormData] = useState({ title: '', budget: '' });
  const { showToast } = useNotificationStore();

  const { loading, execute } = useApi(async (data) => {
    // Mock API call
    return { data };
  }, {
    successMessage: 'BidSense created successfully!',
    onError: (err) => {
      if (err.type === 'VALIDATION_ERROR' && err.errors) {
        // Handle validation errors
        err.errors.forEach(({ field, message }) => {
          showToast({
            type: 'error',
            title: `${field} Error`,
            message
          });
        });
      }
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await execute(formData);
      // Success - form will reset
      setFormData({ title: '', budget: '' });
    } catch (err) {
      // Error already handled by useApi hook
      console.log('Submit failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields */}
      <button
        type="submit"
        disabled={loading}
        className="bg-[#6D8196] text-[#FFFFE3] px-6 py-3 rounded-[10px] disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create BidSense'}
      </button>
    </form>
  );
};

export default CreateBidSenseForm;