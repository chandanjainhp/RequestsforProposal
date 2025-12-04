import 'dotenv/config';
import mongoose from 'mongoose';
import Vendor from '../models/Vendor.js';
import Rfp from '../models/Rfp.js';

const MONGO = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/rfp_prototype';
(async function(){
  await mongoose.connect(MONGO);
  await Vendor.deleteMany({});
  await Rfp.deleteMany({});

  const v = await Vendor.create({ name: 'Acme Laptops', contact_email: 'acme@example.com' });
  const r = await Rfp.create({
    title: 'Office laptops and monitors',
    description: 'Need 20 laptops 16GB and 15 monitors 27-inch. Budget 50000 USD. Delivery 30 days. Net 30. 1 year warranty',
    budget: 50000,
    currency: 'USD',
    delivery_by: new Date(Date.now() + 30*24*3600*1000),
    payment_terms: 'Net 30',
    warranty: '12 months',
    status: 'sent',
    line_items: [
      { name: 'Laptop - 16GB', quantity: 20, specs: { ram: '16GB' }, estimated_unit_price: 1800 },
      { name: 'Monitor - 27-inch', quantity: 15, specs: { size: '27 inch' }, estimated_unit_price: 600 }
    ]
  });
  console.log('seed done', { vendor: v._id, rfp: r._id });
  process.exit(0);
})();
