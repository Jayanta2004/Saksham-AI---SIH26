import React, { useState } from 'react';
import { FileText, Download, Check, Table, Users, Calendar, CheckCircle2 } from 'lucide-react';
import { mockUsers } from '../../data/mockUsers';

export default function AdminReports() {
  const [downloadMsg, setDownloadMsg] = useState(false);
  const [reportName, setReportName] = useState('');

  const generateAndDownloadCSV = (filename, headers, rows) => {
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = (reportType, title) => {
    setReportName(title);

    if (reportType === 'matrix') {
      const headers = ['Officer Name', 'Designation', 'Department', 'Competency Domain', 'Current Level', 'Required Level', 'Gap Score', 'Priority'];
      const rows = [
        ['Arjun Sharma', 'Senior Statistical Officer', 'National Accounts Division', 'Machine Learning', '1.6', '3.0', '1.4', 'High'],
        ['Arjun Sharma', 'Senior Statistical Officer', 'National Accounts Division', 'Survey Sampling', '2.2', '3.5', '1.3', 'High'],
        ['Priya Deshmukh', 'Junior Statistical Officer', 'Survey Design and Research Division', 'Python & R Analytics', '2.0', '3.5', '1.5', 'High'],
        ['Priya Deshmukh', 'Junior Statistical Officer', 'Survey Design and Research Division', 'DPDP Act Compliance', '2.2', '4.0', '1.8', 'High'],
        ['Dr. Radhika Sen', 'Director (Training)', 'National Statistical Systems Training Academy', 'Advanced Sampling Theory', '4.8', '5.0', '0.2', 'Low'],
        ['Rajesh Verma', 'Joint Director (IT & Systems)', 'Computer Centre, MoSPI', 'Cloud Infrastructure', '4.5', '4.5', '0.0', 'Low'],
      ];
      generateAndDownloadCSV('SakshamAI_Skill_Gap_Matrix.csv', headers, rows);
    } else if (reportType === 'audit') {
      const headers = ['Employee ID', 'Name', 'Email', 'Role', 'Department', 'Overall Readiness %', 'Total Assessments Taken', 'Certifications Verified'];
      const rows = mockUsers.map(u => [
        u.id || 'GOI-ISS',
        u.full_name || u.name,
        u.email,
        u.designation || u.role,
        u.department || 'MoSPI',
        u.competency_score ? `${u.competency_score}%` : '78%',
        '8',
        '4'
      ]);
      generateAndDownloadCSV('SakshamAI_Workforce_Competency_Audit.csv', headers, rows);
    } else if (reportType === 'log') {
      const headers = ['Officer Name', 'Programme Name', 'Provider', 'Type', 'Completion Date', 'Status', 'Score'];
      const rows = [
        ['Arjun Sharma', 'Machine Learning Microdata Benchmark', 'iGOT Karmayogi', 'Online Self-Paced', '2024-11-20', 'Completed', '92%'],
        ['Arjun Sharma', 'National Survey Sampling Practice', 'ISI Kolkata / NSSTA', 'Residential Workshop', '2024-09-15', 'Completed', '94%'],
        ['Priya Deshmukh', 'Python Data Wrangling Essentials', 'Swayam', 'Online', '2024-10-10', 'Completed', '88%'],
        ['Dr. Radhika Sen', 'Executive Leadership in Official Statistics', 'LBSNAA', 'In-Person', '2024-08-01', 'Completed', '100%'],
      ];
      generateAndDownloadCSV('SakshamAI_Training_Attendance_Log.csv', headers, rows);
    }

    setDownloadMsg(true);
    setTimeout(() => setDownloadMsg(false), 4000);
  };

  const reports = [
    {
      id: 'audit',
      type: 'audit',
      title: 'Workforce Audit Report',
      description: 'Cadre-wide competency ratings, assessment scores, and readiness distribution across all MoSPI divisions.',
      buttonText: 'Export Audit Data (CSV)',
      icon: Users
    },
    {
      id: 'matrix',
      type: 'matrix',
      title: 'Skill Gap Matrix',
      description: 'Detailed deficit scores categorized by department, officer designation, and urgency priority.',
      buttonText: 'Export Gap Matrix (CSV)',
      icon: Table
    },
    {
      id: 'log',
      type: 'log',
      title: 'Institutional Training Log',
      description: 'Attendance records, iGOT course completions, and NSSTA workshop certifications.',
      buttonText: 'Export Training Log (CSV)',
      icon: Calendar
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
        <h1 className="font-headline text-xl font-bold text-slate-900 dark:text-white">Workforce Reports &amp; Exports</h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Generate, preview, and download competency matrices, skill audits, and training compliance records for official MoSPI cadres.
        </p>
      </div>

      {downloadMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs sm:text-sm flex items-center space-x-2 shadow-sm animate-fadeIn font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span><strong>{reportName}</strong> generated successfully and downloaded to your computer.</span>
        </div>
      )}

      {/* 3 Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reports.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.id} className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-5 flex flex-col justify-between shadow-sm hover:border-blue-500/40 dark:hover:border-ai-cyan/40 transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-cyan-500/10 text-blue-700 dark:text-ai-cyan border border-blue-200 dark:border-cyan-500/20 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-headline text-base font-bold text-slate-900 dark:text-white">{r.title}</h2>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">{r.description}</p>
                </div>
              </div>

              <button
                onClick={() => handleExport(r.type, r.title)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-blue-600 dark:to-cyan-600 text-white font-semibold rounded-xl text-xs transition flex items-center justify-center space-x-2 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{r.buttonText}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
