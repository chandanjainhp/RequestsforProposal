/**
 * Enhanced Test Logger for Authentication Flow Monitoring
 * Provides detailed logging for testing authentication flows
 */

import logger from './logger.js';

/**
 * Authentication Flow Logger
 * Tracks all authentication-related operations for testing
 */
export const authFlowLogger = {
  // Signup Flow
  signupAttempt: (email, fullName, companyName) => {
    logger.info('🔐 SIGNUP_ATTEMPT', {
      email: email,
      fullName: fullName,
      companyName: companyName,
      timestamp: new Date().toISOString()
    });
  },

  signupSuccess: (email, userId) => {
    logger.info('✅ SIGNUP_SUCCESS', {
      email: email,
      userId: userId,
      timestamp: new Date().toISOString()
    });
  },

  signupError: (email, error) => {
    logger.error('❌ SIGNUP_ERROR', {
      email: email,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  },

  // OTP Operations
  otpGenerated: (email, purpose, otpCode, expiresAt) => {
    logger.info('🔑 OTP_GENERATED', {
      email: email,
      purpose: purpose,
      otpCode: otpCode, // Include for testing
      expiresAt: expiresAt,
      timestamp: new Date().toISOString()
    });
  },

  otpSent: (email, purpose) => {
    logger.info('📧 OTP_SENT', {
      email: email,
      purpose: purpose,
      timestamp: new Date().toISOString()
    });
  },

  otpVerificationAttempt: (email, purpose) => {
    logger.info('🔍 OTP_VERIFICATION_ATTEMPT', {
      email: email,
      purpose: purpose,
      timestamp: new Date().toISOString()
    });
  },

  otpVerificationSuccess: (email, purpose, userId) => {
    logger.info('✅ OTP_VERIFICATION_SUCCESS', {
      email: email,
      purpose: purpose,
      userId: userId,
      timestamp: new Date().toISOString()
    });
  },

  otpVerificationError: (email, purpose, error) => {
    logger.error('❌ OTP_VERIFICATION_ERROR', {
      email: email,
      purpose: purpose,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  },

  otpExpired: (email, purpose) => {
    logger.warn('⏰ OTP_EXPIRED', {
      email: email,
      purpose: purpose,
      timestamp: new Date().toISOString()
    });
  },

  otpMaxAttempts: (email, purpose, attempts) => {
    logger.warn('🚫 OTP_MAX_ATTEMPTS', {
      email: email,
      purpose: purpose,
      attempts: attempts,
      timestamp: new Date().toISOString()
    });
  },

  // Login Flow
  loginAttempt: (email) => {
    logger.info('🔐 LOGIN_ATTEMPT', {
      email: email,
      timestamp: new Date().toISOString()
    });
  },

  loginSuccess: (email, userId) => {
    logger.info('✅ LOGIN_SUCCESS', {
      email: email,
      userId: userId,
      timestamp: new Date().toISOString()
    });
  },

  loginError: (email, error) => {
    logger.error('❌ LOGIN_ERROR', {
      email: email,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  },

  // Token Operations
  tokenGenerated: (email, tokenType, expiresIn) => {
    logger.info('🔑 TOKEN_GENERATED', {
      email: email,
      tokenType: tokenType,
      expiresIn: expiresIn,
      timestamp: new Date().toISOString()
    });
  },

  tokenVerificationAttempt: (email, tokenType) => {
    logger.info('🔍 TOKEN_VERIFICATION_ATTEMPT', {
      email: email,
      tokenType: tokenType,
      timestamp: new Date().toISOString()
    });
  },

  tokenVerificationSuccess: (email, tokenType, userId) => {
    logger.info('✅ TOKEN_VERIFICATION_SUCCESS', {
      email: email,
      tokenType: tokenType,
      userId: userId,
      timestamp: new Date().toISOString()
    });
  },

  tokenVerificationError: (email, tokenType, error) => {
    logger.error('❌ TOKEN_VERIFICATION_ERROR', {
      email: email,
      tokenType: tokenType,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  },

  tokenRefreshAttempt: (email) => {
    logger.info('🔄 TOKEN_REFRESH_ATTEMPT', {
      email: email,
      timestamp: new Date().toISOString()
    });
  },

  tokenRefreshSuccess: (email) => {
    logger.info('✅ TOKEN_REFRESH_SUCCESS', {
      email: email,
      timestamp: new Date().toISOString()
    });
  },

  tokenRefreshError: (email, error) => {
    logger.error('❌ TOKEN_REFRESH_ERROR', {
      email: email,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  },

  // Email Operations
  emailSendAttempt: (email, subject, emailType) => {
    logger.info('📧 EMAIL_SEND_ATTEMPT', {
      recipient: email,
      subject: subject,
      emailType: emailType,
      timestamp: new Date().toISOString()
    });
  },

  emailSendSuccess: (email, subject, messageId) => {
    logger.info('✅ EMAIL_SEND_SUCCESS', {
      recipient: email,
      subject: subject,
      messageId: messageId,
      timestamp: new Date().toISOString()
    });
  },

  emailSendError: (email, subject, error) => {
    logger.error('❌ EMAIL_SEND_ERROR', {
      recipient: email,
      subject: subject,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  },

  // General Flow Tracking
  flowStart: (flowName, email) => {
    logger.info(`🚀 FLOW_START: ${flowName}`, {
      email: email,
      flowName: flowName,
      timestamp: new Date().toISOString()
    });
  },

  flowComplete: (flowName, email) => {
    logger.info(`🎉 FLOW_COMPLETE: ${flowName}`, {
      email: email,
      flowName: flowName,
      timestamp: new Date().toISOString()
    });
  },

  flowError: (flowName, email, error) => {
    logger.error(`💥 FLOW_ERROR: ${flowName}`, {
      email: email,
      flowName: flowName,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Test Session Manager
 * Tracks test sessions for better debugging
 */
export class TestSessionManager {
  constructor() {
    this.sessions = new Map();
  }

  startSession(testName, email) {
    const sessionId = `${testName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.sessions.set(sessionId, {
      testName,
      email,
      startTime: new Date(),
      operations: []
    });
    
    logger.info('🧪 TEST_SESSION_START', {
      sessionId,
      testName,
      email,
      timestamp: new Date().toISOString()
    });

    return sessionId;
  }

  addOperation(sessionId, operation, details) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.operations.push({
        operation,
        details,
        timestamp: new Date()
      });
    }
  }

  endSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session) {
      const duration = Date.now() - session.startTime.getTime();
      logger.info('🧪 TEST_SESSION_END', {
        sessionId,
        testName: session.testName,
        email: session.email,
        duration: `${duration}ms`,
        operationCount: session.operations.length,
        timestamp: new Date().toISOString()
      });

      // Log detailed session summary
      logger.info('📋 SESSION_SUMMARY', {
        sessionId,
        operations: session.operations.map(op => ({
          operation: op.operation,
          timestamp: op.timestamp.toISOString()
        }))
      });

      this.sessions.delete(sessionId);
    }
  }

  getSession(sessionId) {
    return this.sessions.get(sessionId);
  }
}

export const testSessionManager = new TestSessionManager();

export default authFlowLogger;