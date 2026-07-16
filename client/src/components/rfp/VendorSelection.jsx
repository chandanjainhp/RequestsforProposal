import React, { useState } from 'react';

const VendorSelection = ({ vendors, selectedVendors, toggleVendor, onSend, isSending, canSend }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredVendors = vendors.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.industry.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 h-full flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
                <div className="flex items-center">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs mr-3">3</span>
                    Select Vendors
                </div>
                <span className="text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-lg">{selectedVendors.length} Selected</span>
            </h3>

            <div className="relative mb-4">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                    type="text"
                    placeholder="Search vendors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm border-transparent focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
                />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 max-h-[400px] pr-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
                {filteredVendors.map(vendor => (
                    <div
                        key={vendor.id}
                        onClick={() => toggleVendor(vendor.id)}
                        className={`p-3 rounded-xl border flex items-center space-x-3 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800 ${selectedVendors.includes(vendor.id) ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/20' : 'border-gray-100 dark:border-gray-800'}`}
                    >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedVendors.includes(vendor.id) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'}`}>
                            {selectedVendors.includes(vendor.id) && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{vendor.name}</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400">{vendor.industry}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                <button
                    onClick={onSend}
                    disabled={!canSend || isSending}
                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center shadow-lg transition-all ${(!canSend) ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed shadow-none' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 dark:hover:shadow-indigo-900/40 transform hover:-translate-y-0.5'}`}
                >
                    {isSending ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Sending...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                            Send Invites ({selectedVendors.length})
                        </>
                    )}
                </button>
            </div>

        </div>
    );
};

export default VendorSelection;
