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
  const { title, description, budget } = req.body;

  // Additional validation
  if (budget < 0) {
    throw new ValidationError('Budget must be positive', [
      { field: 'budget', message: 'Budget cannot be negative', value: budget }
    ]);
  }

  try {
    const bidsense = await BidSense.create({
      title,
      description,
      budget,
      userId: req.user.id
    });

    logger.info(`BidSense created: ${bidsense._id} by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      data: bidsense
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