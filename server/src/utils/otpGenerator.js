import crypto from 'crypto';

/**
 * Generate a cryptographically secure 6-digit OTP
 * @returns {string} 6-digit OTP code
 */
function generateOTP() {
  // Generate 3 random bytes (24 bits)
  const randomBytes = crypto.randomBytes(3);
  
  // Convert to number and ensure it's 6 digits
  const otp = randomBytes.readUIntBE(0, 3);
  
  // Ensure it's exactly 6 digits (100000-999999)
  const sixDigitOTP = (otp % 900000) + 100000;
  
  return sixDigitOTP.toString();
}

/**
 * Hash OTP for secure storage
 * @param {string} otp - The OTP to hash
 * @returns {string} Hashed OTP
 */
function hashOTP(otp) {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

/**
 * Verify OTP against stored hash
 * @param {string} otp - The OTP to verify
 * @param {string} hash - The stored hash
 * @returns {boolean} True if OTP matches hash
 */
function verifyOTP(otp, hash) {
  const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(otpHash), Buffer.from(hash));
}

/**
 * Check if OTP has expired
 * @param {Date} expiresAt - Expiration timestamp
 * @returns {boolean} True if expired
 */
function isOTPExpired(expiresAt) {
  return new Date() > expiresAt;
}

export {
  generateOTP,
  hashOTP,
  verifyOTP,
  isOTPExpired
};