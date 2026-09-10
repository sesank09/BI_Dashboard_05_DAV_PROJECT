import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { KPICard } from '../components/KPICard';
import { Users, Award, BookOpen, UserMinus, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const HRDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/dashboards/hr');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load HR dashboard', err);
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
        <span>Loading HR & Workforce Analytics...</span>
      </div>
    );
  }

  const kpis = data.kpis || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Human Capital & Workforce Analytics</h1>
        <p className="text-xs text-slate-500">Employee headcount, attrition rates, training investment, and productivity indices</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Workforce"
          value={kpis.total_employees?.value}
          unit=""
          changePct={1.8}
          source="FactHR"
          icon={Users}
        />
        <KPICard
          title="Workforce Attrition Rate"
          value={kpis.attrition_rate?.value}
          unit="%"
          changePct={kpis.attrition_rate?.change_pct}
          source="FactHR"
          icon={UserMinus}
        />
        <KPICard
          title="Productivity Score"
          value={kpis.employee_productivity?.value}
          unit="pts"
          changePct={kpis.employee_productivity?.change_pct}
          source="FactHR"
          icon={Award}
        />
        <KPICard
          title="Avg Training Hours"
          value={kpis.average_training?.value}
          unit="hrs"
          changePct={5.2}
          source="FactHR"
          icon={BookOpen}
        />
      </div>

      {/* Charts & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attrition & Productivity by Department */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Department Attrition Rate & Productivity</h3>
            <p className="text-xs text-slate-500">Cross-departmental comparisons</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.department_hr}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="department" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="avg_productivity" name="Productivity Index" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="attrition_rate" name="Attrition Rate (%)" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* HR Table */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Department Workforce Metrics</h3>
            <p className="text-xs text-slate-500">Headcount & Training hours</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2 px-2">Dept</th>
                  <th className="py-2 px-2">Staff</th>
                  <th className="py-2 px-2">Training</th>
                  <th className="py-2 px-2">Churn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {data.department_hr?.map((d, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2 px-2 font-semibold text-slate-800">{d.department}</td>
                    <td className="py-2 px-2 text-slate-600">{d.headcount}</td>
                    <td className="py-2 px-2 text-blue-700 font-semibold">{d.avg_training_hours} hrs</td>
                    <td className="py-2 px-2 text-rose-600 font-semibold">{d.attrition_rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
