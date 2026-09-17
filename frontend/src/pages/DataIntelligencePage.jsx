import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Database, ShieldCheck, Tag, Upload, RefreshCw, FileText, CheckCircle2, 
  AlertTriangle, ArrowRight, Table, Cpu, HardDrive, Layers
} from 'lucide-react';

export const DataIntelligencePage = () => {
  const [activeTab, setActiveTab] = useState('reliability'); // 'reliability' | 'profiling' | 'mapping' | 'upload'
  const [files, setFiles] = useState([]);
  const [quality, setQuality] = useState(null);
  const [profiles, setProfiles] = useState(null);
  const [mappings, setMappings] = useState(null);
  const [selectedDataset, setSelectedDataset] = useState('sales_data');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  const fetchAllDataIntelligence = async () => {
    setLoading(true);
    try {
      const [filesRes, qualityRes, profileRes, mappingRes] = await Promise.all([
        api.get('/data/files'),
        api.get('/data/quality'),
        api.get('/data/profile'),
        api.get('/data/mapping')
      ]);
      setFiles(filesRes.data || []);
      setQuality(qualityRes.data || null);
      setProfiles(profileRes.data || null);
      setMappings(mappingRes.data || null);
    } catch (err) {
      console.error('Failed to load data intelligence', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDataIntelligence();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadSuccess(null);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('auto_etl', 'true');

    try {
      const res = await api.post('/data/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadSuccess(`Successfully ingested ${file.name} (${res.data.rows} rows, ${res.data.columns} columns) and triggered warehouse ETL.`);
      fetchAllDataIntelligence();
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Data Intelligence & Quality Engine</h1>
          <p className="text-xs text-slate-500">Automated profiling, Proposed Data Reliability Scorecard, and Semantic Schema Mapping</p>
        </div>
        <button
          onClick={fetchAllDataIntelligence}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 shadow-sm"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh Quality Intelligence
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        {[
          { id: 'reliability', label: 'Data Reliability Scorecard', icon: ShieldCheck },
          { id: 'profiling', label: 'Automated Profiler', icon: Table },
          { id: 'mapping', label: 'Semantic Schema Mapping', icon: Tag },
          { id: 'upload', label: 'Input Files & Ingestion', icon: HardDrive }
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

      {/* TAB 1: RELIABILITY SCORECARD */}
      {activeTab === 'reliability' && quality && (
        <div className="space-y-6">
          {/* Overall Warehouse Reliability Banner */}
          <div className="bg-gradient-to-r from-[#123A6D] to-[#2563EB] text-white p-6 rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-6">
            <div>
              <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider block">Enterprise Data Warehouse Quality</span>
              <h2 className="text-2xl font-extrabold mt-1">Proposed Data Reliability Score</h2>
              <p className="text-xs text-blue-100 mt-1 max-w-xl">
                Multi-attribute validation evaluating Completeness (35%), Validity (25%), Uniqueness (20%), Consistency (20%), and Outlier Penalties across all ingested fact tables.
              </p>
            </div>
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl border border-white/20">
              <div className="text-right">
                <span className="text-xs text-blue-200 block uppercase font-semibold">Reliability Index</span>
                <span className="text-3xl font-extrabold">{quality.overall_warehouse_reliability}%</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center font-bold text-lg text-emerald-300">
                A+
              </div>
            </div>
          </div>

          {/* Individual Dataset Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Object.entries(quality.datasets || {}).map(([dsName, d]) => (
              <div key={dsName} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 capitalize">{dsName.replace('_', ' ')}</h3>
                    <span className="text-[11px] text-slate-500">{d.filename}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    d.reliability_score >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {d.reliability_score}% ({d.grade})
                  </span>
                </div>

                <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Rows / Columns:</span>
                    <span className="font-semibold text-slate-800">{d.total_rows?.toLocaleString()} / {d.total_columns}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Completeness:</span>
                    <span className="font-semibold text-emerald-600">{d.dimensions?.completeness_score}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Validity:</span>
                    <span className="font-semibold text-blue-600">{d.dimensions?.validity_score}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Uniqueness:</span>
                    <span className="font-semibold text-purple-600">{d.dimensions?.uniqueness_score}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Consistency:</span>
                    <span className="font-semibold text-teal-600">{d.dimensions?.consistency_score}%</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Outliers: {d.outlier_count || 0} records</span>
                  <span className="text-emerald-700 font-bold">{d.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PROFILING */}
      {activeTab === 'profiling' && profiles && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Automated Structural & Statistical Data Profiler</h3>
              <p className="text-xs text-slate-500">Comprehensive column data types, cardinalities, missing rates, and dispersion</p>
            </div>
            {/* Dataset selector */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
              {Object.keys(profiles).map((name) => (
                <button
                  key={name}
                  onClick={() => setSelectedDataset(name)}
                  className={`px-3 py-1 rounded text-xs font-semibold capitalize transition ${
                    selectedDataset === name ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {name.replace('_data', '')}
                </button>
              ))}
            </div>
          </div>

          {/* Selected dataset profiling table */}
          {profiles[selectedDataset] && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Column Name</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Missing (%)</th>
                    <th className="py-2.5 px-3">Unique Values</th>
                    <th className="py-2.5 px-3">Cardinality</th>
                    <th className="py-2.5 px-3">Summary Metrics / Range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {profiles[selectedDataset].columns?.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{c.column_name}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-blue-700">{c.data_type}</td>
                      <td className="py-2.5 px-3 text-slate-700">{c.missing_count} ({c.missing_pct}%)</td>
                      <td className="py-2.5 px-3 text-slate-800">{c.unique_count?.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-slate-600">{c.cardinality_ratio}</td>
                      <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                        {c.stats?.mean !== undefined
                          ? `mean: ${c.stats.mean} | min: ${c.stats.min} | max: ${c.stats.max}`
                          : (c.stats?.min_date ? `${c.stats.min_date} -> ${c.stats.max_date}` : 'Categorical values')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SEMANTIC SCHEMA MAPPING */}
      {activeTab === 'mapping' && mappings && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Semantic Schema Mapping & Role Classification</h3>
              <p className="text-xs text-slate-500">Heuristic pattern detection mapping raw column aliases to canonical organizational entities</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(mappings).map(([ds, m]) => (
                <div key={ds} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-xs uppercase text-slate-900">{ds.replace('_data', '')} Table</span>
                    <span className="text-[10px] text-slate-500 font-medium">{m.total_columns} columns mapped</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {m.mappings?.map((mapItem, idx) => (
                      <div key={idx} className="p-2 bg-white rounded-lg border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800">{mapItem.original_column}</span>
                          <span className="text-slate-400 font-bold">→</span>
                          <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[10px]">
                            {mapItem.detected_semantic_role}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-tight">{mapItem.reasoning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INPUT FILES & INGESTION */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          {/* Upload Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Dynamic CSV Data Ingestion</h3>
              <p className="text-xs text-slate-500">Upload replacement or supplemental datasets to trigger automated schema mapping and ETL execution.</p>
            </div>

            {uploadSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{uploadSuccess}</span>
              </div>
            )}

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center space-y-3 hover:border-blue-500 transition-colors">
              <Upload size={32} className="mx-auto text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-slate-800">Select or drop custom dataset CSV file</p>
                <p className="text-xs text-slate-400">Supported: sales_data.csv, finance_data.csv, marketing_data.csv, etc.</p>
              </div>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="file-upload-input"
              />
              <label
                htmlFor="file-upload-input"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-sm transition"
              >
                {uploading ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
                <span>{uploading ? "Ingesting & Executing ETL..." : "Upload CSV Dataset"}</span>
              </label>
            </div>
          </div>

          {/* Active Inventory */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Active Input File Inventory (/input)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Filename</th>
                    <th className="py-2.5 px-3">Dataset Name</th>
                    <th className="py-2.5 px-3">File Size</th>
                    <th className="py-2.5 px-3">Last Modified</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {files.map((f, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-800 flex items-center gap-1.5">
                        <FileText size={14} className="text-blue-600" /> {f.filename}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 capitalize">{f.dataset_name}</td>
                      <td className="py-2.5 px-3 text-slate-600">{f.size_kb} KB</td>
                      <td className="py-2.5 px-3 text-slate-500">{f.last_modified}</td>
                      <td className="py-2.5 px-3">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          Loaded
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
