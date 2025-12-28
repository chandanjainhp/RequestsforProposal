import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  password_hash: {
    type: String,
    required: [true, 'Password is required'],
    select: false // Don't include password in queries by default
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name must not exceed 100 characters']
  },
  company: {
    type: String,
    trim: true,
    minlength: [3, 'Company name must be at least 3 characters'],
    maxlength: [100, 'Company name must not exceed 100 characters']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+[1-9]\d{1,14}$/, 'Phone must be in E.164 format (e.g., +1234567890)']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  refresh_tokens: [{
    tokenId: { type: String, required: true }, // Unique identifier for token rotation
    token: String, // Hashed token
    created_at: { type: Date, default: Date.now },
    expires_at: Date,
    device_info: String // Optional: browser/device info
  }],
  password_reset_token: {
    type: String,
    select: false
  },
  password_reset_expires: {
    type: Date,
    select: false
  },
  login_attempts: {
    type: Number,
    default: 0
  },
  lock_until: {
    type: Date,
    select: false
  },
  last_login: {
    type: Date
  },
  deleted_at: {
    type: Date,
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false, // We're managing timestamps manually
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password_hash;
      delete ret.refresh_tokens;
      delete ret.password_reset_token;
      delete ret.password_reset_expires;
      delete ret.lock_until;
      delete ret.login_attempts;
      return ret;
    }
  }
});

// Index for email (unique) and soft delete queries
UserSchema.index({ email: 1 });
UserSchema.index({ deleted_at: 1 });

// Virtual to check if account is locked
UserSchema.virtual('isLocked').get(function() {
  return !!(this.lock_until && this.lock_until > Date.now());
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  // Only hash password if it's modified
  if (!this.isModified('password_hash')) {
    return next();
  }

  // Skip if password_hash is not set
  if (!this.password_hash) {
    return next();
  }

  try {
    // Only hash if it's not already hashed (check if it looks like a bcrypt hash)
    // Bcrypt hashes start with $2a$, $2b$, or $2y$ and are 60 characters long
    // This prevents double-hashing if someone accidentally passes a hash
    if (this.password_hash.startsWith('$2') && this.password_hash.length === 60) {
      // Already hashed, skip
      return next();
    }

    // Hash password with 10 rounds
    const salt = await bcrypt.genSalt(10);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update updated_at before saving
UserSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updated_at = new Date();
  }
  next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password_hash);
  } catch (error) {
    throw error;
  }
};

// Method to increment login attempts
UserSchema.methods.incLoginAttempts = async function() {
  // If previous lock expired, reset attempts
  if (this.lock_until && this.lock_until < Date.now()) {
    return this.updateOne({
      $set: { login_attempts: 1 },
      $unset: { lock_until: 1 }
    });
  }

  const updates = { $inc: { login_attempts: 1 } };
  
  // Lock account after 5 failed attempts for 15 minutes
  if (this.login_attempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lock_until: Date.now() + 15 * 60 * 1000 }; // 15 minutes
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
UserSchema.methods.resetLoginAttempts = async function() {
  return this.updateOne({
    $set: { login_attempts: 0, last_login: new Date() },
    $unset: { lock_until: 1 }
  });
};

// Method to add refresh token (with tokenId for rotation)
UserSchema.methods.addRefreshToken = async function(tokenId, hashedToken, expiresAt, deviceInfo = null) {
  this.refresh_tokens.push({
    tokenId,
    token: hashedToken,
    expires_at: expiresAt,
    device_info: deviceInfo,
    created_at: new Date()
  });
  
  // Keep only last MAX_REFRESH_TOKENS_PER_USER tokens (default: 5)
  const maxTokens = 5;
  if (this.refresh_tokens.length > maxTokens) {
    // Sort by created_at and remove oldest
    this.refresh_tokens.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    this.refresh_tokens = this.refresh_tokens.slice(-maxTokens);
  }
  
  return this.save();
};

// Method to remove refresh token by tokenId
UserSchema.methods.removeRefreshTokenByTokenId = async function(tokenId) {
  this.refresh_tokens = this.refresh_tokens.filter(
    rt => rt.tokenId !== tokenId
  );
  return this.save();
};

// Method to remove refresh token by hashed token (backward compatibility)
UserSchema.methods.removeRefreshToken = async function(hashedToken) {
  this.refresh_tokens = this.refresh_tokens.filter(
    rt => rt.token !== hashedToken
  );
  return this.save();
};

// Method to find refresh token by tokenId
UserSchema.methods.findRefreshTokenByTokenId = function(tokenId) {
  return this.refresh_tokens.find(rt => rt.tokenId === tokenId);
};

// Method to clear all refresh tokens
UserSchema.methods.clearRefreshTokens = async function() {
  this.refresh_tokens = [];
  return this.save();
};

// Method to check if user is active (not deleted)
UserSchema.methods.isActive = function() {
  return !this.deleted_at;
};

// Static method to find active user by email
UserSchema.statics.findActiveByEmail = function(email) {
  return this.findOne({
    email: email.toLowerCase(),
    deleted_at: null
  });
};

const User = mongoose.model('User', UserSchema);

export default User;

