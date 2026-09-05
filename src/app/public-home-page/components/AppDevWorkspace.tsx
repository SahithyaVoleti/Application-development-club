'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import {
  Search,
  Bell,
  HelpCircle,
  Settings,
  Plus,
  FolderGit2,
  Rocket,
  Layers,
  Cpu,
  Code2,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  Zap,
  Terminal,
  Activity,
  Database,
  ShieldCheck,
  LayoutDashboard,
  Server,
  ArrowUpRight,
  Calendar,
  Users,
  Play,
  RotateCcw,
  MoreVertical,
  Trash2,
  Copy,
  Edit3,
  Home,
  Eye,
  UserCheck,
  User,
  LogIn,
  LogOut,
} from 'lucide-react';
import {
  WORKSPACE_PROJECTS,
  DEPLOYMENT_LOGS,
  APP_TEMPLATES,
  RECENT_ACTIVITIES,
  TECH_STACK_ITEMS,
  MOCK_USERS,
  type WorkspaceProject,
  type DeploymentLog,
  type AppTemplate,
  type UserProfile,
} from '@/lib/workspaceData';
import { MOCK_EVENTS, MOCK_REGISTRATIONS, type Event, type Registration } from '@/lib/mockData';
import CommandPaletteModal from './CommandPaletteModal';
import NewAppModal from './NewAppModal';
import CodeWorkspaceModal from './CodeWorkspaceModal';
import DeploymentLogsModal from './DeploymentLogsModal';
import AIAssistantModal from './AIAssistantModal';
import ApplicationDeleteModal from './ApplicationDeleteModal';
import ProjectDetailsModal from './ProjectDetailsModal';
import UserLoginModal from './UserLoginModal';

import { useScrollReveal } from '@/hooks/useScrollReveal';

interface Props {
  onSwitchToPublicEvents?: () => void;
  initialUser?: UserProfile;
}

export default function AppDevWorkspace({ onSwitchToPublicEvents, initialUser }: Props) {
  useScrollReveal();

  // Active navigation & layout tab
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // User Session / Auth State
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    if (initialUser) return initialUser;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('adhub_active_user');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return MOCK_USERS[0];
  });

  React.useEffect(() => {
    if (initialUser) {
      setCurrentUser(initialUser);
    }
  }, [initialUser]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adhub_active_user');
      localStorage.removeItem('adhub_token');
    }
    toast.success('Logged out of workspace session');
    if (onSwitchToPublicEvents) {
      onSwitchToPublicEvents();
    } else {
      window.location.href = '/';
    }
  };

  // Projects State & Filtering
  const [projectScopeTab, setProjectScopeTab] = useState<'my' | 'all'>('my');
  const [selectedProjectDetails, setSelectedProjectDetails] = useState<WorkspaceProject | null>(null);

  const [projects, setProjects] = useState<WorkspaceProject[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('adhub_workspace_projects');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // fallback
        }
      }
    }
    return WORKSPACE_PROJECTS;
  });

  const [selectedTechFilter, setSelectedTechFilter] = useState<string>('All');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingProject, setDeletingProject] = useState<WorkspaceProject | null>(null);

  // Modals state
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [newAppModalMode, setNewAppModalMode] = useState<'create' | 'import' | 'template' | null>(null);
  const [selectedTemplateForModal, setSelectedTemplateForModal] = useState<AppTemplate | null>(null);
  const [isCodeWorkspaceOpen, setIsCodeWorkspaceOpen] = useState(false);
  const [selectedDeployLog, setSelectedDeployLog] = useState<DeploymentLog | null>(null);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Registered Events State
  const [userRegistrations, setUserRegistrations] = useState<any[]>([]);

  React.useEffect(() => {
    const loadRegistrations = () => {
      let localSaved: any[] = [];
      if (typeof window !== 'undefined') {
        try {
          localSaved = JSON.parse(localStorage.getItem('adhub_user_registrations') || '[]');
        } catch (e) {}
      }

      setUserRegistrations(localSaved);
    };

    loadRegistrations();
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', loadRegistrations);
      return () => window.removeEventListener('focus', loadRegistrations);
    }
  }, []);

  // Sync projects to localStorage on change
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('adhub_workspace_projects', JSON.stringify(projects));
    }
  }, [projects]);

  // Close action menu on click outside
  React.useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleConfirmDelete = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  // Filter projects by user scope, tech filter, or search query
  const filteredProjects = projects.filter(p => {
    // User Scope Filter ("My Projects" vs "All Projects")
    const matchesUserScope =
      projectScopeTab === 'all' ||
      p.authorId === currentUser.id ||
      p.authorName?.toLowerCase() === currentUser.name.toLowerCase();

    // Search Query Matching
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.authorName && p.authorName.toLowerCase().includes(searchQuery.toLowerCase()));

    // Tech Filter Matching
    const matchesTech =
      selectedTechFilter === 'All' || p.techStack.includes(selectedTechFilter);

    return matchesUserScope && matchesSearch && matchesTech;
  });

  const myProjectsCount = projects.filter(
    p => p.authorId === currentUser.id || p.authorName?.toLowerCase() === currentUser.name.toLowerCase()
  ).length;

  const handleCreateNewProject = (newProj: WorkspaceProject) => {
    const enrichedProject: WorkspaceProject = {
      ...newProj,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorEmail: currentUser.email,
      features: newProj.features || [
        'Initial application scaffolding setup',
        'Configured environment variables and dependencies',
        'Integrated layout and responsive interface'
      ]
    };
    setProjects(prev => [enrichedProject, ...prev]);
    toast.success(`Project "${newProj.name}" created under ${currentUser.name}`);
  };

  const handleCommandSelect = (action: string, payload?: any) => {
    if (action === 'create-app') setNewAppModalMode('create');
    else if (action === 'use-template') setNewAppModalMode('template');
    else if (action === 'open-ide') setIsCodeWorkspaceOpen(true);
    else if (action === 'ai-assistant') setIsAIAssistantOpen(true);
    else if (action === 'deploy-center') {
      const el = document.querySelector('#deployment-center-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'public-events') {
      if (onSwitchToPublicEvents) onSwitchToPublicEvents();
      else {
        const el = document.querySelector('#upcoming-events-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (action === 'view-proj' && payload) {
      setSelectedProjectDetails(payload);
    } else if (action === 'use-tpl' && payload) {
      setSelectedTemplateForModal(payload);
      setNewAppModalMode('template');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col">
      {/* 1. TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left Brand & Sidebar Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(prev => !prev)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Toggle Sidebar"
            >
              <Menu size={18} />
            </button>

            <div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => {
                if (onSwitchToPublicEvents) onSwitchToPublicEvents();
                else window.location.href = '/#home';
              }}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                <Code2 size={20} />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-base tracking-tight leading-none">
                    Application Development Hub
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200 px-1.5 py-0.5 rounded">
                    v2.4.0
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Unified Developer Workspace & OS</span>
              </div>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => {
                if (onSwitchToPublicEvents) onSwitchToPublicEvents();
                else window.location.href = '/#home';
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-xs transition-colors shadow-2xs cursor-pointer mr-1"
              title="Return to Public Landing Page"
            >
              <Home size={13} />
              <span>Home</span>
            </button>

            {[
              { id: 'Dashboard', label: 'Dashboard' },
              { id: 'Registered Events', label: 'My Registered Events' },
              { id: 'Analytics', label: 'Analytics' },
            ].map(tab => (
              <button
                key={`nav-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-2xs font-bold border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right Action Icons, Search & User Auth Switcher */}
          <div className="flex items-center gap-2.5">
            {/* Global Search Input Trigger (Ctrl + K) */}
            <button
              onClick={() => setIsCommandOpen(true)}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/70 text-slate-500 hover:text-slate-800 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium transition-all"
            >
              <Search size={14} className="text-slate-400" />
              <span className="hidden md:inline">Search workspace...</span>
              <kbd className="text-[10px] font-mono bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-500 shadow-2xs">
                Ctrl K
              </kbd>
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(prev => !prev)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
                title="Notifications"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-500 ring-2 ring-white" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-xs space-y-3 animate-scaleIn">
                  <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-100 pb-2">
                    <span>Recent Notifications</span>
                    <span className="text-[10px] text-sky-600 font-semibold cursor-pointer">Mark all read</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 rounded-lg bg-sky-50/60 border border-sky-100">
                      <div className="font-bold text-sky-900">AI Interview Platform Deployed</div>
                      <div className="text-[11px] text-sky-700">Production build #482 finished cleanly (38s).</div>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                      <div className="font-bold text-emerald-900">API Gateway Healthy</div>
                      <div className="text-[11px] text-emerald-700">All 32 microservices responding at 184ms.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Help / AI Button */}
            <button
              onClick={() => setIsAIAssistantOpen(true)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="AI Assistant & Help"
            >
              <HelpCircle size={18} />
            </button>

            {/* User Profile Info & Logout Button */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                  {currentUser.avatarInitials}
                </div>
                <div className="hidden xl:block text-left leading-tight">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    {currentUser.name} <UserCheck size={12} className="text-emerald-500" />
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">{currentUser.role}</div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 font-extrabold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Logout from Session"
              >
                <LogOut size={14} className="text-rose-600" />
                <span>Logout</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* 14. COLLAPSIBLE WORKSPACE SIDEBAR (Cleaned up as requested) */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
          } transition-all duration-300 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-30`}
        >
          <div className="p-4 space-y-6 flex-1 overflow-y-auto">
            {/* WORKSPACE GROUP */}
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
                WORKSPACE
              </div>
              <div className="space-y-1">
                {[
                  { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
                  { id: 'Registered Events', label: 'My Registered Events', icon: Calendar },
                ].map(item => (
                  <button
                    key={`side-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === item.id
                        ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200/60 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <item.icon size={16} className={activeTab === item.id ? 'text-sky-600' : 'text-slate-400'} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* DEVELOPMENT GROUP */}
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
                DEVELOPMENT
              </div>
              <div className="space-y-1">
                {[
                  { id: 'Code Editor', label: 'Code Editor IDE', icon: Code2, action: () => setIsCodeWorkspaceOpen(true) },
                ].map(item => (
                  <button
                    key={`side-${item.id}`}
                    onClick={() => {
                      if (item.action) item.action();
                      else setActiveTab(item.id);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === item.id
                        ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200/60 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <item.icon size={16} className={activeTab === item.id ? 'text-sky-600' : 'text-slate-400'} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* TOOLS GROUP */}
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
                TOOLS
              </div>
              <div className="space-y-1">
                {[
                  { id: 'AI Assistant', label: 'AI Assistant', icon: Sparkles, action: () => setIsAIAssistantOpen(true) },
                  { id: 'Analytics', label: 'Analytics', icon: TrendingUp },
                ].map(item => (
                  <button
                    key={`side-${item.id}`}
                    onClick={() => {
                      if (item.action) item.action();
                      else setActiveTab(item.id);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === item.id
                        ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200/60 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <item.icon size={16} className={activeTab === item.id ? 'text-sky-600' : 'text-slate-400'} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* PUBLIC EVENTS PORTAL LINK */}
            <div className="pt-2">
              <button
                onClick={() => {
                  if (onSwitchToPublicEvents) onSwitchToPublicEvents();
                  else {
                    const el = document.querySelector('#upcoming-events-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-200 text-sky-800 text-xs font-bold hover:bg-sky-100/60 transition-all"
              >
                <span className="flex items-center gap-2">
                  <Calendar size={15} className="text-sky-600" /> CSE Events Portal
                </span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Sidebar Bottom Profile & Settings */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <LogOut size={15} className="text-rose-600" /> Logout Session
              </span>
              <ChevronRight size={13} className="text-rose-400" />
            </button>

            <Link
              href="/admin-dashboard"
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-indigo-600" /> Admin Portal
              </span>
              <ChevronRight size={13} className="text-slate-400" />
            </Link>
          </div>
        </aside>

        {/* MAIN WORKSPACE CANVAS AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
          
          {/* 2. HERO / WELCOME SECTION */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-blue-500/5 border border-sky-200/80 p-6 sm:p-8 shadow-2xs">
            <div className="max-w-3xl relative z-10">
              <div className="inline-flex items-center gap-2 bg-sky-100/80 border border-sky-300/60 text-sky-800 text-xs font-bold px-3 py-1 rounded-full mb-3 shadow-2xs">
                <Sparkles size={13} className="text-sky-600" /> Logged In User Workspace
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
                Welcome back, {currentUser.name} 👋
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                Manage your specific projects, inspect technical accomplishments, and deploy applications.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setNewAppModalMode('create')}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl btn-hover-premium shadow-md shadow-sky-300 cursor-pointer"
                >
                  <Plus size={16} />
                  Create New Project
                </button>

                <button
                  onClick={() => {
                    setProjectScopeTab('my');
                    const el = document.querySelector('#projects-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl btn-hover-premium shadow-2xs cursor-pointer"
                >
                  <User size={16} className="text-sky-600" />
                  View My Projects ({myProjectsCount})
                </button>
              </div>
            </div>
          </div>



          {/* 6. DEVELOPMENT STATISTICS SECTION */}
          {/* 6. REAL STUDENT DASHBOARD STATISTICS SECTION */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Events Registered', value: userRegistrations.length.toString(), trend: 'Confirmed event passes', icon: Calendar, color: 'text-sky-600 bg-sky-50' },
              { label: 'Upcoming Events', value: userRegistrations.filter(r => !r.eventDate || new Date(r.eventDate) >= new Date()).length.toString(), trend: 'Scheduled on calendar', icon: Clock, color: 'text-blue-600 bg-blue-50' },
              { label: 'Events Attended', value: userRegistrations.filter(r => r.attendanceStatus === 'present').length.toString(), trend: 'Verified attendance', icon: UserCheck, color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Certificates', value: userRegistrations.filter(r => r.attendanceStatus === 'present').length.toString(), trend: 'Unlocked credentials', icon: ShieldCheck, color: 'text-indigo-600 bg-indigo-50' },
            ].map(stat => (
              <div key={`stat-${stat.label}`} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-tabular">{stat.value}</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-1">{stat.trend}</div>
                </div>
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon size={18} />
                </div>
              </div>
            ))}
          </div>

          {/* 6. MY REGISTERED EVENTS SECTION */}
          <div id="registered-events-section" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold">
                  <Calendar size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">My Registered Events</h3>
                    <span className="text-xs font-mono font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full border border-sky-200">
                      {userRegistrations.length} Registered
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Your confirmed event passes, registration IDs, and live event schedules</p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (onSwitchToPublicEvents) onSwitchToPublicEvents();
                  else window.location.href = '/#events';
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Plus size={14} />
                <span>Register for More Events</span>
              </button>
            </div>

            {userRegistrations.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center shadow-2xs">
                <Calendar size={36} className="text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800 mb-1">No Event Registrations Yet</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                  Once you register for campus hackathons, workshops, or coding contests, your registered events and entry passes will appear here.
                </p>
                <button
                  onClick={() => {
                    if (onSwitchToPublicEvents) onSwitchToPublicEvents();
                    else window.location.href = '/#events';
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Explore & Register Events
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {userRegistrations.map(reg => (
                  <div
                    key={`reg-card-${reg.id || reg.registrationId}`}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between group hover:border-sky-300 hover:shadow-md transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200 inline-block mb-1.5">
                            {reg.eventCategory}
                          </span>
                          <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                            {reg.eventTitle}
                          </h4>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex-shrink-0">
                          ✓ CONFIRMED
                        </span>
                      </div>

                      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between text-xs">
                        <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">Pass ID:</span>
                        <span className="font-mono font-extrabold text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {reg.registrationId}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={13} className="text-sky-600 flex-shrink-0" />
                          <span className="font-semibold">{reg.eventDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={13} className="text-sky-600 flex-shrink-0" />
                          <span>{reg.eventTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-100">
                      <button
                        onClick={() => {
                          if (onSwitchToPublicEvents) onSwitchToPublicEvents();
                          else window.location.href = `/#${reg.eventId}`;
                        }}
                        className="w-full py-2 bg-slate-100 hover:bg-sky-600 text-slate-700 hover:text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>View Event Details</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. PROJECTS / APPLICATIONS SECTION */}
          <div id="projects-section" className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Projects Showcase</h3>
                  <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full border border-sky-200">
                    Logged in as: {currentUser.name}
                  </span>
                </div>
                <p className="text-xs text-slate-500">View particular projects you developed or explore workspace projects</p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                {/* User Scope Tabs: My Projects vs All Projects */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
                  <button
                    onClick={() => setProjectScopeTab('my')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      projectScopeTab === 'my'
                        ? 'bg-white text-slate-900 font-extrabold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <User size={13} className={projectScopeTab === 'my' ? 'text-sky-600' : 'text-slate-400'} />
                    My Projects ({myProjectsCount})
                  </button>
                  <button
                    onClick={() => setProjectScopeTab('all')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      projectScopeTab === 'all'
                        ? 'bg-white text-slate-900 font-extrabold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FolderGit2 size={13} className={projectScopeTab === 'all' ? 'text-indigo-600' : 'text-slate-400'} />
                    All Projects ({projects.length})
                  </button>
                </div>

                {/* Tech Stack Filter Dropdown */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
                  {['All', 'React', 'Next.js', 'FastAPI'].map(tech => (
                    <button
                      key={`filter-${tech}`}
                      onClick={() => setSelectedTechFilter(tech)}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        selectedTechFilter === tech
                          ? 'bg-white text-slate-900 font-bold shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setNewAppModalMode('create')}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus size={14} /> New Project
                </button>
              </div>
            </div>

            {/* Project Cards Grid */}
            {filteredProjects.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 mx-auto flex items-center justify-center">
                  <FolderGit2 size={24} />
                </div>
                <h4 className="font-extrabold text-slate-900 text-base">No Projects Found for {currentUser.name}</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {projectScopeTab === 'my'
                    ? `You haven't created any projects under "${currentUser.name}" yet. Click "New Project" to add your work or switch to "All Projects".`
                    : 'No projects match your current search or tech stack filter.'}
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setNewAppModalMode('create')}
                    className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-500 transition-colors"
                  >
                    + Create Project Now
                  </button>
                  {projectScopeTab === 'my' && (
                    <button
                      onClick={() => setProjectScopeTab('all')}
                      className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
                    >
                      View All Workspace Projects
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map(project => (
                  <div
                    key={`proj-card-${project.id}`}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 hover:border-sky-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Author & Status Header */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          <span className={`w-1.5 h-1.5 rounded-full ${project.status === 'Production' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                          {project.status}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          By {project.authorName || 'Developer'}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-base leading-snug mb-1.5 group-hover:text-sky-600 transition-colors">
                        {project.name}
                      </h4>
                      <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2">
                        {project.description}
                      </p>

                      {/* Tech Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.techStack.map(tech => (
                          <span
                            key={`proj-tech-${project.id}-${tech}`}
                            className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-sky-50/70 text-sky-700 border border-sky-200/60"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Actions (View Particular Project details button added) */}
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <button
                        onClick={() => setSelectedProjectDetails(project)}
                        className="w-full py-1.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs border border-sky-200/80 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Eye size={14} /> View Particular Project ("What I Did")
                      </button>

                      <div className="flex items-center justify-between gap-2">
                        <a
                          href={project.deployUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-slate-600 hover:text-sky-600 flex items-center gap-1"
                        >
                          Live <ArrowUpRight size={12} />
                        </a>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setIsCodeWorkspaceOpen(true)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                          >
                            Code
                          </button>
                          <button
                            onClick={() => setSelectedDeployLog(DEPLOYMENT_LOGS[0])}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors cursor-pointer"
                          >
                            Deploy
                          </button>

                          {/* ⋯ More Actions Menu Button */}
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(openMenuId === project.id ? null : project.id);
                              }}
                              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                              aria-label="More actions"
                            >
                              <MoreVertical size={15} />
                            </button>

                            {/* Action Dropdown Menu */}
                            {openMenuId === project.id && (
                              <div
                                className="absolute right-0 bottom-full mb-1 w-48 bg-white rounded-2xl border border-slate-200 shadow-lg py-1.5 z-30 animate-fadeIn"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    setSelectedProjectDetails(project);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                  <Eye size={14} className="text-sky-600" /> View Accomplishments
                                </button>

                                <button
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    const duplicatedApp: WorkspaceProject = {
                                      ...project,
                                      id: `proj-${Date.now()}`,
                                      name: `${project.name} (Copy)`,
                                      authorId: currentUser.id,
                                      authorName: currentUser.name,
                                      lastUpdated: 'Just now',
                                    };
                                    setProjects((prev) => [duplicatedApp, ...prev]);
                                    toast.success(`Duplicated "${project.name}"`);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                  <Copy size={14} className="text-slate-400" /> Duplicate
                                </button>

                                <div className="my-1 border-t border-slate-100" />

                                <button
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    setDeletingProject(project);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                >
                                  <Trash2 size={14} className="text-rose-500" /> Delete Project
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5. DEVELOPMENT ACTIVITY & 7. TECH STACK (2 Columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 5. Development Activity Timeline (8 cols) */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Activity size={18} className="text-sky-600" />
                  <h3 className="font-extrabold text-slate-900 text-sm">Development Activity Stream</h3>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Real-time Event Log</span>
              </div>

              <div className="space-y-4">
                {RECENT_ACTIVITIES.map(act => (
                  <div key={`act-${act.id}`} className="flex items-start gap-3 text-xs group">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 size={13} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                          {act.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{act.time}</span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">{act.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. Development Tech Stack (4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                <Cpu size={18} className="text-indigo-600" />
                <h3 className="font-extrabold text-slate-900 text-sm">Supported Tech Stack</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {TECH_STACK_ITEMS.map(tech => (
                  <div
                    key={`tech-stack-${tech.name}`}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-transform hover:scale-105 ${tech.badge}`}
                  >
                    <span>{tech.name}</span>
                    <span className="text-[9px] opacity-60 font-normal">({tech.category})</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 8. DEPLOYMENT CENTER & 9. METRICS SECTION */}
          <div id="deployment-center-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 8. Deployment Center Panel (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Rocket size={18} className="text-blue-600" />
                    <h3 className="font-extrabold text-slate-900 text-sm">Deployment Center</h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    ● Cluster Active
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  {DEPLOYMENT_LOGS.map(log => (
                    <div
                      key={`dep-row-${log.id}`}
                      className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70 flex items-center justify-between gap-3 text-xs hover:bg-slate-100/80 transition-colors"
                    >
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          {log.appName}
                          <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                            log.status === 'Live' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {log.environment} ● {log.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{log.version} · {log.timestamp}</div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedDeployLog(log)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors text-[11px]"
                        >
                          View Logs
                        </button>
                        <button
                          onClick={() => {
                            toast.success(`Deployment triggered for ${log.appName}`);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-colors text-[11px]"
                        >
                          Deploy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 9. Metrics Section (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Server size={18} className="text-emerald-600" />
                    <h3 className="font-extrabold text-slate-900 text-sm">System Health & Metrics</h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">Last 24h</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-sky-50/60 p-3 rounded-xl border border-sky-100">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">System Requests</div>
                    <div className="text-xl font-extrabold text-slate-900 font-tabular mt-0.5">24,892</div>
                  </div>
                  <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Build Uptime</div>
                    <div className="text-xl font-extrabold text-emerald-600 font-tabular mt-0.5">99.4%</div>
                  </div>
                  <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-100">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Active Projects</div>
                    <div className="text-xl font-extrabold text-slate-900 font-tabular mt-0.5">{projects.length}</div>
                  </div>
                  <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-100">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Avg Response</div>
                    <div className="text-xl font-extrabold text-indigo-600 font-tabular mt-0.5">184ms</div>
                  </div>
                </div>

                {/* Minimal Lightweight Line Chart */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Traffic Volume Trend</span>
                    <span className="text-emerald-600">Peak: 1,840 req/min</span>
                  </div>
                  <div className="h-20 w-full">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 300 60" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="apiGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0,40 Q 50,10 100,35 T 200,20 T 300,15 L 300,60 L 0,60 Z"
                        fill="url(#apiGrad)"
                      />
                      <path
                        d="M 0,40 Q 50,10 100,35 T 200,20 T 300,15"
                        fill="none"
                        stroke="#0284c7"
                        strokeWidth="2.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* 10. CODE WORKSPACE PREVIEW (IDE PREVIEW PANEL) */}
          <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 mb-1">
                  <Terminal size={14} /> Integrated Development Environment (IDE)
                </div>
                <h3 className="text-xl font-extrabold text-white tracking-tight">Code Workspace</h3>
                <p className="text-xs text-slate-400">Edit, test, debug, and commit code directly inside your browser</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCodeWorkspaceOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Code2 size={15} /> Open Full Code Editor
                </button>
              </div>
            </div>

            {/* Quick Preview IDE Snippet */}
            <div className="bg-[#0b1329] rounded-xl p-4 font-mono text-xs text-slate-300 border border-slate-800 space-y-1">
              <div className="text-slate-500">// src/main.py — Application Development Hub API</div>
              <div><span className="text-purple-400">from</span> fastapi <span className="text-purple-400">import</span> FastAPI</div>
              <div>app = FastAPI(title=<span className="text-emerald-300">"AppDevHub Core OS"</span>, version=<span className="text-emerald-300">"2.4.0"</span>)</div>
              <div><span className="text-purple-400">@app.get</span>(<span className="text-emerald-300">"/api/v1/health"</span>)</div>
              <div><span className="text-blue-400">def</span> <span className="text-yellow-300">health_check</span>():</div>
              <div>    <span className="text-purple-400">return</span> &#123;<span className="text-emerald-300">"status"</span>: <span className="text-emerald-300">"healthy"</span>, <span className="text-emerald-300">"build"</span>: 482&#125;</div>
            </div>
          </div>



          {/* 12. AI DEVELOPMENT ASSISTANT CARD */}
          <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-bold px-3 py-1 rounded-full mb-3">
                <Sparkles size={14} className="text-purple-400" /> AI Assistant Suite
              </div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight mb-2">
                AI Development Assistant
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Build faster with intelligent assistance throughout your development workflow. Generate components, fix code, and optimize algorithms instantly.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Generate App', 'Fix Code', 'Explain Code', 'Generate API', 'Optimize'].map(act => (
                  <button
                    key={`ai-chip-${act}`}
                    onClick={() => setIsAIAssistantOpen(true)}
                    className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold transition-all border border-white/15"
                  >
                    + {act}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsAIAssistantOpen(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold text-sm shadow-lg shadow-purple-500/30 transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer"
            >
              <Sparkles size={16} /> Open AI Assistant
            </button>
          </div>

        </main>
      </div>

      {/* ALL WORKSPACE MODALS */}
      <CommandPaletteModal
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onSelectAction={handleCommandSelect}
      />

      <NewAppModal
        isOpen={newAppModalMode !== null}
        mode={newAppModalMode || 'create'}
        initialTemplate={selectedTemplateForModal}
        onClose={() => {
          setNewAppModalMode(null);
          setSelectedTemplateForModal(null);
        }}
        onCreated={handleCreateNewProject}
      />

      <CodeWorkspaceModal
        isOpen={isCodeWorkspaceOpen}
        onClose={() => setIsCodeWorkspaceOpen(false)}
      />

      <DeploymentLogsModal
        isOpen={selectedDeployLog !== null}
        logItem={selectedDeployLog}
        onClose={() => setSelectedDeployLog(null)}
      />

      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
      />

      {deletingProject && (
        <ApplicationDeleteModal
          project={deletingProject}
          onClose={() => setDeletingProject(null)}
          onConfirmDelete={handleConfirmDelete}
        />
      )}

      {/* NEW: Particular Project Showcase Details Modal */}
      <ProjectDetailsModal
        project={selectedProjectDetails}
        onClose={() => setSelectedProjectDetails(null)}
      />

      {/* NEW: Developer User Login / Switcher Modal */}
      <UserLoginModal
        isOpen={isLoginModalOpen}
        currentUser={currentUser}
        onClose={() => setIsLoginModalOpen(false)}
        onSelectUser={usr => {
          setCurrentUser(usr);
          toast.success(`Signed in as ${usr.name}`);
        }}
      />
    </div>
  );
}
