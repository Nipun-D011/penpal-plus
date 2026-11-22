import { useState } from 'react';
import {
  Search,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Receipt,
  Printer,
  Package,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const CustomerLiveTracker = ({
  orders = [],
  allOrders = [],
  onOpenReceipt,
}) => {
  const [searchCode, setSearchCode] = useState('');
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id || null);

  const handleManualTrack = (e) => {
    e.preventDefault();
    setSearchError('');
    const code = searchCode.trim().toUpperCase();
    if (!code) return;

    const found = allOrders.find(
      (o) => o.id?.toUpperCase() === code || o.id?.toUpperCase().includes(code)
    );

    if (found) {
      setSearchedOrder(found);
      setSelectedOrderId(found.id);
    } else {
      setSearchError(`No order found matching "${code}". Try ORD-0512 or PP-2026-0341.`);
    }
  };

  const displayedOrder =
    searchedOrder ||
    orders.find((o) => o.id === selectedOrderId) ||
    orders[0] ||
    null;

  // Derive realistic progress steps if timeline is not explicitly formatted
  const getProgressSteps = (order) => {
    if (order?.timeline && order.timeline.length > 0) {
      return order.timeline;
    }

    const status = order?.status?.toLowerCase() || 'pending';

    const isDelivered = status === 'delivered' || status === 'completed';
    const isReady = isDelivered || status === 'ready';
    const isProcessing = isReady || status === 'processing' || status === 'printing' || status === 'prepress';

    return [
      {
        step: 1,
        title: 'Order Confirmed',
        desc: 'Requisition verified & queued in store system',
        time: order?.orderDate || 'Today, 09:30 AM',
        completed: true,
        current: !isProcessing,
      },
      {
        step: 2,
        title: 'In Production',
        desc: 'Printing, binding & QA inspection in progress',
        time: isProcessing ? 'In progress' : 'Upcoming',
        completed: isProcessing,
        current: isProcessing && !isReady,
      },
      {
        step: 3,
        title: 'Ready for Collection',
        desc: 'Packaged & available at main retail counter',
        time: isReady ? (order?.estimatedReady || 'Ready now') : 'Est. Today',
        completed: isReady,
        current: isReady && !isDelivered,
      },
      {
        step: 4,
        title: 'Completed',
        desc: 'Handed over to customer & invoice closed',
        time: isDelivered ? 'Completed' : 'Pending pickup',
        completed: isDelivered,
        current: isDelivered,
      },
    ];
  };

  const steps = displayedOrder ? getProgressSteps(displayedOrder) : [];

  return (
    <div className="space-y-6">
      {/* Search Order or Print Job Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-[#dfa84a] flex items-center justify-center">
              <Search className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Track Any Order or Print Ticket
            </h2>
          </div>
          <p className="text-xs text-slate-500 mb-3.5">
            Enter your order ticket reference (e.g. <span className="font-mono font-medium text-slate-700 bg-slate-100 px-1 py-0.5 rounded">ORD-0512</span> or <span className="font-mono font-medium text-slate-700 bg-slate-100 px-1 py-0.5 rounded">PP-2026-0341</span>) to view real-time stage progress.
          </p>

          <form onSubmit={handleManualTrack} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Enter Order ID or Ticket Number..."
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#131d33]/15 focus:border-[#131d33] transition-all uppercase placeholder:normal-case font-mono"
              />
            </div>
            <button
              type="submit"
              className="bg-[#131d33] hover:bg-[#1f2d4d] text-white px-4 py-2 text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Track Order</span>
            </button>
            {searchedOrder && (
              <button
                type="button"
                onClick={() => {
                  setSearchedOrder(null);
                  setSearchCode('');
                }}
                className="px-3 py-2 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg cursor-pointer"
              >
                Clear
              </button>
            )}
          </form>

          {searchError && (
            <p className="text-xs text-rose-600 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{searchError}</span>
            </p>
          )}
        </div>
      </div>

      {/* Multiple Orders Quick Selector Chips */}
      {orders.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex-shrink-0 mr-1">
            Your Orders:
          </span>
          {orders.map((o) => {
            const isSelected = displayedOrder?.id === o.id;
            const isPrint = o.type?.toLowerCase().includes('print');
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setSearchedOrder(null);
                  setSelectedOrderId(o.id);
                }}
                className={`px-3.5 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                  isSelected
                    ? 'bg-[#131d33] text-white border-[#131d33]'
                    : 'bg-white text-slate-700 border-slate-200/90 hover:border-slate-300'
                }`}
              >
                {isPrint ? (
                  <Printer className="w-3.5 h-3.5 text-[#dfa84a]" />
                ) : (
                  <Package className="w-3.5 h-3.5 text-[#dfa84a]" />
                )}
                <span className="font-mono font-semibold">{o.id}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-slate-200' : 'bg-slate-100 text-slate-600'
                }`}>
                  {o.status}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main High-Fidelity Active Tracking Card */}
      {displayedOrder ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
          {/* Card Top Banner: Deep Navy & Gold Accents */}
          <div className="bg-[#131d33] text-white p-5 sm:p-6 border-b border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-[#dfa84a] text-[#131d33] shadow-xs">
                    {displayedOrder.id}
                  </span>
                  <span className="text-xs font-medium text-slate-300">
                    {displayedOrder.type}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  <span className="text-xs text-slate-400">
                    Placed on {displayedOrder.orderDate}
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-white tracking-tight">
                    {displayedOrder.status}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    {displayedOrder.paymentStatus || 'Paid in Full'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#dfa84a]" />
                  <span>{displayedOrder.pickupLocation || 'Main Counter, Pen Pal Plus - Kurunegala'}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 self-start sm:self-auto flex-shrink-0">
                {onOpenReceipt && (
                  <button
                    type="button"
                    onClick={() => onOpenReceipt(displayedOrder)}
                    className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-medium px-4 py-2.5 rounded-lg border border-slate-700 transition-colors shadow-xs cursor-pointer"
                  >
                    <Receipt className="w-3.5 h-3.5 text-[#dfa84a]" />
                    <span>View Official Receipt</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* High-Fidelity Stepper Timeline Section */}
          <div className="p-6 sm:p-7 border-b border-slate-100 bg-slate-50/40">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#dfa84a]" />
                <span>Production & Fulfillment Pipeline</span>
              </h4>
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Target ready: <strong className="text-slate-800 font-semibold">{displayedOrder.estimatedReady || 'Today'}</strong>
              </span>
            </div>

            {/* Stepper Progress Bar & Cards */}
            <div className="relative">
              {/* Connector Track (Desktop) */}
              <div className="hidden md:block absolute top-6 left-10 right-10 h-0.5 bg-slate-200 z-0">
                <div
                  className="h-full bg-[#131d33] transition-all duration-500"
                  style={{
                    width: `${
                      steps.filter((s) => s.completed).length === steps.length
                        ? 100
                        : ((steps.filter((s) => s.completed).length - 0.5) / (steps.length - 1)) * 100
                    }%`,
                  }}
                />
              </div>

              {/* Step Columns */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
                {steps.map((stepItem) => {
                  const isDone = stepItem.completed;
                  const isCurrent = stepItem.current;

                  return (
                    <div
                      key={stepItem.step}
                      className={`relative p-4 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-white border-[#dfa84a] shadow-md ring-2 ring-[#dfa84a]/20'
                          : isDone
                          ? 'bg-white border-slate-200/90 shadow-xs'
                          : 'bg-slate-50/80 border-slate-200/60 opacity-60'
                      }`}
                    >
                      {/* Top Node Indicator */}
                      <div className="flex items-center gap-3 mb-2.5">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                            isDone && !isCurrent
                              ? 'bg-[#131d33] text-white shadow-xs'
                              : isCurrent
                              ? 'bg-[#dfa84a] text-[#131d33] shadow-sm animate-pulse'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {isDone && !isCurrent ? (
                            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                          ) : (
                            <span>{stepItem.step}</span>
                          )}
                        </div>

                        <div>
                          <span
                            className={`text-xs font-bold leading-tight block ${
                              isCurrent
                                ? 'text-slate-900'
                                : isDone
                                ? 'text-slate-900'
                                : 'text-slate-500'
                            }`}
                          >
                            {stepItem.title}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-semibold text-[#dfa84a] uppercase tracking-wider block">
                              Active Stage
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 font-normal leading-relaxed min-h-[32px]">
                        {stepItem.desc}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Timestamp:</span>
                        <span className="font-semibold text-slate-700">
                          {stepItem.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Details & Summary Breakdown */}
          <div className="p-6 sm:p-7 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Itemized Breakdown */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Package className="w-4 h-4 text-slate-600" />
                <span>Itemized Order Specifications</span>
              </h4>

              <div className="border border-slate-200/90 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3.5">Item Description</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3.5 text-right">Unit Rate</th>
                      <th className="py-2.5 px-3.5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {displayedOrder.items?.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3.5 font-medium text-slate-900">
                          {item.name}
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-600">
                          {item.qty}
                        </td>
                        <td className="py-3 px-3.5 text-right font-mono text-slate-500">
                          {item.unitPrice}
                        </td>
                        <td className="py-3 px-3.5 text-right font-mono font-semibold text-slate-900">
                          {item.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50/90 font-bold border-t border-slate-200">
                    <tr>
                      <td colSpan="3" className="py-3 px-3.5 text-right text-slate-600">
                        Total Amount:
                      </td>
                      <td className="py-3 px-3.5 text-right text-slate-900 font-serif font-bold text-sm">
                        {displayedOrder.totalAmount}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {displayedOrder.notes && (
                <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-amber-950">
                      Print Job Specifications:
                    </span>{' '}
                    <span>{displayedOrder.notes}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Col: Collection & Store Counter Card */}
            <div className="space-y-4">
              <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-3.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Collection Location</span>
                </h4>

                <div className="text-xs space-y-2.5 text-slate-600">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Store Pickup Counter
                    </span>
                    <span className="font-semibold text-slate-900 text-sm">
                      Pen Pal Plus (Pvt) Ltd
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      12 Kurunegala-Puttalam Rd, Kurunegala 60000
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Business Hours
                    </span>
                    <span className="text-slate-700 font-medium">
                      Mon – Sat: 8:00 AM – 7:30 PM
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Help & Enquiries
                    </span>
                    <span className="text-slate-800 font-semibold font-mono">
                      037 222 3456 / 077 233 1190
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-sm">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-lg text-slate-800">
            No Active Orders Found
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You do not have any active printing jobs or book orders in progress. Enter an order number above to search.
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerLiveTracker;
