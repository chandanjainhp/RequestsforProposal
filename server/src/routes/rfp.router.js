// RFP Routes
// POST /api/rfp/parse — convert chat to structured RFP

import express from 'express';
import rfpController from '../controllers/rfp.controller.js';

const router = express.Router();

// Parse chat message into structured RFP
router.post('/parse', rfpController.parseRfp);

export default router;
