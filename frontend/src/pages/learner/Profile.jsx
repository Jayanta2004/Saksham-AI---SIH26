import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, BadgeCheck, Briefcase, Building, Award, GraduationCap, Edit2, Check } from 'lucide-react';
import { skillService } from '../../services/skillService';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [certs, setCerts] = useState([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const isDemo = user?.id === 'usr_sso_01';

  const [formData, setFormData] = useState({
    name: user?.full_name || user?.name || (isDemo ? 'Arjun Sharma' : ''),
    email: user?.email || (isDemo ? 'arjun.sharma@mospi.gov.in' : ''),
    phone: user?.phone || (isDemo ? '+91 98100 12345' : ''),
    employeeId: user?.id ? `GOI-${user.id.slice(-6).toUpperCase()}` : (isDemo ? 'GOI-STAT-2024-019' : 'GOI-PENDING'),
    department: user?.department || (isDemo ? 'National Accounts Division (NAD)' : 'Field Operations Division (FOD)'),
    designation: user?.designation || (isDemo ? 'Senior Statistical Officer (SSO)' : 'Statistical Officer'),
    cadre: user?.cadre || (isDemo ? 'Indian Statistical Service (ISS)' : 'Subordinate Statistical Service (SSS)'),
    experience: user?.work_experience_years ? `${user.work_experience_years} Years` : (isDemo ? '4 Years' : '0 Years'),
    qualification: user?.educational_qualifications || (isDemo ? 'M.Sc. Statistics' : 'Not Specified'),
    institution: isDemo ? 'Indian Statistical Institute (ISI)' : 'National Academy',
    passingYear: isDemo ? '2020' : new Date().getFullYear().toString()
  });

  useEffect(() => {
    if (user) {
      const isDemoAccount = user.id === 'usr_sso_01';
      setFormData({
        name: user.full_name || user.name || (isDemoAccount ? 'Arjun Sharma' : ''),
        email: user.email || (isDemoAccount ? 'arjun.sharma@mospi.gov.in' : ''),
        phone: user.phone || (isDemoAccount ? '+91 98100 12345' : ''),
        employeeId: user.id ? `GOI-${user.id.slice(-6).toUpperCase()}` : (isDemoAccount ? 'GOI-STAT-2024-019' : 'GOI-PENDING'),
        department: user.department || (isDemoAccount ? 'National Accounts Division (NAD)' : 'Field Operations Division (FOD)'),
        designation: user.designation || (isDemoAccount ? 'Senior Statistical Officer (SSO)' : 'Statistical Officer'),
        cadre: user.cadre || (isDemoAccount ? 'Indian Statistical Service (ISS)' : 'Subordinate Statistical Service (SSS)'),
        experience: user.work_experience_years ? `${user.work_experience_years} Years` : (isDemoAccount ? '4 Years' : '0 Years'),
        qualification: user.educational_qualifications || (isDemoAccount ? 'M.Sc. Statistics' : 'Not Specified'),
        institution: isDemoAccount ? 'Indian Statistical Institute (ISI)' : 'National Academy',
        passingYear: isDemoAccount ? '2020' : new Date().getFullYear().toString()
      });
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
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center text-xl font-bold shadow-md shrink-0">
            {getInitials(formData.name)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline text-xl font-bold text-slate-900">{formData.name}</h1>
              <BadgeCheck className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-medium">
              {formData.designation} • {formData.department}
            </p>
            <p className="text-xs text-blue-600 font-mono mt-0.5">{formData.cadre}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-600 font-semibold mr-2">Profile changes saved!</span>
          )}
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              isEditing
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
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
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <User className="w-4 h-4 text-blue-600" />
            <h2 className="font-headline text-sm font-bold text-slate-900 uppercase tracking-wide">
              Official Identification
            </h2>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div>
              <label className="text-slate-500 block text-xs mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900"
                />
              ) : (
                <p className="font-semibold text-slate-900">{formData.name}</p>
              )}
            </div>

            <div>
              <label className="text-slate-500 block text-xs mb-1">Official Email</label>
              <p className="font-mono text-slate-800">{formData.email}</p>
            </div>

            <div>
              <label className="text-slate-500 block text-xs mb-1">Official Employee ID</label>
              <p className="font-mono text-slate-800">{formData.employeeId}</p>
            </div>

            <div>
              <label className="text-slate-500 block text-xs mb-1">Contact Number</label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900"
                />
              ) : (
                <p className="text-slate-800">{formData.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Cadre & Professional Background */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Briefcase className="w-4 h-4 text-purple-600" />
            <h2 className="font-headline text-sm font-bold text-slate-900 uppercase tracking-wide">
              Service Cadre &amp; Posting
            </h2>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div>
              <label className="text-slate-500 block text-xs mb-1">Ministry / Division</label>
              {isEditing ? (
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900"
                />
              ) : (
                <p className="font-semibold text-slate-900">{formData.department}</p>
              )}
            </div>

            <div>
              <label className="text-slate-500 block text-xs mb-1">Current Designation</label>
              {isEditing ? (
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900"
                />
              ) : (
                <p className="text-slate-800">{formData.designation}</p>
              )}
            </div>

            <div>
              <label className="text-slate-500 block text-xs mb-1">Service Cadre</label>
              <p className="text-slate-800">{formData.cadre}</p>
            </div>

            <div>
              <label className="text-slate-500 block text-xs mb-1">Professional Experience</label>
              <p className="text-slate-800">{formData.experience}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Earned Credentials Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600" />
            <h2 className="font-headline text-sm font-bold text-slate-900 uppercase tracking-wide">
              Verified MoSPI Credentials
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {certs.length} Active Certificate{certs.length === 1 ? '' : 's'}
          </span>
        </div>

        {certs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certs.map((c, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">{c.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-semibold">
                    Score: {c.score_percentage || 75}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">{c.issuer}</p>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-1">
                  <span>Issued: {c.issue_date}</span>
                  <span className="text-blue-600">{c.credential_id}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic py-2">
            No certificates earned yet. Pass diagnostic assessments with a score of 70% or higher to earn credentials.
          </p>
        )}
      </div>
    </div>
  );
}
