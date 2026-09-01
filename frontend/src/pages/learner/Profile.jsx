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
    name: user?.full_name || user?.name || 'Officer',
    email: user?.email || '',
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
    if (!name) return 'O';
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header Profile Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-sm">
            {getInitials(formData.name)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">{formData.name}</h1>
              <BadgeCheck className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">
              {formData.designation} • {formData.department}
            </p>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{formData.cadre}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-600 font-medium mr-2">Profile changes saved!</span>
          )}
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
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
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <User className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              Official Identification
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-gray-400 block mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              ) : (
                <p className="font-semibold text-gray-900">{formData.name}</p>
              )}
            </div>

            <div>
              <label className="text-gray-400 block mb-1">Official Email</label>
              <p className="font-mono text-gray-800">{formData.email}</p>
            </div>

            <div>
              <label className="text-gray-400 block mb-1">Official Employee ID</label>
              <p className="font-mono text-gray-800">{formData.employeeId}</p>
            </div>

            <div>
              <label className="text-gray-400 block mb-1">Contact Number</label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              ) : (
                <p className="text-gray-800">{formData.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Cadre & Professional Background */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              Service Cadre & Posting
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-gray-400 block mb-1">Ministry / Division</label>
              {isEditing ? (
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              ) : (
                <p className="font-semibold text-gray-900">{formData.department}</p>
              )}
            </div>

            <div>
              <label className="text-gray-400 block mb-1">Current Designation</label>
              {isEditing ? (
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              ) : (
                <p className="text-gray-800">{formData.designation}</p>
              )}
            </div>

            <div>
              <label className="text-gray-400 block mb-1">Service Cadre</label>
              <p className="text-gray-800">{formData.cadre}</p>
            </div>

            <div>
              <label className="text-gray-400 block mb-1">Professional Experience</label>
              <p className="text-gray-800">{formData.experience}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Earned Credentials Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              Verified MoSPI Credentials
            </h2>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {certs.length} Active Certificate{certs.length === 1 ? '' : 's'}
          </span>
        </div>

        {certs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certs.map((c, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-xs font-bold text-gray-900">{c.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-semibold">
                    Score: {c.score_percentage || 75}%
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">{c.issuer}</p>
                <div className="flex justify-between text-[10px] text-gray-400 font-mono pt-1">
                  <span>Issued: {c.issue_date}</span>
                  <span className="text-blue-600">{c.credential_id}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic py-2">
            No certificates earned yet. Pass diagnostic assessments with a score of 70% or higher to earn credentials.
          </p>
        )}
      </div>
    </div>
  );
}
