import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { KPICard } from '../components/KPICard';
import { Activity, Clock, ShieldCheck, RefreshCw, Layers } from 'lucide-react';
import { PieChart as RePie, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#0D9488', '#EF4444'];

export const OperationsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/dashboards/operations');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load operations dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 gap-2">
        <RefreshCw size={20} className="animate-spin text-blue-600" />
        <span>Loading Operations & Logistics Analytics...</span>
      </div>
    );
  }

  const kpis = data.kpis || {};
  const metrics = data.fulfillment_metrics || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Operations & SLA Logistics</h1>
        <p className="text-xs text-slate-500">Order processing latency, fulfillment SLA targets, and inventory turnover efficiency</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Orders Processed"
          value={kpis.orders_processed?.value}
          unit=""
          changePct={3.4}
          source="FactOperations"
          icon={Activity}
        />
        <KPICard
          title="SLA Compliance Rate"
          value={kpis.sla_compliance?.value}
          unit="%"
          changePct={kpis.sla_compliance?.change_pct}
          source="FactOperations"
          icon={ShieldCheck}
        />
        <KPICard
          title="Inventory Turnover"
          value={kpis.inventory_turnover?.value}
          unit="x"
          changePct={kpis.inventory_turnover?.change_pct}
          source="FactOperations"
          icon={Layers}
        />
        <KPICard
          title="Avg Fulfillment Time"
          value={kpis.avg_fulfillment_time?.value}
          unit="hrs"
          changePct={-2.1}
          source="FactOperations"
          icon={Clock}
        />
      </div>

      {/* SLA Distribution & Timelines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SLA Pie Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">SLA Compliance Breakdown</h3>
            <p className="text-xs text-slate-500">Orders meeting vs breaching target delivery SLA</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RePie>
                <Pie
                  data={data.sla_distribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  nameKey="status"
                >
                  {data.sla_distribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => Number(val).toLocaleString()} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </RePie>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Operational Latency Metric Cards */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Supply Chain Fulfillment Latency</h3>
            <p className="text-xs text-slate-500">Stage-by-stage processing speed</p>
          </div>

          <div className="space-y-4 my-auto">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Order Processing Time</span>
                <p className="text-lg font-bold text-slate-900">{metrics.processing_time_hours} Hours</p>
              </div>
              <Clock className="text-blue-600" size={24} />
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Warehouse Fulfillment</span>
                <p className="text-lg font-bold text-slate-900">{metrics.fulfillment_time_hours} Hours</p>
              </div>
              <Activity className="text-teal-600" size={24} />
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Last-Mile Courier Delivery</span>
                <p className="text-lg font-bold text-slate-900">{metrics.delivery_time_days} Days</p>
              </div>
              <ShieldCheck className="text-emerald-600" size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
