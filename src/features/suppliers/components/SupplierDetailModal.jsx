import React from 'react';
import { X, Phone, Mail, MapPin, Calendar, CreditCard, ShoppingBag } from 'lucide-react';

export const SupplierDetailModal = ({ supplier, isOpen, onClose }) => {
  if (!isOpen || !supplier) return null;

  const isOutstanding = supplier.outstandingRaw > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-xl text-slate-900">
                {supplier.name}
              </h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                {supplier.status || 'Active'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {supplier.category}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
            <span className="text-[11px] font-medium text-slate-500 block">Total Purchases</span>
            <span className="font-serif font-bold text-base md:text-lg text-slate-900 mt-1 block">
              {supplier.totalPurchases}
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
            <span className="text-[11px] font-medium text-slate-500 block">Outstanding</span>
            <span className={`font-serif font-bold text-base md:text-lg mt-1 block ${isOutstanding ? 'text-rose-600' : 'text-emerald-700'}`}>
              {supplier.outstanding}
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-medium text-slate-500 block">Last Purchase</span>
            <span className="font-serif font-bold text-sm md:text-base text-slate-900 mt-1 block">
              {supplier.lastPurchase}
            </span>
          </div>
        </div>

        {/* Contact & Terms Info */}
        <div className="bg-slate-50/60 rounded-xl p-4 border border-slate-100 space-y-2.5 text-xs text-slate-700 mb-5">
          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="font-medium text-slate-900">{supplier.contact}</span>
          </div>
          {supplier.email && (
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>{supplier.email}</span>
            </div>
          )}
          {supplier.address && (
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>{supplier.address}</span>
            </div>
          )}
          {supplier.paymentTerms && (
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>Payment terms: <strong>{supplier.paymentTerms}</strong></span>
            </div>
          )}
        </div>

        {/* Recent Purchase Orders */}
        <div>
          <h4 className="text-xs md:text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-slate-500" />
            Recent Purchase Orders
          </h4>

          {supplier.recentOrders && supplier.recentOrders.length > 0 ? (
            <div className="space-y-2.5">
              {supplier.recentOrders.map((order, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white border border-slate-200/80 rounded-xl flex items-center justify-between text-xs hover:border-slate-300 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{order.id}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        {order.date}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">{order.items}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 block">{order.amount}</span>
                    <span className="text-[10px] text-emerald-600 font-medium">{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-3 text-center border border-dashed border-slate-200 rounded-xl">
              No recent purchase orders logged.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-5 mt-5 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetailModal;
