import { Check } from 'lucide-react';

export default function VendorSelector({ vendors, selectedVendors, onToggle, loading = false }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (vendors.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No vendors available
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {vendors.map((vendor) => (
        <label
          key={vendor._id}
          className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition"
        >
          <input
            type="checkbox"
            checked={selectedVendors.includes(vendor._id)}
            onChange={() => onToggle(vendor._id)}
            className="w-4 h-4 accent-blue-500"
          />
          <div className="ml-3 flex-1">
            <p className="font-medium text-gray-900">{vendor.name}</p>
            <p className="text-sm text-gray-500">{vendor.contact_email}</p>
          </div>
          {selectedVendors.includes(vendor._id) && (
            <Check size={20} className="text-green-600" />
          )}
        </label>
      ))}
    </div>
  );
}
