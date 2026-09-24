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
              viewBox="0 0 600 700"
              className="w-full max-w-[520px] h-auto drop-shadow-md select-none transition-all duration-300"
            >
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.15" />
                </filter>
                <filter id="inner-shadow" x="-5%" y="-5%" width="110%" height="110%">
                  <feComponentTransfer in="SourceAlpha"><feFuncA type="table" tableValues="1 0" /></feComponentTransfer>
                  <feGaussianBlur stdDeviation="3" />
                  <feOffset dx="0" dy="2" result="offsetblur" />
                  <feFlood floodColor="#000" floodOpacity="0.12" result="color" />
                  <feComposite in2="offsetblur" operator="in" />
                  <feComposite in2="SourceAlpha" operator="in" />
                  <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* India outer boundary (faint guide) */}
              <path
                d="M248 8 L225 12 L190 22 L168 38 L150 55 L138 72 L130 95 L125 118 L118 135 L105 155 L95 172 L82 195 L72 218 L62 238 L55 265 L52 290 L58 318 L68 345 L85 375 L105 402 L125 428 L148 452 L170 475 L195 498 L218 518 L245 540 L262 558 L275 575 L285 590 L290 600 L295 608 L292 595 L298 580 L308 562 L318 542 L330 520 L342 498 L350 475 L358 450 L362 425 L365 402 L368 378 L375 355 L382 335 L395 312 L405 295 L418 275 L428 258 L435 242 L440 225 L445 208 L448 190 L450 172 L448 155 L442 138 L435 122 L425 108 L412 95 L398 85 L382 75 L365 68 L348 62 L330 55 L312 48 L295 40 L278 30 L262 18 Z"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="0.5"
                strokeDasharray="3 2"
                opacity="0.5"
              />

              {/* ===== NORTHERN ZONE ===== */}
              {/* J&K, Ladakh, HP, Punjab, Haryana, Uttarakhand, Delhi, UP, Rajasthan */}
              <g
                onClick={() => setSelectedZoneId('zone_north')}
                onMouseEnter={() => setHoveredZoneId('zone_north')}
                onMouseLeave={() => setHoveredZoneId(null)}
                className="cursor-pointer"
                style={{ transition: 'opacity 0.2s, transform 0.2s' }}
              >
                {/* Kashmir & Ladakh */}
                <path
                  d="M175 10 L205 5 L240 8 L270 15 L290 30 L275 55 L258 42 L240 35 L218 38 L195 45 L178 38 L165 25 Z"
                  fill={selectedZoneId === 'zone_north' ? '#2563eb' : hoveredZoneId === 'zone_north' ? '#3b82f6' : '#60a5fa'}
                  stroke="#ffffff" strokeWidth="1.5"
                  filter={selectedZoneId === 'zone_north' ? 'url(#glow)' : 'url(#inner-shadow)'}
                  opacity={selectedZoneId === 'zone_north' ? '1' : '0.82'}
                />
                {/* HP, Punjab, Haryana, Uttarakhand */}
                <path
                  d="M165 25 L178 38 L195 45 L218 38 L240 35 L258 42 L275 55 L282 72 L278 92 L268 108 L252 118 L230 125 L205 128 L182 122 L162 110 L148 92 L140 72 L148 50 Z"
                  fill={selectedZoneId === 'zone_north' ? '#2563eb' : hoveredZoneId === 'zone_north' ? '#3b82f6' : '#60a5fa'}
                  stroke="#ffffff" strokeWidth="1.5"
                  filter={selectedZoneId === 'zone_north' ? 'url(#glow)' : 'url(#inner-shadow)'}
                  opacity={selectedZoneId === 'zone_north' ? '1' : '0.82'}
                />
                {/* Delhi, UP, Rajasthan */}
                <path
                  d="M100 120 L140 72 L148 92 L162 110 L182 122 L205 128 L230 125 L252 118 L268 108 L278 92 L290 105 L295 128 L292 155 L280 178 L260 195 L238 205 L215 210 L190 208 L165 198 L142 185 L120 168 L105 148 Z"
                  fill={selectedZoneId === 'zone_north' ? '#2563eb' : hoveredZoneId === 'zone_north' ? '#3b82f6' : '#60a5fa'}
                  stroke="#ffffff" strokeWidth="1.5"
                  filter={selectedZoneId === 'zone_north' ? 'url(#glow)' : 'url(#inner-shadow)'}
                  opacity={selectedZoneId === 'zone_north' ? '1' : '0.82'}
                />
                {/* Zone label */}
                <text x="205" y="120" fill="#ffffff" fontSize="14" fontWeight="800" textAnchor="middle" pointerEvents="none" style={{textShadow: '0 1px 3px rgba(0,0,0,0.3)'}}>
                  NORTH
                </text>
                <text x="205" y="138" fill="#dbeafe" fontSize="13" fontWeight="700" textAnchor="middle" pointerEvents="none">
                  {geoData?.zones?.find(z => z.id === 'zone_north')?.readiness_index || 89.2}%
                </text>
              </g>

              {/* ===== WESTERN ZONE ===== */}
              {/* Gujarat, Maharashtra, Goa */}
              <g
                onClick={() => setSelectedZoneId('zone_west')}
                onMouseEnter={() => setHoveredZoneId('zone_west')}
                onMouseLeave={() => setHoveredZoneId(null)}
                className="cursor-pointer"
                style={{ transition: 'opacity 0.2s, transform 0.2s' }}
              >
                {/* Gujarat */}
                <path
                  d="M60 215 L100 120 L105 148 L120 168 L142 185 L140 210 L128 238 L110 255 L88 268 L68 272 L55 260 L50 240 Z"
                  fill={selectedZoneId === 'zone_west' ? '#059669' : hoveredZoneId === 'zone_west' ? '#10b981' : '#34d399'}
                  stroke="#ffffff" strokeWidth="1.5"
                  filter={selectedZoneId === 'zone_west' ? 'url(#glow)' : 'url(#inner-shadow)'}
                  opacity={selectedZoneId === 'zone_west' ? '1' : '0.82'}
                />
                {/* Maharashtra & Goa */}
                <path
                  d="M68 272 L88 268 L110 255 L128 238 L142 225 L165 228 L185 238 L198 255 L205 278 L200 305 L188 328 L168 345 L145 355 L120 358 L98 350 L80 335 L70 315 L65 295 Z"
                  fill={selectedZoneId === 'zone_west' ? '#059669' : hoveredZoneId === 'zone_west' ? '#10b981' : '#34d399'}
                  stroke="#ffffff" strokeWidth="1.5"
                  filter={selectedZoneId === 'zone_west' ? 'url(#glow)' : 'url(#inner-shadow)'}
                  opacity={selectedZoneId === 'zone_west' ? '1' : '0.82'}
                />
                <text x="120" y="288" fill="#ffffff" fontSize="14" fontWeight="800" textAnchor="middle" pointerEvents="none" style={{textShadow: '0 1px 3px rgba(0,0,0,0.3)'}}>
                  WEST
                </text>
                <text x="120" y="306" fill="#d1fae5" fontSize="13" fontWeight="700" textAnchor="middle" pointerEvents="none">
                  {geoData?.zones?.find(z => z.id === 'zone_west')?.readiness_index || 87.5}%
                </text>
              </g>

              {/* ===== CENTRAL ZONE ===== */}
              {/* MP, Chhattisgarh */}
              <g
                onClick={() => setSelectedZoneId('zone_central')}
                onMouseEnter={() => setHoveredZoneId('zone_central')}
                onMouseLeave={() => setHoveredZoneId(null)}
                className="cursor-pointer"
                style={{ transition: 'opacity 0.2s, transform 0.2s' }}
              >
                <path
                  d="M142 185 L165 198 L190 208 L215 210 L238 205 L260 195 L280 205 L298 218 L312 238 L318 262 L310 288 L295 308 L275 322 L252 330 L228 335 L205 328 L188 328 L200 305 L205 278 L198 255 L185 238 L165 228 L142 225 Z"
                  fill={selectedZoneId === 'zone_central' ? '#0891b2' : hoveredZoneId === 'zone_central' ? '#06b6d4' : '#22d3ee'}
                  stroke="#ffffff" strokeWidth="1.5"
                  filter={selectedZoneId === 'zone_central' ? 'url(#glow)' : 'url(#inner-shadow)'}
                  opacity={selectedZoneId === 'zone_central' ? '1' : '0.82'}
                />
                <text x="235" y="262" fill="#ffffff" fontSize="13" fontWeight="800" textAnchor="middle" pointerEvents="none" style={{textShadow: '0 1px 3px rgba(0,0,0,0.3)'}}>
                  CENTRAL
                </text>
                <text x="235" y="280" fill="#cffafe" fontSize="13" fontWeight="700" textAnchor="middle" pointerEvents="none">
                  {geoData?.zones?.find(z => z.id === 'zone_central')?.readiness_index || 80.2}%
                </text>
              </g>

              {/* ===== EASTERN ZONE ===== */}
              {/* Bihar, Jharkhand, Odisha, West Bengal */}
              <g
                onClick={() => setSelectedZoneId('zone_east')}
                onMouseEnter={() => setHoveredZoneId('zone_east')}
                onMouseLeave={() => setHoveredZoneId(null)}
                className="cursor-pointer"
                style={{ transition: 'opacity 0.2s, transform 0.2s' }}
              >
                <path
                  d="M290 105 L310 98 L332 92 L355 98 L368 112 L375 132 L378 155 L375 178 L368 198 L358 218 L342 232 L325 242 L318 262 L312 238 L298 218 L280 205 L260 195 L280 178 L292 155 L295 128 Z"
                  fill={selectedZoneId === 'zone_east' ? '#d97706' : hoveredZoneId === 'zone_east' ? '#f59e0b' : '#fbbf24'}
                  stroke="#ffffff" strokeWidth="1.5"
                  filter={selectedZoneId === 'zone_east' ? 'url(#glow)' : 'url(#inner-shadow)'}
                  opacity={selectedZoneId === 'zone_east' ? '1' : '0.82'}
                />
                {/* Odisha coastal strip */}
                <path
                  d="M318 262 L325 242 L342 232 L358 245 L368 268 L372 295 L362 318 L345 335 L325 342 L310 338 L295 328 L295 308 L310 288 Z"
                  fill={selectedZoneId === 'zone_east' ? '#d97706' : hoveredZoneId === 'zone_east' ? '#f59e0b' : '#fbbf24'}
                  stroke="#ffffff" strokeWidth="1.5"
                  filter={selectedZoneId === 'zone_east' ? 'url(#glow)' : 'url(#inner-shadow)'}
                  opacity={selectedZoneId === 'zone_east' ? '1' : '0.82'}
                />
                <text x="335" y="190" fill="#ffffff" fontSize="13" fontWeight="800" textAnchor="middle" pointerEvents="none" style={{textShadow: '0 1px 3px rgba(0,0,0,0.3)'}}>
                  EAST
                </text>
                <text x="335" y="208" fill="#fef3c7" fontSize="13" fontWeight="700" textAnchor="middle" pointerEvents="none">
                  {geoData?.zones?.find(z => z.id === 'zone_east')?.readiness_index || 83.6}%
                </text>
              </g>

              {/* ===== NORTH-EASTERN ZONE ===== */}
              {/* Assam, Meghalaya, Manipur, Mizoram, Tripura, Nagaland, Arunachal, Sikkim */}
              <g
                onClick={() => setSelectedZoneId('zone_northeast')}
                onMouseEnter={() => setHoveredZoneId('zone_northeast')}
                onMouseLeave={() => setHoveredZoneId(null)}
                className="cursor-pointer"
                style={{ transition: 'opacity 0.2s, transform 0.2s' }}
              >
                {/* Sikkim & Arunachal */}
                <path
                  d="M368 112 L388 85 L415 68 L445 62 L478 68 L502 82 L518 100 L520 118 L512 135 L498 148 L480 155 L460 158 L442 155 L425 148 L408 138 L395 128 L382 120 L375 112 Z"
                  fill={selectedZoneId === 'zone_northeast' ? '#db2777' : hoveredZoneId === 'zone_northeast' ? '#ec4899' : '#f472b6'}
                  stroke="#ffffff" strokeWidth="1.5"
                  filter={selectedZoneId === 'zone_northeast' ? 'url(#glow)' : 'url(#inner-shadow)'}
                  opacity={selectedZoneId === 'zone_northeast' ? '1' : '0.82'}
                />
                {/* Assam corridor & remaining NE states */}
                <path
                  d="M375 132 L395 128 L408 138 L425 148 L442 155 L460 158 L480 155 L498 165 L505 182 L498 200 L485 215 L468 225 L448 230 L428 228 L412 220 L398 208 L388 192 L380 175 L376 158 Z"
                  fill={selectedZoneId === 'zone_northeast' ? '#db2777' : hoveredZoneId === 'zone_northeast' ? '#ec4899' : '#f472b6'}
                  stroke="#ffffff" strokeWidth="1.5"
                  filter={selectedZoneId === 'zone_northeast' ? 'url(#glow)' : 'url(#inner-shadow)'}
                  opacity={selectedZoneId === 'zone_northeast' ? '1' : '0.82'}
                />
                <text x="445" y="145" fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle" pointerEvents="none" style={{textShadow: '0 1px 3px rgba(0,0,0,0.3)'}}>
                  NORTH-EAST
                </text>
                <text x="445" y="162" fill="#fce7f3" fontSize="12" fontWeight="700" textAnchor="middle" pointerEvents="none">
                  {geoData?.zones?.find(z => z.id === 'zone_northeast')?.readiness_index || 76.8}%
                </text>
              </g>

              {/* ===== SOUTHERN ZONE ===== */}
              {/* Andhra Pradesh, Telangana, Karnataka, Kerala, Tamil Nadu */}
              <g
                onClick={() => setSelectedZoneId('zone_south')}
                onMouseEnter={() => setHoveredZoneId('zone_south')}
                onMouseLeave={() => setHoveredZoneId(null)}
                className="cursor-pointer"
                style={{ transition: 'opacity 0.2s, transform 0.2s' }}
              >
                {/* Telangana & AP */}
                <path
                  d="M145 355 L168 345 L188 328 L205 328 L228 335 L252 330 L275 322 L295 328 L310 338 L325 342 L338 355 L342 375 L335 398 L320 418 L298 432 L275 440 L250 442 L225 438 L200 428 L178 412 L158 392 L148 375 Z"
                  fill={selectedZoneId === 'zone_south' ? '#7c3aed' : hoveredZoneId === 'zone_south' ? '#8b5cf6' : '#a78bfa'}
                  stroke="#ffffff" strokeWidth="1.5"
                  filter={selectedZoneId === 'zone_south' ? 'url(#glow)' : 'url(#inner-shadow)'}
                  opacity={selectedZoneId === 'zone_south' ? '1' : '0.82'}
                />
                {/* Karnataka, Kerala & TN — southern peninsula */}
                <path
                  d="M120 358 L145 355 L148 375 L158 392 L178 412 L200 428 L225 438 L250 442 L275 440 L298 432 L308 448 L312 468 L308 492 L298 515 L282 538 L265 558 L248 572 L235 582 L225 590 L218 596 L215 600 L210 605 L205 598 L198 585 L188 568 L175 548 L162 525 L148 498 L138 472 L128 448 L118 425 L112 398 L110 375 Z"
                  fill={selectedZoneId === 'zone_south' ? '#7c3aed' : hoveredZoneId === 'zone_south' ? '#8b5cf6' : '#a78bfa'}
                  stroke="#ffffff" strokeWidth="1.5"
                  filter={selectedZoneId === 'zone_south' ? 'url(#glow)' : 'url(#inner-shadow)'}
                  opacity={selectedZoneId === 'zone_south' ? '1' : '0.82'}
                />
                <text x="218" y="465" fill="#ffffff" fontSize="14" fontWeight="800" textAnchor="middle" pointerEvents="none" style={{textShadow: '0 1px 3px rgba(0,0,0,0.3)'}}>
                  SOUTH
                </text>
                <text x="218" y="484" fill="#ede9fe" fontSize="13" fontWeight="700" textAnchor="middle" pointerEvents="none">
                  {geoData?.zones?.find(z => z.id === 'zone_south')?.readiness_index || 91.4}%
                </text>
              </g>

              {/* ===== ZONAL HQ PIN MARKERS ===== */}
              {/* Delhi (North) */}
              <g>
                <circle cx="228" cy="155" r="6" fill="#ffffff" stroke="#1e3a8a" strokeWidth="2.5" />
                <circle cx="228" cy="155" r="2.5" fill="#2563eb" />
                <text x="240" y="152" fill="#1e293b" fontSize="9" fontWeight="700" style={{textShadow: '0 0 3px #fff, 0 0 3px #fff'}}>New Delhi</text>
              </g>

              {/* Mumbai (West) */}
              <g>
                <circle cx="95" cy="305" r="6" fill="#ffffff" stroke="#047857" strokeWidth="2.5" />
                <circle cx="95" cy="305" r="2.5" fill="#059669" />
                <text x="62" y="322" fill="#1e293b" fontSize="9" fontWeight="700" style={{textShadow: '0 0 3px #fff, 0 0 3px #fff'}}>Mumbai</text>
              </g>

              {/* Bhopal (Central) */}
              <g>
                <circle cx="215" cy="235" r="6" fill="#ffffff" stroke="#0e7490" strokeWidth="2.5" />
                <circle cx="215" cy="235" r="2.5" fill="#0891b2" />
                <text x="195" y="228" fill="#1e293b" fontSize="9" fontWeight="700" style={{textShadow: '0 0 3px #fff, 0 0 3px #fff'}}>Bhopal</text>
              </g>

              {/* Kolkata (East) */}
              <g>
                <circle cx="358" cy="200" r="6" fill="#ffffff" stroke="#b45309" strokeWidth="2.5" />
                <circle cx="358" cy="200" r="2.5" fill="#d97706" />
                <text x="348" y="218" fill="#1e293b" fontSize="9" fontWeight="700" style={{textShadow: '0 0 3px #fff, 0 0 3px #fff'}}>Kolkata</text>
              </g>

              {/* Guwahati (North-East) */}
              <g>
                <circle cx="418" cy="172" r="6" fill="#ffffff" stroke="#be185d" strokeWidth="2.5" />
                <circle cx="418" cy="172" r="2.5" fill="#db2777" />
                <text x="425" y="188" fill="#1e293b" fontSize="9" fontWeight="700" style={{textShadow: '0 0 3px #fff, 0 0 3px #fff'}}>Guwahati</text>
              </g>

              {/* Bengaluru (South) */}
              <g>
                <circle cx="195" cy="470" r="6" fill="#ffffff" stroke="#6d28d9" strokeWidth="2.5" />
                <circle cx="195" cy="470" r="2.5" fill="#7c3aed" />
                <text x="155" y="485" fill="#1e293b" fontSize="9" fontWeight="700" style={{textShadow: '0 0 3px #fff, 0 0 3px #fff'}}>Bengaluru</text>
              </g>

              {/* Sri Lanka placeholder for geographical context */}
              <ellipse cx="248" cy="632" rx="22" ry="14" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.8" opacity="0.5" />
              <text x="248" y="636" fill="#94a3b8" fontSize="7" textAnchor="middle" pointerEvents="none">Sri Lanka</text>

              {/* Andaman & Nicobar context */}
              <ellipse cx="420" cy="468" rx="8" ry="28" fill="#a78bfa" stroke="#ffffff" strokeWidth="1" opacity="0.4" />
              <text x="438" y="468" fill="#94a3b8" fontSize="7" pointerEvents="none">A&N</text>

              {/* Lakshadweep context */}
              <circle cx="82" cy="468" r="5" fill="#a78bfa" stroke="#ffffff" strokeWidth="1" opacity="0.4" />
              <text x="55" y="478" fill="#94a3b8" fontSize="7" pointerEvents="none">Lkdp</text>
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
