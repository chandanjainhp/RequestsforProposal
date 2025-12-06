// RFPs Controller - CRUD operations for RFP documents
// POST /api/rfps - save RFP
// GET /api/rfps - list RFPs
// GET /api/rfps/:id - get RFP
// PUT /api/rfps/:id - update RFP
// POST /api/rfps/:id/send - send RFP to vendors

import { asyncHandler } from '../utils/asyncHandler.js';
import Rfp from '../models/Rfp.js';
import Vendor from '../models/Vendor.js';
import emailAdapter from '../adapters/emailAdapter.js';
import logger from '../utils/logger.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * POST /api/rfps
 * Save a parsed RFP to database
 * Body: { parsed_rfp: {...}, raw_text?: string }
 * Response: { ok: true, rfp_id: "...", reply_to_token: "..." }
 */
const saveRfp = asyncHandler(async (req, res) => {
  const { parsed_rfp, raw_text } = req.body;

  if (!parsed_rfp || typeof parsed_rfp !== 'object') {
    return res.status(400).json({
      ok: false,
      error: 'parsed_rfp is required and must be an object'
    });
  }

  try {
    // Generate reply-to token (short UUID)
    const reply_to_token = uuidv4().substring(0, 12);

    // Create RFP document
    const rfp = new Rfp({
      title: parsed_rfp.title,
      description: parsed_rfp.description || parsed_rfp.summary,
      summary: parsed_rfp.summary || parsed_rfp.description,
      budget: parsed_rfp.budget,
      currency: parsed_rfp.currency || 'USD',
      delivery_days: parsed_rfp.delivery_days,
      delivery_date: parsed_rfp.delivery_date,
      payment_terms: parsed_rfp.payment_terms,
      warranty_months: parsed_rfp.warranty_months,
      line_items: parsed_rfp.line_items || [],
      raw_text: raw_text || JSON.stringify(parsed_rfp),
      reply_to_token,
      status: 'draft',
      parsed_by: 'llm-v1'
    });

    await rfp.save();

    logger.info(`RFP saved: _id=${rfp._id}, token=${reply_to_token}, status=draft`);

    return res.status(201).json({
      ok: true,
      _id: rfp._id.toString(),
      rfp_id: rfp._id.toString(),
      reply_to_token,
      status: 'draft'
    });
  } catch (error) {
    logger.error(`RFP save error: ${error.message}`);
    return res.status(500).json({
      ok: false,
      error: 'Failed to save RFP: ' + error.message
    });
  }
});

/**
 * GET /api/rfps
 * List all RFPs with optional filtering
 * Query params: status=draft|sent|closed, limit=10, skip=0
 */
const listRfps = asyncHandler(async (req, res) => {
  try {
    const { status, limit = 10, skip = 0 } = req.query;
    const filter = {};
    
    if (status) {
      filter.status = status;
    }

    const rfps = await Rfp.find(filter)
      .sort({ created_at: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .lean();

    const total = await Rfp.countDocuments(filter);

    return res.status(200).json({
      ok: true,
      rfps,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });
  } catch (error) {
    logger.error(`RFP list error: ${error.message}`);
    return res.status(500).json({
      ok: false,
      error: 'Failed to list RFPs: ' + error.message
    });
  }
});

/**
 * GET /api/rfps/:id
 * Get a single RFP by ID
 */
const getRfp = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const rfp = await Rfp.findById(id);

    if (!rfp) {
      return res.status(404).json({
        ok: false,
        error: 'RFP not found'
      });
    }

    return res.status(200).json({
      ok: true,
      rfp
    });
  } catch (error) {
    logger.error(`RFP get error: ${error.message}`);
    return res.status(500).json({
      ok: false,
      error: 'Failed to get RFP: ' + error.message
    });
  }
});

/**
 * PUT /api/rfps/:id
 * Update an RFP (only if status is 'draft')
 * Body: { title?, description?, budget?, ... }
 */
const updateRfp = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const rfp = await Rfp.findById(id);

    if (!rfp) {
      return res.status(404).json({
        ok: false,
        error: 'RFP not found'
      });
    }

    if (rfp.status !== 'draft') {
      return res.status(400).json({
        ok: false,
        error: `Cannot update RFP with status '${rfp.status}'`
      });
    }

    // Allowed fields to update
    const allowedFields = [
      'title', 'description', 'summary', 'budget', 'currency',
      'delivery_days', 'delivery_date', 'payment_terms',
      'warranty_months', 'line_items', 'raw_text'
    ];

    for (const field of allowedFields) {
      if (updateData.hasOwnProperty(field)) {
        rfp[field] = updateData[field];
      }
    }

    await rfp.save();

    logger.info(`RFP updated: _id=${rfp._id}`);

    return res.status(200).json({
      ok: true,
      rfp_id: rfp._id.toString(),
      status: rfp.status
    });
  } catch (error) {
    logger.error(`RFP update error: ${error.message}`);
    return res.status(500).json({
      ok: false,
      error: 'Failed to update RFP: ' + error.message
    });
  }
});

/**
 * POST /api/rfps/:id/send
 * Send RFP to one or more vendors
 * Body: { vendorIds: ["id1", "id2", ...] }
 * Response: { ok: true, sent_count: 2, results: [{vendor_id, vendor_email, success}...] }
 */
const sendRfp = async (req, res) => {
  try {
    const { id } = req.params;
    const { vendorIds } = req.body;

    if (!vendorIds || !Array.isArray(vendorIds) || vendorIds.length === 0) {
      return res.status(400).json({
        ok: false,
        error: 'vendorIds is required and must be a non-empty array'
      });
    }

    // Get RFP
    const rfp = await Rfp.findById(id);
    if (!rfp) {
      return res.status(404).json({
        ok: false,
        error: 'RFP not found'
      });
    }

    // Get vendors
    const vendors = await Vendor.find({ _id: { $in: vendorIds } });
    if (vendors.length === 0) {
      return res.status(400).json({
        ok: false,
        error: 'No valid vendors found'
      });
    }

    // Send emails
    let results;
    try {
      results = await emailAdapter.sendRfpBatch(rfp, vendors, rfp.reply_to_token);
    } catch (emailError) {
      logger.error(`Email send error: ${emailError.message}`);
      // Continue even if email fails, mark as sent in DB
      results = vendors.map(v => ({ vendor_id: v._id, vendor_email: v.contact_email, success: false, error: emailError.message }));
    }

    // Update RFP status and track vendors
    rfp.status = 'sent';
    rfp.sent_at = new Date();
    rfp.sent_to_vendors = vendors.map(v => v._id);
    rfp.vendor_emails = vendors.map(v => v.contact_email);
    await rfp.save();

    logger.info(`RFP sent: _id=${rfp._id}, vendors=${vendors.length}, status=sent`);

    const successCount = results.filter(r => r.success).length;

    return res.status(200).json({
      ok: true,
      rfp_id: rfp._id.toString(),
      sent_count: successCount,
      total: results.length,
      status: 'sent',
      results
    });
  } catch (error) {
    logger.error(`RFP send error: ${error.message}`);
    return res.status(500).json({
      ok: false,
      error: 'Failed to send RFP: ' + error.message
    });
  }
};

export default {
  saveRfp,
  listRfps,
  getRfp,
  updateRfp,
  sendRfp
};
