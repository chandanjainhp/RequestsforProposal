import React, { useState, useEffect, useRef } from 'react';
import RfpListHeader from '../components/rfp/RfpListHeader';
import RfpFilterBar from '../components/rfp/RfpFilterBar';
import RfpCard from '../components/rfp/RfpCard';
import SEO from '../components/common/SEO';
import { useToast } from '../context/ToastContext';

const RfpListGallery = () => {
  const { info } = useToast();
  const hasShownToast = useRef(false);

  // --- Mock Data ---
  const [rfps] = useState([
    { id: 1, title: 'Cloud Infrastructure Migration', status: 'Active', deadline: '2026-03-15', vendors: 12, proposals: 8, aiStatus: 'Analysis Complete', progress: 75 },
    { id: 2, title: 'Enterprise Security Software', status: 'Draft', deadline: '2026-04-01', vendors: 0, proposals: 0, aiStatus: 'Optimization Ready', progress: 30 },
    { id: 3, title: 'AI Implementation Consultancy', status: 'Evaluation', deadline: '2025-12-20', vendors: 5, proposals: 5, aiStatus: 'Scoring Finalized', progress: 100 },
    { id: 4, title: 'Global Logistics Partner', status: 'Active', deadline: '2026-05-10', vendors: 24, proposals: 14, aiStatus: 'Monitoring Bids', progress: 45 },
    { id: 5, title: 'Facility Management 2026', status: 'Closed', deadline: '2026-01-05', vendors: 8, proposals: 8, aiStatus: 'Archived', progress: 100 },
    { id: 6, title: 'Network Hardware Refresh', status: 'Active', deadline: '2026-03-22', vendors: 4, proposals: 2, aiStatus: 'Low Participation Alert', progress: 20 },
  ]);

  useEffect(() => {
    if (!hasShownToast.current) {
      hasShownToast.current = true;
      const activeCount = rfps.filter(r => r.status === 'Active').length;
      info(`You have ${activeCount} active RFPs in progress.`);
    }
  }, []);

  const [filter, setFilter] = useState('All');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-6 md:p-10 font-sans">
      <SEO title="RFP Gallery" description="View and manage all your active and historical RFPs." />

      {/* --- Header Section --- */}
      <RfpListHeader />

      {/* --- Filter Bar --- */}
      <RfpFilterBar filter={filter} setFilter={setFilter} />

      {/* --- Gallery Grid --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rfps.filter(r => filter === 'All' || r.status === filter).map((rfp) => (
          <RfpCard key={rfp.id} rfp={rfp} />
        ))}
      </div>

      {/* --- Footer Pagination --- */}
      <footer className="max-w-7xl mx-auto mt-12 flex items-center justify-center space-x-4">
        <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-indigo-600 disabled:opacity-30" disabled>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span className="text-sm font-bold text-gray-500">Page 1 of 4</span>
        <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-indigo-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </footer>
    </div>
  );
};

export default RfpListGallery;