import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, DollarSign, Megaphone, Users, Activity, UserCheck } from 'lucide-react';
import { SalesDashboard } from './SalesDashboard';
import { FinanceDashboard } from './FinanceDashboard';
import { MarketingDashboard } from './MarketingDashboard';
import { HRDashboard } from './HRDashboard';
import { OperationsDashboard } from './OperationsDashboard';
import { CustomerSegmentationPage } from './CustomerSegmentationPage';

const DEPARTMENT_TABS = [
  { id: 'sales', label: 'Sales & Revenue', icon: ShoppingBag, component: SalesDashboard },
  { id: 'finance', label: 'Finance & P&L', icon: DollarSign, component: FinanceDashboard },
  { id: 'marketing', label: 'Marketing ROI', icon: Megaphone, component: MarketingDashboard },
  { id: 'hr', label: 'HR Workforce', icon: Users, component: HRDashboard },
  { id: 'operations', label: 'Operations SLA', icon: Activity, component: OperationsDashboard },
  { id: 'customers', label: 'Customer RFM', icon: UserCheck, component: CustomerSegmentationPage },
];

export const DepartmentHub = ({ defaultTab }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getInitialTab = () => {
    if (defaultTab) return defaultTab;
    const path = location.pathname.replace('/', '');
    const found = DEPARTMENT_TABS.find((t) => t.id === path);
    if (found) return found.id;
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && DEPARTMENT_TABS.find((t) => t.id === tabParam)) return tabParam;
    return 'sales';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    } else {
      const path = location.pathname.replace('/', '');
      const found = DEPARTMENT_TABS.find((t) => t.id === path);
      if (found) setActiveTab(found.id);
    }
  }, [location.pathname, defaultTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/${tabId}`);
  };

  const currentTabObj = DEPARTMENT_TABS.find((t) => t.id === activeTab) || DEPARTMENT_TABS[0];
  const ActiveComponent = currentTabObj.component;

  return (
    <div className="space-y-6 pb-12">
      {/* Sleek Department Tab Bar with mobile horizontal scroll */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-2 shadow-sm">
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-700/60 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Departmental Analytics Hub
            </span>
          </div>
          <span className="text-xs font-medium text-slate-400 hidden sm:inline">
            {DEPARTMENT_TABS.length} Integrated Functional Domains
          </span>
        </div>

        <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-2 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          {DEPARTMENT_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap shrink-0 sm:shrink ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 bg-slate-50/50 sm:bg-transparent'
                }`}
              >
                <Icon size={15} className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab View */}
      <div className="animate-fadeIn">
        <ActiveComponent />
      </div>
    </div>
  );
};

export default DepartmentHub;
