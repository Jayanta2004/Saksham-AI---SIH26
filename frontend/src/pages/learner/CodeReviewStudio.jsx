import React, { useState, useEffect } from 'react';
import {
  Code2,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  GitPullRequest,
  Check,
  Send,
  Sparkles,
  Bot,
  User,
  Clock,
  ChevronRight,
  Copy,
  Layers,
  Search,
  ExternalLink,
  BookOpen,
  Filter,
  Eye,
  RefreshCw,
  Terminal,
  ShieldCheck
} from 'lucide-react';

const API_BASE = '/api/codereview';

export default function CodeReviewStudio() {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubId, setSelectedSubId] = useState('scrutiny-plfs-ur-01');
  const [currentSub, setCurrentSub] = useState(null);
  const [activeView, setActiveView] = useState('annotated'); // 'annotated' | 'diff' | 'ai-bot'
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);
  const [appliedRemediation, setAppliedRemediation] = useState(false);
  const [copied, setCopied] = useState(false);

  // Peer Review Form State
  const [reviewerName, setReviewerName] = useState('ISS Probationer Reviewer');
  const [reviewVerdict, setReviewVerdict] = useState('Changes Requested');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // AI Live Bot Playground State
  const [customCode, setCustomCode] = useState(
`import pandas as pd

# Process raw survey file
data = pd.read_csv("plfs_extract.csv")

# Compute unweighted average
average_wage = data['daily_earnings'].mean()
print("Average wage:", average_wage)

# Save unmasked records
data[['person_name', 'daily_earnings']].to_csv("wage_report.csv")`
  );
  const [customLang, setCustomLang] = useState('python');
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    if (selectedSubId) {
      fetchSubmissionDetail(selectedSubId);
      setAppliedRemediation(false);
    }
  }, [selectedSubId]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/submissions`);
      const data = await res.json();
      if (data.success) {
        setSubmissions(data.submissions);
        if (data.submissions.length > 0 && !selectedSubId) {
          setSelectedSubId(data.submissions[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissionDetail = async (id) => {
    setSubLoading(true);
    try {
      const res = await fetch(`${API_BASE}/submission/${id}`);
      const data = await res.json();
      if (data.success) {
        setCurrentSub(data.submission);
      }
    } catch (err) {
      console.error('Error fetching submission detail:', err);
    } finally {
      setSubLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await fetch(`${API_BASE}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_id: selectedSubId,
          reviewer_name: reviewerName,
          verdict: reviewVerdict,
          comment: reviewComment
        })
      });
      const data = await res.json();
      if (data.success) {
        setReviewComment('');
        fetchSubmissionDetail(selectedSubId);
        fetchSubmissions();
      }
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleRunAiAnalysis = async () => {
    setAiAnalyzing(true);
    try {
      const res = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: customCode, language: customLang })
      });
      const data = await res.json();
      if (data.success) {
        setAiAnalysisResult(data);
      }
    } catch (err) {
      console.error('Error running AI code analysis:', err);
    } finally {
      setAiAnalyzing(false);
    }
  };

  const copyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-8">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 shrink-0">
              <Code2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  MoSPI DQSW Code Governance
                </span>
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  Data Quality & Software Wing
                </span>
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  DPDPA 2023 & Multiplier Audit
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                Statistical Code Review & Peer-Scrutiny Room
              </h1>
              <p className="text-sm text-slate-600 mt-1 max-w-3xl">
                Collaborative peer-review environment for ISS probationers and SSS analysts. Inspects Python & R estimation scripts for missing survey sampling multipliers, accounting identity contradictions, and statutory privacy leaks prior to national pipeline ingestion.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('ai-bot')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl border border-slate-300 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Bot className="w-4 h-4 text-indigo-600" />
              <span>AI Scrutinizer Bot</span>
            </button>
            <button
              onClick={() => {
                setActiveView('diff');
                setAppliedRemediation(true);
              }}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Auto-Remediate Code</span>
            </button>
          </div>
        </div>

        {/* Global Pipeline Health KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Peer Tickets</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{submissions.length} Pipelines</div>
            <div className="text-xs text-slate-500 mt-0.5">PLFS, ASI, HCES Schedule Scripts</div>
          </div>

          <div className="bg-rose-50/60 rounded-xl p-3.5 border border-rose-200/80">
            <div className="text-xs font-medium text-rose-700 uppercase tracking-wider flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Critical Methodological Flaws</span>
            </div>
            <div className="text-2xl font-bold text-rose-700 mt-1">4 Blockers</div>
            <div className="text-xs text-rose-600 mt-0.5">Unweighted Means & DPDPA Leaks</div>
          </div>

          <div className="bg-amber-50/60 rounded-xl p-3.5 border border-amber-200/80">
            <div className="text-xs font-medium text-amber-700 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Missing Data Distortions</span>
            </div>
            <div className="text-2xl font-bold text-amber-700 mt-1">2 Warnings</div>
            <div className="text-xs text-amber-600 mt-0.5">Listwise Deletions Flagged</div>
          </div>

          <div className="bg-emerald-50/60 rounded-xl p-3.5 border border-emerald-200/80">
            <div className="text-xs font-medium text-emerald-700 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Pipeline Approval Rate</span>
            </div>
            <div className="text-2xl font-bold text-emerald-700 mt-1">33.3%</div>
            <div className="text-xs text-emerald-600 mt-0.5">Requires Senior ISS Sign-off</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Submissions List | Right Interactive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Submissions Explorer */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Scrutiny Queue ({submissions.length})
            </span>
            <span className="text-xs text-indigo-600 font-medium">DQSW Live Registry</span>
          </div>

          {submissions.map(sub => {
            const isSelected = selectedSubId === sub.id;

            return (
              <div
                key={sub.id}
                onClick={() => {
                  setSelectedSubId(sub.id);
                  if (activeView === 'ai-bot') setActiveView('annotated');
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20 shadow-md'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`px-2 py-0.5 text-[11px] font-bold rounded-md uppercase font-mono ${
                      sub.language === 'python' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-blue-100 text-blue-900 border border-blue-300'
                    }`}>
                      {sub.language}
                    </span>
                    <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {sub.survey_round}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    sub.status === 'Approved with Comments'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : sub.status === 'Changes Requested'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {sub.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {sub.title}
                </h4>

                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 font-mono">
                  <FileCode className="w-3.5 h-3.5 text-slate-400" />
                  <span>{sub.filename}</span>
                </div>

                <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-slate-100 text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {sub.author.avatar}
                    </div>
                    <span className="truncate max-w-[120px]">{sub.author.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-rose-600 font-semibold">{sub.annotations_count} issues</span>
                    <span className="text-slate-400">|</span>
                    <span className="text-indigo-600 font-semibold">{sub.reviews_count} reviews</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: Interactive Scrutiny Workspace */}
        <div className="lg:col-span-8">
          {activeView === 'ai-bot' ? (
            /* AI SCRUTINIZER PLAYGROUND */
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-bold text-slate-900">
                      Live AI Statistical Scrutinizer Bot
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Paste any Python or R script to audit statistical methodology, sampling multiplier compliance, and DPDPA confidentiality.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={customLang}
                    onChange={e => setCustomLang(e.target.value)}
                    className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
                  >
                    <option value="python">Python (pandas/numpy)</option>
                    <option value="r">R (dplyr/survey)</option>
                  </select>

                  <button
                    onClick={() => setActiveView('annotated')}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
                  >
                    Back to Tickets
                  </button>
                </div>
              </div>

              {/* Code Input Area */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Statistical Script Input
                </label>
                <textarea
                  rows={8}
                  value={customCode}
                  onChange={e => setCustomCode(e.target.value)}
                  className="w-full p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleRunAiAnalysis}
                  disabled={aiAnalyzing}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{aiAnalyzing ? 'Running Statistical Audit...' : 'Execute AI Scrutiny Audit'}</span>
                </button>
              </div>

              {/* AI Audit Output */}
              {aiAnalysisResult && (
                <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Automated Audit Verdict</h4>
                      <p className="text-xs text-slate-500">Analyzed {aiAnalysisResult.analyzed_lines} lines of code</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-500 uppercase font-bold">Methodology Score</div>
                        <div className="text-lg font-bold text-indigo-600">{aiAnalysisResult.methodology_score}/100</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-500 uppercase font-bold">Security Score</div>
                        <div className="text-lg font-bold text-rose-600">{aiAnalysisResult.security_score}/100</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {aiAnalysisResult.detected_issues.map((iss, i) => (
                      <div key={i} className="bg-white border border-rose-200 rounded-xl p-3.5 text-xs shadow-xs">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 uppercase">
                            Line {iss.line} | {iss.category}
                          </span>
                          <span className="font-bold text-slate-900">{iss.title}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{iss.comment}</p>
                        <div className="text-[10px] text-indigo-700 font-semibold mt-1">
                          Official Standard: {iss.official_ref}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : currentSub ? (
            /* ACTIVE TICKET SCRUTINY WORKSPACE */
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              {/* Workspace Navigation Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      {currentSub.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span>Author: <strong className="text-slate-800">{currentSub.author.name}</strong> ({currentSub.author.cadre})</span>
                    <span>•</span>
                    <span>{currentSub.author.division}</span>
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
                  <button
                    onClick={() => setActiveView('annotated')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      activeView === 'annotated' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Annotated Code
                  </button>
                  <button
                    onClick={() => setActiveView('diff')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      activeView === 'diff' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Remediation Diff
                  </button>
                </div>
              </div>

              {/* Sub-Header Integrity Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block">Methodology Integrity:</span>
                  <span className="font-bold text-sm text-slate-900">{currentSub.methodology_score} / 100</span>
                </div>
                <div>
                  <span className="text-slate-500 block">DPDPA 2023 Rating:</span>
                  <span className={`font-bold text-sm ${currentSub.security_score < 70 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {currentSub.security_score} / 100
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Identified Flaws:</span>
                  <span className="font-bold text-sm text-rose-600">{currentSub.annotations.length} Line Flags</span>
                </div>
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => copyCode(appliedRemediation ? currentSub.remediated_code : currentSub.original_code)}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>
              </div>

              {/* CODE DISPLAY AREA */}
              {activeView === 'annotated' ? (
                <div className="space-y-4">
                  <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs overflow-x-auto border border-slate-800 text-slate-200 leading-relaxed">
                    <pre>
                      {currentSub.original_code.split('\n').map((line, idx) => {
                        const lineNum = idx + 1;
                        const annotation = currentSub.annotations.find(a => a.line === lineNum);

                        return (
                          <div
                            key={idx}
                            className={`flex items-start gap-4 px-2 py-0.5 rounded ${
                              annotation
                                ? annotation.type === 'critical'
                                  ? 'bg-rose-950/60 border-l-4 border-rose-500 text-rose-200'
                                  : annotation.type === 'security'
                                  ? 'bg-purple-950/60 border-l-4 border-purple-500 text-purple-200'
                                  : 'bg-amber-950/60 border-l-4 border-amber-500 text-amber-200'
                                : 'hover:bg-slate-900/60'
                            }`}
                          >
                            <span className="text-slate-600 select-none w-6 text-right shrink-0">{lineNum}</span>
                            <span className="flex-1 whitespace-pre">{line}</span>
                            {annotation && (
                              <span className="px-1.5 py-0.5 text-[10px] rounded bg-rose-600 text-white font-bold shrink-0 uppercase">
                                {annotation.category}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </pre>
                  </div>

                  {/* Line Annotation Drawers */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Flagged Line Scrutiny Explanations ({currentSub.annotations.length})
                    </div>

                    {currentSub.annotations.map((ann, i) => (
                      <div
                        key={i}
                        className={`rounded-xl p-4 border text-xs space-y-1.5 ${
                          ann.type === 'critical'
                            ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                            : ann.type === 'security'
                            ? 'bg-purple-50/70 border-purple-200 text-purple-900'
                            : 'bg-amber-50/70 border-amber-200 text-amber-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-white border border-current">
                              Line {ann.line} • {ann.category}
                            </span>
                            <span className="font-bold text-slate-900 text-sm">{ann.title}</span>
                          </div>
                          <span className="text-[10px] uppercase font-bold tracking-wider">
                            {ann.type}
                          </span>
                        </div>

                        <p className="text-slate-700 leading-relaxed">{ann.comment}</p>

                        <div className="text-[11px] font-semibold text-indigo-700 flex items-center gap-1 pt-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Official Citation: {ann.official_ref}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* REMEDIATION DIFF VIEW */
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold">Remediated MoSPI Standard Implementation</span>
                    </div>
                    <span className="text-emerald-700 font-medium">Weighted Estimation + DPDPA Anonymization</span>
                  </div>

                  <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs overflow-x-auto border border-slate-800 text-emerald-400 leading-relaxed">
                    <pre>
                      {currentSub.remediated_code.split('\n').map((line, idx) => (
                        <div key={idx} className="flex items-start gap-4 px-2 py-0.5 hover:bg-slate-900/60">
                          <span className="text-slate-600 select-none w-6 text-right shrink-0">{idx + 1}</span>
                          <span className="whitespace-pre">{line}</span>
                        </div>
                      ))}
                    </pre>
                  </div>
                </div>
              )}

              {/* Peer Reviewer Discussion & Sign-off Thread */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-600" />
                    <span>Peer Review Log & Cadre Sign-Offs ({currentSub.peer_reviews.length})</span>
                  </h4>
                  <span className="text-xs text-slate-500">Official NSSO Audit History</span>
                </div>

                <div className="space-y-3">
                  {currentSub.peer_reviews.map((rev, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{rev.reviewer}</span>
                          <span className="text-slate-500">({rev.role})</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rev.verdict === 'Changes Requested'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {rev.verdict}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed pt-1">{rev.comment}</p>
                    </div>
                  ))}
                </div>

                {/* Submit New Peer Review Verdict Form */}
                <form onSubmit={handleSubmitReview} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Submit Reviewer Decision
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Reviewing Officer Name
                      </label>
                      <input
                        type="text"
                        value={reviewerName}
                        onChange={e => setReviewerName(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Official Verdict
                      </label>
                      <select
                        value={reviewVerdict}
                        onChange={e => setReviewVerdict(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                      >
                        <option value="Changes Requested">Changes Requested (Methodology / Multiplier Flaw)</option>
                        <option value="Approved with Comments">Approve for Central Pipeline Ingestion</option>
                        <option value="Flagged for Committee">Refer to Methodological Committee</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Scrutiny Remarks & Directive
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Add specific methodological instructions or verify multiplier calculations..."
                      value={reviewComment}
                      onChange={e => setReviewComment(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submittingReview ? 'Submitting...' : 'Post Scrutiny Verdict'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
              Select a statistical code submission to inspect
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
