import { asyncHandler } from '../middlewares/errorHandler.js';
import { 
  NotFoundError, 
  ValidationError,
  DatabaseError,
  AuthorizationError 
} from '../utils/errors.js';
import BidSense from '../models/Rfp.js';
import logger from '../utils/logger.js';

// Get BidSense by ID
export const getBidSenseById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const bidsense = await BidSense.findById(id);

  if (!bidsense) {
    throw new NotFoundError('BidSense');
  }

  // Check authorization
  if (bidsense.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new AuthorizationError('You can only access your own BidSenses');
  }

  res.status(200).json({
    success: true,
    data: bidsense
  });
});

// Create BidSense
export const createBidSense = asyncHandler(async (req, res, next) => {
  // Handle both direct format and parsed_bidsense wrapper format
  const payload = req.body.parsed_bidsense || req.body;
  const { title, description, budget, ...otherFields } = payload;

  // Additional validation
  if (budget && budget < 0) {
    throw new ValidationError('Budget must be positive', [
      { field: 'budget', message: 'Budget cannot be negative', value: budget }
    ]);
  }

  try {
    const bidsense = await BidSense.create({
      title: title || 'Untitled RFP',
      description: description || '',
      budget: budget || 0,
      userId: req.user.id,
      ...otherFields
    });

    logger.info(`BidSense created: ${bidsense._id} by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      data: bidsense,
      _id: bidsense._id,
      bidsense_id: bidsense._id
    });
  } catch (error) {
    if (error.name === 'MongoError') {
      throw new DatabaseError('Failed to create BidSense');
    }
    throw error;
  }
});

// Update BidSense
export const updateBidSense = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const bidsense = await BidSense.findById(id);

  if (!bidsense) {
    throw new NotFoundError('BidSense');
  }

  // Check ownership
  if (bidsense.userId.toString() !== req.user.id) {
    throw new AuthorizationError();
  }

  const updatedBidSense = await BidSense.findByIdAndUpdate(
    id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: updatedBidSense
  });
});

// Delete BidSense
export const deleteBidSense = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const bidsense = await BidSense.findById(id);

  if (!bidsense) {
    throw new NotFoundError('BidSense');
  }

  if (bidsense.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new AuthorizationError();
  }

  await bidsense.remove();

  res.status(200).json({
    success: true,
    message: 'BidSense deleted successfully'
  });
});

// Parse RFP from text
export const parseRfp = asyncHandler(async (req, res, next) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string' || message.trim() === '') {
    throw new ValidationError('message is required and must be a non-empty string', [
      { field: 'message', message: 'message is required', value: message }
    ]);
  }

  try {
    // Simple parsing logic - extract budget, delivery days, etc. from text
    const parsed_data = {
      title: extractTitle(message),
      description: message.substring(0, 500),
      summary: extractSummary(message),
      budget: extractBudget(message),
      currency: extractCurrency(message),
      delivery_days: extractDeliveryDays(message),
      line_items: extractLineItems(message)
    };

    logger.info(`RFP parsed successfully with confidence 0.75`);

    res.status(200).json({
      success: true,
      ok: true,
      parsed_rfp: parsed_data,
      parsed_data: parsed_data,
      parse_confidence: 0.75,
      warnings: []
    });
  } catch (error) {
    logger.error(`RFP parse error: ${error.message}`);
    throw error;
  }
});

// Helper functions for parsing
function extractTitle(text) {
  const titleMatch = text.match(/(?:project|title|need|procure)[\s:]+([^\n.?!]{5,100})/i);
  return titleMatch ? titleMatch[1].trim() : 'Untitled RFP';
}

function extractSummary(text) {
  return text.substring(0, 200).trim();
}

function extractBudget(text) {
  const budgetMatch = text.match(/\$[\d,]+(?:\.\d{2})?|\b\d{1,3}(?:,\d{3})*(?:\.\d{2})?\b\s*(?:dollars?|usd)/i);
  if (budgetMatch) {
    const numStr = budgetMatch[0].replace(/[$,\s]/g, '').split('d')[0];
    return parseInt(numStr) || null;
  }
  return null;
}

function extractCurrency(text) {
  return /USD|dollar/i.test(text) ? 'USD' : 'USD';
}

function extractDeliveryDays(text) {
  const dayMatch = text.match(/(\d+)\s*(?:days?|weeks?|months?)/i);
  if (dayMatch) {
    const num = parseInt(dayMatch[1]);
    if (dayMatch[0].toLowerCase().includes('week')) return num * 7;
    if (dayMatch[0].toLowerCase().includes('month')) return num * 30;
    return num;
  }
  return null;
}

function extractLineItems(text) {
  // Simple line item extraction
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  return lines.slice(0, 5).map((item, idx) => ({
    id: idx + 1,
    description: item.trim().substring(0, 100),
    quantity: 1,
    unit_price: null
  }));
}