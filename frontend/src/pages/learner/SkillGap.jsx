import React from 'react';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

const mockSkillGaps = [
  {
    id: 1,
    skill: 'Digital Personal Data Protection (DPDP) Compliance',
    current: 2,
    required: 5,
    gap: 3,
    priority: 'High',
    actions: [
      'Enroll in the 4-week iGOT Certified DPDP Implementation Course.',
      'Complete case study review on government data handling standards.',
      'Take internal departmental privacy audit simulation assessment.'
    ]
  },
  {
    id: 2,
    skill: 'Python for Advanced Data Analytics',
    current: 2,
    required: 4,
    gap: 2,
    priority: 'High',
    actions: [
      'Complete Pandas and NumPy data manipulation modules on Swayam.',
      'Build automated pipeline for monthly MoSPI survey data aggregation.',
      'Participate in peer code review with senior data specialists.'
    ]
  },
  {
    id: 3,
    skill: 'Survey Sampling & Stratification Techniques',
    current: 3,
    required: 5,
    gap: 2,
    priority: 'High',
    actions: [
      'Attend 5-day residential workshop at ISI Kolkata on advanced sampling.',
      'Review National Sample Survey round sampling methodology documentation.',
      'Apply stratified multi-stage cluster sampling to upcoming state-level pilot.'
    ]
  },
  {
    id: 4,
    skill: 'SQL & Data Warehousing',
    current: 3,
    required: 4,
    gap: 1,
    priority: 'Medium',
    actions: []
  },
  {
    id: 5,
    skill: 'Public Policy Briefing & Presentation',
    current: 3,
    required: 4,
    gap: 1,
    priority: 'Medium',
    actions: []
  },
  {
    id: 6,
    skill: 'Time Series & Economic Forecasting',
    current: 4,
    required: 4,
    gap: 0,
    priority: 'Low',
    actions: []
  }
];

export default function SkillGap() {
  const highPriorityGaps = mockSkillGaps.filter((item) => item.priority === 'High');

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-rose-700 bg-rose-50 border border-rose-100';
      case 'Medium':
        return 'text-amber-700 bg-amber-50 border border-amber-100';
      case 'Low':
      default:
        return 'text-emerald-700 bg-emerald-50 border border-emerald-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Skill Gap Analysis</h1>
        <p className="text-sm text-gray-500 mt-1">
          Comparison between your assessed competency levels and required benchmark standards.
        </p>
      </div>

      {/* Clean Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Skill</th>
                <th className="px-6 py-3.5 text-center">Current</th>
                <th className="px-6 py-3.5 text-center">Required</th>
                <th className="px-6 py-3.5 text-center">Gap</th>
                <th className="px-6 py-3.5 text-right">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockSkillGaps.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/60 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.skill}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                      L{item.current}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                      L{item.required}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.gap > 0 ? (
                      <span className="text-xs font-semibold text-rose-600">
                        -{item.gap} {item.gap === 1 ? 'level' : 'levels'}
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-600">
                        On target
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${getPriorityBadge(item.priority)}`}>
                      {item.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommended Actions for High Priority Gaps */}
      <div className="space-y-4 pt-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Recommended Actions</h2>
          <p className="text-sm text-gray-500">
            Targeted development steps to close critical skill gaps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highPriorityGaps.map((gap) => (
            <div
              key={gap.id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-gray-900 leading-snug">
                    {gap.skill}
                  </h3>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium shrink-0 ${getPriorityBadge(gap.priority)}`}>
                    {gap.priority}
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                  {gap.actions.map((action, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-600">
                      <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold text-[11px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed">{action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
