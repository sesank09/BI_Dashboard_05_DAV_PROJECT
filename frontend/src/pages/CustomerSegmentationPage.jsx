import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { UserCheck, Users, DollarSign, Award, RefreshCw, Cpu } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const CustomerSegmentationPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clusters, setClusters] = useState(5);

  const fetchRFM = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/analytics/rfm?n_clusters=${clusters}`);
      setData(res.data);
    } catch (err) {
      console.error('Failed to run RFM clustering', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRFM();
  }, [clusters]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">RFM Customer Segmentation (K-Means ML)</h1>
          <p className="text-xs text-slate-500">Recency, Frequency, and Monetary value clustering using Scikit-Learn</p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1.5 shadow-sm text-xs font-semibold">
          <Cpu size={14} className="text-blue-600 ml-1" />
          <span className="text-slate-500">Cluster Count (K):</span>
          {[3, 4, 5, 6].map((k) => (
            <button
              key={k}
              onClick={() => setClusters(k)}
              className={`px-3 py-1 rounded transition-all ${
                clusters === k ? 'bg-[#2563EB] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              K={k}
            </button>
          ))}
        </div>
      </div>

      {loading || !data ? (
        <div className="flex items-center justify-center h-64 text-slate-500 gap-2">
          <RefreshCw size={20} className="animate-spin text-blue-600" />
          <span>Executing Scikit-learn K-Means RFM Clustering algorithm...</span>
        </div>
      ) : (
        <>
          {/* Segment Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {data.segment_summary?.map((seg, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm card-hover">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wider">
                  {seg.segment_name}
                </span>
                <div className="text-xl font-bold text-slate-900 mt-2">
                  {seg.customer_count} <span className="text-xs font-normal text-slate-500">Clients</span>
                </div>
                <div className="mt-2 text-xs space-y-1 text-slate-600 border-t border-slate-100 pt-2">
                  <div className="flex justify-between"><span>Avg Recency:</span> <span className="font-semibold">{seg.avg_recency} days</span></div>
                  <div className="flex justify-between"><span>Avg Freq:</span> <span className="font-semibold">{seg.avg_frequency} orders</span></div>
                  <div className="flex justify-between"><span>Avg Monetary:</span> <span className="font-semibold text-emerald-700">${seg.avg_monetary}</span></div>
                </div>
              </div>
            ))}
          </div>

          {/* Segment Revenue Chart */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-900">Total Segment Revenue Contribution</h3>
              <p className="text-xs text-slate-500">Total gross value generated per RFM cluster</p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.segment_summary}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="segment_name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip formatter={(val) => `$${Number(val).toLocaleString()}`} />
                  <Bar dataKey="total_revenue" name="Total Revenue ($)" fill="#123A6D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Customer RFM Table Sample */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-900">Calculated Customer RFM Matrix (Sample)</h3>
              <p className="text-xs text-slate-500">Individual customer recency, frequency, monetary metrics & assigned cluster</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Customer ID</th>
                    <th className="py-2.5 px-3">Recency (Days)</th>
                    <th className="py-2.5 px-3">Frequency (Orders)</th>
                    <th className="py-2.5 px-3">Monetary Value ($)</th>
                    <th className="py-2.5 px-3">Assigned RFM Segment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {data.customer_sample?.map((c, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{c.customer_id}</td>
                      <td className="py-2.5 px-3 text-slate-600">{c.recency} days ago</td>
                      <td className="py-2.5 px-3 text-slate-600">{c.frequency} transactions</td>
                      <td className="py-2.5 px-3 text-emerald-700 font-bold">${Number(c.monetary).toLocaleString()}</td>
                      <td className="py-2.5 px-3">
                        <span className="bg-slate-100 border border-slate-200 text-slate-800 px-2 py-0.5 rounded text-[11px] font-semibold">
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
