import React, { useState } from 'react';
import HistoryHeader from '../components/rfp/HistoryHeader';
import HistoryFilterBar from '../components/rfp/HistoryFilterBar';
import HistoryTimeline from '../components/rfp/HistoryTimeline';

const HistoryPage = () => {
  // --- Mock Data: History Entries ---
  const [historyItems] = useState([
    {
      id: 1,
      type: 'rfp',
      action: 'RFP Published',
      entity: 'Cloud Infrastructure Migration 2026',
      user: 'Sarah Chen (Admin)',
      time: '10:45 AM',
      date: 'Today',
      description: 'The RFP was successfully published and 12 vendors were notified.',
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      id: 2,
      type: 'ai',
      action: 'AI Scoring Completed',
      entity: 'IT Services Proposal - TechFlow',
      user: 'BidSense AI',
      time: '09:30 AM',
      date: 'Today',
      description: 'AI analysis completed with a confidence score of 94%. High alignment detected.',
      color: 'bg-cyan-100 text-cyan-600'
    },
    {
      id: 3,
      type: 'proposal',
      action: 'Proposal Submitted',
      entity: 'Security Software Suite',
      user: 'CyberGuard Inc.',
      time: '04:15 PM',
      date: 'Yesterday',
      description: 'A new proposal was received for the Security Software RFP.',
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      id: 4,
      type: 'rfp',
      action: 'RFP Edited',
      entity: 'Global Logistics Partner',
      user: 'Michael Ross',
      time: '02:00 PM',
      date: 'Yesterday',
      description: 'Evaluation criteria weights were adjusted in Section 4.',
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      id: 5,
      type: 'vendor',
      action: 'Vendor Access Requested',
      entity: 'Nexus Core',
      user: 'System Admin',
      time: '11:20 AM',
      date: 'Jan 18, 2026',
      description: 'New vendor registration request received for verification.',
      color: 'bg-amber-100 text-amber-600'
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-6 md:p-10 font-sans transition-colors duration-300">

      {/* 1️⃣ Page Header */}
      <HistoryHeader />

      {/* 2️⃣ Filter Bar */}
      <HistoryFilterBar />

      {/* 3️⃣ History Timeline / List */}
      <HistoryTimeline historyItems={historyItems} />

    </div>
  );
};

export default HistoryPage;