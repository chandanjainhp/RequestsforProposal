import React, { useState } from 'react';
import SettingsSidebar from '../components/settings/SettingsSidebar';
import ProfileSettings from '../components/settings/ProfileSettings';
import SecuritySettings from '../components/settings/SecuritySettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import AiPreferences from '../components/settings/AiPreferences';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [isAiAutoPilot, setIsAiAutoPilot] = useState(true);

  // --- Static Form State ---
  const [profile, setProfile] = useState({
    fullName: 'Michael Ross',
    email: 'michael.ross@enterprise.com',
    role: 'Lead Procurement Manager',
    timezone: '(GMT-08:00) Pacific Time',
    avatar: '' // Placeholder for image URL
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-black p-6 md:p-10 font-sans transition-colors duration-300">

      {/* --- Page Header --- */}
      <header className="max-w-6xl mx-auto mb-10">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Account Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Manage your profile, security preferences, and BidSense AI configurations.</p>
      </header>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* --- Side Navigation --- */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* --- Settings Content Area --- */}
        <main className="flex-1 bg-white dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 transition-colors">

          {activeTab === 'Profile' && <ProfileSettings profile={profile} />}

          {activeTab === 'Security' && <SecuritySettings />}

          {activeTab === 'Notifications' && <NotificationSettings />}

          {activeTab === 'AI Preferences' && (
            <AiPreferences isAiAutoPilot={isAiAutoPilot} setIsAiAutoPilot={setIsAiAutoPilot} />
          )}

        </main>
      </div>
    </div>
  );
};

export default SettingsPage;