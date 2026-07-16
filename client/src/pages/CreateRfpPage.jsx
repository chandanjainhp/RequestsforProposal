import React from 'react';
import { useNavigate } from 'react-router-dom';
import CreateRfpHeader from '../components/rfp/CreateRfpHeader';
import CreateRfpForm from '../components/rfp/CreateRfpForm';

const CreateRfpPage = () => {
    const navigate = useNavigate();

    const handleCreateRfp = (formData) => {
        // In a real app, this would create the record ID
        console.log('Creating RFP:', formData);
        navigate('/rfps/editor');
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50/50 dark:bg-black p-6 md:p-10 font-sans flex justify-center transition-colors duration-300">
            <div className="w-full max-w-3xl">

                {/* Header */}
                <CreateRfpHeader />

                {/* Main Form Card */}
                <CreateRfpForm
                    onSubmit={handleCreateRfp}
                    onCancel={() => navigate('/rfps')}
                />
            </div>
        </div>
    );
};

export default CreateRfpPage;
