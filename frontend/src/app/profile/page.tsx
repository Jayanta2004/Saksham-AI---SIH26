'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  User, 
  ShieldCheck, 
  Lock, 
  Award, 
  BookOpen, 
  GraduationCap, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  KeyRound,
  FileCheck
} from 'lucide-react';

export default function OfficerProfile() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Profile Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 shadow-glass flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-700 to-amber-500 p-0.5 shadow-glow-blue flex-shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl font-bold text-amber-400">
              {user?.full_name?.charAt(0) || 'O'}
            </div>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {user?.full_name || 'Arjun Sharma, ISS'}
              </h1>
              <span className="text-xs font-semibold px-3 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                Verified Statistical Officer
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {user?.designation || 'Senior Statistical Officer'} • {user?.department || 'National Accounts Division (NAD)'}
            </p>
            <p className="text-xs text-amber-400 font-medium mt-0.5">
              Cadre: {user?.cadre || 'Indian Statistical Service (Grade IV)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="px-4 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>DPDPA 2023 Compliant</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Officer Service & Educational Background (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Service Details */}
          <div className="glass-panel p-6 rounded-3xl border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              Official Cadre & Deployment Records
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Ministry / Department</span>
                <span className="font-semibold text-white mt-1 block">MoSPI, Govt. of India</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Current Division</span>
                <span className="font-semibold text-white mt-1 block">{user?.department || 'National Accounts Division'}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Designation</span>
                <span className="font-semibold text-white mt-1 block">{user?.designation || 'Senior Statistical Officer'}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Total Service Experience</span>
                <span className="font-semibold text-white mt-1 block">5.5 Years in ISS Cadre</span>
              </div>
            </div>
          </div>

          {/* Educational Qualifications */}
          <div className="glass-panel p-6 rounded-3xl border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-400" />
              Educational & Academic Degrees
            </h2>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-950 text-blue-400 flex items-center justify-center font-bold flex-shrink-0">
                  M
                </div>
                <div>
                  <p className="font-bold text-white">Master of Science (M.Sc.) in Statistics</p>
                  <p className="text-slate-400">Indian Statistical Institute (ISI) Kolkata • Class of 2019</p>
                  <p className="text-[11px] text-emerald-400 mt-1">Specialization: Sample Surveys & Linear Models</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-950 text-blue-400 flex items-center justify-center font-bold flex-shrink-0">
                  B
                </div>
                <div>
                  <p className="font-bold text-white">Bachelor of Science (B.Sc. Hons) in Mathematics & Statistics</p>
                  <p className="text-slate-400">Delhi University • Class of 2017</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Col: Encryption & Verified Badges (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Security & Encryption Status */}
          <div className="glass-panel p-6 rounded-3xl border-emerald-900/30 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              Cryptographic Data Protection
            </h2>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">National Officer ID (Aadhaar/PAN)</span>
                  <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-600/40">
                    AES-256 GCM
                  </span>
                </div>
                <p className="font-mono text-sm text-white tracking-widest pt-1">
                  XXXX-XXXX-0192
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Annual Performance Appraisal Log</span>
                  <span className="text-[10px] font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-950 border border-blue-600/40">
                    Encrypted
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 pt-1">
                  Available exclusively to Cadre Controlling Authority (CCA) via RBAC token.
                </p>
              </div>
            </div>
          </div>

          {/* Earned Micro-Credentials */}
          <div className="glass-panel p-6 rounded-3xl border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Verified Competency Certificates
            </h2>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-white">TPAC-GOV-102 Certification</p>
                  <span className="text-[10px] text-emerald-400 font-bold">Score: 92%</span>
                </div>
                <p className="text-slate-400">National Statistical Governance & DPDPA 2023</p>
                <p className="text-[10px] font-mono text-blue-400 pt-1">
                  Verification Code: VER-MOSPI-2026-9921
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-white">iGOT-PY-301 In-Progress</p>
                  <span className="text-[10px] text-amber-400 font-bold">Progress: 65%</span>
                </div>
                <p className="text-slate-400">Statistical Computing with Python</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
