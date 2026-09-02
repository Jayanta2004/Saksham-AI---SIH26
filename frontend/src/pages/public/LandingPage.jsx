import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Brain,
  Sparkles,
  Target,
  TrendingUp,
  Award,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Shield,
  Layers,
  Users,
  Bot,
  Zap,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Cpu,
  Activity,
  Building2,
  Database,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/common/ThemeToggle';

// Demo personas for 1-click launch from landing page
const DEMO_PERSONAS = [
  {
    role: 'learner',
    title: 'Senior Statistical Officer (SSO)',
    name: 'Arjun Sharma',
    cadre: 'ISS / National Accounts Division (NAD)',
    desc: 'Access personal competency radar, personalized iGOT pathways, and AI adaptive quizzes.',
    badge: 'Learner Portal',
    badgeColor: 'bg-cyan-500/10 text-ai-cyan border-ai-cyan/30',
    avatarBg: 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white',
    initials: 'AS'
  },
  {
    role: 'trainer',
    title: 'Senior Faculty & Trainer',
    name: 'Dr. Radhika Sen',
    cadre: 'National Statistical Systems Training Academy (NSSTA)',
    desc: 'Generate RAG-based diagnostic MCQs from training manuals and assess cohort progress.',
    badge: 'Trainer Studio',
    badgeColor: 'bg-purple-500/10 text-ai-purple border-ai-purple/30',
    avatarBg: 'bg-gradient-to-br from-purple-600 to-indigo-500 text-white',
    initials: 'RS'
  },
  {
    role: 'admin',
    title: 'Director General (DG)',
    name: 'Dr. Rajesh Verma',
    cadre: 'Ministry of Statistics & Programme Implementation (MoSPI)',
    desc: 'Inspect organizational skill heatmaps, departmental readiness, and iGOT synchronization.',
    badge: 'Directorate Intel',
    badgeColor: 'bg-amber-500/10 text-warning-amber border-warning-amber/30',
    avatarBg: 'bg-gradient-to-br from-amber-600 to-orange-500 text-white',
    initials: 'RV'
  }
];

// Interactive Role Profiles for preview
const ROLE_PROFILES = [
  {
    id: 'sso_nad',
    roleName: 'Senior Statistical Officer (NAD)',
    department: 'National Accounts Division',
    readiness: '74.9%',
    topSkills: [
      { name: 'National Accounts (SNA 2008)', current: 2.7, required: 4.0, gap: '-1.3' },
      { name: 'Multi-Stage Survey Sampling', current: 3.5, required: 4.0, gap: '-0.5' },
      { name: 'Python/R Microdata Analytics', current: 2.3, required: 4.0, gap: '-1.7' },
      { name: 'Index Numbers & Price Statistics', current: 3.8, required: 4.0, gap: '-0.2' },
      { name: 'Official Statistics Ethics & Protocols', current: 4.0, required: 4.0, gap: '0.0' }
    ],
    recommendedCourses: [
      { title: 'SNA 2008: Gross Value Added & Sectoral Accounts', source: 'iGOT Karmayogi' },
      { title: 'Advanced Microdata Processing using Python & R', source: 'NSSTA Workshop' }
    ]
  },
  {
    id: 'jso_nsso',
    roleName: 'Junior Statistical Officer (FOD)',
    department: 'Field Operations Division (NSSO)',
    readiness: '68.2%',
    topSkills: [
      { name: 'Field Survey Methodologies & CAPI', current: 3.2, required: 4.0, gap: '-0.8' },
      { name: 'Household Consumer Expenditure Survey', current: 2.8, required: 3.5, gap: '-0.7' },
      { name: 'Data Validation & Multiplier Logic', current: 2.4, required: 3.5, gap: '-1.1' },
      { name: 'Periodic Labour Force Survey (PLFS)', current: 3.0, required: 3.5, gap: '-0.5' },
      { name: 'Statistical Report Drafting', current: 3.1, required: 3.5, gap: '-0.4' }
    ],
    recommendedCourses: [
      { title: 'Field Data Scrutiny & Multiplier Computation', source: 'iGOT Karmayogi' },
      { title: 'Digital CAPI Data Collection Protocols', source: 'NSSTA Training' }
    ]
  },
  {
    id: 'jd_cso',
    roleName: 'Joint Director / Officer (CSO)',
    department: 'Central Statistics Office',
    readiness: '84.0%',
    topSkills: [
      { name: 'Macroeconomic Aggregates & Policy Modeling', current: 4.2, required: 4.5, gap: '-0.3' },
      { name: 'Statistical Governance & Dissemination', current: 4.5, required: 4.5, gap: '0.0' },
      { name: 'SDDS Plus Data Standards & Metadata', current: 3.7, required: 4.5, gap: '-0.8' },
      { name: 'Predictive Analytics & AI in Surveys', current: 3.0, required: 4.0, gap: '-1.0' }
    ],
    recommendedCourses: [
      { title: 'International Data Quality Standards (SDDS Plus)', source: 'iGOT Karmayogi' },
      { title: 'Executive Data Leadership in Official Statistics', source: 'NSSTA Executive' }
    ]
  }
];

// Interactive Closed-Loop Stages
const CLOSED_LOOP_STAGES = [
  {
    step: '01',
    title: 'Dynamic Profiling',
    subtitle: 'Cadre & Role Mapping',
    description: 'Builds an individual competency profile mapping role, experience, qualifications, training history, and baseline skill benchmarks across Official Statistics domains.',
    icon: Users,
    color: 'text-ai-cyan',
    tag: 'Profile Engine'
  },
  {
    step: '02',
    title: 'AI Skill-Gap Analysis',
    subtitle: 'Competency Delta Detection',
    description: 'Computes multi-dimensional gaps against official MoSPI competency frameworks, highlighting critical deficits with confidence-weighted readiness scores.',
    icon: TrendingUp,
    color: 'text-ai-purple',
    tag: 'Intelligence Layer'
  },
  {
    step: '03',
    title: 'Personalized Pathways',
    subtitle: 'iGOT + NSSTA Synergies',
    description: 'Recommends tailored learning journeys by harmonizing online iGOT Karmayogi e-learning modules with specialized NSSTA-TPAC in-person workshops.',
    icon: BookOpen,
    color: 'text-ai-cyan',
    tag: 'Recommendation Engine'
  },
  {
    step: '04',
    title: 'Adaptive Learning',
    subtitle: 'Contextual Study & Drills',
    description: 'Learners engage with curated course modules, interactive statistical case studies, and official guidelines at their own self-paced cadence.',
    icon: GraduationCap,
    color: 'text-success-emerald',
    tag: 'Learning Delivery'
  },
  {
    step: '05',
    title: 'RAG AI Assessment',
    subtitle: 'Automated MCQ Generation',
    description: 'Generates rigorous, domain-grounded diagnostic MCQs directly from uploaded survey manuals, SNA reports, or topic prompts with full explanatory feedback.',
    icon: Bot,
    color: 'text-ai-purple',
    tag: 'RAG & LLM Engine'
  },
  {
    step: '06',
    title: 'Closed-Loop Calibration',
    subtitle: 'Continuous Skill Growth',
    description: 'Assessment performance feeds back into the competency profile, recalibrating skill scores and adapting subsequent learning paths automatically.',
    icon: RefreshCw,
    color: 'text-warning-amber',
    tag: 'Closed-Loop Feedback'
  }
];

// Interactive Quiz Playground Samples
const QUIZ_SAMPLES = {
  sampling: {
    topic: 'Survey Sampling & Multipliers (NSSO)',
    question: 'In a two-stage stratified sampling design for NSS surveys where Census Villages are FSUs and Households are SSUs, what is the primary role of the multiplier?',
    options: [
      'To normalize non-response bias across strata',
      'To inflate sample household observations to represent the target population universe',
      'To compute the standard error of the stratum mean',
      'To allocate sample sizes proportionally between rural and urban sectors'
    ],
    correct: 1,
    explanation: 'The multiplier represents the inverse of the inclusion probability of the ultimate sampling unit (household), inflating the sample values to yield unbiased estimates of total population aggregates.',
    competency: 'Sampling & Survey Multipliers',
    difficulty: 'Intermediate (SSO/JSO)'
  },
  national_accounts: {
    topic: 'SNA 2008 & Gross Value Added (NAD)',
    question: 'Under the System of National Accounts (SNA 2008) methodology adopted by India, what is the exact formula for Gross Value Added (GVA) at basic prices?',
    options: [
      'GVA at basic prices = Gross Output at basic prices - Intermediate Consumption',
      'GVA at basic prices = GDP at market prices + Net Product Taxes',
      'GVA at basic prices = Compensation of Employees + Net Imports',
      'GVA at basic prices = Final Consumption Expenditure + Gross Fixed Capital Formation'
    ],
    correct: 0,
    explanation: 'By definition in SNA 2008, GVA at basic prices equals Gross Output measured at basic prices minus the value of Intermediate Consumption consumed during the production process.',
    competency: 'National Accounts (SNA 2008)',
    difficulty: 'Advanced (SSO/JD)'
  },
  iip_indices: {
    topic: 'Index of Industrial Production - IIP (CSO)',
    question: 'Which index formula is primarily utilized in the compilation of the Index of Industrial Production (IIP) in India?',
    options: [
      'Paasche Weighted Price Index',
      'Laspeyres Base-Weighted Quantity Index',
      'Fisher Ideal Geometric Index',
      'Marshall-Edgeworth Index'
    ],
    correct: 1,
    explanation: 'The Index of Industrial Production (IIP) is compiled as a Laspeyres quantity index using fixed base-year gross value added weights allocated to mining, manufacturing, and electricity sectors.',
    competency: 'Price Indices & Industrial Statistics',
    difficulty: 'Intermediate'
  }
};

// MoSPI Statistical Divisions & Cadre Coverage
const MOSPI_DIVISIONS = [
  { name: 'National Accounts Division (NAD)', domain: 'GDP, GVA Compilation & Sectoral Accounts (SNA 2008)', badge: 'Macro Statistics', avatar: 'NAD', color: 'from-blue-600 to-cyan-500' },
  { name: 'Field Operations Division (FOD / NSSO)', domain: 'Large-scale Household Surveys & CAPI Digital Collection', badge: 'Survey Operations', avatar: 'FOD', color: 'from-purple-600 to-pink-500' },
  { name: 'Survey Design & Research Division (SDRD)', domain: 'Multi-Stage Stratified Sampling & Multiplier Frameworks', badge: 'Methodology', avatar: 'SDRD', color: 'from-indigo-600 to-blue-500' },
  { name: 'Price Statistics Division (PSD)', domain: 'Consumer Price Index (CPI) & Inflation Indicators', badge: 'Price Indices', avatar: 'PSD', color: 'from-emerald-600 to-teal-500' },
  { name: 'Data Informatics & Innovation Division (DIID)', domain: 'Microdata Dissemination, Data Governance & Cloud ETL', badge: 'Informatics & AI', avatar: 'DIID', color: 'from-amber-600 to-orange-500' },
  { name: 'National Statistical Systems Training Academy', domain: 'Cadre Capacity Building, Residential & Virtual Training', badge: 'NSSTA Academy', avatar: 'NSSTA', color: 'from-rose-600 to-red-500' }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, demoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  const [activeQuizKey, setActiveQuizKey] = useState('sampling');
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isLaunchingDemo, setIsLaunchingDemo] = useState(false);

  const activeRole = ROLE_PROFILES[selectedRoleIndex];
  const activeQuiz = QUIZ_SAMPLES[activeQuizKey];

  const handleLaunchPersona = async (roleName) => {
    setIsLaunchingDemo(true);
    try {
      const authData = await demoLogin(roleName);
      const userRole = (authData?.user?.role || authData?.user?.role_name || roleName).toLowerCase();
      if (userRole.includes('admin') || userRole.includes('trainer')) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Demo launch error:', err);
      navigate('/login');
    } finally {
      setIsLaunchingDemo(false);
    }
  };

  const handleQuizSelect = (idx) => {
    setQuizAnswer(idx);
    setShowExplanation(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-surface-obsidian text-slate-900 dark:text-on-surface font-sans selection:bg-blue-500 selection:text-white transition-colors duration-200">
      
      {/* Top Floating Glassmorphism Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-3">
        <nav className="glass-nav flex justify-between items-center px-6 sm:px-8 py-3 rounded-full w-full max-w-7xl transition-all">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-ai-cyan to-ai-purple p-0.5 shadow-lg shadow-ai-cyan/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white dark:bg-surface-obsidian rounded-[10px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-blue-600 dark:text-ai-cyan" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-headline font-bold text-lg tracking-tight text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-ai-cyan dark:to-ai-purple drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">
                Saksham AI
              </span>
              <span className="hidden sm:inline-block bg-emerald-500/10 text-success-emerald text-[10px] font-bold px-2 py-0.5 rounded-full border border-success-emerald/30">
                Active
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-700 dark:text-slate-200">
            <a href="#overview" className="hover:text-blue-600 dark:hover:text-ai-cyan transition-colors">Overview</a>
            <a href="#closed-loop" className="hover:text-blue-600 dark:hover:text-ai-cyan transition-colors">Closed-Loop Engine</a>
            <a href="#competency-demo" className="hover:text-blue-600 dark:hover:text-ai-cyan transition-colors">Skill Radar</a>
            <a href="#quiz-simulator" className="hover:text-blue-600 dark:hover:text-ai-cyan transition-colors">AI Quiz Studio</a>
            <a href="#divisions" className="hover:text-blue-600 dark:hover:text-ai-cyan transition-colors">Cadres &amp; Divisions</a>
            <a href="#features" className="hover:text-blue-600 dark:hover:text-ai-cyan transition-colors">Architecture</a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle size="sm" />

            {user ? (
              <button
                onClick={() => navigate(user.role?.includes('admin') ? '/admin/dashboard' : '/dashboard')}
                className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] text-white text-xs font-semibold px-4 py-2 rounded-full transition-all"
              >
                <span>Dashboard ({user.name?.split(' ')[0]})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-ai-cyan px-3 py-1.5 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <button
                  onClick={() => handleLaunchPersona('learner')}
                  disabled={isLaunchingDemo}
                  className="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] text-white text-xs font-semibold px-4 py-2 rounded-full transition-all active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                  <span>Launch Portal</span>
                </button>
              </>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-20 left-4 right-4 z-50 glass-card p-5 space-y-3 rounded-2xl shadow-2xl">
          <a href="#overview" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium py-1.5 hover:text-ai-cyan">Overview</a>
          <a href="#closed-loop" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium py-1.5 hover:text-ai-cyan">Closed-Loop AI</a>
          <a href="#competency-demo" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium py-1.5 hover:text-ai-cyan">Skill Radar</a>
          <a href="#quiz-simulator" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium py-1.5 hover:text-ai-cyan">AI Quiz Studio</a>
          <a href="#divisions" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium py-1.5 hover:text-ai-cyan">MoSPI Divisions</a>
          <div className="pt-3 border-t border-slate-200 dark:border-glass-border flex flex-col gap-2">
            <Link to="/login" className="w-full text-center py-2 text-xs font-semibold bg-slate-100 dark:bg-surface-slate rounded-lg">Sign In</Link>
            <button onClick={() => { setMobileMenuOpen(false); handleLaunchPersona('learner'); }} className="w-full py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg">Launch Learner Demo</button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="overview" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Ambient Glow Backdrops */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-ai-cyan/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-ai-purple/10 rounded-full blur-[130px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
            
            {/* Live Indicator Pill */}
            <div className="inline-flex items-center gap-2.5 glass-card rounded-full px-4 py-1.5 mb-8 border-cyan-500/30">
              <span className="w-2 h-2 rounded-full bg-success-emerald shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-on-surface-variant">
                Official Statistics Competency Framework • National Intelligence
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-headline text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-slate-900 dark:text-on-surface">
              AI-Powered Skill Intelligence for <br />
              <span className="text-gradient">
                India’s Official Statistical System
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-on-surface-variant leading-relaxed max-w-3xl">
              Dynamic competency profiling, automated skill-gap analysis, and RAG-grounded assessments for <strong className="text-slate-900 dark:text-white">National Accounts (SNA 2008)</strong>, <strong className="text-slate-900 dark:text-white">NSSO Surveys</strong>, and <strong className="text-slate-900 dark:text-white">iGOT Karmayogi</strong> pathways.
            </p>

            {/* Hero CTAs */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => handleLaunchPersona('learner')}
                disabled={isLaunchingDemo}
                className="gradient-button text-white px-8 py-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Launch Learner Portal (SSO)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleLaunchPersona('admin')}
                disabled={isLaunchingDemo}
                className="glass-card text-slate-800 dark:text-on-surface px-8 py-4 rounded-xl text-xs sm:text-sm font-semibold hover:border-ai-purple transition-all flex items-center justify-center gap-2"
              >
                <Building2 className="w-4 h-4 text-warning-amber" />
                <span>Workforce Intelligence (DG MoSPI)</span>
              </button>
            </div>

            {/* 1-Click Demo Persona Launchpad */}
            <div className="mt-14 w-full pt-8 border-t border-slate-200 dark:border-glass-border">
              <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-on-surface-variant mb-5">
                Instant 1-Click Role Exploration (Pre-configured Official Profiles)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                {DEMO_PERSONAS.map((persona) => (
                  <div
                    key={persona.role}
                    onClick={() => handleLaunchPersona(persona.role)}
                    className="group p-5 rounded-2xl glass-card hover:border-ai-cyan/50 hover:bg-white/5 transition-all cursor-pointer shadow-sm hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${persona.badgeColor}`}>
                        {persona.badge}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-ai-cyan group-hover:translate-x-1 transition-all" />
                    </div>
                    <div className="flex items-center gap-3 my-2">
                      <div className={`w-9 h-9 rounded-xl ${persona.avatarBg} font-bold text-xs flex items-center justify-center shadow-md`}>
                        {persona.initials}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-ai-cyan transition-colors">
                          {persona.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-on-surface-variant">{persona.title}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-on-surface-variant line-clamp-2 mt-2">
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
      <section className="bg-white dark:bg-surface-obsidian/90 border-y border-slate-200 dark:border-glass-border py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-glass-border">
            <div className="pt-4 md:pt-0">
              <div className="text-2xl sm:text-4xl font-extrabold text-ai-cyan font-mono chart-glow">10,000+</div>
              <div className="text-xs font-medium text-slate-500 dark:text-on-surface-variant uppercase tracking-wider mt-1">Statistical Officers Capacity</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-2xl sm:text-4xl font-extrabold text-ai-purple font-mono">50+</div>
              <div className="text-xs font-medium text-slate-500 dark:text-on-surface-variant uppercase tracking-wider mt-1">MoSPI Competency Frameworks</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-2xl sm:text-4xl font-extrabold text-primary font-mono">120+</div>
              <div className="text-xs font-medium text-slate-500 dark:text-on-surface-variant uppercase tracking-wider mt-1">iGOT &amp; NSSTA Mapped Modules</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-2xl sm:text-4xl font-extrabold text-success-emerald font-mono">100%</div>
              <div className="text-xs font-medium text-slate-500 dark:text-on-surface-variant uppercase tracking-wider mt-1">RAG-Grounded AI Assessments</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive 6-Stage Closed-Loop AI Learning Cycle */}
      <section id="closed-loop" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 text-ai-purple border border-ai-purple/30 text-xs font-semibold mb-3">
              Continuous Competency Engine
            </div>
            <h2 className="font-headline text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              The 6-Stage Closed-Loop AI Learning Cycle
            </h2>
            <p className="text-slate-600 dark:text-on-surface-variant text-sm sm:text-base mt-2">
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
                      ? 'glass-card border-ai-cyan shadow-lg shadow-cyan-500/10'
                      : 'bg-white/50 dark:bg-surface-obsidian/60 border-slate-200 dark:border-glass-border hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-mono font-bold ${isCurrent ? 'text-ai-cyan' : 'text-slate-400 dark:text-on-surface-variant'}`}>
                      {stg.step}
                    </span>
                    <IconComp className={`w-4 h-4 ${isCurrent ? 'text-ai-cyan' : 'text-slate-400 dark:text-on-surface-variant'}`} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{stg.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-on-surface-variant truncate mt-0.5">{stg.subtitle}</p>
                  {isCurrent && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-ai-cyan to-ai-purple" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Stage Deep-Dive Card */}
          <div className="glass-card rounded-2xl p-6 sm:p-10 shadow-2xl border-slate-200 dark:border-glass-border">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-ai-cyan border border-cyan-500/30 text-xs font-mono font-bold">
                    STAGE {CLOSED_LOOP_STAGES[activeStage].step} OF 06
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-on-surface-variant">
                    {CLOSED_LOOP_STAGES[activeStage].tag}
                  </span>
                </div>
                <h3 className="font-headline text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {CLOSED_LOOP_STAGES[activeStage].title}: {CLOSED_LOOP_STAGES[activeStage].subtitle}
                </h3>
                <p className="text-slate-700 dark:text-on-surface-variant text-sm sm:text-base leading-relaxed mb-6">
                  {CLOSED_LOOP_STAGES[activeStage].description}
                </p>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => handleLaunchPersona('learner')}
                    className="gradient-button text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-md flex items-center gap-2"
                  >
                    <span>Test in Live Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setActiveStage((prev) => (prev + 1) % CLOSED_LOOP_STAGES.length)}
                    className="glass-card text-slate-700 dark:text-on-surface px-4 py-2.5 rounded-lg text-xs font-semibold hover:border-ai-purple transition-colors flex items-center gap-2"
                  >
                    <span>Next: {CLOSED_LOOP_STAGES[(activeStage + 1) % CLOSED_LOOP_STAGES.length].title}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Simulation Visualizer Box */}
              <div className="lg:col-span-5 bg-slate-900/90 dark:bg-surface-container-lowest p-5 rounded-xl border border-glass-border font-mono text-xs text-on-surface shadow-inner">
                <div className="flex items-center justify-between pb-3 border-b border-glass-border text-on-surface-variant text-[11px]">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success-emerald animate-pulse"></span>
                    Engine Simulator
                  </span>
                  <span className="text-ai-cyan font-bold">FastAPI AI v2.4</span>
                </div>
                <div className="mt-4 space-y-2.5 text-[11px]">
                  <div className="text-ai-cyan font-semibold">▶ Executing: {CLOSED_LOOP_STAGES[activeStage].title}...</div>
                  {activeStage === 0 && (
                    <>
                      <div className="text-on-surface-variant">✓ Ingesting Cadre Profile: Arjun Sharma (SSO - NAD)</div>
                      <div className="text-on-surface-variant">✓ Benchmarking against MoSPI Competency Matrix 2026</div>
                      <div className="text-success-emerald font-semibold">✓ Baseline Profile Established (7 Core Competencies)</div>
                    </>
                  )}
                  {activeStage === 1 && (
                    <>
                      <div className="text-on-surface-variant">✓ Computing Target vs Observed Proficiency Deltas</div>
                      <div className="text-warning-amber">⚠ Deficit Flagged: SNA 2008 GVA Balancing (Gap: -1.3)</div>
                      <div className="text-warning-amber">⚠ Deficit Flagged: Microdata Analytics (Gap: -1.7)</div>
                      <div className="text-success-emerald font-semibold">✓ Overall Role Readiness Computed: 74.9%</div>
                    </>
                  )}
                  {activeStage === 2 && (
                    <>
                      <div className="text-on-surface-variant">✓ Querying iGOT Karmayogi Course API Index...</div>
                      <div className="text-on-surface-variant">✓ Querying NSSTA-TPAC Residential Workshop Schedules...</div>
                      <div className="text-success-emerald font-semibold">✓ Synthesized 3-Stage Personalized Career Pathway</div>
                    </>
                  )}
                  {activeStage === 3 && (
                    <>
                      <div className="text-on-surface-variant">✓ Learner Enrolled: SNA 2008 Gross Value Added</div>
                      <div className="text-on-surface-variant">✓ Micro-learning modules &amp; statistical reference manuals loaded</div>
                      <div className="text-success-emerald font-semibold">✓ Progress Tracking: 25% Completed</div>
                    </>
                  )}
                  {activeStage === 4 && (
                    <>
                      <div className="text-on-surface-variant">✓ Ingesting MoSPI Survey Guidelines (PDF/Text)</div>
                      <div className="text-on-surface-variant">✓ RAG Semantic Chunking &amp; Similarity Retrieval</div>
                      <div className="text-success-emerald font-semibold">✓ Generated 3 Diagnostic Questions with Explanations</div>
                    </>
                  )}
                  {activeStage === 5 && (
                    <>
                      <div className="text-on-surface-variant">✓ Learner Score: 100% on Multi-Stage Sampling Quiz</div>
                      <div className="text-success-emerald font-semibold">✓ Competency Level Upgraded: 2.20 ➔ 2.55 (+0.35)</div>
                      <div className="text-ai-cyan">✓ Closed-Loop Complete: Updated Recommendations Ready</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Competency Profiler */}
      <section id="competency-demo" className="py-20 border-t border-slate-200 dark:border-glass-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-ai-cyan font-semibold text-xs uppercase tracking-widest">
              Live Competency Profiler
            </span>
            <h2 className="font-headline text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-2">
              Official Statistics Role-Specific Competency Radar
            </h2>
            <p className="text-slate-600 dark:text-on-surface-variant text-sm sm:text-base mt-2">
              Benchmark current technical proficiency against mandated MoSPI standards across cadres.
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {ROLE_PROFILES.map((rp, idx) => (
              <button
                key={rp.id}
                onClick={() => setSelectedRoleIndex(idx)}
                className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                  selectedRoleIndex === idx
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                    : 'glass-card text-slate-700 dark:text-on-surface-variant hover:text-white'
                }`}
              >
                {rp.roleName}
              </button>
            ))}
          </div>

          {/* Role Breakdown Dashboard Card */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-200 dark:border-glass-border gap-4">
              <div>
                <span className="text-xs text-ai-cyan font-mono font-semibold uppercase">{activeRole.department}</span>
                <h3 className="font-headline text-xl font-bold text-slate-900 dark:text-white">{activeRole.roleName}</h3>
              </div>
              <div className="flex items-center gap-4 glass-card px-4 py-2.5 rounded-xl">
                <div className="text-right">
                  <div className="text-[11px] text-slate-500 dark:text-on-surface-variant uppercase font-semibold">Cadre Readiness</div>
                  <div className="text-xl font-extrabold text-success-emerald font-mono">{activeRole.readiness}</div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-success-emerald/30 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-success-emerald" />
                </div>
              </div>
            </div>

            {/* Competency Gap Bars */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-5">
                <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                  Target vs Observed Competency Scores (Scale: 1.0 - 5.0)
                </h4>
                {activeRole.topSkills.map((sk) => {
                  const currentPct = (sk.current / 5.0) * 100;
                  const requiredPct = (sk.required / 5.0) * 100;
                  const hasGap = parseFloat(sk.gap) < 0;
                  return (
                    <div key={sk.name} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-800 dark:text-on-surface">{sk.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500 dark:text-on-surface-variant">Current: <strong className="text-slate-900 dark:text-white">{sk.current.toFixed(1)}</strong> / {sk.required.toFixed(1)}</span>
                          <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                            hasGap ? 'bg-amber-500/10 text-warning-amber border border-warning-amber/30' : 'bg-emerald-500/10 text-success-emerald border border-success-emerald/30'
                          }`}>
                            Gap: {sk.gap}
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-3 bg-slate-200 dark:bg-surface-container rounded-full relative overflow-hidden">
                        <div className="absolute top-0 bottom-0 w-1 bg-slate-400 dark:bg-slate-500 z-10" style={{ left: `${requiredPct}%` }} />
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            hasGap ? 'bg-gradient-to-r from-ai-cyan to-warning-amber' : 'bg-gradient-to-r from-ai-cyan to-success-emerald'
                          }`}
                          style={{ width: `${currentPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recommended Action */}
              <div className="lg:col-span-5 glass-panel p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-ai-cyan uppercase tracking-wider mb-4">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Recommended Remediation</span>
                  </div>
                  <div className="space-y-3">
                    {activeRole.recommendedCourses.map((c, i) => (
                      <div key={i} className="p-3.5 glass-card rounded-xl">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-ai-cyan font-semibold">
                          {c.source}
                        </span>
                        <h5 className="text-xs font-semibold text-slate-900 dark:text-white mt-1.5">{c.title}</h5>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleLaunchPersona('learner')}
                  className="mt-6 w-full py-2.5 gradient-button text-white rounded-xl text-xs font-semibold shadow-md flex items-center justify-center gap-2"
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
      <section id="quiz-simulator" className="py-20 border-t border-slate-200 dark:border-glass-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-ai-purple font-semibold text-xs uppercase tracking-widest">
              RAG-Grounded AI Assessment Studio
            </span>
            <h2 className="font-headline text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-2">
              Instant Diagnostic MCQ Simulator
            </h2>
            <p className="text-slate-600 dark:text-on-surface-variant text-sm sm:text-base mt-2">
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
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-ai-purple to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                      : 'glass-card text-slate-700 dark:text-on-surface-variant hover:text-white'
                  }`}
                >
                  {q.topic}
                </button>
              );
            })}
          </div>

          {/* MCQ Simulator Box */}
          <div className="max-w-3xl mx-auto glass-card rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-glass-border">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-ai-purple" />
                <span className="text-xs font-mono font-semibold text-ai-purple">
                  AI Generated • {activeQuiz.difficulty}
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded glass-card text-on-surface-variant">
                Competency: {activeQuiz.competency}
              </span>
            </div>

            <div className="mt-6">
              <h4 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-snug">
                {activeQuiz.question}
              </h4>

              <div className="mt-5 space-y-3">
                {activeQuiz.options.map((opt, idx) => {
                  const isChosen = quizAnswer === idx;
                  const isCorrect = idx === activeQuiz.correct;
                  let optStyle = 'glass-card hover:border-ai-cyan/50 text-slate-800 dark:text-on-surface';

                  if (showExplanation) {
                    if (isCorrect) {
                      optStyle = 'bg-emerald-500/20 border-success-emerald text-emerald-300';
                    } else if (isChosen && !isCorrect) {
                      optStyle = 'bg-red-500/20 border-red-500 text-red-300';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuizSelect(idx)}
                      className={`w-full text-left p-4 rounded-xl border transition-all text-xs sm:text-sm font-medium flex items-start gap-3 ${optStyle}`}
                    >
                      <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-on-surface font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Rationale */}
              {showExplanation && (
                <div className="mt-6 p-4 rounded-xl glass-panel border border-slate-200 dark:border-glass-border">
                  <div className="flex items-center gap-2 text-xs font-bold mb-2">
                    {quizAnswer === activeQuiz.correct ? (
                      <span className="text-success-emerald flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Correct Answer!
                      </span>
                    ) : (
                      <span className="text-warning-amber flex items-center gap-1">
                        <Activity className="w-4 h-4" /> Methodological Rationale
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 dark:text-on-surface-variant leading-relaxed">
                    <strong>MoSPI Statistical Citation:</strong> {activeQuiz.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Cadres & Divisions */}
      <section id="divisions" className="py-20 border-t border-slate-200 dark:border-glass-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-warning-amber font-semibold text-xs uppercase tracking-widest">
              Institutional Framework
            </span>
            <h2 className="font-headline text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-2">
              National Statistical Cadres &amp; Divisions
            </h2>
            <p className="text-slate-600 dark:text-on-surface-variant text-sm sm:text-base mt-2">
              Customized competency frameworks mapped across Indian Statistical Service (ISS) and Subordinate Statistical Service (SSS) functional divisions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOSPI_DIVISIONS.map((div) => (
              <div
                key={div.name}
                className="p-5 rounded-2xl glass-card hover:border-ai-cyan/40 transition-all flex items-start gap-4 shadow-sm"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${div.color} text-white font-bold text-xs flex items-center justify-center shadow-md shrink-0`}>
                  {div.avatar}
                </div>
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded glass-card text-on-surface-variant font-semibold">
                    {div.badge}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">{div.name}</h4>
                  <p className="text-xs text-slate-600 dark:text-on-surface-variant mt-1">{div.domain}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stitch Modern Footer */}
      <footer className="border-t border-slate-200 dark:border-glass-border pt-16 pb-8 bg-slate-100/80 dark:bg-surface-obsidian text-slate-900 dark:text-on-surface">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-600 dark:text-ai-cyan" />
              <span className="font-headline font-bold text-lg text-slate-900 dark:text-ai-cyan">Saksham AI</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-on-surface-variant leading-relaxed">
              National Skill Intelligence &amp; Adaptive Learning Platform for India's Official Statistical System.
            </p>
            <div className="flex gap-2 mt-2">
              <span className="glass-card px-2 py-1 rounded text-[10px] text-blue-600 dark:text-ai-cyan border-blue-500/20 dark:border-ai-cyan/20">AES-256</span>
              <span className="glass-card px-2 py-1 rounded text-[10px] text-emerald-600 dark:text-success-emerald border-emerald-500/20 dark:border-success-emerald/20">NIC-Ready</span>
              <span className="glass-card px-2 py-1 rounded text-[10px] text-purple-600 dark:text-ai-purple border-purple-500/20 dark:border-ai-purple/20">RAG AI</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-on-surface mb-2">Fast Portals</h4>
            <button onClick={() => handleLaunchPersona('learner')} className="text-left text-slate-600 dark:text-on-surface-variant hover:text-blue-600 dark:hover:text-ai-cyan transition-colors">
              Learner Portal (SSO Arjun Sharma)
            </button>
            <button onClick={() => handleLaunchPersona('trainer')} className="text-left text-slate-600 dark:text-on-surface-variant hover:text-blue-600 dark:hover:text-ai-cyan transition-colors">
              Trainer Studio (Dr. Radhika Sen)
            </button>
            <button onClick={() => handleLaunchPersona('admin')} className="text-left text-slate-600 dark:text-on-surface-variant hover:text-blue-600 dark:hover:text-ai-cyan transition-colors">
              Director General Intel (Dr. Rajesh Verma)
            </button>
          </div>
          <div className="flex flex-col gap-2 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-on-surface mb-2">Ecosystem</h4>
            <span className="text-slate-600 dark:text-on-surface-variant">iGOT Karmayogi API Sync</span>
            <span className="text-slate-600 dark:text-on-surface-variant">NSSTA Training Calendar</span>
            <span className="text-slate-600 dark:text-on-surface-variant">MoSPI Competency Framework</span>
          </div>
          <div className="flex flex-col gap-2 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-on-surface mb-2">Institutional Authority</h4>
            <p className="text-slate-900 dark:text-on-surface font-semibold">Ministry of Statistics &amp; Programme Implementation</p>
            <p className="text-slate-600 dark:text-on-surface-variant">Government of India</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Khurshid Lal Bhawan, Janpath, New Delhi - 110001</p>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-glass-border text-center text-xs text-slate-500 dark:text-on-surface-variant max-w-7xl mx-auto px-6">
          © 2026 SAKSHAM AI. Ministry of Statistics and Programme Implementation (MoSPI). Government of India.
        </div>
      </footer>
    </div>
  );
}
