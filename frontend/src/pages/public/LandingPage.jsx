import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockUsers } from '../../data/mockUsers';
import {
  Brain,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Target,
  Award,
  BookOpen,
  CheckCircle2,
  FileText,
  Shield,
  Layers,
  ChevronRight,
  Activity,
  Users,
  Compass,
  Cpu,
  BarChart2,
  Lock,
  Zap,
  Menu,
  X,
  Bot,
  Building2,
  GraduationCap
} from 'lucide-react';

const CLOSED_LOOP_STAGES = [
  {
    step: '01',
    title: 'Cadre & Role Mapping',
    subtitle: 'Competency Framework Baseline',
    tag: 'Profile Engine',
    description: 'Builds an individual competency profile mapping role, experience, qualifications, training history, and baseline skill benchmarks across Official Statistics domains.',
    icon: Users
  },
  {
    step: '02',
    title: 'AI Skill-Gap Analysis',
    subtitle: 'Competency Delta Detection',
    tag: 'Gap Engine',
    description: 'Calculates real-time proficiency deltas across 7 national statistical competency axes against ISS/SSS cadre role standards.',
    icon: TrendingUp
  },
  {
    step: '03',
    title: 'Personalized Pathways',
    subtitle: 'iGOT + NSSTA Synergies',
    tag: 'Path Synthesizer',
    description: 'Generates step-by-step adaptive learning roadmaps combining iGOT digital modules with NSSTA Greater Noida residential workshop nominations.',
    icon: Compass
  },
  {
    step: '04',
    title: 'Adaptive Learning',
    subtitle: 'Contextual Study & Drills',
    tag: 'Course Studio',
    description: 'Directs learners to curated micro-learning units with automated bookmarking and modular progress synchronization.',
    icon: GraduationCap
  },
  {
    step: '05',
    title: 'RAG AI Assessment',
    subtitle: 'Automated MCQ Generation',
    tag: 'Quiz Generator',
    description: 'Retrieval-Augmented Generation synthesizes diagnostic questions directly from official MoSPI manuals with automated citations.',
    icon: Bot
  },
  {
    step: '06',
    title: 'Closed-Loop Calibration',
    subtitle: 'Continuous Skill Growth',
    tag: 'Loop Closure',
    description: 'Assessment outcomes instantly recalibrate the officer’s competency matrix and refresh downstream recommendations.',
    icon: Activity
  }
];

const ROLE_PROFILES = [
  {
    id: 'sso',
    roleName: 'Senior Statistical Officer (SSO)',
    department: 'National Accounts Division (NAD)',
    readiness: '74.9%',
    topSkills: [
      { name: 'National Accounts (SNA 2008)', current: 2.7, required: 4.0, gap: '-1.3' },
      { name: 'AI & ML for Microdata', current: 1.3, required: 3.0, gap: '-1.7' },
      { name: 'Survey Sampling & Multipliers', current: 2.2, required: 3.5, gap: '-1.3' },
      { name: 'Price Indices (CPI / WPI)', current: 3.5, required: 3.5, gap: '0.0' },
      { name: 'DPDPA & Data Governance', current: 3.8, required: 3.5, gap: '+0.3' }
    ],
    recommendedCourses: [
      { title: 'Gross Value Added (GVA) Compilation in SNA 2008', source: 'NSSTA Greater Noida' },
      { title: 'Supervised ML for Survey Anomaly Detection', source: 'iGOT Karmayogi Bharat' }
    ]
  },
  {
    id: 'jso',
    roleName: 'Junior Statistical Officer (JSO)',
    department: 'Survey Design and Research Division (SDRD)',
    readiness: '81.2%',
    topSkills: [
      { name: 'Python Data Wrangling & Pandas', current: 2.0, required: 3.5, gap: '-1.5' },
      { name: 'Multi-Stage Stratified Sampling', current: 2.8, required: 3.5, gap: '-0.7' },
      { name: 'Digital Governance & DPDPA 2023', current: 2.2, required: 4.0, gap: '-1.8' },
      { name: 'CAPI Field Audit Standards', current: 3.9, required: 3.5, gap: '+0.4' },
      { name: 'Official Statistics Dissemination', current: 3.6, required: 3.5, gap: '+0.1' }
    ],
    recommendedCourses: [
      { title: 'Survey Microdata Processing in Python & R', source: 'iGOT Karmayogi Bharat' },
      { title: 'Data Privacy Compliance for Field Officers', source: 'Swayam / MoSPI' }
    ]
  },
  {
    id: 'trainer',
    roleName: 'Director / NSSTA Faculty Trainer',
    department: 'National Statistical Systems Training Academy',
    readiness: '94.6%',
    topSkills: [
      { name: 'Advanced Sampling Theory & Estimation', current: 4.8, required: 5.0, gap: '-0.2' },
      { name: 'Curriculum & Question Bank Design', current: 4.9, required: 5.0, gap: '-0.1' },
      { name: 'Statistical Modeling & Policy Simulation', current: 4.6, required: 4.5, gap: '+0.1' },
      { name: 'Executive Leadership & Briefing', current: 4.5, required: 4.5, gap: '0.0' },
      { name: 'RAG Document Ingestion & QA Audit', current: 4.7, required: 4.5, gap: '+0.2' }
    ],
    recommendedCourses: [
      { title: 'AI-Assisted Educational Content Generation', source: 'NSSTA Faculty Studio' },
      { title: 'Econometric Forecasting with Big Data', source: 'LBSNAA Mussoorie' }
    ]
  }
];

const QUIZ_SAMPLES = {
  sna: {
    topic: 'National Accounts (SNA 2008)',
    difficulty: 'Operational (SSO)',
    competency: 'Gross Value Added (GVA)',
    question: 'Under SNA 2008 guidelines for Gross Value Added (GVA) compilation, which method is mandated to derive real output and intermediate consumption separately?',
    options: [
      'Single Indicator Extrapolation using CPI',
      'Double Deflation method using output and input specific price indices',
      'Nominal value indexing with GDP Deflator',
      'Unweighted physical quantity aggregation'
    ],
    correct: 1,
    explanation: 'SNA 2008 specifies Double Deflation as the standard method where gross output is deflated by an output price index and intermediate inputs are deflated by an input price index.'
  },
  sampling: {
    topic: 'Survey Sampling & Multipliers',
    difficulty: 'Intermediate (JSO)',
    competency: 'Multi-Stage Sampling',
    question: 'In NSS socio-economic surveys, what is the Primary Sampling Unit (PSU) in the rural sector according to MoSPI sampling framework?',
    options: [
      'Census Village / Frame Village',
      'Urban Frame Survey (UFS) Block',
      'Sub-District (Tehsil) Headquarters',
      'Individual Household Enterprise'
    ],
    correct: 0,
    explanation: 'In the rural sector of NSS surveys, census villages as per the latest population census serve as the First Stage Units (FSUs) or PSUs.'
  },
  privacy: {
    topic: 'Data Privacy & Governance (DPDPA)',
    difficulty: 'Executive / Regulatory',
    competency: 'Digital Governance',
    question: 'Under the Digital Personal Data Protection Act (DPDPA) 2023, what technique is mandatory prior to public microdata dissemination by statistical bodies?',
    options: [
      'Raw CSV dump without schema anonymization',
      'k-Anonymity and Differential Privacy masking of Direct Identifiers',
      'Plaintext encryption with public decryption keys',
      'Manual redaction of only telephone numbers'
    ],
    correct: 1,
    explanation: 'DPDPA 2023 mandates statistical masking, k-anonymity, and noise addition (differential privacy) to protect statistical data subjects before microdata release.'
  }
};

const MOSPI_DIVISIONS = [
  {
    name: 'National Accounts Division (NAD)',
    domain: 'GDP, GVA, Capital Formation & Supply-Use Tables',
    badge: 'Macroeconomics',
    color: 'from-blue-600 to-indigo-600',
    avatar: 'NAD'
  },
  {
    name: 'Survey Design & Research (SDRD)',
    domain: 'NSS Sampling Design, Questionnaires & Field Protocols',
    badge: 'Survey Theory',
    color: 'from-purple-600 to-pink-600',
    avatar: 'SDRD'
  },
  {
    name: 'Field Operations Division (FOD)',
    domain: 'Nationwide CAPI Enumeration, ASI & PLFS Collections',
    badge: 'Field Operations',
    color: 'from-emerald-600 to-teal-600',
    avatar: 'FOD'
  },
  {
    name: 'Price Statistics Division (PSD)',
    domain: 'CPI Urban/Rural, Base Revision & Inflation Indices',
    badge: 'Price Metrics',
    color: 'from-amber-600 to-orange-600',
    avatar: 'PSD'
  },
  {
    name: 'Data Informatics & Innovation (DIID)',
    domain: 'Microdata Dissemination, AI Pipelines & Cloud Infrastructure',
    badge: 'Data Systems',
    color: 'from-cyan-600 to-blue-600',
    avatar: 'DIID'
  },
  {
    name: 'NSSTA Training Academy',
    domain: 'Capacity Building, ISS Induction & In-Service Programs',
    badge: 'Academy & Pedagogy',
    color: 'from-rose-600 to-red-600',
    avatar: 'NSSTA'
  }
];

const DEMO_PERSONAS = [
  {
    role: 'learner',
    name: 'Arjun Sharma, ISS',
    title: 'Senior Statistical Officer (SSO)',
    department: 'National Accounts Division (NAD)',
    badge: 'Learner Portal',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    avatarBg: 'bg-blue-600 text-white',
    initials: 'AS',
    desc: 'Explore 7-axis competency radar, automated skill-gap analysis, iGOT course recommendations, and diagnostic assessments.'
  },
  {
    role: 'trainer',
    name: 'Dr. Radhika Sen, ISS',
    title: 'Senior Faculty & Trainer',
    department: 'National Statistical Systems Training Academy',
    badge: 'Trainer Studio',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    avatarBg: 'bg-purple-600 text-white',
    initials: 'RS',
    desc: 'Access RAG Content Studio to upload MoSPI guideline manuals, synthesize AI assessment questions, and publish live quizzes.'
  },
  {
    role: 'admin',
    name: 'Dr. Rajesh Verma, ISS',
    title: 'Director General (DG)',
    department: 'Ministry of Statistics & Programme Implementation',
    badge: 'Directorate Intel',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    avatarBg: 'bg-amber-600 text-white',
    initials: 'RV',
    desc: 'Inspect organizational heatmaps, cross-division competency deficits, and 12-month workforce predictive readiness trajectories.'
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
  const [activeQuizKey, setActiveQuizKey] = useState('sna');
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isLaunchingDemo, setIsLaunchingDemo] = useState(false);

  const activeRole = ROLE_PROFILES[selectedRoleIndex];
  const activeQuiz = QUIZ_SAMPLES[activeQuizKey];

  const handleLaunchPersona = async (roleType) => {
    setIsLaunchingDemo(true);
    let targetUser = mockUsers.find((u) => u.email.includes('arjun'));
    let targetRoute = '/dashboard';

    if (roleType === 'trainer') {
      targetUser = mockUsers.find((u) => u.email.includes('radhika'));
      targetRoute = '/admin/content';
    } else if (roleType === 'admin') {
      targetUser = mockUsers.find((u) => u.email.includes('rajesh'));
      targetRoute = '/admin/dashboard';
    }

    if (targetUser) {
      login(targetUser, 'mock_token_' + Date.now());
      navigate(targetRoute);
    }
    setIsLaunchingDemo(false);
  };

  const handleQuizSelect = (idx) => {
    setQuizAnswer(idx);
    setShowExplanation(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Top Floating Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-3">
        <nav className="bg-white/95 border border-slate-200 shadow-md backdrop-blur-xl flex justify-between items-center px-6 sm:px-8 py-3 rounded-full w-full max-w-7xl transition-all">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-sm group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-headline font-bold text-lg tracking-tight text-slate-900">
                Saksham AI
              </span>
              <span className="hidden sm:inline-block bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                Active
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-700">
            <a href="#overview" className="hover:text-blue-600 transition-colors">Overview</a>
            <a href="#closed-loop" className="hover:text-blue-600 transition-colors">Closed-Loop Engine</a>
            <a href="#competency-demo" className="hover:text-blue-600 transition-colors">Skill Radar</a>
            <a href="#quiz-simulator" className="hover:text-blue-600 transition-colors">AI Quiz Studio</a>
            <a href="#divisions" className="hover:text-blue-600 transition-colors">Cadres &amp; Divisions</a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={() => navigate(user.role?.includes('admin') ? '/admin/dashboard' : '/dashboard')}
                className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-md text-white text-xs font-semibold px-4 py-2 rounded-full transition-all"
              >
                <span>Dashboard ({user.name?.split(' ')[0]})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-700 hover:text-blue-600 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <button
                  onClick={() => handleLaunchPersona('learner')}
                  disabled={isLaunchingDemo}
                  className="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-sm active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                  <span>Launch Portal</span>
                </button>
              </>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-slate-700 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-20 left-4 right-4 z-50 bg-white border border-slate-200 p-5 space-y-3 rounded-2xl shadow-xl">
          <a href="#overview" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-slate-800 py-1.5 hover:text-blue-600">Overview</a>
          <a href="#closed-loop" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-slate-800 py-1.5 hover:text-blue-600">Closed-Loop AI</a>
          <a href="#competency-demo" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-slate-800 py-1.5 hover:text-blue-600">Skill Radar</a>
          <a href="#quiz-simulator" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-slate-800 py-1.5 hover:text-blue-600">AI Quiz Studio</a>
          <a href="#divisions" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-slate-800 py-1.5 hover:text-blue-600">MoSPI Divisions</a>
          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            <Link to="/login" className="w-full text-center py-2 text-xs font-semibold bg-slate-100 text-slate-900 rounded-lg">Sign In</Link>
            <button onClick={() => { setMobileMenuOpen(false); handleLaunchPersona('learner'); }} className="w-full py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg">Launch Learner Demo</button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="overview" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
            
            {/* Live Indicator Pill */}
            <div className="inline-flex items-center gap-2.5 bg-white border border-slate-200 rounded-full px-4 py-1.5 mb-8 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Official Statistics Competency Framework • National Intelligence
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-headline text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-slate-900">
              AI-Powered Skill Intelligence for <br />
              <span className="text-gradient">
                India’s Official Statistical System
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl font-normal">
              Dynamic competency profiling, automated skill-gap analysis, and RAG-grounded assessments for <strong className="text-slate-900 font-bold">National Accounts (SNA 2008)</strong>, <strong className="text-slate-900 font-bold">NSSO Surveys</strong>, and <strong className="text-slate-900 font-bold">iGOT Karmayogi</strong> pathways.
            </p>

            {/* Hero CTAs */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => handleLaunchPersona('learner')}
                disabled={isLaunchingDemo}
                className="gradient-button text-white px-8 py-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md"
              >
                <Sparkles className="w-4 h-4 text-blue-100" />
                <span>Launch Learner Portal (SSO)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleLaunchPersona('admin')}
                disabled={isLaunchingDemo}
                className="bg-white border border-slate-200 text-slate-800 px-8 py-4 rounded-xl text-xs sm:text-sm font-semibold hover:border-blue-500 transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <Building2 className="w-4 h-4 text-amber-600" />
                <span>Workforce Intelligence (DG MoSPI)</span>
              </button>
            </div>

            {/* 1-Click Demo Persona Launchpad */}
            <div className="mt-14 w-full pt-8 border-t border-slate-200">
              <p className="text-xs uppercase tracking-wider font-bold text-slate-600 mb-5">
                Instant 1-Click Role Exploration (Pre-configured Official Profiles)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                {DEMO_PERSONAS.map((persona) => (
                  <div
                    key={persona.role}
                    onClick={() => handleLaunchPersona(persona.role)}
                    className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 transition-all cursor-pointer shadow-xs hover:shadow-md"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${persona.badgeColor}`}>
                        {persona.badge}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                    <div className="flex items-center gap-3 my-2">
                      <div className={`w-9 h-9 rounded-xl ${persona.avatarBg} font-bold text-xs flex items-center justify-center shadow-xs`}>
                        {persona.initials}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {persona.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium">{persona.title}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                      {persona.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live System Metrics Strip */}
      <section className="bg-white border-y border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
            <div className="pt-4 md:pt-0">
              <div className="text-2xl sm:text-4xl font-extrabold text-blue-600 font-mono">10,000+</div>
              <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1">Statistical Officers Capacity</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-2xl sm:text-4xl font-extrabold text-purple-600 font-mono">50+</div>
              <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1">MoSPI Competency Frameworks</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-2xl sm:text-4xl font-extrabold text-indigo-600 font-mono">120+</div>
              <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1">iGOT &amp; NSSTA Mapped Modules</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-2xl sm:text-4xl font-extrabold text-emerald-600 font-mono">100%</div>
              <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1">RAG-Grounded AI Assessments</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive 6-Stage Closed-Loop AI Learning Cycle */}
      <section id="closed-loop" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold mb-3">
              Continuous Competency Engine
            </div>
            <h2 className="font-headline text-2xl sm:text-4xl font-bold text-slate-900">
              The 6-Stage Closed-Loop AI Learning Cycle
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 font-medium">
              Explore how Saksham AI dynamically assesses, remediates, and recalibrates statistical competencies.
            </p>
          </div>

          {/* Interactive Timeline Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
            {CLOSED_LOOP_STAGES.map((stg, idx) => {
              const IconComp = stg.icon;
              const isCurrent = activeStage === idx;
              return (
                <button
                  key={stg.step}
                  onClick={() => setActiveStage(idx)}
                  className={`p-4 rounded-2xl text-left border transition-all relative overflow-hidden ${
                    isCurrent
                      ? 'bg-blue-50/90 border-blue-600 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-mono font-bold ${isCurrent ? 'text-blue-600' : 'text-slate-500'}`}>
                      {stg.step}
                    </span>
                    <IconComp className={`w-4 h-4 ${isCurrent ? 'text-blue-600' : 'text-slate-500'}`} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate">{stg.title}</h4>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">{stg.subtitle}</p>
                  {isCurrent && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Stage Deep-Dive Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-bold">
                    STAGE {CLOSED_LOOP_STAGES[activeStage].step} OF 06
                  </span>
                  <span className="text-xs font-bold text-slate-600">
                    {CLOSED_LOOP_STAGES[activeStage].tag}
                  </span>
                </div>
                <h3 className="font-headline text-2xl font-bold text-slate-900 mb-2">
                  {CLOSED_LOOP_STAGES[activeStage].title}: {CLOSED_LOOP_STAGES[activeStage].subtitle}
                </h3>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                  {CLOSED_LOOP_STAGES[activeStage].description}
                </p>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => handleLaunchPersona('learner')}
                    className="gradient-button text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2"
                  >
                    <span>Test in Live Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setActiveStage((prev) => (prev + 1) % CLOSED_LOOP_STAGES.length)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2"
                  >
                    <span>Next: {CLOSED_LOOP_STAGES[(activeStage + 1) % CLOSED_LOOP_STAGES.length].title}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Simulation Visualizer Box (High Contrast Dark Box) */}
              <div className="lg:col-span-5 bg-[#090D16] p-5 rounded-2xl border border-slate-800 font-mono text-xs text-white shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400 text-[11px]">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Engine Simulator
                  </span>
                  <span className="text-cyan-400 font-bold">FastAPI AI v2.4</span>
                </div>
                <div className="mt-4 space-y-2.5 text-[11px]">
                  <div className="text-cyan-300 font-semibold">▶ Executing: {CLOSED_LOOP_STAGES[activeStage].title}...</div>
                  {activeStage === 0 && (
                    <>
                      <div className="text-slate-300">✓ Ingesting Cadre Profile: Arjun Sharma (SSO - NAD)</div>
                      <div className="text-slate-300">✓ Benchmarking against MoSPI Competency Matrix 2026</div>
                      <div className="text-emerald-400 font-semibold">✓ Baseline Profile Established (7 Core Competencies)</div>
                    </>
                  )}
                  {activeStage === 1 && (
                    <>
                      <div className="text-slate-300">✓ Computing Target vs Observed Proficiency Deltas</div>
                      <div className="text-amber-300 font-semibold">⚠ Deficit Flagged: SNA 2008 GVA Balancing (Gap: -1.3)</div>
                      <div className="text-amber-300 font-semibold">⚠ Deficit Flagged: Microdata Analytics (Gap: -1.7)</div>
                      <div className="text-emerald-400 font-semibold">✓ Overall Role Readiness Computed: 74.9%</div>
                    </>
                  )}
                  {activeStage === 2 && (
                    <>
                      <div className="text-slate-300">✓ Querying iGOT Karmayogi Course API Index...</div>
                      <div className="text-slate-300">✓ Querying NSSTA-TPAC Residential Workshop Schedules...</div>
                      <div className="text-emerald-400 font-semibold">✓ Synthesized 3-Stage Personalized Career Pathway</div>
                    </>
                  )}
                  {activeStage === 3 && (
                    <>
                      <div className="text-slate-300">✓ Learner Enrolled: SNA 2008 Gross Value Added</div>
                      <div className="text-slate-300">✓ Micro-learning modules &amp; statistical reference manuals loaded</div>
                      <div className="text-emerald-400 font-semibold">✓ Progress Tracking: 25% Completed</div>
                    </>
                  )}
                  {activeStage === 4 && (
                    <>
                      <div className="text-slate-300">✓ Ingesting MoSPI Survey Guidelines (PDF/Text)</div>
                      <div className="text-slate-300">✓ RAG Semantic Chunking &amp; Similarity Retrieval</div>
                      <div className="text-emerald-400 font-semibold">✓ Generated 3 Diagnostic Questions with Explanations</div>
                    </>
                  )}
                  {activeStage === 5 && (
                    <>
                      <div className="text-slate-300">✓ Learner Score: 100% on Multi-Stage Sampling Quiz</div>
                      <div className="text-emerald-400 font-semibold">✓ Competency Level Upgraded: 2.20 ➔ 2.55 (+0.35)</div>
                      <div className="text-cyan-300 font-semibold">✓ Closed-Loop Complete: Updated Recommendations Ready</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Competency Profiler */}
      <section id="competency-demo" className="py-20 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">
              Live Competency Profiler
            </span>
            <h2 className="font-headline text-2xl sm:text-4xl font-bold text-slate-900 mt-2">
              Official Statistics Role-Specific Competency Radar
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 font-normal">
              Benchmark current technical proficiency against mandated MoSPI standards across cadres.
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {ROLE_PROFILES.map((rp, idx) => (
              <button
                key={rp.id}
                onClick={() => setSelectedRoleIndex(idx)}
                className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all shadow-xs ${
                  selectedRoleIndex === idx
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-800 border border-slate-200 hover:border-blue-500'
                }`}
              >
                {rp.roleName}
              </button>
            ))}
          </div>

          {/* Role Breakdown Dashboard Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-200 gap-4">
              <div>
                <span className="text-xs text-blue-600 font-mono font-bold uppercase">{activeRole.department}</span>
                <h3 className="font-headline text-xl font-bold text-slate-900">{activeRole.roleName}</h3>
              </div>
              <div className="flex items-center gap-4 bg-white border border-slate-200 px-4 py-2.5 rounded-xl">
                <div className="text-right">
                  <div className="text-[11px] text-slate-600 uppercase font-semibold">Cadre Readiness</div>
                  <div className="text-xl font-extrabold text-emerald-600 font-mono">{activeRole.readiness}</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </div>

            {/* Competency Gap Bars */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Target vs Observed Competency Scores (Scale: 1.0 - 5.0)
                </h4>
                {activeRole.topSkills.map((sk) => {
                  const currentPct = (sk.current / 5.0) * 100;
                  const requiredPct = (sk.required / 5.0) * 100;
                  const hasGap = parseFloat(sk.gap) < 0;
                  return (
                    <div key={sk.name} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-900">{sk.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-600 font-medium">Current: <strong className="text-slate-900">{sk.current.toFixed(1)}</strong> / {sk.required.toFixed(1)}</span>
                          <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                            hasGap ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            Gap: {sk.gap}
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-3 bg-slate-200 rounded-full relative overflow-hidden">
                        <div className="absolute top-0 bottom-0 w-1 bg-slate-500 z-10" style={{ left: `${requiredPct}%` }} />
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            hasGap ? 'bg-gradient-to-r from-blue-500 to-amber-500' : 'bg-gradient-to-r from-blue-500 to-emerald-500'
                          }`}
                          style={{ width: `${currentPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recommended Action */}
              <div className="lg:col-span-5 bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-4">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Recommended Remediation</span>
                  </div>
                  <div className="space-y-3">
                    {activeRole.recommendedCourses.map((c, i) => (
                      <div key={i} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">
                          {c.source}
                        </span>
                        <h5 className="text-xs font-bold text-slate-900 mt-1.5">{c.title}</h5>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleLaunchPersona('learner')}
                  className="mt-6 w-full py-2.5 gradient-button text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2"
                >
                  <span>Launch Full Interactive Radar in Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RAG AI Assessment Studio */}
      <section id="quiz-simulator" className="py-20 border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-purple-600 font-bold text-xs uppercase tracking-widest">
              RAG-Grounded AI Assessment Studio
            </span>
            <h2 className="font-headline text-2xl sm:text-4xl font-bold text-slate-900 mt-2">
              Instant Diagnostic MCQ Simulator
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 font-normal">
              Select an official statistical topic and test the AI quiz generation engine live.
            </p>
          </div>

          {/* Topic Selectors */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {Object.keys(QUIZ_SAMPLES).map((key) => {
              const q = QUIZ_SAMPLES[key];
              const isSelected = activeQuizKey === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setActiveQuizKey(key);
                    setQuizAnswer(null);
                    setShowExplanation(false);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-xs ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200 hover:border-purple-500'
                  }`}
                >
                  {q.topic}
                </button>
              );
            })}
          </div>

          {/* MCQ Simulator Box */}
          <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-mono font-bold text-purple-700">
                  AI Generated • {activeQuiz.difficulty}
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                Competency: {activeQuiz.competency}
              </span>
            </div>

            <div className="mt-6">
              <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {activeQuiz.question}
              </h4>

              <div className="mt-5 space-y-3">
                {activeQuiz.options.map((opt, idx) => {
                  const isChosen = quizAnswer === idx;
                  const isCorrect = idx === activeQuiz.correct;
                  let optStyle = 'bg-white border-slate-200 text-slate-800 hover:border-blue-500';

                  if (showExplanation) {
                    if (isCorrect) {
                      optStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                    } else if (isChosen && !isCorrect) {
                      optStyle = 'bg-red-50 border-red-500 text-red-900 font-bold';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuizSelect(idx)}
                      className={`w-full text-left p-4 rounded-xl border transition-all text-xs sm:text-sm font-medium flex items-start gap-3 shadow-xs ${optStyle}`}
                    >
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Rationale */}
              {showExplanation && (
                <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold mb-2">
                    {quizAnswer === activeQuiz.correct ? (
                      <span className="text-emerald-700 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-4 h-4" /> Correct Answer!
                      </span>
                    ) : (
                      <span className="text-amber-700 flex items-center gap-1 font-bold">
                        <Activity className="w-4 h-4" /> Methodological Rationale
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    <strong className="text-slate-900">MoSPI Statistical Citation:</strong> {activeQuiz.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Cadres & Divisions */}
      <section id="divisions" className="py-20 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-amber-600 font-bold text-xs uppercase tracking-widest">
              Institutional Framework
            </span>
            <h2 className="font-headline text-2xl sm:text-4xl font-bold text-slate-900 mt-2">
              National Statistical Cadres &amp; Divisions
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 font-normal">
              Customized competency frameworks mapped across Indian Statistical Service (ISS) and Subordinate Statistical Service (SSS) functional divisions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOSPI_DIVISIONS.map((div) => (
              <div
                key={div.name}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 transition-all flex items-start gap-4 shadow-xs"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${div.color} text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0`}>
                  {div.avatar}
                </div>
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold">
                    {div.badge}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1.5">{div.name}</h4>
                  <p className="text-xs text-slate-600 mt-1 font-normal">{div.domain}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stitch Modern Footer */}
      <footer className="border-t border-slate-200 pt-16 pb-8 bg-slate-100 text-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-600" />
              <span className="font-headline font-bold text-lg text-slate-900">Saksham AI</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              National Skill Intelligence &amp; Adaptive Learning Platform for India's Official Statistical System.
            </p>
            <div className="flex gap-2 mt-2">
              <span className="bg-white px-2 py-1 rounded text-[10px] text-blue-700 font-bold border border-slate-200 shadow-xs">AES-256</span>
              <span className="bg-white px-2 py-1 rounded text-[10px] text-emerald-700 font-bold border border-slate-200 shadow-xs">NIC-Ready</span>
              <span className="bg-white px-2 py-1 rounded text-[10px] text-purple-700 font-bold border border-slate-200 shadow-xs">RAG AI</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-xs">
            <h4 className="font-bold text-slate-900 mb-2">Fast Portals</h4>
            <button onClick={() => handleLaunchPersona('learner')} className="text-left text-slate-600 hover:text-blue-600 transition-colors font-medium">
              Learner Portal (SSO Arjun Sharma)
            </button>
            <button onClick={() => handleLaunchPersona('trainer')} className="text-left text-slate-600 hover:text-blue-600 transition-colors font-medium">
              Trainer Studio (Dr. Radhika Sen)
            </button>
            <button onClick={() => handleLaunchPersona('admin')} className="text-left text-slate-600 hover:text-blue-600 transition-colors font-medium">
              Director General Intel (Dr. Rajesh Verma)
            </button>
          </div>
          <div className="flex flex-col gap-2 text-xs">
            <h4 className="font-bold text-slate-900 mb-2">Ecosystem</h4>
            <span className="text-slate-600 font-medium">iGOT Karmayogi API Sync</span>
            <span className="text-slate-600 font-medium">NSSTA Training Calendar</span>
            <span className="text-slate-600 font-medium">MoSPI Competency Framework</span>
          </div>
          <div className="flex flex-col gap-2 text-xs">
            <h4 className="font-bold text-slate-900 mb-2">Institutional Authority</h4>
            <p className="text-slate-900 font-bold">Ministry of Statistics &amp; Programme Implementation</p>
            <p className="text-slate-600 font-normal">Government of India</p>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">Khurshid Lal Bhawan, Janpath, New Delhi - 110001</p>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 max-w-7xl mx-auto px-6 font-medium">
          © 2026 SAKSHAM AI. Ministry of Statistics and Programme Implementation (MoSPI). Government of India.
        </div>
      </footer>
    </div>
  );
}
