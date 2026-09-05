'use client';
import React, { useState, useEffect } from 'react';
import AppLogo from '@/components/ui/AppLogo';
import Link from 'next/link';
import type { AdminView } from '../page';
import {
  LayoutDashboard,
  Calendar,
  BarChart2,
  ClipboardList,
  Trophy,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Globe,
  Settings,
  ShieldCheck,
  User,
  Home,
  UserCheck,
} from 'lucide-react';

interface Props {
  activeView: AdminView;
  onNavigate: (view: AdminView) => void;
  onLogout: () => void;
}

export default function AdminSidebar({ activeView, onNavigate, onLogout }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string; role?: string } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const uStr = localStorage.getItem('adhub_admin_user');
      if (uStr) {
        try {
          setUser(JSON.parse(uStr));
        } catch (e) {}
      }
    }
  }, []);

  return (
    <aside
      className={`bg-slate-950 text-slate-300 flex flex-col justify-between transition-all duration-300 ease-in-out flex-shrink-0 border-r border-slate-800/80 z-30 ${
        collapsed ? 'w-16' : 'w-[230px]'
      }`}
      style={{ minHeight: '100vh' }}
    >
      <div>
        {/* Sidebar Brand Header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-slate-800/80">
          {!collapsed ? (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm shadow-md">
                AD
              </div>
              <div className="min-w-0">
                <div className="font-extrabold text-white text-sm leading-tight truncate tracking-tight">
                  AppDevHub
                </div>
                <div className="text-[10px] font-mono text-sky-400 font-bold truncate">
                  Admin Portal
                </div>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm mx-auto shadow-md">
              AD
            </div>
          )}

          <button
            onClick={() => setCollapsed(v => !v)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors flex-shrink-0"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Section Navigation */}
        <nav className="p-3 space-y-6">
          {/* Group 1: OVERVIEW */}
          <div>
            {!collapsed && (
              <div className="px-3 mb-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                OVERVIEW
              </div>
            )}
            <div className="space-y-1">
              <button
                onClick={() => onNavigate('dashboard')}
                title={collapsed ? 'Dashboard' : undefined}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  activeView === 'dashboard'
                    ? 'bg-blue-600/15 text-sky-400 font-bold border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                } ${collapsed ? 'justify-center px-2' : ''}`}
              >
                {activeView === 'dashboard' && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-r-md" />
                )}
                <LayoutDashboard size={17} className={activeView === 'dashboard' ? 'text-sky-400' : 'text-slate-400'} />
                {!collapsed && <span>Dashboard</span>}
              </button>

              <button
                onClick={() => onNavigate('analytics')}
                title={collapsed ? 'Analytics' : undefined}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  activeView === 'analytics'
                    ? 'bg-blue-600/15 text-sky-400 font-bold border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                } ${collapsed ? 'justify-center px-2' : ''}`}
              >
                {activeView === 'analytics' && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-r-md" />
                )}
                <BarChart2 size={17} className={activeView === 'analytics' ? 'text-sky-400' : 'text-slate-400'} />
                {!collapsed && <span>Analytics</span>}
              </button>

              {/* Admin Access Approvals button for Super Admin / Admin */}
              <button
                onClick={() => onNavigate('approvals')}
                title={collapsed ? 'Admin Approvals' : undefined}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  activeView === 'approvals'
                    ? 'bg-indigo-600/20 text-indigo-400 font-extrabold border border-indigo-500/40 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                } ${collapsed ? 'justify-center px-2' : ''}`}
              >
                {activeView === 'approvals' && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-500 rounded-r-md" />
                )}
                <UserCheck size={17} className={activeView === 'approvals' ? 'text-indigo-400' : 'text-indigo-400/80'} />
                {!collapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>Admin Approvals</span>
                    {user?.role === 'SUPER_ADMIN' && (
                      <span className="bg-indigo-500/30 text-indigo-300 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">
                        SUPER
                      </span>
                    )}
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Group 2: EVENT MANAGEMENT */}
          <div>
            {!collapsed && (
              <div className="px-3 mb-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                EVENT MANAGEMENT
              </div>
            )}
            <div className="space-y-1">
              <button
                onClick={() => onNavigate('events')}
                title={collapsed ? 'Events' : undefined}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  activeView === 'events'
                    ? 'bg-blue-600/15 text-sky-400 font-bold border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                } ${collapsed ? 'justify-center px-2' : ''}`}
              >
                {activeView === 'events' && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-r-md" />
                )}
                <Calendar size={17} className={activeView === 'events' ? 'text-sky-400' : 'text-slate-400'} />
                {!collapsed && <span>Events</span>}
              </button>

              <button
                onClick={() => onNavigate('registrations')}
                title={collapsed ? 'Registrations' : undefined}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  activeView === 'registrations'
                    ? 'bg-blue-600/15 text-sky-400 font-bold border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                } ${collapsed ? 'justify-center px-2' : ''}`}
              >
                {activeView === 'registrations' && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-r-md" />
                )}
                <ClipboardList size={17} className={activeView === 'registrations' ? 'text-sky-400' : 'text-slate-400'} />
                {!collapsed && <span>Registrations</span>}
              </button>

              <button
                onClick={() => onNavigate('leaderboard')}
                title={collapsed ? 'Leaderboard' : undefined}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  activeView === 'leaderboard'
                    ? 'bg-blue-600/15 text-sky-400 font-bold border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                } ${collapsed ? 'justify-center px-2' : ''}`}
              >
                {activeView === 'leaderboard' && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-r-md" />
                )}
                <Trophy size={17} className={activeView === 'leaderboard' ? 'text-amber-400' : 'text-slate-400'} />
                {!collapsed && <span>Leaderboards</span>}
              </button>
            </div>
          </div>

          {/* Group 3: PLATFORM */}
          <div>
            {!collapsed && (
              <div className="px-3 mb-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                PLATFORM
              </div>
            )}
            <div className="space-y-1">
              <Link
                href="/"
                title={collapsed ? 'Home Page' : undefined}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-sky-400 bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600 hover:text-white transition-all ${
                  collapsed ? 'justify-center px-2' : ''
                }`}
              >
                <Home size={17} />
                {!collapsed && <span>Home Page</span>}
              </Link>

              <Link
                href="/"
                title={collapsed ? 'Public Site' : undefined}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-all ${
                  collapsed ? 'justify-center px-2' : ''
                }`}
              >
                <Globe size={17} className="text-slate-400" />
                {!collapsed && <span>Public Site</span>}
              </Link>

              <button
                onClick={() => alert('AppDevHub Admin Settings v2.4.0')}
                title={collapsed ? 'Settings' : undefined}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-all ${
                  collapsed ? 'justify-center px-2' : ''
                }`}
              >
                <Settings size={17} className="text-slate-400" />
                {!collapsed && <span>Settings</span>}
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Sidebar Footer Profile & Logout */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
        {!collapsed && (
          <div className="px-3 py-2 mb-2 bg-slate-900/80 rounded-xl border border-slate-800/80 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600/30 text-sky-400 flex items-center justify-center font-bold text-xs">
              <ShieldCheck size={14} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {user?.name || (user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Administrator')}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {user?.email || 'admin@cse.vignan.ac.in'}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onLogout}
          title={collapsed ? 'Logout' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors ${
            collapsed ? 'justify-center px-2' : ''
          }`}
        >
          <LogOut size={17} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}