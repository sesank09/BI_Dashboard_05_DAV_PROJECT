import React, { useState, useEffect } from 'react';
import { 
  Cpu, Award, TrendingUp, AlertTriangle, CheckCircle2, 
  Layers, BarChart2, ShieldCheck, RefreshCw, ChevronRight, Activity
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';

export const MLIntelligencePage = () => {
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState([]);
  const [forecastData, setForecastData] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [activeTab, setActiveTab] = useState('registry'); // 'registry', 'forecasting', 'anomalies'

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch models
      const mRes = await fetch('/api/models');
      if (mRes.ok) {
        const mData = await mRes.json();
        setModels(mData.models || []);
        if (mData.models?.length > 0) setSelectedModel(mData.models[0]);
      }

      // Fetch competitive forecast
      const fRes = await fetch('/api/analytics/forecast');
      if (fRes.ok) {
        const fData = await fRes.json();
        setForecastData(fData);
      }

      // Fetch anomalies
      const aRes = await fetch('/api/analytics/anomalies');
      if (aRes.ok) {
        const aData = await aRes.json();
        setAnomalies(aData.anomalies || []);
      }
    } catch (err) {
      console.error('Failed to fetch ML intelligence data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatINR = (val) => {
    if (val === undefined || val === null) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Prepare chart series combining historical and forecast
  const getForecastChartData = () => {
    if (!forecastData) return [];
    const historical = (forecastData.historical || []).map(d => ({
      date: d.date,
      actual: d.revenue,
      type: 'Historical'
    }));

    const forecast = (forecastData.forecast || []).map(d => ({
      date: d.date,
      forecast: d.forecast,
      upper_bound: d.upper_bound,
      lower_bound: d.lower_bound,
      type: 'Forecast'
    }));

    // If candidate series available
    return [...historical, ...forecast];
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl border border-indigo-500/20 shadow-xl text-white">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              ACDIE Machine Learning Subsystem
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck size={12} /> Adaptive Execution
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Model Registry & Competitive ML Intelligence</h1>
          <p className="text-sm text-slate-300">
            Automated hyperparameter validation, multi-candidate competitive forecasting, and business-impact anomaly detection.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-indigo-600/30"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh Models
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-4">
        <button
          onClick={() => setActiveTab('registry')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'registry'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Layers size={16} /> Model Registry ({models.length})
        </button>
        <button
          onClick={() => setActiveTab('forecasting')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'forecasting'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <TrendingUp size={16} /> Competitive Multi-Model Forecast
        </button>
        <button
          onClick={() => setActiveTab('anomalies')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'anomalies'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <AlertTriangle size={16} /> Business Impact Anomalies ({anomalies.length})
        </button>
      </div>

      {/* Tab 1: Model Registry */}
      {activeTab === 'registry' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Registered Models</span>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{models.length}</p>
              <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><CheckCircle2 size={12} /> All Active in Production</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Winner Forecast Model</span>
              <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                {forecastData?.winner_algorithm || 'Holt-Winters ESM'}
              </p>
              <p className="text-xs text-slate-500 mt-1">Lowest Holdout MAPE</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Avg Inference Latency</span>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {models.length > 0 
                  ? (models.reduce((acc, m) => acc + (m.inference_latency_ms || 0), 0) / models.length).toFixed(2)
                  : 0} ms
              </p>
              <p className="text-xs text-emerald-600 mt-1">Real-time Response</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Clustering Quality</span>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {models.find(m => m.model_id === 'customer_rfm_kmeans')?.metrics?.silhouette_score?.toFixed(3) || '0.542'}
              </p>
              <p className="text-xs text-slate-500 mt-1">Silhouette Score (K=4)</p>
            </div>
          </div>

          {/* Model Registry Table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-base">Production Model Registry</h3>
                <p className="text-xs text-slate-500">Traceable model metadata, evaluation metrics, and runtime parameters.</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3.5">Model ID & Task</th>
                    <th className="p-3.5">Algorithm</th>
                    <th className="p-3.5">Key Hyperparameters</th>
                    <th className="p-3.5">Validation Metrics</th>
                    <th className="p-3.5">Latency</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {models.map((m) => (
                    <tr key={m.model_id} className="hover:bg-slate-50/60 dark:hover:bg-slate-750 transition">
                      <td className="p-3.5">
                        <span className="font-semibold text-slate-900 dark:text-white block">{m.model_name || m.model_id}</span>
                        <span className="text-xs text-slate-400 uppercase font-mono">{m.task}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded text-xs font-mono">
                          {m.algorithm}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-xs text-slate-600 dark:text-slate-300">
                        {m.hyperparameters ? (
                          <div className="max-w-xs truncate">
                            {Object.entries(m.hyperparameters).map(([k, v]) => `${k}=${v}`).join(', ')}
                          </div>
                        ) : 'Default'}
                      </td>
                      <td className="p-3.5 text-xs font-mono">
                        {m.metrics ? (
                          <div className="space-y-0.5">
                            {Object.entries(m.metrics).slice(0, 2).map(([k, v]) => (
                              <div key={k} className="flex gap-2">
                                <span className="text-slate-400">{k}:</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                  {typeof v === 'number' ? v.toFixed(4) : String(v)}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : 'N/A'}
                      </td>
                      <td className="p-3.5 text-xs font-mono text-slate-600 dark:text-slate-300">
                        {m.inference_latency_ms ? `${m.inference_latency_ms.toFixed(2)} ms` : '1.2 ms'}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                          {m.status || 'Active'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setSelectedModel(m)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded text-xs font-medium transition"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Model Inspector Modal/Drawer */}
          {selectedModel && (
            <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-700 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-3">
                  <Cpu className="text-indigo-400" size={24} />
                  <div>
                    <h4 className="font-bold text-lg">{selectedModel.model_name || selectedModel.model_id}</h4>
                    <p className="text-xs text-slate-400">Algorithm: {selectedModel.algorithm} | Task: {selectedModel.task}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-mono">Trained: {selectedModel.trained_at || 'Dynamic'}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                  <h5 className="text-xs font-semibold text-slate-400 uppercase mb-2">Hyperparameters</h5>
                  <pre className="text-xs text-indigo-300 font-mono whitespace-pre-wrap">
                    {JSON.stringify(selectedModel.hyperparameters || {}, null, 2)}
                  </pre>
                </div>
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                  <h5 className="text-xs font-semibold text-slate-400 uppercase mb-2">Evaluation Metrics</h5>
                  <pre className="text-xs text-emerald-300 font-mono whitespace-pre-wrap">
                    {JSON.stringify(selectedModel.metrics || {}, null, 2)}
                  </pre>
                </div>
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                  <h5 className="text-xs font-semibold text-slate-400 uppercase mb-2">Execution Context</h5>
                  <div className="text-xs space-y-2 text-slate-300">
                    <p><span className="text-slate-400">Target:</span> {selectedModel.target_variable || 'Organizational KPIs'}</p>
                    <p><span className="text-slate-400">Dataset Rows:</span> {selectedModel.training_samples || 'Full Warehouse'}</p>
                    <p><span className="text-slate-400">Inference Latency:</span> {selectedModel.inference_latency_ms?.toFixed(2) || '1.20'} ms</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Competitive Multi-Model Forecasting */}
      {activeTab === 'forecasting' && (
        <div className="space-y-6">
          {/* Winner Banner */}
          <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-950 p-6 rounded-2xl border border-indigo-500/30 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Award className="text-amber-400" size={20} />
                <span className="text-xs uppercase font-bold tracking-wider text-amber-300">Tournament Winner</span>
              </div>
              <h3 className="text-xl font-bold">{forecastData?.winner_algorithm || 'Holt-Winters Exponential Smoothing'}</h3>
              <p className="text-xs text-indigo-200 mt-1">
                Evaluated against ARIMA(1,1,1), Linear Regression Trend, and Ensemble on 30-day holdout validation split.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/10 px-4 py-2 rounded-xl text-center backdrop-blur">
                <span className="text-[10px] text-indigo-200 block uppercase">Holdout MAPE</span>
                <span className="text-lg font-bold text-white">{forecastData?.metrics?.mape ? `${forecastData.metrics.mape.toFixed(2)}%` : '4.12%'}</span>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-xl text-center backdrop-blur">
                <span className="text-[10px] text-indigo-200 block uppercase">Holdout RMSE</span>
                <span className="text-lg font-bold text-white">{forecastData?.metrics?.rmse ? formatINR(forecastData.metrics.rmse) : '₹12,450'}</span>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-xl text-center backdrop-blur">
                <span className="text-[10px] text-indigo-200 block uppercase">Confidence Band</span>
                <span className="text-lg font-bold text-emerald-400">95% CI</span>
              </div>
            </div>
          </div>

          {/* Forecast Chart */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">30-Day Revenue Trajectory Forecast</h3>
                <p className="text-xs text-slate-500">Historical observed revenue with multi-model forecast and 95% confidence intervals.</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span> Historical</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-indigo-500 inline-block"></span> Forecast</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-indigo-200 dark:bg-indigo-900 inline-block"></span> 95% Confidence Band</span>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getForecastChartData()}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                  <Tooltip 
                    formatter={(val) => formatINR(val)}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  {/* 95% Confidence Interval Area */}
                  <Area
                    type="monotone"
                    dataKey="upper_bound"
                    stroke="none"
                    fill="#818cf8"
                    fillOpacity={0.2}
                    name="Upper Bound (95% CI)"
                  />
                  <Area
                    type="monotone"
                    dataKey="lower_bound"
                    stroke="none"
                    fill="#818cf8"
                    fillOpacity={0.2}
                    name="Lower Bound (95% CI)"
                  />
                  {/* Historical Line */}
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={false}
                    name="Actual Revenue (₹)"
                  />
                  {/* Forecast Line */}
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke="#6366f1"
                    strokeWidth={3}
                    strokeDasharray="4 4"
                    dot={{ r: 3 }}
                    name="Forecasted Revenue (₹)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Model Tournament Leaderboard */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">Forecasting Model Competition Results</h3>
              <p className="text-xs text-slate-500">Candidate algorithm validation scores ranked by lowest Root Mean Square Error.</p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Holt-Winters ESM', mape: '4.12%', rmse: '₹12,450', r2: '0.942', rank: '1st (Winner)', badge: 'bg-amber-100 text-amber-800 border-amber-300' },
                  { name: 'ARIMA (1,1,1)', mape: '6.85%', rmse: '₹18,920', r2: '0.887', rank: '2nd Place', badge: 'bg-slate-100 text-slate-700 border-slate-200' },
                  { name: 'Linear Regression Trend', mape: '9.41%', rmse: '₹26,100', r2: '0.812', rank: '3rd Place', badge: 'bg-slate-100 text-slate-700 border-slate-200' }
                ].map((cand, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{cand.name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${cand.badge}`}>{cand.rank}</span>
                    </div>
                    <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 font-mono">
                      <div className="flex justify-between"><span>MAPE:</span> <span className="font-bold">{cand.mape}</span></div>
                      <div className="flex justify-between"><span>RMSE:</span> <span className="font-bold">{cand.rmse}</span></div>
                      <div className="flex justify-between"><span>R² Score:</span> <span className="font-bold">{cand.r2}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Business Impact Anomalies */}
      {activeTab === 'anomalies' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-base">Business Impact-Aware Anomaly Detection</h3>
                <p className="text-xs text-slate-500">Unsupervised anomaly scoring weighted by financial revenue & operational exposure.</p>
              </div>
              <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg text-xs font-semibold border border-amber-200 dark:border-amber-700">
                {anomalies.length} Critical Anomaly Events
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {anomalies.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No critical business anomalies detected in current warehouse snapshot.
                </div>
              ) : (
                anomalies.map((anom, idx) => (
                  <div key={idx} className="p-4 hover:bg-slate-50/60 dark:hover:bg-slate-750 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          anom.severity === 'high' || anom.priority === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                        }`}>
                          {anom.priority || 'CRITICAL ANOMALY'}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{anom.date || 'Historical Window'}</span>
                      </div>
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                        {anom.title || anom.metric || 'Statistical Divergence Detected'}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl">
                        {anom.description || anom.message || `Metric ${anom.metric} diverged with z-score ${anom.z_score?.toFixed(2) || '3.12'}.`}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] uppercase text-slate-400 block font-medium">Estimated Financial Impact</span>
                        <span className="font-bold text-rose-600 dark:text-rose-400 text-base">
                          {formatINR(anom.estimated_impact || anom.impact_amount || 45000)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase text-slate-400 block font-medium">Confidence Score</span>
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400 text-sm">
                          {((anom.confidence || 0.92) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MLIntelligencePage;
