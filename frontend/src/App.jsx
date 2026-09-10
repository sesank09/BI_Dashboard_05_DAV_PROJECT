import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LoginPage } from './pages/LoginPage';
import { ExecutiveDashboard } from './pages/ExecutiveDashboard';
import { SalesDashboard } from './pages/SalesDashboard';
import { FinanceDashboard } from './pages/FinanceDashboard';
import { MarketingDashboard } from './pages/MarketingDashboard';
import { HRDashboard } from './pages/HRDashboard';
import { OperationsDashboard } from './pages/OperationsDashboard';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { CustomerSegmentationPage } from './pages/CustomerSegmentationPage';
import { DataManagementPage } from './pages/DataManagementPage';
import { ETLMonitorPage } from './pages/ETLMonitorPage';
import { DataQualityPage } from './pages/DataQualityPage';
import { InsightsPage } from './pages/InsightsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<ExecutiveDashboard />} />
        <Route path="sales" element={<SalesDashboard />} />
        <Route path="finance" element={<FinanceDashboard />} />
        <Route path="marketing" element={<MarketingDashboard />} />
        <Route path="hr" element={<HRDashboard />} />
        <Route path="operations" element={<OperationsDashboard />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="customers" element={<CustomerSegmentationPage />} />
        <Route path="data-management" element={<DataManagementPage />} />
        <Route path="etl-monitor" element={<ETLMonitorPage />} />
        <Route path="data-quality" element={<DataQualityPage />} />
        <Route path="insights" element={<InsightsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
