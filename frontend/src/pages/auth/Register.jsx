import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, GraduationCap, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import ThemeToggle from '../../components/common/ThemeToggle';

const DEPARTMENTS = [
  'National Accounts Division (NAD)',
  'Survey Design & Research Division (SDRD)',
  'Field Operations Division (FOD)',
  'Central Statistics Office (CSO)',
  'Price Statistics Division (PSD)',
  'Data Informatics & Innovation Division (DIID)',
  'National Statistical Systems Training Academy (NSSTA)'
];

const DESIGNATIONS = [
  'Senior Statistical Officer (SSO)',
  'Junior Statistical Officer (JSO)',
  'Director / Joint Director',
  'Deputy Director',
  'Statistical Investigator',
  'Assistant Director'
];

const ROLES = [
  { id: 'role_learner', label: 'Learner Account', desc: 'Statistical Officer / Trainee', icon: User },
  { id: 'role_trainer', label: 'Trainer Account', desc: 'NSSTA Faculty & Instructor', icon: GraduationCap }
];

export default function Register() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    designation: 'Senior Statistical Officer (SSO)',
    department: 'National Accounts Division (NAD)',
    cadre: 'ISS',
    role_id: 'role_learner'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (roleId) => {
    setFormData({ ...formData, role_id: roleId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.post('/api/auth/register', {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        designation: formData.designation,
        department: formData.department,
        cadre: formData.cadre,
        role_id: formData.role_id
      });

      if (res.data?.pending_approval || res.data?.success) {
        setSubmittedData({
          name: formData.full_name,
          email: formData.email,
          designation: formData.designation,
          department: formData.department
        });
        setIsSubmitted(true);
      }
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center px-4 py-8 transition-colors duration-200">
      <div className="w-full max-w-md mb-4 flex justify-between items-center text-xs">
        <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium">
          ← Back to Saksham AI Home
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle size="sm" />
          <span className="text-slate-400 dark:text-slate-500 font-medium">MoSPI Official</span>
        </div>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-sm dark:shadow-2xl border border-slate-200 dark:border-slate-800 p-7 transition-colors duration-200">
        
        {/* State 1: Success Submitted & Account Active */}
        {isSubmitted ? (
          <div className="text-center space-y-4 py-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Account Created Successfully</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your account is active and ready to use
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                <span className="text-slate-500 dark:text-slate-400">Officer Name:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{submittedData?.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                <span className="text-slate-500 dark:text-slate-400">Official Email:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{submittedData?.email}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                <span className="text-slate-500 dark:text-slate-400">Designation:</span>
                <span className="text-slate-800 dark:text-slate-200">{submittedData?.designation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Status:</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800 text-[10px]">
                  Active &amp; Verified
                </span>
              </div>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-lg p-3 text-[11px] text-emerald-800 dark:text-emerald-300 text-left">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 inline mr-1.5 mb-0.5" />
              You can now sign in immediately to explore your competency radar and courses.
            </div>

            <Link
              to="/login"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-sm transition"
            >
              <span>Proceed to Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          /* State 2: Registration Form */
          <>
            <div className="text-center mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-base mx-auto mb-2.5 shadow-md shadow-blue-600/30">
                S
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Create an Account</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Skill Intelligence &amp; Learning Platform</p>
            </div>

            {error && (
              <p className="text-xs text-red-600 dark:text-red-400 mb-3.5 text-center bg-red-50 dark:bg-red-950/50 py-2 px-3 rounded-lg border border-red-200 dark:border-red-900/50">
                {error}
              </p>
            )}

            {/* Account Role Selector: Learner vs Trainer */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Select Account Role
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {ROLES.map((role) => {
                  const isSelected = formData.role_id === role.id;
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => handleRoleSelect(role.id)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition ${
                        isSelected
                          ? 'border-blue-600 dark:border-blue-500 bg-blue-50/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                      <span className="text-xs font-semibold">{role.label}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight mt-0.5">{role.desc}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 text-center">
                * Administrator accounts are pre-authorized government credentials.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="full_name">
                  Full Name
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                  placeholder="e.g. Shri Vikram Malhotra"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="email">
                  Official Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                  placeholder="name@mospi.gov.in"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="designation">
                    Designation
                  </label>
                  <select
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full px-2.5 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  >
                    {DESIGNATIONS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="cadre">
                    Cadre
                  </label>
                  <select
                    id="cadre"
                    name="cadre"
                    value={formData.cadre}
                    onChange={handleChange}
                    className="w-full px-2.5 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  >
                    <option value="ISS">ISS (Indian Statistical Service)</option>
                    <option value="SSS">SSS (Subordinate Statistical Service)</option>
                    <option value="General Central Service">General Central Service</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="department">
                  Department / Division
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-3 py-2 pr-8 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      tabIndex="-1"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="confirm_password">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirm_password"
                      name="confirm_password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirm_password}
                      onChange={handleChange}
                      className="w-full px-3 py-2 pr-8 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      tabIndex="-1"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm mt-2"
              >
                {isSubmitting ? 'Submitting request...' : `Submit ${formData.role_id === 'role_trainer' ? 'Trainer' : 'Learner'} Registration`}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </>
        )}
      </div>

      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-5 text-center">
        Ministry of Statistics &amp; Programme Implementation (MoSPI) • Government of India
      </p>
    </div>
  );
}
