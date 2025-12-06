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
      className={`
        px-4 py-2 rounded-lg font-medium transition duration-200 cursor-pointer
        bg-blue-600 text-white
        hover:bg-blue-700 hover:shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
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
      className={`
        px-4 py-2 rounded-lg font-medium transition duration-200 cursor-pointer
        bg-gray-200 text-gray-900
        hover:bg-gray-300 hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
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
      className={`
        px-4 py-2 rounded-lg font-medium transition duration-200 cursor-pointer
        bg-red-600 text-white
        hover:bg-red-700 hover:shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
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
      className={`
        px-4 py-2 rounded-lg font-medium transition duration-200 cursor-pointer
        bg-green-600 text-white
        hover:bg-green-700 hover:shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
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
