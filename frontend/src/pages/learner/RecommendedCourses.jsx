import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, BarChart2, BookOpen, Sparkles } from 'lucide-react';

const courses = [
  {
    id: 101,
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
    id: 102,
    title: 'Digital Personal Data Protection (DPDP) Act Compliance',
    provider: 'NeGD & MeitY',
    description: 'Comprehensive curriculum on citizen data rights, statutory obligations, data fiduciary duties, and governance frameworks.',
    duration: '4 Weeks',
    skill: 'Digital Governance',
    difficulty: 'Beginner',
    matchPercentage: 92,
    aiReason: 'Matches mandatory compliance training identified for officers managing citizen-facing statistical datasets.'
  },
  {
    id: 103,
    title: 'Advanced Stratified Sampling & Variance Estimation',
    provider: 'Indian Statistical Institute',
    description: 'In-depth coverage of multi-stage cluster sampling, variance estimation techniques, and non-sampling error handling.',
    duration: '8 Weeks',
    skill: 'Survey Sampling',
    difficulty: 'Advanced',
    matchPercentage: 89,
    aiReason: 'Targets your core competency requirement for upcoming national sample survey rounds.'
  },
  {
    id: 104,
    title: 'Executive Communication & Evidence-Based Policy Briefing',
    provider: 'LBSNAA Mussoorie',
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
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Recommended Courses</h1>
        <p className="text-sm text-gray-500 mt-1">
          AI-curated learning programmes personalized to bridge your specific competency gaps.
        </p>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-5"
          >
            <div className="space-y-3">
              {/* Header tags */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                  {course.provider}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  {course.matchPercentage}% Match
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 leading-snug">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <span>{course.skill}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-gray-400" />
                  <span>{course.difficulty}</span>
                </div>
              </div>

              {/* AI Reason */}
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                <p className="text-xs text-gray-600 italic">
                  <span className="font-medium text-gray-700 not-italic">Why recommended: </span>
                  {course.aiReason}
                </p>
              </div>
            </div>

            {/* Action */}
            <div className="pt-2">
              <button
                onClick={() => navigate(`/courses/${course.id}`)}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition text-center"
              >
                View Course
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
