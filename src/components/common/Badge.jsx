import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    processing: 'bg-blue-50 text-blue-700 border-blue-200/60',
    delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    new: 'bg-amber-50 text-amber-700 border-amber-200/60',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variants[variant] || variants.default} ${sizes[size] || sizes.sm} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
