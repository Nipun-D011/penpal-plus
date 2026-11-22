const STATUS_THEMES = {
  pending: {
    borderLeft: 'border-l-4 border-l-amber-500',
    badge: 'bg-amber-100 text-amber-800',
    label: 'Pending',
  },
  prepress: {
    borderLeft: 'border-l-4 border-l-indigo-500',
    badge: 'bg-indigo-100 text-indigo-800',
    label: 'Prepress',
  },
  printing: {
    borderLeft: 'border-l-4 border-l-sky-500',
    badge: 'bg-sky-100 text-sky-800',
    label: 'Printing',
  },
  ready: {
    borderLeft: 'border-l-4 border-l-emerald-500',
    badge: 'bg-emerald-100 text-emerald-800',
    label: 'Ready',
  },
  completed: {
    borderLeft: 'border-l-4 border-l-slate-400',
    badge: 'bg-slate-200 text-slate-700',
    label: 'Completed',
  },
};

export const PrintJobCard = ({ job, onClick, onDragStart }) => {
  const theme = STATUS_THEMES[job.status] || {
    borderLeft: 'border-l-4 border-l-slate-300',
    badge: 'bg-slate-100 text-slate-700',
    label: job.status || 'General',
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, job.id)}
      onClick={() => onClick && onClick(job)}
      className={`bg-white rounded-xl border border-slate-200/80 ${theme.borderLeft} p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all cursor-grab active:cursor-grabbing select-none group`}
    >
      {/* Top: Job ID & Status Pill */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium tracking-wide text-slate-400">
          {job.id}
        </span>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${theme.badge}`}
        >
          {theme.label}
        </span>
      </div>

      {/* Middle: Title & Customer */}
      <h4 className="font-bold text-slate-900 text-sm leading-snug mt-1.5 group-hover:text-blue-900 transition-colors">
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
