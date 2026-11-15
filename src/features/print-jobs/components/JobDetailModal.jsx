import React from 'react';
import { X, Trash2, ArrowRight } from 'lucide-react';

export const JobDetailModal = ({
  isOpen,
  job,
  onClose,
  columns,
  onUpdateStatus,
  onDelete,
}) => {
  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              {job.id}
            </span>
            <h3 className="font-serif font-bold text-lg text-slate-900 mt-0.5">
              {job.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-3.5 text-xs md:text-sm">
          <div className="flex justify-between py-1 border-b border-slate-50">
            <span className="text-slate-500">Customer</span>
            <span className="font-semibold text-slate-800">{job.customer}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-50">
            <span className="text-slate-500">Job Type</span>
            <span className="font-medium text-slate-800">{job.jobType || 'Printing'}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-50">
            <span className="text-slate-500">Assigned Staff</span>
            <span className="font-medium text-slate-800">{job.staff || 'Sunil'}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-50">
            <span className="text-slate-500">Timing</span>
            <span className="font-semibold text-amber-700">{job.timing}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-50">
            <span className="text-slate-500">Amount</span>
            <span className="font-bold text-slate-900 text-base">{job.amount}</span>
          </div>

          {/* Change Status Dropdown */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Change Pipeline Stage
            </label>
            <div className="grid grid-cols-2 gap-2">
              {columns.map((col) => {
                const isCurrent = col.id === job.status;
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => {
                      onUpdateStatus(job.id, col.id);
                      onClose();
                    }}
                    className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-left flex items-center justify-between transition-all ${
                      isCurrent
                        ? 'border-[#e8a838] bg-amber-50/70 text-slate-900 ring-1 ring-[#e8a838]'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{col.title}</span>
                    {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              onDelete(job.id);
              onClose();
            }}
            className="text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete ticket</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;
