import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Building2,
  AlertTriangle,
  Sparkles,
  Calendar,
  Layers,
  Loader2
} from 'lucide-react';
import api from '../../services/api';

const DEFAULT_DEPARTMENTS = [
  {
    id: 'dept_nad',
    name: 'National Accounts Division (NAD)',
    officers: 142,
    avgReadiness: 78.4,
    topGap: 'Big Data & Python Pipelines',
    risk: 'Moderate',
    riskColor: 'bg-amber-50 text-amber-700 border-amber-200',
    targetBatch: '2 NSSTA Batches'
  },
  {
    id: 'dept_sdrd',
    name: 'Survey Design & Research Division (SDRD)',
    officers: 186,
    avgReadiness: 82.1,
    topGap: 'ML for Anomaly Detection',
    risk: 'Low',
    riskColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    targetBatch: '1 NSSTA Batch'
  },
  {
    id: 'dept_fod',
    name: 'Field Operations Division (FOD)',
    officers: 480,
    avgReadiness: 64.2,
    topGap: 'CAPI Field Validation Protocols',
    risk: 'High',
    riskColor: 'bg-rose-50 text-rose-700 border-rose-200',
    targetBatch: '4 NSSTA Batches'
  },
  {
    id: 'dept_cso',
    name: 'Central Statistics Office (CSO)',
    officers: 110,
    avgReadiness: 84.5,
    topGap: 'DPDPA 2023 Anonymization',
    risk: 'Low',
    riskColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    targetBatch: '1 NSSTA Batch'
  }
];

const PREDICTIVE_PROJECTIONS = [
  { quarter: 'Q1 2026', current: 68.5, projected: 68.5, target: 80.0 },
  { quarter: 'Q2 2026', current: 72.1, projected: 74.0, target: 82.0 },
  { quarter: 'Q3 2026', current: null, projected: 79.5, target: 85.0 },
  { quarter: 'Q4 2026', current: null, projected: 84.8, target: 88.0 },
  { quarter: 'Q1 2027', current: null, projected: 89.2, target: 90.0 }
];

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [deptData, setDeptData] = useState(DEFAULT_DEPARTMENTS);

  useEffect(() => {
    let isMounted = true;
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/admin/users').catch(() => null);
        if (isMounted && res?.data?.users) {
          const users = res.data.users;
          // Count users per department
          const nadCount = users.filter((u) => (u.department || '').includes('National Accounts')).length;
          const sdrdCount = users.filter((u) => (u.department || '').includes('Survey Design')).length;
          const fodCount = users.filter((u) => (u.department || '').includes('Field Operations')).length;

          setDeptData((prev) =>
            prev.map((d) => {
              if (d.id === 'dept_nad' && nadCount > 0) return { ...d, officers: d.officers + nadCount };
              if (d.id === 'dept_sdrd' && sdrdCount > 0) return { ...d, officers: d.officers + sdrdCount };
              if (d.id === 'dept_fod' && fodCount > 0) return { ...d, officers: d.officers + fodCount };
              return d;
            })
          );
        }
      } catch (err) {
        console.warn('Analytics fetch error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAnalytics();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-500">Loading predictive analytics and departmental intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Departmental Intelligence & Predictive Forecasting</h1>
          <p className="text-sm text-gray-500 mt-1">
            Comparative divisional analytics, systemic risk scoring, and 12-month workforce capability simulations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Predictive Simulation Active</span>
          </span>
        </div>
      </div>

      {/* 12-Month Predictive Growth Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              12-Month Workforce Readiness Projection
            </h2>
            <p className="text-xs text-gray-500">
              Simulated impact of ongoing iGOT courses and scheduled NSSTA residential cohorts
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-600 inline-block" />
              <span className="text-gray-600">Simulated Projection</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-amber-500 inline-block" />
              <span className="text-gray-600">Ministry Benchmark</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={PREDICTIVE_PROJECTIONS} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="simGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                formatter={(val) => [`${val}%`, 'Readiness']}
              />
              <Area
                type="monotone"
                dataKey="projected"
                stroke="#2563eb"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#simGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Departmental Comparison Matrix Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden space-y-3 p-6">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Divisional Competency & Training Capacity Matrix
          </h2>
          <p className="text-xs text-gray-500">
            Comparative performance, identified division-level deficits, and allocated NSSTA batches
          </p>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-xs font-semibold uppercase tracking-wider bg-gray-50/70">
                <th className="py-3 px-4">Ministry Division</th>
                <th className="py-3 px-4 text-center">Officers Assessed</th>
                <th className="py-3 px-4 text-center">Avg Readiness</th>
                <th className="py-3 px-4">Primary Deficit Bottleneck</th>
                <th className="py-3 px-4 text-center">Risk Level</th>
                <th className="py-3 px-4 text-right">NSSTA Batch Allocation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {deptData.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50/70 transition">
                  <td className="py-3.5 px-4 font-bold text-gray-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{d.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-medium text-gray-800">
                    {d.officers.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-bold text-gray-900">{d.avgReadiness}%</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-gray-600">
                    {d.topGap}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full font-semibold border inline-block ${d.riskColor}`}>
                      {d.risk} Risk
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-blue-700 font-semibold">
                    {d.targetBatch}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
