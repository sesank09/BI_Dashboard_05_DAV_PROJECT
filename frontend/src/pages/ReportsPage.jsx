import React, { useState } from 'react';
import { FileSpreadsheet, Download, FileText, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { downloadReport } from '../services/exportService';

export const ReportsPage = () => {
  const [dataset, setDataset] = useState('sales');
  const [downloading, setDownloading] = useState(null); // 'csv' | 'excel' | 'pdf'
  const [statusMessage, setStatusMessage] = useState(null);

  const handleDownload = async (format) => {
    setDownloading(format);
    setStatusMessage(null);
    
    const result = await downloadReport(format, dataset);
    setDownloading(null);
    
    if (result.success) {
      setStatusMessage({
        type: 'success',
        text: `Successfully exported ${dataset.toUpperCase()} report as .${format === 'excel' ? 'xlsx' : format}! Check your downloads.`
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: result.message || `Failed to export ${format.toUpperCase()} report.`
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Executive Reports Export</h1>
          <p className="text-xs text-slate-500">Download formatted CSV, Excel workbooks, and PDF reports for board presentations</p>
        </div>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between gap-2 animate-fadeIn ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
            : 'bg-rose-50 text-rose-800 border border-rose-300'
        }`}>
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle size={16} className="text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button 
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-slate-600 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#123A6D]">
            <FileSpreadsheet size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Step 1: Select Functional Dataset</h3>
            <p className="text-xs text-slate-500">Choose data model table to extract</p>
          </div>
        </div>

        {/* Dataset Selection Pills */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {[
            { id: 'sales', label: 'Sales & Revenue' },
            { id: 'finance', label: 'Finance & P&L' },
            { id: 'marketing', label: 'Marketing ROI' },
            { id: 'hr', label: 'HR Workforce' },
            { id: 'operations', label: 'Operations SLA' }
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => setDataset(d.id)}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                dataset === d.id
                  ? 'bg-[#123A6D] text-white shadow-md shadow-blue-900/20'
                  : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Download Buttons Grid */}
        <div className="pt-4 sm:pt-6 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Step 2: Choose Export Format</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* CSV Card */}
            <div className="p-4 sm:p-5 border border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50/20 transition-all flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 uppercase">Raw CSV Export</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FileText size={18} />
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Raw comma-separated dataset with all schema columns for SQL loaders & external analysis.
                </p>
              </div>
              <button
                onClick={() => handleDownload('csv')}
                disabled={downloading !== null}
                className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {downloading === 'csv' ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
                {downloading === 'csv' ? 'Generating CSV...' : 'Download .CSV'}
              </button>
            </div>

            {/* Excel Card */}
            <div className="p-4 sm:p-5 border border-slate-200 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50/20 transition-all flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 uppercase">Excel Workbook (.XLSX)</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <FileSpreadsheet size={18} />
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Formatted Microsoft Excel spreadsheet with structured column types and sheet labels.
                </p>
              </div>
              <button
                onClick={() => handleDownload('excel')}
                disabled={downloading !== null}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {downloading === 'excel' ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
                {downloading === 'excel' ? 'Generating Excel...' : 'Download .XLSX'}
              </button>
            </div>

            {/* PDF Card */}
            <div className="p-4 sm:p-5 border border-slate-200 rounded-2xl hover:border-purple-500 hover:bg-purple-50/20 transition-all flex flex-col justify-between space-y-4 sm:col-span-2 lg:col-span-1">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 uppercase">PDF Board Report</span>
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <FileText size={18} />
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Executive PDF document with formatted table styling suitable for presentations.
                </p>
              </div>
              <button
                onClick={() => handleDownload('pdf')}
                disabled={downloading !== null}
                className="w-full py-2.5 px-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition shadow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {downloading === 'pdf' ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
                {downloading === 'pdf' ? 'Generating PDF...' : 'Download .PDF'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
