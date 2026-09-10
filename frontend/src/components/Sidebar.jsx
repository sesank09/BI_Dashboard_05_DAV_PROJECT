import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingBag, DollarSign, Users, Megaphone, Activity,
  LineChart, UserCheck, Database, RefreshCw, ShieldCheck, Lightbulb,
  FileSpreadsheet, Settings, ChevronLeft, ChevronRight
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Executive BI', icon: LayoutDashboard },
  { path: '/sales', label: 'Sales Dashboard', icon: ShoppingBag },
  { path: '/finance', label: 'Finance Dashboard', icon: DollarSign },
  { path: '/marketing', label: 'Marketing Dashboard', icon: Megaphone },
  { path: '/hr', label: 'HR & Workforce', icon: Users },
  { path: '/operations', label: 'Operations & SLA', icon: Activity },
  { path: '/analytics', label: 'Analytics / EDA', icon: LineChart },
  { path: '/customers', label: 'RFM Customers', icon: UserCheck },
  { path: '/data-management', label: 'Data Upload', icon: Database },
  { path: '/etl-monitor', label: 'ETL Pipeline', icon: RefreshCw },
  { path: '/data-quality', label: 'Data Quality', icon: ShieldCheck },
  { path: '/insights', label: 'Business Insights', icon: Lightbulb },
  { path: '/reports', label: 'Reports Export', icon: FileSpreadsheet },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar = ({ collapsed, setCollapsed }) => {
  return (
    <aside className={`bg-[#123A6D] text-white transition-all duration-300 flex flex-col z-20 shadow-xl ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-teal-400 flex items-center justify-center font-bold text-white shadow">
              BI
            </div>
            <div>
              <h1 className="font-bold tracking-tight text-sm text-white">ORGANIZATIONAL</h1>
              <p className="text-[10px] text-blue-200 uppercase tracking-wider font-semibold">Analytics Engine</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-teal-400 flex items-center justify-center font-bold text-white mx-auto">
            BI
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-white/10 text-blue-200 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-md shadow-blue-900/30'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      {!collapsed && (
        <div className="p-4 border-t border-white/10 bg-slate-900/30 text-xs text-blue-200/70 text-center">
          <p className="font-medium text-white">Enterprise BI v1.0</p>
          <p className="text-[10px]">Data Warehouse Active</p>
        </div>
      )}
    </aside>
  );
};
