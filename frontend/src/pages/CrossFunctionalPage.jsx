import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  GitMerge, Network, AlertCircle, RefreshCw, ArrowRight, Zap, CheckCircle2, 
  HelpCircle, Layers, Activity, TrendingUp, Users, DollarSign, Truck
} from 'lucide-react';

export const CrossFunctionalPage = () => {
  const [fusedData, setFusedData] = useState(null);
  const [kpiGraph, setKpiGraph] = useState(null);
  const [propagationChains, setPropagationChains] = useState([]);
  const [adaptiveStatus, setAdaptiveStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('graph'); // 'graph' | 'matrix' | 'propagation' | 'adaptive'
  const [selectedNode, setSelectedNode] = useState(null);

  const fetchCrossFunctionalData = async () => {
    setLoading(true);
    try {
      const [fuseRes, graphRes, propRes, adaptRes] = await Promise.all([
        api.get('/cross-functional'),
        api.get('/kpi-dependencies'),
        api.get('/anomaly-propagation'),
        api.get('/adaptive/status')
      ]);
      setFusedData(fuseRes.data || null);
      setKpiGraph(graphRes.data || null);
      setPropagationChains(propRes.data || []);
      setAdaptiveStatus(adaptRes.data || null);
    } catch (err) {
      console.error('Failed to load cross-functional intelligence', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrossFunctionalData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 gap-2">
        <RefreshCw size={20} className="animate-spin text-blue-600" />
        <span>Evaluating cross-departmental feature covariance & dependency graph...</span>
      </div>
    );
  }

  const feat = fusedData?.cross_functional_features || {};

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Cross-Functional Intelligence & Dependency Graph</h1>
          <p className="text-xs text-slate-500">Empirical feature fusion, covariance dependency network, and cross-department anomaly propagation</p>
        </div>
        <button
          onClick={fetchCrossFunctionalData}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 shadow-sm"
        >
          <RefreshCw size={13} /> Recompute Dependencies
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        {[
          { id: 'graph', label: 'KPI Dependency Graph', icon: Network },
          { id: 'matrix', label: 'Cross-Functional Feature Matrix', icon: GitMerge },
          { id: 'propagation', label: 'Anomaly Propagation Chains', icon: Zap },
          { id: 'adaptive', label: 'Adaptive Engine Readiness', icon: Activity }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: KPI DEPENDENCY GRAPH */}
      {activeTab === 'graph' && kpiGraph && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Empirical Cross-Functional KPI Network Graph</h3>
                <p className="text-xs text-slate-500">
                  Calculated from multi-year cross-departmental covariance. Directed links indicate statistical driver direction with Pearson $r$ and $p$-value significance.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Sales</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Marketing</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Finance</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span> HR</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span> Operations</span>
              </div>
            </div>

            {/* Interactive Graph Canvas representation */}
            <div className="relative border border-slate-100 bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl p-8 min-h-[380px] flex items-center justify-center overflow-hidden">
              {/* Background grid */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>

              {/* Node Layout in Circle */}
              <div className="relative w-full max-w-2xl h-80">
                {kpiGraph.nodes?.map((node, i) => {
                  const angle = (i / kpiGraph.nodes.length) * 2 * Math.PI - Math.PI / 2;
                  const radius = 130;
                  const left = 50 + (radius * Math.cos(angle) / 320) * 100;
                  const top = 50 + (radius * Math.sin(angle) / 180) * 100;
                  const isSelected = selectedNode?.id === node.id;

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      style={{ left: `${left}%`, top: `${top}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                        isSelected ? 'scale-110 ring-4 ring-white/30 z-20' : 'hover:scale-105 z-10'
                      }`}
                    >
                      <div className="flex flex-col items-center group">
                        <div 
                          className="px-3 py-1.5 rounded-lg text-white font-bold text-xs shadow-lg flex items-center gap-1.5 border border-white/20 backdrop-blur-md"
                          style={{ backgroundColor: node.color }}
                        >
                          <span>{node.label}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 opacity-80 group-hover:opacity-100">{node.department}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dependency Edge Table */}
            <div className="space-y-2 pt-2">
              <h4 className="font-bold text-xs uppercase text-slate-700">Calculated Statistical Dependency Edges</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Driver (Source KPI)</th>
                      <th className="py-2.5 px-3"></th>
                      <th className="py-2.5 px-3">Target KPI</th>
                      <th className="py-2.5 px-3">Relationship Type</th>
                      <th className="py-2.5 px-3">Pearson Correlation (r)</th>
                      <th className="py-2.5 px-3">R² Score</th>
                      <th className="py-2.5 px-3">p-Value</th>
                      <th className="py-2.5 px-3">Strength</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {kpiGraph.edges?.map((edge, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{edge.source}</td>
                        <td className="py-2.5 px-1 text-slate-400 font-bold">→</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{edge.target}</td>
                        <td className="py-2.5 px-3 text-slate-600">{edge.relationship_type}</td>
                        <td className={`py-2.5 px-3 font-bold ${edge.correlation >= 0 ? 'text-blue-700' : 'text-rose-700'}`}>
                          {edge.correlation > 0 ? `+${edge.correlation}` : edge.correlation}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700">{edge.r_squared}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{edge.p_value}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            edge.strength === 'Strong' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {edge.strength}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CROSS-FUNCTIONAL FEATURE MATRIX */}
      {activeTab === 'matrix' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Marketing -> Sales -> Finance */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <DollarSign size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Marketing → Sales → Finance Funnel</h3>
                <span className="text-[10px] text-emerald-600 font-bold uppercase">Empirical Pipeline Active</span>
              </div>
            </div>

            {feat.marketing_to_sales_finance?.status === 'available' ? (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Total Marketing Spend</span>
                  <span className="font-bold text-slate-900 text-sm">₹{feat.marketing_to_sales_finance.total_marketing_spend?.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Customer Acq Cost (CAC)</span>
                  <span className="font-bold text-blue-700 text-sm">₹{feat.marketing_to_sales_finance.customer_acquisition_cost?.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Lead-to-Revenue Efficiency</span>
                  <span className="font-bold text-emerald-700 text-sm">₹{feat.marketing_to_sales_finance.lead_to_revenue_efficiency?.toLocaleString()} / lead</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Marketing / Revenue Ratio</span>
                  <span className="font-bold text-purple-700 text-sm">{feat.marketing_to_sales_finance.marketing_to_revenue_ratio_pct}%</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-rose-600">{feat.marketing_to_sales_finance?.reason}</p>
            )}
          </div>

          {/* HR -> Sales: Labor Productivity */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Users size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">HR → Sales: Workforce Productivity</h3>
                <span className="text-[10px] text-emerald-600 font-bold uppercase">Empirical Pipeline Active</span>
              </div>
            </div>

            {feat.hr_to_sales_productivity?.status === 'available' ? (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Active Workforce Headcount</span>
                  <span className="font-bold text-slate-900 text-sm">{feat.hr_to_sales_productivity.total_headcount} Staff</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Average Productivity Index</span>
                  <span className="font-bold text-amber-700 text-sm">{feat.hr_to_sales_productivity.average_productivity_index} pts</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Revenue per Employee</span>
                  <span className="font-bold text-blue-700 text-sm">₹{feat.hr_to_sales_productivity.revenue_per_employee?.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Productivity-Adjusted Labor Output</span>
                  <span className="font-bold text-emerald-700 text-sm">₹{feat.hr_to_sales_productivity.productivity_adjusted_labor_efficiency?.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-rose-600">{feat.hr_to_sales_productivity?.reason}</p>
            )}
          </div>

          {/* Operations -> Customer Retention */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <Truck size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Operations → Customer Success Friction</h3>
                <span className="text-[10px] text-emerald-600 font-bold uppercase">Empirical Pipeline Active</span>
              </div>
            </div>

            {feat.operations_to_customer_retention?.status === 'available' ? (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Average Fulfillment Duration</span>
                  <span className="font-bold text-slate-900 text-sm">{feat.operations_to_customer_retention.average_delivery_days} days</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">SLA Breach Rate</span>
                  <span className="font-bold text-rose-700 text-sm">{feat.operations_to_customer_retention.sla_breach_rate_pct}%</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Active Customer Retention</span>
                  <span className="font-bold text-emerald-700 text-sm">{feat.operations_to_customer_retention.customer_retention_rate_pct}%</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Average Customer LTV</span>
                  <span className="font-bold text-blue-700 text-sm">₹{feat.operations_to_customer_retention.average_customer_ltv?.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-rose-600">{feat.operations_to_customer_retention?.reason}</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ANOMALY PROPAGATION CHAINS */}
      {activeTab === 'propagation' && (
        <div className="space-y-4">
          {propagationChains.map((chain) => (
            <div key={chain.chain_id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 font-mono block">{chain.chain_id}</span>
                  <h3 className="text-base font-bold text-slate-900">{chain.origin_event}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                    Association: {chain.association_strength} (r={chain.cross_department_correlation})
                  </span>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    Lag: {chain.propagation_lag_days} days
                  </span>
                </div>
              </div>

              {/* Step Sequence */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {chain.propagation_path?.map((step, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1 relative">
                    <div className="flex items-center justify-between text-[11px] font-bold text-blue-800">
                      <span>Step {idx + 1}: {step.node}</span>
                      <span className="text-slate-400">{step.status}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-900">{step.metric}</p>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-xs text-slate-700 flex items-start gap-2">
                <AlertCircle size={15} className="text-blue-600 shrink-0 mt-0.5" />
                <span>{chain.business_verdict}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: ADAPTIVE ENGINE READINESS */}
      {activeTab === 'adaptive' && adaptiveStatus && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Adaptive Analytics Selection Engine Readiness</h3>
              <p className="text-xs text-slate-500">Automated feasibility verification ensuring models only execute when empirical requirements are satisfied.</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Adaptation Score</span>
              <span className="text-xl font-bold text-blue-600">{adaptiveStatus.adaptive_status?.adaptation_score_pct}% Ready</span>
            </div>
          </div>

          <div className="space-y-3">
            {Object.entries(adaptiveStatus.evaluations || {}).map(([key, ev]) => (
              <div key={key} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className={ev.status === 'available' ? "text-emerald-600" : "text-slate-400"} />
                    <h4 className="font-bold text-xs text-slate-900">{ev.module}</h4>
                  </div>
                  <p className="text-xs text-slate-600 ml-6">{ev.reason}</p>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                  ev.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {ev.status === 'available' ? 'Active & Verified' : 'Prerequisites Missing'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
