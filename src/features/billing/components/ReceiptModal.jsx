import React, { useRef } from 'react';
import { X, Printer, CheckCircle, Download } from 'lucide-react';

export const ReceiptModal = ({ isOpen, onClose, invoice }) => {
  const receiptRef = useRef(null);

  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (val) => {
    const num = parseFloat(val) || 0;
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const subtotal = invoice.subtotal || invoice.numericAmount || 0;
  const discount = invoice.discount || 0;
  const total = invoice.totalDue || invoice.total || invoice.numericAmount || (subtotal - discount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h3 className="font-bold text-sm text-slate-800">
              Receipt / Tax Invoice
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-slate-100/50">
          <div
            ref={receiptRef}
            className="bg-white p-6 md:p-8 rounded-xl border border-slate-200/90 shadow-sm font-sans print:shadow-none print:border-none print:p-0"
            id="printable-receipt"
          >
            {/* Header: Shop Branding */}
            <div className="text-center pb-5 border-b border-dashed border-slate-300">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#dfa84a] text-[#131d33] font-serif font-black text-lg mb-2 shadow-sm">
                PP
              </div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                PEN PAL PLUS
              </h1>
              <p className="text-[10px] tracking-widest font-bold text-amber-700 uppercase">
                BOOKSHOP & PRESS
              </p>
              <p className="text-xs text-slate-500 mt-1">
                42 Colombo Road, Kurunegala
              </p>
              <p className="text-xs text-slate-500">
                Tel: 037 222 4471 · 077 233 1190
              </p>
            </div>

            {/* Invoice Meta */}
            <div className="py-4 border-b border-dashed border-slate-300 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice No:</span>
                <span className="font-bold font-mono text-slate-800">
                  {invoice.invoiceNumber || invoice.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date:</span>
                <span className="font-medium text-slate-700">
                  {invoice.fullDate || new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-semibold text-slate-800">
                  {invoice.customerName || invoice.customer || 'General Customer'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment:</span>
                <span className="font-semibold text-slate-800">
                  {invoice.paymentMethod || 'Cash'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Billed by:</span>
                <span className="text-slate-700">Aravinda Perera (Admin)</span>
              </div>
            </div>

            {/* Items List */}
            <div className="py-4 border-b border-dashed border-slate-300">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider grid grid-cols-12 pb-2">
                <span className="col-span-6">Description</span>
                <span className="col-span-2 text-right">Qty</span>
                <span className="col-span-2 text-right">Rate</span>
                <span className="col-span-2 text-right">Amount</span>
              </div>

              <div className="space-y-2.5 pt-1 text-xs">
                {invoice.items && invoice.items.length > 0 ? (
                  invoice.items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 text-slate-800">
                      <span className="col-span-6 font-medium pr-1">
                        {item.description || 'Custom Item'}
                      </span>
                      <span className="col-span-2 text-right text-slate-600">
                        {item.qty}
                      </span>
                      <span className="col-span-2 text-right text-slate-600">
                        {parseFloat(item.rate || 0).toFixed(2)}
                      </span>
                      <span className="col-span-2 text-right font-semibold text-slate-900">
                        {formatCurrency(item.amount || (item.qty * item.rate))}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-slate-400 text-xs py-2">
                    Standard service charges
                  </div>
                )}
              </div>
            </div>

            {/* Totals Summary */}
            <div className="py-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>Rs. {formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>– Rs. {formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>TOTAL DUE</span>
                <span className="text-[#131d33]">Rs. {formatCurrency(total)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-dashed border-slate-300 space-y-1">
              <p className="text-xs font-semibold text-slate-800">
                Thank you for your business!
              </p>
              <p className="text-[11px] text-slate-400">
                Please retain this receipt for order tracking & job pickup.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-[#131d33] hover:bg-[#1a2642] text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#131d33]/30"
            >
              <Printer className="w-4 h-4" />
              <span>Print receipt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
