import { ErrorTypes, ErrorMessages } from './errors';

export const parseError = (error) => {
  // Network error
  if (!error.response) {
    return {
      type: ErrorTypes.NETWORK,
      message: ErrorMessages[ErrorTypes.NETWORK],
      originalError: error
    };
  }

  const { status, data } = error.response;

  // Map HTTP status to error type
  let errorType;
  switch (status) {
    case 400:
      errorType = ErrorTypes.VALIDATION;
      break;
    case 401:
      errorType = ErrorTypes.AUTHENTICATION;
      break;
    case 403:
      errorType = ErrorTypes.AUTHORIZATION;
      break;
    case 404:
      errorType = ErrorTypes.NOT_FOUND;
      break;
    case 500:
    case 502:
    case 503:
      errorType = ErrorTypes.SERVER;
      break;
    default:
      errorType = ErrorTypes.UNKNOWN;
  }

  return {
    type: errorType,
    message: data?.error?.message || ErrorMessages[errorType],
    code: data?.error?.code,
    errors: data?.error?.errors, // Validation errors
    statusCode: status,
    originalError: error
  };
};

export const handleError = (error, options = {}) => {
  const {
    showToast = true,
    logToConsole = true,
    onError = null
  } = options;

  const parsedError = parseError(error);

  // Log to console in development
  if (logToConsole && (typeof window !== 'undefined' ? window.location.hostname === 'localhost' : false)) {
    console.error('Error occurred:', parsedError);
  }

  // Show toast notification
  if (showToast) {
    // Use your toast library here
    // toast.error(parsedError.message);
  }

  // Custom error handler
  if (onError) {
    onError(parsedError);
  }

  return parsedError;
};