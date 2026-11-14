import { useState, useMemo } from 'react';
import {
  Search,
  Package,
  Printer,
  Receipt,
  Eye,
} from 'lucide-react';

export const CustomerOrdersList = ({
  orders = [],
  onSelectOrder,
  onOpenReceipt,
}) => {
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Type / Status filter
      let matchesFilter = true;
      if (filterType === 'Active') {
        matchesFilter = order.status !== 'Delivered' && order.status !== 'Completed';
      } else if (filterType === 'Print Jobs') {
        matchesFilter = order.type.toLowerCase().includes('print');
      } else if (filterType === 'Books') {
        matchesFilter = order.type.toLowerCase().includes('book') || order.type.toLowerCase().includes('school');
      } else if (filterType === 'Completed') {
        matchesFilter = order.status === 'Delivered' || order.status === 'Completed';
      }

      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        order.id.toLowerCase().includes(q) ||
        order.items?.some((it) => it.name.toLowerCase().includes(q)) ||
        order.type.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [orders, filterType, searchQuery]);

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'ready':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'processing':
      case 'in progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'new':
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm">
      {/* Table Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            All Orders & Print Requests
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing {filteredOrders.length} records for this customer account
          </p>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Pills */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs">
            {['All', 'Active', 'Print Jobs', 'Books', 'Completed'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterType(tab)}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  filterType === tab
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID or item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 w-44"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Date Placed</th>
              <th className="py-3 px-4">Items Summary</th>
              <th className="py-3 px-4 text-right">Total</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const isPrint = order.type.toLowerCase().includes('print');
                const itemsStr =
                  order.items?.map((it) => `${it.name} (${it.qty})`).join(', ') ||
                  'No items listed';

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {order.id}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                        {isPrint ? (
                          <Printer className="w-3.5 h-3.5 text-blue-600" />
                        ) : (
                          <Package className="w-3.5 h-3.5 text-amber-600" />
                        )}
                        {order.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                      {order.orderDate}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-600" title={itemsStr}>
                      {itemsStr}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                      {order.totalAmount}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadgeClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectOrder(order)}
                          className="px-2.5 py-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md font-medium text-xs flex items-center gap-1 transition-colors border border-slate-200"
                          title="Track this order"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Track</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenReceipt(order)}
                          className="px-2.5 py-1 text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-md font-medium text-xs flex items-center gap-1 transition-colors border border-amber-200"
                          title="View Receipt"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400">
                  No orders match your filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerOrdersList;
