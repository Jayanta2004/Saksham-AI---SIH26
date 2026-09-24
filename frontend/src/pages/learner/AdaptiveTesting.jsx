import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Zap,
  Sliders,
  ShieldCheck,
  ChevronRight,
  Loader2,
  Activity,
  Layers,
  BookOpen
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdaptiveTesting() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('National Accounts (SNA 2008)');
  const [testState, setTestState] = useState('idle'); // 'idle' | 'in_progress' | 'completed'

  // Session state
  const [sessionId, setSessionId] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(5);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentTheta, setCurrentTheta] = useState(0.0);
  const [trajectory, setTrajectory] = useState([{ step: 0, theta: 0.0, se: 1.0 }]);
  const [previousFeedback, setPreviousFeedback] = useState(null);

  // Form state
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [finalResults, setFinalResults] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchDomains = async () => {
      try {
        const res = await api.get('/api/adaptive-test/domains');
        if (isMounted && res.data?.domains) {
          setDomains(res.data.domains);
          setSelectedDomain(res.data.domains[0]?.name || 'National Accounts (SNA 2008)');
        }
      } catch (err) {
        console.error('Failed to load domains:', err);
      }
    };
    fetchDomains();
    return () => { isMounted = false; };
  }, []);

  const handleStartTest = async () => {
    setSubmitting(true);
    setPreviousFeedback(null);
    try {
      const res = await api.post('/api/adaptive-test/start', {
        domain: selectedDomain
      });
      if (res.data?.success) {
        setSessionId(res.data.session_id);
        setCurrentStep(res.data.step);
        setTotalSteps(res.data.total_steps);
        setCurrentItem(res.data.item);
        setCurrentTheta(res.data.current_theta);
        setTrajectory([{ step: 0, theta: res.data.current_theta, se: 1.0 }]);
        setSelectedOption(null);
        setTestState('in_progress');
      }
    } catch (err) {
      console.error('Failed to start CAT test:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (selectedOption === null || !sessionId || !currentItem) return;
    setSubmitting(true);
    try {
      const res = await api.post('/api/adaptive-test/submit-answer', {
        session_id: sessionId,
        item_id: currentItem.id,
        selected_option_index: selectedOption
      });

      if (res.data?.success) {
        if (res.data.test_completed) {
          setFinalResults(res.data.final_results);
          setTestState('completed');
        } else {
          setCurrentStep(res.data.step);
          setCurrentItem(res.data.item);
          setCurrentTheta(res.data.current_theta);
          setTrajectory(res.data.trajectory || []);
          setPreviousFeedback(res.data.previous_feedback);
          setSelectedOption(null);
        }
      }
    } catch (err) {
      console.error('Failed to submit answer:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Banner (High-Contrast Light Theme) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-50/90 via-white to-blue-50/90 border border-purple-200 p-6 md:p-8 shadow-sm">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-900 border border-purple-300">
              <Brain className="w-3.5 h-3.5 text-purple-700" />
              2-Parameter Logistic (2PL) Item Response Theory
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
              <Zap className="w-3.5 h-3.5 text-emerald-700" />
              Maximum Fisher Information (CAT)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Adaptive Computerized Diagnostic Testing Arena
          </h1>
          <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
            Dynamic psychometric assessment where question difficulty automatically recalibrates in real-time based on your responses, converging on your true latent statistical ability (&theta;) with mathematical precision.
          </p>
        </div>
      </div>

      {/* State 1: Pre-Test Domain Selection */}
      {testState === 'idle' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 max-w-3xl mx-auto">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-600" />
              Select Statistical Competency Domain
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Choose the official statistical domain to benchmark your latent ability score (&theta;).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {domains.map(d => (
              <button
                key={d.name}
                onClick={() => setSelectedDomain(d.name)}
                className={`p-4 rounded-xl border text-left transition-all space-y-2 ${
                  selectedDomain === d.name
                    ? 'border-purple-600 bg-purple-50/70 shadow-xs ring-1 ring-purple-500'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{d.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-semibold">
                    {d.item_count} Calibrated Items
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Target Competency: <strong className="text-slate-700">{d.competency_id}</strong>
                </p>
              </button>
            ))}
          </div>

          {/* Psychometric Explanation Callout */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-600" />
              How the Adaptive IRT Algorithm Works
            </div>
            <ul className="text-slate-600 space-y-1 list-disc list-inside leading-relaxed text-[11px]">
              <li>Initial baseline begins at neutral ability (&theta; = 0.0).</li>
              <li>A correct answer immediately triggers a harder item with higher discrimination (a) and difficulty (b).</li>
              <li>An incorrect answer steps down to pinpoint foundational capability boundaries.</li>
              <li>Within <strong>5 adaptive items</strong>, the system mathematically converges on your latent ability (&theta; &plusmn; 1.96 SE).</li>
            </ul>
          </div>

          <button
            onClick={handleStartTest}
            disabled={submitting}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Calibrating Item Bank...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Launch Adaptive IRT Diagnostic
              </>
            )}
          </button>
        </div>
      )}

      {/* State 2: Active CAT Testing Arena */}
      {testState === 'in_progress' && currentItem && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Question Arena & Option Selection (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            {/* Step & Difficulty Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
                  Adaptive Item {currentStep} of {totalSteps}
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  currentItem.difficulty > 1.0 
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : currentItem.difficulty < -0.5
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-blue-100 text-blue-800 border border-blue-300'
                }`}>
                  Difficulty: {currentItem.difficulty_label} (b = {currentItem.difficulty})
                </span>
              </div>
              <span className="text-xs font-mono text-slate-500 font-semibold">
                &theta; = {currentTheta >= 0 ? `+${currentTheta}` : currentTheta}
              </span>
            </div>

            {/* Previous Feedback Note if available */}
            {previousFeedback && (
              <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 transition-all animate-in fade-in duration-200 ${
                previousFeedback.is_correct
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                {previousFeedback.is_correct ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5">
                  <span className="font-bold">
                    {previousFeedback.is_correct ? 'Correct! Algorithm calibrated upward.' : 'Incorrect. Algorithm calibrated difficulty down.'}
                  </span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{previousFeedback.explanation}</p>
                </div>
              </div>
            )}

            {/* Question Text */}
            <div className="space-y-2">
              <span className="text-xs text-purple-700 font-bold uppercase tracking-wider block">
                {selectedDomain}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                {currentItem.question}
              </h3>
            </div>

            {/* 4-Option Radio Selection */}
            <div className="space-y-2.5">
              {currentItem.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 text-xs leading-relaxed ${
                    selectedOption === idx
                      ? 'border-purple-600 bg-purple-50/70 font-semibold text-purple-950 ring-1 ring-purple-500 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                    selectedOption === idx
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-600 border border-slate-300'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null || submitting}
                className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating Latent Ability (&theta;)...
                  </>
                ) : (
                  <>
                    <span>Submit & Recalibrate Ability</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Live Latent Ability Trajectory Curve (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-600" />
                Live Latent Ability Trajectory (&theta;)
              </h3>
              <p className="text-[11px] text-slate-500">
                Visualizing MLE ability convergence as responses are processed.
              </p>
            </div>

            {/* Trajectory Plot Canvas */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500">Current Estimate:</span>
                <span className="text-purple-700 font-mono text-sm">
                  &theta; = {currentTheta >= 0 ? `+${currentTheta}` : currentTheta}
                </span>
              </div>

              {/* Step Visualization Bar Graph / Trajectory */}
              <div className="space-y-2 pt-2">
                {trajectory.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <span className="w-16 font-mono text-slate-500 text-[10px]">
                      {t.step === 0 ? 'Baseline' : `Item ${t.step}`}
                    </span>
                    <div className="flex-1 bg-slate-200 h-2.5 rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.max(10, ((t.theta + 2.5) / 5.0) * 100))}%` }}
                      />
                    </div>
                    <span className="w-12 text-right font-mono font-bold text-slate-800 text-[11px]">
                      {t.theta >= 0 ? `+${t.theta}` : t.theta}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ability Scale Legend */}
            <div className="p-3 bg-purple-50/70 border border-purple-200/70 rounded-xl space-y-1.5 text-[11px] text-purple-900">
              <span className="font-bold block">Latent Scale Guide:</span>
              <div className="flex justify-between text-slate-600 text-[10px]">
                <span>&theta; &le; -1.0 (Foundational)</span>
                <span>&theta; = 0.0 (Average)</span>
                <span>&theta; &ge; +1.5 (Advanced SME)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* State 3: Post-Test Calibration Dossier */}
      {testState === 'completed' && finalResults && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header & Score Callout */}
          <div className="text-center space-y-3 border-b border-slate-100 pb-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider">
                CAT Recalibration Complete
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Official Competency Level Calibrated
              </h2>
              <p className="text-xs text-slate-500">
                Domain: <strong>{finalResults.domain}</strong> | 2PL Item Response Theory Convergence
              </p>
            </div>

            {/* Score Callout Card */}
            <div className="max-w-md mx-auto bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 p-6 rounded-2xl border border-purple-200 shadow-xs space-y-2">
              <div className="text-4xl font-black text-purple-900">
                {finalResults.mospi_competency_scale_score} <span className="text-lg font-bold text-slate-500">/ 5.0</span>
              </div>
              <div className="text-sm font-bold text-purple-800">
                Performance Tier: {finalResults.performance_tier}
              </div>
              <p className="text-xs text-slate-600 font-mono">
                Converged Latent Ability (&theta;): <strong>{finalResults.final_latent_ability_theta >= 0 ? `+${finalResults.final_latent_ability_theta}` : finalResults.final_latent_ability_theta}</strong> (SE = {finalResults.standard_error})
              </p>
            </div>
          </div>

          {/* Administered Items Breakdown */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-600" />
              Item Administration & Fisher Information Audit
            </h3>

            <div className="space-y-3">
              {finalResults.detailed_responses?.map((r, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                    r.is_correct ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-2">
                      {r.is_correct ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600" />
                      )}
                      Item {idx + 1} (Difficulty b = {r.difficulty}, Discrimination a = {r.discrimination})
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      Post-Item &theta;: <strong>{r.theta_after >= 0 ? `+${r.theta_after}` : r.theta_after}</strong>
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    <strong>Technical Explanation:</strong> {r.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                setTestState('idle');
                setFinalResults(null);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Test Another Domain
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              View Recalibrated Competency Radar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
