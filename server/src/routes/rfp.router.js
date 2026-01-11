// RFP Routes - All RFP operations consolidated
// POST /api/rfp/parse — convert chat to structured RFP
// POST /api/rfp - save RFP
// GET /api/rfp - list RFPs
// GET /api/rfp/:id - get RFP
// PUT /api/rfp/:id - update RFP
// POST /api/rfp/:id/send - send RFP to vendors

import express from 'express';
import rfpController from '../controllers/rfp.controller.js';
import rfpsController from '../controllers/rfps.controller.js';

const router = express.Router();

// Parse chat message into structured RFP (no auth required)
router.post('/parse', rfpController.parseRfp);

// CRUD operations - save, list, get, update
router.post('/', rfpsController.saveRfp);
router.get('/', rfpsController.listRfps);
router.get('/:id', rfpsController.getRfp);
router.put('/:id', rfpsController.updateRfp);

// Send RFP to vendors
router.post('/:id/send', rfpsController.sendRfp);

export default router;
