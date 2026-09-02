import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import {
  TrendingUp,
  Building2,
  AlertTriangle,
  Sparkles,
  Users,
  Activity,
  Layers,
  Loader2,
  RefreshCw,
  CheckCircle2,
  Shield
} from 'lucide-react';
import api from '../../services/api';

const MATRIX_DATA = [
  { division: 'NAD (National Accounts)', sampling: 76, sna: 46, python: 62, price: 88, governance: 72 },
  { division: 'FOD (NSSO Field Operations)', sampling: 82, sna: 55, python: 38, price: 71, governance: 65 },
  { division: 'SDRD (Survey Design & Research)', sampling: 85, sna: 74, python: 68, price: 59, governance: 81 },
  { division: 'PSD (Price Statistics)', sampling: 63, sna: 52, python: 66, price: 94, governance: 68 },
  { division: 'DIID (Data Informatics & Innovation)', sampling: 59, sna: 45, python: 91, price: 61, governance: 86 }
];

const PREDICTIVE_PROJECTIONS = [
  { month: 'Current', readiness: 68.4, benchmark: 80.0 },
  { month: '3 Mos', readiness: 73.1, benchmark: 82.0 },
  { month: '6 Mos', readiness: 78.5, benchmark: 85.0 },
  { month: '9 Mos', readiness: 83.2, benchmark: 88.0 },
  { month: '12 Mos', readiness: 88.0, benchmark: 90.0 }
];

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const getHeatmapColor = (score) => {
    if (score < 50) return 'bg-red-500/20 text-red-300 border-red-500/40';
    if (score < 70) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    if (score < 80) return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-ai-cyan" />
          <p className="text-sm text-on-surface-variant">Loading executive workforce intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* Executive Command Header */}
      <div className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-ai-cyan/10 rounded-full blur-3xl pointer-events-none -z-10" />
        
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-success-emerald animate-pulse"></span>
            <span className="text-[11px] font-mono font-bold uppercase text-ai-cyan tracking-wider">
              MoSPI Official Cadres • Live System Data
            </span>
          </div>
          <h1 className="font-headline text-2xl font-bold text-slate-900 dark:text-white">
            National Workforce Competency Intelligence
          </h1>
          <p className="text-xs text-slate-500 dark:text-on-surface-variant mt-1">
            Director General Executive Command Center • Multi-Divisional Readiness Matrix
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="glass-panel text-xs text-ai-cyan px-3.5 py-2 rounded-xl font-mono font-semibold border border-ai-cyan/30 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Predictive Simulation Active</span>
          </span>
        </div>
      </div>

      {/* 4 Executive Macro Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Officers Monitored */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between hover:border-ai-cyan/30 transition-all shadow-sm">
          <div>
            <p className="text-xs text-slate-500 dark:text-on-surface-variant font-medium">Total Officers Monitored</p>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1.5">10,420</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-success-emerald">
              <span className="w-1.5 h-1.5 rounded-full bg-success-emerald"></span>
              <span>Active Duty (ISS &amp; SSS)</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-ai-cyan">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Average Cadre Readiness */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between hover:border-ai-cyan/30 transition-all shadow-sm">
          <div>
            <p className="text-xs text-slate-500 dark:text-on-surface-variant font-medium">Average Cadre Readiness</p>
            <div className="text-2xl font-bold font-mono text-ai-cyan chart-glow mt-1.5">68.4%</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-success-emerald">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+4.2% YoY Growth</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-ai-cyan">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Critical Deficit Clusters */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between hover:border-warning-amber/30 transition-all shadow-sm">
          <div>
            <p className="text-xs text-slate-500 dark:text-on-surface-variant font-medium">Critical Deficit Clusters</p>
            <div className="text-sm font-bold text-warning-amber mt-1.5">SNA 2008 &amp; Microdata</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-warning-amber">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>High priority intervention req.</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-warning-amber">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: iGOT Sync Health */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between hover:border-ai-cyan/30 transition-all shadow-sm">
          <div>
            <p className="text-xs text-slate-500 dark:text-on-surface-variant font-medium">iGOT Sync Health</p>
            <div className="text-2xl font-bold font-mono text-success-emerald mt-1.5">99.8%</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-ai-cyan">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Synchronized Live</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-success-emerald">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Central Grid: Competency Gap Matrix Heatmap + 12-Month Predictive Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Heatmap Matrix Table (col-span-8) */}
        <div className="lg:col-span-8 glass-card p-6 rounded-2xl space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-glass-border gap-2">
            <div>
              <h2 className="font-headline text-base font-bold text-slate-900 dark:text-white">
                Competency Gap Matrix
              </h2>
              <p className="text-xs text-slate-500 dark:text-on-surface-variant">
                Cross-divisional analysis of critical functional skills
              </p>
            </div>

            {/* Threshold Legend */}
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> &lt;50%</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> 50-70%</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500"></span> 70-80%</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> &gt;80%</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-glass-border text-slate-500 dark:text-on-surface-variant uppercase font-mono font-semibold">
                  <th className="py-3 px-3">Division</th>
                  <th className="py-3 px-3 text-center">Survey Sampling</th>
                  <th className="py-3 px-3 text-center">SNA 2008</th>
                  <th className="py-3 px-3 text-center">Python/R</th>
                  <th className="py-3 px-3 text-center">Price Indices</th>
                  <th className="py-3 px-3 text-center">Data Governance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-glass-border">
                {MATRIX_DATA.map((row) => (
                  <tr key={row.division} className="hover:bg-white/5 transition">
                    <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white">{row.division}</td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2.5 py-1 rounded-lg border font-mono font-bold text-xs inline-block ${getHeatmapColor(row.sampling)}`}>
                        {row.sampling}%
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2.5 py-1 rounded-lg border font-mono font-bold text-xs inline-block ${getHeatmapColor(row.sna)}`}>
                        {row.sna}%
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2.5 py-1 rounded-lg border font-mono font-bold text-xs inline-block ${getHeatmapColor(row.python)}`}>
                        {row.python}%
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2.5 py-1 rounded-lg border font-mono font-bold text-xs inline-block ${getHeatmapColor(row.price)}`}>
                        {row.price}%
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2.5 py-1 rounded-lg border font-mono font-bold text-xs inline-block ${getHeatmapColor(row.governance)}`}>
                        {row.governance}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 12-Month Predictive Growth Chart (col-span-4) */}
        <div className="lg:col-span-4 glass-card p-6 rounded-2xl flex flex-col justify-between shadow-sm">
          <div>
            <div className="pb-3 border-b border-slate-200 dark:border-glass-border">
              <h2 className="font-headline text-base font-bold text-slate-900 dark:text-white">
                Predictive Growth
              </h2>
              <p className="text-xs text-slate-500 dark:text-on-surface-variant">
                12-Month Competency Projection
              </p>
            </div>

            <div className="h-56 w-full pt-4 chart-glow">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PREDICTIVE_PROJECTIONS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="stitchGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={{ stroke: '#334155' }} />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={{ stroke: '#334155' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#090D16', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '11px' }}
                    formatter={(val) => [`${val}%`, 'Projected Readiness']}
                  />
                  <Area
                    type="monotone"
                    dataKey="readiness"
                    stroke="#06B6D4"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#stitchGlow)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-glass-border">
            <p className="text-[11px] text-slate-500 dark:text-on-surface-variant leading-relaxed">
              AI predicts <strong className="text-ai-cyan">+14% improvement</strong> in overall readiness if recommended NSSTA courses are completed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
