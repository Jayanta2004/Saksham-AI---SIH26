import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bell, LogOut, Menu, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../common/ThemeToggle';

const routeTitles = {
  '/dashboard': 'Dashboard',
  '/profile': 'My Profile',
  '/skills': 'My Skills',
  '/skill-gap': 'Skill Gap Analysis',
  '/learning-path': 'Learning Path',
  '/courses': 'Courses',
  '/training': 'Training Programs',
  '/assessments': 'Assessments',
  '/ai-assistant': 'AI Assistant',
  '/progress': 'Progress Tracking',
  '/certificates': 'Certificates',
  '/admin/dashboard': 'Admin Dashboard',
  '/admin/users': 'User Management',
  '/admin/competencies': 'Competency Framework',
  '/admin/courses': 'Course Management',
  '/admin/training': 'Training Management',
  '/admin/assessments': 'Assessment Management',
  '/admin/content': 'Content Studio',
  '/admin/analytics': 'Analytics & Insights',
  '/admin/reports': 'Reports',
  '/admin/settings': 'Settings',
};

export default function Header({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (routeTitles[path]) return routeTitles[path];
    for (const [route, title] of Object.entries(routeTitles)) {
      if (path.startsWith(route) && route !== '/') return title;
    }
    const cleanPath = path.split('/').filter(Boolean).pop();
    if (!cleanPath) return 'Dashboard';
    return cleanPath.charAt(0).toUpperCase() + cleanPath.slice(1).replace(/-/g, ' ');
  };

  const initial = (user?.full_name || user?.name || user?.username || user?.email || 'U').charAt(0).toUpperCase();
  const displayName = user?.full_name || user?.name || user?.username || 'User';

  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between shrink-0 transition-colors duration-200">
      {/* Left: Hamburger (mobile) + Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="p-1.5 -ml-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg md:hidden transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-base font-semibold text-slate-800 dark:text-slate-100 truncate">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right: Home link, Theme Toggle, Notifications, Avatar Circle, Logout */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          to="/"
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors hidden sm:flex items-center gap-1.5 text-xs font-medium"
          title="Back to Landing Page"
        >
          <Home className="w-4 h-4" />
          <span className="hidden md:inline">Portal Home</span>
        </Link>

        {/* Dark / Light Theme Toggle Button */}
        <ThemeToggle size="sm" />

        <button
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div
            className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-semibold text-xs flex items-center justify-center shrink-0"
            title={displayName}
          >
            {initial}
          </div>
          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
            title="Log out"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
