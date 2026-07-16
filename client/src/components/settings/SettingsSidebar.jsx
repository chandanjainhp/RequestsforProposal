import React from 'react';

const SettingsSidebar = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { name: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        { name: 'Security', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
        { name: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
        { name: 'AI Preferences', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
    ];

    return (
        <aside className="w-full lg:w-64 flex-shrink-0">
            <nav className="flex lg:flex-col bg-white/50 dark:bg-gray-800/50 backdrop-blur-md p-1 lg:p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-x-auto lg:overflow-visible space-y-0 lg:space-y-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 mb-1 lg:w-full ${activeTab === tab.name
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                            }`}
                    >
                        <svg className={`w-5 h-5 mr-3 hidden lg:block ${activeTab === tab.name ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
                        </svg>
                        {tab.name}
                    </button>
                ))}
            </nav>
        </aside>
    );
};

export default SettingsSidebar;
