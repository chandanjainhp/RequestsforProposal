/**
 * BREADCRUMB COMPONENT
 * Shows current position in workflow and RFP hierarchy
 * PRINCIPLE: VISIBILITY - Clear navigation context
 * PRINCIPLE: MAPPING - Mental model matches visual hierarchy
 */

import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Breadcrumb({ items = [] }) {
  const defaultItems = [
    { label: 'Home', href: '/', icon: Home }
  ];

  const allItems = [...defaultItems, ...items];

  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 px-6 py-3 bg-white border-b border-gray-200">
      {allItems.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.href ? (
            <Link
              to={item.href}
              className="text-blue-600 hover:text-blue-700 hover:underline transition flex items-center gap-1"
            >
              {item.icon && <item.icon size={16} />}
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium flex items-center gap-1">
              {item.icon && <item.icon size={16} />}
              {item.label}
            </span>
          )}

          {index < allItems.length - 1 && (
            <ChevronRight size={16} className="text-gray-400" />
          )}
        </div>
      ))}
    </nav>
  );
}
