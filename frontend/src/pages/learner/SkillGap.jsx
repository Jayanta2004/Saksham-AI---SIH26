import React, { useState, useEffect } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, BookOpen, Target, Sparkles, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { skillService } from '../../services/skillService';

export default function SkillGap() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [gaps, setGaps] = useState([]);
  const [overallScore, setOverallScore] = useState(25.1);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    let isMounted = true;
    const fetchGaps = async () => {
      setLoading(true);
      try {
        const res = await skillService.getUserCompetencies();
        if (isMounted && res) {
          setOverallScore(res.overall_gap_score || 25.1);
          if (res.competency_breakdown && Array.isArray(res.competency_breakdown)) {
            const list = res.competency_breakdown.map((c, idx) => {
              const cur = c.current_level || 2.0;
              const req = c.required_level || 4.0;
              const gap = Number((req - cur).toFixed(2));
              const prio = gap >= 1.0 ? 'High' : gap >= 0.5 ? 'Medium' : 'Low';

              let cat = 'Statistical';
              const nameLower = (c.name || '').toLowerCase();
              if (nameLower.includes('python') || nameLower.includes('r ') || nameLower.includes('data') || nameLower.includes('ai') || nameLower.includes('sql') || nameLower.includes('analytics')) {
                cat = 'Technical';
              } else if (nameLower.includes('dpdpa') || nameLower.includes('governance') || nameLower.includes('privacy') || nameLower.includes('security')) {
                cat = 'Digital Governance';
              } else if (nameLower.includes('policy') || nameLower.includes('leadership') || nameLower.includes('ethics') || nameLower.includes('management') || nameLower.includes('decision')) {
                cat = 'Behavioural';
              }

              return {
                id: c.competency_id || idx + 1,
                skill: c.name,
                category: cat,
                current: cur,
                required: req,
                gap: Math.max(0, gap),
                priority: prio,
                actions: gap > 0 ? [
                  `Enroll in the recommended ${c.name} course module on iGOT Karmayogi.`,
                  `Review standard MoSPI survey instruction manual for practical application.`,
                  `Take the diagnostic assessment in the Assessment Arena to earn competency points.`
                ] : []
              };
            });
            setGaps(list);
          }
        }
      } catch (err) {
        console.warn('Skill gap fetch error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchGaps();
    return () => { isMounted = false; };
  }, [user]);

  const categories = ['All', 'Statistical', 'Technical', 'Digital Governance', 'Behavioural'];

  const filteredGaps = activeCategory === 'All'
    ? gaps
    : gaps.filter(g => g.category.toLowerCase() === activeCategory.toLowerCase());

  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low':
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  const highPriorityGaps = gaps.filter((g) => g.priority === 'High' && g.gap > 0);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-sm text-slate-600">Calculating dynamic skill gap matrix...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Competency Radar & Deficit Analysis
            </span>
            <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              MoSPI Cadre Benchmarking
            </span>
          </div>
          <h1 className="font-headline text-xl md:text-2xl font-bold text-slate-900">Skill Gap & Competency Radar</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Mathematical competency evaluation against official benchmark requirements for <strong>{user?.designation || 'Senior Statistical Officer'}</strong>.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Average Deficit</div>
            <div className="text-xl font-bold text-amber-700">{overallScore}%</div>
          </div>
          <div className="text-right pl-3 border-l border-slate-200">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Competencies</div>
            <div className="text-xl font-bold text-slate-900">{gaps.length}</div>
          </div>
        </div>
      </div>

      {/* Domain Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        <span className="text-xs font-bold text-slate-500 uppercase px-3 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Domain:</span>
        </span>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-headline text-base font-bold text-slate-900">Competency Deficit Matrix</h2>
          <span className="text-xs text-slate-600 font-mono">Showing {filteredGaps.length} of {gaps.length} Competencies</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-700 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Competency Domain</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5 text-center">Current Score</th>
                <th className="px-6 py-3.5 text-center">Required Benchmark</th>
                <th className="px-6 py-3.5 text-center">Deficit Gap (Δ)</th>
                <th className="px-6 py-3.5 text-center">Priority</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredGaps.map((item) => {
                const isTargetMet = item.gap === 0;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {item.skill}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-slate-700">
                      {item.current} / 5.0
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-slate-700">
                      {item.required} / 5.0
                    </td>
                    <td className="px-6 py-4 text-center font-mono">
                      <span className={`font-bold ${isTargetMet ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isTargetMet ? '0.0 (Target Met)' : `-${item.gap}`}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full font-bold border inline-block ${getPriorityBadge(
                          item.priority
                        )}`}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to="/courses"
                        className="inline-flex items-center text-xs font-bold text-blue-600 hover:underline transition"
                      >
                        <span>View Courses</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommended Actions for High Priority Gaps */}
      {highPriorityGaps.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h2 className="font-headline text-base font-bold text-slate-900">
              High Priority Recommended Actions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highPriorityGaps.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{item.skill}</h3>
                    <span className="text-[11px] text-slate-500 font-medium">{item.category}</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-red-50 text-red-700 border border-red-200 font-mono">
                    Deficit: -{item.gap}
                  </span>
                </div>

                <div className="space-y-2 pt-1 text-xs text-slate-700">
                  {item.actions.map((act, aIdx) => (
                    <div key={aIdx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {aIdx + 1}
                      </span>
                      <span className="flex-1 leading-relaxed">{act}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end">
                  <Link
                    to="/assessments"
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                  >
                    <span>Take Assessment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
