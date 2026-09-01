import React, { useState } from 'react';
import { MapPin, Calendar, Clock, Sparkles, Check } from 'lucide-react';

const initialProgrammes = [
  {
    id: 1,
    title: 'Executive Workshop on National Statistical Systems & Big Data',
    provider: 'NSSTA Greater Noida',
    location: 'Greater Noida, Uttar Pradesh (In-Person)',
    duration: '5 Days',
    dates: 'Oct 14 - Oct 18, 2026',
    skills: ['Statistical Modeling', 'Big Data Architecture', 'Data Governance'],
    matchPercentage: 95,
    isNominated: false
  },
  {
    id: 2,
    title: 'Advanced Data Analytics & Predictive Modeling in Governance',
    provider: 'IIPA New Delhi',
    location: 'New Delhi (Hybrid)',
    duration: '2 Weeks',
    dates: 'Nov 02 - Nov 13, 2026',
    skills: ['Python Analytics', 'Predictive Modeling', 'Survey Design'],
    matchPercentage: 91,
    isNominated: false
  },
  {
    id: 3,
    title: 'Digital Public Infrastructure & Data Privacy Compliance Seminar',
    provider: 'NISG Hyderabad',
    location: 'Hyderabad, Telangana (In-Person)',
    duration: '3 Days',
    dates: 'Dec 08 - Dec 10, 2026',
    skills: ['DPDP Act', 'API Standards', 'Information Security'],
    matchPercentage: 88,
    isNominated: false
  },
  {
    id: 4,
    title: 'Leadership in Evidence-Based Policy Formulation',
    provider: 'LBSNAA Mussoorie',
    location: 'Mussoorie, Uttarakhand (Residential)',
    duration: '1 Week',
    dates: 'Jan 18 - Jan 22, 2027',
    skills: ['Public Policy', 'Inter-Agency Coordination', 'Executive Briefing'],
    matchPercentage: 83,
    isNominated: false
  }
];

export default function TrainingProgrammes() {
  const [programmes, setProgrammes] = useState(initialProgrammes);

  const handleNominate = (id) => {
    setProgrammes((prev) =>
      prev.map((prog) =>
        prog.id === id ? { ...prog, isNominated: !prog.isNominated } : prog
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Training Programmes</h1>
        <p className="text-sm text-gray-500 mt-1">
          Explore upcoming institutional, residential, and blended training programmes matching your cadre profile.
        </p>
      </div>

      {/* Stacked Cards List */}
      <div className="space-y-4">
        {programmes.map((programme) => (
          <div
            key={programme.id}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-gray-300 transition"
          >
            <div className="space-y-3 flex-1">
              {/* Top Row: Provider & Match */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                  {programme.provider}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  {programme.matchPercentage}% Match
                </span>
              </div>

              {/* Title */}
              <h2 className="text-base font-semibold text-gray-900">
                {programme.title}
              </h2>

              {/* Metadata Details */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{programme.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{programme.dates}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{programme.duration}</span>
                </div>
              </div>

              {/* Skill Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {programme.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Action / Nomination */}
            <div className="shrink-0 flex items-center">
              {programme.isNominated ? (
                <button
                  onClick={() => handleNominate(programme.id)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-medium hover:bg-emerald-100 transition"
                >
                  <Check className="w-4 h-4" />
                  Nomination Submitted
                </button>
              ) : (
                <button
                  onClick={() => handleNominate(programme.id)}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition text-center"
                >
                  Nominate Self
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
