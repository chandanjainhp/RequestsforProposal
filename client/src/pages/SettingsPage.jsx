import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Loader2, Save, Bell, User, Lock, AlertCircle } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import AdminSettings from './AdminSettingsPage';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../api/authAPI';
import { useNotificationStore } from '../store/notificationStore';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { showToast } = useNotificationStore();
  
  // Tab state
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile state
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    company_name: ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});
  
  // Password state
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  
  // Notification state
  const [notifications, setNotifications] = useState({
    email_rfp_created: true,
    email_proposal_received: true,
    email_rfp_deadline: true,
    email_vendor_messages: true,
    push_proposal_received: false,
    push_rfp_deadline: false
  });
  const [notificationLoading, setNotificationLoading] = useState(false);

  // If admin, show admin settings
  if (user?.role === 'admin') {
    return <AdminSettings />;
  }

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.name || user.full_name || '',
        email: user.email || '',
        company_name: user.company_name || ''
      });
      
      // Load notification preferences from user settings
      if (user.notification_preferences) {
        setNotifications(prev => ({
          ...prev,
          ...user.notification_preferences
        }));
      }
    }
  }, [user]);

  // Profile validation
  const validateProfile = () => {
    const errors = {};
    
    if (!profileData.full_name.trim()) {
      errors.full_name = 'Name is required';
    } else if (profileData.full_name.length < 2) {
      errors.full_name = 'Name must be at least 2 characters';
    }
    
    if (!profileData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = 'Invalid email format';
    }
    
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Password validation
  const validatePassword = () => {
    const errors = {};
    
    if (!passwordData.current_password) {
      errors.current_password = 'Current password is required';
    }
    
    if (!passwordData.new_password) {
      errors.new_password = 'New password is required';
    } else if (passwordData.new_password.length < 8) {
      errors.new_password = 'Password must be at least 8 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(passwordData.new_password)) {
      errors.new_password = 'Password must contain uppercase, lowercase, number, and special character';
    }
    
    if (!passwordData.confirm_password) {
      errors.confirm_password = 'Please confirm your password';
    } else if (passwordData.new_password !== passwordData.confirm_password) {
      errors.confirm_password = 'Passwords do not match';
    }
    
    if (passwordData.current_password === passwordData.new_password) {
      errors.new_password = 'New password must be different from current password';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (!validateProfile()) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fix the errors below'
      });
      return;
    }
    
    setProfileLoading(true);
    
    try {
      const updatedUser = await authAPI.updateProfile({
        full_name: profileData.full_name.trim(),
        company_name: profileData.company_name.trim()
        // Note: Email updates typically require verification
      });
      
      // Update local auth state
      updateUser(updatedUser);
      
      showToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been updated successfully'
      });
    } catch (error) {
      console.error('Profile update error:', error);
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: error.response?.data?.message || 'Failed to update profile'
      });
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fix the errors below'
      });
      return;
    }
    
    setPasswordLoading(true);
    
    try {
      await authAPI.changePassword(
        passwordData.current_password,
        passwordData.new_password
      );
      
      // Clear form
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      setPasswordErrors({});
      
      showToast({
        type: 'success',
        title: 'Password Changed',
        message: 'Your password has been updated successfully'
      });
    } catch (error) {
      console.error('Password change error:', error);
      
      if (error.response?.status === 401) {
        setPasswordErrors({ current_password: 'Current password is incorrect' });
      }
      
      showToast({
        type: 'error',
        title: 'Change Failed',
        message: error.response?.data?.message || 'Failed to change password'
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle notification toggle
  const handleNotificationToggle = async (key) => {
    const newValue = !notifications[key];
    
    // Optimistic update
    setNotifications(prev => ({
      ...prev,
      [key]: newValue
    }));
    
    setNotificationLoading(true);
    
    try {
      await authAPI.updateProfile({
        notification_preferences: {
          ...notifications,
          [key]: newValue
        }
      });
      
      showToast({
        type: 'success',
        title: 'Preferences Updated',
        message: 'Notification preferences saved'
      });
    } catch (error) {
      // Revert on error
      setNotifications(prev => ({
        ...prev,
        [key]: !newValue
      }));
      
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update notification preferences'
      });
    } finally {
      setNotificationLoading(false);
    }
  };

  // Tab content components
  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  return (
    <div className="w-full min-h-screen bg-[#FFFFE3] overflow-x-hidden">
      <header className="bg-white border-b border-[#CBCBCB] px-4 md:px-6 py-4">
        <Breadcrumb items={[{ label: 'Settings', href: null }]} />
        <div className="mt-4">
          <h1 className="text-3xl font-[640] text-[#4A4A4A]">Settings</h1>
          <p className="text-sm text-[#6D8196] mt-2">
            Manage your account settings and preferences
          </p>
        </div>
      </header>

      <div className="px-4 md:px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Tab Navigation */}
          <div className="bg-white border border-[#CBCBCB] rounded-t-[14px] flex overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-[560] text-sm transition-colors whitespace-nowrap ${
                  activeTab === id
                    ? 'bg-[#6D8196] text-[#FFFFE3] border-b-2 border-[#6D8196]'
                    : 'text-[#6D8196] hover:bg-[#FFFFE3]'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white border border-[#CBCBCB] border-t-0 rounded-b-[14px] p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div>
                  <h2 className="text-xl font-[640] text-[#4A4A4A] mb-4">
                    Profile Information
                  </h2>
                  <p className="text-sm text-[#6D8196] mb-6">
                    Update your personal information and account details
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-[560] text-[#4A4A4A] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                    onBlur={validateProfile}
                    className={`w-full px-4 py-3 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#6D8196] ${
                      profileErrors.full_name ? 'border-red-500 bg-red-50' : 'border-[#CBCBCB]'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {profileErrors.full_name && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.full_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-[560] text-[#4A4A4A] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full px-4 py-3 border border-[#CBCBCB] rounded-[10px] bg-gray-100 text-[#6D8196] cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-[#6D8196]">
                    Contact support to change your email address
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-[560] text-[#4A4A4A] mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={profileData.company_name}
                    onChange={(e) => setProfileData({ ...profileData, company_name: e.target.value })}
                    className="w-full px-4 py-3 border border-[#CBCBCB] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#6D8196]"
                    placeholder="Your company name"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="bg-[#6D8196] text-[#FFFFE3] font-[600] py-3 px-6 rounded-[10px] hover:bg-[#5A6B7F] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {profileLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <h2 className="text-xl font-[640] text-[#4A4A4A] mb-4">
                    Change Password
                  </h2>
                  <p className="text-sm text-[#6D8196] mb-6">
                    Update your password to keep your account secure
                  </p>
                </div>

                {/* Security Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-4 flex items-start gap-3">
                  <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm text-blue-800 font-[560]">Security Tip</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and special characters
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-[560] text-[#4A4A4A] mb-2">
                    Current Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                      onBlur={validatePassword}
                      className={`w-full px-4 py-3 pr-12 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#6D8196] ${
                        passwordErrors.current_password ? 'border-red-500 bg-red-50' : 'border-[#CBCBCB]'
                      }`}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6D8196]"
                    >
                      {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {passwordErrors.current_password && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.current_password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-[560] text-[#4A4A4A] mb-2">
                    New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                      onBlur={validatePassword}
                      className={`w-full px-4 py-3 pr-12 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#6D8196] ${
                        passwordErrors.new_password ? 'border-red-500 bg-red-50' : 'border-[#CBCBCB]'
                      }`}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6D8196]"
                    >
                      {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {passwordErrors.new_password && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.new_password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-[560] text-[#4A4A4A] mb-2">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                      onBlur={validatePassword}
                      className={`w-full px-4 py-3 pr-12 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#6D8196] ${
                        passwordErrors.confirm_password ? 'border-red-500 bg-red-50' : 'border-[#CBCBCB]'
                      }`}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6D8196]"
                    >
                      {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {passwordErrors.confirm_password && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.confirm_password}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="bg-[#6D8196] text-[#FFFFE3] font-[600] py-3 px-6 rounded-[10px] hover:bg-[#5A6B7F] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {passwordLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Lock size={18} />
                        Update Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-[640] text-[#4A4A4A] mb-4">
                    Notification Preferences
                  </h2>
                  <p className="text-sm text-[#6D8196] mb-6">
                    Choose which notifications you want to receive
                  </p>
                </div>

                {/* Email Notifications */}
                <div>
                  <h3 className="text-lg font-[600] text-[#4A4A4A] mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    <NotificationToggle
                      label="RFP Created"
                      description="Get notified when a new RFP is created"
                      checked={notifications.email_rfp_created}
                      onChange={() => handleNotificationToggle('email_rfp_created')}
                      disabled={notificationLoading}
                    />
                    <NotificationToggle
                      label="Proposal Received"
                      description="Get notified when vendors submit proposals"
                      checked={notifications.email_proposal_received}
                      onChange={() => handleNotificationToggle('email_proposal_received')}
                      disabled={notificationLoading}
                    />
                    <NotificationToggle
                      label="RFP Deadline Reminder"
                      description="Get reminders before RFP deadlines"
                      checked={notifications.email_rfp_deadline}
                      onChange={() => handleNotificationToggle('email_rfp_deadline')}
                      disabled={notificationLoading}
                    />
                    <NotificationToggle
                      label="Vendor Messages"
                      description="Get notified about messages from vendors"
                      checked={notifications.email_vendor_messages}
                      onChange={() => handleNotificationToggle('email_vendor_messages')}
                      disabled={notificationLoading}
                    />
                  </div>
                </div>

                {/* Push Notifications */}
                <div className="border-t border-[#CBCBCB] pt-6">
                  <h3 className="text-lg font-[600] text-[#4A4A4A] mb-4">Push Notifications</h3>
                  <div className="space-y-4">
                    <NotificationToggle
                      label="Proposal Received"
                      description="Get push notifications for new proposals"
                      checked={notifications.push_proposal_received}
                      onChange={() => handleNotificationToggle('push_proposal_received')}
                      disabled={notificationLoading}
                    />
                    <NotificationToggle
                      label="RFP Deadline Reminder"
                      description="Get push reminders for deadlines"
                      checked={notifications.push_rfp_deadline}
                      onChange={() => handleNotificationToggle('push_rfp_deadline')}
                      disabled={notificationLoading}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Toggle component for notifications
const NotificationToggle = ({ label, description, checked, onChange, disabled }) => {
  return (
    <div className="flex items-center justify-between py-3 px-4 bg-[#FFFFE3] border border-[#CBCBCB] rounded-[10px]">
      <div className="flex-1">
        <div className="font-[560] text-[#4A4A4A]">{label}</div>
        <div className="text-sm text-[#6D8196] mt-1">{description}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#6D8196] focus:ring-offset-2 disabled:opacity-50 ${
          checked ? 'bg-[#6D8196]' : 'bg-[#CBCBCB]'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

