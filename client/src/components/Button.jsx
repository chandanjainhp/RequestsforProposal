import { Loader2 } from 'lucide-react';

/**
 * DESIGN PRINCIPLES APPLIED:
 * 1. AFFORDANCES: Clear visual distinction between button types
 * 2. SIGNIFIERS: Hover effects, loading states, disabled states show clickability
 * 3. FEEDBACK: Loading spinner, disabled state feedback
 * 4. CONSISTENCY: Same styling across all buttons
 */

export function PrimaryButton({ 
  children, 
  loading = false, 
  disabled = false,
  onClick,
  className = '',
  fullWidth = false,
  ...props 
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn-primary flex items-center justify-center gap-2 ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
      aria-disabled={disabled || loading}
    >
      {loading && <Loader2 size={18} className="animate-spin" />}
      {children}
    </button>
  );
}

export function SecondaryButton({ 
  children, 
  loading = false, 
  disabled = false,
  onClick,
  className = '',
  fullWidth = false,
  ...props 
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn-secondary flex items-center justify-center gap-2 ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
      aria-disabled={disabled || loading}
    >
      {loading && <Loader2 size={18} className="animate-spin" />}
      {children}
    </button>
  );
}

export function DangerButton({ 
  children, 
  loading = false, 
  disabled = false,
  onClick,
  className = '',
  fullWidth = false,
  ...props 
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn-secondary text-red-600 flex items-center justify-center gap-2 ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
      aria-disabled={disabled || loading}
    >
      {loading && <Loader2 size={18} className="animate-spin" />}
      {children}
    </button>
  );
}

export function SuccessButton({ 
  children, 
  loading = false, 
  disabled = false,
  onClick,
  className = '',
  fullWidth = false,
  ...props 
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn-primary text-white bg-green-600 flex items-center justify-center gap-2 ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
      aria-disabled={disabled || loading}
    >
      {loading && <Loader2 size={18} className="animate-spin" />}
      {children}
    </button>
  );
}

export function IconButton({ 
  icon: Icon,
  onClick,
  tooltip = '',
  disabled = false,
  className = '',
  ...props 
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        p-2 rounded-lg transition duration-200 cursor-pointer
        hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      title={tooltip}
      {...props}
    >
      {Icon && <Icon size={20} />}
    </button>
  );
}

export function LinkButton({ 
  children, 
  onClick,
  disabled = false,
  className = '',
  ...props 
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        text-blue-600 underline hover:text-blue-700
        transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
