import React from 'react';

const FlowCardGrid = ({ children }) => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
                {/* Decorative connection line could go here */}
                {children}
            </div>
        </div>
    );
};

export default FlowCardGrid;
