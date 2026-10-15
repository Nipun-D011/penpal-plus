import React from 'react';
import { Search } from 'lucide-react';

export const OrderFilters = ({
  statusTabs,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-5">
      {/* Segmented Status Tabs */}
      <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/60 overflow-x-auto self-start sm:self-auto">
        {statusTabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all select-none whitespace-nowrap ${
                isActive
                  ? 'bg-white text-slate-900 font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative w-full sm:w-72 lg:w-80">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search order ID or customer"
          className="w-full pl-3.5 pr-4 py-2 bg-white border border-slate-200/90 rounded-lg text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#131d33]/15 focus:border-[#131d33] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        />
      </div>
    </div>
  );
};

export default OrderFilters;
