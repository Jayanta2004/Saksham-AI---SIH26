import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Globe,
  Radio,
  Tablet,
  Users,
  Building2,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  Send,
  Loader2,
  Calendar,
  X,
  FileText,
  Search,
  RefreshCw
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function GeoReadinessMap() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [geoData, setGeoData] = useState(null);
  const [selectedZoneId, setSelectedZoneId] = useState('zone_north');
  const [hoveredZoneId, setHoveredZoneId] = useState(null);

  // Mission Deployment Modal
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [missionSuccess, setMissionSuccess] = useState(null);
  const [leadFaculty, setLeadFaculty] = useState('Dr. Radhika Sen, ISS (NSSTA Senior Faculty)');

  useEffect(() => {
    fetchGeoData();
  }, []);

  const fetchGeoData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/geo/readiness-zones');
      if (res.data && res.data.zones) {
        setGeoData(res.data);
        if (!selectedZoneId && res.data.zones.length > 0) {
          setSelectedZoneId(res.data.zones[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load geo readiness data:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedZone = geoData?.zones?.find(z => z.id === selectedZoneId) || geoData?.zones?.[0];

  const handleDeployMission = async () => {
    if (!selectedZone) return;
    setDeploying(true);
    try {
      const res = await api.post('/api/geo/deploy-mission', {
        zone_id: selectedZone.id,
        lead_faculty: leadFaculty,
        focus_deficits: selectedZone.deficits?.map(d => d.skill) || []
      });
      if (res.data?.success) {
        setMissionSuccess(res.data.details);
      }
    } catch (err) {
      console.error('Mission deployment error:', err);
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Context (High-Contrast Light Theme) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50/90 via-white to-emerald-50/90 border border-blue-200 p-6 md:p-8 shadow-sm">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-900 border border-blue-300">
                <Globe className="w-3.5 h-3.5 text-blue-700" />
                GIS & Bhuvan Spatial Analytics
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
                <Radio className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
                Live NSSO RO Telemetry
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              National Geo-Statistical Capability & Field Readiness Map
            </h1>
            <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
              Real-time geospatial readiness index across all 6 statistical zones. Audits field operations staffing, CAPI tablet adoption, local dialect coverage, and dispatches targeted NSSTA mobile training missions.
            </p>
          </div>

          <button
            onClick={fetchGeoData}
            className="self-start md:self-center px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh GIS Telemetry
          </button>
        </div>
      </div>

      {/* Top Macro Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>All-India Readiness</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {geoData?.all_india_average_index || 84.8}%
          </div>
          <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <span>+3.2%</span> vs last quarterly audit
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Active Field Staff</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {geoData?.total_field_staff?.toLocaleString() || '14,280'}
          </div>
          <p className="text-[11px] text-slate-500">Across 6 administrative zones</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>NSSO ROs & SROs</span>
            <Building2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {(geoData?.total_regional_offices || 48)} ROs / {(geoData?.total_sub_regional_offices || 112)} SROs
          </div>
          <p className="text-[11px] text-slate-500">Field Operations Division (FOD)</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>CAPI Tablet Sync</span>
            <Tablet className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {geoData?.average_capi_sync_rate || 89.9}%
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">Daily cloud submission rate</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Bhuvan GIS Blocks</span>
            <MapPin className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">88.2%</div>
          <p className="text-[11px] text-slate-500">UFS Frame Digitization</p>
        </div>
      </div>

      {/* Main Grid: Interactive Map & Deep-Dive Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive India Map & Zonal Selector (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                India Geo-Statistical Zonal Map
              </h2>
              <p className="text-xs text-slate-500">
                Click any zone below or select from the map to inspect divisional field capability.
              </p>
            </div>
            
            {/* Legend */}
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-semibold">
              <span className="flex items-center gap-1 text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span> &ge;90% Exemplary
              </span>
              <span className="flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span> 85-89% High
              </span>
              <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-600"></span> 80-84% Moderate
              </span>
              <span className="flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                <span className="w-2 h-2 rounded-full bg-rose-600"></span> &lt;80% Priority
              </span>
            </div>
          </div>

          {/* Interactive SVG India Zonal Map */}
          <div className="relative bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center min-h-[420px] overflow-hidden">
            <svg
              viewBox="0 0 540 600"
              className="w-full max-w-[480px] h-auto drop-shadow-md select-none transition-all duration-300"
            >
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.15" />
                </filter>
              </defs>

              {/* Northern Zone */}
              <g
                onClick={() => setSelectedZoneId('zone_north')}
                onMouseEnter={() => setHoveredZoneId('zone_north')}
                onMouseLeave={() => setHoveredZoneId(null)}
                className="cursor-pointer transition-all duration-200"
              >
                <path
                  d="M 190 20 L 250 15 L 290 50 L 300 110 L 260 160 L 200 170 L 150 130 L 150 70 Z"
                  fill={selectedZoneId === 'zone_north' ? '#2563eb' : hoveredZoneId === 'zone_north' ? '#3b82f6' : '#60a5fa'}
                  stroke="#ffffff"
                  strokeWidth={selectedZoneId === 'zone_north' ? '3' : '1.5'}
                  filter={selectedZoneId === 'zone_north' ? 'url(#glow)' : ''}
                  opacity={selectedZoneId === 'zone_north' ? '1' : '0.85'}
                />
                <text x="215" y="95" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" pointerEvents="none">
                  NORTH
                </text>
                <text x="215" y="112" fill="#eff6ff" fontSize="10" fontWeight="bold" textAnchor="middle" pointerEvents="none">
                  89.2%
                </text>
              </g>

              {/* Western Zone */}
              <g
                onClick={() => setSelectedZoneId('zone_west')}
                onMouseEnter={() => setHoveredZoneId('zone_west')}
                onMouseLeave={() => setHoveredZoneId(null)}
                className="cursor-pointer transition-all duration-200"
              >
                <path
                  d="M 90 200 L 190 180 L 210 240 L 190 320 L 120 330 L 80 260 Z"
                  fill={selectedZoneId === 'zone_west' ? '#059669' : hoveredZoneId === 'zone_west' ? '#10b981' : '#34d399'}
                  stroke="#ffffff"
                  strokeWidth={selectedZoneId === 'zone_west' ? '3' : '1.5'}
                  filter={selectedZoneId === 'zone_west' ? 'url(#glow)' : ''}
                  opacity={selectedZoneId === 'zone_west' ? '1' : '0.85'}
                />
                <text x="145" y="260" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" pointerEvents="none">
                  WEST
                </text>
                <text x="145" y="277" fill="#ecfdf5" fontSize="10" fontWeight="bold" textAnchor="middle" pointerEvents="none">
                  87.5%
                </text>
              </g>

              {/* Central Zone */}
              <g
                onClick={() => setSelectedZoneId('zone_central')}
                onMouseEnter={() => setHoveredZoneId('zone_central')}
                onMouseLeave={() => setHoveredZoneId(null)}
                className="cursor-pointer transition-all duration-200"
              >
                <path
                  d="M 200 175 L 290 165 L 305 240 L 265 310 L 205 280 L 200 210 Z"
                  fill={selectedZoneId === 'zone_central' ? '#0891b2' : hoveredZoneId === 'zone_central' ? '#06b6d4' : '#22d3ee'}
                  stroke="#ffffff"
                  strokeWidth={selectedZoneId === 'zone_central' ? '3' : '1.5'}
                  filter={selectedZoneId === 'zone_central' ? 'url(#glow)' : ''}
                  opacity={selectedZoneId === 'zone_central' ? '1' : '0.85'}
                />
                <text x="248" y="235" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" pointerEvents="none">
                  CENTRAL
                </text>
                <text x="248" y="252" fill="#ecfeff" fontSize="10" fontWeight="bold" textAnchor="middle" pointerEvents="none">
                  80.2%
                </text>
              </g>

              {/* Eastern Zone */}
              <g
                onClick={() => setSelectedZoneId('zone_east')}
                onMouseEnter={() => setHoveredZoneId('zone_east')}
                onMouseLeave={() => setHoveredZoneId(null)}
                className="cursor-pointer transition-all duration-200"
              >
                <path
                  d="M 295 165 L 375 165 L 385 240 L 350 320 L 285 295 L 295 210 Z"
                  fill={selectedZoneId === 'zone_east' ? '#d97706' : hoveredZoneId === 'zone_east' ? '#f59e0b' : '#fbbf24'}
                  stroke="#ffffff"
                  strokeWidth={selectedZoneId === 'zone_east' ? '3' : '1.5'}
                  filter={selectedZoneId === 'zone_east' ? 'url(#glow)' : ''}
                  opacity={selectedZoneId === 'zone_east' ? '1' : '0.85'}
                />
                <text x="335" y="240" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" pointerEvents="none">
                  EAST
                </text>
                <text x="335" y="257" fill="#fffbeb" fontSize="10" fontWeight="bold" textAnchor="middle" pointerEvents="none">
                  83.6%
                </text>
              </g>

              {/* North-Eastern Zone */}
              <g
                onClick={() => setSelectedZoneId('zone_northeast')}
                onMouseEnter={() => setHoveredZoneId('zone_northeast')}
                onMouseLeave={() => setHoveredZoneId(null)}
                className="cursor-pointer transition-all duration-200"
              >
                <path
                  d="M 385 155 L 460 140 L 510 175 L 490 235 L 435 245 L 390 200 Z"
                  fill={selectedZoneId === 'zone_northeast' ? '#db2777' : hoveredZoneId === 'zone_northeast' ? '#ec4899' : '#f472b6'}
                  stroke="#ffffff"
                  strokeWidth={selectedZoneId === 'zone_northeast' ? '3' : '1.5'}
                  filter={selectedZoneId === 'zone_northeast' ? 'url(#glow)' : ''}
                  opacity={selectedZoneId === 'zone_northeast' ? '1' : '0.85'}
                />
                <text x="445" y="195" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" pointerEvents="none">
                  NORTH-EAST
                </text>
                <text x="445" y="212" fill="#fdf2f8" fontSize="10" fontWeight="bold" textAnchor="middle" pointerEvents="none">
                  76.8%
                </text>
              </g>

              {/* Southern Zone */}
              <g
                onClick={() => setSelectedZoneId('zone_south')}
                onMouseEnter={() => setHoveredZoneId('zone_south')}
                onMouseLeave={() => setHoveredZoneId(null)}
                className="cursor-pointer transition-all duration-200"
              >
                <path
                  d="M 160 330 L 270 315 L 320 375 L 260 520 L 210 570 L 160 450 Z"
                  fill={selectedZoneId === 'zone_south' ? '#7c3aed' : hoveredZoneId === 'zone_south' ? '#8b5cf6' : '#a78bfa'}
                  stroke="#ffffff"
                  strokeWidth={selectedZoneId === 'zone_south' ? '3' : '1.5'}
                  filter={selectedZoneId === 'zone_south' ? 'url(#glow)' : ''}
                  opacity={selectedZoneId === 'zone_south' ? '1' : '0.85'}
                />
                <text x="235" y="440" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle" pointerEvents="none">
                  SOUTH
                </text>
                <text x="235" y="458" fill="#f5f3ff" fontSize="11" fontWeight="bold" textAnchor="middle" pointerEvents="none">
                  91.4%
                </text>
              </g>

              {/* Pin markers for Major Zonal HQs */}
              <circle cx="245" cy="140" r="4.5" fill="#ffffff" stroke="#1e3a8a" strokeWidth="2" />
              <text x="255" y="144" fill="#1e293b" fontSize="9" fontWeight="600">HQ: Delhi</text>

              <circle cx="120" cy="320" r="4.5" fill="#ffffff" stroke="#047857" strokeWidth="2" />
              <text x="75" y="335" fill="#1e293b" fontSize="9" fontWeight="600">HQ: Mumbai</text>

              <circle cx="215" cy="480" r="4.5" fill="#ffffff" stroke="#6d28d9" strokeWidth="2" />
              <text x="225" y="484" fill="#1e293b" fontSize="9" fontWeight="600">HQ: Bengaluru</text>

              <circle cx="360" cy="235" r="4.5" fill="#ffffff" stroke="#b45309" strokeWidth="2" />
              <text x="368" y="240" fill="#1e293b" fontSize="9" fontWeight="600">HQ: Kolkata</text>

              <circle cx="230" cy="270" r="4.5" fill="#ffffff" stroke="#0e7490" strokeWidth="2" />
              <text x="238" y="275" fill="#1e293b" fontSize="9" fontWeight="600">HQ: Bhopal</text>

              <circle cx="430" cy="210" r="4.5" fill="#ffffff" stroke="#be185d" strokeWidth="2" />
              <text x="438" y="215" fill="#1e293b" fontSize="9" fontWeight="600">HQ: Guwahati</text>
            </svg>

            {/* Floating Map Helper Badge */}
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-600 shadow-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Interactive Bhuvan Vector Topology: Click any zone to audit
            </div>
          </div>

          {/* Quick Zone Navigation Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
            {geoData?.zones?.map(zone => (
              <button
                key={zone.id}
                onClick={() => setSelectedZoneId(zone.id)}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  selectedZoneId === zone.id
                    ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-500'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {zone.name.replace(' Statistical Zone', '')}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {zone.hq.split('(')[0]}
                  </div>
                </div>
                <span
                  className="px-2 py-0.5 rounded text-[11px] font-bold text-white shrink-0 ml-1.5"
                  style={{ backgroundColor: zone.color }}
                >
                  {zone.readiness_index}%
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Deep-Dive Zonal Inspection Dossier (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          {selectedZone ? (
            <>
              {/* Zonal Header Banner */}
              <div className="border-b border-slate-100 pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white shadow-2xs"
                    style={{ backgroundColor: selectedZone.color }}
                  >
                    {selectedZone.code} — {selectedZone.tier}
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900">
                      {selectedZone.readiness_index}%
                    </span>
                    <span className="text-xs text-slate-500 block">Readiness Index</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {selectedZone.name}
                </h3>
                <p className="text-xs text-slate-600 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span><strong>Zonal HQ:</strong> {selectedZone.hq}</span>
                </p>
              </div>

              {/* Field Personnel Breakdown */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block">Field Personnel</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedZone.total_personnel.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {selectedZone.iss_supervisors} ISS / {selectedZone.sss_enumerators} SSS
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">NSSO Infrastructure</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedZone.ros_count} ROs / {selectedZone.sros_count} SROs
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">
                    {selectedZone.capi_sync_rate}% CAPI Sync
                  </span>
                </div>
              </div>

              {/* States & Language Coverage */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-slate-600">
                    <strong className="text-slate-800">Jurisdiction:</strong> {selectedZone.states.join(', ')}
                  </span>
                </div>
                <div className="flex items-start gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-slate-600">
                    <strong className="text-slate-800">Primary Dialects:</strong> {selectedZone.primary_language}
                  </span>
                </div>
              </div>

              {/* Core Capabilities Radar Progress Bars */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                  <span>Field Operational Proficiencies</span>
                  <span className="text-[10px] font-normal text-slate-500">Benchmark: 85.0%</span>
                </h4>

                <div className="space-y-2.5">
                  {Object.entries(selectedZone.capabilities).map(([capName, score]) => (
                    <div key={capName} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-700 font-medium truncate max-w-[240px]">{capName}</span>
                        <span className="font-bold text-slate-900">{score}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            score >= 90 ? 'bg-purple-600' : score >= 85 ? 'bg-blue-600' : score >= 80 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regional Training Deficits & Gap Hotspots */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-amber-700">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Targeted Regional Training Deficits</span>
                </h4>

                <div className="space-y-2">
                  {selectedZone.deficits?.map((def, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-xs flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold text-slate-900 block">{def.skill}</span>
                        <span className="text-[10px] text-amber-800">
                          Field Deficit Impact: <strong>{def.gap}</strong> points below national standard
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        def.priority === 'Critical'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : def.priority === 'High'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}>
                        {def.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button: Deploy Regional Mobile Training Mission */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setMissionSuccess(null);
                    setShowMissionModal(true);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
                >
                  <Send className="w-4 h-4" />
                  Deploy NSSTA Mobile Training Mission to {selectedZone.code}
                </button>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
              <p className="text-xs">Loading zonal analytics...</p>
            </div>
          )}
        </div>
      </div>

      {/* Regional Mobile Training Mission Modal */}
      {showMissionModal && selectedZone && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                <Building2 className="w-4 h-4" />
                <span>Commission Regional NSSTA Training Mission</span>
              </div>
              <button
                onClick={() => setShowMissionModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {missionSuccess ? (
              <div className="space-y-4 py-2">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Mission Successfully Dispatched!
                  </div>
                  <p className="text-xs">
                    NSSTA mobile faculty team scheduled for <strong>{missionSuccess.zone}</strong>. Field office staff will receive notifications automatically via the Saksham AI portal.
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dispatch ID:</span>
                    <span className="font-mono font-bold text-slate-800">{missionSuccess.dispatch_date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Lead Faculty:</span>
                    <span className="font-semibold text-slate-800">{missionSuccess.lead_faculty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Venue:</span>
                    <span className="font-semibold text-slate-800">{missionSuccess.venues?.[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Staff Capacity:</span>
                    <span className="font-bold text-purple-700">~{missionSuccess.estimated_trainees_impacted} Field Staff</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowMissionModal(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
                >
                  Close & Return to Map
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dispatch an intensive 7-day mobile residential taskforce from <strong>NSSTA Greater Noida</strong> to <strong className="text-slate-900">{selectedZone.name}</strong> to resolve high-priority regional skill gaps.
                </p>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Lead NSSTA Faculty Officer</label>
                  <select
                    value={leadFaculty}
                    onChange={e => setLeadFaculty(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Dr. Radhika Sen, ISS (NSSTA Senior Faculty)">Dr. Radhika Sen, ISS (NSSTA Senior Faculty)</option>
                    <option value="Dr. Rajesh K. Verma, ISS (DDG - National Accounts)">Dr. Rajesh K. Verma, ISS (DDG - National Accounts)</option>
                    <option value="Shri S. K. Mukherjee, ISS (Survey Design Specialist)">Shri S. K. Mukherjee, ISS (Survey Design Specialist)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Target Regional Focus Modules</label>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 max-h-36 overflow-y-auto">
                    {selectedZone.deficits?.map((def, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{def.skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px] space-y-1">
                  <span className="font-bold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Proposed Date: 15 Oct – 21 Oct 2026
                  </span>
                  <p className="text-blue-700">
                    Host Location: <strong>{selectedZone.hq}</strong>
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowMissionModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={deploying}
                    onClick={handleDeployMission}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all disabled:opacity-60"
                  >
                    {deploying ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Dispatching Taskforce...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Confirm & Dispatch Mission
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
