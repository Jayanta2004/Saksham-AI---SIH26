import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bell, LogOut, Menu, Home, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../common/ThemeToggle';

const routeTitles = {
  '/dashboard': 'Dashboard & Competency Radar',
  '/profile': 'My Officer Profile',
  '/skills': 'Official Statistical Skills',
  '/skill-gap': 'Skill Gap Analysis & Diagnostics',
  '/learning-path': 'Personalized Learning Pathways',
  '/courses': 'iGOT Karmayogi Catalog',
  '/training': 'NSSTA Residential Workshops',
  '/assessments': 'AI Diagnostic Assessments',
  '/ai-assistant': 'Statistical AI Copilot',
  '/progress': 'Progress Tracking & Analytics',
  '/certificates': 'Certified Competencies',
  '/admin/dashboard': 'Workforce Intelligence Dashboard',
  '/admin/users': 'Statistical Officer Directory',
  '/admin/competencies': 'MoSPI Competency Framework',
  '/admin/courses': 'iGOT Course Management',
  '/admin/training': 'NSSTA Training Calendar',
  '/admin/assessments': 'Diagnostic Assessment Studio',
  '/admin/content': 'RAG Content Studio (Manual Ingestion)',
  '/admin/analytics': 'Division Heatmaps & Predictive Analytics',
  '/admin/reports': 'Executive Cadre Reports',
  '/admin/settings': 'System & API Settings',
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
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between shrink-0 transition-colors duration-200 z-30">
      
      {/* Left: Hamburger + Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="p-1.5 -ml-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg md:hidden transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="font-headline text-base sm:text-lg font-bold text-slate-900 truncate">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Center: Search pill with shortcut */}
      <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-xs text-slate-600 w-72">
        <Search className="w-3.5 h-3.5 text-blue-600" />
        <input
          type="text"
          placeholder="Search competencies, manuals..."
          className="bg-transparent border-none outline-none text-xs text-slate-900 placeholder:text-slate-400 w-full"
        />
        <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-[10px] font-mono text-slate-600">⌘K</kbd>
      </div>

      {/* Right Actions: Home, ThemeToggle, Live Pill, Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          to="/"
          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors hidden sm:flex items-center gap-1.5 text-xs font-medium"
          title="Back to Landing Page"
        >
          <Home className="w-4 h-4" />
          <span className="hidden md:inline">Portal Home</span>
        </Link>

        {/* Live Status Badge */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>MoSPI Live</span>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle size="sm" />

        <button
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm"
            title={displayName}
          >
            {initial}
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
