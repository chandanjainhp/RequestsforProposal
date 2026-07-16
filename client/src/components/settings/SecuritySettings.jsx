import React from 'react';

const SecuritySettings = () => {
    return (
        <div className="animate-in fade-in duration-500">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Security & Login</h3>

            <div className="space-y-6">
                <div>
                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">Change Password</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Current Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all font-medium text-gray-900 dark:text-white"
                            />
                        </div>
                        <div className="space-y-1.5 md:col-start-1">
                            <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">New Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all font-medium text-gray-900 dark:text-white"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Confirm New Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all font-medium text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-indigo-600 dark:hover:bg-gray-100 transition-all text-sm shadow-lg shadow-gray-200 dark:shadow-none">
                            Update Password
                        </button>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4">Two-Factor Authentication</h4>
                    <div className="flex items-center justify-between p-4 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
                        <div>
                            <p className="font-bold text-indigo-900 dark:text-indigo-200 text-sm">Enable 2FA</p>
                            <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70 font-medium">Secure your account with an additional layer of protection.</p>
                        </div>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none hover:bg-gray-300 dark:hover:bg-gray-600">
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecuritySettings;
