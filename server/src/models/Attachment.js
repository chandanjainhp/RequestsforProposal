import mongoose from 'mongoose';
const AttachmentSchema = new mongoose.Schema({
  proposal_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
  filename: String,
  mime_type: String,
  storage_url: String,
  ocr_text: String,
  created_at: { type: Date, default: Date.now }
});
export default mongoose.model('Attachment', AttachmentSchema);
