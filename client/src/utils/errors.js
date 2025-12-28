export const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTHENTICATION_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  SERVER: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

export const ErrorMessages = {
  [ErrorTypes.NETWORK]: 'Unable to connect to the server. Please check your internet connection.',
  [ErrorTypes.VALIDATION]: 'Please check your input and try again.',
  [ErrorTypes.AUTHENTICATION]: 'Your session has expired. Please log in again.',
  [ErrorTypes.AUTHORIZATION]: 'You do not have permission to perform this action.',
  [ErrorTypes.NOT_FOUND]: 'The requested resource was not found.',
  [ErrorTypes.SERVER]: 'An error occurred on the server. Please try again later.',
  [ErrorTypes.UNKNOWN]: 'An unexpected error occurred. Please try again.'
};