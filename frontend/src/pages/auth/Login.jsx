import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Brain, Sparkles, ArrowRight, ShieldCheck, Lock, Mail } from 'lucide-react';
import ThemeToggle from '../../components/common/ThemeToggle';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemoClick = async (roleName) => {
    setError('');
    setIsSubmitting(true);
    try {
      const authData = await demoLogin(roleName);
      const userRole = (authData?.user?.role || authData?.user?.role_name || roleName).toLowerCase();
      if (userRole.includes('admin') || userRole.includes('trainer')) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Demo sign in failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const authData = await login(email, password);
      const userRole = (authData?.user?.role || authData?.user?.role_name || '').toLowerCase();
      if (userRole.includes('admin') || userRole.includes('trainer')) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err?.response?.data?.error || 'Invalid official credentials. Please verify your email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const demoPersonas = [
    { role: 'learner', name: 'Arjun Sharma', roleLabel: 'Senior Statistical Officer (NAD)', initials: 'AS', color: 'from-blue-600 to-cyan-500' },
    { role: 'trainer', name: 'Dr. Radhika Sen', roleLabel: 'Faculty & Instructor (NSSTA)', initials: 'RS', color: 'from-purple-600 to-indigo-500' },
    { role: 'admin', name: 'Dr. Rajesh Verma', roleLabel: 'Director General (MoSPI)', initials: 'RV', color: 'from-amber-600 to-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-surface-obsidian text-slate-900 dark:text-on-surface flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden transition-colors duration-200">
      
      {/* Ambient Backdrop Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-ai-cyan/10 rounded-full blur-[140px] opacity-40"></div>
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-ai-purple/10 rounded-full blur-[120px] opacity-30"></div>
      </div>

      <div className="w-full max-w-md mb-4 flex justify-between items-center text-xs relative z-10">
        <Link to="/" className="text-blue-600 dark:text-ai-cyan hover:underline flex items-center gap-1 font-medium">
          ← Back to Saksham AI Home
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle size="sm" />
          <span className="text-slate-400 dark:text-on-surface-variant font-medium">MoSPI Official</span>
        </div>
      </div>

      <div className="w-full max-w-md glass-card rounded-2xl p-8 relative z-10 shadow-2xl border-slate-200 dark:border-glass-border">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-ai-cyan to-ai-purple p-0.5 mx-auto mb-3 shadow-lg shadow-ai-cyan/20">
            <div className="w-full h-full bg-white dark:bg-surface-obsidian rounded-[14px] flex items-center justify-center">
              <Brain className="w-6 h-6 text-ai-cyan" />
            </div>
          </div>
          <h1 className="font-headline text-2xl font-bold text-slate-900 dark:text-white">Sign in to Saksham AI</h1>
          <p className="text-xs text-slate-500 dark:text-on-surface-variant mt-1">Official Statistical System Intelligence Platform</p>
        </div>

        {error && (
          <div className="text-xs text-red-600 dark:text-red-400 mb-4 text-center bg-red-50 dark:bg-red-500/10 py-2.5 px-3.5 rounded-xl border border-red-200 dark:border-red-500/30 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-on-surface mb-1.5" htmlFor="email">
              Official Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-glass-border rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-ai-cyan focus:ring-1 focus:ring-ai-cyan transition-all"
                placeholder="name@mospi.gov.in"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-on-surface" htmlFor="password">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-blue-600 dark:text-ai-cyan hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-glass-border rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-ai-cyan focus:ring-1 focus:ring-ai-cyan transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white"
                tabIndex="-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 gradient-button text-white rounded-xl text-xs sm:text-sm font-semibold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? 'Signing in...' : 'Sign In with Secure SSO'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500 dark:text-on-surface-variant">
            Don't have an official account?{' '}
            <Link to="/register" className="text-blue-600 dark:text-ai-cyan font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>

        {/* Instant 1-Click Role Switcher */}
        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-glass-border">
          <div className="flex items-center gap-1.5 justify-center text-[11px] font-semibold text-slate-500 dark:text-on-surface-variant uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-ai-cyan" />
            <span>Instant Role Explorer</span>
          </div>

          <div className="space-y-2.5">
            {demoPersonas.map((persona) => (
              <button
                key={persona.role}
                type="button"
                onClick={() => handleDemoClick(persona.role)}
                disabled={isSubmitting}
                className="w-full p-3 rounded-xl glass-card hover:border-ai-cyan/50 hover:bg-white/5 text-left transition-all flex items-center justify-between group disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${persona.color} text-white font-bold text-xs flex items-center justify-center shadow-sm`}>
                    {persona.initials}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-ai-cyan transition-colors">{persona.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-on-surface-variant">{persona.roleLabel}</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-ai-cyan group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 dark:text-on-surface-variant mt-6 text-center relative z-10">
        Ministry of Statistics &amp; Programme Implementation (MoSPI) • Government of India
      </p>
    </div>
  );
}
