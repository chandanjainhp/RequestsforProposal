import React, { useState } from 'react';
import RfpEditorHeader from '../components/rfp/RfpEditorHeader';
import RfpDocumentEditor from '../components/rfp/RfpDocumentEditor';
import RfpAiAssistant from '../components/rfp/RfpAiAssistant';

const RfpEditorPage = () => {
  // --- Metadata State ---
  const [rfpTitle, setRfpTitle] = useState('Enterprise Cloud Infrastructure Migration');
  const [status, setStatus] = useState('Draft');
  const [deadline, setDeadline] = useState('2026-03-24');

  // --- RFP Document Structure State ---
  const [sections, setSections] = useState([
    { id: '1', title: 'Introduction', content: 'This RFP seeks proposals for a multi-year partnership to migrate our legacy on-premise infrastructure to a secure, scalable cloud environment.', placeholder: 'Describe the purpose of this RFP...' },
    { id: '2', title: 'Scope of Work', content: 'Phase 1: Readiness Assessment\nPhase 2: Data Migration\nPhase 3: Optimization and Training.', placeholder: 'Define deliverables and requirements...' },
    { id: '3', title: 'Eligibility Criteria', content: 'Vendors must demonstrate a minimum of 10 years experience in public sector cloud migrations.', placeholder: 'List vendor qualifications...' },
    { id: '4', title: 'Evaluation Criteria', content: 'Technical Alignment: 40%\nCost Efficiency: 30%\nSecurity Compliance: 30%', placeholder: 'Explain scoring methodology...' },
  ]);

  const [aiInsight, setAiInsight] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // --- Logic Handlers ---
  const handleUpdateSection = (id, value) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, content: value } : s));
  };

  const handleAddSection = () => {
    const newId = Date.now().toString();
    setSections([...sections, { id: newId, title: 'New Section', content: '', placeholder: 'Start writing...' }]);
  };

  const simulateAiAction = (action) => {
    setIsAiLoading(true);
    setAiInsight(null);
    setTimeout(() => {
      setIsAiLoading(false);
      setAiInsight(`Recommendation for ${action}: Based on similar industry benchmarks, your "Eligibility Criteria" is slightly restrictive. Consider softening the experience requirement to 7 years to increase vendor participation.`);
    }, 1200);
  };

  const handleSave = () => {
    console.log("Saving draft...");
  };

  const handlePublish = () => {
    console.log("Publishing RFP...");
    setStatus('Active');
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-black font-sans pb-20 transition-colors duration-300">

      {/* 1️⃣ Top Header – RFP Metadata Bar */}
      <RfpEditorHeader
        rfpTitle={rfpTitle}
        setRfpTitle={setRfpTitle}
        status={status}
        deadline={deadline}
        setDeadline={setDeadline}
        onSave={handleSave}
        onPublish={handlePublish}
      />

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-6 mt-10">

        {/* 2️⃣ Main Editor Area (Document View) */}
        <div className="flex-1 space-y-6">
          <RfpDocumentEditor
            sections={sections}
            onUpdateSection={handleUpdateSection}
            onAddSection={handleAddSection}
          />
        </div>

        {/* 3️⃣ Right Panel – BidSense AI Assistant */}
        <RfpAiAssistant
          isAiLoading={isAiLoading}
          aiInsight={aiInsight}
          onAiAction={simulateAiAction}
        />

      </div>
    </div>
  );
};

export default RfpEditorPage;