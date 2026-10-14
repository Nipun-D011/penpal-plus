import React from 'react';

export const RecentInvoicesList = ({
  invoices,
  onSelectInvoice,
  onViewAll,
}) => {
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700">
            Pending
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700">
            Overdue
          </span>
        );
      default:
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-7 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <h2 className="text-lg md:text-[19px] font-bold text-slate-900 tracking-tight">
          Recent invoices
        </h2>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors focus:outline-none"
        >
          View all
        </button>
      </div>

      {/* Invoices List */}
      <div className="divide-y divide-slate-100">
        {invoices.map((inv) => (
          <div
            key={inv.id}
            onClick={() => onSelectInvoice && onSelectInvoice(inv)}
            className="py-4.5 flex items-center justify-between gap-3 group cursor-pointer hover:bg-slate-50/70 -mx-4 px-4 rounded-xl transition-all"
          >
            {/* Left: Avatar + Details */}
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className={`w-9 h-9 md:w-10 md:h-10 rounded-full text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm ${
                  inv.avatarBg || 'bg-[#15803d]'
                }`}
              >
                {inv.initials || 'IN'}
              </div>

              <div className="flex flex-col min-w-0">
                <span className="font-bold text-xs md:text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                  {inv.id}
                </span>
                <span className="text-xs text-slate-500 truncate mt-0.5">
                  {inv.customer} · {inv.date}
                </span>
              </div>
            </div>

            {/* Right: Amount + Status */}
            <div className="flex flex-col items-end flex-shrink-0">
              <span className="font-bold text-xs md:text-sm text-slate-900">
                {inv.amount}
              </span>
              <div className="mt-1">
                {getStatusBadge(inv.status)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentInvoicesList;
