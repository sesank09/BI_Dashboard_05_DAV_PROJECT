import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, LogOut, Bell, Search, ShieldAlert } from 'lucide-react';

export const Header = () => {
  const { user, logout } = useContext(AuthContext);

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Executive': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Sales Manager': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Finance Manager': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'HR Manager': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Marketing Manager': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Operations Manager': return 'bg-teal-100 text-teal-800 border-teal-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      {/* Search Input */}
      <div className="flex items-center gap-3 w-72">
        <div className="relative w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search metrics, reports, KPIs..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        {/* System Health */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-medium">ETL Pipeline Online</span>
        </div>

        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></span>
        </button>

        <div className="h-6 w-[1px] bg-slate-200"></div>

        {/* User Account */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-800">{user?.full_name || 'Executive User'}</div>
            <span className={`inline-block text-[10px] px-2 py-0.5 rounded border font-medium ${getRoleBadgeColor(user?.role)}`}>
              {user?.role || 'Executive'}
            </span>
          </div>

          <button
            onClick={logout}
            title="Log Out"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
