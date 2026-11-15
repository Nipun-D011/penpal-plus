import React from 'react';

export const PrintJobCard = ({ job, onClick, onDragStart }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, job.id)}
      onClick={() => onClick && onClick(job)}
      className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all cursor-grab active:cursor-grabbing select-none group"
    >
      {/* Top: Job ID */}
      <div className="text-[11px] font-medium tracking-wide text-slate-400">
        {job.id}
      </div>

      {/* Middle: Title & Customer */}
      <h4 className="font-bold text-slate-900 text-sm leading-snug mt-1 group-hover:text-blue-900 transition-colors">
        {job.title}
      </h4>

      <p className="text-xs text-slate-500 font-normal mt-1">
        {job.customer}
      </p>

      {/* Bottom: Timing & Price */}
      <div className="flex items-center justify-between mt-3.5 pt-2 border-t border-slate-100/60 text-xs">
        <span
          className={`font-medium ${
            job.timing?.toLowerCase().includes('today')
              ? 'text-amber-700 font-semibold'
              : 'text-slate-500'
          }`}
        >
          {job.timing}
        </span>
        <span className="font-bold text-slate-900 text-xs md:text-sm">
          {job.amount}
        </span>
      </div>
    </div>
  );
};

export default PrintJobCard;
