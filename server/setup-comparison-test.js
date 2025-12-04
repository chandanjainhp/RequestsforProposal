import mongoose from 'mongoose';
import Rfp from './src/models/Rfp.js';
import Proposal from './src/models/Proposal.js';
import Vendor from './src/models/Vendor.js';
import ComparisonScore from './src/models/ComparisonScore.js';

await mongoose.connect('mongodb://localhost:27017/rfp_prototype');

// Get or create an RFP
let rfp = await Rfp.findOne();
if (!rfp) {
  console.log('Creating test RFP...');
  rfp = await Rfp.create({
    title: 'Test RFP - Laptop Procurement',
    description: 'Need 10 laptops for development team',
    budget: 15000,
    delivery_days: 30,
    warranty_months: 12,
    line_items: [
      {
        name: 'MacBook Pro 16"',
        quantity: 10,
        estimated_unit_price: 1500
      }
    ]
  });
  console.log('Created RFP:', rfp._id);
}

console.log('Using RFP:', rfp._id);

// Get or create vendors
const vendors = await Vendor.find().limit(2);
let vendor1 = vendors[0];
let vendor2 = vendors[1];

if (!vendor1) {
  console.log('Creating test vendors...');
  vendor1 = await Vendor.create({
    name: 'TechVendor A',
    contact_email: 'vendor-a@example.com',
    contact_person: 'John Doe',
    active: true
  });
  vendor2 = await Vendor.create({
    name: 'TechVendor B',
    contact_email: 'vendor-b@example.com',
    contact_person: 'Jane Smith',
    active: true
  });
  console.log('Created vendors:', vendor1._id, vendor2._id);
}

console.log('Using vendors:', vendor1.name, vendor2.name);

// Create test proposals if they don't exist
const existingProposals = await Proposal.find({ rfp_id: rfp._id });
if (existingProposals.length < 2) {
  console.log('\nCreating test proposals...');
  
  const prop1 = await Proposal.create({
    rfp_id: rfp._id,
    vendor_id: vendor1._id,
    raw_email: 'Proposal from Vendor A: 10 laptops at $1450 each, delivery in 25 days, 12 month warranty',
    parsed: {
      total_price: 14500,
      currency: 'USD',
      delivery_days: 25,
      warranty_months: 12,
      line_items: [
        { name: 'MacBook Pro 16"', quantity: 10, unit_price: 1450, subtotal: 14500 }
      ]
    },
    parse_confidence: 0.85,
    needs_review: false
  });
  
  const prop2 = await Proposal.create({
    rfp_id: rfp._id,
    vendor_id: vendor2._id,
    raw_email: 'Proposal from Vendor B: 10 laptops at $1400 each, delivery in 20 days, 12 month warranty',
    parsed: {
      total_price: 14000,
      currency: 'USD',
      delivery_days: 20,
      warranty_months: 12,
      line_items: [
        { name: 'MacBook Pro 16"', quantity: 10, unit_price: 1400, subtotal: 14000 }
      ]
    },
    parse_confidence: 0.90,
    needs_review: false
  });
  
  console.log('Created proposals:', prop1._id, prop2._id);
}

// Create comparison scores if they don't exist
const existingScores = await ComparisonScore.find({ rfp_id: rfp._id });
if (existingScores.length < 2) {
  console.log('\nCreating test comparison scores...');
  
  const proposals = await Proposal.find({ rfp_id: rfp._id });
  
  // Score 1: Vendor A
  await ComparisonScore.create({
    proposal_id: proposals[0]._id,
    rfp_id: rfp._id,
    score: 78.5,
    breakdown: {
      price_score: 75,
      delivery_score: 80,
      warranty_score: 100,
      completeness_score: 75
    },
    reasoning: 'Good price and delivery, good warranty coverage'
  });
  
  // Score 2: Vendor B (higher score)
  await ComparisonScore.create({
    proposal_id: proposals[1]._id,
    rfp_id: rfp._id,
    score: 85.0,
    breakdown: {
      price_score: 85,
      delivery_score: 95,
      warranty_score: 100,
      completeness_score: 80
    },
    reasoning: 'Better price and faster delivery'
  });
  
  console.log('Created comparison scores');
}

console.log('\n✓ Test data ready!');
console.log(`Test URL: GET http://localhost:3000/api/rfps/${rfp._id}/compare`);

process.exit(0);
