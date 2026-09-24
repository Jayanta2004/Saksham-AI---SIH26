import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Printer,
  Copy,
  Check,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  Download,
  AlertCircle,
  ShieldAlert,
  Loader2,
  RefreshCw,
  Sliders,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function PolicyBriefGenerator() {
  const { user } = useAuth();

  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('tpl_gdp');
  const [referencePeriod, setReferencePeriod] = useState('Q1 (Apr–Jun) 2026-27');
  const [formatType, setFormatType] = useState('Official Press Note');
  const [metricValues, setMetricValues] = useState({});
  const [userNotes, setUserNotes] = useState('');

  const [synthesizing, setSynthesizing] = useState(false);
  const [generatedBrief, setGeneratedBrief] = useState(null);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('document'); // 'document' | 'raw'

  // Fetch templates on mount
  useEffect(() => {
    let isMounted = true;
    const fetchTemplates = async () => {
      try {
        const res = await api.get('/api/policy-briefs/templates');
        if (isMounted && res.data?.templates) {
          setTemplates(res.data.templates);
          const first = res.data.templates[0];
          if (first) {
            setSelectedTemplateId(first.id);
            setReferencePeriod(first.default_period);
            const initialMetrics = {};
            first.primary_metrics.forEach(m => {
              initialMetrics[m.name] = m.default_val;
            });
            setMetricValues(initialMetrics);
          }
        }
      } catch (err) {
        console.error('Failed to load templates:', err);
      }
    };
    fetchTemplates();
    return () => { isMounted = false; };
  }, []);

  const activeTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

  const handleTemplateChange = (templateId) => {
    setSelectedTemplateId(templateId);
    const tpl = templates.find(t => t.id === templateId);
    if (tpl) {
      setReferencePeriod(tpl.default_period);
      const initialMetrics = {};
      tpl.primary_metrics.forEach(m => {
        initialMetrics[m.name] = m.default_val;
      });
      setMetricValues(initialMetrics);
    }
  };

  const handleMetricChange = (metricName, val) => {
    setMetricValues(prev => ({
      ...prev,
      [metricName]: val
    }));
  };

  const handleGenerate = async () => {
    setSynthesizing(true);
    try {
      const res = await api.post('/api/policy-briefs/generate', {
        template_id: selectedTemplateId,
        reference_period: referencePeriod,
        format_type: formatType,
        metrics: metricValues,
        user_notes: userNotes
      });
      if (res.data?.success) {
        setGeneratedBrief(res.data.brief);
      }
    } catch (err) {
      console.error('Failed to synthesize policy brief:', err);
    } finally {
      setSynthesizing(false);
    }
  };

  // Trigger initial generation once templates load
  useEffect(() => {
    if (templates.length > 0 && !generatedBrief) {
      handleGenerate();
    }
  }, [templates]);

  const handleCopyText = () => {
    if (!generatedBrief) return;
    const text = `
GOVERNMENT OF INDIA
MINISTRY OF STATISTICS AND PROGRAMME IMPLEMENTATION
${generatedBrief.division.toUpperCase()}

${generatedBrief.release_number}
${generatedBrief.embargo_notice}
Date of Release: ${generatedBrief.release_date}

${generatedBrief.title.toUpperCase()}
Reference Period: ${generatedBrief.reference_period}

EXECUTIVE SUMMARY:
${generatedBrief.executive_summary}

KEY STATISTICAL INDICATORS:
${generatedBrief.metrics_table.map(m => `- ${m.name}: ${m.value}`).join('\n')}

POLICY IMPLICATIONS:
${generatedBrief.policy_implications}

METHODOLOGICAL COMPLIANCE:
${generatedBrief.methodology_note}

Authorized Signatory:
${generatedBrief.signatory.name}
${generatedBrief.signatory.designation}
${generatedBrief.signatory.institution}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Banner (High-Contrast Light Theme) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50/90 via-white to-indigo-50/90 border border-blue-200 p-6 md:p-8 shadow-sm">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-900 border border-blue-300">
              <Sparkles className="w-3.5 h-3.5 text-blue-700" />
              Automated Statistical Policy Studio
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
              <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
              MoSPI Standard Publication Format
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Official Press Note & Executive Policy Brief Synthesizer
          </h1>
          <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
            Synthesizes official Government of India statistical press releases, cabinet summaries, and economic policy briefs directly from microdata indicators with methodology citations and policy implications.
          </p>
        </div>
      </div>

      {/* Main Dual-Pane Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Parameter Configuration & Indicator Controls (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              Dataset & Parameter Configuration
            </h2>
            <p className="text-xs text-slate-500">
              Select an official MoSPI statistical release and adjust parameter inputs.
            </p>
          </div>

          {/* 1. Template Selector Cards */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Statistical Release Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {templates.map(tpl => (
                <button
                  key={tpl.id}
                  onClick={() => handleTemplateChange(tpl.id)}
                  className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
                    selectedTemplateId === tpl.id
                      ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900 line-clamp-1">{tpl.title}</div>
                  <div className="text-[10px] text-blue-700 font-semibold">{tpl.division.split('(')[0]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Reference Period & Document Format */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Reference Period</label>
              <select
                value={referencePeriod}
                onChange={e => setReferencePeriod(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {activeTemplate?.period_options?.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Target Publication Format</label>
              <select
                value={formatType}
                onChange={e => setFormatType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Official Press Note">Official Press Note (Media)</option>
                <option value="Cabinet Note">Union Cabinet Policy Summary</option>
                <option value="Executive Brief">Executive Cadre Digest</option>
              </select>
            </div>
          </div>

          {/* 3. Editable Primary Metrics */}
          {activeTemplate && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Indicator Benchmark Values</label>
                <span className="text-[10px] text-slate-400">Click to adjust simulation</span>
              </div>

              <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {activeTemplate.primary_metrics.map(m => (
                  <div key={m.name} className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-slate-600 truncate max-w-[210px]">{m.name}</span>
                    <input
                      type="text"
                      value={metricValues[m.name] || m.default_val}
                      onChange={e => handleMetricChange(m.name, e.target.value)}
                      className="w-24 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 text-right focus:outline-none focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Officer Context & Notes */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Specific Directive or Context (Optional)</label>
            <textarea
              rows={2}
              value={userNotes}
              onChange={e => setUserNotes(e.target.value)}
              placeholder="e.g. Highlight domestic manufacturing momentum and capital goods capex expansion."
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Generate Action Button */}
          <button
            onClick={handleGenerate}
            disabled={synthesizing}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] disabled:opacity-60"
          >
            {synthesizing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Synthesizing Official Document...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Synthesize Official Policy Brief
              </>
            )}
          </button>
        </div>

        {/* Right Column: Live Document Studio & Official Press Release Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Action Toolbar */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-semibold text-slate-600">
              <button
                onClick={() => setViewMode('document')}
                className={`px-3 py-1 rounded-md transition-all ${
                  viewMode === 'document' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                Official Masthead View
              </button>
              <button
                onClick={() => setViewMode('raw')}
                className={`px-3 py-1 rounded-md transition-all ${
                  viewMode === 'raw' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                Structured Tables
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyText}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
                title="Copy entire document"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>
            </div>
          </div>

          {/* Official Document Canvas */}
          {generatedBrief ? (
            <div
              id="printable-policy-brief"
              className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-lg text-slate-900 space-y-6 relative overflow-hidden"
              style={{ minHeight: '680px' }}
            >
              {/* Government of India Header & Ashoka Emblem */}
              <div className="text-center space-y-1.5 border-b-2 border-slate-900 pb-4">
                <div className="w-12 h-12 mx-auto mb-1 flex items-center justify-center">
                  {/* Ashoka Pillar Emblem Vector Representation */}
                  <svg viewBox="0 0 100 100" className="w-10 h-10 text-slate-800">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="4" />
                    <circle cx="50" cy="50" r="8" fill="currentColor" />
                    {[...Array(24)].map((_, i) => (
                      <line
                        key={i}
                        x1="50"
                        y1="50"
                        x2={50 + 36 * Math.cos((i * 15 * Math.PI) / 180)}
                        y2={50 + 36 * Math.sin((i * 15 * Math.PI) / 180)}
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    ))}
                  </svg>
                </div>
                <h2 className="text-xs uppercase tracking-widest font-black text-slate-800">Government of India</h2>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Ministry of Statistics & Programme Implementation
                </h3>
                <h4 className="text-xs font-semibold text-slate-600">
                  {generatedBrief.division}
                </h4>
              </div>

              {/* Release Metadata Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono border-b border-slate-200 pb-3 gap-1">
                <div>
                  <span className="font-bold text-slate-900">{generatedBrief.release_number}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-600">New Delhi, Date: <strong>{generatedBrief.release_date}</strong></span>
                </div>
              </div>

              {/* Embargo Warning */}
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-center font-bold text-[11px] tracking-wide uppercase flex items-center justify-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>{generatedBrief.embargo_notice}</span>
              </div>

              {/* Document Title */}
              <div className="text-center space-y-1 py-1">
                <h1 className="text-lg sm:text-xl font-black text-slate-950 uppercase tracking-tight">
                  {generatedBrief.title}
                </h1>
                <div className="inline-block px-3 py-0.5 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase">
                  Reference Period: {generatedBrief.reference_period}
                </div>
              </div>

              {/* Headline Callout Badge */}
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 p-4 rounded-xl border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-blue-900 block">{generatedBrief.headline_metric}</span>
                  <span className="text-xs text-slate-600">Primary Macroeconomic Benchmark</span>
                </div>
                <div className="text-3xl font-black text-blue-700 tracking-tight">
                  {generatedBrief.headline_value}
                </div>
              </div>

              {/* Executive Summary */}
              <div className="space-y-2 text-xs leading-relaxed text-slate-800">
                <h3 className="font-black uppercase tracking-wider text-slate-900 text-xs flex items-center gap-1.5 border-b border-slate-100 pb-1">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  1. Executive Summary & Key Highlights
                </h3>
                <p className="text-justify leading-relaxed">{generatedBrief.executive_summary}</p>
              </div>

              {/* Statistical Indicators Table */}
              <div className="space-y-2">
                <h3 className="font-black uppercase tracking-wider text-slate-900 text-xs flex items-center gap-1.5 border-b border-slate-100 pb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                  2. Detailed Statistical Statement
                </h3>

                <div className="border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                      <tr>
                        <th className="p-2.5">Indicator / Sector Description</th>
                        <th className="p-2.5 text-right">Value Recorded</th>
                        <th className="p-2.5 text-right">Unit of Measure</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {generatedBrief.metrics_table.map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                          <td className="p-2.5 font-medium text-slate-800">{row.name}</td>
                          <td className="p-2.5 text-right font-bold text-slate-950">{row.value}</td>
                          <td className="p-2.5 text-right text-slate-500 font-mono text-[11px]">{row.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Policy Implications */}
              <div className="space-y-2 text-xs leading-relaxed text-slate-800">
                <h3 className="font-black uppercase tracking-wider text-slate-900 text-xs flex items-center gap-1.5 border-b border-slate-100 pb-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  3. Strategic Policy Implications
                </h3>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 whitespace-pre-line text-slate-800 leading-relaxed font-sans">
                  {generatedBrief.policy_implications}
                </div>
              </div>

              {/* Methodology & Data Source */}
              <div className="space-y-1 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block">4. Methodological Compliance & Data Sources:</span>
                <p className="leading-relaxed">{generatedBrief.methodology_note}</p>
              </div>

              {/* Signatory Block */}
              <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-xs">
                <div className="text-[10px] text-slate-400 space-y-0.5">
                  <p>Document Generated via SAKSHAM AI</p>
                  <p>National Data Informatics & Innovation Division (DIID)</p>
                </div>

                <div className="text-right space-y-1">
                  <div className="font-serif italic font-bold text-blue-900 text-sm">
                    {generatedBrief.signatory.name}
                  </div>
                  <div className="font-semibold text-slate-800">{generatedBrief.signatory.designation}</div>
                  <div className="text-[11px] text-slate-500">{generatedBrief.signatory.institution}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center text-slate-400 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
              <p className="text-xs">Synthesizing statistical brief...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
