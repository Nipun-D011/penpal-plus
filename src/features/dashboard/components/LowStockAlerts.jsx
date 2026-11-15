import React from 'react';
import Card from '../../../components/common/Card';
import { Link } from 'react-router-dom';

export const LowStockAlerts = ({ items }) => {
  return (
    <Card className="h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900">
          Low stock alerts
        </h3>
        <Link
          to="/inventory"
          className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          Go to inventory
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-semibold tracking-wider">
              <th className="pb-3 font-semibold uppercase">ITEM</th>
              <th className="pb-3 font-semibold uppercase text-right pr-6">
                IN STOCK
              </th>
              <th className="pb-3 font-semibold uppercase text-right">
                REORDER AT
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 font-medium text-slate-800">
                  {item.name}
                </td>
                <td className="py-3 text-right pr-6 font-bold text-[#b83226]">
                  {item.inStock}
                </td>
                <td className="py-3 text-right text-slate-500 font-medium">
                  {item.reorderAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default LowStockAlerts;
