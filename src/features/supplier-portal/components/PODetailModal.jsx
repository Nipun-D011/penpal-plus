import { useState } from 'react';
import {
  X,
  Printer,
  CheckCircle2,
  Truck,
  Package,
  Clock,
  Send,
} from 'lucide-react';

export const PODetailModal = ({
  isOpen,
  onClose,
  purchaseOrder,
  onUpdateStatus,
}) => {
  if (!isOpen || !purchaseOrder) return null;

  return (
    <PODetailModalContent
      key={`${purchaseOrder.id}-${purchaseOrder.status || 'open'}`}
      onClose={onClose}
      purchaseOrder={purchaseOrder}
      onUpdateStatus={onUpdateStatus}
    />
  );
};

const PODetailModalContent = ({ onClose, purchaseOrder, onUpdateStatus }) => {
  const [localStatus, setLocalStatus] = useState(purchaseOrder.status || 'Ordered');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = (newStatus) => {
    setIsUpdating(true);
    setTimeout(() => {
      setLocalStatus(newStatus);
      if (onUpdateStatus) {
        onUpdateStatus(purchaseOrder.id, newStatus);
      }
      setIsUpdating(false);
    }, 300);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-[#131d33] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#dfa84a]" />
            <h3 className="font-bold text-sm tracking-wide">
              Purchase Order Specification · {purchaseOrder.id}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PO Document Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Header & Meta */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Purchaser / Client
              </span>
              <h2 className="font-serif font-bold text-lg text-slate-900">
                PEN PAL PLUS (PVT) LTD
              </h2>
              <p className="text-xs text-slate-500">
                12 Kurunegala-Puttalam Rd, Kurunegala
              </p>
              <p className="text-xs text-slate-500">
                Authorized By:{' '}
                <strong className="text-slate-700">
                  {purchaseOrder.orderedBy}
                </strong>
              </p>
            </div>

            <div className="sm:text-right bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Purchase Order Details
              </span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {purchaseOrder.id}
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                Issued: {purchaseOrder.issueDate}
              </p>
              <p className="text-xs text-amber-700 font-semibold">
                Due Delivery: {purchaseOrder.expectedDelivery}
              </p>
            </div>
          </div>

          {/* Stepper Status Progression */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#dfa84a]" />
                Fulfillment & Dispatch Milestones
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Status: {localStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2">
              {purchaseOrder.timeline?.map((stepItem) => (
                <div
                  key={stepItem.step}
                  className={`p-2.5 rounded-lg border text-xs ${
                    stepItem.completed
                      ? 'bg-white border-emerald-200 text-slate-800 shadow-xs'
                      : 'bg-slate-100/60 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    {stepItem.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block flex-shrink-0" />
                    )}
                    <span className="truncate">{stepItem.title}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    {stepItem.time}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Itemized Deliveries Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-slate-500" />
              Itemized Stock Breakdown
            </h4>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Item & SKU</th>
                    <th className="py-2.5 px-2 text-center">Ordered</th>
                    <th className="py-2.5 px-2 text-center">Shop Received</th>
                    <th className="py-2.5 px-2 text-center">Outstanding</th>
                    <th className="py-2.5 px-3 text-right">Unit Rate</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {purchaseOrder.items?.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3 font-medium text-slate-900">
                        {item.name}
                        <span className="block text-[10px] font-mono text-slate-400">
                          SKU: {item.sku}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-bold">
                        {item.orderedQty}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono text-emerald-700 font-semibold">
                        {item.receivedQty}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono">
                        {item.pendingQty > 0 ? (
                          <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-bold">
                            {item.pendingQty} due
                          </span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                        {item.unitRate}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        {item.subtotal}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                  <tr>
                    <td
                      colSpan="5"
                      className="py-3 px-3 text-right text-slate-700"
                    >
                      Total PO Value:
                    </td>
                    <td className="py-3 px-3 text-right text-slate-900 font-mono text-sm">
                      {purchaseOrder.totalAmount}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Supplier Dispatch Actions */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 space-y-3">
            <span className="text-xs font-bold text-blue-950 block">
              Vendor Action & Dispatch Confirmation
            </span>
            <p className="text-[11px] text-blue-800">
              Update Pen Pal Plus in real time as your logistics team processes or dispatches this shipment.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {localStatus === 'Ordered' && (
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleStatusChange('Processing')}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Acknowledge & Confirm PO</span>
                </button>
              )}

              {(localStatus === 'Ordered' || localStatus === 'Processing') && (
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleStatusChange('Dispatched')}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Mark as Dispatched / In Transit</span>
                </button>
              )}

              {localStatus === 'Partially Received' && (
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleStatusChange('Dispatched')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Remaining Balance</span>
                </button>
              )}

              {localStatus === 'Fulfilled' && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>All items verified & received into Pen Pal Plus inventory.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-[#131d33] bg-[#dfa84a] hover:bg-[#d49e3f] rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official PO Document</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PODetailModal;
