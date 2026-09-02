import React, { useState, useEffect } from 'react';
import { Loader2, Target, TrendingUp, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { skillService } from '../../services/skillService';

export default function MySkills() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchCompetencies = async () => {
      setLoading(true);
      try {
        const res = await skillService.getUserCompetencies();
        if (isMounted && res) {
          if (res.competency_breakdown && Array.isArray(res.competency_breakdown)) {
            const mapped = res.competency_breakdown.map((c, idx) => {
              let cat = 'Statistical';
              if (c.name.includes('Python') || c.name.includes('AI') || c.name.includes('Data')) cat = 'Technical';
              else if (c.name.includes('DPDPA') || c.name.includes('Governance')) cat = 'Digital Governance';
              else if (c.name.includes('Policy') || c.name.includes('Leadership')) cat = 'Behavioural';

              const cur = c.current_level || 2.0;
              const req = c.required_level || 4.0;
              const gap = Number((req - cur).toFixed(2));
              const prio = gap >= 1.0 ? 'High' : gap >= 0.5 ? 'Medium' : 'Low';

              return {
                id: c.competency_id || idx + 1,
                name: c.name,
                category: cat,
                currentLevel: cur,
                requiredLevel: req,
                gap,
                priority: prio
              };
            });
            setSkills(mapped);
          }
        }
      } catch (err) {
        console.warn('Skills fetch error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCompetencies();
    return () => { isMounted = false; };
  }, [user]);

  const categories = ['All', 'Statistical', 'Technical', 'Digital Governance', 'Behavioural'];

  const filteredSkills = activeCategory === 'All'
    ? skills
    : skills.filter((s) => s.category.toLowerCase() === activeCategory.toLowerCase());

  const getCategoryScore = (cat) => {
    const catSkills = skills.filter((s) => s.category.toLowerCase() === cat.toLowerCase());
    if (catSkills.length === 0) return 0;
    const totalPercentage = catSkills.reduce((acc, s) => acc + (s.currentLevel / (s.requiredLevel || 4.0)) * 100, 0);
    return Math.round(totalPercentage / catSkills.length);
  };

  const getPriorityStyle = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-500/20 border border-red-200 dark:border-red-500/40';
      case 'medium':
        return 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/40';
      case 'low':
      default:
        return 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/40';
    }
  };

  const activeCategories = activeCategory === 'All'
    ? categories.filter((c) => c !== 'All')
    : [activeCategory];

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-ai-cyan" />
          <p className="text-sm text-slate-600 dark:text-slate-400">Loading competency profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
        <h1 className="font-headline text-xl font-bold text-slate-900 dark:text-white">
          My Statistical &amp; Technical Skills
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Proficiency evaluation and benchmark gaps across official MoSPI competency frameworks
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeCategory === cat
                ? 'bg-blue-600 dark:bg-gradient-to-r dark:from-blue-600 dark:to-cyan-600 text-white shadow-sm'
                : 'bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skill Cards by Category */}
      <div className="space-y-8">
        {activeCategories.map((cat) => {
          const categorySkills = filteredSkills.filter((s) => s.category.toLowerCase() === cat.toLowerCase());
          if (categorySkills.length === 0) return null;

          const avgScore = getCategoryScore(cat);

          return (
            <div key={cat} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-headline text-base font-bold text-slate-900 dark:text-white">
                  {cat} Competencies
                </h2>
                <span className="text-xs font-semibold text-blue-700 dark:text-ai-cyan bg-blue-50 dark:bg-cyan-500/10 border border-blue-200 dark:border-cyan-500/20 px-3 py-1 rounded-full">
                  Average Readiness: {avgScore}%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySkills.map((skill) => {
                  const percent = Math.min(100, Math.round((skill.currentLevel / (skill.requiredLevel || 4.0)) * 100));

                  return (
                    <div
                      key={skill.id}
                      className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between hover:border-blue-500/40 dark:hover:border-ai-cyan/40 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                            {skill.name}
                          </h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${getPriorityStyle(skill.priority)}`}>
                            {skill.priority} Gap
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-300 font-mono pt-1">
                          <span>Current: <strong className="text-slate-900 dark:text-white">{skill.currentLevel} / 5.0</strong></span>
                          <span>Target: <strong className="text-slate-900 dark:text-white">{skill.requiredLevel} / 5.0</strong></span>
                        </div>

                        <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-ai-cyan dark:to-ai-purple h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex justify-between items-center text-[11px] text-slate-600 dark:text-slate-300 font-mono">
                        <span>Deficit: {skill.gap > 0 ? `-${skill.gap}` : 'Target Met'}</span>
                        <span className="font-bold text-blue-600 dark:text-ai-cyan">{percent}% Ready</span>
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
