import 'dotenv/config';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import Rfp from '../src/models/Rfp.js';
import Proposal from '../src/models/Proposal.js';
import Vendor from '../src/models/Vendor.js';
import ComparisonScore from '../src/models/ComparisonScore.js';

const MONGO = process.env.MONGODB_URI || 'mongodb://localhost:27017/rfp_prototype';

async function runMigration() {
  try {
    console.log('🚀 Starting database migration...\n');
    
    // Connect to MongoDB
    await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✓ Connected to MongoDB');
    
    // ========== CREATE INDEXES ==========
    console.log('\n📊 Creating indexes...');
    
    // Index on Rfp.reply_to_token (unique)
    try {
      await Rfp.collection.createIndex({ reply_to_token: 1 }, { unique: true, sparse: true });
      console.log('  ✓ Created unique index on Rfp.reply_to_token');
    } catch (err) {
      console.log('  ℹ Index on Rfp.reply_to_token already exists');
    }
    
    // Index on Proposal.rfp_id
    try {
      await Proposal.collection.createIndex({ rfp_id: 1 });
      console.log('  ✓ Created index on Proposal.rfp_id');
    } catch (err) {
      console.log('  ℹ Index on Proposal.rfp_id already exists');
    }
    
    // Index on Proposal.vendor_id
    try {
      await Proposal.collection.createIndex({ vendor_id: 1 });
      console.log('  ✓ Created index on Proposal.vendor_id');
    } catch (err) {
      console.log('  ℹ Index on Proposal.vendor_id already exists');
    }
    
    // Index on ComparisonScore.proposal_id
    try {
      await ComparisonScore.collection.createIndex({ proposal_id: 1 });
      console.log('  ✓ Created index on ComparisonScore.proposal_id');
    } catch (err) {
      console.log('  ℹ Index on ComparisonScore.proposal_id already exists');
    }
    
    // Index on ComparisonScore.rfp_id
    try {
      await ComparisonScore.collection.createIndex({ rfp_id: 1 });
      console.log('  ✓ Created index on ComparisonScore.rfp_id');
    } catch (err) {
      console.log('  ℹ Index on ComparisonScore.rfp_id already exists');
    }
    
    // Index on Vendor.contact_email (unique, sparse)
    try {
      await Vendor.collection.createIndex({ contact_email: 1 }, { unique: true, sparse: true });
      console.log('  ✓ Created unique index on Vendor.contact_email');
    } catch (err) {
      console.log('  ℹ Index on Vendor.contact_email already exists');
    }
    
    // ========== BACKFILL MISSING reply_to_token ==========
    console.log('\n🔄 Backfilling missing reply_to_tokens...');
    
    const rfpsWithoutToken = await Rfp.find({ reply_to_token: { $exists: false } });
    let backfillCount = 0;
    
    for (const rfp of rfpsWithoutToken) {
      rfp.reply_to_token = uuidv4().substring(0, 12); // Short format like "8acf43bb-b2c"
      try {
        await rfp.save();
        backfillCount++;
      } catch (err) {
        if (err.code === 11000) {
          // Duplicate token, generate another
          rfp.reply_to_token = uuidv4().substring(0, 12);
          await rfp.save();
          backfillCount++;
        } else {
          console.error(`  ✗ Error backfilling RFP ${rfp._id}:`, err.message);
        }
      }
    }
    
    console.log(`  ✓ Backfilled ${backfillCount} RFPs with reply_to_token`);
    
    // ========== VERIFY INDEXES ==========
    console.log('\n✅ Verifying indexes...');
    
    const rfpIndexes = await Rfp.collection.getIndexes();
    console.log('  Rfp indexes:', Object.keys(rfpIndexes).join(', '));
    
    const proposalIndexes = await Proposal.collection.getIndexes();
    console.log('  Proposal indexes:', Object.keys(proposalIndexes).join(', '));
    
    const vendorIndexes = await Vendor.collection.getIndexes();
    console.log('  Vendor indexes:', Object.keys(vendorIndexes).join(', '));
    
    const scoreIndexes = await ComparisonScore.collection.getIndexes();
    console.log('  ComparisonScore indexes:', Object.keys(scoreIndexes).join(', '));
    
    console.log('\n✨ Migration completed successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

runMigration();
