import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Menu,
  Search,
  LogOut,
  Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import OfficerCommandPalette from '../common/OfficerCommandPalette';

export default function Header({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  // Global Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const initial = (user?.full_name || user?.name || user?.username || user?.email || 'U').charAt(0).toUpperCase();
  const displayName = user?.full_name || user?.name || user?.username || 'Officer';
  const currentDesignation = user?.designation || 'Senior Statistical Officer';

  return (
    <>
      <header className="relative bg-white border-b border-slate-200 z-30">
        {/* Government of India Official Tricolor Accent Strip */}
        <div className="h-1 w-full flex">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#138808]" />
        </div>

        {/* Main Navbar */}
        <div className="h-16 px-4 md:px-6 flex items-center justify-between">
          {/* Left: Mobile Menu Toggle + MoSPI Emblem Identity */}
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

            <div className="hidden sm:flex flex-col">
              <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                Government of India • भारत सरकार
              </span>
              <span className="text-xs font-bold text-slate-900 leading-tight">
                Ministry of Statistics & Programme Implementation (MoSPI)
              </span>
            </div>
          </div>

          {/* Center: Command Palette Trigger */}
          <button
            onClick={() => setShowCommandPalette(true)}
            className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-full text-xs text-slate-600 w-80 transition-all cursor-pointer shadow-2xs group"
          >
            <Search className="w-3.5 h-3.5 text-indigo-600 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="text-slate-500 text-xs w-full text-left truncate">
              Search schedules, CAPI, GVA, DPDPA...
            </span>
            <kbd className="shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white border border-slate-300 text-[10px] font-mono text-slate-600 shadow-xs">
              Ctrl+K
            </kbd>
          </button>

          {/* Right Action Controls: Officer Avatar & Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-900 truncate max-w-[160px]">{displayName}</span>
              <span className="text-[10px] text-slate-500 font-medium truncate max-w-[160px]">{currentDesignation}</span>
            </div>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs"
                title={`${displayName} — ${currentDesignation}`}
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
        </div>
      </header>

      {/* Global Officer Command Palette Modal */}
      <OfficerCommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
      />
    </>
  );
}
