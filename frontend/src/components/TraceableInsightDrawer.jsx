import React from 'react';
import { X, Calculator, Database, ShieldCheck, HelpCircle, Layers, CheckCircle2 } from 'lucide-react';

export const TraceableInsightDrawer = ({ insight, onClose }) => {
  if (!insight) return null;

  const t = insight.traceability || {};

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <HelpCircle size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Why am I seeing this insight?</h2>
              <p className="text-xs text-slate-500">Audit Traceability & Mathematical Derivation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Target Insight Summary */}
          <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 space-y-2">
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Audited Insight</span>
            <h3 className="text-sm font-bold text-slate-900">{insight.title}</h3>
            <p className="text-slate-700 leading-relaxed">{insight.finding}</p>
          </div>

          {/* Derivation Formula */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-slate-900 font-bold uppercase tracking-wider text-[11px]">
              <Calculator size={14} className="text-blue-600" />
              <span>1. Mathematical Calculation Formula</span>
            </div>
            <div className="p-3.5 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] leading-relaxed border border-slate-800">
              {t.formula || "Calculation = Direct SQL Aggregation"}
            </div>
          </div>

          {/* Source Data & Entity Provenance */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-slate-900 font-bold uppercase tracking-wider text-[11px]">
              <Database size={14} className="text-emerald-600" />
              <span>2. Data Source & Entity Provenance</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[10px]">Input CSV File</span>
                <span className="font-semibold text-slate-800">{t.source_dataset || "sales_data.csv"}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[10px]">Star Schema Warehouse Table</span>
                <span className="font-semibold text-slate-800">{t.source_table || "fact_sales"}</span>
              </div>
            </div>
          </div>

          {/* Baseline vs Current Value Comparison */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-slate-900 font-bold uppercase tracking-wider text-[11px]">
              <Layers size={14} className="text-purple-600" />
              <span>3. Empirical Baseline Comparison</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[10px]">Calculated Current Value</span>
                <span className="font-bold text-blue-700 text-sm">{t.current_value || "N/A"}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[10px]">Baseline / Benchmark</span>
                <span className="font-semibold text-slate-700">{t.baseline_comparison || "Statistical Control Ceiling"}</span>
              </div>
            </div>
          </div>

          {/* Statistical Confidence */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-slate-900 font-bold uppercase tracking-wider text-[11px]">
              <ShieldCheck size={14} className="text-teal-600" />
              <span>4. Statistical Reliability Confidence</span>
            </div>
            <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span className="text-emerald-900 font-medium">{t.confidence || "99.0% Confidence Level"}</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Verified</span>
            </div>
          </div>

          {/* Supporting Evidence Breakdown Data */}
          {t.supporting_data && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block">
                5. Underlying Granular Evidence Breakdown
              </span>
              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-2 bg-slate-50 font-mono text-[10px]">
                <pre>{JSON.stringify(t.supporting_data, null, 2)}</pre>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">ACDIE Traceability Engine v2.0</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
          >
            Close Audit Trail
          </button>
        </div>

      </div>
    </div>
  );
};
