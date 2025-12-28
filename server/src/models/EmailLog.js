import mongoose from 'mongoose';

const emailLogSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  recipient_email: {
    type: String,
    required: true,
    index: true
  },
  email_type: {
    type: String,
    enum: ['otp_verification', 'otp_resend', 'welcome'],
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['sent', 'failed', 'bounced'],
    default: 'sent'
  },
  error_message: {
    type: String,
    default: null
  },
  sent_at: {
    type: Date,
    default: Date.now
  },
  opened_at: {
    type: Date,
    default: null
  },
  clicked_at: {
    type: Date,
    default: null
  }
});

// Index for efficient queries
emailLogSchema.index({ recipient_email: 1, email_type: 1, sent_at: -1 });
emailLogSchema.index({ user_id: 1, email_type: 1, sent_at: -1 });

export default mongoose.model('EmailLog', emailLogSchema);