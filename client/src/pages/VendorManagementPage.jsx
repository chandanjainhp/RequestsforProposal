import React, { useState, useEffect, useRef } from 'react';
import VendorHeader from '../components/vendor/VendorHeader';
import VendorMetrics from '../components/vendor/VendorMetrics';
import VendorFilterBar from '../components/vendor/VendorFilterBar';
import VendorTable from '../components/vendor/VendorTable';
import { useToast } from '../context/ToastContext';

const VendorManagementPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const { success } = useToast();
    const hasShownToast = useRef(false);

    const vendors = [
        { id: 1, name: 'CloudNet Solutions', industry: 'IT Infrastructure', contact: 'sarah@cloudnet.com', score: 92, status: 'Active', projects: 4 },
        { id: 2, name: 'SecureGuard Cyber', industry: 'Security Services', contact: 'mike@secureguard.io', score: 88, status: 'Active', projects: 2 },
        { id: 3, name: 'Global Logistics Partners', industry: 'Logistics', contact: 'ops@globallogistics.com', score: 76, status: 'Pending', projects: 1 },
        { id: 4, name: 'Alpha Dev Studio', industry: 'Software Development', contact: 'dev@alphastudio.co', score: 95, status: 'Active', projects: 6 },
        { id: 5, name: 'Office Supply Co.', industry: 'Facilities', contact: 'sales@officesupply.com', score: 82, status: 'Inactive', projects: 0 },
        { id: 6, name: 'GreenEnergy Grid', industry: 'Utilities', contact: 'energy@greenenergy.com', score: 89, status: 'Active', projects: 3 },
    ];

    useEffect(() => {
        if (!hasShownToast.current) {
            hasShownToast.current = true;
            const activeCount = vendors.filter(v => v.status === 'Active').length;
            success(`${activeCount} active vendors in your network.`);
        }
    }, []);

    const filteredVendors = vendors.filter(vendor => {
        const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.industry.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || vendor.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-black p-6 md:p-10 font-sans transition-colors duration-300">

            {/* Page Header */}
            <VendorHeader />

            {/* Metrics Overview */}
            <VendorMetrics />

            {/* Content Container */}
            <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8 transition-colors">

                {/* Filters & Search */}
                <VendorFilterBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                />

                {/* Vendors Table */}
                <VendorTable filteredVendors={filteredVendors} />
            </div>

        </div>
    );
};

export default VendorManagementPage;
