import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/common/ThemeToggle';

const DEMO_PERSONAS = [
  { name: 'Arjun Sharma', roleLabel: 'Learner', role: 'learner', email: 'arjun.sharma@mospi.gov.in' },
  { name: 'Rajesh Verma', roleLabel: 'Admin', role: 'admin', email: 'rajesh.verma@mospi.gov.in' },
  { name: 'Dr. Radhika Sen', roleLabel: 'Trainer', role: 'trainer', email: 'radhika.sen@nssta.gov.in' },
  { name: 'Priya Deshmukh', roleLabel: 'Learner (JSO)', role: 'learner_jso', email: 'priya.deshmukh@mospi.gov.in' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const user = await login(email, password);
      const role = (user?.role || user?.role_name || '').toLowerCase();
      if (role.includes('admin') || role.includes('trainer')) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoClick = async (persona) => {
    setEmail(persona.email);
    setPassword('Saksham@2026');
    setError('');
    setIsSubmitting(true);

    try {
      const user = await demoLogin(persona.role);
      const userRole = (user?.role || user?.role_name || persona.role).toLowerCase();
      if (userRole.includes('admin') || userRole.includes('trainer')) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Demo login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center px-4 py-12 transition-colors duration-200">
      <div className="w-full max-w-sm mb-4 flex justify-between items-center text-xs">
        <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium">
          ← Back to Saksham AI Home
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle size="sm" />
          <span className="text-slate-400 dark:text-slate-500 font-medium">MoSPI Official</span>
        </div>
      </div>

      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-sm dark:shadow-2xl border border-slate-200 dark:border-slate-800 p-8 transition-colors duration-200">
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-base mx-auto mb-3 shadow-md shadow-blue-600/30">
            S
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Sign in to Saksham AI</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Skill Intelligence &amp; Learning Platform</p>
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 mb-4 text-center bg-red-50 dark:bg-red-950/50 py-2 px-3 rounded-lg border border-red-200 dark:border-red-900/50">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
              placeholder="name@mospi.gov.in"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent pr-10 transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-5 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              Register here
            </Link>
          </p>
        </div>

        <div className="my-5 border-t border-slate-200 dark:border-slate-800" />

        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 text-center">Quick demo access</p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_PERSONAS.map((persona) => (
              <button
                key={persona.role}
                type="button"
                onClick={() => handleDemoClick(persona)}
                disabled={isSubmitting}
                className="border border-slate-200 dark:border-slate-800 rounded-lg p-3 hover:bg-blue-50 dark:hover:bg-slate-800/80 hover:border-blue-200 dark:hover:border-blue-800 text-left transition-colors disabled:opacity-50 group"
              >
                <div className="text-sm font-medium text-slate-900 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">{persona.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{persona.roleLabel}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500 mt-6 text-center">Ministry of Statistics &amp; Programme Implementation (MoSPI) • Government of India</p>
    </div>
  );
}
