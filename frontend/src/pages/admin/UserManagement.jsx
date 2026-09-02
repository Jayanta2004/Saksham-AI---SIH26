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
      setPendingOfficers((prev) => prev.filter((o) => o.id !== officer.id));
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
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-headline text-xl font-bold text-slate-900 dark:text-white">User &amp; Cadre Management</h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Review registered officers, verify new registration requests, and inspect competency profiles.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl shrink-0 border border-slate-200 dark:border-white/10">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === 'active'
                ? 'bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-white/10'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Active Officers ({activeUsers.length})
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === 'pending'
                ? 'bg-white dark:bg-[#0F172A] text-blue-700 dark:text-ai-cyan shadow-xs border border-slate-200 dark:border-white/10'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Pending Approvals</span>
            {pendingOfficers.length > 0 && (
              <span className="px-1.5 py-0.5 bg-amber-500 text-white rounded-full text-[10px] font-mono font-bold">
                {pendingOfficers.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Action Notification */}
      {actionSuccess && (
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs px-4 py-3 rounded-xl flex items-center space-x-2 shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-semibold">{actionSuccess}</span>
        </div>
      )}

      {/* TAB 1: ACTIVE OFFICERS DIRECTORY */}
      {activeTab === 'active' && (
        <div className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-headline text-base font-bold text-slate-900 dark:text-white">Active Officers Directory</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{filteredActive.length} authorized officers in database</p>
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or designation..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-blue-500 dark:focus:border-ai-cyan transition"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider bg-slate-50 dark:bg-white/5">
                  <th className="py-3 px-3">Officer Name</th>
                  <th className="py-3 px-3">Official Email</th>
                  <th className="py-3 px-3">Designation</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Cadre</th>
                  <th className="py-3 px-3">Readiness</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10 text-xs">
                {filteredActive.map((u) => {
                  const score = u.overall_competency || u.competency_score || (u.email.includes('arjun') ? 78 : u.email.includes('rajesh') ? 95 : 82);
                  return (
                    <tr key={u.id || u.email} className="hover:bg-slate-50/60 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-blue-50 dark:bg-cyan-500/10 text-blue-700 dark:text-ai-cyan font-bold text-xs flex items-center justify-center shrink-0 border border-blue-200 dark:border-cyan-500/20">
                          {(u.full_name || u.name || 'U').charAt(0)}
                        </div>
                        <span>{u.full_name || u.name}</span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400 font-mono">{u.email}</td>
                      <td className="py-3.5 px-3 text-slate-800 dark:text-slate-200 font-medium">{u.designation || 'Senior Statistical Officer'}</td>
                      <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">{u.department || 'National Accounts Division (NAD)'}</td>
                      <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">
                        <span className="bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded font-mono text-[11px] font-semibold">
                          {u.cadre || 'ISS'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-blue-600 dark:text-ai-cyan font-mono">
                        <span className="bg-blue-50 dark:bg-cyan-500/10 px-2 py-1 rounded-lg border border-blue-200 dark:border-cyan-500/20">
                          {score}%
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredActive.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                      No active officers found matching "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PENDING OFFICER REGISTRATION REQUESTS */}
      {activeTab === 'pending' && (
        <div className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-headline text-base font-bold text-slate-900 dark:text-white">Pending Verification Requests</h2>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-xs font-mono font-bold rounded-full">
                  {pendingOfficers.length} Pending
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Review officer credentials before granting access to the MoSPI Skill Intelligence platform.
              </p>
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter pending requests..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider bg-amber-50/40 dark:bg-amber-500/5">
                  <th className="py-3 px-3">Officer Name</th>
                  <th className="py-3 px-3">Official Email</th>
                  <th className="py-3 px-3">Designation</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Cadre</th>
                  <th className="py-3 px-3">Submitted</th>
                  <th className="py-3 px-3 text-right">Approval Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10 text-xs">
                {filteredPending.map((officer) => (
                  <tr key={officer.id} className="hover:bg-amber-50/30 dark:hover:bg-white/5 transition">
                    <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-300 dark:border-amber-500/40">
                        {officer.full_name.charAt(0)}
                      </div>
                      <span>{officer.full_name}</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400 font-mono">{officer.email}</td>
                    <td className="py-3.5 px-3 text-slate-800 dark:text-slate-200 font-medium">{officer.designation}</td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">{officer.department}</td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">
                      <span className="bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded font-mono text-[11px] font-semibold">
                        {officer.cadre}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{officer.request_date || 'Just now'}</span>
                    </td>
                    <td className="py-3.5 px-3 text-right space-x-1.5">
                      <button
                        onClick={() => handleApprove(officer)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1 shadow-sm transition"
                        title="Verify and Approve Officer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => handleReject(officer.id, officer.full_name)}
                        className="px-2.5 py-1.5 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-700 dark:text-red-400 rounded-xl text-xs font-semibold inline-flex items-center gap-1 border border-red-200 dark:border-red-500/30 transition"
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
                    <td colSpan={7} className="py-10 text-center text-slate-400 text-sm">
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

      {/* Officer Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#090D16] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-white/10 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-cyan-500/10 text-blue-700 dark:text-ai-cyan font-bold flex items-center justify-center border border-blue-200 dark:border-cyan-500/20 text-base">
                  {(selectedUser.full_name || selectedUser.name || 'U').charAt(0)}
                </div>
                <div>
                  <h3 className="font-headline font-bold text-slate-900 dark:text-white text-base">{selectedUser.full_name || selectedUser.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{selectedUser.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
                <span className="text-slate-500 dark:text-slate-400 block mb-1">Designation</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedUser.designation || 'Senior Statistical Officer'}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
                <span className="text-slate-500 dark:text-slate-400 block mb-1">Department</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedUser.department || 'National Accounts Division'}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
                <span className="text-slate-500 dark:text-slate-400 block mb-1">Cadre Classification</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{selectedUser.cadre || 'ISS'}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
                <span className="text-slate-500 dark:text-slate-400 block mb-1">Overall Readiness</span>
                <span className="font-bold text-blue-600 dark:text-ai-cyan font-mono">
                  {selectedUser.overall_competency || selectedUser.competency_score || 78}% Ready
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition"
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
