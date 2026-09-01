import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-base mx-auto mb-3 shadow-sm">
            S
          </div>
          <h1 className="text-xl font-bold text-gray-900">Sign in to Saksham AI</h1>
          <p className="text-sm text-gray-500 mt-1">Skill Intelligence & Learning Platform</p>
        </div>

        {error && (
          <p className="text-sm text-red-600 mb-4 text-center bg-red-50 py-2 px-3 rounded-lg border border-red-100">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="name@mospi.gov.in"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline">
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
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                tabIndex="-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>

        <div className="my-5 border-t border-gray-200" />

        <div>
          <p className="text-xs text-gray-500 mb-3 text-center">Quick demo access</p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_PERSONAS.map((persona) => (
              <button
                key={persona.role}
                type="button"
                onClick={() => handleDemoClick(persona)}
                disabled={isSubmitting}
                className="border border-gray-200 rounded-lg p-3 hover:bg-blue-50 hover:border-blue-200 text-left transition-colors disabled:opacity-50 group"
              >
                <div className="text-sm font-medium text-gray-900 group-hover:text-blue-700">{persona.name}</div>
                <div className="text-xs text-gray-500">{persona.roleLabel}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-6 text-center">Ministry of Statistics & Programme Implementation (MoSPI) • SIH 2026</p>
    </div>
  );
}
