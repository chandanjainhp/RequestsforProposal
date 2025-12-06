import api from './axios';

// Get all vendors
export const getVendors = async (params = {}) => {
  const res = await api.get('/api/vendors', { params });
  return res.data;
};

// Get single vendor
export const getVendor = async (id) => {
  const res = await api.get(`/api/vendors/${id}`);
  return res.data;
};

// Create vendor
export const createVendor = async (payload) => {
  const res = await api.post('/api/vendors', payload);
  return res.data;
};

// Update vendor
export const updateVendor = async (id, payload) => {
  const res = await api.put(`/api/vendors/${id}`, payload);
  return res.data;
};

// Delete vendor
export const deleteVendor = async (id, hard = false) => {
  const res = await api.delete(`/api/vendors/${id}`, {
    params: hard ? { hard: 'true' } : {},
  });
  return res.data;
};
