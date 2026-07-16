import React, { useState } from 'react';
import AddVendorHeader from '../components/vendor/AddVendorHeader';
import AddVendorForm from '../components/vendor/AddVendorForm';
import { useNavigate } from 'react-router-dom';

const AddVendorPage = () => {
    const navigate = useNavigate();
    const handleSubmit = (data) => {
        // In a real app, this would send data to the backend
        console.log('Submitting Vendor Data:', data);

        // Simulate API call delay
        setTimeout(() => {
            navigate('/vendors');
        }, 500);
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50/50 p-6 md:p-10 font-sans flex justify-center">

            <div className="w-full max-w-3xl">
                {/* Header */}
                <AddVendorHeader />

                {/* Form Card */}
                <AddVendorForm
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
};

export default AddVendorPage;
