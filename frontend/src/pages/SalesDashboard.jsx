import React, { useState, useEffect, useContext } from 'react';
import { FilterContext } from '../context/FilterContext';
import api from '../services/api';
import { KPICard } from '../components/KPICard';
import { ShoppingBag, Target, DollarSign, Award, RefreshCw } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const SalesDashboard = () => {
  const { filters } = useContext(FilterContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.startDate) params.start_date = filters.startDate;
        if (filters.endDate) params.end_date = filters.endDate;
        if (filters.region !== 'All') params.region = filters.region;

        const res = await api.get('/dashboards/sales', { params });
        setData(res.data);
      } catch (err) {
        console.error('Failed to load sales dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 gap-2">
        <RefreshCw size={20} className="animate-spin text-blue-600" />
        <span>Loading Sales Analytics...</span>
      </div>
    );
  }

  const kpis = data.kpis || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sales & Revenue Operations</h1>
        <p className="text-xs text-slate-500">Real-time revenue performance, rep quotas, and target tracking</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Sales Revenue"
          value={kpis.total_revenue?.value}
          unit="$"
          changePct={kpis.total_revenue?.change_pct}
          source="FactSales"
          icon={DollarSign}
        />
        <KPICard
          title="Total Orders"
          value={kpis.total_orders?.value}
          unit=""
          changePct={kpis.total_orders?.change_pct}
          source="FactSales"
          icon={ShoppingBag}
        />
        <KPICard
          title="Average Order Value"
          value={kpis.average_order_value?.value}
          unit="$"
          changePct={kpis.average_order_value?.change_pct}
          source="FactSales"
          icon={DollarSign}
        />
        <KPICard
          title="Quota Achievement"
          value={kpis.target_achievement?.value}
          unit="%"
          changePct={kpis.target_achievement?.change_pct}
          source="FactSales"
          icon={Target}
        />
        <KPICard
          title="Sales Profit"
          value={kpis.total_profit?.value}
          unit="$"
          changePct={kpis.total_profit?.change_pct}
          source="FactSales"
          icon={Award}
        />
      </div>

      {/* Target vs Actual Trend */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-900">Monthly Target vs Actual Sales</h3>
          <p className="text-xs text-slate-500">Comparison of sales quota vs actual revenue generated</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.target_vs_actual}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip formatter={(val) => `$${Number(val).toLocaleString()}`} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="revenue" name="Actual Revenue ($)" fill="#2563EB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sales_target" name="Sales Quota ($)" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leaderboard and Customer Segment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Rep Leaderboard */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Top Sales Representatives Leaderboard</h3>
            <p className="text-xs text-slate-500">Ranked by closed deal revenue</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Representative Name</th>
                  <th className="py-2.5 px-3">Deals Closed</th>
                  <th className="py-2.5 px-3 text-right">Revenue ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {data.sales_rep_leaderboard?.map((rep, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-400">#{idx + 1}</td>
                    <td className="py-2.5 px-3 text-slate-800 font-semibold">{rep.employee_name || 'Account Executive'}</td>
                    <td className="py-2.5 px-3 text-slate-600">{rep.order_id} orders</td>
                    <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">${Number(rep.revenue).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Segment Revenue */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Customer Segment Performance</h3>
            <p className="text-xs text-slate-500">Revenue & order counts across market segments</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.customer_segment_performance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="customer_segment" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip formatter={(val) => `$${Number(val).toLocaleString()}`} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="revenue" name="Revenue ($)" fill="#123A6D" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="Profit ($)" fill="#0D9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
