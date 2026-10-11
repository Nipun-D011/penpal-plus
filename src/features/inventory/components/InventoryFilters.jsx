import React from 'react';
import { Search, ChevronDown, Filter } from 'lucide-react';

export const InventoryFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  selectedStatus,
  onStatusChange,
  statuses,
  onResetFilters,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-6">
      {/* Search Input */}
      <div className="relative flex-1">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title, author or ISBN"
          className="w-full pl-4 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-lg text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#131d33]/15 focus:border-[#131d33] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        />
      </div>

      {/* Category Dropdown */}
      <div className="relative min-w-[150px]">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          aria-label="Filter by category"
          className="w-full appearance-none pl-3.5 pr-8 py-2.5 bg-white border border-slate-200/90 rounded-lg text-xs md:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#131d33]/15 focus:border-[#131d33] cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Stock Status Dropdown */}
      <div className="relative min-w-[150px]">
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Filter by stock status"
          className="w-full appearance-none pl-3.5 pr-8 py-2.5 bg-white border border-slate-200/90 rounded-lg text-xs md:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#131d33]/15 focus:border-[#131d33] cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Filter Button */}
      <button
        type="button"
        onClick={onResetFilters}
        title="Reset/Toggle Filters"
        className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-lg text-xs md:text-sm font-medium text-slate-700 flex items-center justify-center gap-2 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
      >
        <Filter className="w-3.5 h-3.5 text-slate-500" />
        <span>Filter</span>
      </button>
    </div>
  );
};

export default InventoryFilters;
