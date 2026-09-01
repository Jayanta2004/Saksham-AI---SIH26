import React, { useState, useEffect } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { skillService } from '../../services/skillService';

export default function SkillGap() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [gaps, setGaps] = useState([]);
  const [overallScore, setOverallScore] = useState(25.1);

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

              return {
                id: c.competency_id || idx + 1,
                skill: c.name,
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

  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-rose-50 text-rose-700 border-rose-200';
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
          <p className="text-sm text-gray-500">Calculating dynamic skill gap matrix...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Skill Gap Analysis</h1>
          <p className="text-sm text-gray-500 mt-1">
            Mathematical competency deficit evaluation vs {user?.designation || 'Role'} target benchmarks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            Overall Deficit: {overallScore}%
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Competency Deficit Matrix</h2>
          <span className="text-xs text-gray-500">{gaps.length} Competencies Assessed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-3.5">Competency Domain</th>
                <th className="px-6 py-3.5 text-center">Current Score</th>
                <th className="px-6 py-3.5 text-center">Required Benchmark</th>
                <th className="px-6 py-3.5 text-center">Deficit Gap (Δ)</th>
                <th className="px-6 py-3.5 text-center">Priority</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {gaps.map((item) => {
                const isTargetMet = item.gap === 0;

                return (
                  <tr key={item.id} className="hover:bg-gray-50/70 transition">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {item.skill}
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-gray-700">
                      {item.current} / 5.0
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-gray-700">
                      {item.required} / 5.0
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-semibold ${isTargetMet ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isTargetMet ? '0.0 (Target Met)' : `-${item.gap}`}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full font-semibold border inline-block ${getPriorityBadge(
                          item.priority
                        )}`}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to="/courses"
                        className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
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
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-semibold text-gray-900">
              High Priority Recommended Actions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highPriorityGaps.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-semibold text-gray-900">{item.skill}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                    Deficit: -{item.gap}
                  </span>
                </div>

                <div className="space-y-2 pt-1 text-xs text-gray-600">
                  {item.actions.map((act, aIdx) => (
                    <div key={aIdx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold text-[10px] shrink-0 mt-0.5">
                        {aIdx + 1}
                      </span>
                      <span className="flex-1 leading-relaxed">{act}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-gray-100 flex justify-end">
                  <Link
                    to="/assessments"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
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
