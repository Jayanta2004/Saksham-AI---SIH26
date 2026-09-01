import React, { useState } from 'react';
import { mockSkills as mockSkillsSource } from '../../data/mockSkills';

const fallbackSkills = [
  { id: 1, name: 'Statistical Sampling & Survey Design', category: 'Statistical', currentLevel: 3, requiredLevel: 5, priority: 'High' },
  { id: 2, name: 'Time Series & Macroeconomic Forecasting', category: 'Statistical', currentLevel: 4, requiredLevel: 4, priority: 'Low' },
  { id: 3, name: 'Python for Data Analysis', category: 'Technical', currentLevel: 2, requiredLevel: 4, priority: 'High' },
  { id: 4, name: 'R & Biostatistics Modeling', category: 'Technical', currentLevel: 3, requiredLevel: 4, priority: 'Medium' },
  { id: 5, name: 'SQL & Enterprise Relational Databases', category: 'Technical', currentLevel: 4, requiredLevel: 5, priority: 'Medium' },
  { id: 6, name: 'Digital Personal Data Protection (DPDP) Act', category: 'Digital Governance', currentLevel: 2, requiredLevel: 4, priority: 'High' },
  { id: 7, name: 'Open Data Standards & API Governance', category: 'Digital Governance', currentLevel: 3, requiredLevel: 4, priority: 'Medium' },
  { id: 8, name: 'Public Policy Communication & Briefing', category: 'Behavioural', currentLevel: 4, requiredLevel: 4, priority: 'Low' },
  { id: 9, name: 'Cross-Departmental Stakeholder Management', category: 'Behavioural', currentLevel: 3, requiredLevel: 5, priority: 'High' }
];

export default function MySkills() {
  const [activeCategory, setActiveCategory] = useState('All');

  // Normalize skills data if imported mock data format differs
  const rawSkills = Array.isArray(mockSkillsSource)
    ? mockSkillsSource
    : mockSkillsSource?.skills || fallbackSkills;

  const skills = rawSkills.map((s, idx) => ({
    id: s.id || idx + 1,
    name: s.name || s.skillName || 'Skill',
    category: s.category || 'Technical',
    currentLevel: s.currentLevel ?? s.current ?? 3,
    requiredLevel: s.requiredLevel ?? s.required ?? 5,
    priority: s.priority || (s.currentLevel < s.requiredLevel ? 'High' : 'Low')
  }));

  const categories = ['All', 'Statistical', 'Technical', 'Digital Governance', 'Behavioural'];

  const filteredSkills = activeCategory === 'All'
    ? skills
    : skills.filter((s) => s.category.toLowerCase() === activeCategory.toLowerCase());

  // Category average score calculation
  const getCategoryScore = (cat) => {
    const catSkills = skills.filter((s) => s.category.toLowerCase() === cat.toLowerCase());
    if (catSkills.length === 0) return 0;
    const totalPercentage = catSkills.reduce((acc, s) => acc + (s.currentLevel / s.requiredLevel) * 100, 0);
    return Math.round(totalPercentage / catSkills.length);
  };

  const getPriorityStyle = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'text-rose-700 bg-rose-50 border border-rose-100';
      case 'medium':
        return 'text-amber-700 bg-amber-50 border border-amber-100';
      case 'low':
      default:
        return 'text-emerald-700 bg-emerald-50 border border-emerald-100';
    }
  };

  const activeCategories = activeCategory === 'All'
    ? categories.filter((c) => c !== 'All')
    : [activeCategory];

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">My Skills</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review your competency ratings, target proficiency levels, and skill gaps across categories.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
              activeCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Category Sections */}
      <div className="space-y-8">
        {activeCategories.map((cat) => {
          const categorySkills = filteredSkills.filter(
            (s) => s.category.toLowerCase() === cat.toLowerCase()
          );

          if (categorySkills.length === 0) return null;

          const catScore = getCategoryScore(cat);

          return (
            <div key={cat} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">{cat}</h2>
                <div className="text-xs text-gray-500 font-medium">
                  Average Readiness: <span className="text-blue-600 font-semibold">{catScore}%</span>
                </div>
              </div>

              {/* Grid of Skill Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {categorySkills.map((skill) => {
                  const progressPct = Math.min(
                    100,
                    Math.round((skill.currentLevel / skill.requiredLevel) * 100)
                  );

                  return (
                    <div
                      key={skill.id}
                      className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-medium text-gray-900 leading-snug">
                          {skill.name}
                        </h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-medium ${getPriorityStyle(
                            skill.priority
                          )}`}
                        >
                          {skill.priority}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Current: Level {skill.currentLevel}</span>
                          <span>Required: Level {skill.requiredLevel}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
