import React, { useState } from 'react';

const CreateRfpForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        type: 'RFP',
        dueDate: '',
        department: '',
        budget: '',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-100 dark:border-gray-800 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8 space-y-8">

                {/* Project Details */}
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">Project Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Project Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Enterprise CRM Migration 2026"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all font-medium placeholder-gray-400 dark:placeholder-gray-600 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Request Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all font-medium text-gray-900 dark:text-white"
                            >
                                <option value="RFP">Request for Proposal (RFP)</option>
                                <option value="RFI">Request for Information (RFI)</option>
                                <option value="RFQ">Request for Quote (RFQ)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Submission Deadline</label>
                            <input
                                type="date"
                                name="dueDate"
                                required
                                value={formData.dueDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all font-medium text-gray-900 dark:text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Department</label>
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all font-medium text-gray-900 dark:text-white"
                            >
                                <option value="">Select Department</option>
                                <option value="IT">Information Technology</option>
                                <option value="Marketing">Marketing</option>
                                <option value="HR">Human Resources</option>
                                <option value="Operations">Operations</option>
                                <option value="Finance">Finance</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Budget Range (Optional)</label>
                            <select
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all font-medium text-gray-900 dark:text-white"
                            >
                                <option value="">Select Range</option>
                                <option value="<50k">&lt; $50k</option>
                                <option value="50k-100k">$50k - $100k</option>
                                <option value="100k-500k">$100k - $500k</option>
                                <option value="500k+">$500k+</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Objectives */}
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">Scope & Objectives</h3>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Brief Description</label>
                        <textarea
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the high-level goals of this project..."
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all font-medium placeholder-gray-400 dark:placeholder-gray-600 text-gray-900 dark:text-white resize-none"
                        />
                    </div>
                </div>

                {/* AI Assistant Promo */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800 flex items-start gap-4">
                    <div className="p-2 bg-white dark:bg-indigo-900/50 rounded-lg shadow-sm text-indigo-600 dark:text-indigo-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-indigo-900 dark:text-indigo-200">BidSense AI Assistant</h4>
                        <p className="text-sm text-indigo-700/80 dark:text-indigo-400/80 mt-1">Once you create the project, our AI can help you draft the full requirements document based on your description.</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end space-x-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 transition-all transform hover:-translate-y-0.5"
                    >
                        Create & Start Editing
                    </button>
                </div>

            </form>
        </div>
    );
};

export default CreateRfpForm;
