// RFP Controller
// Handles parsing and creation of RFPs from chat text

import { asyncHandler } from '../utils/asyncHandler.js';
import llmAdapter from '../adapters/llmAdapter.js';
import validator from '../utils/validator.js';
import logger from '../utils/logger.js';

/**
 * POST /api/rfp/parse
 * Convert chat message to structured RFP
 * Body: { message: string }
 * Response: { parsed_rfp: {...}, parse_confidence: number, warnings: [...] }
 */
const parseRfp = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({
      ok: false,
      error: 'message is required and must be a non-empty string'
    });
  }

  try {
    // Parse using LLM adapter
    const result = llmAdapter.parseRfp(message);
    
    // Validate parsed RFP structure
    const validation = validator.validateRfp(result.parsed_rfp);
    
    if (!validation.valid) {
      logger.warn(`RFP validation errors: ${validation.errors.join('; ')}`);
      // Don't reject, but add warnings
      result.warnings.push(...validation.errors.slice(0, 3)); // Limit to 3 warnings
    }

    logger.info(`RFP parsed: confidence=${result.parse_confidence}, fields=${Object.values(result.parsed_rfp).filter(v => v !== null).length}`);

    return res.status(200).json({
      ok: true,
      parsed_rfp: result.parsed_rfp,
      parse_confidence: result.parse_confidence,
      warnings: result.warnings
    });
  } catch (error) {
    logger.error(`RFP parse error: ${error.message}`);
    return res.status(500).json({
      ok: false,
      error: 'Failed to parse RFP: ' + error.message
    });
  }
});

export default {
  parseRfp
};
