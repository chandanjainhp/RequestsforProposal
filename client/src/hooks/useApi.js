import { useState, useCallback } from 'react';
import { handleError } from '../utils/errorHandler';
import { useNotificationStore } from '../store/notificationStore';

export const useApi = (apiFunc, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useNotificationStore();

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFunc(...args);
      setData(response.data);

      if (options.successMessage) {
        showToast({
          type: 'success',
          title: 'Success',
          message: options.successMessage
        });
      }

      return response.data;
    } catch (err) {
      const parsedError = handleError(err, {
        showToast: options.showErrorToast !== false,
        logToConsole: true
      });

      setError(parsedError);

      if (options.onError) {
        options.onError(parsedError);
      }

      throw parsedError;
    } finally {
      setLoading(false);
    }
  }, [apiFunc, options, showToast]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
};