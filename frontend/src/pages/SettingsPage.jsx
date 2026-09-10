import React from 'react';
import { Settings, Database, Server, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings & Architecture Status</h1>
        <p className="text-xs text-slate-500">Platform deployment status, database warehouse connections, and API configurations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Connection Status */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Server size={18} className="text-blue-600" />
            <span>FastAPI Server Status</span>
          </div>
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs font-semibold text-emerald-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>Backend API Server Online</span>
            </div>
            <span>http://localhost:8000</span>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Framework:</span> <span className="font-semibold text-slate-900">FastAPI 0.110.0 (Python 3.14)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Authentication:</span> <span className="font-semibold text-slate-900">JWT (HS256)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>CORS Policy:</span> <span className="font-semibold text-emerald-700">Enabled for React Frontend</span>
            </div>
          </div>
        </div>

        {/* Database Warehouse Status */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Database size={18} className="text-[#123A6D]" />
            <span>Star Schema Data Warehouse</span>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between text-xs font-semibold text-blue-900">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-blue-600" />
              <span>Database Connection Active</span>
            </div>
            <span>SQLite / PostgreSQL Compatible</span>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Total Fact Records:</span> <span className="font-bold text-blue-700">32,389 records</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Dimension Tables:</span> <span className="font-semibold text-slate-900">7 Dim Tables (Customer, Product, Region, HR...)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Data Quality Rating:</span> <span className="font-bold text-emerald-700">100.0% Grade A</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
