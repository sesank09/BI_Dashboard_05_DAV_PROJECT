import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, BarChart3, Database, Cpu } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('executive@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      navigate('/');
    } else {
      setError('Invalid email or password.');
    }
  };

  const handleDemoSelect = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Graphic Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-400 text-white font-bold text-2xl shadow-xl shadow-blue-500/20 mb-4">
          BI
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Business Intelligence Dashboards</h2>
        <p className="mt-2 text-sm text-slate-400 font-medium">Organizational Performance Analytics Platform</p>

        {/* Visual Process Flow */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-blue-300 bg-slate-800/80 border border-slate-700 py-2.5 px-4 rounded-xl backdrop-blur-sm shadow-inner">
          <div className="flex items-center gap-1"><Database size={14} /> Data</div>
          <span>→</span>
          <div className="flex items-center gap-1"><Cpu size={14} /> Analytics</div>
          <span>→</span>
          <div className="flex items-center gap-1"><BarChart3 size={14} /> Insights</div>
          <span>→</span>
          <div className="flex items-center gap-1"><ShieldCheck size={14} /> Decisions</div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-slate-800/90 border border-slate-700 py-8 px-4 shadow-2xl rounded-2xl sm:px-10 backdrop-blur-md">
          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300">Email address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="executive@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-[#2563EB] hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign in to Platform'}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Role Selector for Seamless Academic & Review Demo */}
          <div className="mt-6 pt-6 border-t border-slate-700/80">
            <p className="text-xs font-semibold text-slate-400 text-center mb-3">Quick Demo Role Selector:</p>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {[
                { role: 'Executive', email: 'executive@example.com' },
                { role: 'Sales Manager', email: 'sales@example.com' },
                { role: 'Finance Manager', email: 'finance@example.com' },
                { role: 'HR Manager', email: 'hr@example.com' },
                { role: 'Marketing Manager', email: 'marketing@example.com' },
                { role: 'Operations', email: 'operations@example.com' },
              ].map((item) => (
                <button
                  key={item.email}
                  type="button"
                  onClick={() => handleDemoSelect(item.email)}
                  className={`py-1.5 px-2.5 rounded border text-left font-medium transition-colors ${
                    email === item.email
                      ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                      : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {item.role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
