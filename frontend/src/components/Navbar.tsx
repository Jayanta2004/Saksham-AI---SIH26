'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  BarChart3, 
  BookOpen, 
  Award, 
  Shield, 
  Layers, 
  UserCheck, 
  RefreshCw, 
  ChevronDown, 
  Menu, 
  X, 
  Cpu, 
  FileText,
  User
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, demoLogin, logout } = useAuth();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/dashboard', label: 'Learner Dashboard', icon: BarChart3, roles: ['role_learner', 'role_trainer', 'role_sysadmin'] },
    { href: '/assessment/arena', label: 'Assessment Arena', icon: Award, roles: ['role_learner', 'role_trainer', 'role_sysadmin'] },
    { href: '/catalogue', label: 'Course Catalogue', icon: BookOpen, roles: ['role_learner', 'role_trainer', 'role_sysadmin'] },
    { href: '/trainer', label: 'Trainer Studio', icon: FileText, roles: ['role_trainer', 'role_sysadmin'] },
    { href: '/admin/workforce-analytics', label: 'Workforce Analytics', icon: Layers, roles: ['role_sysadmin', 'role_trainer'] },
  ];

  const visibleLinks = navLinks.filter(link => 
    !user || link.roles.includes(user.role)
  );

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 shadow-glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand & Emblem */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-amber-500 p-0.5 shadow-glow-blue flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-400 bg-clip-text text-transparent">
                    SAKSHAM AI
                  </span>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    MoSPI
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                  Official Statistics Skill Intelligence
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {visibleLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side: Sync Badge & Role Persona Switcher */}
          <div className="hidden md:flex items-center gap-4">
            {/* iGOT Sync Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-xs text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium text-[11px]">iGOT / NSSTA Synced</span>
            </div>

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-blue-900/50 hover:border-blue-500/50 text-left transition-all shadow-md"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-500/40 flex items-center justify-center text-amber-400 font-bold text-xs">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white leading-tight">
                    {user?.full_name?.split(',')[0] || 'Official User'}
                  </p>
                  <p className="text-[10px] text-amber-400 font-medium">
                    {user?.role_name || 'Role'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl glass-panel border border-slate-700/80 shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Switch Active Persona (Evaluation Mode)
                    </p>
                  </div>
                  
                  <div className="space-y-1 py-1">
                    <button
                      onClick={() => { demoLogin('learner'); setRoleDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-slate-800/80 transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-white">Arjun Sharma, ISS</p>
                        <p className="text-[11px] text-blue-400">Learner (Senior Statistical Officer)</p>
                      </div>
                      {user?.role === 'role_learner' && <UserCheck className="w-4 h-4 text-emerald-400" />}
                    </button>

                    <button
                      onClick={() => { demoLogin('trainer'); setRoleDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-slate-800/80 transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-white">Dr. Radhika Sen</p>
                        <p className="text-[11px] text-amber-400">Trainer & NSSTA Faculty</p>
                      </div>
                      {user?.role === 'role_trainer' && <UserCheck className="w-4 h-4 text-emerald-400" />}
                    </button>

                    <button
                      onClick={() => { demoLogin('admin'); setRoleDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-slate-800/80 transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-white">Rajesh K. Verma, ISS</p>
                        <p className="text-[11px] text-purple-400">System Admin & MoSPI DDG</p>
                      </div>
                      {user?.role === 'role_sysadmin' && <UserCheck className="w-4 h-4 text-emerald-400" />}
                    </button>
                  </div>

                  <div className="border-t border-slate-800 pt-1 mt-1 flex items-center justify-between px-2">
                    <Link
                      href="/profile"
                      onClick={() => setRoleDropdownOpen(false)}
                      className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1.5 py-1.5"
                    >
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      View Profile
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setRoleDropdownOpen(false)}
                      className="text-[11px] text-rose-400 hover:text-rose-300 py-1.5"
                    >
                      Sign In / SSO
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          {visibleLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
          
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <p className="text-xs uppercase text-slate-400 font-semibold px-2">Quick Switch Persona</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => { demoLogin('learner'); setMobileMenuOpen(false); }}
                className="px-2 py-1.5 rounded-lg bg-slate-800 text-[11px] text-white text-center font-medium"
              >
                Learner
              </button>
              <button
                onClick={() => { demoLogin('trainer'); setMobileMenuOpen(false); }}
                className="px-2 py-1.5 rounded-lg bg-amber-900/40 border border-amber-600/30 text-[11px] text-amber-300 text-center font-medium"
              >
                Trainer
              </button>
              <button
                onClick={() => { demoLogin('admin'); setMobileMenuOpen(false); }}
                className="px-2 py-1.5 rounded-lg bg-purple-900/40 border border-purple-600/30 text-[11px] text-purple-300 text-center font-medium"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
