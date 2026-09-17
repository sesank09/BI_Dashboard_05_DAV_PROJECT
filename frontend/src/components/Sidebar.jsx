import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingBag, DollarSign, Users, Megaphone, Activity,
  LineChart, UserCheck, Database, RefreshCw, ShieldCheck, Lightbulb,
  FileSpreadsheet, Settings, ChevronLeft, ChevronRight, Cpu, Sparkles,
  GitFork, Layers, BookOpen
} from 'lucide-react';

const navSections = [
  {
    title: 'Core & Executive',
    items: [
      { path: '/', label: 'Executive BI', icon: LayoutDashboard },
    ]
  },
  {
    title: 'ACDIE Intelligence Suite',
    items: [
      { path: '/data-intelligence', label: 'Data Intelligence', icon: ShieldCheck, badge: 'PROFILER' },
      { path: '/cross-functional', label: 'Cross-Functional', icon: GitFork, badge: 'FUSION' },
      { path: '/ml-intelligence', label: 'ML & Model Registry', icon: Cpu, badge: 'MODELS' },
      { path: '/simulation', label: 'Decision Simulator', icon: Sparkles, badge: 'WHAT-IF' },
      { path: '/research', label: 'Research & Benchmark', icon: BookOpen, badge: 'NOVELTY' },
    ]
  },
  {
    title: 'Departments',
    items: [
      { path: '/sales', label: 'Sales Intelligence', icon: ShoppingBag },
      { path: '/finance', label: 'Finance & P&L', icon: DollarSign },
      { path: '/marketing', label: 'Marketing ROI', icon: Megaphone },
      { path: '/hr', label: 'Workforce & HR', icon: Users },
      { path: '/operations', label: 'Operations & SLA', icon: Activity },
    ]
  },
  {
    title: 'Analytics & Tools',
    items: [
      { path: '/analytics', label: 'Exploratory EDA', icon: LineChart },
      { path: '/customers', label: 'RFM Segmentation', icon: UserCheck },
      { path: '/insights', label: 'Traceable Insights', icon: Lightbulb },
      { path: '/data-management', label: 'Data Pipeline', icon: Database },
      { path: '/etl-monitor', label: 'ETL Warehouse', icon: RefreshCw },
      { path: '/reports', label: 'Reports Export', icon: FileSpreadsheet },
      { path: '/settings', label: 'Settings', icon: Settings },
    ]
  }
];

export const Sidebar = ({ collapsed, setCollapsed }) => {
  return (
    <aside className={`bg-[#0f172a] text-white transition-all duration-300 flex flex-col z-20 shadow-xl border-r border-slate-800 ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white shadow-md shadow-blue-500/20 text-xs">
              AC
            </div>
            <div>
              <h1 className="font-bold tracking-tight text-sm text-white">ACDIE ENGINE</h1>
              <p className="text-[10px] text-blue-400 uppercase tracking-wider font-semibold">Decision Intelligence</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white mx-auto text-xs">
            AC
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 py-3 px-3 space-y-4 overflow-y-auto custom-scrollbar">
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {!collapsed && (
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400/80 mb-1">
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
                    `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className="shrink-0 opacity-90" />
                    {!collapsed && <span>{item.label}</span>}
                  </div>
                  {!collapsed && item.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/60 font-semibold">
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
        <div className="p-3.5 border-t border-slate-800 bg-slate-900/60 text-xs text-slate-400 text-center">
          <p className="font-semibold text-white text-[11px]">ACDIE v2.4 Research Edition</p>
          <p className="text-[10px] text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            Warehouse Active (₹ INR)
          </p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
