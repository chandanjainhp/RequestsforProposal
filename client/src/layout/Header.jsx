import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle, FileText, Mail, BarChart3, Users } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/chat', label: 'Chat', icon: MessageCircle },
    { path: '/editor', label: 'Editor', icon: FileText },
    { path: '/proposals', label: 'Proposals', icon: Mail },
    { path: '/compare', label: 'Compare', icon: BarChart3 },
    { path: '/vendors', label: 'Vendors', icon: Users },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border-b-4 border-blue-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo - AFFORDANCE: Clearly clickable with styling, SIGNIFIER: Home icon */}
        <Link 
          to="/" 
          className="text-2xl font-bold flex items-center gap-2 hover:opacity-90 transition cursor-pointer group"
          title="Go to home page"
        >
          <div className="bg-white text-blue-600 rounded-lg p-2 group-hover:scale-105 transition">
            RFP
          </div>
          <span>Manager</span>
        </Link>

        {/* Desktop Navigation - CONSISTENCY: Same style everywhere, MAPPING: Icons + text labels */}
        <nav className="hidden md:flex space-x-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                title={`Go to ${label}`}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition duration-200 cursor-pointer ${
                  active
                    ? 'bg-white text-blue-600 font-semibold shadow-md'
                    : 'text-white hover:bg-blue-500 hover:shadow-md'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Button - AFFORDANCE: Clear button styling */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-blue-500 rounded-lg transition cursor-pointer"
          aria-label="Toggle mobile menu"
          title={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? (
            <X size={24} className="hover:scale-110 transition" />
          ) : (
            <Menu size={24} className="hover:scale-110 transition" />
          )}
        </button>
      </div>

      {/* Mobile Navigation - CONSISTENCY: Same items as desktop */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-blue-600 px-4 py-3 space-y-1 border-t border-blue-500">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 transition cursor-pointer ${
                  active
                    ? 'bg-white text-blue-600 font-semibold'
                    : 'text-white hover:bg-blue-500'
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
    </header>
  );
}
