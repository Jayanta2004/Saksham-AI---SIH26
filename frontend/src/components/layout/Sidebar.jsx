import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Target,
  TrendingUp,
  Route,
  BookOpen,
  GraduationCap,
  CheckSquare,
  Bot,
  BarChart2,
  Award,
  Users,
  Layers,
  FileText,
  Settings,
  LogOut,
  X,
  Brain
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const learnerNav = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'My Profile', path: '/profile', icon: User },
  { name: 'My Skills', path: '/skills', icon: Target },
  { name: 'Skill Gap Radar', path: '/skill-gap', icon: TrendingUp },
  { name: 'Learning Pathways', path: '/learning-path', icon: Route },
  { name: 'iGOT Courses', path: '/courses', icon: BookOpen },
  { name: 'NSSTA Workshops', path: '/training', icon: GraduationCap },
  { name: 'AI Assessments', path: '/assessments', icon: CheckSquare },
  { name: 'Statistical Copilot', path: '/ai-assistant', icon: Bot },
  { name: 'Progress & Analytics', path: '/progress', icon: BarChart2 },
  { name: 'Certificates', path: '/certificates', icon: Award },
];

const adminNav = [
  { name: 'Workforce Intel', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'User Management', path: '/admin/users', icon: Users },
  { name: 'Competency Matrix', path: '/admin/competencies', icon: Target },
  { name: 'Course Catalog', path: '/admin/courses', icon: BookOpen },
  { name: 'Academy Training', path: '/admin/training', icon: GraduationCap },
  { name: 'Assessment Studio', path: '/admin/assessments', icon: CheckSquare },
  { name: 'RAG Content Studio', path: '/admin/content', icon: Layers },
  { name: 'Division Analytics', path: '/admin/analytics', icon: BarChart2 },
  { name: 'Reports', path: '/admin/reports', icon: FileText },
  { name: 'System Settings', path: '/admin/settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();

  const userRole = (user?.role || user?.role_name || '').toLowerCase();
  const isAdmin =
    userRole === 'role_sysadmin' ||
    userRole === 'role_trainer' ||
    userRole === 'admin' ||
    userRole === 'sysadmin' ||
    userRole === 'trainer' ||
    userRole === 'system admin';

  const navItems = isAdmin ? adminNav : learnerNav;
  const initial = (user?.full_name || user?.name || user?.username || user?.email || 'U')
    .charAt(0)
    .toUpperCase();
  const displayName = user?.full_name || user?.name || user?.username || 'User';
  const designation = user?.designation || (isAdmin ? 'Director General (MoSPI)' : 'Senior Statistical Officer');

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-surface-obsidian/95 backdrop-blur-2xl text-slate-700 dark:text-on-surface flex flex-col border-r border-slate-200 dark:border-glass-border shadow-xl transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200 dark:border-glass-border shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-ai-cyan to-ai-purple p-0.5 shadow-md shadow-ai-cyan/20">
            <div className="w-full h-full bg-white dark:bg-surface-obsidian rounded-[9px] flex items-center justify-center">
              <Brain className="w-4 h-4 text-blue-600 dark:text-ai-cyan" />
            </div>
          </div>
          <span className="font-headline font-bold text-base tracking-tight text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-ai-cyan dark:to-ai-purple">
            Saksham AI
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white md:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Officer Rank Insignia Card */}
      <div className="p-4 border-b border-slate-200 dark:border-glass-border flex items-center gap-3 bg-slate-50/50 dark:bg-white/[0.02]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center shadow-md shrink-0">
          {initial}
        </div>
        <div className="min-w-0">
          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{displayName}</div>
          <div className="text-[10px] text-slate-500 dark:text-on-surface-variant truncate">{designation}</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-50 dark:bg-white/5 text-blue-600 dark:text-ai-cyan border-l-2 border-blue-600 dark:border-ai-cyan shadow-sm font-bold'
                    : 'text-slate-600 dark:text-on-surface-variant hover:text-slate-900 dark:hover:text-on-surface hover:bg-slate-100 dark:hover:bg-white/[0.03]'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Profile / Logout */}
      <div className="p-3 border-t border-slate-200 dark:border-glass-border shrink-0">
        <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl glass-card">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-success-emerald animate-pulse"></span>
            <span className="text-[11px] font-medium text-slate-600 dark:text-on-surface-variant truncate">
              MoSPI Live Sync
            </span>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
