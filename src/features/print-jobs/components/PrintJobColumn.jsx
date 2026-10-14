import React, { useState } from 'react';
import PrintJobCard from './PrintJobCard';

export const PrintJobColumn = ({
  column,
  jobs,
  badgeCount,
  onCardClick,
  onDragStart,
  onDropJob,
}) => {
  const [isOver, setIsOver] = useState(false);

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
      className={`flex flex-col min-w-[240px] flex-1 rounded-2xl transition-all duration-150 ${
        isOver
          ? 'bg-amber-50/50 ring-2 ring-amber-400/50 ring-dashed'
          : 'bg-transparent'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 px-1">
        <h3 className="font-bold text-xs md:text-sm text-slate-900 tracking-tight">
          {column.title}
        </h3>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100/90 text-slate-600 border border-slate-200/50">
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
