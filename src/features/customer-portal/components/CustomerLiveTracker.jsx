import { useState } from 'react';
import {
  Search,
  Clock,
  MapPin,
  CheckCircle,
  Circle,
  ShoppingBag,
  Receipt,
  AlertCircle,
  Phone,
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
      (o) => o.id.toUpperCase() === code || o.id.toUpperCase().includes(code)
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

  return (
    <div className="space-y-6">
      {/* Search Order or Print Job Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
        <div className="max-w-2xl">
          <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Search className="w-4 h-4 text-[#dfa84a]" />
            Track Any Order or Print Job
          </h2>
          <p className="text-xs text-slate-500 mb-3">
            Enter your Order ID (e.g., <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">ORD-0512</code> or <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">PP-2026-0341</code>) to view real-time production updates.
          </p>

          <form onSubmit={handleManualTrack} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Enter Order / Print Job ID..."
                className="w-full pl-3.5 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#131d33]/20 focus:border-[#131d33] transition-all uppercase"
              />
            </div>
            <button
              type="submit"
              className="bg-[#131d33] hover:bg-[#1f2d4d] text-white px-4 py-2 text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              Track Status
            </button>
            {searchedOrder && (
              <button
                type="button"
                onClick={() => {
                  setSearchedOrder(null);
                  setSearchCode('');
                }}
                className="px-3 py-2 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg"
              >
                Clear
              </button>
            )}
          </form>

          {searchError && (
            <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {searchError}
            </p>
          )}
        </div>
      </div>

      {/* Main Active Tracking Card */}
      {displayedOrder ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm">
          {/* Card Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-[#1e293b] text-white p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#dfa84a] text-[#131d33]">
                    {displayedOrder.id}
                  </span>
                  <span className="text-xs font-medium text-slate-300">
                    {displayedOrder.type}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Status: {displayedOrder.status}
                </h3>
                <p className="text-xs text-slate-400">
                  Ordered on {displayedOrder.orderDate} · {displayedOrder.pickupLocation}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {onOpenReceipt && (
                  <button
                    type="button"
                    onClick={() => onOpenReceipt(displayedOrder)}
                    className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-3.5 py-2 rounded-lg border border-white/15 transition-colors"
                  >
                    <Receipt className="w-3.5 h-3.5 text-[#dfa84a]" />
                    <span>View Digital Receipt</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Stepper Timeline Section */}
          <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#dfa84a]" />
              Live Order Progress Stepper
            </h4>

            {/* Stepper Layout */}
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {displayedOrder.timeline?.map((stepItem, idx) => {
                  const isDone = stepItem.completed;
                  const isCurrent = stepItem.current;

                  return (
                    <div
                      key={stepItem.step}
                      className={`relative p-4 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-amber-50/80 border-amber-300 shadow-sm'
                          : isDone
                          ? 'bg-white border-emerald-200'
                          : 'bg-slate-50 border-slate-200/80 opacity-70'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {isDone ? (
                          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        ) : isCurrent ? (
                          <div className="w-5 h-5 rounded-full border-2 border-amber-500 bg-amber-100 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
                          </div>
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
                        )}
                        <span
                          className={`text-xs font-bold ${
                            isCurrent
                              ? 'text-amber-900'
                              : isDone
                              ? 'text-slate-900'
                              : 'text-slate-400'
                          }`}
                        >
                          Step {stepItem.step}: {stepItem.title}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                        {stepItem.desc}
                      </p>

                      <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Time:</span>
                        <span className="font-semibold text-slate-600">
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
          <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Items Breakdown */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-slate-600" />
                Items in This Order
              </h4>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Unit Price</th>
                      <th className="py-2.5 px-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {displayedOrder.items?.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-medium text-slate-900">
                          {item.name}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono">
                          {item.qty}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                          {item.unitPrice}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900">
                          {item.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50/80 font-bold border-t border-slate-200">
                    <tr>
                      <td colSpan="3" className="py-3 px-3 text-right text-slate-700">
                        Total Amount:
                      </td>
                      <td className="py-3 px-3 text-right text-slate-900 font-mono text-sm">
                        {displayedOrder.totalAmount}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {displayedOrder.notes && (
                <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Order / Print Specifications: </span>
                    {displayedOrder.notes}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Pickup & Help Card */}
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Collection Details
                </h4>

                <div className="text-xs space-y-2">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Location</span>
                    <span className="font-semibold text-slate-800">
                      Pen Pal Plus (Pvt) Ltd
                    </span>
                    <p className="text-[11px] text-slate-500">
                      12 Kurunegala-Puttalam Rd, Kurunegala 60000
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Pickup Counter</span>
                    <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block mt-0.5">
                      {displayedOrder.pickupLocation}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Payment Status</span>
                    <span className="font-semibold text-emerald-700">
                      {displayedOrder.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Need assistance box */}
              <div className="border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-2 bg-white">
                <span className="font-bold text-slate-900 block">Need Help with this Order?</span>
                <p className="text-[11px] text-slate-500">
                  Call the counter staff for instant adjustments or priority pickup inquiries.
                </p>
                <div className="flex items-center gap-2 pt-1 font-semibold text-slate-800">
                  <Phone className="w-3.5 h-3.5 text-[#dfa84a]" />
                  <span>037 222 1190 / 077 233 1190</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <p className="text-sm font-semibold">No orders found for this customer.</p>
          <p className="text-xs text-slate-400 mt-1">
            Try switching customer profiles at the top right or use the search box above.
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerLiveTracker;
