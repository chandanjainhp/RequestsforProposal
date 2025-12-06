/**
 * STICKY ACTION BAR COMPONENT
 * Keeps primary action buttons visible while scrolling
 * PRINCIPLE: VISIBILITY - Important actions always accessible
 * PRINCIPLE: AFFORDANCES - Clear call-to-action buttons
 */

import { Save, RotateCcw } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './Button';

export default function StickyActionBar({ 
  onSave, 
  onCancel, 
  saveLoading = false, 
  saveLabel = 'Save as Draft',
  cancelLabel = 'Start New',
  showActions = false 
}) {
  if (!showActions) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="max-w-full px-6 py-4 flex gap-3 justify-center lg:justify-start">
        <div className="flex-1 max-w-sm">
          <PrimaryButton
            onClick={onSave}
            loading={saveLoading}
            fullWidth
          >
            <Save size={18} />
            {saveLabel}
          </PrimaryButton>
        </div>
        <SecondaryButton
          onClick={onCancel}
          className="px-6"
        >
          <RotateCcw size={18} />
          {cancelLabel}
        </SecondaryButton>
      </div>
    </div>
  );
}
