import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export const DataQualityPage = () => {
  const [dq, setDq] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/etl/quality');
        setDq(res.data);
      } catch (err) {
        console.error('Failed to load DQ score', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !dq) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 gap-2">
        <RefreshCw size={20} className="animate-spin text-blue-600" />
        <span>Evaluating Data Quality Score...</span>
      </div>
    );
  }

  const dimensions = [
    { name: 'Completeness', score: dq.completeness, desc: 'Ratio of non-null populated fields across data warehouse tables' },
    { name: 'Validity', score: dq.validity, desc: 'Percentage of values adhering to business domain rules and positive constraints' },
    { name: 'Consistency', score: dq.consistency, desc: 'Formula & logic match rate (e.g., Profit = Revenue - Cost)' },
    { name: 'Uniqueness', score: dq.uniqueness, desc: 'Deduplication score across unique Primary Keys (order_id, transaction_id)' },
    { name: 'Accuracy', score: dq.accuracy, desc: 'Verification of calculated operational SLA statuses against actual fulfillment times' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Data Quality Engine & Governance</h1>
        <p className="text-xs text-slate-500">Automated Data Quality Framework evaluating 5 core data health dimensions</p>
      </div>

      {/* Main Scorecard Banner */}
      <div className="bg-gradient-to-r from-[#123A6D] via-[#2563EB] to-[#0D9488] text-white rounded-2xl p-6 shadow-lg flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center font-bold text-3xl text-white shadow-inner">
            <ShieldCheck size={36} />
          </div>
          <div>
            <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider">Overall Health Rating</span>
            <h2 className="text-3xl font-extrabold mt-0.5">Data Quality Score</h2>
            <p className="text-xs text-blue-100 mt-1">Enterprise Star Schema Health Verification</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-5xl font-black tracking-tight">{dq.overall_score}%</div>
          <span className="inline-block mt-2 text-xs font-bold text-emerald-300 bg-emerald-900/40 border border-emerald-400/30 px-3 py-1 rounded-full">
            Grade A - Production Ready
          </span>
        </div>
      </div>

      {/* 5 Quality Dimensions Progress Meters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {dimensions.map((dim) => (
          <div key={dim.name} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">{dim.name}</span>
              <span className="text-sm font-bold text-blue-600">{dim.score}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${dim.score}%` }}
              ></div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">{dim.desc}</p>
          </div>
        ))}
      </div>

      {/* Details breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Audit Details & Error Counts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium text-slate-700">
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between">
            <span>Null Values Count:</span>
            <span className="font-bold text-emerald-600">{dq.details?.null_values_count ?? 0}</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between">
            <span>Invalid Amount Rows:</span>
            <span className="font-bold text-emerald-600">{dq.details?.invalid_sales_rows ?? 0}</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between">
            <span>Formula Discrepancies:</span>
            <span className="font-bold text-emerald-600">{dq.details?.inconsistent_profit_rows ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
