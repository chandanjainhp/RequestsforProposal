import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SendRfpHeader from '../components/rfp/SendRfpHeader';
import RfpSelection from '../components/rfp/RfpSelection';
import InvitationMessage from '../components/rfp/InvitationMessage';
import VendorSelection from '../components/rfp/VendorSelection';

const SendRfpPage = () => {
    const navigate = useNavigate();
    const [selectedRfp, setSelectedRfp] = useState('');
    const [selectedVendors, setSelectedVendors] = useState([]);
    const [message, setMessage] = useState({ subject: '', body: '' });
    const [isSending, setIsSending] = useState(false);

    // Mock Data
    const rfps = [
        { id: 1, title: 'Cloud Infrastructure Migration - Q1 2026', status: 'Draft' },
        { id: 2, title: 'Corporate Security Audit Services', status: 'Approved' },
        { id: 3, title: 'Employee Wellness Platform', status: 'Draft' },
    ];

    const vendors = [
        { id: 1, name: 'CloudNet Solutions', industry: 'IT Infrastructure', email: 'sales@cloudnet.com' },
        { id: 2, name: 'SecureGuard Cyber', industry: 'Security', email: 'contact@secureguard.io' },
        { id: 3, name: 'Alpha Dev Studio', industry: 'Software', email: 'biz@alphastudio.co' },
        { id: 4, name: 'Global Logistics Partners', industry: 'Logistics', email: 'rfp@globallogistics.com' },
        { id: 5, name: 'GreenEnergy Grid', industry: 'Utilities', email: 'hello@greenenergy.com' },
    ];

    const toggleVendor = (id) => {
        setSelectedVendors(prev =>
            prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
        );
    };

    const handleSend = () => {
        if (!selectedRfp || selectedVendors.length === 0) return;

        setIsSending(true);
        setTimeout(() => {
            setIsSending(false);
            navigate('/rfps'); // Redirect back to Rfp list after sending
        }, 1500);
    };

    const canSend = selectedRfp && selectedVendors.length > 0;

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50/50 dark:bg-black p-6 md:p-10 font-sans flex justify-center">
            <div className="w-full max-w-5xl">

                {/* Header */}
                <SendRfpHeader />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Selection Workflow */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Step 1: Select RFP */}
                        <RfpSelection
                            rfps={rfps}
                            selectedRfp={selectedRfp}
                            setSelectedRfp={setSelectedRfp}
                        />

                        {/* Step 2: Message Configuration */}
                        <InvitationMessage
                            message={message}
                            setMessage={setMessage}
                        />

                    </div>

                    {/* Right Column: Vendor Selection */}
                    <div className="lg:col-span-1">
                        <VendorSelection
                            vendors={vendors}
                            selectedVendors={selectedVendors}
                            toggleVendor={toggleVendor}
                            onSend={handleSend}
                            isSending={isSending}
                            canSend={canSend}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SendRfpPage;
