import React, { useState, useEffect } from 'react';
import {
  Target,
  BarChart3,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  Search,
  BookOpen,
  Building2,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  Filter,
  Download,
  Award,
  Sparkles,
  Database,
  FileSpreadsheet,
  Activity,
  GraduationCap
} from 'lucide-react';

const API_BASE = '/api/sdg';

export default function SdgTracker() {
  const [activeTab, setActiveTab] = useState('indicators'); // 'indicators' | 'states' | 'cadre'
  const [overview, setOverview] = useState(null);
  const [goals, setGoals] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Cadre Gap Analysis State
  const [gapStateCode, setGapStateCode] = useState('KL');
  const [gapIndicatorId, setGapIndicatorId] = useState('nif-8-5-2');
  const [gapResult, setGapResult] = useState(null);
  const [gapLoading, setGapLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [resOverview, resGoals, resIndicators, resStates] = await Promise.all([
        fetch(`${API_BASE}/overview`).then(r => r.json()),
        fetch(`${API_BASE}/goals`).then(r => r.json()),
        fetch(`${API_BASE}/indicators`).then(r => r.json()),
        fetch(`${API_BASE}/states`).then(r => r.json())
      ]);

      if (resOverview.success) setOverview(resOverview);
      if (resGoals.success) setGoals(resGoals.goals);
      if (resIndicators.success) {
        setIndicators(resIndicators.indicators);
        if (resIndicators.indicators.length > 0) {
          setSelectedIndicator(resIndicators.indicators[0]);
        }
      }
      if (resStates.success) setStates(resStates.states);

      // Trigger initial gap analysis
      runGapAnalysis('nif-8-5-2', 'KL');
    } catch (err) {
      console.error('Error fetching SDG data:', err);
    } finally {
      setLoading(false);
    }
  };

  const runGapAnalysis = async (indicatorId, stateCode) => {
    setGapLoading(true);
    try {
      const res = await fetch(`${API_BASE}/gap-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ indicator_id: indicatorId, state_code: stateCode })
      });
      const data = await res.json();
      if (data.success) {
        setGapResult(data);
      }
    } catch (err) {
      console.error('Error running gap analysis:', err);
    } finally {
      setGapLoading(false);
    }
  };

  const handleIndicatorSelect = (indicator) => {
    setSelectedIndicator(indicator);
    setGapIndicatorId(indicator.id);
  };

  const filteredIndicators = indicators.filter(ind => {
    const matchesGoal = selectedGoalId ? ind.goal_id === selectedGoalId : true;
    const matchesStatus = statusFilter === 'ALL' ? true : ind.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch = searchQuery === '' ? true :
      ind.nif_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ind.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ind.primary_microdata_source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGoal && matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-8">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
              <Target className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  MoSPI Official Framework
                </span>
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  Social Statistics Division (SSD)
                </span>
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  2030 National Agenda
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                NIF / SDG Indicator Mapping & National Goal Tracker
              </h1>
              <p className="text-sm text-slate-600 mt-1 max-w-3xl">
                Official National Indicator Framework (NIF) registry mapping India's Sustainable Development Goals directly to MoSPI microdata schedules (PLFS, HCES, ASI, SRS), multi-stage survey blocks, and statistical cadre competencies.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl border border-slate-300 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Export Dossier</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('cadre');
                runGapAnalysis(gapIndicatorId, gapStateCode);
              }}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Cadre Diagnostics</span>
            </button>
          </div>
        </div>

        {/* Global Summary KPIs */}
        {overview && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total NIF Indicators</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{overview.total_nif_indicators}</div>
              <div className="text-xs text-slate-500 mt-0.5">Across 17 Sustainable Goals</div>
            </div>

            <div className="bg-emerald-50/60 rounded-xl p-3.5 border border-emerald-200/80">
              <div className="text-xs font-medium text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>On Track / Target Met</span>
              </div>
              <div className="text-2xl font-bold text-emerald-700 mt-1">{overview.status_summary.on_track}</div>
              <div className="text-xs text-emerald-600 font-medium mt-0.5">
                {overview.status_summary.on_track_pct}% of National Indicators
              </div>
            </div>

            <div className="bg-amber-50/60 rounded-xl p-3.5 border border-amber-200/80">
              <div className="text-xs font-medium text-amber-700 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Needs Acceleration</span>
              </div>
              <div className="text-2xl font-bold text-amber-700 mt-1">{overview.status_summary.needs_acceleration}</div>
              <div className="text-xs text-amber-600 mt-0.5">Target gap requires policy focus</div>
            </div>

            <div className="bg-rose-50/60 rounded-xl p-3.5 border border-rose-200/80">
              <div className="text-xs font-medium text-rose-700 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Data Lag / Review</span>
              </div>
              <div className="text-2xl font-bold text-rose-700 mt-1">{overview.status_summary.data_lag}</div>
              <div className="text-xs text-rose-600 mt-0.5">Under methodology refinement</div>
            </div>
          </div>
        )}
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-200 mb-6 bg-white rounded-xl p-1.5 shadow-sm">
        <button
          onClick={() => setActiveTab('indicators')}
          className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'indicators'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>NIF SDG Indicator Matrix & Microdata Mapping</span>
        </button>

        <button
          onClick={() => setActiveTab('states')}
          className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'states'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>State & UT Disaggregation Heatmap</span>
        </button>

        <button
          onClick={() => setActiveTab('cadre')}
          className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'cadre'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>ISS / SSS Cadre Gap Remediation</span>
        </button>
      </div>

      {/* TAB 1: NIF INDICATORS & MICRODATA MAPPING */}
      {activeTab === 'indicators' && (
        <div className="space-y-6">
          {/* SDG Goal Badges Selector */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Filter by Sustainable Development Goal (1 to 17)
              </div>
              {selectedGoalId && (
                <button
                  onClick={() => setSelectedGoalId(null)}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800 underline"
                >
                  Show All Goals
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              <button
                onClick={() => setSelectedGoalId(null)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedGoalId === null
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                All 17 SDGs
              </button>

              {goals.map(goal => (
                <button
                  key={goal.id}
                  onClick={() => setSelectedGoalId(goal.id === selectedGoalId ? null : goal.id)}
                  style={{
                    backgroundColor: selectedGoalId === goal.id ? goal.color : '#F8FAFC',
                    borderColor: selectedGoalId === goal.id ? goal.color : '#E2E8F0',
                    color: selectedGoalId === goal.id ? '#FFFFFF' : '#334155'
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 shadow-sm hover:opacity-90"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: selectedGoalId === goal.id ? '#FFFFFF' : goal.color }}
                  />
                  <span>{goal.code}: {goal.title}</span>
                  <span className="text-[10px] opacity-75 font-normal">({goal.total_nif_indicators})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search NIF indicator code, title, or survey schedule (e.g. '8.5.2', 'unemployment', 'PLFS', 'MVA')..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium text-slate-700">
                <span className="px-2 text-slate-500">Status:</span>
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    statusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'hover:bg-slate-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter('On Track')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    statusFilter === 'On Track' ? 'bg-emerald-600 text-white font-semibold' : 'hover:bg-slate-200'
                  }`}
                >
                  On Track
                </button>
                <button
                  onClick={() => setStatusFilter('Needs Acceleration')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    statusFilter === 'Needs Acceleration' ? 'bg-amber-600 text-white font-semibold' : 'hover:bg-slate-200'
                  }`}
                >
                  Needs Accel
                </button>
              </div>
            </div>
          </div>

          {/* Master-Detail Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Indicator List */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                Matching NIF Indicators ({filteredIndicators.length})
              </div>

              {filteredIndicators.map(ind => {
                const isSelected = selectedIndicator?.id === ind.id;
                const goalObj = goals.find(g => g.id === ind.goal_id);

                return (
                  <div
                    key={ind.id}
                    onClick={() => handleIndicatorSelect(ind)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-50/60 border-indigo-300 ring-2 ring-indigo-500/20 shadow-md'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className="px-2 py-0.5 text-xs font-bold rounded-md text-white"
                          style={{ backgroundColor: goalObj?.color || '#3B82F6' }}
                        >
                          {ind.nif_code}
                        </span>
                        <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                          {ind.un_code}
                        </span>
                        <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-md ${
                          ind.status === 'On Track'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {ind.status}
                        </span>
                      </div>

                      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'rotate-90 text-indigo-600' : 'text-slate-400'}`} />
                    </div>

                    <h4 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2">
                      {ind.title}
                    </h4>

                    <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-slate-100 text-slate-600">
                      <div>
                        Target 2030: <span className="font-bold text-slate-900">{ind.target_2030} {ind.unit}</span>
                      </div>
                      <div>
                        Current: <span className="font-bold text-indigo-600">{ind.current_value} {ind.unit}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Detailed Microdata & Cadre Mapping */}
            <div className="lg:col-span-7">
              {selectedIndicator ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 sticky top-6">
                  {/* Indicator Title & Header */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white">
                        {selectedIndicator.nif_code}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        Global UNSD Equivalent: {selectedIndicator.un_code}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {selectedIndicator.confidence_tier}
                      </span>
                    </div>

                    <h3 className="text-lg md:text-xl font-bold text-slate-900">
                      {selectedIndicator.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Custodian Division: <strong className="text-slate-800">{selectedIndicator.custodian_division}</strong> | Frequency: <span className="text-slate-800">{selectedIndicator.periodicity}</span>
                    </p>
                  </div>

                  {/* Target 2030 vs Current Barometer */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                      <span>Baseline ({selectedIndicator.baseline_2017 || selectedIndicator.baseline_2015} {selectedIndicator.unit})</span>
                      <span className="text-indigo-600 font-bold text-sm">
                        Current: {selectedIndicator.current_value} {selectedIndicator.unit}
                      </span>
                      <span>Target 2030: {selectedIndicator.target_2030} {selectedIndicator.unit}</span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, Math.max(15, (selectedIndicator.current_value / selectedIndicator.target_2030) * 100))}%`
                        }}
                      />
                    </div>

                    {/* Historical 5-Year Trend */}
                    {selectedIndicator.trend && (
                      <div className="mt-4 pt-3 border-t border-slate-200">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Historical Official Time Series
                        </div>
                        <div className="flex items-end gap-3 h-16 pt-2">
                          {selectedIndicator.trend.map((pt, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                              <span className="text-[10px] font-bold text-slate-800">{pt.value}</span>
                              <div
                                className="w-full bg-indigo-500/80 rounded-t transition-all hover:bg-indigo-600"
                                style={{ height: `${Math.max(10, Math.min(100, (pt.value / selectedIndicator.target_2030) * 80))}%` }}
                              />
                              <span className="text-[9px] text-slate-500">{pt.year}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Microdata Linkage Card */}
                  <div className="border border-blue-200 bg-blue-50/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-blue-900 font-bold text-sm mb-2">
                      <Database className="w-4 h-4 text-blue-600" />
                      <span>MoSPI Microdata Source & Schedule Block Citations</span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-700">
                      <div>
                        <span className="font-semibold text-slate-900">Primary Survey / Register: </span>
                        <span className="text-blue-700 font-medium">{selectedIndicator.primary_microdata_source}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900">Survey Schedule & Block: </span>
                        <span className="bg-white px-2 py-0.5 rounded border border-blue-200 font-mono text-[11px] text-slate-800">
                          {selectedIndicator.schedule_block_citation}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900">Partner Line Ministries: </span>
                        <span>{selectedIndicator.partner_agencies.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Estimation Formula */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-1.5">
                      <Activity className="w-4 h-4 text-indigo-600" />
                      <span>Mathematical Estimation Formula & Sub-Round Multipliers</span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 mb-2 overflow-x-auto">
                      {selectedIndicator.formula_latex}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {selectedIndicator.formula_narrative}
                    </p>
                  </div>

                  {/* 4-Stage Data Flow Pipeline */}
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                      End-to-End Data Pipeline Architecture
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {selectedIndicator.data_flow_stages.map((stage, idx) => (
                        <div key={idx} className="bg-white border border-slate-200 rounded-xl p-2.5 text-xs shadow-xs">
                          <div className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">
                            Stage {idx + 1}
                          </div>
                          <div className="font-bold text-slate-900 mt-0.5 truncate">{stage.stage}</div>
                          <div className="text-[10px] text-slate-500 mt-1 truncate">{stage.agency}</div>
                          <span className="inline-block mt-1.5 px-1.5 py-0.5 bg-emerald-50 text-emerald-700 font-medium text-[9px] rounded border border-emerald-200">
                            {stage.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Action Button to Run Cadre Diagnostic */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setActiveTab('cadre');
                        setGapIndicatorId(selectedIndicator.id);
                        runGapAnalysis(selectedIndicator.id, gapStateCode);
                      }}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Analyze ISS & SSS Cadre Training Needs for {selectedIndicator.nif_code}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
                  Select an indicator to inspect microdata linkages
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STATE & UT DISAGGREGATION HEATMAP */}
      {activeTab === 'states' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">National Average Composite Score</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">67.8 / 100</div>
              <div className="text-xs text-emerald-600 font-medium mt-1">↑ +2.4 pts over previous assessment</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Performing State</div>
              <div className="text-3xl font-extrabold text-emerald-700 mt-2">Kerala (79)</div>
              <div className="text-xs text-slate-600 mt-1">Leading in SDG 3 (Health: 92/100)</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">FOD Sample Units Tracked</div>
              <div className="text-3xl font-extrabold text-indigo-600 mt-2">36,490 FSUs</div>
              <div className="text-xs text-slate-600 mt-1">Average Reporting Timeliness: 96.2%</div>
            </div>
          </div>

          {/* State Table Matrix */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">State-wise SDG Performance & MoSPI Field Operations Coverage</h3>
                <p className="text-xs text-slate-500 mt-0.5">Classification follows MoSPI & NITI Aayog SDG Index criteria (Front Runner: 65-99, Performer: 50-64)</p>
              </div>
              <span className="text-xs font-medium text-slate-500">{states.length} Major States Audited</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">State / UT</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">SDG Score</th>
                    <th className="py-3 px-4">Best Performing Goal</th>
                    <th className="py-3 px-4">Priority Lagging Goal</th>
                    <th className="py-3 px-4">CAPI Timeliness</th>
                    <th className="py-3 px-4 text-right">Cadre Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {states.map(st => (
                    <tr key={st.code} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-700">#{st.rank}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{st.state}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          st.category === 'Front Runner'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {st.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{st.overall_score}</span>
                          <div className="w-16 bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${st.overall_score}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs font-medium text-emerald-700">{st.top_sdg}</td>
                      <td className="py-3 px-4 text-xs font-medium text-rose-700">{st.lag_sdg}</td>
                      <td className="py-3 px-4 text-xs text-slate-600 font-mono">{st.reporting_timeliness}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setGapStateCode(st.code);
                            setActiveTab('cadre');
                            runGapAnalysis(gapIndicatorId, st.code);
                          }}
                          className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-lg transition-colors border border-indigo-200"
                        >
                          Audit Gaps
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ISS / SSS CADRE GAP REMEDIATION */}
      {activeTab === 'cadre' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-3">
              Statistical Cadre Diagnostic & Capacity Remediation Engine
            </h3>
            <p className="text-xs text-slate-600 mb-4 max-w-3xl">
              Identifies methodological and field enumeration vulnerabilities for any NIF indicator in specific States, generating customized learning pathways from NSSTA Greater Noida and iGOT Karmayogi for ISS and SSS officers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Select Target NIF Indicator
                </label>
                <select
                  value={gapIndicatorId}
                  onChange={e => {
                    setGapIndicatorId(e.target.value);
                    runGapAnalysis(e.target.value, gapStateCode);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {indicators.map(ind => (
                    <option key={ind.id} value={ind.id}>
                      {ind.nif_code} — {ind.title.substring(0, 45)}...
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Select State / UT
                </label>
                <select
                  value={gapStateCode}
                  onChange={e => {
                    setGapStateCode(e.target.value);
                    runGapAnalysis(gapIndicatorId, e.target.value);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {states.map(st => (
                    <option key={st.code} value={st.code}>
                      {st.state} (Rank #{st.rank}, Score {st.overall_score})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => runGapAnalysis(gapIndicatorId, gapStateCode)}
                  disabled={gapLoading}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{gapLoading ? 'Running Diagnostic...' : 'Re-run Diagnostic'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Cadre Diagnostic Result */}
          {gapResult && (
            <div className="space-y-4">
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-600 text-white">
                    {gapResult.indicator_code}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">
                    Cadre Intervention Blueprint: {gapResult.analyzed_state}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    State Rank #{gapResult.state_rank} | Composite Score: {gapResult.state_score}/100 | Severity: <span className="font-semibold text-indigo-700">{gapResult.data_quality_gap}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1 bg-white rounded-xl border border-indigo-200 text-xs font-semibold text-indigo-700 shadow-xs">
                    3 Cadre Tracks Generated
                  </span>
                </div>
              </div>

              {/* 3 Action Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {gapResult.recommendations.map((rec, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
                        {rec.cadre}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">{rec.division}</span>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Skill Focus</div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">{rec.skill_focus}</div>
                    </div>

                    <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-xs">
                      <div className="font-bold text-amber-900 flex items-center gap-1 mb-1">
                        <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
                        <span>Prescribed Training Module:</span>
                      </div>
                      <div className="text-slate-800 font-medium">{rec.recommended_course}</div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
                      <div className="font-bold text-slate-700 mb-1">Operational Directive:</div>
                      <div className="text-slate-600 leading-relaxed">{rec.action_item}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
