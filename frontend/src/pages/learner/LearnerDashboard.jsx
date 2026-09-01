import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Award,
  ArrowRight,
  Loader2
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

const MOCK_DATA = {
  overall_readiness: 78,
  stats: {
    courses_completed: 12,
    learning_hours: 48,
    assessments_passed: 8,
    certificates: 4
  },
  radar_chart: [
    { domain: 'Core Engineering', current: 82, benchmark: 75 },
    { domain: 'System Design', current: 68, benchmark: 80 },
    { domain: 'Cloud & DevOps', current: 74, benchmark: 70 },
    { domain: 'Data Structures', current: 88, benchmark: 85 },
    { domain: 'Database Mgmt', current: 62, benchmark: 75 },
    { domain: 'API Architecture', current: 79, benchmark: 80 }
  ],
  skill_gaps: [
    {
      id: 'g1',
      skill: 'Distributed Systems & Microservices',
      category: 'System Design',
      current: 62,
      required: 85,
      priority: 'High'
    },
    {
      id: 'g2',
      skill: 'PostgreSQL Query Optimization',
      category: 'Database Mgmt',
      current: 65,
      required: 80,
      priority: 'Medium'
    },
    {
      id: 'g3',
      skill: 'Kubernetes & CI/CD Pipelines',
      category: 'Cloud & DevOps',
      current: 70,
      required: 80,
      priority: 'Medium'
    }
  ],
  recommended_pathway: [
    {
      id: 'c1',
      title: 'Scalable Microservices Architecture',
      provider: 'Coursera',
      duration: '6 weeks',
      tag: 'System Design',
      match_score: 94,
      ai_reason: 'Directly addresses your largest skill gap in distributed systems.',
      link: '/learning-pathway'
    },
    {
      id: 'c2',
      title: 'Advanced Database Indexing & Performance',
      provider: 'edX',
      duration: '4 weeks',
      tag: 'Database Mgmt',
      match_score: 89,
      ai_reason: 'Boosts SQL optimization required for your target benchmark.',
      link: '/learning-pathway'
    },
    {
      id: 'c3',
      title: 'Production Kubernetes for Developers',
      provider: 'NPTEL',
      duration: '5 weeks',
      tag: 'Cloud & DevOps',
      match_score: 86,
      ai_reason: 'Closes cloud deployment gaps identified in recent assessment.',
      link: '/learning-pathway'
    }
  ]
};

const LearnerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(MOCK_DATA);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const service = skillService?.getUserCompetencies
          ? skillService
          : skillService?.default;

        if (service?.getUserCompetencies) {
          const response = await service.getUserCompetencies();
          if (response?.data) {
            setDashboardData((prev) => ({
              ...prev,
              ...response.data,
              radar_chart: response.data.radar_chart || prev.radar_chart,
              skill_gaps: response.data.skill_gaps || prev.skill_gaps,
              recommended_pathway: response.data.recommended_pathway || prev.recommended_pathway
            }));
          }
        }
      } catch (err) {
        console.warn('Using fallback competency data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const firstName = user?.full_name
    ? user.full_name.split(' ')[0]
    : user?.name
    ? user.name.split(' ')[0]
    : user?.first_name || 'Learner';

  const statCards = [
    {
      label: 'Courses Completed',
      value: dashboardData.stats?.courses_completed ?? 12,
      unit: 'courses',
      icon: BookOpen,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Learning Hours',
      value: dashboardData.stats?.learning_hours ?? 48,
      unit: 'hrs',
      icon: Clock,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      label: 'Assessments Passed',
      value: dashboardData.stats?.assessments_passed ?? 8,
      unit: 'passed',
      icon: CheckCircle2,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      label: 'Certificates',
      value: dashboardData.stats?.certificates ?? 4,
      unit: 'earned',
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
          <p className="text-sm text-gray-500">Loading your dashboard...</p>
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
          <p className="text-sm text-gray-500 mt-1">Continue your learning journey</p>
        </div>
        <div className="bg-white border border-gray-200 px-5 py-3 rounded-xl flex items-center gap-3 shadow-sm">
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600 leading-none">
              {dashboardData.overall_readiness ?? 78}%
            </div>
            <div className="text-xs text-gray-500 font-medium mt-1">Ready</div>
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

      {/* 3 & 4. Radar Chart & Skill Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart (col-span-7) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-gray-200 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Competency Overview</h2>
            <p className="text-xs text-gray-500 mt-0.5">Your skills vs required benchmarks</p>
          </div>

          <div className="h-72 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={dashboardData.radar_chart} outerRadius="75%">
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis
                  dataKey="domain"
                  tick={{ fill: '#4b5563', fontSize: 11 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: '#9ca3af', fontSize: 10 }}
                />
                <Radar
                  name="Current Level"
                  dataKey="current"
                  stroke="#2563eb"
                  fill="#3b82f6"
                  fillOpacity={0.22}
                />
                <Radar
                  name="Benchmark Target"
                  dataKey="benchmark"
                  stroke="#f97316"
                  strokeDasharray="4 4"
                  fill="#f97316"
                  fillOpacity={0.05}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-gray-600 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-blue-600 inline-block" />
              <span>Current Level</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-0.5 border-t-2 border-dashed border-orange-500 inline-block" />
              <span>Benchmark Target</span>
            </div>
          </div>
        </div>

        {/* Skill Gaps (col-span-5) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-gray-200 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Top Skill Gaps</h2>
            <p className="text-xs text-gray-500 mt-0.5">High priority areas to focus</p>

            <div className="mt-4 space-y-3.5">
              {dashboardData.skill_gaps.slice(0, 3).map((gap) => {
                const percentage = Math.min(100, Math.round((gap.current / gap.required) * 100));
                const priorityStyles = {
                  High: 'bg-red-50 text-red-700 border-red-200',
                  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
                  Low: 'bg-emerald-50 text-emerald-700 border-emerald-200'
                };
                const badgeStyle = priorityStyles[gap.priority] || priorityStyles.Medium;

                return (
                  <div
                    key={gap.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-medium text-gray-800 leading-snug">
                        {gap.skill}
                      </span>
                      <span className={`text-[11px] px-2 py-0.5 rounded border font-medium whitespace-nowrap ${badgeStyle}`}>
                        {gap.priority}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Score: {gap.current}/{gap.required}</span>
                      <span>{percentage}%</span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 mt-4">
            <Link
              to="/skill-gap"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1.5"
            >
              View all skill gaps <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 5. Recommended Courses */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-5">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Recommended for You</h2>
          <p className="text-xs text-gray-500 mt-0.5">AI-curated learning resources tailored to your skill gaps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {dashboardData.recommended_pathway.slice(0, 3).map((course, idx) => (
            <div
              key={course.id || idx}
              className="border border-gray-200 rounded-lg p-4 flex flex-col justify-between hover:border-gray-300 transition-colors bg-white space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                    {course.provider}
                  </span>
                  <span className="text-xs font-semibold text-blue-600">
                    {course.match_score || 90}% Match
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <span>{course.duration}</span>
                    <span>•</span>
                    <span className="bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 text-gray-600">
                      {course.tag}
                    </span>
                  </div>
                </div>

                {course.ai_reason && (
                  <p className="text-xs italic text-gray-500 leading-relaxed bg-gray-50 p-2.5 rounded border border-gray-100">
                    "{course.ai_reason}"
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Link
                  to={`/courses/${course.id || idx + 1}`}
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
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
};

export default LearnerDashboard;
