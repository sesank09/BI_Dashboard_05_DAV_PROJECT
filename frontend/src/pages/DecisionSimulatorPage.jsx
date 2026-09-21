import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Sliders, Play, RotateCcw, TrendingUp, TrendingDown, DollarSign,
  Users, Percent, ShieldCheck, AlertCircle, Sparkles, CheckCircle2, ArrowRight
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export const DecisionSimulatorPage = () => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Slider states (delta percentages or absolute amounts)
  const [marketingDelta, setMarketingDelta] = useState(15); // +15%
  const [headcountDelta, setHeadcountDelta] = useState(5);  // +5 employees
  const [opexDelta, setOpexDelta] = useState(-5);          // -5%
  const [discountDelta, setDiscountDelta] = useState(0);    // 0% change

  const [simulationResult, setSimulationResult] = useState(null);

  const fetchSimulation = async (params = {}) => {
    setLoading(true);
    try {
      const payload = {
        marketing_spend_delta_pct: params.marketingDelta ?? marketingDelta,
        headcount_delta_pct: params.headcountDelta ?? headcountDelta,
        opex_reduction_pct: params.opexDelta ?? opexDelta,
        discount_delta_pct: params.discountDelta ?? discountDelta,
        marketing_spend_delta: params.marketingDelta ?? marketingDelta,
        headcount_delta: params.headcountDelta ?? headcountDelta,
        opex_delta: params.opexDelta ?? opexDelta,
        discount_delta: params.discountDelta ?? discountDelta,
      };

      const res = await api.post('/simulation', payload);
      if (res.data) {
        setSimulationResult(res.data);
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchSimulation();
  }, []);

  const handleReset = () => {
    setMarketingDelta(0);
    setHeadcountDelta(0);
    setOpexDelta(0);
    setDiscountDelta(0);
    fetchSimulation({ marketingDelta: 0, headcountDelta: 0, opexDelta: 0, discountDelta: 0 });
  };

  const applyPreset = (m, h, o, d) => {
    setMarketingDelta(m);
    setHeadcountDelta(h);
    setOpexDelta(o);
    setDiscountDelta(d);
    fetchSimulation({ marketingDelta: m, headcountDelta: h, opexDelta: o, discountDelta: d });
  };

  const formatINR = (val) => {
    if (val === undefined || val === null) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatDelta = (val, isPositiveGood = true) => {
    if (val === undefined || val === null) return '0%';
    const isPos = val > 0;
    const isZero = val === 0;
    const good = isPositiveGood ? isPos : !isPos;
    return (
      <span className={`flex items-center text-xs font-semibold ${
        isZero ? 'text-slate-400' : good ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
      }`}>
        {isPos ? <TrendingUp size={12} className="mr-0.5" /> : !isZero ? <TrendingDown size={12} className="mr-0.5" /> : null}
        {isPos ? `+${val.toFixed(1)}%` : `${val.toFixed(1)}%`}
      </span>
    );
  };

  const sim = simulationResult?.simulated_kpis || {};
  const base = simulationResult?.historical_baseline || {};
  const deltas = simulationResult?.deltas || {};
  const ci = simulationResult?.confidence_intervals?.['95'] || {};

  const comparisonChartData = [
    {
      metric: 'Revenue (₹)',
      Current: base.revenue || 0,
      Simulated: sim.simulated_revenue || 0,
    },
    {
      metric: 'Net Profit (₹)',
      Current: base.net_profit || 0,
      Simulated: sim.simulated_net_profit || 0,
    },
    {
      metric: 'OPEX (₹)',
      Current: base.opex || 0,
      Simulated: sim.simulated_opex || 0,
    },
    {
      metric: 'Marketing (₹)',
      Current: base.marketing_spend || 0,
      Simulated: sim.simulated_marketing_spend || 0,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 p-4 sm:p-6 rounded-2xl border border-teal-500/20 shadow-xl text-white">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              ACDIE Decision Intelligence Subsystem
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 size={12} /> 95% Confidence Bounds Active
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Interactive What-If Decision Simulator</h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Model the cross-departmental financial and operational ripple effects of executive decisions with 95% confidence bounds.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs sm:text-sm font-medium border border-slate-700 transition"
          >
            <RotateCcw size={15} /> Reset Sliders
          </button>
          <button
            onClick={() => fetchSimulation()}
            className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-lg shadow-teal-600/30"
          >
            <Play size={15} className={loading ? 'animate-spin' : ''} /> Execute Simulation
          </button>
        </div>
      </div>

      {/* Preset Scenarios */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-2">Quick Presets:</span>
        <button
          onClick={() => applyPreset(25, 10, 5, -2)}
          className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-medium border border-indigo-200 dark:border-indigo-800 transition"
        >
          🚀 Aggressive Growth (+25% Mktg, +10 HC)
        </button>
        <button
          onClick={() => applyPreset(-15, -2, -10, 0)}
          className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-medium border border-emerald-200 dark:border-emerald-800 transition"
        >
          🛡️ Cost Optimization (-10% OPEX, -15% Mktg)
        </button>
        <button
          onClick={() => applyPreset(10, 3, 0, 5)}
          className="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-lg text-xs font-medium border border-amber-200 dark:border-amber-800 transition"
        >
          🏷️ Promotional Clearance (+5% Discount, +10% Mktg)
        </button>
        <button
          onClick={() => applyPreset(0, 0, 0, 0)}
          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium transition"
        >
          ⚖️ Baseline Status Quo
        </button>
      </div>

      {/* Main Grid: Sliders on Left, Simulation Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Decision Control Sliders */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
            <div className="border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Sliders size={18} className="text-teal-600 dark:text-teal-400" /> Decision Variables
              </h3>
              <span className="text-xs text-slate-400">4 Levers Active</span>
            </div>

            {/* Slider 1: Marketing Spend */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <DollarSign size={14} className="text-blue-500" /> Marketing Spend Delta
                </span>
                <span className={`font-bold font-mono ${marketingDelta > 0 ? 'text-blue-600' : marketingDelta < 0 ? 'text-rose-500' : 'text-slate-500'}`}>
                  {marketingDelta > 0 ? `+${marketingDelta}%` : `${marketingDelta}%`}
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="100"
                step="5"
                value={marketingDelta}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMarketingDelta(val);
                  fetchSimulation({ marketingDelta: val });
                }}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>-50%</span>
                <span>0% (Baseline)</span>
                <span>+100%</span>
              </div>
            </div>

            {/* Slider 2: Headcount Delta */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <Users size={14} className="text-indigo-500" /> Sales Headcount Delta
                </span>
                <span className={`font-bold font-mono ${headcountDelta > 0 ? 'text-indigo-600' : headcountDelta < 0 ? 'text-rose-500' : 'text-slate-500'}`}>
                  {headcountDelta > 0 ? `+${headcountDelta} reps` : `${headcountDelta} reps`}
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="50"
                step="1"
                value={headcountDelta}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setHeadcountDelta(val);
                  fetchSimulation({ headcountDelta: val });
                }}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>-20</span>
                <span>0 (Current Team)</span>
                <span>+50</span>
              </div>
            </div>

            {/* Slider 3: OPEX Delta */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <DollarSign size={14} className="text-amber-500" /> OPEX Budget Delta
                </span>
                <span className={`font-bold font-mono ${opexDelta > 0 ? 'text-rose-600' : opexDelta < 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {opexDelta > 0 ? `+${opexDelta}%` : `${opexDelta}%`}
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                step="2"
                value={opexDelta}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setOpexDelta(val);
                  fetchSimulation({ opexDelta: val });
                }}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>-30% (Cut)</span>
                <span>0%</span>
                <span>+30% (Expand)</span>
              </div>
            </div>

            {/* Slider 4: Discount Delta */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <Percent size={14} className="text-purple-500" /> Promotional Discount Delta
                </span>
                <span className={`font-bold font-mono ${discountDelta > 0 ? 'text-purple-600' : discountDelta < 0 ? 'text-slate-600' : 'text-slate-500'}`}>
                  {discountDelta > 0 ? `+${discountDelta}%` : `${discountDelta}%`}
                </span>
              </div>
              <input
                type="range"
                min="-10"
                max="25"
                step="1"
                value={discountDelta}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setDiscountDelta(val);
                  fetchSimulation({ discountDelta: val });
                }}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>-10%</span>
                <span>0% (Standard)</span>
                <span>+25%</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Simulated Impact Summary & Charts */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Simulated Impact KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Revenue */}
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
              <span className="text-xs text-slate-500 uppercase font-semibold">Simulated Revenue</span>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {formatINR(sim.simulated_revenue)}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                <span className="text-[11px] text-slate-400">Baseline: {formatINR(base.revenue)}</span>
                {formatDelta(deltas.revenue_pct)}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                95% CI: [{formatINR(ci.revenue?.lower)} – {formatINR(ci.revenue?.upper)}]
              </div>
            </div>

            {/* Net Profit */}
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
              <span className="text-xs text-slate-500 uppercase font-semibold">Simulated Net Profit</span>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {formatINR(sim.simulated_net_profit)}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                <span className="text-[11px] text-slate-400">Baseline: {formatINR(base.net_profit)}</span>
                {formatDelta(deltas.net_profit_pct)}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Margin: {((sim.simulated_net_profit / (sim.simulated_revenue || 1)) * 100).toFixed(1)}%
              </div>
            </div>

            {/* Customer Acquisition Cost */}
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
              <span className="text-xs text-slate-500 uppercase font-semibold">Simulated CAC</span>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {formatINR(sim.simulated_cac)}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                <span className="text-[11px] text-slate-400">Baseline: {formatINR(base.cac)}</span>
                {formatDelta(deltas.cac_pct, false)}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Acq: {sim.simulated_customers_acquired?.toLocaleString() || 0} clients
              </div>
            </div>

            {/* Total OPEX */}
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
              <span className="text-xs text-slate-500 uppercase font-semibold">Simulated OPEX</span>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {formatINR(sim.simulated_opex)}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                <span className="text-[11px] text-slate-400">Baseline: {formatINR(base.opex)}</span>
                {formatDelta(deltas.opex_pct, false)}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Marketing: {formatINR(sim.simulated_marketing_spend)}
              </div>
            </div>

          </div>

          {/* Baseline vs Simulated Comparison Bar Chart */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                  Baseline vs. Simulated Outcome Comparison (₹ INR)
                </h3>
                <p className="text-xs text-slate-500">
                  Direct visual comparison of financial totals under current vs. hypothetical decision conditions.
                </p>
              </div>
            </div>

            <div className="h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonChartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                  <Tooltip formatter={(val) => formatINR(val)} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="Current" name="Historical Baseline (₹)" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Simulated" name="Simulated Scenario (₹)" fill="#0D9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DecisionSimulatorPage;
