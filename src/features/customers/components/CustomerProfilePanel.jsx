import React from 'react';

export const CustomerProfilePanel = ({ customer }) => {
  if (!customer) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex items-center justify-center min-h-[350px] text-slate-400 text-xs">
        Select a customer to view profile details
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
      <div>
        {/* Panel Header */}
        <div className="flex items-center gap-2.5 pb-5">
          <h2 className="font-bold text-sm md:text-base text-slate-900">
            {customer.name}
          </h2>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
            Profile panel
          </span>
        </div>

        {/* Customer Basic Info */}
        <div className="flex items-center gap-3.5 mb-6">
          <div
            className={`w-12 h-12 rounded-full text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm ${
              customer.avatarBg || 'bg-[#15803d]'
            }`}
          >
            {customer.initials}
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="font-semibold text-sm md:text-base text-slate-900 leading-tight">
              {customer.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {customer.phone} · {customer.city || 'Kurunegala'}
            </p>
          </div>
        </div>

        {/* 3 Metric Tiles (Orders, Total spent, Since) */}
        <div className="grid grid-cols-3 gap-2.5 mb-8">
          <div className="bg-slate-50/90 border border-slate-100 rounded-xl p-3 flex flex-col">
            <span className="text-[11px] font-medium text-slate-500">Orders</span>
            <span className="font-serif font-bold text-lg md:text-xl text-slate-900 mt-1">
              {customer.ordersCount}
            </span>
          </div>

          <div className="bg-slate-50/90 border border-slate-100 rounded-xl p-3 flex flex-col">
            <span className="text-[11px] font-medium text-slate-500">Total spent</span>
            <span className="font-serif font-bold text-lg md:text-xl text-slate-900 mt-1">
              {customer.totalSpentFormatted || customer.totalSpent}
            </span>
          </div>

          <div className="bg-slate-50/90 border border-slate-100 rounded-xl p-3 flex flex-col">
            <span className="text-[11px] font-medium text-slate-500">Since</span>
            <span className="font-serif font-bold text-lg md:text-xl text-slate-900 mt-1">
              {customer.customerSince || '2023'}
            </span>
          </div>
        </div>

        {/* Purchase History Section */}
        <div>
          <h4 className="text-xs md:text-sm font-semibold text-slate-900 mb-4">
            Purchase history
          </h4>

          <div className="space-y-3.5">
            {customer.purchaseHistory && customer.purchaseHistory.length > 0 ? (
              customer.purchaseHistory.map((invoice, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs md:text-sm py-1"
                >
                  <span className="font-medium text-slate-700">
                    {invoice.id} · {invoice.date}
                  </span>
                  <span className="font-bold text-slate-900">
                    {invoice.amount}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-2">
                No past transactions recorded yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfilePanel;
