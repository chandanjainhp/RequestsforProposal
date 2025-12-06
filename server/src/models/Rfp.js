import mongoose from 'mongoose';
const LineItem = new mongoose.Schema({
  name: String,
  quantity: Number,
  specs: mongoose.Schema.Types.Mixed,
  estimated_unit_price: Number
}, { _id: false });

const RfpSchema = new mongoose.Schema({
  title: String,
  description: String,
  summary: String,
  budget: Number,
  currency: { type: String, default: 'USD' },
  delivery_days: Number,
  delivery_date: Date,
  delivery_by: Date,
  payment_terms: String,
  warranty_months: Number,
  warranty: String,
  status: { type: String, enum: ['draft', 'sent', 'active', 'pending_responses', 'closed'], default: 'draft' },
  line_items: [LineItem],
  parsed_by: { type: String, default: 'llm-v1' },
  raw_text: String,
  sent_at: Date,
  sent_to_vendors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }],
  vendor_emails: [String],  // Track vendor emails for matching inbound responses
  reply_to_token: { type: String, unique: true, sparse: true },
  created_at: { type: Date, default: Date.now }
});
export default mongoose.model('Rfp', RfpSchema);
