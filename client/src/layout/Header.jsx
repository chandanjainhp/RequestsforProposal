import { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { Bell, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

// Memoized Logo Component - Identity lives in header
const Logo = memo(() => (
  <Link 
    to={ROUTES.DASHBOARD}
    className="flex items-center gap-3 hover:opacity-80 transition-opacity flex-shrink-0"
    title="Go to Dashboard"
  >
    <div className="bg-[#4A4A4A] text-[#FFFFE3] rounded-lg p-2 font-bold text-sm flex items-center justify-center w-9 h-9">
      BS
    </div>
    <span className="font-bold text-[#4A4A4A] text-base hidden sm:inline-block">BidSense</span>
  </Link>
));

// Memoized Notification Badge Component
const NotificationBadge = memo(({ count }) => {
  if (!count) return null;
  return (
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
      {count > 99 ? '99+' : count}
    </span>
  );
});

// Memoized Notifications Panel Component
const NotificationsPanel = memo(({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const notifications = [
    { id: 1, title: 'New Proposal', message: 'Vendor submitted a proposal', time: 'Today' },
    { id: 2, title: 'RFP Updated', message: 'Your RFP has been viewed by 3 vendors', time: 'Today' },
    { id: 3, title: 'Deadline Approaching', message: 'Vendor response due in 2 days', time: 'Yesterday' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="absolute right-0 top-full mt-1 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200 max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
        </div>

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {notifications.map(notif => (
              <button
                key={notif.id}
                onClick={onClose}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                <p className="text-xs text-gray-600 mt-0.5">{notif.message}</p>
                <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-gray-500">No notifications</p>
          </div>
        )}
      </div>
    </>
  );
});

// Memoized User Menu Component
const UserMenu = memo(({ isOpen, onToggle, user, onLogout }) => {
  return (
    <div className="relative">
      <button
        onClick={() => onToggle()}
        className="flex items-center gap-2 hover:opacity-80 transition"
        title="User menu"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6D8196] to-[#4A4A4A] text-white flex items-center justify-center text-xs font-bold">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <ChevronDown size={16} className={`text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => onToggle()}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl z-50 border border-gray-200 overflow-hidden">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-600">{user?.email}</p>
              {user?.role && (
                <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                  user.role === 'admin' 
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {user.role}
                </span>
              )}
            </div>

            {/* Menu Items */}
            <button
              onClick={() => onToggle()}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <Settings size={16} />
              Settings
            </button>

            {/* Logout */}
            <button
              onClick={() => {
                onToggle();
                onLogout();
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3 border-t border-gray-200"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
});

const Header = memo(() => {
  const { user, logout } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const unreadCount = 3; // TODO: Replace with real data from useSyncStore

  return (
    <header className="sticky top-0 z-40 h-16 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between">
      {/* LEFT: Logo (Identity) */}
      <Logo />

      {/* RIGHT: Status & Shortcuts */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Notifications"
          >
            <Bell size={20} className="text-gray-700" />
            <NotificationBadge count={unreadCount} />
          </button>
          <NotificationsPanel 
            isOpen={notificationsOpen} 
            onClose={() => setNotificationsOpen(false)} 
          />
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300"></div>

        {/* User Menu */}
        <UserMenu 
          isOpen={userMenuOpen}
          onToggle={() => setUserMenuOpen(!userMenuOpen)}
          user={user}
          onLogout={logout}
        />
      </div>
    </header>
  );
});

Header.displayName = 'Header';
NotificationsPanel.displayName = 'NotificationsPanel';
UserMenu.displayName = 'UserMenu';
NotificationBadge.displayName = 'NotificationBadge';

export default Header;
