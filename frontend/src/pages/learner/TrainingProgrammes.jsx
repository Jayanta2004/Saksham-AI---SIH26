import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, Sparkles, Check, CheckCircle2, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const INITIAL_PROGRAMMES = [
  {
    id: 'prog_nssta_01',
    title: 'Executive Workshop on National Statistical Systems & Big Data',
    provider: 'NSSTA Greater Noida',
    location: 'Greater Noida, Uttar Pradesh (Residential)',
    duration: '5 Days',
    dates: 'Oct 14 - Oct 18, 2026',
    skills: ['Statistical Modeling', 'Big Data Architecture', 'Data Governance'],
    matchPercentage: 96,
    capacity: '35 Seats (12 Remaining)',
    curriculum: 'Hands-on practical training on master sample frame maintenance, CAPI real-time sync, and big data architecture.'
  },
  {
    id: 'prog_iipa_02',
    title: 'Advanced Data Analytics & Predictive Modeling in Governance',
    provider: 'IIPA New Delhi',
    location: 'New Delhi (Hybrid)',
    duration: '2 Weeks',
    dates: 'Nov 02 - Nov 13, 2026',
    skills: ['Python Analytics', 'Predictive Modeling', 'Survey Design'],
    matchPercentage: 92,
    capacity: '40 Seats (18 Remaining)',
    curriculum: 'Advanced econometric modeling, automated tabulation pipelines in R, and policy forecasting algorithms.'
  },
  {
    id: 'prog_nisg_03',
    title: 'Digital Public Infrastructure & Data Privacy Compliance Seminar',
    provider: 'NISG Hyderabad',
    location: 'Hyderabad, Telangana (In-Person)',
    duration: '3 Days',
    dates: 'Dec 08 - Dec 10, 2026',
    skills: ['DPDPA 2023', 'API Standards', 'Information Security'],
    matchPercentage: 89,
    capacity: '50 Seats (25 Remaining)',
    curriculum: 'Detailed breakdown of the Digital Personal Data Protection Act 2023, consent management, and secure microdata release.'
  },
  {
    id: 'prog_lbsnaa_04',
    title: 'Strategic Leadership & Evidence-Based Policy Formulation',
    provider: 'LBSNAA Mussoorie',
    location: 'Mussoorie, Uttarakhand (Residential)',
    duration: '1 Week',
    dates: 'Jan 18 - Jan 22, 2027',
    skills: ['Public Policy', 'Inter-Agency Coordination', 'Executive Briefing'],
    matchPercentage: 85,
    capacity: '25 Seats (8 Remaining)',
    curriculum: 'Translating complex statistical metrics into executive cabinet briefings and strategic national policy advisory.'
  }
];

export default function TrainingProgrammes() {
  const { user } = useAuth();
  const storageKey = `saksham_nominations_${user?.id || 'guest'}`;

  const [nominatedIds, setNominatedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(nominatedIds));
    } catch (e) {
      console.warn('Could not save nominations:', e);
    }
  }, [nominatedIds, storageKey]);

  const handleNominate = (prog) => {
    const isCurrentlyNominated = nominatedIds.includes(prog.id);
    if (isCurrentlyNominated) {
      setNominatedIds(nominatedIds.filter((id) => id !== prog.id));
      setToastMessage(`Cancelled nomination for ${prog.title}`);
    } else {
      setNominatedIds([...nominatedIds, prog.id]);
      setToastMessage(`✓ Successfully nominated ${user?.full_name || 'Officer'} for ${prog.title}`);
    }
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Institutional Training Programmes</h1>
          <p className="text-sm text-gray-500 mt-1">
            Residential workshops and specialized blended academy programmes curated for your cadre
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg font-semibold">
            {nominatedIds.length} Active Nomination{nominatedIds.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Stacked Cards List */}
      <div className="space-y-4">
        {INITIAL_PROGRAMMES.map((prog) => {
          const isNominated = nominatedIds.includes(prog.id);

          return (
            <div
              key={prog.id}
              className={`bg-white border rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition ${
                isNominated ? 'border-emerald-300 ring-2 ring-emerald-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="space-y-3 flex-1">
                {/* Top Row: Provider & Match */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                    {prog.provider}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    {prog.matchPercentage}% AI Match
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium">
                    {prog.capacity}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h2 className="text-base font-bold text-gray-900 leading-snug">
                    {prog.title}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {prog.curriculum}
                  </p>
                </div>

                {/* Metadata Details */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-gray-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{prog.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{prog.dates}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{prog.duration}</span>
                  </div>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {prog.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[11px] font-medium bg-gray-50 text-gray-600 border border-gray-200 px-2 py-0.5 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 flex md:flex-col items-center justify-end">
                <button
                  onClick={() => handleNominate(prog)}
                  className={`w-full md:w-40 py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition ${
                    isNominated
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isNominated ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Nominated</span>
                    </>
                  ) : (
                    <span>Nominate Self</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
