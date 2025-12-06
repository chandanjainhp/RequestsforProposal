import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MessageCircle, 
  FileText, 
  Mail, 
  BarChart3, 
  Users, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  History
} from 'lucide-react';
import { NetworkStatusIndicator, NotificationBadge } from '../components/NetworkStatus';
import { useSyncStore } from '../store/syncStore';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { proposals } = useSyncStore();

  // Calculate notification counts
  const unreadProposalsCount = proposals.filter(p => !p.viewed).length;
  const draftRfpsCount = 0; // Only show badge if there are actual drafts needing attention

  const mainNavItems = [
    { path: '/chat', label: 'Chat', icon: MessageCircle },
    { path: '/editor', label: 'Editor', icon: FileText, badge: draftRfpsCount > 0 ? draftRfpsCount : null },
    { path: '/send', label: 'Send RFP', icon: Mail },
    { path: '/proposals', label: 'Proposals', icon: Mail, badge: unreadProposalsCount > 0 ? unreadProposalsCount : null },
    { path: '/compare', label: 'Compare', icon: BarChart3 },
    { path: '/vendors', label: 'Vendors', icon: Users },
  ];

  const bottomNavItems = [
    { path: '/history', label: 'History', icon: History },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/help', label: 'Help', icon: HelpCircle },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 shadow-sm transition-all duration-300 z-50 
      hidden sm:flex flex-col
      ${
        isCollapsed ? 'sm:w-20' : 'sm:w-55'
      }`}
    >
      {/* Logo Section */}
      <div className="h-20 border-b border-gray-200 flex items-center justify-between px-3 py-4">
        <Link 
          to="/" 
          className={`flex items-center gap-3 hover:opacity-80 transition ${
            isCollapsed ? 'justify-center w-full' : ''
          }`}
          title="Go to home page"
        >
          <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg p-2 shrink-0 font-bold">
            RFP
          </div>
          {!isCollapsed && (
            <span className="font-bold text-gray-900 text-sm whitespace-nowrap">Manager</span>
          )}
        </Link>
        
        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1.5 hover:bg-gray-100 rounded-lg transition ${
            isCollapsed ? 'absolute -right-12' : ''
          }`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? (
            <ChevronRight size={18} className="text-gray-600" />
          ) : (
            <ChevronLeft size={18} className="text-gray-600" />
          )}
        </button>
      </div>

      {/* Main Navigation Items */}
      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
        {mainNavItems.map(({ path, label, icon: Icon, badge }) => { // eslint-disable-line no-unused-vars
          const active = isActive(path);
          return (
            <Link
              key={path}
              to={path}
              title={label}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition duration-200 cursor-pointer group relative ${
                active
                  ? 'bg-blue-50 text-blue-600 font-semibold border-l-4 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="relative">
                <Icon 
                  size={18} 
                  className={`shrink-0 ${active ? 'fill-current' : ''}`} 
                />
                {badge && badge > 0 && (
                  <NotificationBadge 
                    count={badge} 
                    className="absolute -top-1 -right-1"
                  />
                )}
              </div>
              {!isCollapsed && (
                <span className="text-sm flex-1">{label}</span>
              )}
              {!isCollapsed && badge && badge > 0 && (
                <NotificationBadge count={badge} />
              )}
              
              {/* Tooltip on collapse */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {label}
                  {badge && badge > 0 && ` (${badge})`}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Bottom Navigation Items */}
      <nav className="px-2 py-3 space-y-1">
        {bottomNavItems.map(({ path, label, icon: Icon }) => { // eslint-disable-line no-unused-vars
          const active = isActive(path);
          return (
            <Link
              key={path}
              to={path}
              title={label}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition duration-200 cursor-pointer group relative ${
                active
                  ? 'bg-blue-50 text-blue-600 font-semibold border-l-4 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon 
                size={18} 
                className={`shrink-0 ${active ? 'fill-current' : ''}`} 
              />
              {!isCollapsed && (
                <span className="text-sm">{label}</span>
              )}
              
              {/* Tooltip on collapse */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-200 p-3">
        {/* Network Status */}
        {!isCollapsed && (
          <div className="mb-3">
            <NetworkStatusIndicator className="text-xs" />
          </div>
        )}
        
        <button
          className={`w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-100 transition group relative ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title="User profile"
        >
          <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">JD</span>
          </div>
          {!isCollapsed && (
            <div className="text-left text-xs min-w-0">
              <div className="font-semibold text-gray-900 truncate">John Doe</div>
              <div className="text-gray-500 truncate">john@company.com</div>
            </div>
          )}
          
          {/* Tooltip on collapse */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              John Doe
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
