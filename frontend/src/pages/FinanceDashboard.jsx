import React, { useState, useEffect, useContext } from 'react';
import { FilterContext } from '../context/FilterContext';
import api from '../services/api';
import { KPICard } from '../components/KPICard';
import { DollarSign, Wallet, PieChart, TrendingUp, RefreshCw } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart as RePie, Pie, Cell } from 'recharts';

const COLORS = ['#2563EB', '#F59E0B', '#0D9488'];

export const FinanceDashboard = () => {
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

        const res = await api.get('/dashboards/finance', { params });
        setData(res.data);
      } catch (err) {
        console.error('Failed to load finance dashboard', err);
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
        <span>Loading Financial Analytics...</span>
      </div>
    );
  }

  const kpis = data.kpis || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Financial & Cash Flow Analytics</h1>
        <p className="text-xs text-slate-500">Corporate P&L, operating expenditures, cash flow, and budget variance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Gross Revenue"
          value={kpis.total_revenue?.value}
          unit="$"
          changePct={kpis.total_revenue?.change_pct}
          source="FactFinance"
          icon={DollarSign}
        />
        <KPICard
          title="Operating Expense"
          value={kpis.operating_expense?.value}
          unit="$"
          changePct={kpis.operating_expense?.change_pct}
          source="FactFinance"
          icon={Wallet}
        />
        <KPICard
          title="Net Profit"
          value={kpis.total_profit?.value}
          unit="$"
          changePct={kpis.total_profit?.change_pct}
          source="FactFinance"
          icon={TrendingUp}
        />
        <KPICard
          title="Profit Margin"
          value={kpis.profit_margin?.value}
          unit="%"
          changePct={kpis.profit_margin?.change_pct}
          source="FactFinance"
          icon={PieChart}
        />
        <KPICard
          title="Net Cash Flow"
          value={kpis.cash_flow?.value}
          unit="$"
          changePct={kpis.cash_flow?.change_pct}
          source="FactFinance"
          icon={Wallet}
        />
      </div>

      {/* Main Revenue vs Expense Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Revenue vs Expense & Operating Profit</h3>
            <p className="text-xs text-slate-500">Monthly P&L breakdown</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthly_finance_trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip formatter={(val) => `$${Number(val).toLocaleString()}`} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#2563EB" fill="#2563EB" fillOpacity={0.1} strokeWidth={2} />
                <Area type="monotone" dataKey="operating_expense" name="Operating Expense ($)" stroke="#EF4444" fill="#EF4444" fillOpacity={0.1} strokeWidth={2} />
                <Area type="monotone" dataKey="operating_profit" name="Operating Profit ($)" stroke="#10B981" fill="#10B981" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown Pie */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Operating Expense Breakdown</h3>
            <p className="text-xs text-slate-500">Proportions across categories</p>
          </div>
          <div className="h-64 my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <RePie>
                <Pie
                  data={data.expense_breakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  dataKey="value"
                  nameKey="name"
                >
                  {data.expense_breakdown?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => `$${Number(val).toLocaleString()}`} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </RePie>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
