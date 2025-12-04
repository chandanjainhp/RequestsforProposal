import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ComparisonScoreSchema = new Schema({
  proposal_id: { type: Schema.Types.ObjectId, ref: 'Proposal' },
  rfp_id: { type: Schema.Types.ObjectId, ref: 'Rfp' },
  score: Number,
  breakdown: { type: Schema.Types.Mixed },
  reasoning: String,
  computed_at: { type: Date, default: Date.now }
});
export default mongoose.model('ComparisonScore', ComparisonScoreSchema);
