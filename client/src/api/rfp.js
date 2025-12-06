import api from './axios';

// Parse RFP from chat message
export const parseRfp = async (message) => {
  const res = await api.post('/api/rfp/parse', { message });
  return res.data;
};

// Save parsed RFP
export const saveRfp = async (payload) => {
  const res = await api.post('/api/rfps', { parsed_rfp: payload });
  return res.data;
};

// Get all RFPs
export const getRfps = async (params = {}) => {
  const res = await api.get('/api/rfps', { params });
  return res.data;
};

// Get single RFP
export const getRfp = async (id) => {
  const res = await api.get(`/api/rfps/${id}`);
  return res.data.rfp || res.data;
};

// Update RFP
export const updateRfp = async (id, payload) => {
  const res = await api.put(`/api/rfps/${id}`, payload);
  return res.data;
};

// Send RFP to vendors
export const sendRfp = async (id, vendorIds) => {
  // Accept either array directly or object with vendorIds/vendor_ids
  const ids = Array.isArray(vendorIds) ? vendorIds : (vendorIds.vendorIds || vendorIds.vendor_ids);
  const res = await api.post(`/api/rfps/${id}/send`, { vendorIds: ids });
  return res.data;
};
