import Rfp from '../models/Rfp.js';
import Proposal from '../models/Proposal.js';
import ComparisonScore from '../models/ComparisonScore.js';
import Vendor from '../models/Vendor.js';
import config from '../config.js';

/**
 * GET /api/rfps/:id/compare
 * Returns all proposals for an RFP with comparison scores
 * Scores sorted by final_score descending
 * Includes recommended option with reasoning
 */
export const compareProposals = async (req, res) => {
  try {
    const { id: rfp_id } = req.params;

    // Verify RFP exists
    const rfp = await Rfp.findById(rfp_id);
    if (!rfp) {
      return res.status(404).json({
        ok: false,
        message: `RFP ${rfp_id} not found`,
      });
    }

    // Fetch all proposals for this RFP
    const proposals = await Proposal.find({ rfp_id }).populate('vendor_id');

    if (proposals.length === 0) {
      return res.status(200).json({
        ok: true,
        rfp_id,
        rfp_title: rfp.title,
        rfp_budget: rfp.budget,
        proposals: [],
        recommendation: null,
        message: 'No proposals yet for this RFP',
      });
    }

    // Fetch all comparison scores for these proposals
    const proposal_ids = proposals.map((p) => p._id);
    const scores = await ComparisonScore.find({ proposal_id: { $in: proposal_ids } });

    // Build map: proposal_id -> score
    const scoreMap = {};
    scores.forEach((score) => {
      scoreMap[score.proposal_id] = score;
    });

    // Build response: each proposal with its score
    const comparisons = proposals.map((proposal) => {
      const score = scoreMap[proposal._id];
      const parsed = proposal.parsed || {};
      return {
        proposal_id: proposal._id,
        vendor_id: proposal.vendor_id?._id,
        vendor_name: parsed.vendor_name || proposal.vendor_id?.name || 'Unknown',
        vendor_email: proposal.vendor_id?.contact_email,
        total_price: parsed.total_price,
        currency: parsed.currency || 'USD',
        delivery_days: parsed.delivery_days,
        warranty_months: parsed.warranty_months,
        payment_terms: parsed.payment_terms,
        line_items: parsed.line_items || [],
        technical_specs: parsed.technical_specs,
        certifications: parsed.certifications,
        parse_confidence: proposal.parse_confidence,
        final_score: score?.score || null,
        score_breakdown: score?.breakdown || null,
        reasoning: score?.reasoning || 'Score pending',
        needs_review: proposal.needs_review,
        created_at: proposal.created_at,
      };
    });

    // Sort by final_score descending (null scores go to end)
    comparisons.sort((a, b) => {
      if (a.final_score === null) return 1;
      if (b.final_score === null) return -1;
      return b.final_score - a.final_score;
    });

    // Recommended option: highest score, not needing review
    let recommendation = null;
    const approved = comparisons.filter(
      (c) => c.final_score !== null && !c.needs_review
    );
    if (approved.length > 0) {
      const top = approved[0];
      recommendation = {
        proposal_id: top.proposal_id,
        vendor_name: top.vendor_name,
        vendor_email: top.vendor_email,
        final_score: top.final_score,
        reasoning: `${top.vendor_name} scores ${top.final_score.toFixed(1)}/100 with best alignment on price (weight ${config.scoring.price}), delivery (${config.scoring.delivery}), warranty (${config.scoring.warranty}), and completeness (${config.scoring.completeness}).`,
        warning:
          top.needs_review
            ? 'Vendor response needs review before acceptance'
            : null,
      };
    }

    return res.status(200).json({
      ok: true,
      rfp_id,
      rfp_title: rfp.title,
      rfp_budget: rfp.budget,
      proposal_count: proposals.length,
      proposals: comparisons,
      recommendation,
    });
  } catch (error) {
    console.error('Comparison error:', error);
    res.status(500).json({
      ok: false,
      message: 'Error fetching comparison',
      error: error.message
    });
  }
};

/**
 * GET /api/rfps/:id/compare/details
 * Detailed breakdown view for comparison
 * Shows side-by-side all parsed fields + scoring
 */
export const compareProposalsDetailed = async (req, res) => {
  try {
    const { id: rfp_id } = req.params;

    // Verify RFP exists
    const rfp = await Rfp.findById(rfp_id);
    if (!rfp) {
      return res.status(404).json({
        ok: false,
        message: `RFP ${rfp_id} not found`,
      });
    }

    // Fetch all proposals
    const proposals = await Proposal.find({ rfp_id }).populate('vendor_id');

    if (proposals.length === 0) {
      return res.status(200).json({
        ok: true,
        rfp_id,
        rfp_title: rfp.title,
        message: 'No proposals',
        details: [],
      });
    }

    // Fetch comparison scores
    const proposal_ids = proposals.map((p) => p._id);
    const scores = await ComparisonScore.find({
      proposal_id: { $in: proposal_ids },
    });
    const scoreMap = {};
    scores.forEach((score) => {
      scoreMap[score.proposal_id] = score;
    });

    // Build detailed comparison
    const details = proposals.map((proposal) => {
      const score = scoreMap[proposal._id];
      const parsed = proposal.parsed || {};
      return {
        proposal_id: proposal._id,
        vendor: {
          id: proposal.vendor_id?._id,
          name: proposal.vendor_id?.name || 'Unknown',
          email: proposal.vendor_id?.contact_email,
        },
        proposal_fields: {
          total_price: parsed.total_price,
          currency: parsed.currency || 'USD',
          delivery_days: parsed.delivery_days,
          warranty_months: parsed.warranty_months,
          line_items: parsed.line_items || [],
        },
        scoring: {
          final_score: score?.score || null,
          price_score: score?.breakdown?.price_score,
          delivery_score: score?.breakdown?.delivery_score,
          warranty_score: score?.breakdown?.warranty_score,
          completeness_score: score?.breakdown?.completeness_score,
          reasoning: score?.reasoning,
        },
        quality: {
          parse_confidence: proposal.parse_confidence,
          needs_review: proposal.needs_review,
          parse_history_stages: (proposal.parse_history || []).map((h) => h.stage),
        },
      };
    });

    return res.status(200).json({
      ok: true,
      rfp_id,
      rfp_title: rfp.title,
      rfp_budget: rfp.budget,
      rfp_delivery_days: rfp.delivery_days,
      rfp_warranty_months: rfp.warranty_months,
      proposal_count: proposals.length,
      details,
    });
  } catch (error) {
    console.error('Detailed comparison error:', error);
    res.status(500).json({
      ok: false,
      message: 'Error fetching detailed comparison',
      error: error.message
    });
  }
};
