import 'dotenv/config';
import mongoose from 'mongoose';
import { Worker } from 'bullmq';
import parseQueue from './src/queues/parseQueue.js';
import logger from './src/utils/logger.js';
import Proposal from './src/models/Proposal.js';
import Rfp from './src/models/Rfp.js';
import ComparisonScore from './src/models/ComparisonScore.js';
import llmAdapter from './src/adapters/llmAdapter.js';
import config from './src/config.js';

const MONGO = process.env.MONGODB_URI || 'mongodb://localhost:27017/rfp_prototype';
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info('Worker Mongo connected'))
  .catch(err => logger.error('Worker Mongo connection error', err));

const worker = new Worker('parseQueue', async (job) => {
  const { proposalId } = job.data;
  const proposal = await Proposal.findById(proposalId);
  if (!proposal) throw new Error('Proposal not found');

  const text = proposal.raw_email || '';
  const parseHistory = [];

  // Stage A: Fast regex parsing
  logger.debug(`[STAGE A] Parsing proposal ${proposalId}`);
  const stageA = llmAdapter.parseProposalStageA(text);
  parseHistory.push({ stage: 'A', result: stageA, timestamp: new Date() });
  
  let finalParsed = stageA.parsed;
  let finalConfidence = stageA.confidence;

  if (stageA.confidence >= config.parsing.minConfidenceA) {
    logger.info(`[STAGE A SUCCESS] Proposal ${proposalId}: confidence=${stageA.confidence}`);
  } else if (stageA.confidence >= config.parsing.minConfidenceB) {
    // Try Stage B: Table extraction
    logger.debug(`[STAGE B] Parsing proposal ${proposalId}`);
    const stageB = llmAdapter.parseProposalStageB(text);
    parseHistory.push({ stage: 'B', result: stageB, timestamp: new Date() });
    if (stageB.confidence > stageA.confidence) {
      finalParsed = stageB.parsed;
      finalConfidence = stageB.confidence;
      logger.info(`[STAGE B SUCCESS] Proposal ${proposalId}: confidence=${stageB.confidence}`);
    }
  }

  // If still low confidence, try Stage C (LLM)
  if (finalConfidence < config.parsing.minConfidenceB && text.length > 20) {
    logger.debug(`[STAGE C] Parsing proposal ${proposalId}`);
    const stageC = llmAdapter.parseProposalStageC(text);
    parseHistory.push({ stage: 'C', result: stageC, timestamp: new Date() });
    finalParsed = stageC.parsed;
    finalConfidence = stageC.confidence;
    logger.info(`[STAGE C] Proposal ${proposalId}: confidence=${stageC.confidence}`);
  }

  // Update proposal with parsed data
  proposal.parsed = finalParsed;
  proposal.parse_confidence = finalConfidence;
  proposal.parse_history = parseHistory;
  proposal.needs_review = finalConfidence < 0.6;
  proposal.ai_summary = finalParsed.ai_summary || `Parsed total: ${finalParsed.total_price || 'unknown'}`;
  await proposal.save();

  // Create comparison score if RFP exists
  const rfp = await Rfp.findById(proposal.rfp_id);
  if (rfp && finalParsed.total_price) {
    // Compute completeness score (how many fields were parsed)
    const completenessScore = (
      (finalParsed.total_price ? 1 : 0) +
      (finalParsed.delivery_days ? 1 : 0) +
      (finalParsed.warranty_months ? 1 : 0) +
      (finalParsed.items && finalParsed.items.length > 0 ? 1 : 0)
    ) / 4;

    // Compute price score (lower is better if within budget)
    let priceScore = 0;
    if (rfp.budget && finalParsed.total_price) {
      const ratio = finalParsed.total_price / rfp.budget;
      priceScore = Math.max(0, 1 - Math.abs(ratio - 1) * 0.5);
    }

    // Compute delivery score (lower days is better)
    let deliveryScore = 0;
    if (rfp.delivery_days && finalParsed.delivery_days) {
      deliveryScore = Math.max(0, 1 - Math.abs(finalParsed.delivery_days - rfp.delivery_days) / rfp.delivery_days);
    }

    // Compute warranty score
    let warrantyScore = 0;
    if (rfp.warranty_months && finalParsed.warranty_months) {
      warrantyScore = Math.min(finalParsed.warranty_months / rfp.warranty_months, 1);
    }

    // Weighted final score
    const weightedScore = (
      (priceScore * config.scoring.price) +
      (deliveryScore * config.scoring.delivery) +
      (warrantyScore * config.scoring.warranty) +
      (completenessScore * config.scoring.completeness)
    ) * 100;

    const breakdown = {
      total_price: finalParsed.total_price,
      budget: rfp.budget,
      price_score: priceScore.toFixed(2),
      delivery_days: finalParsed.delivery_days,
      delivery_score: deliveryScore.toFixed(2),
      warranty_months: finalParsed.warranty_months,
      warranty_score: warrantyScore.toFixed(2),
      completeness_score: completenessScore.toFixed(2)
    };

    await ComparisonScore.create({
      proposal_id: proposal._id,
      rfp_id: rfp._id,
      score: weightedScore,
      breakdown,
      reasoning: `Weighted score: price=${config.scoring.price}, delivery=${config.scoring.delivery}, warranty=${config.scoring.warranty}, completeness=${config.scoring.completeness}`
    });

    logger.info(`Comparison score created: proposal=${proposalId}, score=${weightedScore.toFixed(1)}`);
  }

  logger.info(`Processed proposal ${proposalId}: confidence=${finalConfidence}, stage=${parseHistory[parseHistory.length - 1].stage}`);
}, { connection: parseQueue.opts.connection });

logger.info('Worker started');