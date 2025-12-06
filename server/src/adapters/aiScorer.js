import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../utils/logger.js';

// Use unified Gemini API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Score a vendor proposal using Google Gemini AI
 * Analyzes price competitiveness, delivery capability, warranty coverage, and completeness
 */
export async function scoreProposalWithAI(rfp, proposal) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are an expert procurement analyst. Score this vendor proposal for an RFP.

RFP Details:
- Title: ${rfp.title}
- Budget: ${rfp.currency} ${rfp.budget?.toLocaleString()}
- Required Delivery: ${rfp.delivery_days} days
- Warranty Required: ${rfp.warranty_months} months
- Payment Terms: ${rfp.payment_terms}

Vendor Proposal:
- Vendor: ${proposal.vendor_name}
- Price: ${proposal.currency} ${proposal.total_price?.toLocaleString()}
- Delivery Timeline: ${proposal.delivery_days} days
- Warranty Offered: ${proposal.warranty_months} months
- Payment Terms: ${proposal.payment_terms}
- Items: ${proposal.items_included} units
- Specs: ${proposal.technical_specs}
- Certifications: ${proposal.certifications}

Score this proposal on a 0-100 scale considering:
1. Price Competitiveness (50% weight): How well does the price align with budget?
2. Delivery Capability (20% weight): Can they deliver on time?
3. Warranty Coverage (10% weight): Is warranty adequate?
4. Completeness (20% weight): Are all requirements met?

Respond with ONLY a JSON object (no markdown, no extra text):
{
  "price_score": <0-100>,
  "delivery_score": <0-100>,
  "warranty_score": <0-100>,
  "completeness_score": <0-100>,
  "final_score": <0-100>,
  "strengths": "<list key strengths>",
  "weaknesses": "<list key weaknesses>",
  "recommendation": "<brief recommendation>"
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      logger.error('Could not extract JSON from AI response:', responseText);
      throw new Error('Invalid AI response format');
    }

    const scores = JSON.parse(jsonMatch[0]);
    
    logger.info(`✅ AI Scored ${proposal.vendor_name}: ${scores.final_score}/100`);
    
    return {
      price_score: scores.price_score || 0,
      delivery_score: scores.delivery_score || 0,
      warranty_score: scores.warranty_score || 0,
      completeness_score: scores.completeness_score || 0,
      final_score: scores.final_score || 0,
      breakdown: {
        price: scores.price_score || 0,
        delivery: scores.delivery_score || 0,
        warranty: scores.warranty_score || 0,
        completeness: scores.completeness_score || 0
      },
      reasoning: `Price: ${scores.price_score}%, Delivery: ${scores.delivery_score}%, Warranty: ${scores.warranty_score}%, Completeness: ${scores.completeness_score}%. ${scores.recommendation}`,
      strengths: scores.strengths,
      weaknesses: scores.weaknesses,
      raw_response: scores
    };

  } catch (error) {
    logger.error('AI scoring error:', error.message);
    
    // Fallback to heuristic scoring if AI fails
    console.warn('⚠️ AI failed, using fallback scoring algorithm');
    logger.warn('Using fallback scoring algorithm');
    
    const priceDiff = Math.abs(rfp.budget - proposal.total_price);
    const priceScore = Math.max(0, Math.min(100, 100 * (1 - (priceDiff / rfp.budget) * 0.5)));
    const deliveryScore = Math.max(0, Math.min(100, 100 * (1 - (proposal.delivery_days / 60) * 0.3)));
    const warrantyScore = Math.min(100, (proposal.warranty_months / 24) * 100);
    const completenessScore = 100;
    
    const finalScore = (priceScore * 0.5 + deliveryScore * 0.2 + warrantyScore * 0.1 + completenessScore * 0.2);
    
    return {
      price_score: priceScore,
      delivery_score: deliveryScore,
      warranty_score: warrantyScore,
      completeness_score: completenessScore,
      final_score: finalScore,
      breakdown: { price: priceScore, delivery: deliveryScore, warranty: warrantyScore, completeness: completenessScore },
      reasoning: `Fallback Score: Price ${priceScore.toFixed(0)}%, Delivery ${deliveryScore.toFixed(0)}%, Warranty ${warrantyScore.toFixed(0)}%. Using heuristic algorithm.`,
      strengths: 'Available for analysis',
      weaknesses: 'AI scoring unavailable',
      error: error.message,
      using_fallback: true
    };
  }
}

/**
 * Compare multiple proposals and rank them
 */
export async function compareProposalsWithAI(rfp, proposals) {
  try {
    logger.info(`🤖 Using Google AI to score ${proposals.length} proposals...`);
    
    const scoredProposals = [];
    
    for (const proposal of proposals) {
      const score = await scoreProposalWithAI(rfp, proposal);
      scoredProposals.push({
        proposal_id: proposal._id,
        vendor_name: proposal.vendor_name,
        vendor_email: proposal.vendor_email,
        ...score
      });
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Sort by final score
    scoredProposals.sort((a, b) => b.final_score - a.final_score);
    
    // Add rankings
    scoredProposals.forEach((prop, index) => {
      prop.ranking = index + 1;
    });
    
    return scoredProposals;

  } catch (error) {
    logger.error('AI comparison error:', error.message);
    throw error;
  }
}

export default {
  scoreProposalWithAI,
  compareProposalsWithAI
};
