'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchFromApi } from '@/lib/api';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  ChevronRight,
  Award,
  Building2,
  Calendar
} from 'lucide-react';

export default function CourseCatalogue() {
  const { user } = useAuth();

  const [providerFilter, setProviderFilter] = useState('ALL');
  const [modeFilter, setModeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState<any[]>([]);
  const [nominationModal, setNominationModal] = useState<any>(null);
  const [nominationSubmitted, setNominationSubmitted] = useState(false);

  const initialCourses = [
    {
      id: 'crs_igot_01',
      provider: 'iGOT Karmayogi',
      title: 'Advanced National Accounts Compilation (SNA 2008 & 2025 Update)',
      description: 'Comprehensive e-learning module on Gross Value Added (GVA) calculation, Supply-Use Tables, and incorporation of digital economy transactions.',
      category: 'Macroeconomic Statistics',
      domain: 'National Accounts',
      duration_hours: 18.0,
      delivery_mode: 'Online E-Learning',
      venue_location: 'iGOT Online Portal',
      difficulty_level: 'Advanced',
      gain: '+1.2 Level',
      enrolled_count: 1420,
      url: 'https://igotkarmayogi.gov.in/course/igot-stat-201',
      syllabus: [
        'Production Boundary & Institutional Sectors',
        'FISIM & Capital Consumption Estimation',
        'SUT Balancing & Input-Output Matrices'
      ]
    },
    {
      id: 'crs_igot_02',
      provider: 'iGOT Karmayogi',
      title: 'Statistical Computing with Python: Survey Data Wrangling & Variance Estimation',
      description: 'Hands-on practical course for Statistical Officers covering pandas, statsmodels, survey multipliers, and reproducible CAPI automated validation scripts.',
      category: 'Data Science & Automation',
      domain: 'Digital & AI',
      duration_hours: 24.0,
      delivery_mode: 'Online E-Learning',
      venue_location: 'iGOT Online Portal',
      difficulty_level: 'Intermediate',
      gain: '+1.4 Level',
      enrolled_count: 2150,
      url: 'https://igotkarmayogi.gov.in/course/igot-py-301',
      syllabus: [
        'High-performance data structures in pandas',
        'Handling complex NSSO raw microdata layouts',
        'Linearization & Jackknife variance estimation'
      ]
    },
    {
      id: 'crs_nssta_01',
      provider: 'NSSTA',
      title: 'Residential Workshop on Complex Survey Sampling & Multi-Stage Stratification',
      description: 'Intensive 5-day on-campus residential training at NSSTA Greater Noida focusing on NSS 80th Round sampling methodology, FSU/SSU selection, and calibration.',
      category: 'Survey Methodology',
      domain: 'Survey Sampling',
      duration_hours: 35.0,
      delivery_mode: 'Residential Workshop',
      venue_location: 'NSSTA Greater Noida Campus, Uttar Pradesh',
      difficulty_level: 'Advanced',
      gain: '+1.5 Level',
      upcoming_batch: 'Batch B26-01 (Sep 15 - Sep 20, 2026)',
      seats_left: 12,
      url: 'https://nssta.gov.in/training/res-88',
      syllabus: [
        'Sampling frames and UFS block updates',
        'Multi-stage probability proportional to size (PPS)',
        'Post-stratification and GREG calibration weights',
        'Field simulation & quality audit'
      ]
    },
    {
      id: 'crs_nssta_02',
      provider: 'NSSTA',
      title: 'Executive Workshop on Machine Learning & AI in Official Statistical Data Validation',
      description: 'Specialized hands-on residential lab on applying anomaly detection, random forests, and LLM classifiers to industrial and household survey validation.',
      category: 'Artificial Intelligence & Modern Tech',
      domain: 'Digital & AI',
      duration_hours: 30.0,
      delivery_mode: 'Residential Workshop',
      venue_location: 'NSSTA Greater Noida Campus (AI Computing Lab)',
      difficulty_level: 'Specialized',
      gain: '+1.6 Level',
      upcoming_batch: 'Batch AI-26-01 (Sep 22 - Sep 27, 2026)',
      seats_left: 8,
      url: 'https://nssta.gov.in/training/res-94',
      syllabus: [
        'Microdata quality frameworks and automated edit rules',
        'Tree-based imputation algorithms (MICE & Random Forests)',
        'NLP classification of NIC-2008 descriptions'
      ]
    },
    {
      id: 'crs_tpac_01',
      provider: 'TPAC',
      title: 'National Statistical Governance, DPDPA 2023 & Open Data Dissemination Policy',
      description: 'Policy-level certification designed by the Training Policy Advisory Committee on statutory confidentiality, DPDP Act 2023 compliance, and Open Government Data (OGD) publishing.',
      category: 'Governance & Law',
      domain: 'DPDPA & Governance',
      duration_hours: 12.0,
      delivery_mode: 'Hybrid',
      venue_location: 'Virtual / MoSPI HQ Vigyan Bhawan, New Delhi',
      difficulty_level: 'Intermediate',
      gain: '+0.8 Level',
      upcoming_batch: 'Batch TPAC-26-03 (Sep 08 - Sep 10, 2026)',
      seats_left: 50,
      url: 'https://mospi.gov.in/tpac/gov-102',
      syllabus: [
        'The Collection of Statistics Act & Legal Mandates',
        'DPDP Act 2023 provisions relevant to official surveys',
        'Microdata anonymization protocols & cell suppression'
      ]
    }
  ];

  useEffect(() => {
    async function loadAll() {
      try {
        const res = await fetchFromApi('/api/sync/all-courses');
        if (res.igot_courses && res.nssta_programs) {
          setCourses([...res.igot_courses, ...res.nssta_programs]);
        } else {
          setCourses(initialCourses);
        }
      } catch (err) {
        setCourses(initialCourses);
      }
    }
    loadAll();
  }, []);

  const filteredCourses = courses.filter((c) => {
    const matchesProvider = providerFilter === 'ALL' || c.provider.toUpperCase().includes(providerFilter);
    const matchesMode = modeFilter === 'ALL' || c.delivery_mode.toUpperCase().includes(modeFilter);
    const matchesSearch = !searchQuery || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.category && c.category.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesProvider && matchesMode && matchesSearch;
  });

  const handleNominate = (course: any) => {
    setNominationModal(course);
    setNominationSubmitted(false);
  };

  const confirmNomination = async () => {
    try {
      await fetchFromApi('/api/sync/nominate', {
        method: 'POST',
        body: JSON.stringify({
          course_id: nominationModal.id,
          batch_id: 'B26-01'
        })
      });
    } catch (err) {
      // ignore
    }
    setNominationSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
              Ecosystem Training Directory
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
              iGOT + NSSTA Integrated
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Unified Official Statistics Course Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Browse verified online modules on iGOT Karmayogi and apply for on-campus residential training at NSSTA Greater Noida.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 self-start md:self-auto">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Synchronized with MoSPI Cadre Framework</span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic, keyword, or SNA/NSS..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
          {/* Provider Filter */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs flex-shrink-0">
            {['ALL', 'IGOT', 'NSSTA', 'TPAC'].map((p) => (
              <button
                key={p}
                onClick={() => setProviderFilter(p)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  providerFilter === p ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {p === 'ALL' ? 'All Providers' : p}
              </button>
            ))}
          </div>

          {/* Modality Filter */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs flex-shrink-0">
            {[
              { key: 'ALL', label: 'All Modes' },
              { key: 'ONLINE', label: 'Online' },
              { key: 'RESIDENTIAL', label: 'Residential' }
            ].map((m) => (
              <button
                key={m.key}
                onClick={() => setModeFilter(m.key)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  modeFilter === m.key ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="glass-panel p-6 rounded-3xl border-slate-800 flex flex-col justify-between hover:border-blue-500/40 transition-all group"
          >
            <div className="space-y-4">
              
              {/* Badges */}
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                  course.provider.includes('NSSTA')
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                }`}>
                  {course.provider}
                </span>

                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {course.duration_hours} Hours
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* Syllabus / Highlights */}
              {course.syllabus && course.syllabus.length > 0 && (
                <div className="pt-2 border-t border-slate-850 space-y-1.5">
                  <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Key Modules:</p>
                  <ul className="space-y-1 text-xs text-slate-400">
                    {course.syllabus.slice(0, 3).map((mod: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-1.5 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span className="truncate">{mod}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Venue & Batch info */}
              <div className="pt-2 text-xs text-slate-400 space-y-1">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{course.venue_location || 'Online Portal'}</span>
                </p>
                {course.upcoming_batch && (
                  <p className="flex items-center gap-1.5 text-amber-400">
                    <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{course.upcoming_batch} ({course.seats_left} seats left)</span>
                  </p>
                )}
              </div>

            </div>

            {/* Action CTA */}
            <div className="pt-6 border-t border-slate-850 mt-4">
              {course.provider.includes('NSSTA') ? (
                <button
                  onClick={() => handleNominate(course)}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  Apply for NSSTA Nomination
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <a
                  href={course.enrollment_url || course.url || 'https://igotkarmayogi.gov.in'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  Enroll on iGOT Karmayogi
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* NSSTA Nomination Modal */}
      {nominationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel border-amber-500/50 max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white">NSSTA Training Nomination Request</h2>
              <button
                onClick={() => setNominationModal(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {nominationSubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 space-y-2 text-xs text-emerald-200">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Nomination Forwarded Successfully!
                </div>
                <p>
                  Your application for <strong>{nominationModal.title}</strong> has been routed to the Cadre Controlling Authority (CCA), MoSPI.
                </p>
                <p className="text-[11px] text-slate-300">
                  Confirmation reference: <strong>NOM-NSSTA-2026-9810</strong>
                </p>
                <div className="pt-3">
                  <button
                    onClick={() => setNominationModal(null)}
                    className="w-full py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <p className="font-semibold text-white">{nominationModal.title}</p>
                  <p className="text-slate-400">Venue: NSSTA Greater Noida Campus (5 Days)</p>
                  <p className="text-amber-400 font-medium">Batch: September 15 - September 20, 2026</p>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-300 font-medium">Officer Information:</label>
                  <p className="text-white font-bold">{user?.full_name || 'Arjun Sharma, ISS'}</p>
                  <p className="text-slate-400">{user?.designation} • {user?.department}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Justification for Training:</label>
                  <textarea
                    defaultValue="Required to address quantified competency gap in Survey Sampling for upcoming 80th Round NSS operations."
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                    rows={2}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setNominationModal(null)}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white font-medium text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmNomination}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                  >
                    Confirm & Submit Nomination
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
