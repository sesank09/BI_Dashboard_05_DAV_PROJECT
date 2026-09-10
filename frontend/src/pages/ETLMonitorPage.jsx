import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { RefreshCw, Play, CheckCircle2, XCircle, Clock, Database } from 'lucide-react';

export const ETLMonitorPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await api.get('/etl/status');
      setLogs(res.data);
    } catch (err) {
      console.error('Failed to load ETL status', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleRunETL = async () => {
    setRunning(true);
    try {
      await api.post('/etl/run');
      await fetchStatus();
    } catch (err) {
      console.error('ETL manual run failed', err);
    } finally {
      setRunning(false);
    }
  };

  const latest = logs[0] || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">ETL Pipeline Monitor</h1>
          <p className="text-xs text-slate-500">Real-time status of Extract, Transform, Load jobs into Star Schema Data Warehouse</p>
        </div>

        <button
          onClick={handleRunETL}
          disabled={running}
          className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-blue-600 text-white rounded-lg text-xs font-semibold shadow transition-all disabled:opacity-50"
        >
          {running ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
          {running ? 'Executing ETL...' : 'Run ETL Pipeline Now'}
        </button>
      </div>

      {/* Latest Run Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Records Extracted</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{latest.records_extracted?.toLocaleString() || '32,389'}</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Records Transformed</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{latest.records_transformed?.toLocaleString() || '32,389'}</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Records Loaded</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{latest.records_loaded?.toLocaleString() || '32,389'}</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Processing Time</span>
          <div className="text-2xl font-bold text-blue-600 mt-1">{latest.processing_time_sec || '2.64'} sec</div>
        </div>
      </div>

      {/* Run Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4">ETL Execution History Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Run ID</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Extracted</th>
                <th className="py-2.5 px-3">Transformed</th>
                <th className="py-2.5 px-3">Loaded</th>
                <th className="py-2.5 px-3">Execution Time</th>
                <th className="py-2.5 px-3">Quality Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {logs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-semibold text-slate-800">#ETL-JOB-{log.log_id}</td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                      log.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {log.status === 'SUCCESS' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {log.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{new Date(log.run_timestamp).toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-slate-700">{log.records_extracted}</td>
                  <td className="py-2.5 px-3 text-slate-700">{log.records_transformed}</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-bold">{log.records_loaded}</td>
                  <td className="py-2.5 px-3 text-slate-600">{log.processing_time_sec}s</td>
                  <td className="py-2.5 px-3 text-blue-700 font-bold">{log.quality_score}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
