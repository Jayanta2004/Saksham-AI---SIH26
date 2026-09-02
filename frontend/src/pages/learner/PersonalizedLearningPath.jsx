import React, { useState, useEffect } from 'react';
import { Check, Play, Circle, Clock, BookOpen, BarChart2, Loader2, ArrowRight, Sparkles, Award, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { skillService } from '../../services/skillService';

export default function PersonalizedLearningPath() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchPath = async () => {
      setLoading(true);
      try {
        const [compData, statsData] = await Promise.all([
          skillService.getUserCompetencies().catch(() => null),
          skillService.getUserStats().catch(() => null)
        ]);

        if (isMounted) {
          const isDemo = user?.id === 'usr_sso_01';
          const completedCount = typeof statsData?.assessments_passed === 'number' 
            ? statsData.assessments_passed 
            : (isDemo ? 1 : 0);
          const pathway = compData?.recommended_pathway || [];

          if (pathway.length > 0) {
            const mappedSteps = pathway.map((p, idx) => {
              let status = 'upcoming';
              let progress = 0;

              if (idx < completedCount) {
                status = 'completed';
                progress = 100;
              } else if (idx === completedCount) {
                status = 'current';
                progress = isDemo ? 30 : 0;
              }

              return {
                step: idx + 1,
                status,
                title: p.title,
                provider: p.provider || 'iGOT Karmayogi',
                duration: p.duration_hours ? `${p.duration_hours} Hours` : '3 Weeks',
                skill: p.target_competency || 'Official Statistics',
                difficulty: p.urgency === 'High' ? 'Intermediate' : 'Beginner',
                progress,
                url: p.url || '/courses'
              };
            });
            setSteps(mappedSteps);
          } else {
            setSteps([
              {
                step: 1,
                status: completedCount > 0 ? 'completed' : 'current',
                title: 'Official Microdata Cleaning in Python & Pandas for Surveys',
                provider: 'iGOT Karmayogi',
                duration: '16 Hours',
                skill: 'Python Microdata Analytics',
                difficulty: 'Intermediate',
                progress: completedCount > 0 ? 100 : 0
              },
              {
                step: 2,
                status: completedCount > 1 ? 'completed' : (completedCount === 1 ? 'current' : 'upcoming'),
                title: 'SNA 2008: Gross Value Added & Sectoral Compilation',
                provider: 'iGOT Karmayogi / NSSTA',
                duration: '24 Hours',
                skill: 'National Accounts',
                difficulty: 'Intermediate',
                progress: completedCount > 1 ? 100 : (completedCount === 1 ? (isDemo ? 30 : 0) : 0)
              },
              {
                step: 3,
                status: completedCount > 2 ? 'completed' : (completedCount === 2 ? 'current' : 'upcoming'),
                title: 'Multi-Stage Stratified Sampling & Survey Multipliers',
                provider: 'NSSTA Residential Workshop (Greater Noida)',
                duration: '30 Hours',
                skill: 'Survey Methodology & Sampling',
                difficulty: 'Advanced',
                progress: 0
              },
              {
                step: 4,
                status: 'upcoming',
                title: 'Digital Personal Data Protection (DPDPA 2023) & Statistical Confidentiality',
                provider: 'NeGD & MoSPI',
                duration: '12 Hours',
                skill: 'Digital Governance & Security',
                difficulty: 'Intermediate',
                progress: 0
              }
            ]);
          }
        }
      } catch (err) {
        console.warn('Learning path fetch error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPath();
    return () => { isMounted = false; };
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center glow-node-complete shadow-md shrink-0">
            <Check className="w-5 h-5 stroke-[3]" />
          </div>
        );
      case 'current':
        return (
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center justify-center glow-node-active shadow-lg shrink-0">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </div>
        );
      case 'upcoming':
      default:
        return (
          <div className="w-10 h-10 rounded-full glass-card text-on-surface-variant flex items-center justify-center border border-glass-border shrink-0">
            <Lock className="w-4 h-4 text-slate-400" />
          </div>
        );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success-emerald bg-emerald-500/10 border border-success-emerald/30 font-semibold';
      case 'current':
        return 'text-ai-cyan bg-cyan-500/10 border border-ai-cyan/30 font-semibold';
      case 'upcoming':
      default:
        return 'text-slate-500 bg-slate-100 border border-slate-200 font-medium';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-ai-cyan" />
          <p className="text-sm text-on-surface-variant">Synthesizing personalized competency roadmap...</p>
        </div>
      </div>
    );
  }

  const completedCount = steps.filter((s) => s.status === 'completed').length;
  const progressPercent = Math.round((completedCount / (steps.length || 1)) * 100);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl relative overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-ai-cyan animate-pulse"></span>
              <span className="text-[11px] font-mono font-bold uppercase text-ai-cyan tracking-wider">
                Official MoSPI Competency Roadmap
              </span>
            </div>
            <h1 className="font-headline text-2xl font-bold text-slate-900">
              Personalized Competency Remediation Path
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Curated AI learning journey tailored to your {user?.designation || 'Senior Statistical Officer'} cadre benchmarks
            </p>
          </div>

          {/* Overall Progress Meter */}
          <div className="glass-panel px-5 py-3.5 rounded-2xl flex items-center gap-4 border border-slate-200 shadow-sm">
            <div className="text-right">
              <div className="text-2xl font-extrabold font-mono text-ai-cyan chart-glow leading-none">
                {progressPercent}%
              </div>
              <div className="text-[10px] text-slate-500 font-medium mt-1">
                {completedCount} of {steps.length} Milestones Done
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-ai-cyan" />
            </div>
          </div>
        </div>
      </div>

      {/* Vertical Interactive Stepper with Stitch Glass Cards */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-11 before:top-6 before:bottom-6 before:w-0.5 before:bg-gradient-to-b before:from-success-emerald before:via-ai-cyan before:to-slate-700">
        {steps.map((step) => {
          const isCurrent = step.status === 'current';
          const isCompleted = step.status === 'completed';

          return (
            <div key={step.step} className="relative flex items-start gap-4 sm:gap-6 group">
              
              {/* Connected Step Node Icon */}
              <div className="relative z-10">
                {getStatusIcon(step.status)}
              </div>

              {/* Step Detail Card */}
              <div
                className={`flex-1 glass-card p-5 sm:p-6 rounded-2xl transition-all shadow-sm ${
                  isCurrent ? 'border-ai-cyan shadow-lg shadow-cyan-500/10' : 'hover:border-ai-cyan/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-ai-cyan">
                      PHASE 0{step.step}
                    </span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider ${getStatusBadge(step.status)}`}>
                      {step.status === 'completed' ? 'Completed' : step.status === 'current' ? 'In Progress' : 'Upcoming'}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    {step.duration}
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  <h3 className="font-headline text-base font-bold text-slate-900 leading-snug">
                    {step.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <span className="px-2 py-0.5 rounded glass-panel font-mono text-[11px] text-ai-cyan">
                      {step.provider}
                    </span>
                    <span>Target Competency: <strong className="text-slate-800">{step.skill}</strong></span>
                    <span>•</span>
                    <span>Level: <strong>{step.difficulty}</strong></span>
                  </div>

                  {/* Progress Bar for Current Step */}
                  {isCurrent && (
                    <div className="pt-2">
                      <div className="flex justify-between text-[11px] text-on-surface-variant font-mono mb-1">
                        <span>Module Progress</span>
                        <span>{step.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-ai-cyan to-ai-purple h-2 rounded-full transition-all duration-500"
                          style={{ width: `${step.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                  {isCompleted ? (
                    <span className="text-xs text-success-emerald font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Competency Target Verified (+0.4 Delta Score)
                    </span>
                  ) : isCurrent ? (
                    <Link
                      to="/courses/crs_igot_01"
                      className="inline-flex items-center gap-2 gradient-button text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md"
                    >
                      <span>Resume Module</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Unlocks upon completing Phase 02
                    </span>
                  )}

                  <Link
                    to="/assessments"
                    className="text-xs text-blue-600 font-semibold hover:underline"
                  >
                    Take Quiz →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
