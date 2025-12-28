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
  LogOut
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { NetworkStatusIndicator, NotificationBadge } from '../components/NetworkStatus';
import { useSyncStore } from '../store/syncStore';
import { ROUTES } from '../constants/routes';

// CSS class constants for better maintainability
const linkBaseClass = "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 cursor-pointer group relative";
const linkActiveClass = "bg-[#FFFFE3] text-[#4A4A4A] font-semibold border-l-4 border-[#6D8196]";
const linkInactiveClass = "text-[#4A4A4A] hover:bg-[#FFFFE3] hover:bg-opacity-50";

// Memoized Navigation Items Component
const NavigationItems = memo(({
  mobile = false,
  isCollapsed,
  mainNavItems,
  adminNavItems = [],
  bottomNavItems,
  isActive
}) => (
  <>
    {/* Main Navigation Items */}
    <nav className={`${mobile ? 'flex-1 px-3 py-6' : 'flex-1 px-2 py-4'} space-y-0.5 overflow-y-auto`}>
      {mainNavItems.map(({ path, label, icon: Icon, badge }) => {
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
                className="shrink-0"
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
      })}
    </nav>

    {/* Admin Navigation Items - only shown if adminNavItems exist */}
    {adminNavItems.length > 0 && (
      <>
        <div className="border-t border-[#CBCBCB] mx-2 my-2"></div>
        <nav className={`${mobile ? 'px-3' : 'px-2'} space-y-0.5`}>
          {(!isCollapsed || mobile) && (
            <div className="px-3 py-1 text-xs font-semibold text-[#6D8196] uppercase tracking-wider">
              Admin
            </div>
          )}
          {adminNavItems.map(({ path, label, icon: Icon }) => {
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
                <Icon
                  size={mobile ? 20 : 18}
                  className="shrink-0"
                  strokeWidth={active ? 2.5 : 2}
                />
                {(!isCollapsed || mobile) && (
                  <span>{label}</span>
                )}
                {!mobile && isCollapsed && (
                  <div className="absolute left-full ml-3 px-3 py-2 bg-[#4A4A4A] text-[#FFFFE3] text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                    {label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </>
    )}

    {/* Divider */}
    <div className="border-t border-[#CBCBCB] mx-2"></div>

    {/* Bottom Navigation Items */}
    <nav className={`${mobile ? 'px-3 py-4' : 'px-2 py-3'} space-y-0.5`}>
      {bottomNavItems.map(({ path, label, icon: Icon }) => {
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
            <Icon
              size={mobile ? 20 : 18}
              className="shrink-0"
              strokeWidth={active ? 2.5 : 2}
            />
            {(!isCollapsed || mobile) && (
              <span>{label}</span>
            )}

            {/* Desktop Tooltip on collapse */}
            {!mobile && isCollapsed && (
              <div className="absolute left-full ml-3 px-3 py-2 bg-[#4A4A4A] text-[#FFFFE3] text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                {label}
              </div>
            )}
          </Link>
        );
      })}
    </nav>
  </>
));

// Memoized User Section Component
const UserSection = memo(({
  mobile = false,
  isCollapsed,
  user,
  handleLogout
}) => (
  <div className={`border-t border-[#CBCBCB] ${mobile ? 'p-4' : 'p-3'} bg-white`}>
    {/* Network Status */}
    {(!isCollapsed || mobile) && (
      <div className="mb-3">
        <NetworkStatusIndicator className="text-xs" />
      </div>
    )}

    {/* User Info Container */}
    <div className={`flex items-center ${isCollapsed && !mobile ? 'flex-col gap-2' : 'gap-3'}`}>
      {/* User Avatar and Info */}
      <div className={`flex items-center gap-3 ${isCollapsed && !mobile ? 'justify-center' : 'flex-1 min-w-0'} group relative`}>
        <div className="relative">
          <div className="w-9 h-9 bg-[#6D8196] rounded-full flex items-center justify-center shrink-0">
            <span className="text-[#FFFFE3] text-xs font-bold">
              {(user && user.name)
                ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
                : 'JD'
              }
            </span>
          </div>
          {/* Online status indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>

        {(!isCollapsed || mobile) && (
          <div className="text-left min-w-0 flex-1">
            <div className="text-xs font-semibold text-[#4A4A4A] truncate">
              {user?.name || 'John Doe'}
            </div>
            <div className="text-xs text-[#6D8196] truncate">
              {user?.email || 'user@example.com'}
            </div>
          </div>
        )}

        {/* Tooltip for collapsed state */}
        {isCollapsed && !mobile && (
          <div className="absolute left-full ml-3 px-3 py-2 bg-[#4A4A4A] text-[#FFFFE3] text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
            <div className="font-semibold">{user?.name || 'John Doe'}</div>
            <div className="text-[#CBCBCB]">{user?.email || 'user@example.com'}</div>
          </div>
        )}
      </div>

      {/* Logout Button */}
      {(!isCollapsed || mobile) && (
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap"
          title="Logout"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      )}

      {/* Collapsed Logout Icon Button */}
      {isCollapsed && !mobile && (
        <button
          onClick={handleLogout}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group relative"
          title="Logout"
        >
          <LogOut size={16} />
          <div className="absolute left-full ml-3 px-3 py-2 bg-[#4A4A4A] text-[#FFFFE3] text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
            Logout
          </div>
        </button>
      )}
    </div>
  </div>
));

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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
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

  const mainNavItems = [
    { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: Home },
    { path: ROUTES.EDITOR, label: 'BidSenses', icon: FileText },
    { path: ROUTES.VENDORS, label: 'Vendors', icon: Users },
    {
      path: ROUTES.PROPOSALS,
      label: 'Proposals',
      icon: FileText,
      badge: unreadProposalsCount > 0 ? unreadProposalsCount : null
    },
  ];

  // Admin nav items - only shown if user is admin
  const adminNavItems = user?.role === 'admin' ? [
    { path: ROUTES.ADMIN_USERS, label: 'Manage Users', icon: Users },
    { path: ROUTES.ADMIN_SETTINGS, label: 'Admin Settings', icon: Settings },
  ] : [];

  const bottomNavItems = [
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
        } w-[280px]`}
      >
        {/* Mobile Logo Section */}
        <div className="h-16 border-b border-[#CBCBCB] flex items-center justify-between px-4 bg-white">
          <Link 
            to={ROUTES.DASHBOARD} 
            className="flex items-center gap-3 hover:opacity-80 transition"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="bg-[#4A4A4A] text-[#FFFFE3] rounded-lg p-2 shrink-0 font-bold text-sm">
              BS
            </div>
            <span className="font-bold text-[#4A4A4A] text-base">BidSense</span>
          </Link>
        </div>

        <NavigationItems
          mobile={true}
          isCollapsed={isCollapsed}
          mainNavItems={mainNavItems}
          adminNavItems={adminNavItems}
          bottomNavItems={bottomNavItems}
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
          isCollapsed ? 'w-[72px]' : 'w-[220px]'
        }`}
      >
        {/* Desktop Logo Section */}
        <div className="h-16 border-b border-[#CBCBCB] flex items-center justify-between px-3 bg-white">
          <Link 
            to={ROUTES.DASHBOARD} 
            className={`flex items-center gap-3 hover:opacity-80 transition ${
              isCollapsed ? 'justify-center w-full' : ''
            }`}
            title="Go to Dashboard"
          >
            <div className="bg-[#4A4A4A] text-[#FFFFE3] rounded-lg p-2 shrink-0 font-bold text-xs flex items-center justify-center w-8 h-8">
              BS
            </div>
            {!isCollapsed && (
              <span className="font-bold text-[#4A4A4A] text-sm whitespace-nowrap">BidSense</span>
            )}
          </Link>
          
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
          mainNavItems={mainNavItems}
          adminNavItems={adminNavItems}
          bottomNavItems={bottomNavItems}
          isActive={isActive}
        />
        <UserSection
          mobile={false}
          isCollapsed={isCollapsed}
          user={user}
          handleLogout={handleLogout}
        />
      </aside>

      {/* Spacer for desktop to prevent content overlap */}
      <div className={`hidden md:block transition-all duration-300 flex-shrink-0 ${
        isCollapsed ? 'w-[72px]' : 'w-[220px]'
      }`} />
    </>
  );
}
