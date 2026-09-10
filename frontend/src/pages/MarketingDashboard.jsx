import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { KPICard } from '../components/KPICard';
import { Megaphone, Users, Target, TrendingUp, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const MarketingDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/dashboards/marketing');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load marketing dashboard', err);
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
        <span>Loading Marketing Analytics...</span>
      </div>
    );
  }

  const kpis = data.kpis || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Marketing Campaigns & Acquisition ROI</h1>
        <p className="text-xs text-slate-500">Channel ROI, Customer Acquisition Cost (CAC), Lifetime Value (LTV), and conversion funnels</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Marketing Spend"
          value={kpis.marketing_spend?.value}
          unit="$"
          changePct={2.5}
          source="FactMarketing"
          icon={Megaphone}
        />
        <KPICard
          title="Customer Acq Cost (CAC)"
          value={kpis.cac?.value}
          unit="$"
          changePct={kpis.cac?.change_pct}
          source="FactMarketing"
          icon={Users}
        />
        <KPICard
          title="Lifetime Value (LTV)"
          value={kpis.ltv?.value}
          unit="$"
          changePct={kpis.ltv?.change_pct}
          source="DimCustomer"
          icon={Target}
        />
        <KPICard
          title="Marketing ROI"
          value={kpis.marketing_roi?.value}
          unit="%"
          changePct={kpis.marketing_roi?.change_pct}
          source="FactMarketing"
          icon={TrendingUp}
        />
        <KPICard
          title="Conversion Rate"
          value={kpis.conversion_rate?.value}
          unit="%"
          changePct={kpis.conversion_rate?.change_pct}
          source="FactMarketing"
          icon={Target}
        />
      </div>

      {/* Channel Performance & Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel ROI */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Channel Marketing ROI & Spend</h3>
            <p className="text-xs text-slate-500">Return on ad spend across digital & event channels</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.channel_performance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="channel" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="roi" name="ROI (%)" fill="#0D9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cac" name="CAC ($)" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Acquisition Conversion Funnel</h3>
            <p className="text-xs text-slate-500">Volume dropoff from impressions to acquired customers</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.conversion_funnel} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="stage" type="category" tick={{ fontSize: 11 }} width={120} />
                <Tooltip formatter={(val) => Number(val).toLocaleString()} />
                <Bar dataKey="value" name="Count" fill="#123A6D" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
