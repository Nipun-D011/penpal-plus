import React from 'react';
import { ChevronDown, Search } from 'lucide-react';

export const PrintJobFilters = ({
  selectedStaff,
  onStaffChange,
  staffOptions,
  selectedType,
  onTypeChange,
  typeOptions,
  selectedDue,
  onDueChange,
  dueOptions,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-6">
      {/* Staff Selector */}
      <div className="relative min-w-[140px]">
        <select
          value={selectedStaff}
          onChange={(e) => onStaffChange(e.target.value)}
          aria-label="Filter by staff member"
          className="w-full appearance-none pl-3.5 pr-8 py-2 bg-white border border-slate-200/90 rounded-lg text-xs md:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#131d33]/15 focus:border-[#131d33] cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        >
          {staffOptions.map((staff) => (
            <option key={staff} value={staff}>
              {staff}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Job Type Selector */}
      <div className="relative min-w-[140px]">
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          aria-label="Filter by job type"
          className="w-full appearance-none pl-3.5 pr-8 py-2 bg-white border border-slate-200/90 rounded-lg text-xs md:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#131d33]/15 focus:border-[#131d33] cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        >
          {typeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Due Time Selector */}
      <div className="relative min-w-[150px]">
        <select
          value={selectedDue}
          onChange={(e) => onDueChange(e.target.value)}
          aria-label="Filter by due time"
          className="w-full appearance-none pl-3.5 pr-8 py-2 bg-white border border-slate-200/90 rounded-lg text-xs md:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#131d33]/15 focus:border-[#131d33] cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        >
          {dueOptions.map((due) => (
            <option key={due} value={due}>
              {due}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Search Input */}
      <div className="relative flex-1 min-w-[220px]">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search job ID or customer name"
          className="w-full pl-3.5 pr-4 py-2 bg-white border border-slate-200/90 rounded-lg text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#131d33]/15 focus:border-[#131d33] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        />
      </div>
    </div>
  );
};

export default PrintJobFilters;
