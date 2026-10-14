import React from 'react';

export const SupplierListTable = ({
  suppliers,
  onViewSupplier,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
              <th className="py-4 px-6 font-semibold">SUPPLIER</th>
              <th className="py-4 px-6 font-semibold">CATEGORY</th>
              <th className="py-4 px-6 font-semibold">CONTACT</th>
              <th className="py-4 px-6 font-semibold">LAST PURCHASE</th>
              <th className="py-4 px-6 font-semibold text-right">TOTAL PURCHASES</th>
              <th className="py-4 px-6 font-semibold text-right">OUTSTANDING</th>
              <th className="py-4 px-6 font-semibold text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs md:text-sm">
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  No suppliers found.
                </td>
              </tr>
            ) : (
              suppliers.map((supplier) => {
                const isOutstanding = supplier.outstandingRaw > 0;

                return (
                  <tr
                    key={supplier.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Supplier Name */}
                    <td className="py-4 px-6 font-bold text-slate-900 tracking-tight">
                      {supplier.name}
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6 text-slate-600 font-normal">
                      {supplier.category}
                    </td>

                    {/* Contact Number */}
                    <td className="py-4 px-6 text-slate-600 font-normal tracking-wide">
                      {supplier.contact}
                    </td>

                    {/* Last Purchase Date */}
                    <td className="py-4 px-6 text-slate-700 font-normal">
                      {supplier.lastPurchase}
                    </td>

                    {/* Total Purchases */}
                    <td className="py-4 px-6 text-right font-medium text-slate-900">
                      {supplier.totalPurchases}
                    </td>

                    {/* Outstanding Amount */}
                    <td className="py-4 px-6 text-right font-bold">
                      {isOutstanding ? (
                        <span className="text-[#c2410c] sm:text-[#b91c1c]">
                          {supplier.outstanding}
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-bold">
                          {supplier.outstanding}
                        </span>
                      )}
                    </td>

                    {/* View Action Link */}
                    <td className="py-4 px-6 text-center">
                      <button
                        type="button"
                        onClick={() => onViewSupplier(supplier)}
                        className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors focus:outline-none hover:underline"
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

export default SupplierListTable;
