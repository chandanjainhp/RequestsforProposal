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
  mapping_method: { 
    type: String, 
    enum: [
      'reply-to-token',      // Matched via rfp+token@ email format
      'reply-token',         // Matched via reply token in subject/body
      'explicit-rfp-id',     // RFP ID was explicitly provided
      'rfp-id',              // Legacy: RFP ID match
      'rfp-id-subject',      // Legacy: RFP ID in subject
      'reply-to-token-to',   // Legacy: Reply-to token
      'vendor-email-match',  // Matched by vendor email to sent RFPs
      'subject-match',       // Matched by subject line keywords
      'ai-match',            // Matched using AI analysis
      'fallback-recent',     // Fallback to most recent active RFP
      'unknown',             // Unknown matching method
      'none'                 // No matching performed
    ], 
    default: 'none' 
  },
  parse_history: [{ type: mongoose.Schema.Types.Mixed }],
  
  // Proposal details fields
  vendor_name: String,
  vendor_email: String,
  total_price: Number,
  currency: { type: String, default: 'INR' },
  delivery_days: Number,
  warranty_months: Number,
  payment_terms: String,
  items_included: Number,
  technical_specs: String,
  certifications: String,
  status: { type: String, enum: ['draft', 'received', 'under_review', 'accepted', 'rejected'], default: 'draft' },
  received_at: Date,
  
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('Proposal', ProposalSchema);
