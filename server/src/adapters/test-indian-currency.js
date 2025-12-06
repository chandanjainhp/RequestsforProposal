// Test Indian currency parsing in llmAdapter
import llmAdapter from './llmAdapter.js';

console.log('=== Testing Indian Currency Parsing ===\n');

// Test 1: RFP with lakh format
console.log('Test 1: RFP with ₹50 lakh');
const rfp1 = llmAdapter.parseRfp('Need 100 laptops. Budget ₹50 lakh. Delivery within 30 days.');
console.log('Parsed:', rfp1.parsed_rfp);
console.log('Budget:', rfp1.parsed_rfp.budget, rfp1.parsed_rfp.currency);
console.log('Expected: 5000000 INR\n');

// Test 2: RFP with crore format
console.log('Test 2: RFP with Rs 5 crore');
const rfp2 = llmAdapter.parseRfp('Office renovation project. Budget Rs 5 crore. Payment terms: Net 30.');
console.log('Parsed:', rfp2.parsed_rfp);
console.log('Budget:', rfp2.parsed_rfp.budget, rfp2.parsed_rfp.currency);
console.log('Expected: 50000000 INR\n');

// Test 3: Proposal with lakh format
console.log('Test 3: Proposal with ₹45 lakh');
const proposal1 = llmAdapter.parseProposal('Total price ₹45 lakh. Delivery in 25 days. 1 year warranty.');
console.log('Parsed:', proposal1.parsed_proposal);
console.log('Price:', proposal1.parsed_proposal.total_price, proposal1.parsed_proposal.currency);
console.log('Expected: 4500000 INR\n');

// Test 4: Proposal with crore format
console.log('Test 4: Proposal with Rs. 4.5 crore');
const proposal2 = llmAdapter.parseProposal('Quote: Rs. 4.5 crore. Delivery 60 days. Payment terms: 30-60-10');
console.log('Parsed:', proposal2.parsed_proposal);
console.log('Price:', proposal2.parsed_proposal.total_price, proposal2.parsed_proposal.currency);
console.log('Expected: 45000000 INR\n');

// Test 5: Mixed format - INR keyword
console.log('Test 5: RFP with INR 10,00,000');
const rfp3 = llmAdapter.parseRfp('Server infrastructure. Budget INR 10,00,000. Need within 45 days.');
console.log('Parsed:', rfp3.parsed_rfp);
console.log('Budget:', rfp3.parsed_rfp.budget, rfp3.parsed_rfp.currency);
console.log('Expected: 1000000 INR\n');

// Test 6: USD for comparison
console.log('Test 6: USD format for comparison');
const rfp4 = llmAdapter.parseRfp('Need laptops. Budget $50000. Delivery 30 days.');
console.log('Parsed:', rfp4.parsed_rfp);
console.log('Budget:', rfp4.parsed_rfp.budget, rfp4.parsed_rfp.currency);
console.log('Expected: 50000 USD\n');

console.log('=== All Tests Complete ===');
