import express from 'express';
import {
  listVendors,
  getVendor,
  createVendor,
  updateVendor,
  deleteVendor
} from '../controllers/vendor.controller.js';

const router = express.Router();

// GET /api/vendors - List all vendors
router.get('/', listVendors);

// POST /api/vendors - Create new vendor
router.post('/', createVendor);

// GET /api/vendors/:id - Get vendor by ID
router.get('/:id', getVendor);

// PUT /api/vendors/:id - Update vendor
router.put('/:id', updateVendor);

// DELETE /api/vendors/:id - Delete vendor (soft or hard)
router.delete('/:id', deleteVendor);

export default router;
