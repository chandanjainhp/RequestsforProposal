// Email Controller
// Handles inbound email processing and parsing

import { asyncHandler } from '../utils/asyncHandler.js';
import llmAdapter from '../adapters/llmAdapter.js';
import { scoreProposalWithGemini } from '../adapters/geminiScorer.js';
import Rfp from '../models/Rfp.js';
import Proposal from '../models/Proposal.js';
import Vendor from '../models/Vendor.js';
import ComparisonScore from '../models/ComparisonScore.js';
import Attachment from '../models/Attachment.js';
import logger from '../utils/logger.js';

/**
 * POST /api/emails/inbound
 * Process inbound email response to RFP
 * Handles: free-form text, tables, attachments (PDF/images via base64)
 * Now supports flexible email matching - not just reply tokens
 * Body: { 
 *   from: string, 
 *   subject: string, 
 *   body: string, 
 *   reply_token?: string,
 *   rfp_id?: string,  // Optional: explicitly specify which RFP
 *   attachments?: [{ filename: string, content_type: string, content: string (base64) }]
 * }
 * Response: { ok: true, proposal_id: "...", parsed_proposal: {...} }
 */
const processInboundEmail = async (req, res) => {
  const { from, subject, body, reply_token, rfp_id, attachments } = req.body;

  if (!from || !body) {
    return res.status(400).json({
      ok: false,
      error: 'from and body are required'
    });
  }

  try {
    let rfp = null;
    let matchMethod = 'unknown';

    // Method 1: Explicit RFP ID provided
    if (rfp_id) {
      rfp = await Rfp.findById(rfp_id);
      if (rfp) {
        matchMethod = 'explicit-rfp-id';
        logger.info(`RFP matched by explicit ID: ${rfp_id}`);
      }
    }

    // Method 2: Try reply token from body or subject
    if (!rfp) {
      let token = reply_token;
      if (!token) {
        const tokenMatch = subject?.match(/rfp\+([a-zA-Z0-9\-]+)@/) || body.match(/rfp\+([a-zA-Z0-9\-]+)@/);
        token = tokenMatch ? tokenMatch[1] : null;
      }
      if (token) {
        rfp = await Rfp.findOne({ reply_to_token: token });
        if (rfp) {
          matchMethod = 'reply-token';
          logger.info(`RFP matched by reply token: ${token}`);
        }
      }
    }

    // Method 3: Find vendor by email, then find most recent RFP sent to them
    if (!rfp) {
      const vendor = await Vendor.findOne({ contact_email: from });
      if (vendor) {
        // Find RFPs that were sent to this vendor (most recent first)
        const recentRfp = await Rfp.findOne({
          $or: [
            { sent_to_vendors: vendor._id },
            { 'vendor_emails': from }
          ],
          status: { $in: ['sent', 'active', 'pending_responses'] }
        }).sort({ sent_at: -1, createdAt: -1 });
        
        if (recentRfp) {
          rfp = recentRfp;
          matchMethod = 'vendor-email-match';
          logger.info(`RFP matched by vendor email: ${from} -> RFP: ${rfp._id}`);
        }
      }
    }

    // Method 4: Try to match RFP by subject line keywords
    if (!rfp && subject) {
      // Look for RFP title or reference number in subject
      const subjectLower = subject.toLowerCase();
      
      // Find RFPs with matching titles
      const potentialRfps = await Rfp.find({
        status: { $in: ['sent', 'active', 'pending_responses', 'draft'] }
      }).sort({ createdAt: -1 }).limit(20);
      
      for (const potentialRfp of potentialRfps) {
        const rfpTitle = (potentialRfp.title || '').toLowerCase();
        // Check if subject contains RFP title or vice versa
        if (rfpTitle && (subjectLower.includes(rfpTitle) || rfpTitle.includes(subjectLower.replace(/^re:\s*/i, '').trim()))) {
          rfp = potentialRfp;
          matchMethod = 'subject-match';
          logger.info(`RFP matched by subject: "${subject}" -> RFP: ${rfp._id}`);
          break;
        }
      }
    }

    // Method 5: Use AI to identify the RFP from email content
    if (!rfp) {
      const recentRfps = await Rfp.find({
        status: { $in: ['sent', 'active', 'pending_responses', 'draft'] }
      }).sort({ createdAt: -1 }).limit(10);
      
      if (recentRfps.length > 0) {
        // Use AI to match email to RFP
        const matchResult = await matchEmailToRfpWithAI(subject, body, recentRfps);
        if (matchResult && matchResult.rfp_id) {
          rfp = await Rfp.findById(matchResult.rfp_id);
          if (rfp) {
            matchMethod = 'ai-match';
            logger.info(`RFP matched by AI: confidence ${matchResult.confidence}% -> RFP: ${rfp._id}`);
          }
        }
      }
    }

    // Method 6: If still no match, use the most recent active RFP as fallback
    if (!rfp) {
      rfp = await Rfp.findOne({
        status: { $in: ['sent', 'active', 'pending_responses'] }
      }).sort({ sent_at: -1, createdAt: -1 });
      
      if (rfp) {
        matchMethod = 'fallback-recent';
        logger.info(`RFP matched by fallback (most recent): ${rfp._id}`);
      }
    }

    // If still no RFP found, return informative error
    if (!rfp) {
      return res.status(404).json({
        ok: false,
        error: 'Could not match email to any RFP. Please ensure an RFP has been created and sent.',
        suggestion: 'You can specify rfp_id in the request to explicitly link this email to an RFP.'
      });
    }

    // Find or create vendor by email
    let vendor = await Vendor.findOne({ contact_email: from });
    if (!vendor) {
      logger.info(`Vendor not found for email: ${from}, creating new vendor`);
      // Extract name from email or use email prefix
      const emailName = from.split('@')[0].replace(/[._-]/g, ' ');
      const formattedName = emailName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      vendor = new Vendor({
        name: formattedName,
        contact_email: from,
        status: 'new'
      });
      await vendor.save();
      logger.info(`New vendor created: ${vendor._id} - ${vendor.name}`);
    }

    // Combine email body with any attachment text
    let fullText = body;
    const savedAttachments = [];
    
    // Process attachments if present (PDF, images, etc.)
    if (attachments && Array.isArray(attachments) && attachments.length > 0) {
      console.log(`Processing ${attachments.length} attachments...`);
      
      for (const att of attachments) {
        try {
          // For text-based attachments, decode directly
          if (att.content_type?.includes('text')) {
            const textContent = Buffer.from(att.content, 'base64').toString('utf-8');
            fullText += '\n\n--- Attachment: ' + att.filename + ' ---\n' + textContent;
          }
          // For PDFs and images, use Gemini Vision to extract text
          else if (att.content_type?.includes('pdf') || att.content_type?.includes('image')) {
            const extractedText = await extractTextFromAttachment(att);
            if (extractedText) {
              fullText += '\n\n--- Attachment: ' + att.filename + ' ---\n' + extractedText;
            }
          }
          
          // Save attachment record
          const attachment = new Attachment({
            filename: att.filename,
            mime_type: att.content_type,
            ocr_text: att.extracted_text || null
          });
          await attachment.save();
          savedAttachments.push(attachment._id);
        } catch (attError) {
          console.error(`Error processing attachment ${att.filename}:`, attError.message);
        }
      }
    }

    // Parse proposal using AI-powered LLM (includes attachment content)
    const parseResult = await llmAdapter.parseProposal(fullText);
    
    console.log(`Proposal parsed with ${parseResult.ai_powered ? 'AI' : 'fallback'}, confidence: ${parseResult.parse_confidence}`);

    // Create proposal
    const proposal = new Proposal({
      rfp_id: rfp._id,
      vendor_id: vendor._id,
      raw_email: body,
      attachments: savedAttachments,
      parsed: parseResult.parsed_proposal,
      parse_confidence: parseResult.parse_confidence,
      ai_summary: parseResult.parsed_proposal.summary || 'Proposal parsed from email',
      mapping_method: matchMethod
    });

    await proposal.save();

    logger.info(`Proposal created: _id=${proposal._id}, RFP=${rfp._id}, Vendor=${vendor._id}, Method=${matchMethod}`);

    // Automatically score the proposal using AI
    try {
      const proposalForScoring = {
        vendor_name: vendor.name,
        total_price: parseResult.parsed_proposal.total_price,
        currency: parseResult.parsed_proposal.currency || 'USD',
        delivery_days: parseResult.parsed_proposal.delivery_days,
        warranty_months: parseResult.parsed_proposal.warranty_months,
        payment_terms: parseResult.parsed_proposal.payment_terms,
        technical_specs: parseResult.parsed_proposal.technical_specs,
        certifications: parseResult.parsed_proposal.certifications
      };
      
      const rfpForScoring = {
        budget: rfp.budget,
        currency: rfp.currency || 'USD',
        delivery_days: rfp.delivery_days,
        warranty_months: rfp.warranty_months,
        payment_terms: rfp.payment_terms
      };
      
      const scoreResult = await scoreProposalWithGemini(rfpForScoring, proposalForScoring);
      
      // Save comparison score
      await ComparisonScore.create({
        proposal_id: proposal._id,
        rfp_id: rfp._id,
        score: scoreResult.overall_score,
        breakdown: {
          price_score: scoreResult.price_score,
          delivery_score: scoreResult.delivery_score,
          warranty_score: scoreResult.warranty_score,
          completeness_score: scoreResult.completeness_score
        },
        reasoning: scoreResult.reasoning
      });
      
      logger.info(`Proposal scored: ${scoreResult.overall_score}/100`);
    } catch (scoreError) {
      logger.error(`Scoring failed: ${scoreError.message}`);
      // Continue without score - can be scored later
    }

    return res.status(201).json({
      ok: true,
      proposal_id: proposal._id.toString(),
      rfp_id: rfp._id.toString(),
      rfp_title: rfp.title,
      vendor_id: vendor._id.toString(),
      vendor_name: vendor.name,
      parsed_proposal: parseResult.parsed_proposal,
      parse_confidence: parseResult.parse_confidence,
      match_method: matchMethod,
      attachments_processed: savedAttachments.length
    });
  } catch (error) {
    console.error(`Inbound email processing error: ${error.message}`);
    return res.status(500).json({
      ok: false,
      error: 'Failed to process inbound email: ' + error.message
    });
  }
};

/**
 * Extract text from PDF/image attachments using Gemini Vision API
 * @param {Object} attachment - { filename, content_type, content (base64) }
 * @returns {string|null} Extracted text or null
 */
async function extractTextFromAttachment(attachment) {
  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Use Gemini Vision model for image/PDF understanding
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const prompt = `Extract ALL text and data from this document. 
If it's a proposal or quote, extract:
- Company name
- Prices, quantities, line items
- Delivery terms
- Warranty information
- Payment terms
- Any tables with data

Return the extracted text in a structured format.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: attachment.content_type,
          data: attachment.content
        }
      }
    ]);
    
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error(`Attachment extraction error: ${error.message}`);
    return null;
  }
}

/**
 * Use AI to match an inbound email to the correct RFP
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 * @param {Array} rfps - List of potential RFPs to match against
 * @returns {Object|null} { rfp_id, confidence, reasoning }
 */
async function matchEmailToRfpWithAI(subject, body, rfps) {
  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Create RFP summaries for matching
    const rfpSummaries = rfps.map((rfp, index) => ({
      index,
      id: rfp._id.toString(),
      title: rfp.title || 'Untitled',
      summary: rfp.summary || rfp.description || '',
      line_items: (rfp.line_items || []).slice(0, 5).join(', '),
      budget: rfp.budget,
      created: rfp.createdAt
    }));

    const prompt = `You are an AI assistant that matches vendor proposal emails to the correct RFP (Request for Proposal).

INBOUND EMAIL:
Subject: ${subject || '(no subject)'}
Body: ${body.substring(0, 2000)}${body.length > 2000 ? '...(truncated)' : ''}

AVAILABLE RFPs:
${rfpSummaries.map(r => `[${r.index}] ID: ${r.id}
    Title: ${r.title}
    Summary: ${r.summary.substring(0, 200)}
    Items: ${r.line_items}
    Budget: ${r.budget || 'Not specified'}
`).join('\n')}

TASK: Analyze the email content and determine which RFP it is most likely responding to.
Look for:
- References to items, products, or services mentioned in the RFPs
- Price quotes that match RFP requirements
- Keywords matching RFP titles or descriptions
- Any explicit RFP references

RESPOND IN JSON FORMAT ONLY:
{
  "matched_index": <number or null if no match>,
  "confidence": <0-100>,
  "reasoning": "<brief explanation>"
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      if (parsed.matched_index !== null && parsed.confidence >= 30) {
        const matchedRfp = rfpSummaries[parsed.matched_index];
        if (matchedRfp) {
          return {
            rfp_id: matchedRfp.id,
            confidence: parsed.confidence,
            reasoning: parsed.reasoning
          };
        }
      }
    }
    
    return null;
  } catch (error) {
    logger.error(`AI RFP matching failed: ${error.message}`);
    return null;
  }
}

export default {
  processInboundEmail
};