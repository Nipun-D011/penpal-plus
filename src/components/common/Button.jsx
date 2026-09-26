import React from 'react';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  isLoading = false,
  disabled = false,
  onClick,
  icon,
  ...props
}) => {
  const baseStyles =
    'w-full py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-[#131e36] hover:bg-[#1a2846] text-white shadow-sm focus:ring-[#131e36]',
    secondary:
      'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm focus:ring-slate-300',
    outline:
      'border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-200',
    ghost:
      'text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-200',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        icon && <span className="flex-shrink-0">{icon}</span>
      )}
      {children}
    </button>
  );
};

export default Button;
