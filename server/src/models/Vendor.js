import mongoose from 'mongoose';
const VendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact_email: { type: String, sparse: true, index: true },
  contact_person: String,
  phone: String,
  address: String,
  notes: String,
  active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Create unique index on contact_email only if it's not null
VendorSchema.index({ contact_email: 1 }, { unique: true, sparse: true });

export default mongoose.model('Vendor', VendorSchema);
