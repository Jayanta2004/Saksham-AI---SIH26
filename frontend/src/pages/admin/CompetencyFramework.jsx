import React from 'react';

const CompetencyFramework = () => {
  const benchmarks = [
    {
      skill: 'Python & R Data Analytics',
      level: 'Level 4.0 / 5.0',
      category: 'Technical',
      tier: 'Advanced'
    },
    {
      skill: 'National Accounts (SNA 2008)',
      level: 'Level 4.0 / 5.0',
      category: 'Statistical',
      tier: 'Advanced'
    },
    {
      skill: 'Machine Learning for Microdata',
      level: 'Level 3.0 / 5.0',
      category: 'Technical',
      tier: 'Intermediate'
    },
    {
      skill: 'Survey Sampling & Stratification',
      level: 'Level 3.5 / 5.0',
      category: 'Statistical',
      tier: 'Intermediate'
    },
    {
      skill: 'Digital Governance & DPDPA 2023',
      level: 'Level 3.5 / 5.0',
      category: 'Governance',
      tier: 'Intermediate'
    },
    {
      skill: 'Official Statistics Dissemination',
      level: 'Level 4.0 / 5.0',
      category: 'Dissemination',
      tier: 'Advanced'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="font-headline text-xl font-bold text-slate-900">Competency Framework</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Defined competency standards and role benchmark requirements across official MoSPI cadres.
        </p>
      </div>

      {/* Role Benchmark Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h2 className="font-headline text-base font-bold text-slate-900">Senior Statistical Officer (SSO)</h2>
            <p className="text-xs sm:text-sm text-slate-600">Benchmark skill levels required for current cadre role</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full w-fit">
            6 Required Competencies
          </span>
        </div>

        {/* Grid of skill/level pairs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {benchmarks.map((b) => (
            <div key={b.skill} className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 hover:border-blue-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">{b.category}</span>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full font-mono">
                  {b.tier}
                </span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900">{b.skill}</div>
              <div className="text-xs text-slate-600 font-mono pt-1 border-t border-slate-200">
                Required: <strong className="text-slate-900">{b.level}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompetencyFramework;
