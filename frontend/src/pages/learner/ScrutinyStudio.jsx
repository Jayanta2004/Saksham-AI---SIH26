import React, { useState, useEffect } from 'react';
import {
  SearchCheck,
  ShieldAlert,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Printer,
  Download,
  Activity,
  BarChart3,
  Layers,
  Database,
  Filter,
  FileText,
  Clock,
  Send,
  Building,
  Users,
  Search,
  CheckCircle
} from 'lucide-react';

export default function ScrutinyStudio() {
  const [datasets, setDatasets] = useState([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState('hces_round_80_scrutiny');
  const [loading, setLoading] = useState(true);
  const [auditing, setAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMemo, setShowMemo] = useState(false);

  // Enabled audit checks
  const [checks, setChecks] = useState({
    benford: true,
    logical_rules: true,
    outliers: true,
    capi_velocity: true
  });

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/scrutiny/datasets`);
      const data = await res.json();
      if (data.success && data.datasets) {
        setDatasets(data.datasets);
        // Automatically run initial audit on first dataset
        runAudit(data.datasets[0].id);
      }
    } catch (err) {
      console.error('Failed to load scrutiny datasets:', err);
    } finally {
      setLoading(false);
    }
  };

  const runAudit = async (datasetId = selectedDatasetId) => {
    setAuditing(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/scrutiny/run-audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataset_id: datasetId,
          enabled_checks: checks
        })
      });
      const data = await res.json();
      if (data.success) {
        setAuditResult(data);
      }
    } catch (err) {
      console.error('Failed to execute scrutiny audit:', err);
    } finally {
      setAuditing(false);
    }
  };

  const handleSelectDataset = (id) => {
    setSelectedDatasetId(id);
    runAudit(id);
  };

  // Filtered schedules
  const filteredSchedules = auditResult?.flagged_schedules?.filter(s => {
    if (filterSeverity !== 'ALL' && s.severity !== filterSeverity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.schedule_id.toLowerCase().includes(q) ||
        s.fsu_no.toLowerCase().includes(q) ||
        s.enumerator_id.toLowerCase().includes(q) ||
        s.rule_violated.toLowerCase().includes(q)
      );
    }
    return true;
  }) || [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Banner (Light Theme) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-50/90 via-white to-blue-50/90 border border-amber-200 p-6 md:p-8 shadow-sm">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                  NSSO Data Quality Scrutiny Wing (DQSW)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-900 border border-blue-200">
                  <BarChart3 className="w-3.5 h-3.5 text-blue-700" />
                  Benford's Law Chi-Square Engine
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
                  Automated Scrutiny Office Memo
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
                Statistical Forensics & Data Scrutiny Studio
                <span className="text-xs font-bold uppercase px-2.5 py-1 bg-amber-100 text-amber-900 rounded border border-amber-300">
                  MoSPI Anomaly Detective
                </span>
              </h1>
              <p className="text-slate-600 text-sm md:text-base max-w-3xl leading-relaxed">
                Algorithmic quality assurance for primary survey schedules. Executes automated first-digit Benford distribution analysis, solvency checks, CAPI tablet telemetry velocity audits, and accounting identity reconciliations, automatically generating formal MoSPI Scrutiny Office Memorandums.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto bg-white/90 p-3 rounded-xl border border-slate-200 shadow-sm flex-shrink-0">
              <button
                onClick={() => runAudit(selectedDatasetId)}
                disabled={auditing}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-lg text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-amber-600/20 cursor-pointer disabled:opacity-50"
              >
                {auditing ? <Activity className="w-4 h-4 animate-spin" /> : <SearchCheck className="w-4 h-4" />}
                Re-Run Forensic Audit
              </button>
            </div>
          </div>
        </div>

        {/* Dataset Selector Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-600" />
                Select Survey Dataset for Quality Scrutiny
              </h2>
              <p className="text-xs text-slate-500">
                Choose an official microdata return batch to scan for fabrication, digit heaping, and logical contradictions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {datasets.map((d) => {
              const isSelected = selectedDatasetId === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => handleSelectDataset(d.id)}
                  className={`cursor-pointer rounded-2xl border p-5 transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-50/50 border-amber-500 shadow-md ring-2 ring-amber-400/40'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        Round {d.round_no}
                      </span>
                      <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-amber-600" />
                        {d.sample_size} Schedules
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                        {d.title}
                      </h3>
                      <p className="text-xs text-amber-800 font-semibold mt-0.5">
                        {d.division}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {d.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Primary Metric: <strong className="text-slate-700">{d.primary_metric}</strong></span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'bg-amber-600 border-amber-600 text-white' : 'border-slate-300'
                    }`}>
                      {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit Results Dashboard */}
        {auditResult && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Health Score KPI */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Data Health Index</span>
                  <Activity className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">{auditResult.health_index}</span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>
                <div className={`text-xs font-bold ${auditResult.health_color}`}>
                  {auditResult.health_tier}
                </div>
              </div>

              {/* Benford Chi-Square KPI */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Benford's Law Chi-Square</span>
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">χ² = {auditResult.benford_analysis.chi_square_stat}</span>
                </div>
                <div className={`text-xs font-bold ${auditResult.benford_analysis.verdict_color}`}>
                  {auditResult.benford_analysis.verdict}
                </div>
              </div>

              {/* Flagged Issues KPI */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Flagged Schedules</span>
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-red-600">{auditResult.flagged_schedules.length}</span>
                  <span className="text-xs text-slate-400">schedules</span>
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  {auditResult.scrutiny_memo.critical_count} Critical • {auditResult.scrutiny_memo.warning_count} Warnings
                </div>
              </div>

              {/* Scrutiny Memo Status */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Official Scrutiny Memo</span>
                  <FileText className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-sm font-bold text-slate-900">
                  MEMO DISPATCHED
                </div>
                <button
                  onClick={() => setShowMemo(!showMemo)}
                  className="w-full mt-2 py-1.5 px-3 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold transition-all border border-amber-300 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  {showMemo ? 'Hide Scrutiny Memo' : 'View Official NSSO Memo'}
                </button>
              </div>
            </div>

            {/* Benford's Law Digital Analysis Visualization */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-amber-600" />
                    Benford's Law First-Digit Forensic Distribution
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Compares empirical leading-digit distribution against theoretical logarithmic decay $P(d) = \log_{10}(1 + 1/d)$. Significant divergences indicate artificial estimation or digit heaping.
                  </p>
                </div>
                <div className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-2">
                  <span>Goodness-of-Fit:</span>
                  <span className={auditResult.benford_analysis.verdict_color}>{auditResult.benford_analysis.verdict}</span>
                </div>
              </div>

              {/* Bar Comparison Chart */}
              <div className="space-y-4">
                <div className="grid grid-cols-9 gap-2 md:gap-4 items-end h-56 pt-6 px-2 bg-slate-50/70 rounded-xl border border-slate-200">
                  {auditResult.benford_analysis.digits_distribution.map((item) => (
                    <div key={item.digit} className="flex flex-col items-center h-full justify-end gap-1.5">
                      <div className="w-full flex items-end justify-center gap-1 h-44">
                        {/* Observed Bar */}
                        <div
                          className="w-1/2 bg-amber-600 rounded-t transition-all relative group"
                          style={{ height: `${Math.min(100, item.observed_pct * 2.8)}%` }}
                        >
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-900 text-white text-[10px] rounded whitespace-nowrap z-20 pointer-events-none">
                            Observed: {item.observed_pct}% ({item.count})
                          </div>
                        </div>

                        {/* Theoretical Benford Bar */}
                        <div
                          className="w-1/2 bg-slate-300 rounded-t transition-all relative group"
                          style={{ height: `${item.benford_pct * 2.8}%` }}
                        >
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-900 text-white text-[10px] rounded whitespace-nowrap z-20 pointer-events-none">
                            Benford: {item.benford_pct}%
                          </div>
                        </div>
                      </div>

                      <span className="text-xs font-bold text-slate-800 border-t border-slate-200 w-full text-center pt-1">
                        Digit {item.digit}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 text-xs pt-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded bg-amber-600 inline-block" />
                    <span className="text-slate-700 font-semibold">Observed Empirical Frequency (%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded bg-slate-300 inline-block" />
                    <span className="text-slate-500 font-semibold">Theoretical Benford Curve $P(d) = \log_{10}(1 + 1/d)$</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Scrutiny Office Memorandum (Collapsible) */}
            {showMemo && (
              <div className="bg-gradient-to-b from-white via-amber-50/20 to-white border-2 border-amber-300 rounded-3xl p-8 md:p-10 shadow-md space-y-6">
                <div className="text-center space-y-2 border-b border-slate-200 pb-5">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Government of India</div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                    Ministry of Statistics & Programme Implementation (MoSPI)
                  </h3>
                  <div className="text-xs md:text-sm font-bold text-amber-800">
                    {auditResult.scrutiny_memo.issuing_authority}
                  </div>
                  <div className="text-xs text-slate-500 pt-1">
                    Memo Ref No: <code className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono font-bold">{auditResult.scrutiny_memo.memo_number}</code> • Date: <strong className="text-slate-800">{auditResult.scrutiny_memo.date}</strong>
                  </div>
                </div>

                <div className="space-y-4 text-xs md:text-sm leading-relaxed text-slate-700">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-900">SUBJECT:</strong> Algorithmic Quality Scrutiny Findings & Mandatory Field Re-Audit Directives for {auditResult.dataset.title}.
                  </div>

                  <p className="bg-white p-4 rounded-xl border border-slate-200 text-slate-800 font-serif italic leading-relaxed">
                    "{auditResult.scrutiny_memo.executive_summary}"
                  </p>

                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Operational Directives to Field Operations Division (FOD):
                    </h4>
                    <div className="space-y-2">
                      {auditResult.scrutiny_memo.directives.map((directive, idx) => (
                        <div key={idx} className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-slate-800 font-medium">
                          {directive}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap items-center justify-between border-t border-slate-200 text-xs text-slate-500">
                    <div>
                      Issuing Authority: <strong className="text-slate-900">{auditResult.scrutiny_memo.nodal_officer}</strong>
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Print Official Memorandum
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Flagged Schedules Table */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-red-600" />
                    Flagged Schedule Scrutiny Ledger ({filteredSchedules.length} Items)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click each entry to inspect specific mathematical violations and supervisory corrective orders.
                  </p>
                </div>

                {/* Filter and Search Controls */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search Schedule, FSU, Enum..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-3 py-1.5 bg-slate-50 text-slate-800 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 w-48"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
                    <button
                      onClick={() => setFilterSeverity('ALL')}
                      className={`px-3 py-1 rounded-md transition-all ${
                        filterSeverity === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      All ({auditResult.flagged_schedules.length})
                    </button>
                    <button
                      onClick={() => setFilterSeverity('CRITICAL')}
                      className={`px-3 py-1 rounded-md transition-all ${
                        filterSeverity === 'CRITICAL' ? 'bg-red-600 text-white shadow-xs' : 'text-red-700 hover:bg-red-50'
                      }`}
                    >
                      Critical ({auditResult.scrutiny_memo.critical_count})
                    </button>
                    <button
                      onClick={() => setFilterSeverity('WARNING')}
                      className={`px-3 py-1 rounded-md transition-all ${
                        filterSeverity === 'WARNING' ? 'bg-amber-600 text-white shadow-xs' : 'text-amber-800 hover:bg-amber-50'
                      }`}
                    >
                      Warnings ({auditResult.scrutiny_memo.warning_count})
                    </button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Schedule ID</th>
                      <th className="py-3 px-4">FSU / Location</th>
                      <th className="py-3 px-4">Enumerator ID</th>
                      <th className="py-3 px-4">Severity</th>
                      <th className="py-3 px-4">Rule Violated</th>
                      <th className="py-3 px-4">Discrepancy Detail</th>
                      <th className="py-3 px-4">Action Mandated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredSchedules.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {row.schedule_id}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-700">
                          {row.fsu_no}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {row.enumerator_id}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            row.severity === 'CRITICAL'
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}>
                            <AlertTriangle className="w-3 h-3" />
                            {row.severity}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {row.rule_violated}
                        </td>
                        <td className="py-3 px-4 text-slate-600 max-w-xs leading-relaxed">
                          {row.details}
                        </td>
                        <td className="py-3 px-4 text-amber-900 bg-amber-50/50 font-medium max-w-xs leading-relaxed border-l border-amber-100">
                          {row.action_mandated}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => {
                  const csvContent = "data:text/csv;charset=utf-8," + 
                    ["Schedule ID,FSU,Enumerator,Severity,Rule,Details,Action"]
                      .concat(auditResult.flagged_schedules.map(r => `"${r.schedule_id}","${r.fsu_no}","${r.enumerator_id}","${r.severity}","${r.rule_violated}","${r.details}","${r.action_mandated}"`))
                      .join("\n");
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", `mospi_scrutiny_audit_${selectedDatasetId}.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-600" />
                Export Scrutiny Audit Ledger (CSV)
              </button>

              <button
                onClick={() => setShowMemo(true)}
                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-amber-600/20 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                Generate Scrutiny Office Memo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
