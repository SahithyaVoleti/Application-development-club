'use client';
import React, { useState } from 'react';
import { X, Lock, AlertCircle, Building2, CreditCard, Mail, User, Phone, ArrowLeft, KeyRound } from 'lucide-react';
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
  const [authError, setAuthError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!email.trim() || !password.trim()) {
      toast.error('Please enter your Edu Email ID and password.');
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
        if (data.code === 'ACCOUNT_NOT_FOUND') {
          setAuthError(`Account not found: We couldn't find an account associated with ${email.trim()}.`);
          toast.error('Account Not Found', {
            description: 'Please check your email or click Create Account to register.',
          });
        } else {
          setAuthError(data.message || data.error || 'Incorrect email or password.');
          toast.error(data.error || 'Authentication failed');
        }
      }
    } catch (err: any) {
      setAuthError('Network error during authentication.');
      toast.error('Network error during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/40 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div
        className="bg-white rounded-[32px] border border-amber-100 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto flex flex-col animate-scaleIn my-6 relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-20 cursor-pointer"
          title="Close"
        >
          <X size={20} />
        </button>

        {/* Required Registration Banner Notice (If Redirected from Event Registration) */}
        {bannerNotice && (
          <div className="bg-amber-50 border-b border-amber-200 p-3.5 px-6 text-xs text-amber-900 font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
            <span>{bannerNotice}</span>
          </div>
        )}

        {/* Card Body */}
        <div className="p-8 sm:p-10 flex flex-col items-center text-center">
          
          {/* Top Graduation Cap + Diploma Vector Illustration */}
          <div className="flex justify-center mb-5 relative">
            <svg width="220" height="145" viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xs">
              {/* Soft ambient background glow */}
              <ellipse cx="120" cy="120" rx="90" ry="25" fill="#FEF08A" opacity="0.45" />

              {/* Rolled Diploma Scroll */}
              <g transform="translate(45, 62) rotate(-12)">
                <rect x="0" y="10" width="132" height="38" rx="19" fill="#FAF6E8" stroke="#E2D8B9" strokeWidth="2.5"/>
                <path d="M126 10 C 137 10, 137 48, 126 48 C 115 48, 115 10, 126 10 Z" fill="#E8DDB8" stroke="#D1C59F" strokeWidth="2"/>
                <path d="M123 18 C 128 18, 128 40, 123 40" fill="none" stroke="#B8AA80" strokeWidth="1" strokeDasharray="2 2"/>
                {/* Red Ribbon & Gold Seal */}
                <rect x="42" y="9" width="16" height="40" fill="#DC2626" rx="2"/>
                <circle cx="50" cy="29" r="14" fill="#F59E0B" stroke="#B45309" strokeWidth="2"/>
                <circle cx="50" cy="29" r="10" fill="#FBBF24"/>
                <path d="M44 43 L37 60 L50 51 L63 60 L56 43" fill="#DC2626"/>
              </g>

              {/* Graduation Cap (Mortarboard) */}
              <g transform="translate(30, 18)">
                {/* Cap Base Skullcap */}
                <path d="M80 66 L100 82 C 100 82, 115 90, 120 90 C 125 90, 140 82, 140 82 L160 66 C 160 80, 148 98, 120 98 C 92 98, 80 80, 80 66 Z" fill="#1E293B"/>
                {/* Cap Top Diamond Board */}
                <polygon points="120,24 212,50 120,76 28,50" fill="#0F172A" stroke="#334155" strokeWidth="1.5"/>
                {/* Cap Under Layer Shadow */}
                <polygon points="120,30 200,52 120,73 40,52" fill="#1E293B" opacity="0.65"/>
                {/* Button & Tassel */}
                <circle cx="120" cy="50" r="5.5" fill="#EAB308"/>
                <path d="M120 52 C 145 52, 160 70, 162 98" stroke="#EAB308" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
                {/* Tassel Fringe */}
                <path d="M157 95 L167 116 L157 116 Z" fill="#D97706"/>
              </g>
            </svg>
          </div>

          {/* Mode 1: STUDENT LOGIN (Exact layout requested in user mockup) */}
          {mode === 'login' && (
            <div className="w-full">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-4">
                Student Login
              </h2>

              {authError && (
                <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold flex items-center justify-between text-left">
                  <span>{authError}</span>
                  {authError.includes('Account not found') && (
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="ml-2 px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px] whitespace-nowrap cursor-pointer hover:bg-rose-700"
                    >
                      Register
                    </button>
                  )}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4 w-full text-left">
                {/* Edu Email ID */}
                <div className="w-full">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Edu Email ID
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your Edu Email ID"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-[#F1F3F5] text-slate-900 placeholder-slate-400 border border-transparent focus:border-amber-400 focus:bg-white rounded-2xl px-5 py-3.5 text-sm outline-none font-medium transition-all"
                  />
                </div>

                {/* Password */}
                <div className="w-full">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-[#F1F3F5] text-slate-900 placeholder-slate-400 border border-transparent focus:border-amber-400 focus:bg-white rounded-2xl px-5 py-3.5 text-sm outline-none font-medium transition-all"
                  />
                </div>

                {/* Log In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 bg-[#F6E8C3] hover:bg-[#EFE0B5] active:scale-[0.99] text-slate-900 font-extrabold rounded-2xl py-3.5 text-base tracking-wide transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? 'Signing In...' : 'Log In'}
                </button>
              </form>

              {/* Bottom Line & Create Account Option */}
              <div className="w-full border-b border-slate-200 my-6" />

              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
                <span>New Student?</span>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-slate-900 hover:text-amber-700 font-bold underline cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </div>
          )}

          {/* Mode 3: CREATE STUDENT ACCOUNT */}
          {mode === 'register' && (
            <div className="w-full text-left">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight text-center mb-1">
                Create Student Account
              </h2>
              <p className="text-xs text-slate-500 text-center mb-5 font-medium">
                Register your student details to participate in campus events.
              </p>

              <form onSubmit={handleAuthSubmit} className="space-y-3 w-full text-xs">
                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Student Name *</label>
                  <input
                    type="text"
                    required
                    placeholder=""
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full bg-[#F1F3F5] text-slate-900 border border-transparent focus:border-amber-400 focus:bg-white rounded-xl px-3.5 py-2.5 outline-none font-medium"
                  />
                </div>

                {/* Student ID & Phone */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Student ID *</label>
                    <input
                      type="text"
                      required
                      placeholder=""
                      value={studentId}
                      onChange={e => setStudentId(e.target.value)}
                      className="w-full bg-[#F1F3F5] text-slate-900 border border-transparent focus:border-amber-400 focus:bg-white rounded-xl px-3.5 py-2.5 outline-none font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder=""
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-[#F1F3F5] text-slate-900 border border-transparent focus:border-amber-400 focus:bg-white rounded-xl px-3.5 py-2.5 outline-none font-medium"
                    />
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Department *</label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full bg-[#F1F3F5] text-slate-900 border border-transparent focus:border-amber-400 focus:bg-white rounded-xl px-3 py-2.5 outline-none font-medium"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={`reg-d-${d}`} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Edu Email ID */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Edu Email ID *</label>
                  <input
                    type="email"
                    required
                    placeholder=""
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-[#F1F3F5] text-slate-900 border border-transparent focus:border-amber-400 focus:bg-white rounded-xl px-3.5 py-2.5 outline-none font-medium"
                  />
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Password *</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-[#F1F3F5] text-slate-900 border border-transparent focus:border-amber-400 focus:bg-white rounded-xl px-3.5 py-2.5 outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Confirm Password *</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#F1F3F5] text-slate-900 border border-transparent focus:border-amber-400 focus:bg-white rounded-xl px-3.5 py-2.5 outline-none font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-3 bg-[#F6E8C3] hover:bg-[#EFE0B5] text-slate-900 font-extrabold rounded-2xl py-3 text-sm tracking-wide transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? 'Creating Account...' : 'Register & Log In'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-[#D99A26] hover:text-[#B87D17] font-bold text-xs cursor-pointer flex items-center justify-center gap-1 mx-auto transition-colors"
                >
                  <ArrowLeft size={14} /> Already have an account? Log In
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
