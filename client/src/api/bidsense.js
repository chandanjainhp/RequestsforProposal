import api from './axios';

// Parse BidSense from chat message
export const parseBidSense = async (message) => {
  const res = await api.post('/api/bidsense/parse', { message });
  return res.data;
};

// Save parsed BidSense
export const saveBidSense = async (payload) => {
  const res = await api.post('/api/bidsense', { parsed_bidsense: payload });
  return res.data;
};

// Get all BidSenses
export const getBidSenses = async (params = {}) => {
  const res = await api.get('/api/bidsense', { params });
  return res.data;
};

// Get single BidSense
export const getBidSense = async (id) => {
  const res = await api.get(`/api/bidsense/${id}`);
  return res.data.bidsense || res.data;
};

// Update BidSense
export const updateBidSense = async (id, payload) => {
  const res = await api.put(`/api/bidsense/${id}`, payload);
  return res.data;
};

// Send RFP to vendors
export const sendRfp = async (id, vendorIds) => {
  // Accept either array directly or object with vendorIds/vendor_ids
  const ids = Array.isArray(vendorIds) ? vendorIds : (vendorIds.vendorIds || vendorIds.vendor_ids);
  const res = await api.post(`/api/rfps/${id}/send`, { vendorIds: ids });
  return res.data;
};
