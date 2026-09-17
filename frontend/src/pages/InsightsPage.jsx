import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Lightbulb, HelpCircle, RefreshCw, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { TraceableInsightDrawer } from '../components/TraceableInsightDrawer';

export const InsightsPage = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInsight, setSelectedInsight] = useState(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/insights');
      setInsights(res.data);
    } catch (err) {
      console.error('Failed to load insights', err);
      setError(err.message || 'Failed to load business insights.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 gap-2">
        <RefreshCw size={20} className="animate-spin text-blue-600" />
        <span>Synthesizing evidence-based organizational business insights...</span>
      </div>
    );
  }

  if (error || !insights) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-600 gap-3 bg-white rounded-xl border border-slate-200 p-6">
        <p className="text-sm font-medium text-red-600">{error || 'No insights available.'}</p>
        <button
          onClick={fetchInsights}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
        >
          <RefreshCw size={14} /> Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Evidence-Based Business Insights & Auditable Actions</h1>
          <p className="text-xs text-slate-500">Automated algorithmic pattern recognition engine with full mathematical auditability</p>
        </div>
        <button
          onClick={fetchInsights}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 shadow-sm"
        >
          <RefreshCw size={13} /> Re-scan Insights
        </button>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => {
          const severityColors = {
            CRITICAL: "bg-rose-50 text-rose-700 border-rose-200",
            HIGH: "bg-amber-50 text-amber-700 border-amber-200",
            MEDIUM: "bg-blue-50 text-blue-700 border-blue-200"
          };
          const badgeClass = severityColors[insight.severity] || "bg-slate-100 text-slate-700 border-slate-200";

          return (
            <div key={insight.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm card-hover space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Lightbulb size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{insight.title}</h3>
                    <span className="text-[11px] text-slate-400 font-mono">{insight.id}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`border text-xs font-bold px-2.5 py-0.5 rounded-full ${badgeClass}`}>
                    {insight.severity || "INFO"}
                  </span>
                  <span className="bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {insight.category}
                  </span>
                  <button
                    onClick={() => setSelectedInsight(insight)}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition"
                  >
                    <HelpCircle size={14} /> Why am I seeing this?
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-800 uppercase block mb-1 text-[11px] text-blue-800">1. Key Finding & Context</span>
                  <p className="text-slate-700 leading-relaxed">{insight.finding}</p>
                </div>

                <div className="p-3.5 bg-blue-50/50 rounded-lg border border-blue-100">
                  <span className="font-bold text-slate-800 uppercase block mb-1 text-[11px] text-blue-800">2. Empirical Data Evidence</span>
                  <p className="text-slate-700 leading-relaxed">{insight.evidence}</p>
                </div>

                <div className="p-3.5 bg-amber-50/50 rounded-lg border border-amber-100">
                  <span className="font-bold text-slate-800 uppercase block mb-1 text-[11px] text-amber-800">3. Estimated Business Impact</span>
                  <p className="text-slate-700 leading-relaxed">{insight.business_impact}</p>
                </div>

                <div className="p-3.5 bg-emerald-50/50 rounded-lg border border-emerald-100">
                  <span className="font-bold text-slate-800 uppercase block mb-1 text-[11px] text-emerald-800">4. Strategic Recommended Action</span>
                  <p className="text-slate-700 leading-relaxed">{insight.recommended_action}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Traceability Audit Drawer */}
      <TraceableInsightDrawer
        insight={selectedInsight}
        onClose={() => setSelectedInsight(null)}
      />
    </div>
  );
};
