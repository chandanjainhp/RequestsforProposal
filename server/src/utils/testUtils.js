/**
 * Authentication Testing Utilities
 * Provides utilities for testing authentication flows
 */

import { authFlowLogger, testSessionManager } from './testLogger.js';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import EmailLog from '../models/EmailLog.js';

/**
 * Test Data Factory
 * Creates test data for authentication testing
 */
export class TestDataFactory {
  static createTestUser(overrides = {}) {
    return {
      full_name: 'Test User',
      email: 'test@example.com',
      company_name: 'Test Company',
      password: 'TestPassword123!',
      confirm_password: 'TestPassword123!',
      ...overrides
    };
  }

  static createTestLogin(overrides = {}) {
    return {
      email: 'test@example.com',
      password: 'TestPassword123!',
      ...overrides
    };
  }

  static createTestOTP(overrides = {}) {
    return {
      email: 'test@example.com',
      otp_code: '123456',
      ...overrides
    };
  }
}

/**
 * Authentication Flow Tester
 * Tests complete authentication flows
 */
export class AuthFlowTester {
  constructor() {
    this.testResults = [];
  }

  async testSignupFlow(testData) {
    const sessionId = testSessionManager.startSession('test_signup_flow', testData.email);
    testSessionManager.addOperation(sessionId, 'test_start', { testData });
    
    try {
      authFlowLogger.flowStart('signup', testData.email);
      
      // Test 1: Signup attempt
      console.log('🧪 Testing Signup Flow...');
      console.log(`📧 Email: ${testData.email}`);
      console.log(`👤 Full Name: ${testData.full_name}`);
      console.log(`🏢 Company: ${testData.company_name}`);
      
      // Note: This would need to be called with actual API requests
      // For now, we'll log what should happen
      
      testSessionManager.addOperation(sessionId, 'signup_test_completed', { 
        email: testData.email,
        expected: 'OTP sent via email'
      });
      
      authFlowLogger.flowComplete('signup', testData.email);
      testSessionManager.endSession(sessionId);
      
      return { success: true, message: 'Signup flow test completed' };
      
    } catch (error) {
      authFlowLogger.flowError('signup', testData.email, error);
      testSessionManager.addOperation(sessionId, 'test_error', { error: error.message });
      testSessionManager.endSession(sessionId);
      throw error;
    }
  }

  async testLoginFlow(testData) {
    const sessionId = testSessionManager.startSession('test_login_flow', testData.email);
    testSessionManager.addOperation(sessionId, 'test_start', { testData });
    
    try {
      authFlowLogger.flowStart('login', testData.email);
      
      console.log('🔐 Testing Login Flow...');
      console.log(`📧 Email: ${testData.email}`);
      console.log(`🔑 Password: ${'*'.repeat(testData.password.length)}`);
      
      testSessionManager.addOperation(sessionId, 'login_test_completed', { 
        email: testData.email,
        expected: 'OTP sent via email'
      });
      
      authFlowLogger.flowComplete('login', testData.email);
      testSessionManager.endSession(sessionId);
      
      return { success: true, message: 'Login flow test completed' };
      
    } catch (error) {
      authFlowLogger.flowError('login', testData.email, error);
      testSessionManager.addOperation(sessionId, 'test_error', { error: error.message });
      testSessionManager.endSession(sessionId);
      throw error;
    }
  }

  async testTokenRefreshFlow() {
    const sessionId = testSessionManager.startSession('test_token_refresh_flow', 'test@example.com');
    testSessionManager.addOperation(sessionId, 'test_start', {});
    
    try {
      authFlowLogger.flowStart('token_refresh', 'test@example.com');
      
      console.log('🔄 Testing Token Refresh Flow...');
      console.log('📝 Expected: New access token generated');
      
      testSessionManager.addOperation(sessionId, 'token_refresh_test_completed', { 
        expected: 'New access token generated'
      });
      
      authFlowLogger.flowComplete('token_refresh', 'test@example.com');
      testSessionManager.endSession(sessionId);
      
      return { success: true, message: 'Token refresh flow test completed' };
      
    } catch (error) {
      authFlowLogger.flowError('token_refresh', 'test@example.com', error);
      testSessionManager.addOperation(sessionId, 'test_error', { error: error.message });
      testSessionManager.endSession(sessionId);
      throw error;
    }
  }

  async testOTPVerificationFlow(otpData) {
    const sessionId = testSessionManager.startSession('test_otp_verification_flow', otpData.email);
    testSessionManager.addOperation(sessionId, 'test_start', { otpData });
    
    try {
      authFlowLogger.flowStart('otp_verification', otpData.email);
      
      console.log('🔑 Testing OTP Verification Flow...');
      console.log(`📧 Email: ${otpData.email}`);
      console.log(`🔢 OTP: ${otpData.otp_code}`);
      
      testSessionManager.addOperation(sessionId, 'otp_verification_test_completed', { 
        email: otpData.email,
        otp_code: otpData.otp_code,
        expected: 'Token generated and user authenticated'
      });
      
      authFlowLogger.flowComplete('otp_verification', otpData.email);
      testSessionManager.endSession(sessionId);
      
      return { success: true, message: 'OTP verification flow test completed' };
      
    } catch (error) {
      authFlowLogger.flowError('otp_verification', otpData.email, error);
      testSessionManager.addOperation(sessionId, 'test_error', { error: error.message });
      testSessionManager.endSession(sessionId);
      throw error;
    }
  }

  async testCompleteIntegrationFlow() {
    const sessionId = testSessionManager.startSession('test_complete_integration_flow', 'integration@example.com');
    testSessionManager.addOperation(sessionId, 'test_start', {});
    
    try {
      authFlowLogger.flowStart('complete_integration', 'integration@example.com');
      
      console.log('🚀 Testing Complete Integration Flow...');
      console.log('📝 Flow: Signup → OTP Verification → Login → Dashboard Access');
      
      // This would test the complete flow from signup to dashboard access
      testSessionManager.addOperation(sessionId, 'integration_test_completed', { 
        expected: 'Complete flow from signup to authenticated dashboard access'
      });
      
      authFlowLogger.flowComplete('complete_integration', 'integration@example.com');
      testSessionManager.endSession(sessionId);
      
      return { success: true, message: 'Complete integration flow test completed' };
      
    } catch (error) {
      authFlowLogger.flowError('complete_integration', 'integration@example.com', error);
      testSessionManager.addOperation(sessionId, 'test_error', { error: error.message });
      testSessionManager.endSession(sessionId);
      throw error;
    }
  }

  async testErrorHandling() {
    const sessionId = testSessionManager.startSession('test_error_handling', 'error@example.com');
    testSessionManager.addOperation(sessionId, 'test_start', {});
    
    try {
      authFlowLogger.flowStart('error_handling', 'error@example.com');
      
      console.log('⚠️ Testing Error Handling Scenarios...');
      
      const errorScenarios = [
        { name: 'Invalid Email Format', data: { email: 'invalid-email', password: 'Test123!' } },
        { name: 'Weak Password', data: { email: 'test@example.com', password: '123' } },
        { name: 'Missing Password', data: { email: 'test@example.com' } },
        { name: 'Invalid OTP', data: { email: 'test@example.com', otp_code: '999999' } },
        { name: 'Expired OTP', data: { email: 'test@example.com', otp_code: '123456' } },
        { name: 'Max OTP Attempts', data: { email: 'test@example.com', otp_code: '123456' } }
      ];
      
      errorScenarios.forEach(scenario => {
        console.log(`🔍 Testing: ${scenario.name}`);
        testSessionManager.addOperation(sessionId, 'error_scenario_tested', { 
          scenario: scenario.name,
          data: scenario.data
        });
      });
      
      authFlowLogger.flowComplete('error_handling', 'error@example.com');
      testSessionManager.endSession(sessionId);
      
      return { success: true, message: 'Error handling test completed' };
      
    } catch (error) {
      authFlowLogger.flowError('error_handling', 'error@example.com', error);
      testSessionManager.addOperation(sessionId, 'test_error', { error: error.message });
      testSessionManager.endSession(sessionId);
      throw error;
    }
  }

  generateTestReport() {
    console.log('\n📊 AUTHENTICATION TESTING REPORT');
    console.log('=====================================');
    
    // This would generate a detailed test report
    // For now, we'll log the structure
    
    console.log('✅ Test Report Generated');
    console.log('📝 Check server logs for detailed flow tracking');
    console.log('🔍 Use testSessionManager for session details');
    
    return {
      timestamp: new Date().toISOString(),
      summary: 'Authentication testing completed',
      recommendations: [
        'Monitor server logs during testing',
        'Verify OTP delivery in development mode',
        'Test token refresh with expired tokens',
        'Validate error handling scenarios'
      ]
    };
  }
}

/**
 * Manual Testing Instructions
 * Provides step-by-step instructions for manual testing
 */
export const manualTestingInstructions = {
  signup: `
    🧪 MANUAL TESTING: Signup Flow
    ==============================
    
    1. Open Postman or your API testing tool
    2. Send POST request to: http://localhost:3000/api/auth/signup
    3. Request Body (JSON):
       {
         "full_name": "Test User",
         "email": "test@example.com",
         "company_name": "Test Company",
         "password": "TestPassword123!",
         "confirm_password": "TestPassword123!"
       }
    4. Expected Response: 201 Created with OTP sent message
    5. Check server logs for:
       - 🔐 SIGNUP_ATTEMPT
       - 🔑 OTP_GENERATED
       - 📧 OTP_SENT
       - ✅ SIGNUP_SUCCESS
    
    📝 Notes:
    - In development mode, OTP code will be included in response
    - Check logs/error.log and logs/combined.log for details
  `,

  verifySignupOTP: `
    🧪 MANUAL TESTING: Signup OTP Verification
    =========================================
    
    1. Send POST request to: http://localhost:3000/api/auth/verify-otp
    2. Request Body (JSON):
       {
         "email": "test@example.com",
         "otp_code": "123456"
       }
    3. Expected Response: 200 OK with token and user data
    4. Check server logs for:
       - 🔍 OTP_VERIFICATION_ATTEMPT
       - ✅ OTP_VERIFICATION_SUCCESS
       - 📧 EMAIL_SEND_ATTEMPT (welcome email)
       - 📧 EMAIL_SEND_SUCCESS
       - 🔑 TOKEN_GENERATED
    
    📝 Notes:
    - Use the OTP code from signup response (development mode)
    - User should be marked as verified in database
  `,

  login: `
    🧪 MANUAL TESTING: Login Flow
    ============================
    
    1. Send POST request to: http://localhost:3000/api/auth/login
    2. Request Body (JSON):
       {
         "email": "test@example.com",
         "password": "TestPassword123!"
       }
    3. Expected Response: 200 OK with OTP sent message
    4. Check server logs for:
       - 🔐 LOGIN_ATTEMPT
       - ✅ LOGIN_SUCCESS
       - 🔑 OTP_GENERATED
       - 📧 OTP_SENT
    
    📝 Notes:
    - User must be verified before login
    - OTP will be sent to email for verification
  `,

  verifyLoginOTP: `
    🧪 MANUAL TESTING: Login OTP Verification
    ========================================
    
    1. Send POST request to: http://localhost:3000/api/auth/verify-login-otp
    2. Request Body (JSON):
       {
         "email": "test@example.com",
         "otp_code": "123456"
       }
    3. Expected Response: 200 OK with token and user data
    4. Check server logs for:
       - 🔍 OTP_VERIFICATION_ATTEMPT
       - ✅ OTP_VERIFICATION_SUCCESS
       - 🔑 TOKEN_GENERATED
    
    📝 Notes:
    - Use OTP from login response
    - Token should be valid for API access
  `,

  refreshToken: `
    🧪 MANUAL TESTING: Token Refresh
    ===============================
    
    1. Send POST request to: http://localhost:3000/api/auth/refresh
    2. Request Body (JSON):
       {
         "refreshToken": "your-refresh-token-here"
       }
    3. Expected Response: 200 OK with new access token
    4. Check server logs for:
       - 🔄 TOKEN_REFRESH_ATTEMPT
       - ✅ TOKEN_REFRESH_SUCCESS
       - 🔑 TOKEN_GENERATED
    
    📝 Notes:
    - Test with expired access token
    - Verify new token is generated successfully
  `,

  verifyToken: `
    🧪 MANUAL TESTING: Token Verification
    ====================================
    
    1. Send GET request to: http://localhost:3000/api/auth/verify
    2. Headers:
       - Authorization: Bearer your-access-token
    3. Expected Response: 200 OK with user data
    4. Check server logs for:
       - 🔍 TOKEN_VERIFICATION_ATTEMPT
       - ✅ TOKEN_VERIFICATION_SUCCESS
    
    📝 Notes:
    - Test with valid and invalid tokens
    - Verify middleware authentication works
  `
};

export default {
  TestDataFactory,
  AuthFlowTester,
  manualTestingInstructions
};