import Vendor from '../models/Vendor.js';

/**
 * GET /api/vendors
 * List all vendors with optional filtering by active status
 * Query params: active=true|false
 */
export const listVendors = async (req, res) => {
  try {
    const { active } = req.query;
    const filter = {};
    
    if (active !== undefined) {
      filter.active = active === 'true';
    }
    
    const vendors = await Vendor.find(filter).sort({ name: 1 });
    
    return res.status(200).json({
      ok: true,
      count: vendors.length,
      vendors
    });
  } catch (error) {
    console.error('List vendors error:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error listing vendors',
      error: error.message
    });
  }
};

/**
 * GET /api/vendors/:id
 * Get a single vendor by ID
 */
export const getVendor = async (req, res) => {
  try {
    const { id } = req.params;
    
    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res.status(404).json({
        ok: false,
        message: `Vendor ${id} not found`
      });
    }
    
    return res.status(200).json({
      ok: true,
      vendor
    });
  } catch (error) {
    console.error('Get vendor error:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error fetching vendor',
      error: error.message
    });
  }
};

/**
 * POST /api/vendors
 * Create a new vendor
 * Body: { name, contact_email, contact_person, phone, address, notes, active }
 */
export const createVendor = async (req, res) => {
  try {
    const { name, contact_email, contact_person, phone, address, notes, active } = req.body;
    
    if (!name) {
      return res.status(400).json({
        ok: false,
        message: 'Vendor name is required'
      });
    }
    
    // Check if email already exists
    if (contact_email) {
      const existing = await Vendor.findOne({ contact_email });
      if (existing) {
        return res.status(409).json({
          ok: false,
          message: `Vendor with email ${contact_email} already exists`
        });
      }
    }
    
    const vendor = new Vendor({
      name,
      contact_email,
      contact_person,
      phone,
      address,
      notes,
      active: active !== false // defaults to true
    });
    
    await vendor.save();
    
    return res.status(201).json({
      ok: true,
      vendor_id: vendor._id,
      vendor
    });
  } catch (error) {
    console.error('Create vendor error:', error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        ok: false,
        message: `Email already exists`
      });
    }
    
    return res.status(500).json({
      ok: false,
      message: 'Error creating vendor',
      error: error.message
    });
  }
};

/**
 * PUT /api/vendors/:id
 * Update a vendor
 * Body: { name, contact_email, contact_person, phone, address, notes, active }
 */
export const updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact_email, contact_person, phone, address, notes, active } = req.body;
    
    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res.status(404).json({
        ok: false,
        message: `Vendor ${id} not found`
      });
    }
    
    // Check for email conflict if changing email
    if (contact_email && contact_email !== vendor.contact_email) {
      const existing = await Vendor.findOne({ contact_email });
      if (existing) {
        return res.status(409).json({
          ok: false,
          message: `Email already in use by another vendor`
        });
      }
    }
    
    // Update fields
    if (name !== undefined) vendor.name = name;
    if (contact_email !== undefined) vendor.contact_email = contact_email;
    if (contact_person !== undefined) vendor.contact_person = contact_person;
    if (phone !== undefined) vendor.phone = phone;
    if (address !== undefined) vendor.address = address;
    if (notes !== undefined) vendor.notes = notes;
    if (active !== undefined) vendor.active = active;
    
    vendor.updated_at = new Date();
    
    await vendor.save();
    
    return res.status(200).json({
      ok: true,
      vendor_id: vendor._id,
      vendor
    });
  } catch (error) {
    console.error('Update vendor error:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        ok: false,
        message: `Email already in use`
      });
    }
    
    return res.status(500).json({
      ok: false,
      message: 'Error updating vendor',
      error: error.message
    });
  }
};

/**
 * DELETE /api/vendors/:id
 * Delete a vendor (soft delete by setting active=false)
 * Query param: hard=true for permanent deletion
 */
export const deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { hard } = req.query;
    
    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res.status(404).json({
        ok: false,
        message: `Vendor ${id} not found`
      });
    }
    
    if (hard === 'true') {
      // Hard delete
      await Vendor.findByIdAndDelete(id);
      return res.status(200).json({
        ok: true,
        message: 'Vendor permanently deleted',
        vendor_id: id
      });
    } else {
      // Soft delete
      vendor.active = false;
      vendor.updated_at = new Date();
      await vendor.save();
      
      return res.status(200).json({
        ok: true,
        message: 'Vendor deactivated',
        vendor_id: id,
        vendor
      });
    }
  } catch (error) {
    console.error('Delete vendor error:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error deleting vendor',
      error: error.message
    });
  }
};
