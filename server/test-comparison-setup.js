import mongoose from 'mongoose';
import Rfp from './src/models/Rfp.js';
import Proposal from './src/models/Proposal.js';
import ComparisonScore from './src/models/ComparisonScore.js';

await mongoose.connect('mongodb://localhost:27017/rfp_prototype');

const rfps = await Rfp.find().limit(1);
console.log('RFPs:', rfps.map(r => ({ id: r._id.toString(), title: r.title })));

if (rfps.length > 0) {
  const rfp = rfps[0];
  const proposals = await Proposal.find({ rfp_id: rfp._id });
  console.log(`\nRFP ${rfp._id} has ${proposals.length} proposals`);
  
  const scores = await ComparisonScore.find({ rfp_id: rfp._id });
  console.log(`RFP ${rfp._id} has ${scores.length} comparison scores`);
  
  if (proposals.length > 0 && scores.length > 0) {
    console.log('\n✓ Ready to test comparison endpoint');
    console.log(`Test URL: GET http://localhost:3000/api/rfps/${rfp._id}/compare`);
  } else {
    console.log('\n⚠ Need to create proposals with scores first');
  }
}

process.exit(0);
