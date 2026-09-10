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
  KeyRound,
  X,
} from 'lucide-react';
import ChangePasswordModal from '@/components/auth/ChangePasswordModal';

interface Props {
  activeView: AdminView;
  onNavigate: (view: AdminView) => void;
  onLogout: () => void;
}

export default function AdminSidebar({ activeView, onNavigate, onLogout }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
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

  const handleNavClick = (view: AdminView) => {
    setMobileOpen(false);
    onNavigate(view);
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Sidebar Brand Header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-slate-800/80">
          {!collapsed ? (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm shadow-md flex-shrink-0">
                AD
              </div>
              <div className="min-w-0">
                <div className="font-extrabold text-white text-sm leading-tight truncate tracking-tight">
                  AppDevClub
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
            className="hidden lg:block p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors flex-shrink-0 cursor-pointer"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors flex-shrink-0 cursor-pointer"
            aria-label="Close Admin Navigation"
          >
            <X size={18} />
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
                onClick={() => handleNavClick('dashboard')}
                title={collapsed ? 'Dashboard' : undefined}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
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
                onClick={() => handleNavClick('analytics')}
                title={collapsed ? 'Analytics' : undefined}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
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

              {/* Admin Access Approvals button EXCLUSIVELY for Super Admin */}
              {user?.role === 'SUPER_ADMIN' && (
                <button
                  onClick={() => handleNavClick('approvals')}
                  title={collapsed ? 'Manage Admins' : undefined}
                  className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
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
                      <span>Manage Admins</span>
                      <span className="bg-indigo-500/30 text-indigo-300 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">
                        SUPER
                      </span>
                    </div>
                  )}
                </button>
              )}
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
                onClick={() => handleNavClick('events')}
                title={collapsed ? 'Events' : undefined}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
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
                onClick={() => handleNavClick('registrations')}
                title={collapsed ? 'Registrations' : undefined}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
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
                onClick={() => alert('AppDevClub Admin Settings v2.4.0')}
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
          onClick={() => setIsChangePasswordOpen(true)}
          title={collapsed ? 'Change Password' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-sky-400 hover:bg-sky-500/10 hover:text-sky-300 transition-colors mb-1 cursor-pointer ${
            collapsed ? 'justify-center px-2' : ''
          }`}
        >
          <KeyRound size={17} className="flex-shrink-0 text-sky-400" />
          {!collapsed && <span>Change Password</span>}
        </button>

        <button
          onClick={onLogout}
          title={collapsed ? 'Logout' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors cursor-pointer ${
            collapsed ? 'justify-center px-2' : ''
          }`}
        >
          <LogOut size={17} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );

  return (
    <>
      {/* Mobile Top Header Navigation Bar (Visible < lg) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-slate-950 border-b border-slate-800 text-white px-4 flex items-center justify-between z-40">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
            aria-label="Open Admin Menu"
          >
            <div className="space-y-1">
              <span className="block w-5 h-0.5 bg-white rounded" />
              <span className="block w-5 h-0.5 bg-white rounded" />
              <span className="block w-3 h-0.5 bg-sky-400 rounded" />
            </div>
          </button>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-white">AppDevClub</span>
            <span className="bg-sky-500/20 text-sky-400 text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase">
              Admin
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium truncate max-w-[120px] hidden xs:inline">
            {user?.name || 'Admin'}
          </span>
          <button
            onClick={onLogout}
            className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-bold transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-[270px] max-w-[80vw] bg-slate-950 text-slate-300 shadow-2xl flex flex-col justify-between h-full z-10 animate-slideRight border-r border-slate-800">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar (Visible ≥ lg) */}
      <aside
        className={`hidden lg:flex bg-slate-950 text-slate-300 flex-col justify-between transition-all duration-300 ease-in-out flex-shrink-0 border-r border-slate-800/80 z-30 ${
          collapsed ? 'w-16' : 'w-[230px]'
        }`}
        style={{ minHeight: '100vh' }}
      >
        {sidebarContent}
      </aside>
    </>
  );
}