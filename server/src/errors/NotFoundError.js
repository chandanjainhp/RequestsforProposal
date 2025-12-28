import { AppError } from './AppError.js';
import { ERROR_CODES } from './errorCodes.js';

/**
 * Not Found Error - 404 Not Found
 * 
 * Used when requested resource doesn't exist.
 * Includes resource type and ID for logging.
 * 
 * @class NotFoundError
 * @extends AppError
 * 
 * @example
 * throw new NotFoundError('User not found', 'User', userId);
 * throw new NotFoundError('RFP not found', 'RFP', rfpId);
 */
export class NotFoundError extends AppError {
  /**
   * Creates a NotFoundError
   * 
   * @param {string} message - Error message
   * @param {string} resourceType - Type of resource (e.g., 'User', 'RFP', 'Vendor')
   * @param {string|number} resourceId - ID of the resource (optional)
   */
  constructor(message = 'Resource not found', resourceType = null, resourceId = null) {
    super(404, message, ERROR_CODES.NOT_FOUND);
    this.name = 'NotFoundError';
    
    // Include resource info in details for logging
    if (resourceType) {
      this.details = { resource_type: resourceType };
      if (resourceId !== null && resourceId !== undefined) {
        this.details.resource_id = resourceId;
      }
    }
  }
}
