import React from 'react';

export const OrdersTable = ({ orders, selectedOrderId, onSelectOrder }) => {
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/70">
            Processing
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/70">
            Delivered
          </span>
        );
      case 'new':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/70">
            New
          </span>
        );
      case 'ready':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/70">
            Ready
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
              <th className="py-3.5 px-6 font-semibold">ORDER</th>
              <th className="py-3.5 px-6 font-semibold">CUSTOMER</th>
              <th className="py-3.5 px-6 font-semibold">ITEMS</th>
              <th className="py-3.5 px-6 font-semibold">ORDER DATE</th>
              <th className="py-3.5 px-6 font-semibold text-center">STATUS</th>
              <th className="py-3.5 px-6 font-semibold text-right">TOTAL</th>
              <th className="py-3.5 px-6 font-semibold text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs md:text-sm">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No orders match your filter criteria.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const isSelected = order.id === selectedOrderId;

                return (
                  <tr
                    key={order.id}
                    onClick={() => onSelectOrder(order)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-amber-50/40 hover:bg-amber-50/60'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Order ID */}
                    <td className="py-3.5 px-6 font-semibold text-slate-900 whitespace-nowrap">
                      {order.id}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-6 text-slate-800 font-medium whitespace-nowrap">
                      {order.customer}
                    </td>

                    {/* Items Count */}
                    <td className="py-3.5 px-6 text-slate-500 whitespace-nowrap">
                      {order.itemsCount}
                    </td>

                    {/* Order Date */}
                    <td className="py-3.5 px-6 text-slate-600 whitespace-nowrap">
                      {order.orderDate}
                    </td>

                    {/* Status Pill */}
                    <td className="py-3.5 px-6 text-center whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-6 text-right font-medium text-slate-900 whitespace-nowrap">
                      {order.amount}
                    </td>

                    {/* View Action */}
                    <td className="py-3.5 px-6 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectOrder(order);
                        }}
                        className={`text-xs font-medium transition-colors focus:outline-none ${
                          isSelected
                            ? 'text-slate-900 font-semibold'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
