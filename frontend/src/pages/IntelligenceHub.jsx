import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Cpu, Sparkles, GitFork, Lightbulb, BookOpen } from 'lucide-react';
import { MLIntelligencePage } from './MLIntelligencePage';
import { DecisionSimulatorPage } from './DecisionSimulatorPage';
import { CrossFunctionalPage } from './CrossFunctionalPage';
import { InsightsPage } from './InsightsPage';
import { ResearchOverviewPage } from './ResearchOverviewPage';

const INTELLIGENCE_TABS = [
  { id: 'ml-intelligence', label: 'ML Forecast', icon: Cpu, component: MLIntelligencePage, badge: 'MODELS' },
  { id: 'simulation', label: 'What-If Simulator', icon: Sparkles, component: DecisionSimulatorPage, badge: 'WHAT-IF' },
  { id: 'cross-functional', label: 'Fusion Matrix', icon: GitFork, component: CrossFunctionalPage, badge: 'FUSION' },
  { id: 'insights', label: 'Business Insights', icon: Lightbulb, component: InsightsPage, badge: 'AUDIT' },
  { id: 'research', label: 'Research Benchmark', icon: BookOpen, component: ResearchOverviewPage, badge: 'EMPIRICAL' },
];

export const IntelligenceHub = ({ defaultTab }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getInitialTab = () => {
    if (defaultTab) return defaultTab;
    const path = location.pathname.replace('/', '');
    const found = INTELLIGENCE_TABS.find((t) => t.id === path);
    if (found) return found.id;
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && INTELLIGENCE_TABS.find((t) => t.id === tabParam)) return tabParam;
    return 'ml-intelligence';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    } else {
      const path = location.pathname.replace('/', '');
      const found = INTELLIGENCE_TABS.find((t) => t.id === path);
      if (found) setActiveTab(found.id);
    }
  }, [location.pathname, defaultTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/${tabId}`);
  };

  const currentTabObj = INTELLIGENCE_TABS.find((t) => t.id === activeTab) || INTELLIGENCE_TABS[0];
  const ActiveComponent = currentTabObj.component;

  return (
    <div className="space-y-6 pb-12">
      {/* Sleek Intelligence Tab Bar with mobile horizontal scroll */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-2 shadow-sm">
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-700/60 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              ACDIE AI & Predictive Decision Suite
            </span>
          </div>
          <span className="text-xs font-medium text-slate-400 hidden sm:inline">
            5 Advanced Autonomous Intelligence Systems
          </span>
        </div>

        <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-2 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          {INTELLIGENCE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center justify-between gap-2 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap shrink-0 sm:shrink ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-bold'
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
                        ? 'bg-indigo-700 text-indigo-100'
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

export default IntelligenceHub;
