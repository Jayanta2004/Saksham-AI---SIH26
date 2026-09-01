import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Award,
  ArrowRight,
  Loader2,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { skillService } from '../../services/skillService';

const DEFAULT_MOSPI_RADAR = [
  { domain: 'Survey Sampling', current: 2.2, benchmark: 3.5, fullMark: 5 },
  { domain: 'National Accounts', current: 2.8, benchmark: 4.0, fullMark: 5 },
  { domain: 'Price Indices', current: 3.5, benchmark: 4.0, fullMark: 5 },
  { domain: 'Python/R Stats', current: 2.4, benchmark: 4.0, fullMark: 5 },
  { domain: 'AI in Microdata', current: 1.6, benchmark: 3.0, fullMark: 5 },
  { domain: 'DPDPA Governance', current: 3.8, benchmark: 4.0, fullMark: 5 },
  { domain: 'Policy Advisory', current: 2.9, benchmark: 3.0, fullMark: 5 }
];

export default function LearnerDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [readiness, setReadiness] = useState(74.9);
  const [readinessLabel, setReadinessLabel] = useState('Moderate Gap - Upskilling Recommended');
  const [radarData, setRadarData] = useState(DEFAULT_MOSPI_RADAR);
  const [skillGaps, setSkillGaps] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [userStats, setUserStats] = useState({
    courses_completed: 0,
    learning_hours: 0,
    assessments_passed: 0,
    certificates_earned: 0
  });

  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const [compData, statsData] = await Promise.all([
          skillService.getUserCompetencies().catch(() => null),
          skillService.getUserStats().catch(() => null)
        ]);

        if (isMounted) {
          if (compData) {
            setReadiness(compData.readiness_percentage || 74.9);
            setReadinessLabel(compData.readiness_label || 'Moderate Gap - Upskilling Recommended');
            
            if (compData.radar_chart && Array.isArray(compData.radar_chart)) {
              setRadarData(compData.radar_chart);
            }

            if (compData.competency_breakdown && Array.isArray(compData.competency_breakdown)) {
              const gaps = compData.competency_breakdown
                .filter((c) => c.gap > 0)
                .sort((a, b) => b.gap - a.gap)
                .slice(0, 3)
                .map((g, idx) => ({
                  id: `gap_${idx}`,
                  skill: g.name,
                  category: g.name,
                  current: g.current_level,
                  required: g.required_level,
                  priority: g.gap >= 1.0 ? 'High' : g.gap >= 0.5 ? 'Medium' : 'Low'
                }));
              setSkillGaps(gaps);
            }

            if (compData.recommended_pathway && Array.isArray(compData.recommended_pathway)) {
              setRecommendedCourses(compData.recommended_pathway);
            }
          }

          if (statsData) {
            setUserStats(statsData);
          }
        }
      } catch (err) {
        console.warn('Dashboard fetch error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboard();
    return () => { isMounted = false; };
  }, [user]);

  const firstName = user?.full_name
    ? user.full_name.split(' ')[0]
    : user?.name
    ? user.name.split(' ')[0]
    : user?.email?.split('@')[0] || 'Officer';

  const statCards = [
    {
      label: 'Courses Enrolled',
      value: userStats.courses_completed ?? 0,
      unit: 'modules',
      icon: BookOpen,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Learning Hours',
      value: userStats.learning_hours ?? 0,
      unit: 'hrs logged',
      icon: Clock,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      label: 'Assessments Passed',
      value: userStats.assessments_passed ?? 0,
      unit: 'passed',
      icon: CheckCircle2,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      label: 'Verified Credentials',
      value: userStats.certificates_earned ?? 0,
      unit: 'certificates',
      icon: Award,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-500">Loading your statistical competency profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Welcome Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Welcome back, {firstName}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {user?.designation || 'Statistical Officer'} • {user?.department || 'Ministry of Statistics & Programme Implementation'}
          </p>
        </div>
        <div className="bg-white border border-gray-200 px-5 py-3 rounded-xl flex items-center gap-3 shadow-sm">
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600 leading-none">
              {readiness}%
            </div>
            <div className="text-xs text-gray-500 font-medium mt-1">Ready for Role</div>
          </div>
        </div>
      </div>

      {/* 2. Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl border border-gray-200 flex items-center justify-between"
            >
              <div>
                <p className="text-xs text-gray-500">{stat.label}</p>
                <div className="flex items-baseline gap-1.5 mt-1.5">
                  <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                  <span className="text-xs text-gray-400 font-medium">{stat.unit}</span>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.iconBg}`}>
                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Middle Section: Radar Chart + Skill Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart (col-span-7) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-gray-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Competency Overview</h2>
                <p className="text-xs text-gray-500 mt-0.5">Your current skills vs {user?.designation || 'Role'} target benchmarks</p>
              </div>
              <Link to="/skills" className="text-xs text-blue-600 font-medium hover:underline">
                Full Breakdown →
              </Link>
            </div>

            <div className="h-72 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="75%">
                  <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                  <PolarAngleAxis
                    dataKey="domain"
                    tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 5]}
                    tick={{ fill: '#94a3b8', fontSize: 9 }}
                  />
                  <Radar
                    name="Current Level"
                    dataKey="current"
                    stroke="#2563eb"
                    fill="#3b82f6"
                    fillOpacity={0.4}
                  />
                  <Radar
                    name="Target Benchmark"
                    dataKey="benchmark"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.05}
                    strokeDasharray="4 4"
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 pt-3 border-t border-gray-100 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
              <span>Current Score (Out of 5.0)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 border-t-2 border-dashed border-amber-500 inline-block" />
              <span>Role Benchmark Target</span>
            </div>
          </div>
        </div>

        {/* Top Skill Gaps (col-span-5) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-gray-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Top Priority Skill Gaps</h2>
                <p className="text-xs text-gray-500 mt-0.5">Calculated by Deficit Score</p>
              </div>
              <Link to="/skill-gap" className="text-xs text-blue-600 font-medium hover:underline">
                View all →
              </Link>
            </div>

            <div className="divide-y divide-gray-100 mt-4">
              {skillGaps.length > 0 ? (
                skillGaps.map((gap, idx) => {
                  const percent = Math.min(100, Math.round((gap.current / (gap.required || 4.0)) * 100));
                  const badgeColors = {
                    High: 'bg-red-50 text-red-700 border-red-200',
                    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
                    Low: 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  };

                  return (
                    <div key={idx} className="py-3.5 first:pt-0 last:pb-0 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-gray-800 truncate">{gap.skill}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium border shrink-0 ${
                            badgeColors[gap.priority] || badgeColors.Medium
                          }`}
                        >
                          {gap.priority} Priority
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-gray-500">
                        <span>Current: {gap.current} / {gap.required}</span>
                        <span>{percent}% Ready</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-400 text-xs">
                  All statistical competencies are currently on target!
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-gray-100">
            <Link
              to="/assessments"
              className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <span>Take Diagnostic Assessment for +Delta Score</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Recommended Courses Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Recommended Learning Pathways</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Personalized modules from iGOT Karmayogi & NSSTA mapped to your skill gaps
            </p>
          </div>
          <Link
            to="/courses"
            className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1"
          >
            <span>Browse All Courses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recommendedCourses.slice(0, 3).map((course, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-sm transition space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {course.provider || 'iGOT Karmayogi'}
                  </span>
                  <span className="text-[11px] text-gray-500 font-mono">
                    {course.duration_hours ? `${course.duration_hours} hrs` : 'Self-paced'}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-gray-900 leading-snug">
                  {course.title}
                </h3>

                <p className="text-xs text-gray-500 italic leading-relaxed">
                  Target Competency: <strong className="text-gray-700">{course.target_competency}</strong>
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <Link
                  to="/courses/crs_igot_01"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center transition"
                >
                  Start Learning
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
