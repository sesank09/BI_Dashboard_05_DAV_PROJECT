import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import api from '../services/api';
import { 
  Upload, CheckCircle2, AlertTriangle, FileText, RefreshCw, Database, 
  Sparkles, Play, ArrowRight, ShieldCheck, HelpCircle, Layers, TrendingUp, AlertOctagon
} from 'lucide-react';

export const DataManagementPage = () => {
  const [file, setFile] = useState(null);
  const [targetType, setTargetType] = useState('sales');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState('');
  
  const [samples, setSamples] = useState([]);
  const [loadingSample, setLoadingSample] = useState(null);
  const [sampleSuccessMsg, setSampleSuccessMsg] = useState('');

  const fetchSamples = async () => {
    try {
      const res = await api.get('/data/samples');
      setSamples(res.data?.samples || []);
    } catch (err) {
      console.error('Failed to load sample scenarios', err);
    }
  };

  useEffect(() => {
    fetchSamples();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadResult(null);
      setError('');
      setSampleSuccessMsg('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    setSampleSuccessMsg('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_type', targetType);
    formData.append('auto_etl', 'true');

    try {
      const res = await api.post('/data/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload and process file.');
    } finally {
      setUploading(false);
    }
  };

  const handleLoadSample = async (scenarioFilename) => {
    setLoadingSample(scenarioFilename);
    setError('');
    setUploadResult(null);
    setSampleSuccessMsg('');

    try {
      const res = await api.post('/data/load-sample', {
        scenario_filename: scenarioFilename
      });
      setSampleSuccessMsg(`Successfully applied "${scenarioFilename}" to warehouse! Total ${res.data?.etl_summary?.records_processed || 'all'} records processed.`);
    } catch (err) {
      setError(err.response?.data?.detail || `Failed to load sample ${scenarioFilename}`);
    } finally {
      setLoadingSample(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 rounded-2xl border border-blue-500/20 shadow-xl text-white">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              ACDIE Data Ingestion & Pipeline Control
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck size={12} /> 100% Dynamic Synchronization
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dataset Upload & Scenario Testing Lab</h1>
          <p className="text-sm text-slate-300">
            Upload custom CSVs or trigger pre-configured organizational test scenarios to observe real-time recalculations across all dashboards.
          </p>
        </div>
      </div>

      {/* How It Works Guide Box (User-Friendly Explanation) */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
          <HelpCircle size={16} className="text-blue-600 dark:text-blue-400" /> How to Test Dynamic Platform Changes:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-blue-600 dark:text-blue-400 block mb-1">1. Choose a Test Scenario</span>
            <p>Select one of the pre-made sample files below (e.g., Growth Surge or Market Slump) or upload your own CSV dataset.</p>
          </div>
          <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-teal-600 dark:text-teal-400 block mb-1">2. Automatic ETL & Star Schema Sync</span>
            <p>The system ingests the data, recalculates the Data Reliability Scorecard, and refreshes all dimensional tables.</p>
          </div>
          <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-purple-600 dark:text-purple-400 block mb-1">3. Live Decision & Metric Updates</span>
            <p>Check Executive BI, Forecasts, and Cross-Functional Fusion to see values, charts, and decisions adapt dynamically.</p>
          </div>
        </div>
      </div>

      {/* SECTION 1: 1-Click Sample Scenarios Switcher */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" /> Ready-to-Test Scenario Datasets
            </h3>
            <p className="text-xs text-slate-500">
              Test how the ACDIE engine immediately recalculates KPIs, forecasts, and anomalies with 1 click.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">Stored in /sample_upload_csvs/</span>
        </div>

        {sampleSuccessMsg && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{sampleSuccessMsg}</span>
            </div>
            <div className="flex items-center gap-2">
              <NavLink to="/" className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-500 transition">
                View Executive BI ➔
              </NavLink>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {samples.map((s, idx) => (
            <div 
              key={idx} 
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 hover:border-blue-500 transition space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                    {s.badge}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Target: {s.target}</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{s.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{s.impact}</p>
              </div>

              <button
                onClick={() => handleLoadSample(s.filename)}
                disabled={loadingSample === s.filename}
                className="w-full mt-2 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {loadingSample === s.filename ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> Ingesting & Syncing...
                  </>
                ) : (
                  <>
                    <Play size={14} /> Apply Scenario to Pipeline
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Custom CSV Uploader */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Upload size={18} className="text-blue-600 dark:text-blue-400" /> Upload Custom Dataset File
          </h3>
          <p className="text-xs text-slate-500">
            Upload your own CSV file into the star schema warehouse pipeline.
          </p>
        </div>

        {/* Upload Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          
          {/* Target Dataset Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Target Functional Domain:
            </label>
            <select
              value={targetType}
              onChange={(e) => setTargetType(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200"
            >
              <option value="sales">Sales Transactions (sales_data.csv)</option>
              <option value="finance">Finance & P&L (finance_data.csv)</option>
              <option value="marketing">Marketing Campaigns (marketing_data.csv)</option>
              <option value="hr">Workforce & HR (hr_data.csv)</option>
              <option value="operations">Operations & SLA (operations_data.csv)</option>
              <option value="customer">Customer Records (customer_data.csv)</option>
              <option value="product">Product Catalog (product_data.csv)</option>
            </select>
          </div>

          {/* File Input */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select CSV File:
            </label>
            <div className="flex gap-3">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="flex-1 text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 cursor-pointer border border-slate-200 dark:border-slate-700 rounded-xl p-1"
              />
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 disabled:opacity-40"
              >
                {uploading ? <RefreshCw size={14} className="animate-spin" /> : <Database size={14} />}
                {uploading ? 'Processing...' : 'Upload & Sync'}
              </button>
            </div>
          </div>

        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-xl flex items-center gap-2">
            <AlertTriangle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Upload Success Card */}
        {uploadResult && (
          <div className="p-5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 rounded-2xl space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={24} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Upload & Warehouse Sync Complete for {uploadResult.filename}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Mapped to <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{uploadResult.target_mapped}</span> | {uploadResult.rows} rows & {uploadResult.columns} columns processed.
                  </p>
                </div>
              </div>

              {/* Jump Links */}
              <div className="flex flex-wrap gap-2">
                <NavLink to="/" className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-50 transition flex items-center gap-1">
                  Executive BI <ArrowRight size={12} />
                </NavLink>
                <NavLink to="/ml-intelligence" className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-500 transition flex items-center gap-1">
                  Forecasts <ArrowRight size={12} />
                </NavLink>
                <NavLink to="/cross-functional" className="px-3 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-semibold hover:bg-teal-500 transition flex items-center gap-1">
                  Cross-Functional <ArrowRight size={12} />
                </NavLink>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default DataManagementPage;
