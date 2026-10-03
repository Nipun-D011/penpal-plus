import React from 'react';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import { Link } from 'react-router-dom';

export const RecentOrdersTable = ({ orders }) => {
  return (
    <Card className="h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900">
          Recent orders
        </h3>
        <Link
          to="/orders"
          className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          View all
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-semibold tracking-wider">
              <th className="pb-3 font-semibold uppercase">ORDER</th>
              <th className="pb-3 font-semibold uppercase">CUSTOMER</th>
              <th className="pb-3 font-semibold uppercase">STATUS</th>
              <th className="pb-3 font-semibold uppercase text-right">AMOUNT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 font-medium text-slate-900">
                  {order.id}
                </td>
                <td className="py-3 text-slate-700">
                  {order.customer}
                </td>
                <td className="py-3">
                  <Badge variant={order.statusVariant}>
                    {order.status}
                  </Badge>
                </td>
                <td className="py-3 text-right font-medium text-slate-900">
                  {order.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RecentOrdersTable;
