import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle, FileText, Mail, BarChart3, Users } from 'lucide-react';
import { ROUTES } from '../constants/routes';

// Move navItems outside component to prevent recreation on every render
const NAV_ITEMS = [
  { path: ROUTES.CHAT, label: 'Chat', icon: MessageCircle },
  { path: ROUTES.EDITOR, label: 'Editor', icon: FileText },
  { path: ROUTES.PROPOSALS, label: 'Proposals', icon: Mail },
  { path: ROUTES.COMPARE, label: 'Compare', icon: BarChart3 },
  { path: ROUTES.VENDORS, label: 'Vendors', icon: Users },
];

const Header = memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const mobileNavRef = useRef(null);

  // Memoize isActive function to prevent recreation on every render
  const isActive = useCallback(
    (path) => location.pathname.startsWith(path),
    [location.pathname]
  );

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  // Manage focus when mobile menu opens
  useEffect(() => {
    if (mobileMenuOpen && mobileNavRef.current) {
      const firstLink = mobileNavRef.current.querySelector('a');
      firstLink?.focus();
    }
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="bg-charcoal text-white shadow-lg border-b-4 border-soft-gray">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link
            to={ROUTES.HOME}
            className="text-2xl font-bold flex items-center gap-2 hover:opacity-90 transition cursor-pointer group"
            title="Go to home page"
          >
            <div className="bg-white text-charcoal rounded-lg p-2 group-hover:scale-105 transition">
              BS
            </div>
            <span>BidSense</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
              const active = isActive(path);
              return (
                <Link
                  key={path}
                  to={path}
                  title={`Go to ${label}`}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition duration-200 ${
                    active
                      ? 'bg-white text-charcoal font-semibold shadow-md'
                      : 'text-white hover:bg-muted-blue hover:shadow-md'
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-muted-blue rounded-lg transition"
            aria-label="Main menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            title="Main menu"
          >
            {mobileMenuOpen ? (
              <X size={24} className="hover:scale-110 transition" />
            ) : (
              <Menu size={24} className="hover:scale-110 transition" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav
          id="mobile-nav"
          ref={mobileNavRef}
          aria-label="Main navigation"
          className="relative z-50 md:hidden bg-charcoal px-4 py-3 space-y-1 border-t border-soft-gray transform transition-transform duration-300 ease-in-out"
        >
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 transition ${
                  active
                    ? 'bg-white text-charcoal font-semibold'
                    : 'text-white hover:bg-muted-blue'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </>
  );
});

export default Header;
