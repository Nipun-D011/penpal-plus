import React from 'react';

export const InventoryTable = ({ items, onEdit }) => {
  const getStatusBadge = (status, variant) => {
    switch (variant) {
      case 'in-stock':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            {status}
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/70">
            {status}
          </span>
        );
      case 'out-of-stock':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/60">
            {status}
          </span>
        );
      case 'low':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/60">
            {status}
          </span>
        );
    }
  };

  const getStockColor = (variant) => {
    switch (variant) {
      case 'in-stock':
        return 'text-slate-900';
      case 'warning':
        return 'text-[#b87d2b]';
      case 'out-of-stock':
      case 'low':
      default:
        return 'text-[#b83226]';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
            <th className="py-3 px-4 font-semibold">ITEM</th>
            <th className="py-3 px-4 font-semibold">CATEGORY</th>
            <th className="py-3 px-4 font-semibold text-center">STOCK</th>
            <th className="py-3 px-4 font-semibold text-center">REORDER LEVEL</th>
            <th className="py-3 px-4 font-semibold text-right">UNIT PRICE</th>
            <th className="py-3 px-4 font-semibold text-center">STATUS</th>
            <th className="py-3 px-4 font-semibold text-right"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs md:text-sm">
          {items.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-8 text-center text-slate-400">
                No inventory items match your filter criteria.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/70 transition-colors group"
              >
                {/* Item Avatar + Title & SKU/ISBN */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#131d33] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
                      {item.initial}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-slate-900 leading-snug">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-slate-400 mt-0.5">
                        {item.code}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="py-3.5 px-4 text-slate-600 font-normal">
                  {item.category}
                </td>

                {/* Stock Count */}
                <td className={`py-3.5 px-4 text-center font-bold ${getStockColor(item.statusVariant)}`}>
                  {item.stock}
                </td>

                {/* Reorder Level */}
                <td className="py-3.5 px-4 text-center text-slate-500 font-medium">
                  {item.reorderLevel}
                </td>

                {/* Unit Price */}
                <td className="py-3.5 px-4 text-right font-medium text-slate-800">
                  {item.unitPrice}
                </td>

                {/* Status Pill */}
                <td className="py-3.5 px-4 text-center">
                  {getStatusBadge(item.status, item.statusVariant)}
                </td>

                {/* Edit Action */}
                <td className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => onEdit && onEdit(item)}
                    className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors focus:outline-none"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
