const express = require('express');
const router = express.Router();
const {
  getBidSenseById,
  createBidSense,
  updateBidSense,
  deleteBidSense
} = require('../controllers/bidsenseController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validate');
const { body } = require('express-validator');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Validation rules
const bidSenseValidation = [
  body('title')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('budget')
    .isNumeric()
    .withMessage('Budget must be a number')
    .isFloat({ min: 0 })
    .withMessage('Budget must be positive')
];

// GET /api/bidsense/:id - Get BidSense by ID
router.get('/:id', getBidSenseById);

// POST /api/bidsense - Create new BidSense
router.post('/', bidSenseValidation, validate, createBidSense);

// PUT /api/bidsense/:id - Update BidSense
router.put('/:id', bidSenseValidation, validate, updateBidSense);

// DELETE /api/bidsense/:id - Delete BidSense
router.delete('/:id', deleteBidSense);

module.exports = router;