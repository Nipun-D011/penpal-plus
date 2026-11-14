import { AlertTriangle } from 'lucide-react';

export const SupplierReorderAlerts = ({
  alerts = [],
  supplier,
}) => {
  return (
    <div className="space-y-6">
      {/* Alert Header Banner */}
      <div className="bg-amber-500/10 border border-amber-300 rounded-2xl p-5 flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold shadow-xs">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-amber-950 text-sm sm:text-base">
            Automated Low-Stock Reorder Signals
          </h3>
          <p className="text-xs text-amber-800 mt-1 max-w-2xl leading-relaxed">
            The items below are currently below minimum safety stock levels in Pen Pal Plus's warehouse. As their designated supplier for <strong>{supplier?.category}</strong>, you can review inventory demand and prepare upcoming restock shipments.
          </p>
        </div>
      </div>

      {/* Low-stock Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            Low-Stock Inventory Items ({supplier?.category})
          </h3>
          <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            {alerts.length} Items Require Restock
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
              <tr>
                <th className="py-3 px-4">Item & SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Current Stock</th>
                <th className="py-3 px-4 text-center">Safety Threshold</th>
                <th className="py-3 px-4 text-center">Suggested Batch</th>
                <th className="py-3 px-4 text-center">Stock Urgency</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {alerts.length > 0 ? (
                alerts.map((al) => (
                  <tr key={al.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      {al.item}
                      <span className="block text-[10px] font-mono text-slate-400">
                        {al.sku}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{al.category}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-red-600 text-sm">
                      {al.currentStock}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-600">
                      {al.reorderLevel}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-800">
                      +{al.suggestedQty} units
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                        {al.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          alert(
                            `Restock quotation initiated for ${al.item} (+${al.suggestedQty} units). Pen Pal Plus purchasing notified!`
                          )
                        }
                        className="px-3 py-1 bg-[#131d33] hover:bg-[#1e2d4d] text-white rounded-md font-semibold text-xs transition-colors shadow-xs"
                      >
                        Prepare Stock
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-slate-400">
                    No low-stock items for this supplier category at present. All stocks optimal!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SupplierReorderAlerts;
