import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Building2, Sparkles, Database, Settings, 
  ChevronLeft, ChevronRight, ShoppingBag, DollarSign, Megaphone, 
  Users, Activity, Cpu, GitFork, ShieldCheck, FileSpreadsheet,
  LineChart, Sliders, RefreshCw, X
} from 'lucide-react';

const mainNavItems = [
  {
    path: '/',
    label: 'Executive BI',
    icon: LayoutDashboard,
    badge: 'CORE',
    matchPaths: ['/']
  },
  {
    path: '/departments',
    label: 'Department Analytics',
    icon: Building2,
    badge: '6 DEPTS',
    matchPaths: ['/departments', '/sales', '/finance', '/marketing', '/hr', '/operations', '/customers'],
    subItems: [
      { path: '/sales', label: 'Sales & Revenue', icon: ShoppingBag },
      { path: '/finance', label: 'Finance & P&L', icon: DollarSign },
      { path: '/marketing', label: 'Marketing ROI', icon: Megaphone },
      { path: '/hr', label: 'HR Workforce', icon: Users },
      { path: '/operations', label: 'Operations SLA', icon: Activity },
    ]
  },
  {
    path: '/intelligence',
    label: 'AI & Decision Suite',
    icon: Sparkles,
    badge: 'PREDICTIVE',
    matchPaths: ['/intelligence', '/ml-intelligence', '/simulation', '/cross-functional', '/insights', '/research'],
    subItems: [
      { path: '/ml-intelligence', label: 'ML Forecast', icon: Cpu },
      { path: '/simulation', label: 'What-If Simulator', icon: Sliders },
      { path: '/cross-functional', label: 'Fusion Matrix', icon: GitFork },
      { path: '/insights', label: 'Business Insights', icon: ShieldCheck },
    ]
  },
  {
    path: '/data',
    label: 'Data Studio & Pipeline',
    icon: Database,
    badge: 'PIPELINE',
    matchPaths: ['/data', '/data-management', '/data-intelligence', '/etl-monitor', '/data-quality', '/analytics', '/reports'],
    subItems: [
      { path: '/data-management', label: 'Upload & Test', icon: Database },
      { path: '/data-intelligence', label: 'Data Quality', icon: ShieldCheck },
      { path: '/etl-monitor', label: 'ETL Warehouse', icon: RefreshCw },
      { path: '/reports', label: 'Export Reports', icon: FileSpreadsheet },
    ]
  },
  {
    path: '/settings',
    label: 'System Settings',
    icon: Settings,
    matchPaths: ['/settings']
  }
];

export const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const location = useLocation();

  const isItemActive = (item) => {
    if (item.path === '/' && location.pathname === '/') return true;
    if (item.path !== '/' && item.matchPaths.some(p => location.pathname === p || location.pathname.startsWith(p + '/'))) return true;
    return false;
  };

  const handleNavClick = () => {
    if (mobileOpen && setMobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        bg-[#0F2744] text-white transition-all duration-300 flex flex-col z-50 shadow-2xl
        fixed md:relative inset-y-0 left-0
        ${mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
        ${collapsed ? 'md:w-20' : 'md:w-64'}
      `}>
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 bg-[#0B1E36]">
          {(!collapsed || mobileOpen) && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-teal-400 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/30">
                BI
              </div>
              <div>
                <h1 className="font-extrabold tracking-tight text-sm text-white">ORGANIZATIONAL</h1>
                <p className="text-[10px] text-blue-300 uppercase tracking-widest font-bold">Analytics Engine</p>
              </div>
            </div>
          )}
          {collapsed && !mobileOpen && (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-teal-400 flex items-center justify-center font-black text-white mx-auto shadow-md">
              BI
            </div>
          )}

          {/* Close button for Mobile / Collapse button for Desktop */}
          <div className="flex items-center">
            <button 
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1.5 rounded-lg hover:bg-white/10 text-blue-200 hover:text-white transition"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:block p-1.5 rounded-lg hover:bg-white/10 text-blue-200 hover:text-white transition-colors"
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
        </div>

        {/* Primary Navigation Links */}
        <nav className="flex-1 py-4 px-3 space-y-2 overflow-y-auto custom-scrollbar">
          {(!collapsed || mobileOpen) && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-blue-300/60 mb-2">
              Main Navigation
            </p>
          )}

          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item);

            return (
              <div key={item.path} className="space-y-1">
                <NavLink
                  to={item.path}
                  onClick={handleNavClick}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                  title={collapsed && !mobileOpen ? item.label : undefined}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon size={18} className={`shrink-0 ${active ? 'text-white' : 'text-blue-300 opacity-90'}`} />
                    {(!collapsed || mobileOpen) && <span className="truncate">{item.label}</span>}
                  </div>
                  {(!collapsed || mobileOpen) && item.badge && (
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      active 
                        ? 'bg-blue-700 text-white border border-blue-400/40' 
                        : 'bg-white/10 text-blue-200 border border-white/10'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>

                {/* Sub-item quick links when parent is active */}
                {(!collapsed || mobileOpen) && active && item.subItems && (
                  <div className="pl-6 pr-1 py-1 space-y-0.5 border-l-2 border-blue-500/40 ml-4 my-1">
                    {item.subItems.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = location.pathname === sub.path;
                      return (
                        <NavLink
                          key={sub.path}
                          to={sub.path}
                          onClick={handleNavClick}
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition ${
                            isSubActive
                              ? 'text-white font-bold bg-white/15'
                              : 'text-blue-200/70 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <SubIcon size={13} className="shrink-0 opacity-75" />
                          <span className="truncate">{sub.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer Info */}
        {(!collapsed || mobileOpen) ? (
          <div className="p-3.5 border-t border-white/10 bg-[#0B1E36] text-xs text-blue-200/70">
            <div className="flex items-center justify-between">
              <p className="font-bold text-white text-[11px]">ACDIE Engine v2.4</p>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                ONLINE
              </span>
            </div>
            <p className="text-[10px] text-teal-300 flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block animate-pulse"></span>
              Warehouse Active (₹ INR)
            </p>
          </div>
        ) : (
          <div className="p-3 border-t border-white/10 bg-[#0B1E36] flex justify-center" title="Warehouse Active (₹ INR)">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></span>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
