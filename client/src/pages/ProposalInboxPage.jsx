import React, { useState, useEffect, useRef } from 'react';
import SEO from '../components/common/SEO';
import ReviewProposal from '../components/ReviewProposal';
import ProposalHeader from '../components/proposal/ProposalHeader';
import ProposalFilters from '../components/proposal/ProposalFilters';
import ProposalTable from '../components/proposal/ProposalTable';
import { useToast } from '../context/ToastContext';

const ProposalInboxPage = () => {
  const { warning } = useToast();
  const hasShownToast = useRef(false);

  // --- Mock Data ---
  const [proposals] = useState([
    { id: 1, vendor: 'TechFlow Systems', rfp: 'Cloud Migration 2026', date: '2026-01-12', status: 'Scored', score: 94, amount: '$120,000', aiInsight: 'Highest technical alignment' },
    { id: 2, vendor: 'Global IT Solutions', rfp: 'Cloud Migration 2026', date: '2026-01-14', status: 'Scored', score: 82, amount: '$98,000', aiInsight: 'Cost-effective leader' },
    { id: 3, vendor: 'CyberGuard Inc', rfp: 'Security Software', date: '2026-01-15', status: 'Under Review', score: 76, amount: '$45,000', aiInsight: 'Security gaps detected' },
    { id: 4, vendor: 'Nexus Core', rfp: 'Cloud Migration 2026', date: '2026-01-16', status: 'Pending', score: null, amount: '$150,000', aiInsight: 'Awaiting AI analysis' },
    { id: 5, vendor: 'DataBridge Ltd', rfp: 'AI Implementation', date: '2026-01-17', status: 'Scored', score: 89, amount: '$210,000', aiInsight: 'Strong past performance' },
  ]);

  useEffect(() => {
    if (!hasShownToast.current) {
      hasShownToast.current = true;
      const pendingCount = proposals.filter(p => p.status === 'Pending' || p.status === 'Under Review').length;
      if (pendingCount > 0) {
        warning(`${pendingCount} proposal(s) require your attention.`);
      }
    }
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);

  const handleOpenReview = (proposal) => {
    setSelectedProposal(proposal);
    setIsReviewOpen(true);
  };

  const handleCloseReview = () => {
    setIsReviewOpen(false);
    setSelectedProposal(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-4 md:p-8 font-sans transition-colors duration-300">
      <SEO title="Proposal Inbox" />

      {/* 1. Header Section */}
      <ProposalHeader />

      {/* --- Filters & Search Bar --- */}
      <ProposalFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* --- Proposals Table --- */}
      <ProposalTable proposals={proposals} onReview={handleOpenReview} />

      {/* --- Review Proposal Slide-over --- */}
      <ReviewProposal
        isOpen={isReviewOpen}
        onClose={handleCloseReview}
        proposal={selectedProposal}
      />

    </div>
  );
};

export default ProposalInboxPage;