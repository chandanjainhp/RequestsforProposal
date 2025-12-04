// Configuration for scoring and parsing
export default {
  scoring: {
    price: parseFloat(process.env.SCORE_WEIGHTS_PRICE || 0.5),
    delivery: parseFloat(process.env.SCORE_WEIGHTS_DELIVERY || 0.2),
    warranty: parseFloat(process.env.SCORE_WEIGHTS_WARRANTY || 0.1),
    completeness: parseFloat(process.env.SCORE_WEIGHTS_COMPLETENESS || 0.2)
  },
  parsing: {
    minConfidenceA: 0.8, // Stage A: high confidence threshold
    minConfidenceB: 0.6, // Stage B: medium threshold
    minConfidenceC: 0.4  // Stage C: low threshold, requires LLM
  }
};
