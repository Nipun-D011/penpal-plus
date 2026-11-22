import { useState } from 'react';
import PrintJobCard from './PrintJobCard';

const COLUMN_THEMES = {
  pending: {
    borderTop: 'border-t-4 border-amber-500',
    bg: 'bg-amber-50/60',
    badge: 'bg-amber-100 text-amber-800',
  },
  prepress: {
    borderTop: 'border-t-4 border-indigo-500',
    bg: 'bg-indigo-50/60',
    badge: 'bg-indigo-100 text-indigo-800',
  },
  printing: {
    borderTop: 'border-t-4 border-sky-500',
    bg: 'bg-sky-50/60',
    badge: 'bg-sky-100 text-sky-800',
  },
  ready: {
    borderTop: 'border-t-4 border-emerald-500',
    bg: 'bg-emerald-50/60',
    badge: 'bg-emerald-100 text-emerald-800',
  },
  completed: {
    borderTop: 'border-t-4 border-slate-400',
    bg: 'bg-slate-100/60',
    badge: 'bg-slate-200 text-slate-700',
  },
};

export const PrintJobColumn = ({
  column,
  jobs,
  badgeCount,
  onCardClick,
  onDragStart,
  onDropJob,
}) => {
  const [isOver, setIsOver] = useState(false);

  const theme = COLUMN_THEMES[column.id] || {
    borderTop: 'border-t-4 border-slate-300',
    bg: 'bg-slate-50/60',
    badge: 'bg-slate-100 text-slate-700',
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isOver) setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    const jobId = e.dataTransfer.getData('text/plain');
    if (jobId && onDropJob) {
      onDropJob(jobId, column.id);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col min-w-[240px] flex-1 rounded-2xl ${theme.borderTop} ${theme.bg} p-3 border border-slate-200/60 transition-all duration-150 ${
        isOver
          ? 'ring-2 ring-amber-400/60 ring-dashed scale-[1.01]'
          : 'shadow-xs'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 px-1">
        <h3 className="font-bold text-xs md:text-sm text-slate-900 tracking-tight">
          {column.title}
        </h3>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${theme.badge}`}
        >
          {badgeCount ?? jobs.length}
        </span>
      </div>

      {/* Cards List Area */}
      <div className="space-y-3.5 flex-1 min-h-[300px]">
        {jobs.length === 0 ? (
          <div className="h-32 border-2 border-dashed border-slate-200/80 rounded-xl flex items-center justify-center text-xs text-slate-400">
            Drop tickets here
          </div>
        ) : (
          jobs.map((job) => (
            <PrintJobCard
              key={job.id}
              job={job}
              onClick={onCardClick}
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PrintJobColumn;
