'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  BarChart3, 
  BookOpen, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  TrendingUp, 
  Users, 
  FileCheck, 
  Building2, 
  Terminal,
  Clock,
  Compass
} from 'lucide-react';

export default function LandingPage() {
  const { demoLogin } = useAuth();

  return (
    <div className="relative overflow-hidden">
      {/* Glow background effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-glow-hero pointer-events-none" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 left-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/80 border border-blue-600/40 text-blue-300 text-xs font-semibold shadow-glow-blue animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Smart India Hackathon SIH26101 • Smart Education Category</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
            Skill Intelligence & Learning for India&apos;s{' '}
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-amber-400 bg-clip-text text-transparent">
              Official Statistical System
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            A closed-loop AI ecosystem connecting <span className="text-white font-semibold">Competency Gap Identification</span>, <span className="text-amber-400 font-semibold">iGOT Karmayogi</span> & <span className="text-blue-400 font-semibold">NSSTA-TPAC</span> personalized pathways, and <span className="text-white font-semibold">RAG-driven Assessment Generation</span> from official statistical manuals.
          </p>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              onClick={() => demoLogin('learner')}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold text-sm shadow-glow-blue flex items-center gap-2 transition-all hover:scale-105"
            >
              Enter Learner Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/trainer"
              onClick={() => demoLogin('trainer')}
              className="px-8 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-400 border border-amber-500/40 font-semibold text-sm shadow-md flex items-center gap-2 transition-all hover:scale-105"
            >
              <Cpu className="w-4 h-4" />
              Trainer AI Assessment Studio
            </Link>

            <Link
              href="/admin/workforce-analytics"
              onClick={() => demoLogin('admin')}
              className="px-8 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center gap-2 transition-all hover:scale-105"
            >
              <Layers className="w-4 h-4 text-purple-400" />
              MoSPI Leadership Analytics
            </Link>
          </div>

          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-12">
            <div className="glass-panel p-4 rounded-2xl text-center border-slate-800">
              <p className="text-2xl sm:text-3xl font-extrabold text-white">1,013+</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Officers Profiled (ISS/SSS)</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center border-slate-800">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">7 Domains</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Official Stat Competencies</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center border-slate-800">
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-400">100% RAG</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Grounded MCQ Generation</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center border-slate-800">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">iGOT + NSSTA</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Unified Sync Architecture</p>
            </div>
          </div>

        </div>
      </section>

      {/* The 4-Stage Closed-Loop Learning Cycle */}
      <section className="py-16 bg-slate-950/60 border-y border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Novelty & Technical Uniqueness
            </h2>
            <p className="text-3xl font-bold text-white mt-2">
              The Closed-Loop AI Competency Engine
            </p>
            <p className="text-slate-400 text-sm mt-3">
              Unlike generic learning management portals, Saksham AI forms an intelligent closed-feedback loop tailored to India&apos;s Official Statistical System.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="glass-panel glass-panel-hover p-6 rounded-2xl relative border-blue-900/40 group">
              <div className="w-12 h-12 rounded-xl bg-blue-950 border border-blue-600/40 text-blue-400 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
                01
              </div>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                Assess & Diagnose
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Maps official&apos;s designation (SSO, JSO, Director), division (NAD, SDRD, FOD), and experience against the Official Statistics Competency Framework.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-850 flex items-center gap-2 text-xs text-blue-400 font-medium">
                <BarChart3 className="w-4 h-4" />
                Radar Gap Quantification
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-panel glass-panel-hover p-6 rounded-2xl relative border-amber-900/40 group">
              <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-600/40 text-amber-400 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
                02
              </div>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                Personalized Pathway
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Recommends an ordered sequence of iGOT Karmayogi digital modules and NSSTA Greater Noida on-campus residential workshops.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-850 flex items-center gap-2 text-xs text-amber-400 font-medium">
                <Compass className="w-4 h-4" />
                Dynamic Roadmap Synthesizer
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass-panel glass-panel-hover p-6 rounded-2xl relative border-purple-900/40 group">
              <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-600/40 text-purple-400 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
                03
              </div>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                AI Assessment Generation
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Trainers upload PDF/PPT survey manuals (NSS, SNA 2008). LangChain RAG pipeline parses, indexes, and synthesizes technical MCQs with full rationales.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-850 flex items-center gap-2 text-xs text-purple-400 font-medium">
                <FileCheck className="w-4 h-4" />
                Difficulty & Citation Tagged
              </div>
            </div>

            {/* Step 4 */}
            <div className="glass-panel glass-panel-hover p-6 rounded-2xl relative border-emerald-900/40 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-600/40 text-emerald-400 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
                04
              </div>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                Recalibrate & Adapt
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Quiz scores automatically upgrade the officer&apos;s competency levels, recompute the gap index, and feed macro predictive analytics for MoSPI planning.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-850 flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <TrendingUp className="w-4 h-4" />
                Continuous Growth Loop
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Role-Based Portals Showcase */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Multi-Tenant Enterprise Architecture
          </h2>
          <p className="text-3xl font-bold text-white mt-2">
            Tailored Experiences for Every MoSPI Stakeholder
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Learner */}
          <div className="glass-panel p-8 rounded-3xl border-slate-800 flex flex-col justify-between hover:border-blue-500/40 transition-all">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-950 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <BarChart3 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  Cadre Officers & Staff
                </span>
                <h3 className="text-2xl font-bold text-white mt-3">Learner Platform</h3>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>Interactive Competency Radar vs Role Benchmark</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>Step-by-step iGOT & NSSTA learning pathway</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>Interactive timed Quiz Arena with instant feedback</span>
                </li>
              </ul>
            </div>
            <div className="pt-8">
              <Link
                href="/dashboard"
                onClick={() => demoLogin('learner')}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                Launch Learner View (Arjun Sharma)
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Trainer */}
          <div className="glass-panel p-8 rounded-3xl border-amber-900/30 flex flex-col justify-between hover:border-amber-500/40 transition-all">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Cpu className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  NSSTA Faculty & SMEs
                </span>
                <h3 className="text-2xl font-bold text-white mt-3">Trainer & Admin Studio</h3>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Drag-and-drop PDF/PPTX ingestion & vector chunking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>AI MCQ Studio: Edit options, difficulty & rationales</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>1-Click publishing to active learner assessment bank</span>
                </li>
              </ul>
            </div>
            <div className="pt-8">
              <Link
                href="/trainer"
                onClick={() => demoLogin('trainer')}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                Launch Trainer Studio (Dr. Radhika Sen)
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Admin & Leadership */}
          <div className="glass-panel p-8 rounded-3xl border-purple-900/30 flex flex-col justify-between hover:border-purple-500/40 transition-all">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <Layers className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  MoSPI Leadership & DDGs
                </span>
                <h3 className="text-2xl font-bold text-white mt-3">Workforce Analytics Hub</h3>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>Departmental readiness heatmaps (NAD, SDRD, FOD, CSO)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>12-Month predictive emerging skill deficit projections</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>iGOT & NSSTA sync health and cache latency monitoring</span>
                </li>
              </ul>
            </div>
            <div className="pt-8">
              <Link
                href="/admin/workforce-analytics"
                onClick={() => demoLogin('admin')}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                Launch Leadership Hub (Rajesh Verma, DDG)
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
