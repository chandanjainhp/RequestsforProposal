import api from './axios';

// Get list of RFPs
export const getRfpList = async () => {
  const res = await api.get('/api/rfps');
  return res.data;
};

// Get proposals for RFP
export const getProposals = async (rfpId) => {
  const res = await api.get(`/api/rfps/${rfpId}/proposals`);
  return res.data;
};

// Get comparison data for RFP
export const getComparison = async (rfpId) => {
  const res = await api.get(`/api/rfps/${rfpId}/compare`);
  return res.data;
};

// Get detailed comparison
export const getComparisonDetails = async (rfpId) => {
  const res = await api.get(`/api/rfps/${rfpId}/compare/details`);
  return res.data;
};
