import React from 'react';

export const CustomerListTable = ({
  customers,
  selectedCustomerId,
  onSelectCustomer,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm flex flex-col h-full">
      {/* Search Input */}
      <div className="mb-5">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search customers by name or phone"
          className="w-full px-4 py-2.5 bg-white border border-slate-200/90 rounded-lg text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#131d33]/15 focus:border-[#131d33] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        />
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
              <th className="py-3 px-4 font-semibold">CUSTOMER</th>
              <th className="py-3 px-4 font-semibold text-center">ORDERS</th>
              <th className="py-3 px-4 font-semibold text-right">TOTAL SPENT</th>
              <th className="py-3 px-4 font-semibold text-center">LAST VISIT</th>
              <th className="py-3 px-4 font-semibold text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs md:text-sm">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  No customers found matching &quot;{searchQuery}&quot;.
                </td>
              </tr>
            ) : (
              customers.map((cust) => {
                const isSelected = cust.id === selectedCustomerId;

                return (
                  <tr
                    key={cust.id}
                    onClick={() => onSelectCustomer(cust)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#fbf7ed] hover:bg-[#f8f3e5]'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Customer Avatar & Name / Phone */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm ${
                            cust.avatarBg || 'bg-[#131d33]'
                          }`}
                        >
                          {cust.initials}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-slate-900 leading-snug">
                            {cust.name}
                          </span>
                          <span className="text-[11px] text-slate-400 mt-0.5">
                            {cust.phone}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Orders count */}
                    <td className="py-3.5 px-4 text-center font-medium text-slate-700">
                      {cust.ordersCount}
                    </td>

                    {/* Total Spent */}
                    <td className="py-3.5 px-4 text-right font-medium text-slate-900">
                      {cust.totalSpent}
                    </td>

                    {/* Last Visit */}
                    <td className="py-3.5 px-4 text-center text-slate-600 font-normal">
                      {cust.lastVisit}
                    </td>

                    {/* Profile Action Link */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCustomer(cust);
                        }}
                        className={`text-xs font-medium transition-colors focus:outline-none ${
                          isSelected
                            ? 'text-slate-900 font-semibold'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        Profile
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

export default CustomerListTable;
