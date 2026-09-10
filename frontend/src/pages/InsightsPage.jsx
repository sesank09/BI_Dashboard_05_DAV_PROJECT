import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Lightbulb, ArrowUpRight, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';

export const InsightsPage = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const res = await api.get('/insights');
        setInsights(res.data);
      } catch (err) {
        console.error('Failed to load insights', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 gap-2">
        <RefreshCw size={20} className="animate-spin text-blue-600" />
        <span>Scanning Data Warehouse & generating automated business insights...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Automated Business Insights & Recommendations</h1>
        <p className="text-xs text-slate-500">Algorithmic pattern recognition engine synthesizing findings into strategic decision support</p>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => (
          <div key={insight.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm card-hover space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Lightbulb size={18} />
                </div>
                <h3 className="text-base font-bold text-slate-900">{insight.title}</h3>
              </div>

              <span className="bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                {insight.category}
              </span>
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
        ))}
      </div>
    </div>
  );
};
