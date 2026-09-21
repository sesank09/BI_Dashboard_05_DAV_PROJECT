import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LoginPage } from './pages/LoginPage';
import { ExecutiveDashboard } from './pages/ExecutiveDashboard';
import { DepartmentHub } from './pages/DepartmentHub';
import { IntelligenceHub } from './pages/IntelligenceHub';
import { DataStudioHub } from './pages/DataStudioHub';
import { SettingsPage } from './pages/SettingsPage';

export const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<DashboardLayout />}>
        {/* Core Executive Hub */}
        <Route index element={<ExecutiveDashboard />} />

        {/* Unified Department Analytics Hub & Sub-routes */}
        <Route path="departments" element={<DepartmentHub />} />
        <Route path="sales" element={<DepartmentHub defaultTab="sales" />} />
        <Route path="finance" element={<DepartmentHub defaultTab="finance" />} />
        <Route path="marketing" element={<DepartmentHub defaultTab="marketing" />} />
        <Route path="hr" element={<DepartmentHub defaultTab="hr" />} />
        <Route path="operations" element={<DepartmentHub defaultTab="operations" />} />
        <Route path="customers" element={<DepartmentHub defaultTab="customers" />} />

        {/* Unified AI & Decision Intelligence Suite & Sub-routes */}
        <Route path="intelligence" element={<IntelligenceHub />} />
        <Route path="ml-intelligence" element={<IntelligenceHub defaultTab="ml-intelligence" />} />
        <Route path="simulation" element={<IntelligenceHub defaultTab="simulation" />} />
        <Route path="cross-functional" element={<IntelligenceHub defaultTab="cross-functional" />} />
        <Route path="insights" element={<IntelligenceHub defaultTab="insights" />} />
        <Route path="research" element={<IntelligenceHub defaultTab="research" />} />

        {/* Unified Data Studio, Ingestion & Warehouse Hub & Sub-routes */}
        <Route path="data" element={<DataStudioHub />} />
        <Route path="data-management" element={<DataStudioHub defaultTab="data-management" />} />
        <Route path="data-intelligence" element={<DataStudioHub defaultTab="data-intelligence" />} />
        <Route path="data-quality" element={<DataStudioHub defaultTab="data-intelligence" />} />
        <Route path="etl-monitor" element={<DataStudioHub defaultTab="etl-monitor" />} />
        <Route path="analytics" element={<DataStudioHub defaultTab="analytics" />} />
        <Route path="reports" element={<DataStudioHub defaultTab="reports" />} />

        {/* System Settings & Diagnostics */}
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Wildcard Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
