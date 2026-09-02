import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, BarChart2, BookOpen, Sparkles, ArrowRight } from 'lucide-react';

const courses = [
  {
    id: 'crs_igot_01',
    title: 'Data Science & Statistical Machine Learning for Civil Servants',
    provider: 'iGOT Karmayogi',
    description: 'Practical training on applying modern analytics, machine learning algorithms, and data modeling to national survey pipelines.',
    duration: '6 Weeks',
    skill: 'Python & Statistical Modeling',
    difficulty: 'Intermediate',
    matchPercentage: 96,
    aiReason: 'Directly addresses your high-priority gap in automated survey data analytics and Python workflows.'
  },
  {
    id: 'crs_dpdpa_02',
    title: 'Digital Personal Data Protection (DPDP) Act Compliance',
    provider: 'NeGD & MoSPI',
    description: 'Comprehensive curriculum on citizen data rights, statutory obligations, data fiduciary duties, and governance frameworks.',
    duration: '4 Weeks',
    skill: 'Digital Governance',
    difficulty: 'Beginner',
    matchPercentage: 92,
    aiReason: 'Matches mandatory compliance training identified for officers managing citizen-facing statistical datasets.'
  },
  {
    id: 'crs_sna_03',
    title: 'SNA 2008 Gross Value Added & Sectoral Compilation',
    provider: 'NSSTA Residential (Greater Noida)',
    description: 'In-depth coverage of multi-stage cluster sampling, GVA estimation techniques, and non-sampling error handling.',
    duration: '8 Weeks',
    skill: 'National Accounts',
    difficulty: 'Advanced',
    matchPercentage: 89,
    aiReason: 'Targets your core competency requirement for upcoming national sample survey rounds.'
  },
  {
    id: 'crs_policy_04',
    title: 'Executive Communication & Evidence-Based Policy Briefing',
    provider: 'iGOT Karmayogi / NSSTA',
    description: 'Techniques for distilling statistical findings into crisp, actionable executive briefs for ministry decision-makers.',
    duration: '3 Weeks',
    skill: 'Policy Communication',
    difficulty: 'Intermediate',
    matchPercentage: 84,
    aiReason: 'Recommended to strengthen stakeholder communication and inter-ministerial reporting.'
  }
];

export default function RecommendedCourses() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="font-headline text-xl font-bold text-slate-900">Recommended iGOT &amp; NSSTA Courses</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          AI-curated learning programmes personalized to bridge your specific competency gaps in the official statistical cadre.
        </p>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-5 hover:border-blue-500/40 transition-all"
          >
            <div className="space-y-3">
              {/* Header tags */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full font-mono">
                  {course.provider}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  {course.matchPercentage}% Match
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-headline text-base font-bold text-slate-900 leading-snug">
                  {course.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-mono pt-1">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span>{course.skill}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-slate-400" />
                  <span>{course.difficulty}</span>
                </div>
              </div>

              {/* AI Reason */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <p className="text-xs text-slate-700 italic">
                  <strong className="text-slate-900 not-italic">Why recommended: </strong>
                  {course.aiReason}
                </p>
              </div>
            </div>

            {/* Action */}
            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => navigate(`/courses/${course.id}`)}
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center justify-center gap-2 transition"
              >
                <span>View Course Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
