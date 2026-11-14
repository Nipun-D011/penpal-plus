import { useState, useMemo } from 'react';
import { Search, Eye } from 'lucide-react';

export const SupplierPOTable = ({
  purchaseOrders = [],
  onSelectPO,
}) => {
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPOs = useMemo(() => {
    return purchaseOrders.filter((po) => {
      let matchesFilter = true;
      if (filterStatus === 'Active') {
        matchesFilter = po.status !== 'Fulfilled';
      } else if (filterStatus === 'Partially Received') {
        matchesFilter = po.status === 'Partially Received';
      } else if (filterStatus === 'Fulfilled') {
        matchesFilter = po.status === 'Fulfilled';
      }

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        po.id.toLowerCase().includes(q) ||
        po.notes?.toLowerCase().includes(q) ||
        po.items?.some((it) => it.name.toLowerCase().includes(q));

      return matchesFilter && matchesSearch;
    });
  }, [purchaseOrders, filterStatus, searchQuery]);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'fulfilled':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'partially received':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'in transit':
      case 'confirmed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ordered':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            Purchase Orders Feed
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Orders issued by Pen Pal Plus procurement department
          </p>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs">
            {['All', 'Active', 'Partially Received', 'Fulfilled'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterStatus(tab)}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  filterStatus === tab
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search PO or item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 w-44"
            />
          </div>
        </div>
      </div>

      {/* PO Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
            <tr>
              <th className="py-3 px-4">PO Number</th>
              <th className="py-3 px-4">Date Issued</th>
              <th className="py-3 px-4">Delivery Due</th>
              <th className="py-3 px-4">Items Summary</th>
              <th className="py-3 px-4 text-right">PO Total</th>
              <th className="py-3 px-4 text-center">Fulfillment Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredPOs.length > 0 ? (
              filteredPOs.map((po) => {
                const itemsSummary =
                  po.items?.map((it) => `${it.name} (×${it.orderedQty})`).join(', ') ||
                  'Stock items';

                return (
                  <tr
                    key={po.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {po.id}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {po.issueDate}
                    </td>
                    <td className="py-3.5 px-4 text-amber-700 font-medium whitespace-nowrap">
                      {po.expectedDelivery}
                    </td>
                    <td
                      className="py-3.5 px-4 max-w-xs truncate text-slate-600"
                      title={itemsSummary}
                    >
                      {itemsSummary}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                      {po.totalAmount}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                          po.status
                        )}`}
                      >
                        {po.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onSelectPO(po)}
                        className="px-3 py-1 bg-[#131d33] hover:bg-[#1e2d4d] text-white rounded-md font-medium text-xs flex items-center gap-1 mx-auto transition-colors shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View / Dispatch</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400">
                  No Purchase Orders match the selected criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierPOTable;
