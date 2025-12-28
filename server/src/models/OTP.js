import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    index: true
  },
  otp_code: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 6
  },
  otp_hash: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    enum: ['signup', 'login', 'password_reset'],
    default: 'signup'
  },
  attempts: {
    type: Number,
    default: 0
  },
  max_attempts: {
    type: Number,
    default: 3
  },
  expires_at: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }
  },
  is_used: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  verified_at: {
    type: Date,
    default: null
  }
});

// Index for efficient queries
otpSchema.index({ email: 1, purpose: 1, created_at: -1 });
otpSchema.index({ user_id: 1, purpose: 1, created_at: -1 });

export default mongoose.model('OTP', otpSchema);