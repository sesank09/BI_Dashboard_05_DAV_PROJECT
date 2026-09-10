import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { LineChart, BarChart2, Table, RefreshCw, Cpu } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AnalyticsPage = () => {
  const [dataset, setDataset] = useState('sales');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEDA = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/analytics/eda?dataset=${dataset}`);
        setData(res.data);
      } catch (err) {
        console.error('Failed to load EDA stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEDA();
  }, [dataset]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Exploratory Data Analysis (EDA)</h1>
          <p className="text-xs text-slate-500">Descriptive statistics, distribution histograms, and correlation matrices</p>
        </div>

        {/* Dataset Selector */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1 shadow-sm text-xs font-semibold">
          <Cpu size={14} className="ml-2 text-blue-600" />
          <span className="text-slate-500">Select Dataset:</span>
          {['sales', 'finance', 'hr', 'marketing', 'operations', 'customers'].map((d) => (
            <button
              key={d}
              onClick={() => setDataset(d)}
              className={`px-3 py-1.5 rounded-md capitalize transition-all ${
                dataset === d ? 'bg-[#123A6D] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {loading || !data ? (
        <div className="flex items-center justify-center h-64 text-slate-500 gap-2">
          <RefreshCw size={20} className="animate-spin text-blue-600" />
          <span>Calculating dataset summary statistics...</span>
        </div>
      ) : (
        <>
          {/* Summary Banner */}
          <div className="bg-gradient-to-r from-[#123A6D] to-[#2563EB] text-white rounded-xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-blue-200 font-semibold">Active Dataset Profile</span>
              <h2 className="text-xl font-bold capitalize">{data.dataset} Data Warehouse Fact Table</h2>
            </div>
            <div className="flex items-center gap-6 text-xs">
              <div>
                <span className="text-blue-200 block">Total Records</span>
                <span className="text-lg font-bold">{data.total_records?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-blue-200 block">Columns Evaluated</span>
                <span className="text-lg font-bold">{data.columns?.length}</span>
              </div>
            </div>
          </div>

          {/* Descriptive Statistics Table */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Table size={18} className="text-[#123A6D]" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Descriptive Summary Statistics</h3>
                <p className="text-xs text-slate-500">Mean, Median, Standard Deviation, Quantiles, and Range</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Variable</th>
                    <th className="py-2.5 px-3">Mean</th>
                    <th className="py-2.5 px-3">Median</th>
                    <th className="py-2.5 px-3">Std Dev</th>
                    <th className="py-2.5 px-3">Min</th>
                    <th className="py-2.5 px-3">25% (Q1)</th>
                    <th className="py-2.5 px-3">75% (Q3)</th>
                    <th className="py-2.5 px-3">Max</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {Object.entries(data.summary_stats || {}).map(([varName, stats]) => (
                    <tr key={varName} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900 capitalize">{varName.replace('_', ' ')}</td>
                      <td className="py-2.5 px-3 text-blue-700 font-bold">{stats.mean}</td>
                      <td className="py-2.5 px-3 text-slate-700">{stats.median}</td>
                      <td className="py-2.5 px-3 text-slate-600">{stats.std}</td>
                      <td className="py-2.5 px-3 text-slate-500">{stats.min}</td>
                      <td className="py-2.5 px-3 text-slate-500">{stats.q25}</td>
                      <td className="py-2.5 px-3 text-slate-500">{stats.q75}</td>
                      <td className="py-2.5 px-3 text-emerald-700 font-bold">{stats.max}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Histogram Visualization */}
          {data.sample_histogram?.bins?.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <BarChart2 size={18} className="text-blue-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Frequency Distribution Histogram</h3>
                  <p className="text-xs text-slate-500">Distribution for variable: <span className="font-semibold text-slate-700 capitalize">{data.sample_histogram.column}</span></p>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.sample_histogram.bins}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" name="Frequency Count" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
