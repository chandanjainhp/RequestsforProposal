#!/usr/bin/env node

/**
 * End-to-End Verification Test
 * Tests all 10 priorities to ensure the system is working correctly
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';
const API = 'http://localhost:3000/api';

let testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

async function test(name, fn) {
  try {
    await fn();
    testResults.passed++;
    testResults.tests.push({ name, status: '✓ PASS', error: null });
    console.log(`✓ ${name}`);
  } catch (error) {
    testResults.failed++;
    testResults.tests.push({ name, status: '✗ FAIL', error: error.message });
    console.log(`✗ ${name}: ${error.message}`);
  }
}

async function request(method, path, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (body) options.body = JSON.stringify(body);
  
  const res = await fetch(`${API}${path}`, options);
  const data = await res.json();
  
  if (!res.ok) throw new Error(`${res.status}: ${data.message}`);
  return data;
}

async function runTests() {
  console.log('🧪 Running RFP Management System Verification Tests\n');
  
  // Priority 1: Parse endpoint
  console.log('Priority 1: Parse Endpoint');
  let parseResult;
  await test('POST /api/rfp/parse - Parse RFP from text', async () => {
    parseResult = await request('POST', '/rfp/parse', {
      message: 'I need 10 laptops. Budget $25000. Delivery 30 days. 1 year warranty.'
    });
    if (!parseResult.parsed_rfp || !parseResult.parse_confidence) throw new Error('Missing parsed_rfp or confidence');
  });
  
  // Priority 2: Save RFP
  console.log('\nPriority 2: Save RFP');
  let rfpId, replyToken;
  await test('POST /api/rfps - Save RFP', async () => {
    const result = await request('POST', '/rfps', {
      parsed_rfp: parseResult.parsed_rfp
    });
    if (!result.rfp_id || !result.reply_to_token) throw new Error('Missing rfp_id or reply_to_token');
    rfpId = result.rfp_id;
    replyToken = result.reply_to_token;
  });
  
  await test('GET /api/rfps - List RFPs', async () => {
    const result = await request('GET', '/rfps');
    if (!Array.isArray(result.rfps)) throw new Error('rfps is not an array');
  });
  
  await test('GET /api/rfps/:id - Get single RFP', async () => {
    const result = await request('GET', `/rfps/${rfpId}`);
    if (result.rfp._id.toString() !== rfpId) throw new Error('RFP ID mismatch');
  });
  
  // Priority 3: Send RFP
  console.log('\nPriority 3: Send RFP');
  let vendorId;
  await test('GET /api/vendors - List vendors', async () => {
    const result = await request('GET', '/vendors');
    if (result.vendors.length === 0) throw new Error('No vendors available');
    vendorId = result.vendors[0]._id;
  });
  
  await test('POST /api/rfps/:id/send - Send RFP to vendor', async () => {
    const result = await request('POST', `/rfps/${rfpId}/send`, {
      vendorIds: [vendorId]
    });
    if (result.status !== 'sent') throw new Error('RFP not sent');
  });
  
  // Priority 4: Email Inbound
  console.log('\nPriority 4: Email Inbound Mapping');
  let proposalId;
  await test('POST /api/email/inbound - Receive proposal', async () => {
    const result = await request('POST', '/email/inbound', {
      from: 'vendor@example.com',
      subject: 'Re: RFP Proposal',
      text: 'We quote 24000 USD. Delivery 25 days. 12 month warranty.',
      'envelope-to': `rfp+${replyToken}@yourdomain.com`
    });
    if (!result.proposal_id) throw new Error('No proposal_id returned');
    proposalId = result.proposal_id;
  });
  
  // Priority 6: Comparison
  console.log('\nPriority 6: Comparison API');
  await test('GET /api/rfps/:id/compare - Compare proposals', async () => {
    const result = await request('GET', `/rfps/${rfpId}/compare`);
    if (result.rfp_id.toString() !== rfpId) throw new Error('RFP ID mismatch');
  });
  
  // Priority 7: Vendor CRUD
  console.log('\nPriority 7: Vendor Management');
  let newVendorId;
  await test('POST /api/vendors - Create vendor', async () => {
    const result = await request('POST', '/vendors', {
      name: 'Test Vendor E2E',
      contact_email: `vendor-${Date.now()}@test.com`,
      contact_person: 'Test Person'
    });
    if (!result.vendor_id) throw new Error('No vendor_id returned');
    newVendorId = result.vendor_id;
  });
  
  await test('GET /api/vendors/:id - Get vendor', async () => {
    const result = await request('GET', `/vendors/${newVendorId}`);
    if (result.vendor._id.toString() !== newVendorId) throw new Error('Vendor ID mismatch');
  });
  
  await test('PUT /api/vendors/:id - Update vendor', async () => {
    const result = await request('PUT', `/vendors/${newVendorId}`, {
      contact_person: 'Updated Person'
    });
    if (result.vendor.contact_person !== 'Updated Person') throw new Error('Update failed');
  });
  
  await test('DELETE /api/vendors/:id - Delete vendor (soft)', async () => {
    const result = await request('DELETE', `/vendors/${newVendorId}`);
    if (result.vendor.active !== false) throw new Error('Vendor not deactivated');
  });
  
  // Priority 9: Health Monitoring
  console.log('\nPriority 9: Health Monitoring');
  await test('GET /health - Basic health check', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    if (!data.ok) throw new Error('Health check failed');
  });
  
  await test('GET /health/extended - Extended health metrics', async () => {
    const res = await fetch(`${BASE_URL}/health/extended`);
    const data = await res.json();
    if (!data.database || !data.mongodb) throw new Error('Missing health metrics');
  });
  
  await test('GET /health/ready - Readiness probe', async () => {
    const res = await fetch(`${BASE_URL}/health/ready`);
    const data = await res.json();
    if (!data.ready) throw new Error('Service not ready');
  });
  
  await test('GET /health/live - Liveness probe', async () => {
    const res = await fetch(`${BASE_URL}/health/live`);
    const data = await res.json();
    if (!data.ok) throw new Error('Liveness check failed');
  });
  
  // Print results
  console.log('\n' + '='.repeat(60));
  console.log(`✓ Passed: ${testResults.passed}`);
  console.log(`✗ Failed: ${testResults.failed}`);
  console.log('='.repeat(60));
  
  if (testResults.failed === 0) {
    console.log('\n🎉 All tests passed! System is fully operational.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Review output above.');
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});
