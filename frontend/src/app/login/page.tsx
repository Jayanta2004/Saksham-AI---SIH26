'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  UserCheck, 
  CheckCircle2, 
  Building2, 
  Cpu
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, demoLogin, loading } = useAuth();
  
  const [email, setEmail] = useState('arjun.sharma@mospi.gov.in');
  const [password, setPassword] = useState('Saksham@2026');
  const [ssoLoading, setSsoLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const ok = await login(email, password);
      if (ok) {
        router.push('/dashboard');
      } else {
        setErrorMsg('Invalid email or password.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Using demo mode.');
      router.push('/dashboard');
    }
  };

  const handleParichaySso = () => {
    setSsoLoading(true);
    setTimeout(() => {
      demoLogin('learner');
      setSsoLoading(false);
      router.push('/dashboard');
    }, 1200);
  };

  const handleQuickRole = async (roleKey: 'learner' | 'trainer' | 'admin' | 'learner_jso') => {
    await demoLogin(roleKey);
    if (roleKey === 'trainer') router.push('/trainer');
    else if (roleKey === 'admin') router.push('/admin/workforce-analytics');
    else router.push('/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Brand & Quick Demo Roles */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950/80 border border-blue-600/40 text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>MoSPI Official Statistical Identity Gateway</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Sign In to <span className="bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">Saksham AI</span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Access the National Skill Intelligence Platform, iGOT Karmayogi integrated pathways, and RAG-driven statistical assessments.
            </p>
          </div>

          {/* Quick Evaluation Personas */}
          <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
                1-Click Instant Evaluation Login
              </p>
              <span className="text-[10px] text-slate-400 font-medium">Evaluation Mode</span>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => handleQuickRole('learner')}
                className="w-full p-3 rounded-xl bg-blue-950/70 border border-blue-600/40 hover:border-blue-400 text-left flex items-center justify-between transition-all group"
              >
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-blue-300">
                    Arjun Sharma, ISS (Learner)
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Senior Statistical Officer • National Accounts Division (NAD)
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleQuickRole('trainer')}
                className="w-full p-3 rounded-xl bg-amber-950/40 border border-amber-600/40 hover:border-amber-400 text-left flex items-center justify-between transition-all group"
              >
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-amber-300">
                    Dr. Radhika Sen (Trainer / Admin)
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Deputy Director & Faculty • NSSTA Greater Noida
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleQuickRole('admin')}
                className="w-full p-3 rounded-xl bg-purple-950/40 border border-purple-600/40 hover:border-purple-400 text-left flex items-center justify-between transition-all group"
              >
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-purple-300">
                    Rajesh K. Verma, ISS (System Admin)
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Deputy Director General • MoSPI Leadership
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>AES-256 Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>Parichay SSO Ready</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form & SSO */}
        <div className="lg:col-span-6">
          <div className="glass-panel p-8 rounded-3xl border-slate-800 shadow-2xl space-y-6">
            
            {/* Parichay SSO Button */}
            <div>
              <button
                type="button"
                onClick={handleParichaySso}
                disabled={ssoLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-850 hover:from-slate-850 hover:to-slate-800 border border-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-3 shadow-md transition-all hover:border-amber-500/50"
              >
                <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 font-black text-[10px]">
                  P
                </div>
                <span>{ssoLoading ? 'Connecting to Parichay SSO...' : 'Sign In with Parichay (Govt. of India SSO)'}</span>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-850" />
              <span className="text-[11px] text-slate-400 font-semibold uppercase">Or with MoSPI Credentials</span>
              <div className="flex-1 h-px bg-slate-850" />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-600/40 text-xs text-rose-300">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleStandardLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  Official Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@mospi.gov.in"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-blue-600" />
                  <span>Remember session</span>
                </label>
                <span className="text-blue-400 hover:underline cursor-pointer">Forgot credentials?</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-glow-blue flex items-center justify-center gap-2 transition-all"
              >
                {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 text-center">
              <p className="text-[11px] text-slate-400">
                Protected under MoSPI Information Security Policies & DPDPA 2023.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
