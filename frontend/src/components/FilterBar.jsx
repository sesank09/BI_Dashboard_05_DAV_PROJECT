import React, { useContext } from 'react';
import { FilterContext } from '../context/FilterContext';
import { Filter, RotateCcw, Calendar, MapPin, Building2, Tag, Users } from 'lucide-react';

export const FilterBar = () => {
  const { filters, updateFilter, resetFilters } = useContext(FilterContext);

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
        <Filter size={16} className="text-[#123A6D]" />
        <span>Global Filters:</span>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs">
        {/* Date Range */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md px-2 py-1">
          <Calendar size={14} className="text-slate-400" />
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => updateFilter('startDate', e.target.value)}
            className="bg-transparent text-slate-700 text-xs focus:outline-none"
          />
          <span className="text-slate-400">to</span>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => updateFilter('endDate', e.target.value)}
            className="bg-transparent text-slate-700 text-xs focus:outline-none"
          />
        </div>

        {/* Region */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md px-2 py-1">
          <MapPin size={14} className="text-slate-400" />
          <select
            value={filters.region}
            onChange={(e) => updateFilter('region', e.target.value)}
            className="bg-transparent text-slate-700 text-xs focus:outline-none cursor-pointer"
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
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md px-2 py-1">
          <Building2 size={14} className="text-slate-400" />
          <select
            value={filters.department}
            onChange={(e) => updateFilter('department', e.target.value)}
            className="bg-transparent text-slate-700 text-xs focus:outline-none cursor-pointer"
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
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md px-2 py-1">
          <Tag size={14} className="text-slate-400" />
          <select
            value={filters.productCategory}
            onChange={(e) => updateFilter('productCategory', e.target.value)}
            className="bg-transparent text-slate-700 text-xs focus:outline-none cursor-pointer"
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
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md px-2 py-1">
          <Users size={14} className="text-slate-400" />
          <select
            value={filters.customerSegment}
            onChange={(e) => updateFilter('customerSegment', e.target.value)}
            className="bg-transparent text-slate-700 text-xs focus:outline-none cursor-pointer"
          >
            <option value="All">All Customer Segments</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Mid-Market">Mid-Market</option>
            <option value="SMB">SMB</option>
            <option value="Government">Government</option>
            <option value="Startup">Startup</option>
          </select>
        </div>

        {/* Reset Filters Button */}
        <button
          onClick={resetFilters}
          className="flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md font-medium transition-colors"
          title="Reset Filters"
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
