import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Flame,
  Award,
  Users,
  Building2,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Zap,
  Shield,
  Layers,
  Search,
  Filter,
  ArrowRight,
  Loader2
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const BADGES_COLLECTION = [
  { id: 'b_sna', name: 'SNA 2008 Grandmaster', icon: '🏆', domain: 'National Accounts', desc: 'Mastered double deflation & SUT compilation.' },
  { id: 'b_smp', name: 'Sampling Design Savant', icon: '🎯', domain: 'Survey Design', desc: 'Synthesized multi-stage stratified Horvitz-Thompson models.' },
  { id: 'b_dpdp', name: 'DPDPA Privacy Guardian', icon: '🛡️', domain: 'Digital Governance', desc: 'Achieved 95%+ in statistical disclosure control.' },
  { id: 'b_capi', name: 'Fast-Track CAPI Enumerator', icon: '⚡', domain: 'Field Operations', desc: 'Completed 5+ realistic respondent field simulations.' },
  { id: 'b_cpi', name: 'Laspeyres Index Specialist', icon: '📈', domain: 'Price Statistics', desc: 'Successfully audited all-India CPI weighting diagrams.' },
];

export default function CadreLeaderboard() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('cadres'); // 'cadres' | 'divisions' | 'sprints'
  const [cadreFilter, setCadreFilter] = useState('all'); // 'all' | 'iss' | 'sss'
  const [divisions, setDivisions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [divRes, leadRes, sprintRes] = await Promise.all([
          api.get('/api/rankings/divisions'),
          api.get('/api/rankings/cadres'),
          api.get('/api/rankings/sprints'),
        ]);

        if (isMounted) {
          if (divRes.data?.divisions) setDivisions(divRes.data.divisions);
          if (leadRes.data?.leaderboard) setLeaderboard(leadRes.data.leaderboard);
          if (sprintRes.data?.sprints) setSprints(sprintRes.data.sprints);
        }
      } catch (err) {
        console.warn('[Leaderboard] fetch error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAllData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleJoinSprint = async (sprintId) => {
    setJoiningId(sprintId);
    try {
      await api.post('/api/rankings/join-sprint', { sprint_id: sprintId });
      setSprints((prev) =>
        prev.map((s) => (s.id === sprintId ? { ...s, is_joined: true, enrolled_count: s.enrolled_count + 1 } : s))
      );
    } catch (err) {
      alert('Could not join sprint. Please try again.');
    } finally {
      setJoiningId(null);
    }
  };

  const filteredLeaderboard = leaderboard.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.division.toLowerCase().includes(searchQuery.toLowerCase());
    if (cadreFilter === 'iss') return matchesSearch && item.cadre.toLowerCase().includes('iss');
    if (cadreFilter === 'sss') return matchesSearch && item.cadre.toLowerCase().includes('sss');
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              National Peer Benchmarking
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Season 2026 Active
            </span>
          </div>
          <h1 className="font-headline text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Cadre Leaderboards &amp; Divisional Statistical Sprints
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Foster cohort motivation across India's Official Statistical Cadres (*ISS &amp; SSS*). Compete in monthly domain sprints, benchmark divisional readiness, and earn verified MoSPI capability badges.
          </p>
        </div>

        {/* Current Officer Standing Card */}
        <div className="p-4 bg-gradient-to-tr from-blue-700 to-indigo-800 text-white rounded-2xl shadow-sm shrink-0 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center font-extrabold text-xl shadow-inner">
            🥇
          </div>
          <div>
            <div className="text-[10px] text-blue-200 uppercase font-bold tracking-wider">Your Standing</div>
            <div className="font-headline font-bold text-sm text-white">
              {user?.full_name || 'Arjun Sharma, ISS'}
            </div>
            <div className="flex items-center gap-3 text-xs text-blue-100 font-mono mt-0.5">
              <span>Rank #1 (ISS)</span>
              <span>&bull;</span>
              <span className="flex items-center gap-0.5 text-amber-300">
                <Flame className="w-3.5 h-3.5 fill-amber-300" /> 12 Days
              </span>
              <span>&bull;</span>
              <span className="text-white font-bold">2,450 XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-4 pt-2 shadow-2xs">
        <button
          onClick={() => setActiveTab('cadres')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition ${
            activeTab === 'cadres'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Individual Cadre Rankings</span>
        </button>

        <button
          onClick={() => setActiveTab('divisions')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition ${
            activeTab === 'divisions'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4 text-blue-600" />
          <span>Divisional Capability Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('sprints')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition ${
            activeTab === 'sprints'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-600" />
          <span>National Statistical Sprints ({sprints.length})</span>
        </button>
      </div>

      {/* TAB 1: Individual Cadre Standings */}
      {activeTab === 'cadres' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cadre Filter:</span>
              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                {[
                  { id: 'all', label: 'All Cadres' },
                  { id: 'iss', label: 'Indian Statistical Service (ISS)' },
                  { id: 'sss', label: 'Subordinate Statistical Service (SSS)' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCadreFilter(c.id)}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      cadreFilter === c.id
                        ? 'bg-white text-blue-700 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search officer or division..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600">
                  <th className="p-3 w-16 text-center">Rank</th>
                  <th className="p-3">Statistical Officer</th>
                  <th className="p-3">MoSPI Division &amp; Cadre</th>
                  <th className="p-3 text-center">Badges</th>
                  <th className="p-3 text-center">Pass Rate</th>
                  <th className="p-3 text-center">Daily Streak</th>
                  <th className="p-3 text-right">Competency XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeaderboard.map((officer) => (
                  <tr
                    key={officer.id}
                    className={`transition ${
                      officer.is_current_user
                        ? 'bg-blue-50/70 font-semibold text-blue-950'
                        : 'hover:bg-slate-50/70 text-slate-800'
                    }`}
                  >
                    <td className="p-3 text-center font-bold text-sm">
                      {officer.rank === 1 ? (
                        <span className="text-lg">🥇</span>
                      ) : officer.rank === 2 ? (
                        <span className="text-lg">🥈</span>
                      ) : officer.rank === 3 ? (
                        <span className="text-lg">🥉</span>
                      ) : (
                        <span className="font-mono text-slate-500">#{officer.rank}</span>
                      )}
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {officer.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold flex items-center gap-1.5">
                            <span>{officer.name}</span>
                            {officer.is_current_user && (
                              <span className="px-1.5 py-0.2 rounded bg-blue-600 text-white text-[9px] font-bold uppercase">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">{officer.designation}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-medium text-slate-800">{officer.division}</div>
                      <div className="text-[11px] text-slate-500">{officer.cadre}</div>
                    </td>

                    <td className="p-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-mono font-bold text-[11px]">
                        🏅 {officer.badges_count}
                      </span>
                    </td>

                    <td className="p-3 text-center font-mono font-bold text-emerald-700">
                      {officer.pass_rate}%
                    </td>

                    <td className="p-3 text-center">
                      <span className="inline-flex items-center gap-1 text-amber-600 font-mono font-bold">
                        <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {officer.streak}d
                      </span>
                    </td>

                    <td className="p-3 text-right font-mono font-extrabold text-blue-700 text-sm">
                      {officer.xp.toLocaleString()} XP
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Divisional Capability Matrix */}
      {activeTab === 'divisions' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="font-headline font-bold text-base text-slate-900">
              MoSPI Division-Wise Capability &amp; Statistical Readiness
            </h3>
            <p className="text-xs text-slate-500">
              Aggregated readiness benchmarks evaluated across all enrolled statistical personnel in each division.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {divisions.map((div) => (
              <div
                key={div.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-400 transition space-y-3.5 shadow-2xs"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-sm">
                      #{div.rank}
                    </div>
                    <div>
                      <h4 className="font-headline font-bold text-sm text-slate-900">{div.division}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">Code: {div.code}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-400 font-semibold uppercase">Readiness</div>
                    <div className="text-xl font-extrabold font-mono text-emerald-700 leading-tight">
                      {div.readiness}%
                    </div>
                  </div>
                </div>

                {/* Readiness Bar */}
                <div className="space-y-1">
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${div.readiness}%` }}
                    />
                  </div>
                </div>

                {/* Division Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/70 text-center text-xs">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Officers</div>
                    <div className="font-mono font-bold text-slate-800 text-sm mt-0.5">{div.active_officers}</div>
                  </div>

                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Modules Done</div>
                    <div className="font-mono font-bold text-slate-800 text-sm mt-0.5">{div.modules_completed}</div>
                  </div>

                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Div. Streak</div>
                    <div className="font-mono font-bold text-amber-600 text-sm mt-0.5 flex items-center justify-center gap-0.5">
                      <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {div.streak_days}d
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">Core Specialization:</span>
                  <span className="font-semibold text-blue-700">{div.top_skill}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: National Statistical Sprints (Challenges) */}
      {activeTab === 'sprints' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="font-headline font-bold text-base text-slate-900">
              Active National Statistical Sprints &amp; Cohort Challenges
            </h3>
            <p className="text-xs text-slate-500">
              Time-bound capability enhancement sprints. Complete practical targets to earn bonus XP and official MoSPI badges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {sprints.map((sprint) => (
              <div
                key={sprint.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-blue-500/50 transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                      {sprint.days_left} Days Remaining
                    </span>
                    <span className="font-mono font-bold text-xs text-amber-600">
                      +{sprint.xp_reward} XP
                    </span>
                  </div>

                  <div>
                    <h4 className="font-headline font-bold text-sm text-slate-900 leading-snug">
                      {sprint.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1">{sprint.division}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target Cadre:</span>
                      <span className="font-semibold text-slate-800">{sprint.cadre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target Deliverable:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[150px]">
                        {sprint.completion_target}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Reward Badge:</span>
                      <span className="font-semibold text-blue-700">{sprint.badge}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-500 font-mono">
                    👥 {sprint.enrolled_count} Officers Enrolled
                  </div>

                  {sprint.is_joined ? (
                    <span className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Enrolled
                    </span>
                  ) : (
                    <button
                      onClick={() => handleJoinSprint(sprint.id)}
                      disabled={joiningId === sprint.id}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
                    >
                      {joiningId === sprint.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                      <span>Join Sprint</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Official MoSPI Competency Badges Showcase */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-headline font-bold text-base text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Official MoSPI Competency Badges Showcase</span>
            </h3>
            <p className="text-xs text-slate-500">
              Earnable digital badges recognized across National Statistical Systems Training Academy (NSSTA) certifications.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {BADGES_COLLECTION.map((b) => (
            <div
              key={b.id}
              className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl hover:bg-white hover:border-amber-400 hover:shadow-2xs transition text-center space-y-2 flex flex-col items-center justify-between"
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-2xl">
                {b.icon}
              </div>
              <div>
                <div className="font-headline font-bold text-xs text-slate-900 leading-snug">{b.name}</div>
                <div className="text-[10px] text-blue-600 font-semibold mt-0.5">{b.domain}</div>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight">{b.desc}</p>
              </div>
              <span className="text-[9px] uppercase font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-mono">
                Verified Badge
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
