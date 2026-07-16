import React from 'react';

const MobileOverlay = ({ isSidebarOpen, onClose }) => {
    if (!isSidebarOpen) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 lg:hidden"
        />
    );
};

export default MobileOverlay;
