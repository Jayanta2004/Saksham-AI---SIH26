import React, { useState, useEffect } from 'react';
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
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { skillService } from '../../services/skillService';

export default function MyProgress() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [readiness, setReadiness] = useState(0);
  const [userStats, setUserStats] = useState({
    courses_completed: 0,
    learning_hours: 0,
    assessments_passed: 0,
    certificates_earned: 0
  });
  const [trajectoryData, setTrajectoryData] = useState([
    { month: 'Month 1', score: 0 },
    { month: 'Month 2', score: 0 },
    { month: 'Month 3', score: 0 },
    { month: 'Current', score: 0 }
  ]);
  const [hoursData, setHoursData] = useState([
    { month: 'Jun', hours: 0 },
    { month: 'Jul', hours: 0 },
    { month: 'Aug', hours: 0 },
    { month: 'Sep', hours: 0 }
  ]);

  useEffect(() => {
    let isMounted = true;
    const fetchProgress = async () => {
      setLoading(true);
      try {
        const [compData, statsData, trajData] = await Promise.all([
          skillService.getUserCompetencies().catch(() => null),
          skillService.getUserStats().catch(() => null),
          skillService.getUserTrajectory().catch(() => null)
        ]);

        if (isMounted) {
          if (compData) {
            setReadiness(compData.readiness_percentage || 0);
          }
          if (statsData) {
            setUserStats(statsData);
          }
          if (trajData) {
            if (trajData.competency_trajectory) setTrajectoryData(trajData.competency_trajectory);
            if (trajData.monthly_hours) setHoursData(trajData.monthly_hours);
          }
        }
      } catch (err) {
        console.warn('Progress fetch error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProgress();
    return () => { isMounted = false; };
  }, [user]);

  const summaryMetrics = [
    { label: 'Overall Readiness', value: `${readiness}%`, note: 'Current benchmark readiness' },
    { label: 'Total Learning Hours', value: `${userStats.learning_hours || 0} hrs`, note: 'Official hours tracked' },
    { label: 'Completed Modules', value: `${userStats.courses_completed || 0} Modules`, note: 'Verified completions' },
    { label: 'Assessments Passed', value: `${userStats.assessments_passed || 0} Passed`, note: 'Diagnostic evaluations' }
  ];

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-sm text-slate-600">Loading progress trajectory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="font-headline text-xl font-bold text-slate-900">Capability Growth &amp; Progress</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Track your monthly learning hours, overall skill growth, and competency progress trajectory.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryMetrics.map((item, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1 hover:border-blue-500/40 transition-all"
          >
            <p className="text-xs font-semibold text-slate-600">{item.label}</p>
            <p className="text-2xl font-bold font-mono text-slate-900">{item.value}</p>
            <p className="text-xs text-slate-500">{item.note}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competency Trajectory (Area Chart) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="font-headline text-base font-bold text-slate-900">
              Competency Growth Trajectory
            </h2>
            <p className="text-xs text-slate-600">
              Evolution of overall readiness percentage over assessment cycles
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trajectoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.25} vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090D16',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px'
                  }}
                  formatter={(val) => [`${val}%`, 'Readiness']}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#06B6D4"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#growthGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Learning Hours (Bar Chart) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="font-headline text-base font-bold text-slate-900">Monthly Learning Hours</h2>
            <p className="text-xs text-slate-600">
              Time invested in e-learning courses &amp; diagnostic assessment exercises
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.25} vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090D16',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px'
                  }}
                  formatter={(val) => [`${val} hrs`, 'Learning Time']}
                />
                <Bar
                  dataKey="hours"
                  fill="#3B82F6"
                  radius={[6, 6, 0, 0]}
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
