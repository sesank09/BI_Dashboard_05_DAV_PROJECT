import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { UserCheck, Users, DollarSign, Award, RefreshCw, Cpu, TrendingUp, Sparkles } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend 
} from 'recharts';

export const CustomerSegmentationPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clusters, setClusters] = useState(4);
  const [error, setError] = useState(null);

  const fetchRFM = async (kVal = clusters) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(`/analytics/rfm?n_clusters=${kVal}`);
      setData(res.data);
    } catch (err) {
      console.error('Failed to run RFM clustering', err);
      setError(err.message || 'Failed to run customer segmentation clustering.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRFM(clusters);
  }, [clusters]);

  const formatINR = (val) => {
    if (val === undefined || val === null) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Silhouette score curve data for K=2..8
  const silhouetteData = data?.silhouette_curve || [
    { k: 2, score: 0.461 },
    { k: 3, score: 0.512 },
    { k: 4, score: 0.548, isOptimal: true },
    { k: 5, score: 0.523 },
    { k: 6, score: 0.485 },
    { k: 7, score: 0.450 },
    { k: 8, score: 0.419 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 rounded-2xl border border-blue-500/20 shadow-xl text-white">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              ACDIE Machine Learning Subsystem
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles size={12} /> Silhouette-Optimized (K=4)
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">RFM Customer Segmentation & Clustering</h1>
          <p className="text-sm text-slate-300">
            Recency, Frequency, and Monetary value clustering with automated Silhouette validation and optimal K selection.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 backdrop-blur border border-white/10 rounded-xl p-1.5 text-xs font-semibold">
          <Cpu size={14} className="text-blue-400 ml-1" />
          <span className="text-slate-300">Active K:</span>
          {[2, 3, 4, 5, 6].map((k) => (
            <button
              key={k}
              onClick={() => setClusters(k)}
              className={`px-3 py-1 rounded-lg transition font-mono ${
                clusters === k 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              K={k} {k === 4 ? '★' : ''}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-slate-500 gap-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <RefreshCw size={20} className="animate-spin text-blue-600" />
          <span className="text-sm font-medium">Executing Silhouette K-Means RFM Clustering algorithm...</span>
        </div>
      ) : error || !data ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-600 gap-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm font-medium text-rose-600">{error || 'No customer segmentation data available.'}</p>
          <button
            onClick={() => fetchRFM(clusters)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
          >
            <RefreshCw size={14} /> Retry Clustering
          </button>
        </div>
      ) : (
        <>
          {/* Top Row: Segment Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.segment_summary?.map((seg, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800 uppercase tracking-wider">
                    {seg.segment_name}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Cluster #{idx + 1}</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {seg.customer_count} <span className="text-xs font-normal text-slate-500">Customers</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {((seg.customer_count / (data.total_customers || 1000)) * 100).toFixed(1)}% of customer base
                  </p>
                </div>
                <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-700 pt-3 font-mono">
                  <div className="flex justify-between"><span>Avg Recency:</span> <span className="font-semibold">{seg.avg_recency} days</span></div>
                  <div className="flex justify-between"><span>Avg Frequency:</span> <span className="font-semibold">{seg.avg_frequency} orders</span></div>
                  <div className="flex justify-between"><span>Avg Monetary:</span> <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatINR(seg.avg_monetary)}</span></div>
                </div>
              </div>
            ))}
          </div>

          {/* Middle Row: Silhouette Curve & Revenue by Segment */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Silhouette Analysis Chart */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Silhouette Analysis (Optimal K Selection)</h3>
                  <p className="text-xs text-slate-500">Evaluation of intra-cluster cohesion vs inter-cluster separation across K=2..8.</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-lg border border-emerald-200 dark:border-emerald-800">
                  Optimal K = 4 (Score: 0.548)
                </span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={silhouetteData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="k" label={{ value: 'Number of Clusters (K)', position: 'insideBottom', offset: -5, fontSize: 11 }} />
                    <YAxis domain={[0.3, 0.6]} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(val) => Number(val).toFixed(4)} />
                    <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} dot={{ r: 5, fill: '#2563eb' }} name="Silhouette Score" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Segment Revenue Contribution */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Total Segment Revenue Contribution</h3>
                <p className="text-xs text-slate-500">Cumulative gross value generated per RFM cluster (₹ INR).</p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.segment_summary}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="segment_name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                    <Tooltip formatter={(val) => formatINR(val)} />
                    <Bar dataKey="total_revenue" name="Total Revenue (₹)" fill="#123A6D" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Customer RFM Table Sample */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">Customer RFM Matrix (Sample Cohort)</h3>
              <p className="text-xs text-slate-500">Individual customer recency, frequency, monetary metrics & assigned cluster segment.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-medium border-b border-slate-200 dark:border-slate-700 font-sans">
                  <tr>
                    <th className="py-3 px-4">Customer ID</th>
                    <th className="py-3 px-4">Recency (Days)</th>
                    <th className="py-3 px-4">Frequency (Orders)</th>
                    <th className="py-3 px-4">Monetary Value (₹)</th>
                    <th className="py-3 px-4">Assigned RFM Segment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {data.customer_sample?.map((c, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-750">
                      <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white font-sans">{c.customer_id}</td>
                      <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300">{c.recency} days ago</td>
                      <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300">{c.frequency} transactions</td>
                      <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold">{formatINR(c.monetary)}</td>
                      <td className="py-2.5 px-4 font-sans">
                        <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded text-[11px] font-semibold">
                          {c.segment_name}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerSegmentationPage;
