import React, { useEffect, useState, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Bell,
  LogOut,
  Menu,
  Home,
  Search,
  ChevronDown,
  UserCheck,
  Shield,
  Languages,
  Check,
  Building2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import OfficerCommandPalette from '../common/OfficerCommandPalette';

const CADRE_ROLES = [
  {
    code: 'sss_jso',
    label: 'JSO (Field Operations)',
    fullDesignation: 'Junior Statistical Officer',
    cadre: 'Subordinate Statistical Service (SSS)',
    department: 'Field Operations Division (FOD)',
    grade: 'Group B (Gazetted)'
  },
  {
    code: 'sss_sso',
    label: 'SSO (Data Quality & Software)',
    fullDesignation: 'Senior Statistical Officer',
    cadre: 'Subordinate Statistical Service (SSS)',
    department: 'Data Quality & Software Wing (DQSW)',
    grade: 'Group B (Gazetted)'
  },
  {
    code: 'iss_ad',
    label: 'Assistant Director (NAD)',
    fullDesignation: 'Assistant Director (JTS)',
    cadre: 'Indian Statistical Service (ISS)',
    department: 'National Accounts Division (NAD)',
    grade: 'Junior Time Scale (JTS)'
  },
  {
    code: 'iss_dd',
    label: 'Deputy Director (ESD)',
    fullDesignation: 'Deputy Director (STS)',
    cadre: 'Indian Statistical Service (ISS)',
    department: 'Economic Statistics Division (ESD)',
    grade: 'Senior Time Scale (STS)'
  },
  {
    code: 'iss_jd',
    label: 'Joint Director (SSD & SDGs)',
    fullDesignation: 'Joint Director (JAG)',
    cadre: 'Indian Statistical Service (ISS)',
    department: 'Social Statistics Division (SSD)',
    grade: 'Junior Administrative Grade (JAG)'
  }
];

export default function Header({ onMenuToggle }) {
  const { user, logout, updateOfficerProfile } = useAuth();
  const { language, setLanguage } = useLanguage();
  const location = useLocation();

  const [showCadreDropdown, setShowCadreDropdown] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [cadreToast, setCadreToast] = useState('');
  const cadreDropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (cadreDropdownRef.current && !cadreDropdownRef.current.contains(e.target)) {
        setShowCadreDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

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

  const handleRoleSwitch = (cadre) => {
    if (updateOfficerProfile) {
      updateOfficerProfile({
        designation: cadre.fullDesignation,
        cadre: cadre.cadre,
        department: cadre.department,
        grade: cadre.grade
      });
    }
    setShowCadreDropdown(false);
    setCadreToast(`Active lens switched to: ${cadre.fullDesignation} (${cadre.department})`);
    setTimeout(() => setCadreToast(''), 4000);
  };

  const initial = (user?.full_name || user?.name || user?.username || user?.email || 'U').charAt(0).toUpperCase();
  const displayName = user?.full_name || user?.name || user?.username || 'Officer';
  const currentDesignation = user?.designation || 'Senior Statistical Officer';
  const currentDept = user?.department || 'Social Statistics Division (SSD)';

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

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Officer Cadre Role Lens Switcher */}
            <div className="relative" ref={cadreDropdownRef}>
              <button
                onClick={() => setShowCadreDropdown(prev => !prev)}
                className="px-2.5 py-1.5 rounded-xl bg-indigo-50/80 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                title="Switch Cadre Role Lens"
              >
                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                <span className="max-w-[130px] sm:max-w-[160px] truncate">{currentDesignation}</span>
                <ChevronDown className="w-3 h-3 text-indigo-600" />
              </button>

              {/* Cadre Dropdown Menu */}
              {showCadreDropdown && (
                <div className="absolute right-0 top-11 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Switch Officer Cadre Lens
                    </span>
                    <span className="text-xs text-slate-600">
                      Adapts dashboard benchmarks and recommended modules to target rank.
                    </span>
                  </div>

                  <div className="space-y-1">
                    {CADRE_ROLES.map((role) => {
                      const isCurrent = currentDesignation === role.fullDesignation;
                      return (
                        <div
                          key={role.code}
                          onClick={() => handleRoleSwitch(role)}
                          className={`p-2 rounded-xl cursor-pointer text-xs transition-colors flex items-start justify-between gap-2 ${
                            isCurrent
                              ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-200'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-slate-900">{role.fullDesignation}</div>
                            <div className="text-[11px] text-slate-500 font-normal">{role.department}</div>
                            <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] bg-slate-100 text-slate-600 font-mono">
                              {role.cadre}
                            </span>
                          </div>
                          {isCurrent && <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Language Switcher (EN | हिन्दी) */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1 transition-colors"
              title="Official Language / राजभाषा"
            >
              <Languages className="w-3.5 h-3.5 text-slate-600" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Officer Avatar & Logout */}
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

        {/* Cadre Switch Feedback Toast Banner */}
        {cadreToast && (
          <div className="bg-indigo-600 text-white text-xs px-4 py-1.5 flex items-center justify-between font-medium shadow-sm animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{cadreToast}</span>
            </div>
            <button onClick={() => setCadreToast('')} className="text-indigo-200 hover:text-white">✕</button>
          </div>
        )}
      </header>

      {/* Global Officer Command Palette Modal */}
      <OfficerCommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
      />
    </>
  );
}
