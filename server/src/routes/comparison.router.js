import express from 'express';
import { compareProposals, compareProposalsDetailed } from '../controllers/comparison.controller.js';

const router = express.Router();

// GET /api/rfps/:id/compare - Get all proposals with scores and recommendation
router.get('/rfps/:id/compare', compareProposals);

// GET /api/rfps/:id/compare/details - Get detailed breakdown for comparison
router.get('/rfps/:id/compare/details', compareProposalsDetailed);

export default router;
