// Google Gemini AI Scorer for RFP Proposal Comparison
import logger from '../utils/logger.js';

/**
 * Score a proposal using Google Gemini AI
 * Evaluates price competitiveness, delivery capability, warranty coverage, and completeness
 */
export async function scoreProposalWithGemini(rfp, proposal) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_ENDPOINT = process.env.GEMINI_ENDPOINT;

  if (!GEMINI_API_KEY || !GEMINI_ENDPOINT) {
    console.warn('Gemini API not configured, using fallback scoring');
    return scoreProposalFallback(rfp, proposal);
  }

  try {
    const scoringPrompt = `You are a procurement expert evaluating vendor proposals for an RFP.

RFP Details:
- Budget: ${rfp.currency} ${rfp.budget?.toLocaleString() || 'Not specified'}
- Delivery Target: ${rfp.delivery_days || 'Not specified'} days
- Warranty Required: ${rfp.warranty_months || 'Not specified'} months
- Payment Terms: ${rfp.payment_terms || 'Not specified'}

Proposal Being Evaluated:
- Vendor: ${proposal.vendor_name}
- Total Price: ${proposal.currency} ${proposal.total_price?.toLocaleString() || 'Not specified'}
- Proposed Delivery: ${proposal.delivery_days || 'Not specified'} days
- Warranty Offered: ${proposal.warranty_months || 'Not specified'} months
- Payment Terms: ${proposal.payment_terms || 'Not specified'}
- Technical Specs: ${proposal.technical_specs || 'Not specified'}
- Certifications: ${proposal.certifications || 'None'}

Please evaluate this proposal and return ONLY valid JSON (no markdown, no extra text) with these exact fields:
{
  "price_score": <0-100 number - lower price relative to budget gets higher score>,
  "delivery_score": <0-100 number - faster delivery gets higher score>,
  "warranty_score": <0-100 number - longer warranty gets higher score>,
  "completeness_score": <0-100 number - presence of specs and certifications>,
  "overall_score": <0-100 number - weighted average: 50% price, 20% delivery, 10% warranty, 20% completeness>,
  "reasoning": "<brief summary of scoring rationale>"
}`;

    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: scoringPrompt
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      logger.error(`Gemini API Error: ${JSON.stringify(error)}`);
      return scoreProposalFallback(rfp, proposal);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      console.warn('No candidates in Gemini response');
      return scoreProposalFallback(rfp, proposal);
    }

    const responseText = data.candidates[0].content.parts[0].text;
    
    // Parse JSON from response (may contain markdown code blocks)
    let jsonStr = responseText;
    const jsonMatch = responseText.match(/```json\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    } else {
      // Try to find JSON object directly
      const objectMatch = responseText.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        jsonStr = objectMatch[0];
      }
    }

    const scores = JSON.parse(jsonStr);
    
    logger.info(`✅ Gemini scored ${proposal.vendor_name}: ${scores.overall_score}/100`);
    
    return {
      price_score: Math.min(100, Math.max(0, scores.price_score || 0)),
      delivery_score: Math.min(100, Math.max(0, scores.delivery_score || 0)),
      warranty_score: Math.min(100, Math.max(0, scores.warranty_score || 0)),
      completeness_score: Math.min(100, Math.max(0, scores.completeness_score || 0)),
      overall_score: Math.min(100, Math.max(0, scores.overall_score || 0)),
      reasoning: scores.reasoning || 'AI evaluation completed'
    };

  } catch (error) {
    logger.error(`Gemini scoring error: ${error.message}`);
    return scoreProposalFallback(rfp, proposal);
  }
}

/**
 * Fallback scoring when Gemini API fails or is not configured
 * Uses deterministic calculation based on RFP and proposal metrics
 */
function scoreProposalFallback(rfp, proposal) {
  // Price score: lower is better, compared to budget
  const priceDiff = Math.abs((rfp.budget || 0) - (proposal.total_price || 0));
  const budgetRef = rfp.budget || proposal.total_price || 1;
  const priceScore = Math.max(0, 100 - (priceDiff / budgetRef) * 100);

  // Delivery score: faster is better, but 30-40 days is acceptable
  const targetDays = rfp.delivery_days || 30;
  const proposedDays = proposal.delivery_days || targetDays + 10;
  const daysDiff = Math.abs(targetDays - proposedDays);
  const deliveryScore = Math.max(0, 100 - (daysDiff / 60) * 100);

  // Warranty score: longer is better, 12 months is baseline
  const targetWarranty = rfp.warranty_months || 12;
  const proposedWarranty = proposal.warranty_months || 6;
  const warrantyScore = Math.min(100, (proposedWarranty / Math.max(targetWarranty, 24)) * 100);

  // Completeness score: check for presence of specs and certifications
  const hasSpecs = !!(proposal.technical_specs && proposal.technical_specs.length > 0);
  const hasCerts = !!(proposal.certifications && proposal.certifications.length > 0);
  const completenessScore = (hasSpecs ? 50 : 0) + (hasCerts ? 50 : 0);

  // Weighted overall score
  const overallScore =
    (priceScore * 0.5) +
    (deliveryScore * 0.2) +
    (warrantyScore * 0.1) +
    (completenessScore * 0.2);

  return {
    price_score: Math.round(priceScore),
    delivery_score: Math.round(deliveryScore),
    warranty_score: Math.round(warrantyScore),
    completeness_score: Math.round(completenessScore),
    overall_score: Math.round(overallScore),
    reasoning: `Price: ${Math.round(priceScore)}%, Delivery: ${Math.round(deliveryScore)}%, Warranty: ${Math.round(warrantyScore)}%, Completeness: ${Math.round(completenessScore)}%`
  };
}

export default {
  scoreProposalWithGemini,
  scoreProposalFallback
};
