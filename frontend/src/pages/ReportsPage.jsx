import React, { useState } from 'react';
import { FileSpreadsheet, Download, FileText, CheckCircle2 } from 'lucide-react';

export const ReportsPage = () => {
  const [dataset, setDataset] = useState('sales');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Reports Export</h1>
        <p className="text-xs text-slate-500">Download formatted CSV, Excel workbooks, and PDF reports for board presentations</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <FileSpreadsheet size={24} className="text-[#123A6D]" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">Select Dataset for Export</h3>
            <p className="text-xs text-slate-500">Choose dataset model to export</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {['sales', 'finance', 'hr', 'marketing', 'operations'].map((d) => (
            <button
              key={d}
              onClick={() => setDataset(d)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                dataset === d
                  ? 'bg-[#123A6D] text-white shadow'
                  : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {d} Fact Table
            </button>
          ))}
        </div>

        {/* Download Buttons */}
        <div className="pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href={`http://localhost:8000/api/export/csv?dataset=${dataset}`}
            download
            className="p-5 border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50/30 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-900 uppercase">Raw CSV Export</span>
              <FileText className="text-blue-600" size={20} />
            </div>
            <p className="text-xs text-slate-500 mb-4">Standard comma-separated dataset suitable for SQL loaders & R/Python analytics.</p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600">
              <Download size={14} /> Download .CSV
            </span>
          </a>

          <a
            href={`http://localhost:8000/api/export/excel?dataset=${dataset}`}
            download
            className="p-5 border border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/30 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-900 uppercase">Excel Workbook (.XLSX)</span>
              <FileSpreadsheet className="text-emerald-600" size={20} />
            </div>
            <p className="text-xs text-slate-500 mb-4">Formatted multi-sheet Microsoft Excel report with column headers & numeric types.</p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
              <Download size={14} /> Download .XLSX
            </span>
          </a>

          <a
            href={`http://localhost:8000/api/export/pdf?dataset=${dataset}`}
            download
            className="p-5 border border-slate-200 rounded-xl hover:border-purple-500 hover:bg-purple-50/30 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-900 uppercase">PDF Board Report</span>
              <FileText className="text-purple-600" size={20} />
            </div>
            <p className="text-xs text-slate-500 mb-4">Print-ready document generated via ReportLab with executive headers & tables.</p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-600">
              <Download size={14} /> Download .PDF
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};
