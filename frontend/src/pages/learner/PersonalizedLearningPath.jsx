import React from 'react';
import { Check, Play, Circle, Clock, BookOpen, BarChart2 } from 'lucide-react';

const pathSteps = [
  {
    step: 1,
    status: 'completed',
    title: 'Foundations of National Statistical Frameworks',
    provider: 'iGOT Karmayogi',
    duration: '2 Weeks',
    skill: 'Survey Methodology',
    difficulty: 'Beginner',
    progress: 100
  },
  {
    step: 2,
    status: 'completed',
    title: 'Data Privacy & DPDP Act 2023 Implementation',
    provider: 'NeGD',
    duration: '3 Weeks',
    skill: 'Digital Governance',
    difficulty: 'Intermediate',
    progress: 100
  },
  {
    step: 3,
    status: 'current',
    title: 'Python for Statistical Computing & Automated Reporting',
    provider: 'SWAYAM / IIT Madras',
    duration: '6 Weeks',
    skill: 'Python & Data Analytics',
    difficulty: 'Intermediate',
    progress: 65
  },
  {
    step: 4,
    status: 'upcoming',
    title: 'Advanced Sampling Techniques & Small Area Estimation',
    provider: 'Indian Statistical Institute',
    duration: '5 Weeks',
    skill: 'Sampling Theory',
    difficulty: 'Advanced',
    progress: 0
  },
  {
    step: 5,
    status: 'upcoming',
    title: 'Evidence-Based Public Policy Formulation & Presentation',
    provider: 'LBSNAA',
    duration: '3 Weeks',
    skill: 'Policy Communication',
    difficulty: 'Advanced',
    progress: 0
  }
];

export default function PersonalizedLearningPath() {
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
        return 'text-emerald-700 bg-emerald-50 border border-emerald-100';
      case 'current':
        return 'text-blue-700 bg-blue-50 border border-blue-100 font-semibold';
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
        return 'Upcoming';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Learning Path</h1>
        <p className="text-sm text-gray-500 mt-1">
          Your structured roadmap designed to achieve target proficiency in core competency milestones.
        </p>
      </div>

      {/* Timeline Container */}
      <div className="max-w-4xl mx-auto pt-2 pb-8">
        <div className="relative border-l-2 border-gray-200 ml-4 sm:ml-5 space-y-8">
          {pathSteps.map((step) => {
            const isCurrent = step.status === 'current';

            return (
              <div key={step.step} className="relative pl-6 sm:pl-8">
                {/* Node Icon on Timeline */}
                <div className="absolute -left-[17px] top-4">
                  {getStatusIcon(step.status)}
                </div>

                {/* Step Card */}
                <div
                  className={`bg-white rounded-xl p-6 transition shadow-sm space-y-4 ${
                    isCurrent
                      ? 'border-2 border-blue-600 ring-1 ring-blue-100'
                      : 'border border-gray-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-400">
                        Step {step.step}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-500 font-medium">
                        {step.provider}
                      </span>
                    </div>

                    <span
                      className={`text-xs px-2.5 py-0.5 rounded self-start sm:self-auto ${getStatusBadge(
                        step.status
                      )}`}
                    >
                      {formatStatusLabel(step.status)}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-base font-semibold text-gray-900">
                      {step.title}
                    </h2>
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{step.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      <span>{step.skill}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BarChart2 className="w-4 h-4 text-gray-400" />
                      <span>{step.difficulty}</span>
                    </div>
                  </div>

                  {/* Progress Bar for Current Step */}
                  {isCurrent && (
                    <div className="pt-3 border-t border-gray-100 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 font-medium">Module Progress</span>
                        <span className="font-semibold text-blue-600">{step.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${step.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
