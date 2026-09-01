import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const competencyData = [
  { month: 'Apr', score: 52 },
  { month: 'May', score: 58 },
  { month: 'Jun', score: 63 },
  { month: 'Jul', score: 69 },
  { month: 'Aug', score: 75 },
  { month: 'Sep', score: 82 }
];

const learningHoursData = [
  { month: 'Apr', hours: 14 },
  { month: 'May', hours: 19 },
  { month: 'Jun', hours: 24 },
  { month: 'Jul', hours: 16 },
  { month: 'Aug', hours: 26 },
  { month: 'Sep', hours: 23 }
];

const summaryMetrics = [
  { label: 'Overall Readiness', value: '82%', note: '+12% past 6 months' },
  { label: 'Total Learning Hours', value: '122 hrs', note: 'Avg 20.3 hrs / month' },
  { label: 'Completed Modules', value: '14 of 18', note: '3 modules in progress' },
  { label: 'Competencies Mastered', value: '9 Skills', note: 'Meets cadre benchmarks' }
];

export default function MyProgress() {
  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">My Progress</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track your monthly learning hours, overall skill growth, and competency progress trajectory.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryMetrics.map((item, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-1"
          >
            <p className="text-xs font-medium text-gray-500">{item.label}</p>
            <p className="text-xl font-bold text-gray-900">{item.value}</p>
            <p className="text-xs text-gray-400">{item.note}</p>
          </div>
        ))}
      </div>

      {/* 2 Recharts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competency Trajectory Area Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Competency Trajectory</h2>
            <p className="text-xs text-gray-500">Assessed overall readiness score (%) over time</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={competencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(val) => [`${val}%`, 'Readiness Score']}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#scoreGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Learning Hours Bar Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Monthly Learning Hours</h2>
            <p className="text-xs text-gray-500">Dedicated training & course completion hours</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={learningHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(val) => [`${val} hrs`, 'Learning Hours']}
                />
                <Bar
                  dataKey="hours"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                  barSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
