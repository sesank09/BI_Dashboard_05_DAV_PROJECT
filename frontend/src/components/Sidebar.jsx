import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingBag, DollarSign, Users, Megaphone, Activity,
  LineChart, UserCheck, Database, RefreshCw, ShieldCheck, Lightbulb,
  FileSpreadsheet, Settings, ChevronLeft, ChevronRight, Cpu, Sparkles,
  GitFork, BookOpen
} from 'lucide-react';

const navSections = [
  {
    title: 'Core Executive',
    items: [
      { path: '/', label: 'Executive BI', icon: LayoutDashboard },
    ]
  },
  {
    title: 'ACDIE Intelligence',
    items: [
      { path: '/data-intelligence', label: 'Data Intelligence', icon: ShieldCheck, badge: 'PROFILER' },
      { path: '/cross-functional', label: 'Cross-Functional', icon: GitFork, badge: 'FUSION' },
      { path: '/ml-intelligence', label: 'ML & Models', icon: Cpu, badge: 'MODELS' },
      { path: '/simulation', label: 'Decision Simulator', icon: Sparkles, badge: 'WHAT-IF' },
      { path: '/research', label: 'Research & Novelty', icon: BookOpen, badge: 'BENCHMARK' },
    ]
  },
  {
    title: 'Departments',
    items: [
      { path: '/sales', label: 'Sales Dashboard', icon: ShoppingBag },
      { path: '/finance', label: 'Finance & P&L', icon: DollarSign },
      { path: '/marketing', label: 'Marketing ROI', icon: Megaphone },
      { path: '/hr', label: 'HR & Workforce', icon: Users },
      { path: '/operations', label: 'Operations & SLA', icon: Activity },
    ]
  },
  {
    title: 'Analytics & Pipeline',
    items: [
      { path: '/analytics', label: 'Analytics / EDA', icon: LineChart },
      { path: '/customers', label: 'RFM Customers', icon: UserCheck },
      { path: '/insights', label: 'Business Insights', icon: Lightbulb },
      { path: '/data-management', label: 'Data Pipeline', icon: Database },
      { path: '/etl-monitor', label: 'ETL Warehouse', icon: RefreshCw },
      { path: '/reports', label: 'Reports Export', icon: FileSpreadsheet },
      { path: '/settings', label: 'Settings', icon: Settings },
    ]
  }
];

export const Sidebar = ({ collapsed, setCollapsed }) => {
  return (
    <aside className={`bg-[#123A6D] text-white transition-all duration-300 flex flex-col z-20 shadow-xl ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
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
      <nav className="flex-1 py-3 px-3 space-y-3.5 overflow-y-auto custom-scrollbar">
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-0.5">
            {!collapsed && (
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-blue-200/60 mb-1">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#2563EB] text-white font-semibold shadow-md shadow-blue-900/30'
                        : 'text-slate-200 hover:bg-white/10 hover:text-white'
                    }`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className="shrink-0 opacity-90" />
                    {!collapsed && <span>{item.label}</span>}
                  </div>
                  {!collapsed && item.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-900/60 text-blue-200 border border-blue-400/30 font-semibold">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer Info */}
      {!collapsed && (
        <div className="p-3.5 border-t border-white/10 bg-slate-900/30 text-xs text-blue-200/70 text-center">
          <p className="font-semibold text-white text-[11px]">Enterprise BI & ACDIE v2.4</p>
          <p className="text-[10px] text-teal-300 flex items-center justify-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-300 inline-block animate-pulse"></span>
            Data Warehouse Active (₹ INR)
          </p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
