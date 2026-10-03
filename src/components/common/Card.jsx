import React from 'react';

export const Card = ({ children, className = '', padding = 'p-5', ...props }) => {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
