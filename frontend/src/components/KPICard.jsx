import React from 'react';
import { TrendingUp, TrendingDown, Info, Database } from 'lucide-react';

export const KPICard = ({ title, value, unit = '', changePct, trend = 'up', description, source, icon: Icon }) => {
  const isPositive = changePct >= 0;

  const formatValue = (val) => {
    if (val === undefined || val === null) return 'N/A';
    if (unit === '$') {
      return `$${Number(val).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
    }
    if (unit === '%') {
      return `${val}%`;
    }
    return `${Number(val).toLocaleString('en-US')} ${unit}`.trim();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm card-hover flex flex-col justify-between relative overflow-hidden">
      {/* Decorative top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600"></div>

      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
          <div className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
            {formatValue(value)}
          </div>
        </div>

        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-[#123A6D]">
            <Icon size={20} />
          </div>
        )}
      </div>

      {/* Footer Trend & Source */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className={`flex items-center gap-1 font-semibold ${isPositive ? 'text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full' : 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full'}`}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{changePct > 0 ? `+${changePct}` : changePct}%</span>
          <span className="font-normal text-[10px] text-slate-500">vs prev period</span>
        </div>

        {source && (
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium" title={description}>
            <Database size={11} />
            <span>{source}</span>
          </div>
        )}
      </div>
    </div>
  );
};
