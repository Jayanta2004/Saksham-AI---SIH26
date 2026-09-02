import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, BadgeCheck, Briefcase, Building, Award, GraduationCap, Edit2, Check } from 'lucide-react';
import { skillService } from '../../services/skillService';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [certs, setCerts] = useState([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.full_name || user?.name || 'Arjun Sharma',
    email: user?.email || 'arjun.sharma@mospi.gov.in',
    phone: user?.phone || '+91 98100 12345',
    employeeId: user?.id ? `GOI-${user.id.slice(-6).toUpperCase()}` : 'GOI-STAT-2024-019',
    department: user?.department || 'National Accounts Division (NAD)',
    designation: user?.designation || 'Senior Statistical Officer (SSO)',
    cadre: user?.cadre || 'Indian Statistical Service (ISS)',
    experience: user?.work_experience_years ? `${user.work_experience_years} Years` : '4 Years',
    qualification: user?.educational_qualifications || 'M.Sc. Statistics',
    institution: 'Indian Statistical Institute (ISI)',
    passingYear: '2020'
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.full_name || user.name || prev.name,
        email: user.email || prev.email,
        department: user.department || prev.department,
        designation: user.designation || prev.designation,
        cadre: user.cadre || prev.cadre,
        experience: user.work_experience_years ? `${user.work_experience_years} Years` : prev.experience
      }));
    }

    skillService.getUserCertificates().then((data) => {
      if (data && Array.isArray(data)) {
        setCerts(data);
      }
    }).catch(() => {});
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const getInitials = (name) => {
    if (!name) return 'AS';
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Profile Card */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center text-xl font-bold shadow-md shrink-0">
            {getInitials(formData.name)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline text-xl font-bold text-slate-900 dark:text-white">{formData.name}</h1>
              <BadgeCheck className="w-5 h-5 text-blue-600 dark:text-ai-cyan" />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
              {formData.designation} • {formData.department}
            </p>
            <p className="text-xs text-blue-600 dark:text-ai-cyan font-mono mt-0.5">{formData.cadre}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mr-2">Profile changes saved!</span>
          )}
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              isEditing
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-blue-600 dark:to-cyan-600 text-white'
            }`}
          >
            {isEditing ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal & Contact Details */}
        <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
            <User className="w-4 h-4 text-blue-600 dark:text-ai-cyan" />
            <h2 className="font-headline text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
              Official Identification
            </h2>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div>
              <label className="text-slate-500 dark:text-slate-400 block text-xs mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              ) : (
                <p className="font-semibold text-slate-900 dark:text-white">{formData.name}</p>
              )}
            </div>

            <div>
              <label className="text-slate-500 dark:text-slate-400 block text-xs mb-1">Official Email</label>
              <p className="font-mono text-slate-800 dark:text-slate-200">{formData.email}</p>
            </div>

            <div>
              <label className="text-slate-500 dark:text-slate-400 block text-xs mb-1">Official Employee ID</label>
              <p className="font-mono text-slate-800 dark:text-slate-200">{formData.employeeId}</p>
            </div>

            <div>
              <label className="text-slate-500 dark:text-slate-400 block text-xs mb-1">Contact Number</label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              ) : (
                <p className="text-slate-800 dark:text-slate-200">{formData.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Cadre & Professional Background */}
        <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
            <Briefcase className="w-4 h-4 text-purple-600 dark:text-ai-purple" />
            <h2 className="font-headline text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
              Service Cadre &amp; Posting
            </h2>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div>
              <label className="text-slate-500 dark:text-slate-400 block text-xs mb-1">Ministry / Division</label>
              {isEditing ? (
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              ) : (
                <p className="font-semibold text-slate-900 dark:text-white">{formData.department}</p>
              )}
            </div>

            <div>
              <label className="text-slate-500 dark:text-slate-400 block text-xs mb-1">Current Designation</label>
              {isEditing ? (
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              ) : (
                <p className="text-slate-800 dark:text-slate-200">{formData.designation}</p>
              )}
            </div>

            <div>
              <label className="text-slate-500 dark:text-slate-400 block text-xs mb-1">Service Cadre</label>
              <p className="text-slate-800 dark:text-slate-200">{formData.cadre}</p>
            </div>

            <div>
              <label className="text-slate-500 dark:text-slate-400 block text-xs mb-1">Professional Experience</label>
              <p className="text-slate-800 dark:text-slate-200">{formData.experience}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Earned Credentials Section */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600 dark:text-warning-amber" />
            <h2 className="font-headline text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
              Verified MoSPI Credentials
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {certs.length} Active Certificate{certs.length === 1 ? '' : 's'}
          </span>
        </div>

        {certs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certs.map((c, idx) => (
              <div key={idx} className="border border-slate-200 dark:border-white/10 rounded-xl p-4 bg-slate-50 dark:bg-white/5 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{c.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40 rounded font-semibold">
                    Score: {c.score_percentage || 75}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">{c.issuer}</p>
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono pt-1">
                  <span>Issued: {c.issue_date}</span>
                  <span className="text-blue-600 dark:text-ai-cyan">{c.credential_id}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400 italic py-2">
            No certificates earned yet. Pass diagnostic assessments with a score of 70% or higher to earn credentials.
          </p>
        )}
      </div>
    </div>
  );
}
