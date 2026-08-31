'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { fetchFromApi } from '@/lib/api';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer, 
  Legend, 
  Tooltip 
} from 'recharts';
import { 
  Award, 
  BookOpen, 
  Compass, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  Play, 
  ExternalLink,
  ChevronRight,
  Flame,
  Check
} from 'lucide-react';

const INITIAL_RADAR_DATA = [
  { subject: 'Survey Sampling', current: 2.2, benchmark: 3.5, fullMark: 5 },
  { subject: 'National Accounts (SNA)', current: 2.8, benchmark: 4.0, fullMark: 5 },
  { subject: 'CPI/WPI Price Indices', current: 3.5, benchmark: 4.0, fullMark: 5 },
  { subject: 'Python/R Data Processing', current: 2.4, benchmark: 4.0, fullMark: 5 },
  { subject: 'AI Microdata Validation', current: 1.6, benchmark: 3.0, fullMark: 5 },
  { subject: 'DPDPA 2023 & Ethics', current: 3.8, benchmark: 4.0, fullMark: 5 },
  { subject: 'Policy Advisory', current: 2.9, benchmark: 3.0, fullMark: 5 }
];

export default function LearnerDashboard() {
  const { user } = useAuth();
  const [radarData, setRadarData] = useState(INITIAL_RADAR_DATA);
  const [gapScore, setGapScore] = useState(25.1);
  const [readinessPct, setReadinessPct] = useState(74.9);
  const [pathway, setPathway] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCompetencyData() {
      try {
        const data = await fetchFromApi('/api/users/competencies');
        if (data.radar_chart) {
          setRadarData(data.radar_chart.map((item: any) => ({
            subject: item.domain,
            current: item.current,
            benchmark: item.benchmark,
            fullMark: 5
          })));
        }
        if (data.overall_gap_score !== undefined) {
          setGapScore(data.overall_gap_score);
          setReadinessPct(data.readiness_percentage || (100 - data.overall_gap_score));
        }
        if (data.recommended_pathway) {
          setPathway(data.recommended_pathway);
        }
      } catch (err) {
        // use rich defaults
        setPathway([
          {
            step: 1,
            title: 'Advanced National Accounts Compilation (SNA 2008 & 2025 Update)',
            provider: 'iGOT Karmayogi',
            mode: 'Online E-Learning',
            duration_hours: 18.0,
            target_competency: 'National Accounts (SNA)',
            expected_gain: '+1.2 Level',
            urgency: 'High',
            status: 'In_Progress',
            progress: 65,
            url: 'https://igotkarmayogi.gov.in/course/igot-stat-201'
          },
          {
            step: 2,
            title: 'Statistical Computing with Python: Survey Data Wrangling & Variance Estimation',
            provider: 'iGOT Karmayogi',
            mode: 'Online E-Learning',
            duration_hours: 24.0,
            target_competency: 'Python/R Data Processing',
            expected_gain: '+1.4 Level',
            urgency: 'High',
            status: 'Recommended',
            progress: 0,
            url: 'https://igotkarmayogi.gov.in/course/igot-py-301'
          },
          {
            step: 3,
            title: 'Residential Workshop on Complex Survey Sampling & Multi-Stage Stratification',
            provider: 'NSSTA Greater Noida',
            mode: 'Residential Workshop (5 Days)',
            duration_hours: 35.0,
            target_competency: 'Survey Sampling',
            expected_gain: '+1.5 Level',
            urgency: 'Medium',
            status: 'Nomination_Open',
            progress: 0,
            url: 'https://nssta.gov.in/training/res-88'
          },
          {
            step: 4,
            title: 'Executive Workshop on Machine Learning & AI in Official Statistical Validation',
            provider: 'NSSTA Greater Noida',
            mode: 'Residential Lab',
            duration_hours: 30.0,
            target_competency: 'AI Microdata Validation',
            expected_gain: '+1.6 Level',
            urgency: 'Medium',
            status: 'Upcoming',
            progress: 0,
            url: 'https://nssta.gov.in/training/res-94'
          }
        ]);
      } finally {
        setLoading(false);
      }
    }

    loadCompetencyData();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Officer Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-blue-900/40 relative overflow-hidden shadow-glass">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 to-amber-500 p-0.5 shadow-glow-blue flex-shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-xl font-bold text-amber-400">
                {user?.full_name?.charAt(0) || 'A'}
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {user?.full_name || 'Arjun Sharma, ISS'}
                </h1>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  {user?.designation || 'Senior Statistical Officer (SSO)'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-2 flex-wrap">
                <span>{user?.department || 'National Accounts Division (NAD)'}</span>
                <span>•</span>
                <span className="text-amber-400 font-medium">{user?.cadre || 'Indian Statistical Service (Grade IV)'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/assessment/arena"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-glow-orange flex items-center gap-2 transition-all hover:scale-105"
            >
              <Award className="w-4 h-4" />
              Take Diagnostic Quiz
            </Link>

            <Link
              href="/catalogue"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              Browse Catalogue
            </Link>
          </div>
        </div>
      </div>

      {/* Grid: Radar Chart + Skill Gap Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Competency Radar Chart */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-blue-400" />
                  Official Statistics Competency Radar
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Current Assessed Proficiency vs MoSPI Role Benchmark (1 to 5 Scale)
                </p>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-md bg-blue-950 text-blue-300 border border-blue-800">
                Active Benchmark: SSO (NAD)
              </span>
            </div>

            <div className="w-full h-80 sm:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#1E3A8A" strokeOpacity={0.4} />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    stroke="#94A3B8" 
                    tick={{ fill: '#CBD5E1', fontSize: 11 }} 
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 5]} 
                    stroke="#475569" 
                    tick={{ fill: '#64748B', fontSize: 9 }}
                  />
                  <Radar
                    name="Current Proficiency"
                    dataKey="current"
                    stroke="#F97316"
                    fill="#F97316"
                    fillOpacity={0.4}
                  />
                  <Radar
                    name="MoSPI Role Benchmark"
                    dataKey="benchmark"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.2}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: 10, fontSize: 12 }} 
                    formatter={(value) => <span className="text-xs text-slate-300">{value}</span>}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B132B', borderColor: '#1E40AF', borderRadius: '12px', fontSize: '12px' }} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-850 text-center">
            <div className="p-2 rounded-xl bg-slate-900/60">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Strongest Area</p>
              <p className="text-xs font-bold text-emerald-400 mt-0.5">DPDPA & Ethics (3.8/5)</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Priority Gap</p>
              <p className="text-xs font-bold text-amber-400 mt-0.5">AI Microdata (1.6/3.0)</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Next Review</p>
              <p className="text-xs font-bold text-blue-400 mt-0.5">Post-Assessment</p>
            </div>
          </div>
        </div>

        {/* Right: Skill Gap Metric Card & Diagnostic Actions */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Skill Gap Score Box */}
          <div className="glass-panel p-6 rounded-3xl border-amber-900/30 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Skill Gap Index
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-medium">
                Moderate Gap
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
                  <div className="text-center">
                    <span className="text-2xl font-black text-white">{gapScore}%</span>
                    <p className="text-[9px] uppercase font-bold text-slate-400">Role Gap</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">System Readiness</span>
                  <span className="font-bold text-emerald-400">{readinessPct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full" style={{ width: `${readinessPct}%` }} />
                </div>
                <p className="text-[11px] text-slate-400 pt-1">
                  Estimated <span className="text-white font-semibold">77 learning hours</span> needed to achieve full benchmark proficiency.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-850 space-y-2">
              <p className="text-xs font-semibold text-slate-300">Target Deficit Areas to Close:</p>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/70 border border-slate-800">
                  <span className="text-slate-300">1. Python/R Survey Wrangling</span>
                  <span className="text-amber-400 font-semibold">-1.6 Level</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/70 border border-slate-800">
                  <span className="text-slate-300">2. AI in Microdata Imputation</span>
                  <span className="text-amber-400 font-semibold">-1.4 Level</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/70 border border-slate-800">
                  <span className="text-slate-300">3. Complex Survey Sampling</span>
                  <span className="text-amber-400 font-semibold">-1.3 Level</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Assessment Callout */}
          <div className="glass-card-amber p-6 rounded-3xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Diagnostic Micro-Assessment Ready</p>
                <p className="text-xs text-amber-200/80">AI-generated from NSS 79th Round Manual</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Complete a 10-minute assessment on Survey Multipliers to upgrade your evaluated sampling score by +0.35.
            </p>
            <Link
              href="/assessment/arena"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Start Assessment Arena
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>

      {/* Personalized Learning Pathway Timeline */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              Personalized Career Development Pathway
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">
              Recommended Learning Roadmap (iGOT + NSSTA)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Chronologically prioritized based on your role gap index and upcoming survey operations.
            </p>
          </div>
          <span className="text-xs text-blue-400 font-medium self-start sm:self-auto bg-blue-950/60 px-3 py-1.5 rounded-lg border border-blue-800">
            4 Milestones Synthesized
          </span>
        </div>

        {/* Timeline Items */}
        <div className="space-y-4 pt-2">
          {pathway.map((item, idx) => (
            <div 
              key={idx} 
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-blue-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-600/40 text-blue-400 font-bold flex items-center justify-center text-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                  0{item.step || idx + 1}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                      {item.provider}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      {item.mode}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {item.duration_hours}h Duration
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Target Domain: <span className="text-slate-200 font-medium">{item.target_competency}</span> • Expected Gain: <span className="text-emerald-400 font-semibold">{item.expected_gain}</span>
                  </p>
                  
                  {item.progress > 0 && (
                    <div className="pt-2 w-48 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Progress</span>
                        <span className="text-amber-400 font-bold">{item.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${item.progress}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 self-end md:self-center">
                {item.status === 'In_Progress' ? (
                  <a
                    href={item.url || 'https://igotkarmayogi.gov.in'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Resume Learning
                  </a>
                ) : item.provider.includes('NSSTA') ? (
                  <Link
                    href="/catalogue"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    Nominate for Batch
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <a
                    href={item.url || 'https://igotkarmayogi.gov.in'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
                  >
                    Enroll on iGOT
                    <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
