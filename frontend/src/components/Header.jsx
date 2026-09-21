import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, LogOut, Bell, Search, Menu, X, ShieldCheck } from 'lucide-react';

export const Header = ({ onToggleMobileMenu }) => {
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
    <header className="h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      {/* Mobile Hamburger & Search Input */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 sm:flex-initial">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="relative w-full sm:w-64 md:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search metrics, reports..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-2 sm:gap-4 ml-2">
        {/* System Health Badge */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-[11px]">ETL Pipeline Online</span>
        </div>

        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors relative">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></span>
        </button>

        <div className="h-5 w-[1px] bg-slate-200"></div>

        {/* User Account */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{user?.full_name || 'Executive User'}</div>
            <span className={`inline-block text-[9px] px-1.5 py-0.2 rounded border font-semibold ${getRoleBadgeColor(user?.role)}`}>
              {user?.role || 'Executive'}
            </span>
          </div>

          <button
            onClick={logout}
            title="Log Out"
            className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
