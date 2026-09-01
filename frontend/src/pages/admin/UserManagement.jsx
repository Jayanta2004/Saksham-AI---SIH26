import React, { useState, useEffect } from 'react';
import { mockUsers } from '../../data/mockUsers';
import { Search, X, UserCheck, Award, Mail, Building, Shield, CheckCircle, Clock, Check, Trash2, AlertCircle } from 'lucide-react';
import api from '../../services/api';

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'pending'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeUsers, setActiveUsers] = useState(mockUsers);
  const [pendingOfficers, setPendingOfficers] = useState([
    {
      id: 'usr_req_101',
      full_name: 'Shri Vikram Malhotra, ISS',
      email: 'vikram.malhotra@mospi.gov.in',
      role_id: 'role_learner',
      role_name: 'Learner',
      designation: 'Senior Statistical Officer (SSO)',
      department: 'Field Operations Division (FOD)',
      cadre: 'ISS',
      request_date: 'Today, 11:30 AM',
      educational_qualifications: 'M.Sc. Statistics',
      work_experience_years: 4.5
    },
    {
      id: 'usr_req_102',
      full_name: 'Smt. Ananya Sen, SSS',
      email: 'ananya.sen@mospi.gov.in',
      role_id: 'role_learner',
      role_name: 'Learner',
      designation: 'Junior Statistical Officer (JSO)',
      department: 'Price Statistics Division (PSD)',
      cadre: 'SSS',
      request_date: 'Today, 01:15 PM',
      educational_qualifications: 'B.Sc. Statistics & Economics',
      work_experience_years: 2.0
    }
  ]);
  const [actionSuccess, setActionSuccess] = useState('');

  // Fetch live from backend if token available
  useEffect(() => {
    const fetchLiveUsers = async () => {
      try {
        const [usersRes, pendingRes] = await Promise.all([
          api.get('/api/admin/users').catch(() => null),
          api.get('/api/admin/pending-officers').catch(() => null)
        ]);

        if (usersRes?.data?.users && usersRes.data.users.length > 0) {
          setActiveUsers(usersRes.data.users);
        }
        if (pendingRes?.data?.pending_officers && pendingRes.data.pending_officers.length > 0) {
          setPendingOfficers(pendingRes.data.pending_officers);
        }
      } catch (e) {
        console.warn('Using local fallback for users management:', e);
      }
    };
    fetchLiveUsers();
  }, []);

  const handleApprove = async (officer) => {
    try {
      await api.post(`/api/admin/approve-officer/${officer.id}`).catch(() => null);
      // Remove from pending
      setPendingOfficers((prev) => prev.filter((o) => o.id !== officer.id));
      // Add to active users
      const newActive = {
        ...officer,
        is_active: true,
        overall_competency: 76,
        competency_score: 76
      };
      setActiveUsers((prev) => [newActive, ...prev]);
      setActionSuccess(`Officer ${officer.full_name} has been verified & approved.`);
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      console.error('Approve failed:', err);
    }
  };

  const handleReject = async (officerId, officerName) => {
    if (window.confirm(`Are you sure you want to decline registration for ${officerName}?`)) {
      try {
        await api.post(`/api/admin/reject-officer/${officerId}`).catch(() => null);
        setPendingOfficers((prev) => prev.filter((o) => o.id !== officerId));
        setActionSuccess(`Registration request for ${officerName} has been declined.`);
        setTimeout(() => setActionSuccess(''), 4000);
      } catch (err) {
        console.error('Reject failed:', err);
      }
    }
  };

  const filteredActive = activeUsers.filter((u) =>
    (u.full_name || u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.department || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.designation || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPending = pendingOfficers.filter((u) =>
    (u.full_name || u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.department || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">User & Cadre Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review registered officers, verify new registration requests, and inspect competency profiles.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'active'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Active Officers ({activeUsers.length})
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'pending'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>Pending Approvals</span>
            {pendingOfficers.length > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-bold">
                {pendingOfficers.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Action Notification */}
      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-xl flex items-center space-x-2 shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{actionSuccess}</span>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TAB 1: ACTIVE OFFICERS DIRECTORY                                     */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'active' && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Active Officers Directory</h2>
              <p className="text-xs text-gray-500">{filteredActive.length} authorized officers in database</p>
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or designation..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:bg-white focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-xs font-medium bg-gray-50/50">
                  <th className="py-3 px-3">Officer Name</th>
                  <th className="py-3 px-3">Official Email</th>
                  <th className="py-3 px-3">Designation</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Cadre</th>
                  <th className="py-3 px-3">Readiness</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredActive.map((u) => {
                  const score = u.overall_competency || u.competency_score || (u.email.includes('arjun') ? 78 : u.email.includes('rajesh') ? 95 : 82);
                  return (
                    <tr key={u.id || u.email} className="hover:bg-gray-50/60 transition">
                      <td className="py-3.5 px-3 font-medium text-gray-900 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-semibold text-xs flex items-center justify-center shrink-0 border border-blue-200">
                          {(u.full_name || u.name || 'U').charAt(0)}
                        </div>
                        <span>{u.full_name || u.name}</span>
                      </td>
                      <td className="py-3.5 px-3 text-gray-500 text-xs font-mono">{u.email}</td>
                      <td className="py-3.5 px-3 text-gray-800 text-xs">{u.designation || 'Senior Statistical Officer'}</td>
                      <td className="py-3.5 px-3 text-gray-600 text-xs">{u.department || 'National Accounts Division (NAD)'}</td>
                      <td className="py-3.5 px-3 text-gray-600 text-xs">
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono text-[11px]">
                          {u.cadre || 'ISS'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-xs text-blue-600">
                        <span className="bg-blue-50 px-2 py-1 rounded border border-blue-100">
                          {score}%
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredActive.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500 text-sm">
                      No active officers found matching "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TAB 2: PENDING OFFICER REGISTRATION REQUESTS                          */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'pending' && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-semibold text-gray-900">Pending Verification Requests</h2>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                  {pendingOfficers.length} Pending
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Review officer credentials before granting access to the MoSPI Skill Intelligence platform.
              </p>
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter pending requests..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:bg-white focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-xs font-medium bg-amber-50/40">
                  <th className="py-3 px-3">Officer Name</th>
                  <th className="py-3 px-3">Official Email</th>
                  <th className="py-3 px-3">Designation</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Cadre</th>
                  <th className="py-3 px-3">Submitted</th>
                  <th className="py-3 px-3 text-right">Approval Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredPending.map((officer) => (
                  <tr key={officer.id} className="hover:bg-amber-50/30 transition">
                    <td className="py-3.5 px-3 font-medium text-gray-900 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-semibold text-xs flex items-center justify-center shrink-0 border border-amber-200">
                        {officer.full_name.charAt(0)}
                      </div>
                      <span>{officer.full_name}</span>
                    </td>
                    <td className="py-3.5 px-3 text-gray-600 text-xs font-mono">{officer.email}</td>
                    <td className="py-3.5 px-3 text-gray-800 text-xs">{officer.designation}</td>
                    <td className="py-3.5 px-3 text-gray-600 text-xs">{officer.department}</td>
                    <td className="py-3.5 px-3 text-gray-600 text-xs">
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono text-[11px]">
                        {officer.cadre}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-gray-500 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span>{officer.request_date || 'Just now'}</span>
                    </td>
                    <td className="py-3.5 px-3 text-right space-x-1.5">
                      <button
                        onClick={() => handleApprove(officer)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1 shadow-xs transition"
                        title="Verify and Approve Officer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => handleReject(officer.id, officer.full_name)}
                        className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-medium inline-flex items-center gap-1 border border-red-200 transition"
                        title="Decline Registration"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredPending.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-gray-400 text-sm">
                      <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                      <span>No pending registration requests. All officer accounts are verified!</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* Officer Details Modal                                                */}
      {/* -------------------------------------------------------------------- */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center border border-blue-200 text-base">
                  {(selectedUser.full_name || selectedUser.name || 'U').charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-base">{selectedUser.full_name || selectedUser.name}</h3>
                  <p className="text-xs text-gray-500">{selectedUser.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block mb-1">Designation</span>
                <span className="font-medium text-gray-800">{selectedUser.designation || 'Senior Statistical Officer'}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block mb-1">Department</span>
                <span className="font-medium text-gray-800">{selectedUser.department || 'National Accounts Division'}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block mb-1">Cadre Classification</span>
                <span className="font-medium text-gray-800">{selectedUser.cadre || 'ISS'}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block mb-1">Overall Readiness</span>
                <span className="font-semibold text-blue-600">
                  {selectedUser.overall_competency || selectedUser.competency_score || 78}% Ready
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
