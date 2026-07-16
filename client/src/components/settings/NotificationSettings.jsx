import React from 'react';

const NotificationSettings = () => {
    return (
        <div className="animate-in fade-in duration-500">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Notification Channels</h3>
            <div className="space-y-4">
                {[
                    { title: 'Email Updates', desc: 'Daily summary of RFP activity and vendor bids.' },
                    { title: 'Push Notifications', desc: 'Immediate alerts for high-risk flags detected by AI.' },
                    { title: 'SMS Alerts', desc: 'Critical deadline reminders (24h before close).' }
                ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
                        <div>
                            <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">{item.title}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{item.desc}</p>
                        </div>
                        <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none">
                            <span className="inline-block h-3 w-3 translate-x-1 transform rounded-full bg-white transition-transform" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationSettings;
