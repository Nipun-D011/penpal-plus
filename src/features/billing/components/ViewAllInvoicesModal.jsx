import React, { useState, useMemo } from 'react';
import { X, Search, Filter, Printer } from 'lucide-react';

export const ViewAllInvoicesModal = ({
  isOpen,
  onClose,
  invoices,
  onSelectInvoice,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchSearch =
        inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (inv.customerPhone && inv.customerPhone.includes(searchTerm));

      const matchFilter =
        selectedFilter === 'all' ||
        inv.status.toLowerCase() === selectedFilter.toLowerCase();

      return matchSearch && matchFilter;
    });
  }, [invoices, searchTerm, selectedFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              All Invoices & Transactions
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredInvoices.length} of {invoices.length} records
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between bg-white">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by invoice # or customer..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
            {['all', 'paid', 'pending', 'overdue'].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                  selectedFilter === filter
                    ? 'bg-[#131d33] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Invoices Table */}
        <div className="flex-1 overflow-y-auto p-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pl-2">Invoice #</th>
                <th className="pb-3 px-3">Customer</th>
                <th className="pb-3 px-3">Date</th>
                <th className="pb-3 px-3">Method</th>
                <th className="pb-3 px-3 text-right">Amount</th>
                <th className="pb-3 px-3 text-center">Status</th>
                <th className="pb-3 pr-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                  onClick={() => {
                    onSelectInvoice(inv);
                    onClose();
                  }}
                >
                  <td className="py-3 pl-2 font-mono font-bold text-slate-900">
                    {inv.id}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {inv.customer}
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    {inv.date}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {inv.paymentMethod || 'Cash'}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900">
                    {inv.amount}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        inv.status?.toLowerCase() === 'paid'
                          ? 'bg-emerald-50 text-emerald-700'
                          : inv.status?.toLowerCase() === 'pending'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 pr-2 text-right">
                    <button
                      type="button"
                      title="View & print receipt"
                      className="p-1 text-slate-400 group-hover:text-blue-600 rounded transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAllInvoicesModal;
