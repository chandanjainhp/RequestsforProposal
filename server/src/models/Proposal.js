import mongoose from 'mongoose';

const ProposalSchema = new mongoose.Schema({
  rfp_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Rfp', default: null },
  vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', default: null },
  raw_email: String,
  parsed: { type: mongoose.Schema.Types.Mixed, default: null },
  attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attachment' }],
  parse_confidence: { type: Number, default: 0 },
  ai_summary: String,
  needs_review: { type: Boolean, default: false },
  unmapped: { type: Boolean, default: false }, // true if RFP could not be determined
  mapping_method: { type: String, enum: ['reply-to-token', 'rfp-id', 'rfp-id-subject', 'reply-to-token-to', 'none'], default: 'none' },
  parse_history: [{ type: mongoose.Schema.Types.Mixed }],
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('Proposal', ProposalSchema);
