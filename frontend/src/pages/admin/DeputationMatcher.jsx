import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Search,
  Sparkles,
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Users,
  Sliders,
  BookOpen,
  Printer,
  ChevronRight,
  Shield,
  Briefcase,
  Layers,
  ArrowRight,
  Loader2,
  X,
  FileText
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function DeputationMatcher() {
  const { user } = useAuth();

  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [projectTitle, setProjectTitle] = useState('National Accounts Base Year Revision Taskforce (SNA 2008)');
  const [minExperience, setMinExperience] = useState(3);
  const [targetComps, setTargetComps] = useState({
    'SNA 2008 & National Accounts': 4.5,
    'Survey Sampling & Frame Design': 3.5,
    'Python & R Data Analytics': 4.0,
    'DPDPA 2023 Compliance': 3.8,
    'CAPI Field Operations': 3.0
  });

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOfficerIds, setSelectedOfficerIds] = useState(new Set());

  // Modal States
  const [showCohortModal, setShowCohortModal] = useState(false);
  const [cohortSuccessMsg, setCohortSuccessMsg] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Load templates on mount
  useEffect(() => {
    let isMounted = true;
    const fetchTemplates = async () => {
      try {
        const res = await api.get('/api/admin/deputation/templates');
        if (isMounted && res.data?.templates) {
          setTemplates(res.data.templates);
          setSelectedTemplateId(res.data.templates[0]?.id || '');
        }
      } catch (err) {
        console.warn('Templates fetch error:', err);
      }
    };
    fetchTemplates();
    return () => { isMounted = false; };
  }, []);

  // When template is selected, populate criteria
  const handleSelectTemplate = (tmplId) => {
    setSelectedTemplateId(tmplId);
    const tmpl = templates.find((t) => t.id === tmplId);
    if (tmpl) {
      setProjectTitle(tmpl.title);
      setMinExperience(tmpl.min_experience_years || 2);
      setTargetComps((prev) => ({
        ...prev,
        ...tmpl.target_competencies
      }));
    }
  };

  // Run AI matching algorithm
  const handleRunMatching = async () => {
    setLoading(true);
    try {
      const res = await api.post('/api/admin/deputation/match', {
        project_title: projectTitle,
        target_competencies: targetComps,
        min_experience: minExperience
      });

      if (res.data?.candidates) {
        setCandidates(res.data.candidates);
        // Pre-select top candidate
        if (res.data.candidates.length > 0) {
          setSelectedOfficerIds(new Set([res.data.candidates[0].id]));
        }
      }
    } catch (err) {
      alert('Could not match candidates. Please verify gateway service.');
    } finally {
      setLoading(false);
    }
  };

  // Run initial matching on mount
  useEffect(() => {
    handleRunMatching();
  }, []);

  const toggleSelectOfficer = (id) => {
    setSelectedOfficerIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCreateCohort = async () => {
    if (selectedOfficerIds.size === 0) {
      alert('Please select at least 1 officer to commission a fast-track training cohort.');
      return;
    }

    try {
      const res = await api.post('/api/admin/deputation/create-cohort', {
        cohort_title: `Fast-Track Readiness: ${projectTitle}`,
        selected_officer_ids: Array.from(selectedOfficerIds),
        focus_skills: Object.keys(targetComps)
      });
      if (res.data?.success) {
        setCohortSuccessMsg(res.data.message);
        setShowCohortModal(true);
      }
    } catch (err) {
      alert('Could not create cohort. Please try again.');
    }
  };

  const selectedCandidatesList = candidates.filter((c) => selectedOfficerIds.has(c.id));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-600" />
              MoSPI DIID / Cadre Management Hub
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              AI Matching Engine Active
            </span>
          </div>
          <h1 className="font-headline text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Automated MoSPI Training Needs Analysis (TNA) &amp; Deputation Matcher
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Multi-parameter recommendation system for staffing high-priority statistical missions, national survey rounds, and specialized taskforces with precision competency matching.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowOrderModal(true)}
            disabled={selectedOfficerIds.size === 0}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Deputation Order ({selectedOfficerIds.size})</span>
          </button>
          <button
            onClick={handleCreateCohort}
            disabled={selectedOfficerIds.size === 0}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition"
          >
            <BookOpen className="w-4 h-4" />
            <span>Trigger NSSTA Fast-Track Bootcamp</span>
          </button>
        </div>
      </div>

      {/* Preset Mission Templates */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-blue-600" />
          <span>Select High-Priority Mission Preset:</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {templates.map((tmpl) => {
            const isSelected = tmpl.id === selectedTemplateId;
            return (
              <button
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl.id)}
                className={`text-left p-4 rounded-xl border transition flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-500 shadow-2xs ring-1 ring-blue-500'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div>
                  <h4 className="font-headline font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-2">
                    {tmpl.title}
                  </h4>
                  <div className="text-[11px] text-blue-700 font-semibold mt-1">{tmpl.department}</div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{tmpl.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Min {tmpl.min_experience_years}y Exp</span>
                  <span className="text-blue-600 font-semibold">Load Template &rarr;</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Criteria & Candidates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Criteria Form (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h3 className="font-headline font-bold text-sm text-slate-900">
              Mission Competency Criteria
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Project / Mission Title
              </label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">Minimum Cadre Experience:</span>
                <span className="font-mono font-bold text-blue-700">{minExperience} Years</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                value={minExperience}
                onChange={(e) => setMinExperience(parseInt(e.target.value, 10))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Target Competency Sliders */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Target Benchmark Levels (Scale 1.0 - 5.0):
              </span>

              {Object.entries(targetComps).map(([skill, val]) => (
                <div key={skill} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-700 font-medium text-[11px] truncate max-w-[200px]" title={skill}>
                      {skill}
                    </span>
                    <span className="font-mono font-bold text-blue-700">{val.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="5.0"
                    step="0.5"
                    value={val}
                    onChange={(e) =>
                      setTargetComps((prev) => ({ ...prev, [skill]: parseFloat(e.target.value) }))
                    }
                    className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleRunMatching}
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Scan Cadre &amp; Match Candidates</span>
            </button>
          </div>
        </div>

        {/* Right Column: Matched Candidate Cards (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-5 py-3.5 shadow-xs">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="font-headline font-bold text-sm text-slate-900">
                Ranked Officer Candidates ({candidates.length})
              </span>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Selected: <span className="font-bold text-blue-700">{selectedOfficerIds.size}</span> officers
            </div>
          </div>

          {loading ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center space-y-3 shadow-xs">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              <div className="font-headline font-bold text-slate-900 text-base">Running Multi-Parameter TNA Algorithm...</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Comparing officer radar capability baselines, assessment scores, and cadre seniority against mission requirements.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {candidates.map((cand) => {
                const isSelected = selectedOfficerIds.has(cand.id);

                return (
                  <div
                    key={cand.id}
                    onClick={() => toggleSelectOfficer(cand.id)}
                    className={`p-5 rounded-2xl border transition cursor-pointer shadow-xs space-y-4 ${
                      isSelected
                        ? 'bg-blue-50/60 border-blue-500 ring-1 ring-blue-500'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
                        />
                        <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-sm shrink-0">
                          {cand.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-headline font-bold text-sm text-slate-900">{cand.name}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                cand.fit_percentage >= 85
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {cand.fit_tier}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500">
                            {cand.designation} &bull; {cand.department}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <div className="text-right">
                          <div className="text-[10px] text-slate-400 font-semibold uppercase">Fit Score</div>
                          <div className="text-2xl font-extrabold font-mono text-blue-700 leading-tight">
                            {cand.fit_percentage}%
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Strengths & Deficit Pills */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                          Verified Strengths:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {cand.strengths.slice(0, 3).map((st, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium"
                            >
                              ✓ {st}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                          Target Training Deficits (TNA Gaps):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {cand.gaps.length > 0 ? (
                            cand.gaps.slice(0, 2).map((gp, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-medium"
                              >
                                ! {gp}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">No significant deficits.</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-mono">
                      <span>Cadre: {cand.cadre}</span>
                      <span>Experience: {cand.experience_years} Years</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: Fast-Track Training Cohort Success */}
      {showCohortModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-headline font-bold text-base text-slate-900">
                NSSTA Fast-Track Training Cohort Commissioned
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">{cohortSuccessMsg}</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400">Academy Campus:</span>
                <span className="font-semibold">NSSTA Greater Noida</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Officers:</span>
                <span className="font-semibold font-mono">{selectedOfficerIds.size} Enrolled</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Commencement:</span>
                <span className="font-semibold font-mono">10 Oct 2026 (2 Weeks Intensive)</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowCohortModal(false)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Acknowledge &amp; Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Official MoSPI Deputation Order Document */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="font-headline font-bold text-sm text-slate-900">
                  MoSPI Office Memorandum &bull; Deputation Order
                </span>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Memorandum Paper */}
            <div className="p-8 border border-slate-300 rounded-xl bg-slate-50/50 space-y-5 font-serif text-slate-900 text-xs">
              <div className="text-center space-y-1">
                <div className="font-bold text-sm uppercase tracking-wide">
                  Government of India
                </div>
                <div className="font-bold text-xs uppercase">
                  Ministry of Statistics &amp; Programme Implementation
                </div>
                <div className="text-[11px] text-slate-600">Sardar Patel Bhawan, Sansad Marg, New Delhi - 110001</div>
              </div>

              <div className="flex justify-between border-t border-b border-slate-300 py-1.5 text-[11px] font-sans">
                <span>File No. 12014/02/2026-ISS</span>
                <span>Dated: 23rd September 2026</span>
              </div>

              <div className="text-center font-bold font-sans text-sm underline uppercase tracking-wide">
                OFFICE MEMORANDUM
              </div>

              <p className="leading-relaxed">
                <strong>Subject:</strong> Deputation and Taskforce Constitution for{' '}
                <span className="font-bold">{projectTitle}</span>.
              </p>

              <p className="leading-relaxed">
                The Competent Authority is pleased to order the deputation and assignment of the following statistical officers to the subject taskforce with immediate effect:
              </p>

              <table className="w-full border-collapse border border-slate-300 text-[11px] font-sans">
                <thead>
                  <tr className="bg-slate-200 border-b border-slate-300">
                    <th className="border border-slate-300 p-1.5 text-center">S.No.</th>
                    <th className="border border-slate-300 p-1.5 text-left">Officer Name</th>
                    <th className="border border-slate-300 p-1.5 text-left">Designation &amp; Cadre</th>
                    <th className="border border-slate-300 p-1.5 text-center">Fit %</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCandidatesList.map((c, i) => (
                    <tr key={c.id}>
                      <td className="border border-slate-300 p-1.5 text-center">{i + 1}</td>
                      <td className="border border-slate-300 p-1.5 font-bold">{c.name}</td>
                      <td className="border border-slate-300 p-1.5">{c.designation} ({c.cadre})</td>
                      <td className="border border-slate-300 p-1.5 text-center font-mono">{c.fit_percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="leading-relaxed">
                2. The officers shall report to the Nodal Director General for orientation and baseline sprint clearance.
              </p>

              <div className="pt-8 flex justify-end text-right font-sans">
                <div>
                  <div className="font-bold">Rajesh K. Verma, ISS</div>
                  <div className="text-[11px] text-slate-600">Deputy Director General (Administration)</div>
                  <div className="text-[11px] text-slate-600">Ministry of Statistics &amp; Programme Implementation</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Order</span>
              </button>
              <button
                onClick={() => setShowOrderModal(false)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
