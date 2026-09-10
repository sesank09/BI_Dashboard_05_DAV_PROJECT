import React, { useState } from 'react';
import api from '../services/api';
import { Upload, CheckCircle2, AlertTriangle, FileText, RefreshCw, Database } from 'lucide-react';

export const DataManagementPage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [ingestSuccess, setIngestSuccess] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError('');
      setIngestSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/etl/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload and validate file.');
    } finally {
      setUploading(false);
    }
  };

  const handleIngest = async () => {
    setUploading(true);
    try {
      await api.post('/etl/run');
      setIngestSuccess(true);
    } catch (err) {
      setError('ETL ingestion failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Data Management & Ingestion Upload</h1>
        <p className="text-xs text-slate-500">Upload CSV/Excel data, inspect schema validation, detect nulls & duplicates before loading</p>
      </div>

      {/* File Dropzone */}
      <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-8 text-center shadow-sm hover:border-blue-500 transition-all">
        <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
          <Upload size={24} />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Select CSV or Excel Dataset</h3>
        <p className="text-xs text-slate-500 mt-1">Supports .csv, .xlsx, and .xls organizational files</p>

        <div className="mt-4 flex items-center justify-center gap-3">
          <input
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileChange}
            className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
          {file && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-4 py-2 bg-[#2563EB] hover:bg-blue-600 text-white rounded-lg text-xs font-semibold shadow transition-all flex items-center gap-2"
            >
              {uploading ? <RefreshCw size={14} className="animate-spin" /> : <FileText size={14} />}
              {uploading ? 'Validating...' : 'Validate File'}
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg inline-block">
            {error}
          </div>
        )}
      </div>

      {/* Validation Result */}
      {result && (
        <div className="space-y-6">
          {/* Summary Banner */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={24} className="text-emerald-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Validation Passed for {result.filename}</h3>
                  <p className="text-xs text-slate-500">{result.total_rows} total rows & {result.columns?.length} detected columns</p>
                </div>
              </div>

              <button
                onClick={handleIngest}
                disabled={uploading || ingestSuccess}
                className="px-5 py-2.5 bg-[#0D9488] hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Database size={16} />
                {ingestSuccess ? 'Loaded into Star Schema!' : 'Process & Load to Warehouse'}
              </button>
            </div>

            {/* Warnings */}
            {result.warnings?.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
                {result.warnings.map((w, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-amber-700 font-medium bg-amber-50 px-3 py-1.5 rounded">
                    <AlertTriangle size={14} />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Table Preview */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Dataset Table Preview (First 10 Rows)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    {result.columns?.map((col) => (
                      <th key={col} className="py-2.5 px-3">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {result.preview?.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      {result.columns?.map((col) => (
                        <td key={col} className="py-2.5 px-3 text-slate-700">{String(row[col] ?? '')}</td>
                      ))}
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
