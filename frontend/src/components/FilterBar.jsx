import React, { useState, useContext } from 'react';
import { FilterContext } from '../context/FilterContext';
import { Filter, RotateCcw, Calendar, MapPin, Building2, Tag, Users, ChevronDown, ChevronUp } from 'lucide-react';

export const FilterBar = () => {
  const { filters, updateFilter, resetFilters } = useContext(FilterContext);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const activeCount = [
    filters.region !== 'All',
    filters.department !== 'All',
    filters.productCategory !== 'All',
    filters.customerSegment !== 'All',
    Boolean(filters.startDate || filters.endDate)
  ].filter(Boolean).length;

  return (
    <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2.5 shadow-sm">
      {/* Top Row / Mobile Toggle Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Filter size={15} className="text-[#123A6D]" />
          <span>Global Filters</span>
          {activeCount > 0 && (
            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {activeCount} Active
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Collapse/Expand Toggle */}
          <button
            onClick={() => setMobileExpanded(!mobileExpanded)}
            className="md:hidden flex items-center gap-1 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md font-medium transition"
          >
            <span>{mobileExpanded ? 'Hide' : 'Filters'}</span>
            {mobileExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {/* Reset Filters Button */}
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md text-xs font-medium transition-colors"
            title="Reset Filters"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Filter Selectors - Visible on desktop, collapsible on mobile */}
      <div className={`mt-2 md:mt-0 ${mobileExpanded ? 'block' : 'hidden md:flex'} flex-wrap items-center gap-2.5 text-xs pt-2 md:pt-0`}>
        {/* Date Range */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 w-full sm:w-auto">
          <Calendar size={13} className="text-slate-400 shrink-0" />
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => updateFilter('startDate', e.target.value)}
            className="bg-transparent text-slate-700 text-xs focus:outline-none w-full sm:w-auto"
          />
          <span className="text-slate-400 text-[10px]">to</span>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => updateFilter('endDate', e.target.value)}
            className="bg-transparent text-slate-700 text-xs focus:outline-none w-full sm:w-auto"
          />
        </div>

        {/* Region */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 flex-1 sm:flex-initial">
          <MapPin size={13} className="text-slate-400 shrink-0" />
          <select
            value={filters.region}
            onChange={(e) => updateFilter('region', e.target.value)}
            className="bg-transparent text-slate-700 text-xs focus:outline-none cursor-pointer w-full"
          >
            <option value="All">All Regions</option>
            <option value="REG-01">North America</option>
            <option value="REG-02">Europe</option>
            <option value="REG-03">Asia Pacific</option>
            <option value="REG-04">Latin America</option>
            <option value="REG-05">Middle East & Africa</option>
          </select>
        </div>

        {/* Department */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 flex-1 sm:flex-initial">
          <Building2 size={13} className="text-slate-400 shrink-0" />
          <select
            value={filters.department}
            onChange={(e) => updateFilter('department', e.target.value)}
            className="bg-transparent text-slate-700 text-xs focus:outline-none cursor-pointer w-full"
          >
            <option value="All">All Departments</option>
            <option value="Sales">Sales</option>
            <option value="Finance">Finance</option>
            <option value="HR">HR</option>
            <option value="Marketing">Marketing</option>
            <option value="Operations">Operations</option>
            <option value="Engineering">Engineering</option>
          </select>
        </div>

        {/* Product Category */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 flex-1 sm:flex-initial">
          <Tag size={13} className="text-slate-400 shrink-0" />
          <select
            value={filters.productCategory}
            onChange={(e) => updateFilter('productCategory', e.target.value)}
            className="bg-transparent text-slate-700 text-xs focus:outline-none cursor-pointer w-full"
          >
            <option value="All">All Categories</option>
            <option value="Cloud Infrastructure">Cloud Infrastructure</option>
            <option value="Enterprise Software">Enterprise Software</option>
            <option value="Hardware Workstations">Hardware Workstations</option>
            <option value="SaaS Subscriptions">SaaS Subscriptions</option>
            <option value="Consulting Services">Consulting Services</option>
          </select>
        </div>

        {/* Customer Segment */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 flex-1 sm:flex-initial">
          <Users size={13} className="text-slate-400 shrink-0" />
          <select
            value={filters.customerSegment}
            onChange={(e) => updateFilter('customerSegment', e.target.value)}
            className="bg-transparent text-slate-700 text-xs focus:outline-none cursor-pointer w-full"
          >
            <option value="All">All Customer Segments</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Mid-Market">Mid-Market</option>
            <option value="SMB">SMB</option>
            <option value="Government">Government</option>
            <option value="Startup">Startup</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
