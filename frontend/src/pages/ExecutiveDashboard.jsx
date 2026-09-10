import React, { useState, useEffect, useContext } from 'react';
import { FilterContext } from '../context/FilterContext';
import api from '../services/api';
import { KPICard } from '../components/KPICard';
import { 
  DollarSign, TrendingUp, PieChart, Users, Award, ShieldAlert, Download, RefreshCw 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart as RePie, Pie, Cell 
} from 'recharts';

const COLORS = ['#123A6D', '#2563EB', '#0D9488', '#F59E0B', '#8B5CF6'];

export const ExecutiveDashboard = () => {
  const { filters } = useContext(FilterContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.startDate) params.start_date = filters.startDate;
      if (filters.endDate) params.end_date = filters.endDate;
      if (filters.region !== 'All') params.region = filters.region;
      if (filters.department !== 'All') params.department = filters.department;
      if (filters.productCategory !== 'All') params.product_category = filters.productCategory;
      if (filters.customerSegment !== 'All') params.customer_segment = filters.customerSegment;

      const res = await api.get('/dashboards/executive', { params });
      setData(res.data);
    } catch (err) {
      console.error('Failed to load executive dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [filters]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 gap-2">
        <RefreshCw size={20} className="animate-spin text-blue-600" />
        <span>Loading Executive Intelligence Dashboard...</span>
      </div>
    );
  }

  const kpis = data.kpis || {};

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Performance Dashboard</h1>
          <p className="text-xs text-slate-500">Cross-departmental organizational analytics & decision support</p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="http://localhost:8000/api/export/excel?dataset=sales"
            download
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            <Download size={14} /> Export Report (Excel)
          </a>
        </div>
      </div>

      {/* Top KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title={kpis.total_revenue?.name || 'Total Revenue'}
          value={kpis.total_revenue?.value}
          unit="$"
          changePct={kpis.total_revenue?.change_pct}
          source="FactSales"
          icon={DollarSign}
        />
        <KPICard
          title={kpis.total_profit?.name || 'Total Profit'}
          value={kpis.total_profit?.value}
          unit="$"
          changePct={kpis.total_profit?.change_pct}
          source="FactSales"
          icon={TrendingUp}
        />
        <KPICard
          title={kpis.profit_margin?.name || 'Net Profit Margin'}
          value={kpis.profit_margin?.value}
          unit="%"
          changePct={kpis.profit_margin?.change_pct}
          source="FactSales"
          icon={PieChart}
        />
        <KPICard
          title={kpis.revenue_growth?.name || 'Revenue Growth'}
          value={kpis.revenue_growth?.value}
          unit="%"
          changePct={kpis.revenue_growth?.change_pct}
          source="FactSales"
          icon={TrendingUp}
        />
        <KPICard
          title={kpis.ltv?.name || 'Customer LTV'}
          value={kpis.ltv?.value}
          unit="$"
          changePct={kpis.ltv?.change_pct}
          source="DimCustomer"
          icon={Users}
        />
        <KPICard
          title={kpis.employee_productivity?.name || 'Workforce Productivity'}
          value={kpis.employee_productivity?.value}
          unit="pts"
          changePct={kpis.employee_productivity?.change_pct}
          source="FactHR"
          icon={Award}
        />
      </div>

      {/* Charts Grid Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue vs Profit Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Revenue & Profit Trend</h3>
              <p className="text-xs text-slate-500">Monthly trajectory across all operational regions</p>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">Monthly</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthly_trend}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip formatter={(val) => `$${Number(val).toLocaleString()}`} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#2563EB" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                <Area type="monotone" dataKey="profit" name="Profit ($)" stroke="#0D9488" fillOpacity={1} fill="url(#colorProf)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Contribution by Category */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Revenue Contribution</h3>
            <p className="text-xs text-slate-500">Breakdown by product category</p>
          </div>
          <div className="h-64 my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <RePie>
                <Pie
                  data={data.category_contribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="revenue"
                  nameKey="category"
                >
                  {data.category_contribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => `$${Number(val).toLocaleString()}`} />
                <Legend wrapperStyle={{ fontSize: '11px' }} layout="vertical" align="right" verticalAlign="middle" />
              </RePie>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Grid Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Performance */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Regional Financial Performance</h3>
            <p className="text-xs text-slate-500">Total revenue and profit by operating region</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.regional_performance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="region_name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip formatter={(val) => `$${Number(val).toLocaleString()}`} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="revenue" name="Revenue" fill="#123A6D" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="Profit" fill="#0D9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Workforce Productivity */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Department Workforce Index</h3>
            <p className="text-xs text-slate-500">Productivity vs Performance Scorecard</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.department_performance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="department" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="productivity_score" name="Productivity Index" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="performance_score" name="Performance Rating" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
