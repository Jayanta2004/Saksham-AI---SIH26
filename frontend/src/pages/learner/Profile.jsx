import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, BadgeCheck, Briefcase, Building, Award, GraduationCap, Edit2, Check } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.full_name || user?.name || 'Arjun Sharma',
    email: user?.email || 'arjun.sharma@mospi.gov.in',
    phone: user?.phone || '+91 98765 43210',
    employeeId: user?.employee_id || user?.employeeId || 'GOI-STAT-2021-0942',
    department: user?.department || 'Ministry of Statistics & Programme Implementation',
    designation: user?.designation || 'Senior Statistical Officer',
    cadre: user?.cadre || 'Indian Statistical Service (ISS)',
    experience: user?.experience || '6 Years',
    qualification: 'Master of Statistics (M.Stat)',
    institution: 'Indian Statistical Institute (ISI), Kolkata',
    passingYear: '2019'
  });

  const [certifications] = useState([
    {
      title: 'Advanced Public Policy & Statistical Modeling',
      issuer: 'National Institute of Public Finance and Policy',
      date: 'Nov 2024'
    },
    {
      title: 'Data Science for Governance & Decision Making',
      issuer: 'iGOT Karmayogi Bharat',
      date: 'Jul 2024'
    },
    {
      title: 'Digital Public Infrastructure & Open Data Standards',
      issuer: 'NIC & MeitY',
      date: 'Feb 2024'
    }
  ]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-semibold shadow-inner">
            {getInitials(formData.name)}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{formData.name}</h1>
            <p className="text-sm text-gray-600">{formData.designation}</p>
            <p className="text-xs text-gray-500">{formData.department}</p>
          </div>
        </div>

        <div>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              <Check className="w-4 h-4" />
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition shadow-sm"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <User className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-semibold text-gray-900">Personal Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              ) : (
                <p className="text-sm text-gray-900">{formData.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              ) : (
                <p className="text-sm text-gray-900">{formData.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Mobile Number</label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              ) : (
                <p className="text-sm text-gray-900">{formData.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Employee ID</label>
              {isEditing ? (
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              ) : (
                <p className="text-sm text-gray-900">{formData.employeeId}</p>
              )}
            </div>
          </div>
        </div>

        {/* Professional Info */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-semibold text-gray-900">Professional Details</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Department / Ministry</label>
              {isEditing ? (
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              ) : (
                <p className="text-sm text-gray-900">{formData.department}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Designation</label>
              {isEditing ? (
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              ) : (
                <p className="text-sm text-gray-900">{formData.designation}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Cadre / Service</label>
              {isEditing ? (
                <input
                  type="text"
                  name="cadre"
                  value={formData.cadre}
                  onChange={handleChange}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              ) : (
                <p className="text-sm text-gray-900">{formData.cadre}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Experience</label>
              {isEditing ? (
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              ) : (
                <p className="text-sm text-gray-900">{formData.experience}</p>
              )}
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-semibold text-gray-900">Education</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Highest Qualification</label>
              {isEditing ? (
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              ) : (
                <p className="text-sm text-gray-900 font-medium">{formData.qualification}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Institution / University</label>
              {isEditing ? (
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              ) : (
                <p className="text-sm text-gray-900">{formData.institution}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Year of Completion</label>
              {isEditing ? (
                <input
                  type="text"
                  name="passingYear"
                  value={formData.passingYear}
                  onChange={handleChange}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              ) : (
                <p className="text-sm text-gray-900">{formData.passingYear}</p>
              )}
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Award className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-semibold text-gray-900">Certifications</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {certifications.map((cert, index) => (
              <div key={index} className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <p className="text-sm font-medium text-gray-900">{cert.title}</p>
                  <p className="text-xs text-gray-500">{cert.issuer}</p>
                </div>
                <span className="text-xs text-gray-400 font-medium whitespace-nowrap">{cert.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
