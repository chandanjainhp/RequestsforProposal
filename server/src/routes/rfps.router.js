// RFPs Routes - CRUD operations
// POST /api/rfps - save RFP
// GET /api/rfps - list RFPs
// GET /api/rfps/:id - get RFP
// PUT /api/rfps/:id - update RFP
// POST /api/rfps/:id/send - send RFP to vendors

import express from 'express';
import rfpsController from '../controllers/rfps.controller.js';

const router = express.Router();

// CRUD operations
router.post('/', rfpsController.saveRfp);
router.get('/', rfpsController.listRfps);
router.get('/:id', rfpsController.getRfp);
router.put('/:id', rfpsController.updateRfp);

// Send RFP to vendors
router.post('/:id/send', rfpsController.sendRfp);

export default router;
