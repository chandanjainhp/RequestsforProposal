import { useState, useEffect, useCallback, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  FileText,
  Users,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  History,
  Menu,
  X,
  LogOut,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { NetworkStatusIndicator, NotificationBadge } from '../components/NetworkStatus';
import { useSyncStore } from '../store/syncStore';
import { ROUTES } from '../constants/routes';

// CSS class constants for better maintainability
const linkBaseClass = "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 cursor-pointer group relative";
const linkActiveClass = "bg-[#FFFFE3] text-[#4A4A4A] font-semibold border-l-4 border-[#6D8196]";
const linkInactiveClass = "text-[#4A4A4A] hover:bg-[#FFFFE3] hover:bg-opacity-50 opacity-90";
const sectionLabelClass = "px-3 py-2 text-xs font-bold text-[#6D8196] uppercase tracking-wider";

// Memoized Navigation Items Component - Task-oriented grouping
const NavigationItems = memo(({
  mobile = false,
  isCollapsed,
  primaryItems,
  managementItems,
  systemItems,
  adminItems = [],
  isActive
}) => {
  const renderNavItem = (item) => {
    const { path, label, icon: Icon, badge } = item;
    const active = isActive(path);
    
    return (
      <Link
        key={path}
        to={path}
        title={label}
        className={`${linkBaseClass} ${
          active ? linkActiveClass : linkInactiveClass
        } ${mobile ? 'text-base' : 'text-sm'}`}
      >
        <div className="relative flex items-center">
          <Icon
            size={mobile ? 20 : 18}
            className={`shrink-0 transition-opacity ${active ? 'opacity-100' : 'opacity-70'}`}
            strokeWidth={active ? 2.5 : 2}
          />
          {badge && badge > 0 && mobile && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#6D8196] rounded-full border-2 border-white"></span>
          )}
        </div>
        {(!isCollapsed || mobile) && (
          <span className="flex-1">{label}</span>
        )}
        {(!isCollapsed || mobile) && badge && badge > 0 && (
          <NotificationBadge count={badge} />
        )}

        {/* Desktop Tooltip on collapse */}
        {!mobile && isCollapsed && (
          <div className="absolute left-full ml-3 px-3 py-2 bg-[#4A4A4A] text-[#FFFFE3] text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
            {label}
            {badge && badge > 0 && ` (${badge})`}
          </div>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Primary Tasks Section */}
      <nav className={`${mobile ? 'px-3 py-4' : 'px-2 py-3'} space-y-0.5`}>
        {(!isCollapsed || mobile) && (
          <div className={sectionLabelClass}>Primary Tasks</div>
        )}
        {primaryItems.map(renderNavItem)}
      </nav>

      {/* Management Section */}
      {managementItems.length > 0 && (
        <>
          <div className={`border-t border-[#CBCBCB] mx-2 my-2`}></div>
          <nav className={`${mobile ? 'px-3 pb-4' : 'px-2 py-3'} space-y-0.5`}>
            {(!isCollapsed || mobile) && (
              <div className={sectionLabelClass}>Management</div>
            )}
            {managementItems.map(renderNavItem)}
          </nav>
        </>
      )}

      {/* Admin Section */}
      {adminItems.length > 0 && (
        <>
          <div className={`border-t border-[#CBCBCB] mx-2 my-2`}></div>
          <nav className={`${mobile ? 'px-3 pb-4' : 'px-2 py-3'} space-y-0.5`}>
            {(!isCollapsed || mobile) && (
              <div className={sectionLabelClass}>Admin</div>
            )}
            {adminItems.map(renderNavItem)}
          </nav>
        </>
      )}

      {/* System Section */}
      <div className={`border-t border-[#CBCBCB] mx-2 my-2`}></div>
      <nav className={`${mobile ? 'px-3 py-4' : 'px-2 py-3'} space-y-0.5`}>
        {(!isCollapsed || mobile) && (
          <div className={sectionLabelClass}>System</div>
        )}
        {systemItems.map(renderNavItem)}
      </nav>
    </>
  );
});

// Memoized User Section Component - Task-oriented with dropdown menu
const UserSection = memo(({
  mobile = false,
  isCollapsed,
  user,
  handleLogout
}) => {
  const [showMenu, setShowMenu] = useState(false);

  // Get user role badge color
  const getRoleBadgeColor = () => {
    if (!user?.role) return 'bg-gray-200 text-gray-700';
    return user.role === 'admin' 
      ? 'bg-purple-100 text-purple-700' 
      : 'bg-blue-100 text-blue-700';
  };

  const displayName = user?.name || 'User';
  const displayEmail = user?.email || 'user@example.com';
  const userRole = user?.role || 'user';

  const handleMenuLogout = () => {
    setShowMenu(false);
    handleLogout();
  };

  return (
    <div className={`border-t border-[#CBCBCB] ${mobile ? 'p-4' : 'p-4'} bg-white`}>
      {/* User Card - Clickable dropdown trigger */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`w-full relative text-left p-3 rounded-lg hover:bg-gray-100 transition-colors`}
      >
        {(!isCollapsed || mobile) && (
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-[#4A4A4A] truncate">
              {displayName}
            </h3>
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-[#CBCBCB] rounded-lg shadow-lg z-50 overflow-hidden">
            {/* User Info in Menu */}
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="text-sm font-semibold text-[#4A4A4A]">{displayName}</p>
              <p className="text-xs text-[#6D8196] mt-0.5">{displayEmail}</p>
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium capitalize ${getRoleBadgeColor()}`}>
                  {userRole}
                </span>
              </div>
            </div>

            {/* Menu Items */}
            <button
              onClick={() => setShowMenu(false)}
              className="w-full text-left px-4 py-2.5 text-sm text-[#4A4A4A] hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <Settings size={16} />
              Settings
            </button>

            {/* Logout - neutral color, not red */}
            <button
              onClick={handleMenuLogout}
              className="w-full text-left px-4 py-2.5 text-sm text-[#6D8196] hover:bg-gray-50 transition-colors flex items-center gap-3 border-t border-gray-200"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </>
      )}

      {/* Collapsed State Tooltip */}
      {isCollapsed && !mobile && (
        <div className="absolute left-full ml-3 px-3 py-2 bg-[#4A4A4A] text-[#FFFFE3] text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
          Click to open menu
        </div>
      )}
    </div>
  );
});

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Selective store subscriptions to prevent unnecessary re-renders
  const unreadProposalsCount = useSyncStore(
    state => state.proposals?.filter(p => !p.viewed).length || 0
  );
  const { user, logout } = useAuth();

  // Debounced mobile detection to improve performance
  useEffect(() => {
    let timeoutId;
    const checkMobile = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 150); // Debounce by 150ms
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Close mobile menu when route changes (using callback ref instead of setState in effect)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open with proper cleanup
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Keyboard accessibility for mobile menu
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  // Focus management for mobile menu
  useEffect(() => {
    if (isMobileMenuOpen && isMobile) {
      // Focus first focusable element in sidebar after a short delay
      const timer = setTimeout(() => {
        const sidebar = document.querySelector('[role="navigation"]');
        const firstFocusable = sidebar?.querySelector('a, button');
        firstFocusable?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isMobileMenuOpen, isMobile]);

  const primaryItems = [
    { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: Home },
    { path: ROUTES.CHAT, label: 'Create RFP', icon: FileText },
    {
      path: ROUTES.PROPOSALS,
      label: 'Proposals',
      icon: FileText,
      badge: unreadProposalsCount > 0 ? unreadProposalsCount : null
    },
  ];

  const managementItems = [
    { path: ROUTES.VENDORS, label: 'Vendors', icon: Users },
    { path: ROUTES.EDITOR, label: 'BidSense Insights', icon: FileText },
  ];

  // Admin nav items - only shown if user is admin
  const adminItems = user?.role === 'admin' ? [
    { path: ROUTES.ADMIN_USERS, label: 'Manage Users', icon: Users },
    { path: ROUTES.ADMIN_SETTINGS, label: 'Admin Settings', icon: Settings },
  ] : [];

  const systemItems = [
    { path: ROUTES.HISTORY, label: 'History', icon: History },
    { path: ROUTES.SETTINGS, label: 'Settings', icon: Settings },
    { path: ROUTES.HELP, label: 'Help', icon: HelpCircle },
  ];

  const isActive = useCallback((path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-white border border-[#CBCBCB] rounded-lg shadow-md hover:bg-[#FFFFE3] transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X size={20} className="text-[#4A4A4A]" />
        ) : (
          <Menu size={20} className="text-[#4A4A4A]" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        role="navigation"
        aria-label="Main navigation"
        aria-hidden={!isMobileMenuOpen}
        className={`fixed left-0 top-0 h-screen bg-white shadow-2xl z-50 md:hidden flex flex-col transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } w-70`}
      >
        {/* Mobile Logo Section */}
      <div className="h-16 border-b border-[#CBCBCB] px-4"></div>
        <NavigationItems
          mobile={true}
          isCollapsed={isCollapsed}
          primaryItems={primaryItems}
          managementItems={managementItems}
          adminItems={adminItems}
          systemItems={systemItems}
          isActive={isActive}
        />
        <UserSection
          mobile={true}
          isCollapsed={isCollapsed}
          user={user}
          handleLogout={handleLogout}
        />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        role="navigation"
        aria-label="Main navigation"
        className={`fixed left-0 top-0 h-screen bg-white border-r border-[#CBCBCB] shadow-sm transition-all duration-300 z-30 hidden md:flex flex-col ${
          isCollapsed ? 'w-24' : 'w-72'
        }`}
      >
        {/* Desktop Header Space - Empty for alignment with Header */}
        <div className="h-16 border-b border-[#CBCBCB] flex items-center justify-end px-3 bg-white">
          {/* Collapse Toggle */}
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 hover:bg-[#FFFFE3] rounded-lg transition-colors"
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft size={16} className="text-[#6D8196]" />
            </button>
          )}
        </div>

        {/* Expand Button (when collapsed) */}
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="absolute -right-3 top-20 bg-white border border-[#CBCBCB] rounded-full p-1.5 shadow-md hover:bg-[#FFFFE3] transition-colors z-50"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <ChevronRight size={14} className="text-[#6D8196]" />
          </button>
        )}

        <NavigationItems
          mobile={false}
          isCollapsed={isCollapsed}
          primaryItems={primaryItems}
          managementItems={managementItems}
          adminItems={adminItems}
          systemItems={systemItems}
          isActive={isActive}
        />
    
      </aside>

      {/* Spacer for desktop to prevent content overlap */}
      <div className={`hidden md:block transition-all duration-300 shrink-0 ${
        isCollapsed ? 'w-24' : 'w-72'
      }`} />
    </>
  );
}
