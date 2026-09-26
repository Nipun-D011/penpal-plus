import React from 'react';
import { Check } from 'lucide-react';

export const AuthHero = () => {
  const features = [
    'Real-time stock & job status',
    'Digital invoices & receipts',
    'Remote sales monitoring',
  ];

  return (
    <div className="relative w-full h-full bg-[#111a2e] bg-gradient-to-b from-[#131f38] via-[#0f172a] to-[#0b1222] p-8 md:p-12 lg:p-16 flex flex-col justify-between overflow-hidden">
      {/* Background subtle atmospheric radial light glow */}
      <div 
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div 
        className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Brand Header */}
      <div className="relative z-10 flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-lg bg-[#d5983b] flex items-center justify-center shadow-md flex-shrink-0">
          <span className="font-serif font-black text-[#1a253c] text-lg tracking-tight select-none">
            PP
          </span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-white font-semibold text-base md:text-lg leading-tight tracking-normal font-sans">
            Pen Pal Plus
          </h1>
          <span className="text-[#d5983b] text-[10px] md:text-[11px] font-bold tracking-widest uppercase mt-0.5">
            BOOKSHOP & PRINTING PRESS
          </span>
        </div>
      </div>

      {/* Main Hero Copy */}
      <div className="relative z-10 my-auto py-12 max-w-lg">
        <h2 className="text-3xl md:text-4xl lg:text-[42px] font-serif font-normal text-white leading-[1.2] tracking-tight mb-5">
          Run the whole shop from one screen.
        </h2>
        
        <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8">
          Sign in to manage inventory, print jobs, billing and reports — from the counter or from anywhere.
        </p>

        {/* Feature list */}
        <ul className="space-y-3.5">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-3 text-slate-200 text-xs md:text-sm font-medium">
              <Check className="w-4 h-4 text-[#d5983b] stroke-[2.5] flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer info */}
      <div className="relative z-10 pt-6 border-t border-slate-800/60">
        <p className="text-slate-400 text-[11px] md:text-xs">
          © 2026 Pen Pal Plus (Pvt) Ltd · 12 Kurunegala–Puttalam Rd, Kurunegala 60000
        </p>
      </div>
    </div>
  );
};

export default AuthHero;
