import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vendorSchema } from '../../schemas/vendorSchema';

const AddVendorForm = ({ onSubmit }) => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(vendorSchema),
        defaultValues: {
            name: '',
            industry: '',
            website: '',
            contactName: '',
            email: '',
            phone: '',
            status: 'Pending',
            notes: ''
        }
    });

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-100 dark:border-gray-800 overflow-hidden">
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">

                {/* Section: Company Info */}
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">Company Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Company Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                {...register('name')}
                                placeholder="e.g. Acme Corp"
                                className={`w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all font-medium placeholder-gray-400 dark:placeholder-gray-600 text-gray-900 dark:text-white ${errors.name ? 'border-red-300 focus:ring-red-500/20' : ''}`}
                            />
                            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Industry / Sector</label>
                            <select
                                {...register('industry')}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all font-medium text-gray-900 dark:text-white"
                            >
                                <option value="">Select Industry</option>
                                <option value="IT Infrastructure">IT Infrastructure</option>
                                <option value="Software Development">Software Development</option>
                                <option value="Logistics">Logistics</option>
                                <option value="Facilities">Facilities</option>
                                <option value="Consulting">Consulting</option>
                                <option value="Manufacturing">Manufacturing</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.industry && <p className="text-xs text-red-500">{errors.industry.message}</p>}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Website URL</label>
                            <input
                                type="url"
                                {...register('website')}
                                placeholder="https://..."
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all font-medium placeholder-gray-400 dark:placeholder-gray-600 text-gray-900 dark:text-white"
                            />
                            {errors.website && <p className="text-xs text-red-500">{errors.website.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Section: Contact Person */}
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">Primary Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Contact Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                {...register('contactName')}
                                placeholder="John Doe"
                                className={`w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all font-medium placeholder-gray-400 dark:placeholder-gray-600 text-gray-900 dark:text-white ${errors.contactName ? 'border-red-300 focus:ring-red-500/20' : ''}`}
                            />
                            {errors.contactName && <p className="text-xs text-red-500">{errors.contactName.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Email Address <span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                {...register('email')}
                                placeholder="john@company.com"
                                className={`w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all font-medium placeholder-gray-400 dark:placeholder-gray-600 text-gray-900 dark:text-white ${errors.email ? 'border-red-300 focus:ring-red-500/20' : ''}`}
                            />
                            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Phone Number</label>
                            <input
                                type="tel"
                                {...register('phone')}
                                placeholder="+1 (555) 000-0000"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all font-medium placeholder-gray-400 dark:placeholder-gray-600 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Initial Status</label>
                            <select
                                {...register('status')}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all font-medium text-gray-900 dark:text-white"
                            >
                                <option value="Pending">Pending Approval</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section: Notes */}
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">Additional Notes</h3>
                    <textarea
                        {...register('notes')}
                        rows="3"
                        placeholder="Any specific details, certifications, or internal notes..."
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all font-medium placeholder-gray-400 dark:placeholder-gray-600 text-gray-900 dark:text-white resize-none"
                    />
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/vendors')}
                        className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        Create Vendor
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddVendorForm;
