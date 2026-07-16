import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VendorTable = ({ filteredVendors }) => {
    const navigate = useNavigate();
    const [openMenuId, setOpenMenuId] = useState(null);

    const getScoreColor = (score) => {
        if (score >= 90) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-900/50';
        if (score >= 80) return 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 border-indigo-100 dark:border-indigo-900/50';
        if (score >= 70) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border-amber-100 dark:border-amber-900/50';
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-100 dark:border-red-900/50';
    };

    const toggleMenu = (vendorId) => {
        setOpenMenuId(openMenuId === vendorId ? null : vendorId);
    };

    const handleViewDetails = (vendorId) => {
        // Navigate to vendor detail page or open modal
        console.log('View details for vendor:', vendorId);
        setOpenMenuId(null);
    };

    const handleEdit = (vendorId) => {
        navigate(`/vendors/edit/${vendorId}`);
        setOpenMenuId(null);
    };

    const handleDelete = (vendorId) => {
        if (confirm('Are you sure you want to delete this vendor?')) {
            console.log('Delete vendor:', vendorId);
            setOpenMenuId(null);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
                            <th className="px-6 py-5">Company Name</th>
                            <th className="px-6 py-5">Industry</th>
                            <th className="px-6 py-5">Contact</th>
                            <th className="px-6 py-5">Performance</th>
                            <th className="px-6 py-5">Status</th>
                            <th className="px-6 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                        {filteredVendors.map((vendor) => (
                            <tr key={vendor.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold text-lg mr-4 group-hover:from-indigo-100 group-hover:to-indigo-200 dark:group-hover:from-indigo-900/50 dark:group-hover:to-indigo-800/50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all">
                                            {vendor.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white">{vendor.name}</p>
                                            <p className="text-[10px] text-gray-400 font-medium">{vendor.projects} Active Projects</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                                    {vendor.industry}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-medium font-mono">
                                    {vendor.contact}
                                </td>
                                <td className="px-6 py-4">
                                    <div className={`inline-flex items-center px-2.5 py-1 rounded-md border text-xs font-bold ${getScoreColor(vendor.score)}`}>
                                        <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        {vendor.score}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${vendor.status === 'Active' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50' :
                                        vendor.status === 'Pending' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50' :
                                            'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${vendor.status === 'Active' ? 'bg-green-500' :
                                            vendor.status === 'Pending' ? 'bg-amber-500' :
                                                'bg-gray-500'
                                            }`}></span>
                                        {vendor.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right relative">
                                    <button
                                        onClick={() => toggleMenu(vendor.id)}
                                        className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {openMenuId === vendor.id && (
                                        <div className="absolute right-8 top-12 z-50 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 animate-in fade-in zoom-in-95 duration-200">
                                            <button
                                                onClick={() => handleViewDetails(vendor.id)}
                                                className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                View Details
                                            </button>
                                            <button
                                                onClick={() => handleEdit(vendor.id)}
                                                className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                Edit Vendor
                                            </button>
                                            <div className="my-1 border-t border-gray-100 dark:border-gray-700"></div>
                                            <button
                                                onClick={() => handleDelete(vendor.id)}
                                                className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                Delete Vendor
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Empty State */}
                {filteredVendors.length === 0 && (
                    <div className="p-10 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-gray-900 dark:text-white font-bold mb-1">No vendors found</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Try adjusting your filters or search term.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorTable;
