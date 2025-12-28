import React, { useState } from 'react';
import { Save, Bell, Lock, Globe, Mail, Database, Shield, AlertCircle } from 'lucide-react';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'integrations', label: 'Integrations', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-[#FFFFE3] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-[640] text-[#4A4A4A] mb-2">Settings</h1>
          <p className="text-base text-[#6D8196] font-[460]">Configure platform settings and preferences</p>
        </div>

        {/* Layout with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-[#FFFFE3] border border-[#CBCBCB] rounded-[14px] p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-[10px] font-[560] text-sm transition-colors mb-1 last:mb-0 ${
                    activeTab === tab.id
                      ? 'bg-[#6D8196] text-[#FFFFE3]'
                      : 'text-[#4A4A4A] hover:bg-[#6D8196] hover:bg-opacity-10'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-[#FFFFE3] border border-[#CBCBCB] rounded-[14px] p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div>
                  <h2 className="text-xl font-[640] text-[#4A4A4A] mb-6">General Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-[560] text-[#4A4A4A] mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Acme Corporation"
                        className="w-full px-4 py-3 bg-[#FFFFE3] border border-[#CBCBCB] rounded-[10px] text-[#4A4A4A] focus:outline-none focus:border-[#6D8196]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-[560] text-[#4A4A4A] mb-2">
                        Time Zone
                      </label>
                      <select className="w-full px-4 py-3 bg-[#FFFFE3] border border-[#CBCBCB] rounded-[10px] text-[#4A4A4A] focus:outline-none focus:border-[#6D8196]">
                        <option>UTC-08:00 (Pacific Time)</option>
                        <option>UTC-05:00 (Eastern Time)</option>
                        <option>UTC+00:00 (GMT)</option>
                        <option>UTC+05:30 (India Standard Time)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-[560] text-[#4A4A4A] mb-2">
                        Default Currency
                      </label>
                      <select className="w-full px-4 py-3 bg-[#FFFFE3] border border-[#CBCBCB] rounded-[10px] text-[#4A4A4A] focus:outline-none focus:border-[#6D8196]">
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                        <option>INR (₹)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-[560] text-[#4A4A4A] mb-2">
                        Date Format
                      </label>
                      <select className="w-full px-4 py-3 bg-[#FFFFE3] border border-[#CBCBCB] rounded-[10px] text-[#4A4A4A] focus:outline-none focus:border-[#6D8196]">
                        <option>MM/DD/YYYY</option>
                        <option>DD/MM/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-[640] text-[#4A4A4A] mb-6">Notification Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="border-b border-[#CBCBCB] pb-4">
                      <h3 className="font-[560] text-[#4A4A4A] mb-4">Email Notifications</h3>
                      <div className="space-y-3">
                        {[
                          { label: 'New RFP submissions', description: 'Receive email when a new RFP is created' },
                          { label: 'Proposal received', description: 'Notify when vendors submit proposals' },
                          { label: 'Deadline reminders', description: 'Get reminders 24 hours before deadlines' },
                          { label: 'System updates', description: 'Important platform updates and announcements' },
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-[10px]">
                            <div className="flex-1">
                              <p className="font-[560] text-[#4A4A4A] mb-1">{item.label}</p>
                              <p className="text-sm text-[#6D8196]">{item.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" defaultChecked className="sr-only peer" />
                              <div className="w-11 h-6 bg-[#CBCBCB] rounded-full peer peer-checked:bg-[#6D8196] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-[560] text-[#4A4A4A] mb-4">Push Notifications</h3>
                      <div className="space-y-3">
                        {[
                          { label: 'Browser notifications', description: 'Show desktop notifications' },
                          { label: 'Sound alerts', description: 'Play sound for important notifications' },
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-[10px]">
                            <div className="flex-1">
                              <p className="font-[560] text-[#4A4A4A] mb-1">{item.label}</p>
                              <p className="text-sm text-[#6D8196]">{item.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-11 h-6 bg-[#CBCBCB] rounded-full peer peer-checked:bg-[#6D8196] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-[640] text-[#4A4A4A] mb-6">Security Settings</h2>
                  
                  {/* Info Alert */}
                  <div className="bg-[#EAF0F4] border-l-4 border-[#6D8196] p-4 rounded-lg mb-6 flex gap-3">
                    <Shield size={20} className="text-[#4F6478] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-[560] text-[#4F6478] mb-1">Security Status: Strong</p>
                      <p className="text-sm text-[#4F6478]">Your account security settings meet all recommended standards.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="border-b border-[#CBCBCB] pb-4">
                      <h3 className="font-[560] text-[#4A4A4A] mb-4">Authentication</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-[10px]">
                          <div className="flex-1">
                            <p className="font-[560] text-[#4A4A4A] mb-1">Two-Factor Authentication</p>
                            <p className="text-sm text-[#6D8196]">Add an extra layer of security</p>
                          </div>
                          <button className="bg-[#6D8196] text-[#FFFFE3] font-[600] py-2 px-4 rounded-[10px] hover:bg-[#5A6B7F] transition-colors text-sm">
                            Enable
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white rounded-[10px]">
                          <div className="flex-1">
                            <p className="font-[560] text-[#4A4A4A] mb-1">Session Timeout</p>
                            <p className="text-sm text-[#6D8196]">Automatically log out after inactivity</p>
                          </div>
                          <select className="px-3 py-2 bg-[#FFFFE3] border border-[#CBCBCB] rounded-[10px] text-sm text-[#4A4A4A] focus:outline-none focus:border-[#6D8196]">
                            <option>15 minutes</option>
                            <option>30 minutes</option>
                            <option>1 hour</option>
                            <option>4 hours</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-[560] text-[#4A4A4A] mb-4">Password Policy</h3>
                      <div className="space-y-3">
                        {[
                          { label: 'Minimum 8 characters', enabled: true },
                          { label: 'Require uppercase letters', enabled: true },
                          { label: 'Require numbers', enabled: true },
                          { label: 'Require special characters', enabled: false },
                          { label: 'Password expiration (90 days)', enabled: false },
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-[10px]">
                            <p className="text-[#4A4A4A]">{item.label}</p>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                              <div className="w-11 h-6 bg-[#CBCBCB] rounded-full peer peer-checked:bg-[#6D8196] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Settings */}
              {activeTab === 'email' && (
                <div>
                  <h2 className="text-xl font-[640] text-[#4A4A4A] mb-6">Email Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-[560] text-[#4A4A4A] mb-2">
                        SMTP Server
                      </label>
                      <input
                        type="text"
                        placeholder="smtp.example.com"
                        className="w-full px-4 py-3 bg-[#FFFFE3] border border-[#CBCBCB] rounded-[10px] text-[#4A4A4A] placeholder-[#CBCBCB] focus:outline-none focus:border-[#6D8196]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-[560] text-[#4A4A4A] mb-2">
                          SMTP Port
                        </label>
                        <input
                          type="text"
                          defaultValue="587"
                          className="w-full px-4 py-3 bg-[#FFFFE3] border border-[#CBCBCB] rounded-[10px] text-[#4A4A4A] focus:outline-none focus:border-[#6D8196]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-[560] text-[#4A4A4A] mb-2">
                          Encryption
                        </label>
                        <select className="w-full px-4 py-3 bg-[#FFFFE3] border border-[#CBCBCB] rounded-[10px] text-[#4A4A4A] focus:outline-none focus:border-[#6D8196]">
                          <option>TLS</option>
                          <option>SSL</option>
                          <option>None</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-[560] text-[#4A4A4A] mb-2">
                        From Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue="noreply@bidsense.com"
                        className="w-full px-4 py-3 bg-[#FFFFE3] border border-[#CBCBCB] rounded-[10px] text-[#4A4A4A] focus:outline-none focus:border-[#6D8196]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-[560] text-[#4A4A4A] mb-2">
                        From Name
                      </label>
                      <input
                        type="text"
                        defaultValue="BidSense Platform"
                        className="w-full px-4 py-3 bg-[#FFFFE3] border border-[#CBCBCB] rounded-[10px] text-[#4A4A4A] focus:outline-none focus:border-[#6D8196]"
                      />
                    </div>

                    <button className="bg-transparent border border-[#6D8196] text-[#6D8196] font-[600] py-3 px-6 rounded-[10px] hover:bg-[#6D8196] hover:bg-opacity-8 transition-colors">
                      Send Test Email
                    </button>
                  </div>
                </div>
              )}

              {/* Integrations */}
              {activeTab === 'integrations' && (
                <div>
                  <h2 className="text-xl font-[640] text-[#4A4A4A] mb-6">Integrations</h2>
                  
                  <div className="space-y-4">
                    {[
                      { name: 'Slack', description: 'Get notifications in your Slack workspace', status: 'Connected', logo: '💬' },
                      { name: 'Microsoft Teams', description: 'Collaborate with your team', status: 'Not Connected', logo: '👥' },
                      { name: 'Google Workspace', description: 'Sync with Google Calendar and Drive', status: 'Connected', logo: '📧' },
                      { name: 'Salesforce', description: 'Sync vendor and proposal data', status: 'Not Connected', logo: '☁️' },
                    ].map((integration, idx) => (
                      <div key={idx} className="flex items-center justify-between p-5 bg-white border border-[#CBCBCB] rounded-[10px]">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#6D8196] bg-opacity-10 rounded-lg flex items-center justify-center text-2xl">
                            {integration.logo}
                          </div>
                          <div>
                            <p className="font-[560] text-[#4A4A4A] mb-1">{integration.name}</p>
                            <p className="text-sm text-[#6D8196]">{integration.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-[560] ${
                            integration.status === 'Connected'
                              ? 'bg-[#EAF0F4] text-[#4F6478]'
                              : 'bg-[#CBCBCB] bg-opacity-30 text-[#4A4A4A]'
                          }`}>
                            {integration.status}
                          </span>
                          <button className={`font-[600] py-2 px-4 rounded-[10px] transition-colors text-sm ${
                            integration.status === 'Connected'
                              ? 'bg-transparent border border-[#6D8196] text-[#6D8196] hover:bg-[#6D8196] hover:bg-opacity-8'
                              : 'bg-[#6D8196] text-[#FFFFE3] hover:bg-[#5A6B7F]'
                          }`}>
                            {integration.status === 'Connected' ? 'Configure' : 'Connect'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-[#CBCBCB]">
                <button className="bg-[#6D8196] text-[#FFFFE3] font-[600] py-3 px-8 rounded-[10px] hover:bg-[#5A6B7F] transition-colors flex items-center gap-2">
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
