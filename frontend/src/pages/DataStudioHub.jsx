import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Upload, ShieldCheck, RefreshCw, LineChart, FileSpreadsheet } from 'lucide-react';
import { DataManagementPage } from './DataManagementPage';
import { DataIntelligencePage } from './DataIntelligencePage';
import { ETLMonitorPage } from './ETLMonitorPage';
import { AnalyticsPage } from './AnalyticsPage';
import { ReportsPage } from './ReportsPage';

const DATA_TABS = [
  { id: 'data-management', label: 'Upload & Test Scenarios', icon: Upload, component: DataManagementPage, badge: 'INGEST' },
  { id: 'data-intelligence', label: 'Quality & Health', icon: ShieldCheck, component: DataIntelligencePage, badge: 'HEALTH' },
  { id: 'etl-monitor', label: 'ETL Warehouse', icon: RefreshCw, component: ETLMonitorPage, badge: 'WAREHOUSE' },
  { id: 'analytics', label: 'Exploratory EDA', icon: LineChart, component: AnalyticsPage, badge: 'STATS' },
  { id: 'reports', label: 'Export Reports', icon: FileSpreadsheet, component: ReportsPage, badge: 'DOWNLOAD' },
];

export const DataStudioHub = ({ defaultTab }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getInitialTab = () => {
    if (defaultTab) return defaultTab;
    const path = location.pathname.replace('/', '');
    const found = DATA_TABS.find((t) => t.id === path);
    if (found) return found.id;
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && DATA_TABS.find((t) => t.id === tabParam)) return tabParam;
    return 'data-management';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    } else {
      const path = location.pathname.replace('/', '');
      const found = DATA_TABS.find((t) => t.id === path);
      if (found) setActiveTab(found.id);
    }
  }, [location.pathname, defaultTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/${tabId}`);
  };

  const currentTabObj = DATA_TABS.find((t) => t.id === activeTab) || DATA_TABS[0];
  const ActiveComponent = currentTabObj.component;

  return (
    <div className="space-y-6 pb-12">
      {/* Sleek Data Studio Tab Bar with mobile horizontal scroll */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-2 shadow-sm">
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-700/60 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Data Studio & Warehouse Operations
            </span>
          </div>
          <span className="text-xs font-medium text-slate-400 hidden sm:inline">
            End-to-End Star Schema Data Pipeline
          </span>
        </div>

        <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-2 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          {DATA_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center justify-between gap-2 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap shrink-0 sm:shrink ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 bg-slate-50/50 sm:bg-transparent'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Icon size={15} className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </div>
                {tab.badge && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold hidden md:inline-block ${
                      isActive
                        ? 'bg-teal-700 text-teal-100'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
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

export default DataStudioHub;
