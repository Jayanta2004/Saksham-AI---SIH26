import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, GraduationCap, Clock, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import api from '../../services/api';

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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-7">
        
        {/* State 1: Success Submitted & Account Active */}
        {isSubmitted ? (
          <div className="text-center space-y-4 py-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">Account Created Successfully</h2>
              <p className="text-xs text-gray-500 mt-1">
                Your account is active and ready to use
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="text-gray-500">Officer Name:</span>
                <span className="font-semibold text-gray-900">{submittedData?.name}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="text-gray-500">Official Email:</span>
                <span className="font-mono text-gray-800">{submittedData?.email}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="text-gray-500">Designation:</span>
                <span className="text-gray-800">{submittedData?.designation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 text-[10px]">
                  Active & Verified
                </span>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-[11px] text-emerald-800 text-left">
              <ShieldCheck className="w-4 h-4 text-emerald-600 inline mr-1.5 mb-0.5" />
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
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-base mx-auto mb-2.5 shadow-sm">
                S
              </div>
              <h1 className="text-xl font-bold text-gray-900">Create an Account</h1>
              <p className="text-xs text-gray-500 mt-0.5">Skill Intelligence & Learning Platform</p>
            </div>

            {error && (
              <p className="text-xs text-red-600 mb-3.5 text-center bg-red-50 py-2 px-3 rounded-lg border border-red-100">
                {error}
              </p>
            )}

            {/* Account Role Selector: Learner vs Trainer */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
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
                          ? 'border-blue-600 bg-blue-50/80 text-blue-700 font-semibold shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className="text-xs font-semibold">{role.label}</span>
                      <span className="text-[10px] text-gray-400 leading-tight mt-0.5">{role.desc}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-gray-400 mt-1 text-center">
                * Administrator accounts are pre-authorized government credentials.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="full_name">
                  Full Name
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="e.g. Shri Vikram Malhotra"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="email">
                  Official Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="name@mospi.gov.in"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="designation">
                    Designation
                  </label>
                  <select
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full px-2.5 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    {DESIGNATIONS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="cadre">
                    Cadre
                  </label>
                  <select
                    id="cadre"
                    name="cadre"
                    value={formData.cadre}
                    onChange={handleChange}
                    className="w-full px-2.5 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="ISS">ISS (Indian Statistical Service)</option>
                    <option value="SSS">SSS (Subordinate Statistical Service)</option>
                    <option value="General Central Service">General Central Service</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="department">
                  Department / Division
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="password">
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
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600"
                      tabIndex="-1"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="confirm_password">
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
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600"
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
              <p className="text-xs text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </>
        )}
      </div>

      <p className="text-[11px] text-gray-400 mt-5 text-center">
        Ministry of Statistics & Programme Implementation (MoSPI) • SIH 2026
      </p>
    </div>
  );
}
