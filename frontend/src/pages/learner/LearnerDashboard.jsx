import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Award,
  ArrowRight,
  Loader2,
  Sparkles,
  TrendingUp,
  Target,
  Zap,
  Activity
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
import { useTheme } from '../../context/ThemeContext';
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
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [readiness, setReadiness] = useState(74.9);
  const [readinessLabel, setReadinessLabel] = useState('Moderate Gap - Upskilling Recommended');
  const [radarData, setRadarData] = useState(DEFAULT_MOSPI_RADAR);
  const [skillGaps, setSkillGaps] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [userStats, setUserStats] = useState({
    courses_completed: 4,
    learning_hours: 38,
    assessments_passed: 6,
    certificates_earned: 3
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
      value: userStats.courses_completed ?? 4,
      unit: 'modules active',
      icon: BookOpen,
      iconBg: 'bg-cyan-500/10 text-cyan-700 dark:text-ai-cyan border-cyan-500/30',
      color: 'text-cyan-700 dark:text-ai-cyan'
    },
    {
      label: 'Learning Hours',
      value: userStats.learning_hours ?? 38,
      unit: 'hrs logged',
      icon: Clock,
      iconBg: 'bg-emerald-500/10 text-emerald-700 dark:text-success-emerald border-emerald-500/30',
      color: 'text-emerald-700 dark:text-success-emerald'
    },
    {
      label: 'Assessments Passed',
      value: userStats.assessments_passed ?? 6,
      unit: 'evaluations',
      icon: CheckCircle2,
      iconBg: 'bg-purple-500/10 text-purple-700 dark:text-ai-purple border-purple-500/30',
      color: 'text-purple-700 dark:text-ai-purple'
    },
    {
      label: 'Verified Badges',
      value: userStats.certificates_earned ?? 3,
      unit: 'credentials',
      icon: Award,
      iconBg: 'bg-amber-500/10 text-amber-700 dark:text-warning-amber border-amber-500/30',
      color: 'text-amber-700 dark:text-warning-amber'
    }
  ];

  const isDarkMode = theme === 'dark';
  const radarTextColor = isDarkMode ? '#cbd5e1' : '#1e293b';
  const radarGridColor = isDarkMode ? '#334155' : '#cbd5e1';

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-ai-cyan" />
          <p className="text-sm text-slate-600 dark:text-slate-400">Loading your statistical competency profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Welcome Banner Card */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-ai-cyan/10 rounded-full blur-3xl pointer-events-none -z-10" />
        
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            <span className="text-[11px] font-mono font-bold uppercase text-blue-700 dark:text-ai-cyan tracking-wider">
              {user?.department || 'National Accounts Division (NAD)'}
            </span>
          </div>
          <h1 className="font-headline text-2xl font-bold text-slate-900 dark:text-white">
            Welcome back, {firstName}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {user?.designation || 'Senior Statistical Officer'} • Official Cadre Competency Dashboard
          </p>
        </div>

        {/* Cadre Readiness Score Meter */}
        <div className="bg-slate-50 dark:bg-white/5 px-5 py-3 rounded-2xl flex items-center gap-4 shadow-sm border border-slate-200 dark:border-white/10">
          <div className="text-right">
            <div className="text-3xl font-extrabold text-blue-600 dark:text-ai-cyan font-mono chart-glow leading-none">
              {readiness}%
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-1">
              Role Readiness
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-cyan-500/10 border border-blue-200 dark:border-cyan-500/30 flex items-center justify-center">
            <Activity className="w-5 h-5 text-blue-600 dark:text-ai-cyan" />
          </div>
        </div>
      </div>

      {/* 2. Stitch Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 p-5 rounded-2xl flex items-center justify-between hover:border-blue-500/40 dark:hover:border-ai-cyan/40 transition-all shadow-sm"
            >
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">{stat.label}</p>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{stat.value}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.unit}</span>
                </div>
              </div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${stat.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Middle Section: Competency Radar Chart + Priority Skill Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Radar Chart (col-span-7) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
              <div>
                <h2 className="font-headline text-base font-bold text-slate-900 dark:text-white">
                  7-Axis Competency Radar
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Observed proficiency vs MoSPI official benchmark targets
                </p>
              </div>
              <Link to="/skills" className="text-xs text-blue-600 dark:text-ai-cyan font-semibold hover:underline flex items-center gap-1">
                <span>Full Matrix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="h-72 w-full mt-4 chart-glow">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="75%">
                  <PolarGrid stroke={radarGridColor} strokeDasharray="3 3" opacity={0.6} />
                  <PolarAngleAxis
                    dataKey="domain"
                    tick={{ fill: radarTextColor, fontSize: 11, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 5]}
                    tick={{ fill: radarTextColor, fontSize: 9 }}
                  />
                  <Radar
                    name="Current Level"
                    dataKey="current"
                    stroke="#0284c7"
                    fill="#06B6D4"
                    fillOpacity={0.4}
                  />
                  <Radar
                    name="Target Benchmark"
                    dataKey="benchmark"
                    stroke="#d97706"
                    fill="#F59E0B"
                    fillOpacity={0.08}
                    strokeDasharray="4 4"
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 pt-3 border-t border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-600 dark:bg-ai-cyan inline-block shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
              <span>Current Score (Scale: 5.0)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 border-t-2 border-dashed border-amber-600 dark:border-warning-amber inline-block" />
              <span>Target Benchmark Target</span>
            </div>
          </div>
        </div>

        {/* Top Skill Gaps (col-span-5) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
              <div>
                <h2 className="font-headline text-base font-bold text-slate-900 dark:text-white">
                  Priority Skill Gaps
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Calculated by Deficit Score</p>
              </div>
              <Link to="/skill-gap" className="text-xs text-blue-600 dark:text-ai-cyan font-semibold hover:underline">
                View all →
              </Link>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-white/10 mt-4 space-y-3">
              {skillGaps.length > 0 ? (
                skillGaps.map((gap, idx) => {
                  const percent = Math.min(100, Math.round((gap.current / (gap.required || 4.0)) * 100));
                  const badgeColors = {
                    High: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30',
                    Medium: 'bg-amber-500/10 text-amber-700 dark:text-warning-amber border-amber-500/30',
                    Low: 'bg-emerald-500/10 text-emerald-700 dark:text-success-emerald border-emerald-500/30'
                  };

                  return (
                    <div key={idx} className="pt-3 first:pt-0 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{gap.skill}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border shrink-0 ${
                            badgeColors[gap.priority] || badgeColors.Medium
                          }`}
                        >
                          {gap.priority} Priority
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300 font-mono">
                        <span>Current: {gap.current} / {gap.required}</span>
                        <span>{percent}% Ready</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-ai-cyan dark:to-ai-purple h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-xs font-medium">
                  All statistical competencies are currently on target!
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-white/10">
            <Link
              to="/assessments"
              className="w-full py-2.5 gradient-button text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md"
            >
              <span>Take Diagnostic Assessment for +Delta Score</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Recommended Courses Section */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 p-6 rounded-2xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
          <div>
            <h2 className="font-headline text-base font-bold text-slate-900 dark:text-white">
              Recommended Learning Pathways
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Personalized modules from iGOT Karmayogi &amp; NSSTA mapped to your skill gaps
            </p>
          </div>
          <Link
            to="/courses"
            className="text-xs text-blue-600 dark:text-ai-cyan font-semibold hover:underline flex items-center gap-1"
          >
            <span>Browse All Courses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {recommendedCourses.slice(0, 3).map((course, idx) => (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 flex flex-col justify-between hover:border-blue-500/40 dark:hover:border-ai-cyan/40 transition space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-blue-700 dark:text-ai-cyan bg-blue-50 dark:bg-cyan-500/10 border border-blue-200 dark:border-cyan-500/20 px-2 py-0.5 rounded-full font-mono">
                    {course.provider || 'iGOT Karmayogi'}
                  </span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                    {course.duration_hours ? `${course.duration_hours} hrs` : 'Self-paced'}
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                  {course.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                  Target: <strong className="text-slate-900 dark:text-white">{course.target_competency}</strong>
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-white/10">
                <Link
                  to="/courses/crs_igot_01"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center transition shadow-sm"
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
