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
  Lock,
  RefreshCw,
  Cpu,
  FileText,
  Activity,
  Check,
  Building2,
  Database,
  Search,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/common/ThemeToggle';

// Demo personas for 1-click launch from landing page
const DEMO_PERSONAS = [
  {
    role: 'learner',
    title: 'Senior Statistical Officer',
    name: 'Arjun Sharma',
    cadre: 'ISS / National Accounts Division (NAD)',
    desc: 'Access personal competency radar, personalized iGOT pathways, and AI adaptive quizzes.',
    badge: 'Learner Portal',
    badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    avatarBg: 'bg-blue-600 text-white',
    initials: 'AS'
  },
  {
    role: 'trainer',
    title: 'Senior Faculty & Trainer',
    name: 'Dr. Radhika Sen',
    cadre: 'National Statistical Systems Training Academy (NSSTA)',
    desc: 'Generate RAG-based diagnostic MCQs from training manuals and assess cohort progress.',
    badge: 'Trainer Studio',
    badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    avatarBg: 'bg-purple-600 text-white',
    initials: 'RS'
  },
  {
    role: 'admin',
    title: 'Director General (DG)',
    name: 'Dr. Rajesh Verma',
    cadre: 'Ministry of Statistics & Programme Implementation (MoSPI)',
    desc: 'Inspect organizational skill heatmaps, departmental readiness, and iGOT synchronization.',
    badge: 'Directorate Intel',
    badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    avatarBg: 'bg-amber-600 text-white',
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
    color: 'text-blue-500',
    tag: 'Profile Engine'
  },
  {
    step: '02',
    title: 'AI Skill-Gap Analysis',
    subtitle: 'Competency Delta Detection',
    description: 'Computes multi-dimensional gaps against official MoSPI competency frameworks, highlighting critical deficits with confidence-weighted readiness scores.',
    icon: TrendingUp,
    color: 'text-indigo-500',
    tag: 'Intelligence Layer'
  },
  {
    step: '03',
    title: 'Personalized Pathways',
    subtitle: 'iGOT + NSSTA Synergies',
    description: 'Recommends tailored learning journeys by harmonizing online iGOT Karmayogi e-learning modules with specialized NSSTA-TPAC in-person workshops.',
    icon: BookOpen,
    color: 'text-cyan-500',
    tag: 'Recommendation Engine'
  },
  {
    step: '04',
    title: 'Adaptive Learning',
    subtitle: 'Contextual Study & Drills',
    description: 'Learners engage with curated course modules, interactive statistical case studies, and official guidelines at their own self-paced cadence.',
    icon: GraduationCap,
    color: 'text-emerald-500',
    tag: 'Learning Delivery'
  },
  {
    step: '05',
    title: 'RAG AI Assessment',
    subtitle: 'Automated MCQ Generation',
    description: 'Generates rigorous, domain-grounded diagnostic MCQs directly from uploaded survey manuals, SNA reports, or topic prompts with full explanatory feedback.',
    icon: Bot,
    color: 'text-purple-500',
    tag: 'RAG & LLM Engine'
  },
  {
    step: '06',
    title: 'Closed-Loop Calibration',
    subtitle: 'Continuous Skill Growth',
    description: 'Assessment performance feeds back into the competency profile, recalibrating skill scores and adapting subsequent learning paths automatically.',
    icon: RefreshCw,
    color: 'text-amber-500',
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
  { name: 'National Accounts Division (NAD)', domain: 'GDP, GVA Compilation & Sectoral Accounts (SNA 2008)', badge: 'Macro Statistics', avatar: 'NAD', color: 'from-blue-600 to-cyan-600' },
  { name: 'Field Operations Division (FOD / NSSO)', domain: 'Large-scale Household Surveys & CAPI Digital Collection', badge: 'Survey Operations', avatar: 'FOD', color: 'from-purple-600 to-pink-600' },
  { name: 'Survey Design & Research Division (SDRD)', domain: 'Multi-Stage Stratified Sampling & Multiplier Frameworks', badge: 'Methodology', avatar: 'SDRD', color: 'from-indigo-600 to-blue-600' },
  { name: 'Price Statistics Division (PSD)', domain: 'Consumer Price Index (CPI) & Inflation Indicators', badge: 'Price Indices', avatar: 'PSD', color: 'from-emerald-600 to-teal-600' },
  { name: 'Data Informatics & Innovation Division (DIID)', domain: 'Microdata Dissemination, Data Governance & Cloud ETL', badge: 'Informatics & AI', avatar: 'DIID', color: 'from-amber-600 to-orange-600' },
  { name: 'National Statistical Systems Training Academy', domain: 'Cadre Capacity Building, Residential & Virtual Training', badge: 'NSSTA Academy', avatar: 'NSSTA', color: 'from-rose-600 to-red-600' }
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500 selection:text-white transition-colors duration-200">
      {/* Top Govt Bar */}
      <div className="bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800/80 text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center text-slate-600 dark:text-slate-400 transition-colors duration-200">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            Government of India
          </span>
          <span className="hidden md:inline text-slate-300 dark:text-slate-600">|</span>
          <span className="hidden md:inline text-slate-700 dark:text-slate-300">Ministry of Statistics & Programme Implementation (MoSPI)</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50 px-2 py-0.5 rounded font-medium">
            National Skill Intelligence Platform
          </span>
          <span className="hidden sm:inline text-slate-600 dark:text-slate-400 font-medium">Official Statistics Capacity Building</span>
        </div>
      </div>

      {/* Sticky Main Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-slate-900/85 border-b border-slate-200 dark:border-slate-800 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-slate-100 dark:to-blue-200">
                  SAKSHAM AI
                </span>
                <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/30 uppercase tracking-wider">
                  Active
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 tracking-wider uppercase font-semibold">
                Official Statistics Skill Intelligence
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700 dark:text-slate-300">
            <a href="#overview" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Overview</a>
            <a href="#closed-loop" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Closed-Loop AI</a>
            <a href="#competency-demo" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Skill Radar</a>
            <a href="#quiz-simulator" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">AI Quiz Studio</a>
            <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pillars</a>
            <a href="#architecture" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Architecture</a>
            <a href="#divisions" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cadres & Divisions</a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <ThemeToggle size="sm" />

            {user ? (
              <button
                onClick={() => navigate(user.role?.includes('admin') ? '/admin/dashboard' : '/dashboard')}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-md shadow-blue-600/30 transition-all hover:shadow-blue-600/50"
              >
                <span>Dashboard ({user.name?.split(' ')[0]})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white px-3.5 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </Link>
                <button
                  onClick={() => handleLaunchPersona('learner')}
                  disabled={isLaunchingDemo}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                  <span>Launch Live Demo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle size="sm" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3">
            <a
              href="#overview"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white py-1.5 text-sm"
            >
              Overview
            </a>
            <a
              href="#closed-loop"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white py-1.5 text-sm"
            >
              Closed-Loop AI
            </a>
            <a
              href="#competency-demo"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white py-1.5 text-sm"
            >
              Skill Radar Preview
            </a>
            <a
              href="#quiz-simulator"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white py-1.5 text-sm"
            >
              AI Quiz Studio
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white py-1.5 text-sm"
            >
              Architecture & Features
            </a>
            <a
              href="#divisions"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white py-1.5 text-sm"
            >
              MoSPI Cadres & Divisions
            </a>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <Link
                to="/login"
                className="w-full text-center py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg"
              >
                Sign In
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLaunchPersona('learner');
                }}
                className="w-full py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg"
              >
                Launch Learner Demo
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="overview" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/10 dark:bg-blue-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Pill Badges */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 mb-6 shadow-inner">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="font-semibold text-blue-600 dark:text-blue-300">MoSPI Official Statistics Intelligence</span>
              <span className="text-slate-400 dark:text-slate-500">•</span>
              <span className="text-slate-600 dark:text-slate-300">Adaptive Learning &amp; Competency Framework</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-slate-900 dark:text-white">
              AI-Powered Skill Intelligence for India’s{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-300">
                Official Statistical System
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
              A closed-loop learning intelligence ecosystem that identifies role-specific competency gaps, curates personalized training across <strong className="text-slate-900 dark:text-white">iGOT Karmayogi</strong> &amp; <strong className="text-slate-900 dark:text-white">NSSTA-TPAC</strong>, and generates RAG-grounded AI assessments from official survey manuals.
            </p>

            {/* Hero CTAs */}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => handleLaunchPersona('learner')}
                disabled={isLaunchingDemo}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>Explore Learner Experience</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleLaunchPersona('admin')}
                disabled={isLaunchingDemo}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-700/90 text-slate-800 dark:text-slate-200 font-semibold text-sm border border-slate-200 dark:border-slate-700 shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all"
              >
                <Building2 className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>Workforce Intelligence (DG MoSPI)</span>
              </button>

              <a
                href="#closed-loop"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium text-sm transition-colors"
              >
                <span>How Closed-Loop AI Works</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Quick Demo Personas Bar */}
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800/80">
              <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mb-4">
                Instant 1-Click Role Exploration (No Credentials Required)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                {DEMO_PERSONAS.map((persona) => (
                  <div
                    key={persona.role}
                    onClick={() => handleLaunchPersona(persona.role)}
                    className="group p-4 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/90 hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-900/90 transition-all cursor-pointer shadow-sm hover:shadow-lg hover:shadow-blue-600/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${persona.badgeColor}`}>
                        {persona.badge}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    <div className="flex items-center gap-3 my-2">
                      <div className={`w-8 h-8 rounded-full ${persona.avatarBg} font-bold text-xs flex items-center justify-center`}>
                        {persona.initials}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                          {persona.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{persona.title}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">
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
      <section className="bg-white dark:bg-slate-950/90 border-y border-slate-200 dark:border-slate-800 py-8 relative transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800/80">
            <div className="pt-4 md:pt-0">
              <div className="text-2xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">10,000+</div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Statistical Officers Capacity</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-2xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">50+</div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">MoSPI Competency Frameworks</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-2xl sm:text-4xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">120+</div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">iGOT &amp; NSSTA Mapped Modules</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-2xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">100%</div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">RAG-Grounded AI Assessments</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Statement & Saksham Solution */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs uppercase tracking-widest">
              Problem &amp; Value Proposition
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-2">
              Transforming Fragmented Training into an Adaptive Intelligence Ecosystem
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3">
              Aligning the official statistical workforce with the evolving demands of National Accounts (SNA 2008), survey multipliers, digital CAPI collection, and data governance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Conventional Challenge */}
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-950/60 border border-red-200 dark:border-red-900/30 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-2xl"></div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40 text-xs font-semibold mb-4">
                Conventional Approach / Limitations
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                Challenges in Current Official Statistical Training
              </h3>
              <ul className="space-y-3.5 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold mt-0.5">✕</span>
                  <span><strong>Dispersed Learning Resources:</strong> Officials struggle to locate role-relevant training amid thousands of generic civil service courses.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold mt-0.5">✕</span>
                  <span><strong>No Dynamic Competency Baselines:</strong> Cadre managers lack real-time visibility into actual technical and statistical proficiency shortfalls.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold mt-0.5">✕</span>
                  <span><strong>One-Time Course Completion:</strong> Traditional LMS platforms track certificate downloads without validating applied mastery.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold mt-0.5">✕</span>
                  <span><strong>Manual Assessment Bottlenecks:</strong> Faculty at NSSTA spend weeks drafting and validating statistical MCQs and case studies manually.</span>
                </li>
              </ul>
            </div>

            {/* The Saksham Breakthrough */}
            <div className="p-8 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-blue-950/40 dark:to-slate-950/70 border border-blue-200 dark:border-blue-600/40 relative overflow-hidden shadow-xl shadow-blue-900/10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50 text-xs font-semibold mb-4">
                Saksham AI Breakthrough
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                The AI-Powered Closed-Loop Learning Solution
              </h3>
              <ul className="space-y-3.5 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span><strong>Role-Aware Competency Graph:</strong> Dynamically maps JSO, SSO, and Director responsibilities against MoSPI statistical standards.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span><strong>Unified iGOT + NSSTA Pathway:</strong> Blends digital asynchronous courses with physical residential academy workshops seamlessly.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span><strong>RAG-Grounded AI Assessment:</strong> Ingests MoSPI survey manuals &amp; guidelines to generate difficulty-calibrated diagnostic MCQs in seconds.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span><strong>Closed-Loop Recalibration:</strong> Assessment scores automatically update skill gap indexes, driving continuous career upskilling.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Closed-Loop Learning Journey */}
      <section id="closed-loop" className="py-20 bg-white dark:bg-slate-950 relative border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 text-xs font-semibold mb-3">
              Continuous Competency Engine
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              The 6-Stage Closed-Loop AI Learning Cycle
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
              Click on any stage below to explore how Saksham AI drives continuous capacity building.
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
                  className={`p-4 rounded-xl text-left border transition-all relative overflow-hidden ${
                    isCurrent
                      ? 'bg-blue-50/70 dark:bg-slate-900 border-blue-500 shadow-md'
                      : 'bg-white dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-mono font-bold ${isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
                      {stg.step}
                    </span>
                    <IconComp className={`w-4 h-4 ${isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{stg.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{stg.subtitle}</p>
                  {isCurrent && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Stage Deep-Dive Card */}
          <div className="bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50 text-xs font-mono font-bold">
                    STAGE {CLOSED_LOOP_STAGES[activeStage].step} OF 06
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {CLOSED_LOOP_STAGES[activeStage].tag}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {CLOSED_LOOP_STAGES[activeStage].title}: {CLOSED_LOOP_STAGES[activeStage].subtitle}
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                  {CLOSED_LOOP_STAGES[activeStage].description}
                </p>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => handleLaunchPersona('learner')}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-md transition-all"
                  >
                    <span>Test This in Live Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setActiveStage((prev) => (prev + 1) % CLOSED_LOOP_STAGES.length)}
                    className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 px-4 py-2.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <span>Next Stage: {CLOSED_LOOP_STAGES[(activeStage + 1) % CLOSED_LOOP_STAGES.length].title}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Simulation Visualizer Box */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-300 shadow-inner">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[11px]">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Engine Process Simulator
                  </span>
                  <span>AI Engine v2.4</span>
                </div>
                <div className="mt-4 space-y-2.5">
                  <div className="text-blue-600 dark:text-blue-400 font-semibold">▶ Executing: {CLOSED_LOOP_STAGES[activeStage].title}...</div>
                  {activeStage === 0 && (
                    <>
                      <div className="text-slate-600 dark:text-slate-400">✓ Ingesting Cadre Profile: Arjun Sharma (SSO - NAD)</div>
                      <div className="text-slate-600 dark:text-slate-400">✓ Benchmarking against MoSPI Competency Matrix 2026</div>
                      <div className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Baseline Profile Established (7 Core Competencies)</div>
                    </>
                  )}
                  {activeStage === 1 && (
                    <>
                      <div className="text-slate-600 dark:text-slate-400">✓ Computing Target vs Observed Proficiency Deltas</div>
                      <div className="text-amber-600 dark:text-amber-400">⚠ Deficit Flagged: SNA 2008 GVA Balancing (Gap: -1.3)</div>
                      <div className="text-amber-600 dark:text-amber-400">⚠ Deficit Flagged: Microdata Analytics (Gap: -1.7)</div>
                      <div className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Overall Role Readiness Computed: 74.9%</div>
                    </>
                  )}
                  {activeStage === 2 && (
                    <>
                      <div className="text-slate-600 dark:text-slate-400">✓ Querying iGOT Karmayogi Course API Index...</div>
                      <div className="text-slate-600 dark:text-slate-400">✓ Querying NSSTA-TPAC Residential Workshop Schedules...</div>
                      <div className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Synthesized 3-Stage Personalized Career Pathway</div>
                    </>
                  )}
                  {activeStage === 3 && (
                    <>
                      <div className="text-slate-600 dark:text-slate-400">✓ Learner Enrolled: SNA 2008 Gross Value Added</div>
                      <div className="text-slate-600 dark:text-slate-400">✓ Micro-learning modules &amp; statistical reference manuals loaded</div>
                      <div className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Progress Tracking: 25% Completed</div>
                    </>
                  )}
                  {activeStage === 4 && (
                    <>
                      <div className="text-slate-600 dark:text-slate-400">✓ Ingesting MoSPI Survey Guidelines (PDF/Text)</div>
                      <div className="text-slate-600 dark:text-slate-400">✓ RAG Semantic Chunking &amp; Similarity Retrieval</div>
                      <div className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Generated 3 Diagnostic Questions with Explanations</div>
                    </>
                  )}
                  {activeStage === 5 && (
                    <>
                      <div className="text-slate-600 dark:text-slate-400">✓ Learner Score: 100% on Multi-Stage Sampling Quiz</div>
                      <div className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Competency Level Upgraded: 2.20 ➔ 2.55 (+0.35)</div>
                      <div className="text-blue-600 dark:text-blue-400">✓ Closed-Loop Complete: Updated Recommendations Ready</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Competency Radar & Role Explorer */}
      <section id="competency-demo" className="py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs uppercase tracking-widest">
              Live Competency Explorer
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-2">
              Official Statistics Role-Specific Competency Profiler
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
              Select an official role below to see how Saksham AI benchmarks current proficiency against mandated MoSPI standards.
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {ROLE_PROFILES.map((rp, idx) => (
              <button
                key={rp.id}
                onClick={() => setSelectedRoleIndex(idx)}
                className={`px-5 py-3 rounded-xl text-sm font-semibold border transition-all ${
                  selectedRoleIndex === idx
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-white dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {rp.roleName}
              </button>
            ))}
          </div>

          {/* Role Breakdown Dashboard Card */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
              <div>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-mono font-semibold uppercase">{activeRole.department}</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{activeRole.roleName}</h3>
              </div>
              <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="text-right">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Cadre Readiness</div>
                  <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{activeRole.readiness}</div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </div>

            {/* Competency Gap Bars */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-5">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Target vs Observed Competency Scores (Scale: 1.0 - 5.0)
                </h4>
                {activeRole.topSkills.map((sk) => {
                  const currentPct = (sk.current / 5.0) * 100;
                  const requiredPct = (sk.required / 5.0) * 100;
                  const hasGap = parseFloat(sk.gap) < 0;
                  return (
                    <div key={sk.name} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{sk.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500 dark:text-slate-400">Current: <strong className="text-slate-900 dark:text-white">{sk.current.toFixed(1)}</strong> / {sk.required.toFixed(1)}</span>
                          <span className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                            hasGap ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60' : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'
                          }`}>
                            Gap: {sk.gap}
                          </span>
                        </div>
                      </div>
                      {/* Bar Visualizer */}
                      <div className="w-full h-3 bg-slate-100 dark:bg-slate-900 rounded-full relative overflow-hidden">
                        {/* Target Marker */}
                        <div
                          className="absolute top-0 bottom-0 w-1 bg-slate-400 dark:bg-slate-500 z-10"
                          style={{ left: `${requiredPct}%` }}
                          title={`Required Benchmark: ${sk.required}`}
                        />
                        {/* Current Value Fill */}
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

              {/* Recommended Action & Mapped Courses */}
              <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-900/80 p-6 rounded-xl border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-4">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Recommended Remediation</span>
                  </div>
                  <div className="space-y-3">
                    {activeRole.recommendedCourses.map((c, i) => (
                      <div key={i} className="p-3 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 font-semibold">
                          {c.source}
                        </span>
                        <h5 className="text-xs font-semibold text-slate-900 dark:text-slate-100 mt-1.5">{c.title}</h5>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleLaunchPersona('learner')}
                  className="mt-6 w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Launch Full Interactive Radar in Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive AI Assessment Generator Simulator */}
      <section id="quiz-simulator" className="py-20 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-purple-600 dark:text-purple-400 font-semibold text-xs uppercase tracking-widest">
              RAG-Grounded AI Assessment Studio
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-2">
              Instant Quiz &amp; MCQ Generation Simulator
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
              Try the AI MCQ generator powered by FastAPI &amp; RAG. Select an official statistical topic and test your knowledge.
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
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/30'
                      : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {q.topic}
                </button>
              );
            })}
          </div>

          {/* Interactive MCQ Simulator Box */}
          <div className="max-w-3xl mx-auto bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-mono font-semibold text-purple-700 dark:text-purple-300">
                  AI Generated • {activeQuiz.difficulty}
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent">
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
                  let optStyle = 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-300';

                  if (showExplanation) {
                    if (isCorrect) {
                      optStyle = 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-200';
                    } else if (isChosen && !isCorrect) {
                      optStyle = 'bg-red-50 dark:bg-red-950/80 border-red-500 text-red-900 dark:text-red-200';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuizSelect(idx)}
                      className={`w-full text-left p-4 rounded-xl border transition-all text-xs sm:text-sm font-medium flex items-start gap-3 ${optStyle}`}
                    >
                      <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Instant AI Explanation Box */}
              {showExplanation && (
                <div className="mt-6 p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-bold mb-2">
                    {quizAnswer === activeQuiz.correct ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Correct Answer!
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Activity className="w-4 h-4" /> Insight &amp; Rationale
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong>MoSPI Methodological Rationale:</strong> {activeQuiz.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars & Features Matrix */}
      <section id="features" className="py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs uppercase tracking-widest">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-2">
              Built for Government-Scale Statistical Intelligence
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
              End-to-end architecture engineered for security, high-concurrency, offline resilience, and seamless national portal integration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                Official Statistics Taxonomy
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Pre-loaded with 50+ domain competencies across National Accounts, Price Indices, NSS Surveys, CAPI collection, and Data Governance.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-600/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                iGOT &amp; NSSTA Synchronization
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Bi-directional API sync connectors harmonizing live iGOT Karmayogi digital catalogues with NSSTA residential training calendars.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-purple-500/40 transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-600/10 border border-purple-200 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                RAG Document Ingestion &amp; Quiz Engine
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Upload survey manuals (PDF/PPTX/Text) to generate grounded assessment quizzes with automatic grading and MoSPI citation tags.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-600/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                Workforce Intelligence Heatmap
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Macro dashboards for Director Generals and Cadre Controlling Authorities to visualize departmental skill health and readiness.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-600/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                NIC Cloud &amp; Government Security
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                AES-256 field-level encryption, role-based access control (RBAC), immutable audit logging, and strict data privacy compliance.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-600/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                Hybrid Zero-Downtime Engine
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Seamless hybrid storage architecture with automatic fallback to high-speed in-memory store if remote databases are offline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Architecture & Stack Showcase */}
      <section id="architecture" className="py-20 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold text-xs uppercase tracking-widest">
              Full Stack System Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-2">
              Robust, Scalable Microservice Architecture
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
              Decoupled Python AI Intelligence Engine + Node.js API Gateway + Vite React Web UI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Layer 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                  01
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Presentation Layer</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span>React 18 SPA with Vite Bundler</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span>Tailwind CSS Custom Government Design System</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span>Recharts Competency Radar &amp; Heatmaps</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span>Light / Dark Theme Support System</span>
                </li>
              </ul>
            </div>

            {/* Layer 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                  02
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">API Gateway &amp; RBAC</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  <span>Node.js / Express.js REST Gateway</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  <span>JWT Authentication &amp; 3-Tier RBAC</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  <span>iGOT Karmayogi &amp; NSSTA Live Sync Engine</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  <span>AES-256 Encryption &amp; Audit Logging</span>
                </li>
              </ul>
            </div>

            {/* Layer 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs">
                  03
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">AI &amp; RAG Intelligence</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  <span>FastAPI Asynchronous Engine (Port 8000)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  <span>RAG Question Generator (PDF/PPTX parsing)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  <span>Vector Embeddings &amp; Skill Delta Calculator</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  <span>Predictive Workforce Analytics &amp; Swagger Docs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* MoSPI Statistical Cadres & Divisions */}
      <section id="divisions" className="py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-amber-600 dark:text-amber-400 font-semibold text-xs uppercase tracking-widest">
              Institutional Framework
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-2">
              National Statistical Cadres &amp; Divisions
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
              Customized competency frameworks mapped across Indian Statistical Service (ISS) and Subordinate Statistical Service (SSS) functional divisions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOSPI_DIVISIONS.map((div) => (
              <div
                key={div.name}
                className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-start gap-4 shadow-sm"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${div.color} text-white font-bold text-xs flex items-center justify-center shadow-md shrink-0`}>
                  {div.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-semibold">
                      {div.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">{div.name}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{div.domain}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 border-t border-slate-200 dark:border-slate-800 relative overflow-hidden text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold">
            Ready to Experience the Future of Official Statistics Upskilling?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-200 max-w-2xl mx-auto">
            Experience role-based skill intelligence, RAG assessment generation, and personalized learning pathways right now.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => handleLaunchPersona('learner')}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>Launch Learner Portal (Arjun Sharma)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleLaunchPersona('admin')}
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm rounded-xl border border-slate-700 transition-all flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Launch Admin Dashboard (DG MoSPI)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 py-12 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-200 dark:border-slate-800/80">
            {/* Col 1: Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                  S
                </div>
                <span className="font-bold text-sm text-slate-900 dark:text-white tracking-tight">SAKSHAM AI</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                National Skill Intelligence &amp; Adaptive Learning Platform for India's Official Statistical System.
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                Ministry of Statistics &amp; Programme Implementation (MoSPI)
              </p>
            </div>

            {/* Col 2: Fast Portals */}
            <div>
              <h4 className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider mb-3">Portals &amp; Personas</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => handleLaunchPersona('learner')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Learner Portal (SSO Arjun Sharma)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLaunchPersona('trainer')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Trainer &amp; Faculty Studio (Dr. Radhika Sen)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLaunchPersona('admin')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Director General Intel (Dr. Rajesh Verma)
                  </button>
                </li>
                <li>
                  <Link to="/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Sign In with MoSPI SSO
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Integrations */}
            <div>
              <h4 className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider mb-3">Ecosystem Integrations</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span>iGOT Karmayogi API Gateway</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  <span>NSSTA-TPAC Training Database</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>MoSPI Cadre Management Framework</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <a href="http://127.0.0.1:8000/docs" target="_blank" rel="noreferrer" className="hover:text-emerald-600 dark:hover:text-emerald-300 flex items-center gap-1">
                    <span>FastAPI AI Swagger Docs</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Ministry Info */}
            <div>
              <h4 className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider mb-3">Institutional Authority</h4>
              <p className="text-xs text-slate-800 dark:text-slate-300 font-semibold">Ministry of Statistics &amp; Programme Implementation</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Government of India</p>
              <p className="text-[11px] text-slate-500 mt-2">
                Khurshid Lal Bhawan, Janpath, New Delhi - 110001
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
            <p>© 2026 SAKSHAM AI. Skill Intelligence &amp; Adaptive Learning Platform for India's Official Statistical System.</p>
            <div className="flex items-center gap-4">
              <span>NIC Cloud Ready</span>
              <span>•</span>
              <span>AES-256 Encrypted</span>
              <span>•</span>
              <span>Govt Data Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
