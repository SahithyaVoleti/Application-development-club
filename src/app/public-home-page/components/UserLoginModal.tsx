'use client';
import React, { useState } from 'react';
import { X, Sparkles, LogIn, UserPlus, Lock, AlertCircle, Building2, GraduationCap, CreditCard, Mail, User, Phone, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { type UserProfile } from '@/lib/workspaceData';

interface Props {
  isOpen: boolean;
  currentUser?: UserProfile | null;
  bannerNotice?: string | null;
  onClose: () => void;
  onSelectUser: (user: UserProfile) => void;
}

const DEPARTMENTS = [
  'CSE (Computer Science & Engineering)',
  'ECE (Electronics & Communication)',
  'IT (Information Technology)',
  'AI & ML (Artificial Intelligence & ML)',
  'Data Science',
  'EEE (Electrical & Electronics)',
  'Mechanical Engineering',
  'Civil Engineering',
  'MCA',
  'MBA',
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const SECTIONS = ['A', 'B', 'C', 'D'];

export default function UserLoginModal({ isOpen, bannerNotice, onClose, onSelectUser }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Auth Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Registration Profile Fields
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('CSE (Computer Science & Engineering)');
  const [year, setYear] = useState('3rd Year');
  const [section, setSection] = useState('A');
  const [college, setCollege] = useState('VFSTR / Vignan University');

  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter your email and password.');
      return;
    }

    if (mode === 'register') {
      if (!fullName.trim() || !studentId.trim() || !phone.trim()) {
        toast.error('Please complete all required student profile fields.');
        return;
      }

      if (password !== confirmPassword) {
        toast.error('Passwords do not match. Please verify your password.');
        return;
      }

      if (password.length < 6) {
        toast.error('Password must be at least 6 characters long.');
        return;
      }
    }

    setIsLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload = mode === 'login'
        ? { email: email.trim(), password }
        : {
            name: fullName.trim(),
            email: email.trim(),
            password,
            studentId: studentId.trim().toUpperCase(),
            department,
            year,
            section,
            phone: phone.trim(),
            college: college.trim(),
          };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.user) {
        const initials = data.user.name
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase();

        const userProfile: UserProfile = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role === 'ADMIN' ? 'Administrator' : 'Student Developer',
          avatarInitials: initials || 'ST',
          department: data.user.department || 'Computer Science & Engineering',
          studentId: data.user.studentId,
          year: data.user.year,
          section: data.user.section,
          phone: data.user.phone,
          college: data.user.college,
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem('adhub_active_user', JSON.stringify(userProfile));
          if (data.token) localStorage.setItem('adhub_token', data.token);
        }

        onSelectUser(userProfile);
        toast.success(mode === 'login' ? `Welcome back, ${data.user.name}!` : `Student account created successfully!`);
        onClose();
      } else {
        toast.error(data.error || 'Authentication failed');
      }
    } catch (err: any) {
      toast.error('Network error during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col animate-scaleIn my-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 p-6 text-white relative flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white backdrop-blur-xs">
              <Sparkles size={12} /> Student Account & Authentication
            </div>
            <h3 className="text-xl font-extrabold tracking-tight">
              {mode === 'login' ? 'Student & Developer Sign In' : 'Create Student Account'}
            </h3>
            <p className="text-xs text-sky-100">
              {mode === 'login'
                ? 'Sign in to your student account to register for events & access workspace'
                : 'Create your official student account to register for campus events'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Required Registration Banner Notice (If Redirected from Event Registration) */}
        {bannerNotice && (
          <div className="bg-amber-50 border-b border-amber-200 p-3.5 px-6 text-xs text-amber-900 font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
            <span>{bannerNotice}</span>
          </div>
        )}

        {/* Modal Body Form */}
        <div className="p-6 space-y-4 text-xs text-slate-800 max-h-[75vh] overflow-y-auto">
          
          {/* Mode Switcher Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'register' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Full Student Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs"
                    />
                  </div>
                </div>

                {/* Student ID & Phone Number */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Student ID / Roll No <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={studentId}
                        onChange={e => setStudentId(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs font-mono uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Department / Branch <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                    <select
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs bg-white"
                    >
                      {DEPARTMENTS.map(d => (
                        <option key={`reg-d-${d}`} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Year, Section & College */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Year</label>
                    <select
                      value={year}
                      onChange={e => setYear(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs bg-white"
                    >
                      {YEARS.map(y => (
                        <option key={`reg-y-${y}`} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Section</label>
                    <select
                      value={section}
                      onChange={e => setSection(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs bg-white"
                    >
                      {SECTIONS.map(s => (
                        <option key={`reg-s-${s}`} value={s}>Sec {s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">College</label>
                    <input
                      type="text"
                      value={college}
                      onChange={e => setCollege(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-[11px] bg-slate-50 text-slate-600"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Student Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs"
                />
              </div>
            </div>

            {/* Confirm Password (Register mode only) */}
            {mode === 'register' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-3 px-4 rounded-xl bg-slate-900 hover:bg-sky-600 disabled:opacity-50 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {mode === 'login' ? <LogIn size={15} /> : <UserPlus size={15} />}
              <span>
                {isLoading
                  ? 'Authenticating...'
                  : mode === 'login'
                  ? 'Sign In & Register For Events'
                  : 'Create Student Account & Register'}
              </span>
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Admin Quick Credentials:</span>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@appdevhub.com');
                setPassword('AdminPassword2026!');
                setMode('login');
              }}
              className="text-sky-600 font-bold hover:underline cursor-pointer"
            >
              Fill Admin Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
