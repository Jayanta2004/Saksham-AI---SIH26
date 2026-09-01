import React, { useState, useEffect } from 'react';
import { Check, Play, Circle, Clock, BookOpen, BarChart2, Loader2, ArrowRight } from 'lucide-react';
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
          const completedCount = statsData?.assessments_passed || 0;
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
                progress = 25;
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
            // Default dynamic baseline steps
            setSteps([
              {
                step: 1,
                status: completedCount > 0 ? 'completed' : 'current',
                title: 'Foundations of National Statistical Frameworks & NSS Sampling',
                provider: 'iGOT Karmayogi',
                duration: '18 Hours',
                skill: 'Survey Methodology',
                difficulty: 'Intermediate',
                progress: completedCount > 0 ? 100 : 35
              },
              {
                step: 2,
                status: completedCount > 1 ? 'completed' : (completedCount === 1 ? 'current' : 'upcoming'),
                title: 'System of National Accounts (SNA 2008) GDP & GVA Compilation',
                provider: 'iGOT Karmayogi / NSSTA',
                duration: '24 Hours',
                skill: 'National Accounts',
                difficulty: 'Intermediate',
                progress: completedCount > 1 ? 100 : 0
              },
              {
                step: 3,
                status: completedCount > 2 ? 'completed' : (completedCount === 2 ? 'current' : 'upcoming'),
                title: 'Data Processing in Python & R for Official Surveys',
                provider: 'SWAYAM / IIT Madras',
                duration: '30 Hours',
                skill: 'Python & R Data Analytics',
                difficulty: 'Advanced',
                progress: 0
              },
              {
                step: 4,
                status: 'upcoming',
                title: 'Digital Personal Data Protection (DPDPA 2023) & Statistical Confidentiality',
                provider: 'NeGD & MoSPI',
                duration: '12 Hours',
                skill: 'Digital Governance',
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
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
        );
      case 'current':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center ring-4 ring-blue-100 shadow-sm">
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          </div>
        );
      case 'upcoming':
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 text-gray-400 flex items-center justify-center">
            <Circle className="w-3 h-3 fill-current text-gray-300" />
          </div>
        );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-700 bg-emerald-50 border border-emerald-200 font-semibold';
      case 'current':
        return 'text-blue-700 bg-blue-50 border border-blue-200 font-semibold';
      case 'upcoming':
      default:
        return 'text-gray-500 bg-gray-100 border border-gray-200';
    }
  };

  const formatStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'current':
        return 'In Progress';
      case 'upcoming':
      default:
        return 'Upcoming Milestone';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-500">Generating personalized learning pathway...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Personalized Learning Roadmap</h1>
        <p className="text-sm text-gray-500 mt-1">
          Curated training milestones dynamically sequenced by AI to close your specific competency gaps
        </p>
      </div>

      {/* Timeline Steps */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-[19px] sm:before:left-[23px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-200">
        {steps.map((item) => (
          <div key={item.step} className="relative flex items-start gap-4 sm:gap-6 group">
            {/* Timeline Icon Marker */}
            <div className="relative z-10 shrink-0 mt-1">
              {getStatusIcon(item.status)}
            </div>

            {/* Card Body */}
            <div
              className={`flex-1 bg-white border rounded-xl p-5 shadow-sm transition-all duration-200 ${
                item.status === 'current'
                  ? 'border-blue-500 ring-2 ring-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Step {item.step}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs font-semibold text-blue-700">{item.provider}</span>
                </div>
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full border self-start sm:self-auto ${getStatusBadge(
                    item.status
                  )}`}
                >
                  {formatStatusLabel(item.status)}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-gray-900 mb-3">{item.title}</h3>

              {/* Metadata Tags */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{item.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <span>{item.skill}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-gray-400" />
                  <span>{item.difficulty}</span>
                </div>
              </div>

              {/* Progress Bar for Current Step */}
              {item.status === 'current' && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-gray-700">Active Module Progress</span>
                    <span className="font-bold text-blue-600">{item.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-end pt-1">
                    <Link
                      to="/courses/crs_igot_01"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                    >
                      <span>Continue Learning</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}

              {item.status === 'upcoming' && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                  <span>Prerequisite: Complete preceding step</span>
                  <Link to="/courses" className="text-blue-600 hover:underline font-medium">
                    Preview Course
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
