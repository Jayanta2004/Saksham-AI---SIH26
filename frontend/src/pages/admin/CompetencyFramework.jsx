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
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Competency Framework</h1>
        <p className="text-sm text-gray-500 mt-1">
          Defined competency standards and role benchmark requirements across organizational cadres.
        </p>
      </div>

      {/* Role Benchmark Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Senior Statistical Officer (SSO)</h2>
            <p className="text-sm text-gray-500">Benchmark skill levels required for current cadre role</p>
          </div>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md w-fit">
            6 Required Competencies
          </span>
        </div>

        {/* Grid of skill/level pairs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {benchmarks.map((b) => (
            <div key={b.skill} className="p-5 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{b.category}</span>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {b.tier}
                </span>
              </div>
              <div className="text-sm font-semibold text-gray-900">{b.skill}</div>
              <div className="text-xs text-gray-600 font-medium pt-1 border-t border-gray-200/60">
                Required: {b.level}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompetencyFramework;
