import { X, Printer, CheckCircle } from 'lucide-react';

export const CustomerReceiptModal = ({ isOpen, onClose, order, customer }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#dfa84a]" />
            <h3 className="font-bold text-sm tracking-wide">
              Official Digital Receipt · {order.id}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800" id="customer-printable-receipt">
          {/* Shop Header */}
          <div className="text-center border-b border-dashed border-slate-300 pb-5">
            <div className="w-10 h-10 rounded-lg bg-[#dfa84a] text-[#131d33] font-serif font-black text-lg mx-auto flex items-center justify-center mb-2">
              PP
            </div>
            <h2 className="font-serif font-bold text-xl text-slate-900 tracking-tight">
              PEN PAL PLUS (PVT) LTD
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Smart Bookshop & Commercial Printing Press
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              12 Kurunegala-Puttalam Rd, Kurunegala · Tel: 037 222 1190
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 text-xs gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Billed To
              </span>
              <span className="font-bold text-slate-900">
                {customer?.name || order.customer || 'Valued Customer'}
              </span>
              <p className="text-slate-500 text-[11px]">{customer?.phone}</p>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Receipt / Job Ref
              </span>
              <span className="font-mono font-bold text-slate-900">
                {order.id}
              </span>
              <p className="text-slate-500 text-[11px]">{order.orderDate}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-2 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Price</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {order.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2 px-3 font-medium text-slate-800">
                      {item.name}
                    </td>
                    <td className="py-2 px-2 text-center font-mono">
                      {item.qty}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-slate-500">
                      {item.unitPrice || item.rate}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-semibold text-slate-900">
                      {item.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculation Summary */}
          <div className="space-y-1.5 text-xs pt-2">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-mono">{order.totalAmount}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Tax / Charges</span>
              <span className="font-mono">Rs. 0.00</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2">
              <span>Total Amount</span>
              <span className="font-mono text-base text-slate-900">
                {order.totalAmount}
              </span>
            </div>
          </div>

          {/* Payment & Status Stamp */}
          <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide block">
                  Payment Verified
                </span>
                <span className="text-[10px] text-emerald-700">
                  {order.paymentStatus || 'Settled in full'}
                </span>
              </div>
            </div>
            <span className="font-mono text-[10px] text-slate-400">
              POS-TERM-01
            </span>
          </div>

          {/* Barcode simulation */}
          <div className="text-center pt-2">
            <div className="inline-block font-mono text-[9px] tracking-[6px] text-slate-400 select-none border-t border-b border-slate-200 py-1 px-4">
              ||| | |||| | ||| || |||| | ||||| | ||
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Thank you for choosing Pen Pal Plus!
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-[#131d33] bg-[#dfa84a] hover:bg-[#d49e3f] rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerReceiptModal;
