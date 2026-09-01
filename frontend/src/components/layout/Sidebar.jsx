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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const learnerNav = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'My Profile', path: '/profile', icon: User },
  { name: 'My Skills', path: '/skills', icon: Target },
  { name: 'Skill Gap', path: '/skill-gap', icon: TrendingUp },
  { name: 'Learning Path', path: '/learning-path', icon: Route },
  { name: 'Courses', path: '/courses', icon: BookOpen },
  { name: 'Training', path: '/training', icon: GraduationCap },
  { name: 'Assessments', path: '/assessments', icon: CheckSquare },
  { name: 'AI Assistant', path: '/ai-assistant', icon: Bot },
  { name: 'Progress', path: '/progress', icon: BarChart2 },
  { name: 'Certificates', path: '/certificates', icon: Award },
];

const adminNav = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Competencies', path: '/admin/competencies', icon: Target },
  { name: 'Courses', path: '/admin/courses', icon: BookOpen },
  { name: 'Training', path: '/admin/training', icon: GraduationCap },
  { name: 'Assessments', path: '/admin/assessments', icon: CheckSquare },
  { name: 'Content Studio', path: '/admin/content', icon: Layers },
  { name: 'Analytics', path: '/admin/analytics', icon: BarChart2 },
  { name: 'Reports', path: '/admin/reports', icon: FileText },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
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

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-60 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
        <div className="flex items-center">
          <span className="font-bold text-white text-base tracking-tight">
            SAKSHAM AI
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Profile */}
      <div className="p-3 border-t border-slate-800 shrink-0">
        <div className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg bg-slate-800/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 font-semibold text-xs flex items-center justify-center shrink-0 border border-blue-500/20">
              {initial}
            </div>
            <p className="text-xs font-medium text-slate-200 truncate">
              {displayName}
            </p>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors shrink-0"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
