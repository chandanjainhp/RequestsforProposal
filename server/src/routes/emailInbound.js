import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Proposal from '../models/Proposal.js';
import Attachment from '../models/Attachment.js';
import Vendor from '../models/Vendor.js';
import Rfp from '../models/Rfp.js';
import parseQueue from '../queues/parseQueue.js';
import storageAdapter from '../adapters/storageAdapter.js';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');
const upload = multer({ dest: UPLOAD_DIR });

// Support both form-data and JSON
router.post('/inbound', (req, res, next) => {
  // If JSON, pass through; if form-data, use multer
  if (req.is('application/json')) {
    return next();
  }
  upload.array('attachments')(req, res, next);
}, async (req, res) => {
  try {
    const { from, to, 'envelope-to': envelopeTo, reply_to, subject, text, body } = req.body;
    const emailBody = text || body || '';
    
    // Extract RFP mapping using enhanced logic
    const rfpMapping = await mapRfpFromEmail({
      from, to, envelopeTo, reply_to, subject
    });

    let vendor = await Vendor.findOne({ contact_email: new RegExp(from, 'i') });
    if (!vendor) {
      vendor = await Vendor.create({ name: from, contact_email: from });
    }

    const proposal = await Proposal.create({
      rfp_id: rfpMapping.rfp_id, // Can be null if unmapped
      vendor_id: vendor._id,
      raw_email: emailBody,
      unmapped: !rfpMapping.rfp_id,
      mapping_method: rfpMapping.method // 'reply-to-token' | 'rfp-id' | 'subject' | 'none'
    });

    if (req.files) {
      for (const file of req.files) {
        const storageUrl = storageAdapter.uploadLocal(file.path);
        await Attachment.create({
          proposal_id: proposal._id,
          filename: file.originalname,
          mime_type: file.mimetype,
          storage_url: storageUrl
        });
      }
    }

    // Queue parsing job
    await parseQueue.add('parse', { proposalId: proposal._id });

    logger.info(`Email inbound: proposal=${proposal._id}, rfp=${rfpMapping.rfp_id}, method=${rfpMapping.method}`);

    res.json({ ok: true, proposal_id: proposal._id, rfp_id: rfpMapping.rfp_id, mapped: !!rfpMapping.rfp_id });
  } catch (err) {
    logger.error('Email inbound error', err);
    res.status(500).json({ ok: false, error: 'Internal error' });
  }
});

/**
 * Map RFP from email headers using multiple strategies
 * Order: reply-to-token > RFP ID extract > subject parsing > none
 */
async function mapRfpFromEmail({ from, to, envelopeTo, reply_to, subject }) {
  let rfp_id = null;
  let method = 'none';

  // Strategy 1: Extract reply-to token from envelope-to or reply-to header
  // Format: rfp+<token>@domain
  if (envelopeTo || reply_to) {
    const tokenMatch = (envelopeTo || reply_to).match(/rfp\+([a-zA-Z0-9\-]+)@/i);
    if (tokenMatch) {
      const token = tokenMatch[1];
      const foundRfp = await Rfp.findOne({ reply_to_token: token });
      if (foundRfp) {
        rfp_id = foundRfp._id;
        method = 'reply-to-token';
        logger.debug(`[MAP] Found RFP by reply-to-token: ${token} -> ${rfp_id}`);
        return { rfp_id, method };
      }
    }
  }

  // Strategy 2: Extract RFP ID from subject line
  // Format: RFP-ID: <24-char-mongodb-id> or RFP-ID[:\s]*<id>
  if (subject) {
    const idMatch = subject.match(/RFP[-_ ]?ID[:\s]*([0-9a-fA-F]{24})/i);
    if (idMatch) {
      rfp_id = idMatch[1];
      method = 'rfp-id-subject';
      logger.debug(`[MAP] Found RFP by subject ID: ${rfp_id}`);
      return { rfp_id, method };
    }
  }

  // Strategy 3: Check 'to' field for token (fallback)
  if (to) {
    const tokenMatch = to.match(/rfp\+([a-zA-Z0-9\-]+)@/i);
    if (tokenMatch) {
      const token = tokenMatch[1];
      const foundRfp = await Rfp.findOne({ reply_to_token: token });
      if (foundRfp) {
        rfp_id = foundRfp._id;
        method = 'reply-to-token-to';
        logger.debug(`[MAP] Found RFP by token in To field: ${token} -> ${rfp_id}`);
        return { rfp_id, method };
      }
    }
  }

  logger.warn(`[MAP] No RFP mapping found for email from ${from}`);
  return { rfp_id: null, method: 'none' };
}

export default router;
