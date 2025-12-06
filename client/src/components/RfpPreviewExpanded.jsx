/**
 * EXPANDED RFP PREVIEW COMPONENT
 * Shows full RFP details with sections and icons
 * PRINCIPLE: VISIBILITY - All important info immediately visible
 * PRINCIPLE: AFFORDANCES - Sections look expandable/interactive
 */

import { useState } from 'react';
import { ChevronDown, TrendingUp, Package, Calendar, Banknote, CheckSquare, Edit2, Check, X } from 'lucide-react';
import { PrimaryButton } from './Button';

const SectionHeader = ({ icon: Icon, title, section, expanded, onToggle, count }) => (
  <button
    onClick={() => onToggle(section)}
    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition rounded-lg group cursor-pointer"
  >
    <div className="flex items-center gap-3">
      {Icon && <Icon size={20} className="text-blue-600" />}
      <span className="font-semibold text-gray-900">{title}</span>
      {count !== undefined && (
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
          {count}
        </span>
      )}
    </div>
    <ChevronDown
      size={20}
      className={`text-gray-400 transition-transform group-hover:text-gray-600 ${
        expanded ? 'rotate-180' : ''
      }`}
    />
  </button>
);

const SectionContent = ({ children }) => (
  <div className="px-3 pb-3 space-y-2 border-t border-gray-100">{children}</div>
);

const EditableField = ({ label, value, onSave, type = 'text' }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Convert value to string, handling objects
  const stringValue = typeof value === 'string' ? value : (typeof value === 'object' ? '' : String(value || ''));
  const [editValue, setEditValue] = useState(stringValue);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(stringValue);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 py-2 px-2">
        <input
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="flex-1 px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <button
          onClick={handleSave}
          className="p-1 text-green-600 hover:bg-green-50 rounded transition"
        >
          <Check size={16} />
        </button>
        <button
          onClick={handleCancel}
          className="p-1 text-gray-400 hover:bg-gray-100 rounded transition"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between py-2 px-2 hover:bg-blue-50 rounded transition group">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-900 text-right">{stringValue || 'Not specified'}</span>
        <button
          onClick={() => setIsEditing(true)}
          className="p-1 opacity-0 group-hover:opacity-100 text-blue-500 hover:bg-blue-100 rounded transition"
        >
          <Edit2 size={14} />
        </button>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => {
  // Convert value to string, handling objects and other types safely
  let displayValue = 'Not specified';
  
  if (typeof value === 'string' && value.trim()) {
    displayValue = value;
  } else if (typeof value === 'number') {
    displayValue = String(value);
  } else if (typeof value === 'boolean') {
    displayValue = value ? 'Yes' : 'No';
  } else if (value !== null && value !== undefined && typeof value === 'object') {
    // For objects, check if they have meaningful content
    try {
      const objStr = JSON.stringify(value);
      // If object is empty {}, don't display it
      if (objStr === '{}' || objStr === '[]') {
        displayValue = 'Specified';
      } else {
        displayValue = 'Specified';
      }
    } catch {
      displayValue = 'Specified';
    }
  }

  return (
    <div className="flex items-start justify-between py-2 px-2 hover:bg-blue-50 rounded transition">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="font-medium text-gray-900 text-right">{displayValue}</span>
    </div>
  );
};

export default function RfpPreviewExpanded({ rfp, onEdit, editLoading, onFieldChange }) {
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    budget: true,
    items: true,
    timeline: true,
    requirements: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFieldChange = (field, value) => {
    if (onFieldChange) {
      onFieldChange(field, value);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header with Status & Confidence */}
      <div className="p-4 bg-linear-to-r from-blue-50 to-blue-100 border-b border-gray-200">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{rfp.title || 'Untitled RFP'}</h2>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
              Draft
            </span>
            <span className="text-xs text-gray-600">Created just now</span>
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">Parse Confidence</span>
            <span className="text-lg font-bold text-blue-600">
              {((rfp.confidence || 0.3) * 100).toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition ${
                (rfp.confidence || 0.3) >= 0.9
                  ? 'bg-green-500'
                  : (rfp.confidence || 0.3) >= 0.7
                  ? 'bg-yellow-500'
                  : (rfp.confidence || 0.3) >= 0.5
                  ? 'bg-orange-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${(rfp.confidence || 0.3) * 100}%` }}
            />
          </div>
          
          {/* Smart confidence message based on actual confidence */}
          <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200">
            {(rfp.confidence || 0.3) >= 0.9 ? (
              <div>
                <p className="text-xs font-semibold text-green-700">✓ Excellent Parsing</p>
                <p className="text-xs text-green-600">All key details captured. Ready to send.</p>
              </div>
            ) : (rfp.confidence || 0.3) >= 0.7 ? (
              <div>
                <p className="text-xs font-semibold text-yellow-700">⚠ Good Parsing - Consider Adding:</p>
                <ul className="text-xs text-yellow-600 mt-1 space-y-1">
                  {!rfp.delivery_days && <li>• Delivery timeline or deadline</li>}
                  {!rfp.warranty_months && <li>• Warranty requirements</li>}
                  {!rfp.technical_specs && <li>• Technical specifications or features</li>}
                  {!rfp.budget && <li>• Budget or budget range</li>}
                </ul>
              </div>
            ) : (rfp.confidence || 0.3) >= 0.5 ? (
              <div>
                <p className="text-xs font-semibold text-orange-700">! Fair Parsing - Missing Details</p>
                <p className="text-xs text-orange-600">Add specifications to get better vendor matches.</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-bold text-orange-700">! Fair Confidence - Add More Details</p>
                <p className="text-sm text-orange-600 mt-1">Provide more specific details to improve parsing accuracy.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="divide-y divide-gray-100">
        {/* OVERVIEW */}
        <div className="border-b">
          <SectionHeader
            icon={CheckSquare}
            title="Overview"
            section="overview"
            expanded={expandedSections.overview}
            onToggle={toggleSection}
          />
          {expandedSections.overview && (
            <SectionContent>
              <div className="px-2 py-3 bg-blue-50 rounded-lg mb-3">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {rfp.summary || rfp.description || 'No summary provided'}
                </p>
              </div>

              {/* Key Metrics Row */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-green-50 rounded-lg p-3 border border-green-200 text-center">
                  <p className="text-xs text-green-600 font-semibold">Budget</p>
                  <p className="text-lg font-bold text-green-900">{rfp.budget ? `$${rfp.budget.toLocaleString()}` : 'Not set'}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 text-center">
                  <p className="text-xs text-blue-600 font-semibold">Items</p>
                  <p className="text-lg font-bold text-blue-900">{rfp.line_items?.length || 0} item{(rfp.line_items?.length || 0) !== 1 ? 's' : ''}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200 text-center">
                  <p className="text-xs text-purple-600 font-semibold">Delivery</p>
                  <p className="text-lg font-bold text-purple-900">{rfp.delivery_days ? `${rfp.delivery_days} days` : 'Not set'}</p>
                </div>
              </div>
            </SectionContent>
          )}
        </div>

        {/* BUDGET & PAYMENT */}
        <div>
          <SectionHeader
            icon={Banknote}
            title="Budget & Payment"
            section="budget"
            expanded={expandedSections.budget}
            onToggle={toggleSection}
          />
          {expandedSections.budget && (
            <SectionContent>
              <EditableField
                label="Total Budget"
                value={rfp.budget ? `₹${rfp.budget.toLocaleString()}` : ''}
                onSave={(value) => handleFieldChange('budget', value)}
                type="number"
              />
              <EditableField
                label="Currency"
                value={rfp.currency || ''}
                onSave={(value) => handleFieldChange('currency', value)}
              />
              <EditableField
                label="Payment Terms"
                value={rfp.payment_terms || ''}
                onSave={(value) => handleFieldChange('payment_terms', value)}
              />
            </SectionContent>
          )}
        </div>

        {/* LINE ITEMS */}
        <div>
          <SectionHeader
            icon={Package}
            title="Items & Specifications"
            section="items"
            expanded={expandedSections.items}
            onToggle={toggleSection}
            count={rfp.line_items?.length || 0}
          />
          {expandedSections.items && (
            <SectionContent>
              {rfp.line_items && rfp.line_items.length > 0 ? (
                <div className="space-y-3">
                  {rfp.line_items.map((item, idx) => {
                    // Safely handle item - could be string or object
                    let itemName = 'Item';
                    let itemQuantity = '';
                    let itemSpecs = '';
                    
                    if (typeof item === 'string') {
                      itemName = item;
                    } else if (typeof item === 'object' && item !== null) {
                      itemName = item.name || 'Item';
                      itemQuantity = item.quantity ? `${item.quantity}x ` : '';
                      // Format specs as readable key: value pairs
                      if (item.specs) {
                        if (typeof item.specs === 'string') {
                          itemSpecs = item.specs;
                        } else if (typeof item.specs === 'object') {
                          // Convert object to readable format: key: value, key: value
                          itemSpecs = Object.entries(item.specs)
                            .map(([key, val]) => `${key}: ${val}`)
                            .join(', ');
                        }
                      }
                    }
                    
                    return (
                      <div
                        key={idx}
                        className="p-4 bg-white rounded border border-gray-300 hover:border-blue-400 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-700">{idx + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-base">
                              {itemQuantity}{itemName}
                            </p>
                            {itemSpecs && (
                              <p className="text-sm text-gray-600 mt-1">{itemSpecs}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic px-3 py-2">No items added yet</p>
              )}
            </SectionContent>
          )}
        </div>

        {/* TIMELINE & DELIVERY */}
        <div>
          <SectionHeader
            icon={Calendar}
            title="Timeline & Delivery"
            section="timeline"
            expanded={expandedSections.timeline}
            onToggle={toggleSection}
          />
          {expandedSections.timeline && (
            <SectionContent>
              <EditableField
                label="Delivery Timeline"
                value={rfp.delivery_days ? `${rfp.delivery_days} days` : ''}
                onSave={(value) => handleFieldChange('delivery_days', value)}
                type="number"
              />
              <EditableField
                label="Warranty Period"
                value={rfp.warranty_months ? `${rfp.warranty_months} months` : ''}
                onSave={(value) => handleFieldChange('warranty_months', value)}
                type="number"
              />
            </SectionContent>
          )}
        </div>

        {/* REQUIREMENTS */}
        <div>
          <SectionHeader
            icon={TrendingUp}
            title="Requirements"
            section="requirements"
            expanded={expandedSections.requirements}
            onToggle={toggleSection}
          />
          {expandedSections.requirements && (
            <SectionContent>
              <InfoRow label="Expected Vendors" value={rfp.vendor_count || '0'} />
              <InfoRow
                label="Technical Specs"
                value={
                  typeof rfp.technical_specs === 'string'
                    ? rfp.technical_specs
                    : typeof rfp.technical_specs === 'object' && rfp.technical_specs
                    ? JSON.stringify(rfp.technical_specs)
                    : 'Not specified'
                }
              />
              <InfoRow
                label="Certifications"
                value={
                  typeof rfp.certifications === 'string'
                    ? rfp.certifications
                    : typeof rfp.certifications === 'object' && rfp.certifications
                    ? JSON.stringify(rfp.certifications)
                    : 'Not required'
                }
              />
            </SectionContent>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
        <p className="text-xs text-gray-600 text-center mb-3">
          ✓ Review complete. Ready to send to vendors?
        </p>
        <PrimaryButton onClick={onEdit} loading={editLoading} fullWidth>
          Continue to Vendors →
        </PrimaryButton>
        <p className="text-xs text-gray-500 text-center">
          Need to make changes? Click on any section header to edit
        </p>
      </div>
    </div>
  );
}
