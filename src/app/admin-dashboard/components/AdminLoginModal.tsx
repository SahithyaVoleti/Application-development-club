'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import AppLogo from '@/components/ui/AppLogo';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  User,
  Phone,
  Building,
  BadgeCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  KeyRound,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  onSuccess: (user: any) => void;
}

type Mode = 'login' | 'register' | 'super-admin' | 'otp';

export default function AdminLoginModal({ onSuccess }: Props) {
  const [mode, setMode] = useState<Mode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authNotice, setAuthNotice] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingName, setPendingName] = useState('');

  // OTP State
  const [otpInput, setOtpInput] = useState('');
  const [otpTimeLeft, setOtpTimeLeft] = useState(300); // 5 minutes
  const [devOtpCode, setDevOtpCode] = useState<string | null>(null);

  // Countdown timer for OTP
  useEffect(() => {
    if (mode !== 'otp' || otpTimeLeft <= 0) return;
    const timer = setInterval(() => setOtpTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [mode, otpTimeLeft]);

  // Form handlers
  const {
    register: regLogin,
    handleSubmit: handleLoginSubmit,
    setValue: setLoginValue,
    formState: { errors: loginErrors },
  } = useForm({
    defaultValues: { email: '', password: '' },
  });

  const {
    register: regAdmin,
    handleSubmit: handleAdminRegSubmit,
    formState: { errors: regErrors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      staffId: '',
      department: 'CSE',
      password: '',
      confirmPassword: '',
    },
  });

  // 1. LOGIN SUBMIT HANDLER (Admin & Super Admin)
  const onLoginSubmit = async (data: { email: string; password: string }) => {
    setIsSubmitting(true);
    setAuthError('');
    setAuthNotice('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        if (json.status === 'PENDING_APPROVAL') {
          setAuthNotice(
            'Your account has been verified successfully, but Admin access is still pending Super Admin approval.'
          );
          toast.warning('Admin Approval Pending', {
            description: 'Your registration is awaiting Super Admin verification.',
          });
        } else if (json.status === 'REJECTED') {
          setAuthError(
            json.error ||
              'Your Admin registration request was rejected by the Super Admin.'
          );
        } else if (json.status === 'PENDING_OTP') {
          setPendingEmail(json.email || data.email);
          setMode('otp');
          toast.info('OTP Required', {
            description: 'Please enter the 6-digit OTP code sent to your email.',
          });
        } else {
          setAuthError(json.error || 'Invalid credentials');
        }
        setIsSubmitting(false);
        return;
      }

      // Success Login!
      const user = json.user;
      const token = json.token;

      if (typeof window !== 'undefined') {
        localStorage.setItem('adhub_admin_token', token);
        localStorage.setItem('adhub_admin_user', JSON.stringify(user));
      }

      toast.success(
        user.role === 'SUPER_ADMIN' ? 'Welcome Super Admin!' : 'Admin Sign In Successful!'
      );
      onSuccess(user);
    } catch (err: any) {
      setAuthError('Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. ADMIN REGISTRATION SUBMIT HANDLER
  const onAdminRegisterSubmit = async (data: any) => {
    setIsSubmitting(true);
    setAuthError('');
    setAuthNotice('');

    if (data.password !== data.confirmPassword) {
      setAuthError('Passwords do not match. Please verify and re-enter.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setAuthError(json.error || 'Admin registration failed.');
        setIsSubmitting(false);
        return;
      }

      // Transition to OTP verification mode
      setPendingEmail(data.email);
      setPendingName(data.name);
      setDevOtpCode(json.devOtp || null);
      setOtpTimeLeft(300);
      setOtpInput('');
      setMode('otp');

      toast.success('Registration Step 1 Complete', {
        description: `6-digit OTP verification code sent to ${data.email}`,
      });
    } catch (err: any) {
      setAuthError('Network error during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. OTP VERIFICATION HANDLER
  const onVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput || otpInput.trim().length !== 6) {
      toast.error('Please enter a valid 6-digit OTP code');
      return;
    }

    setIsSubmitting(true);
    setAuthError('');

    try {
      const res = await fetch('/api/auth/verify-admin-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail, otp: otpInput.trim() }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setAuthError(json.error || 'OTP verification failed');
        setIsSubmitting(false);
        return;
      }

      // OTP Verified! Show Pending Approval Screen
      setAuthNotice('Registration successful. Your account is waiting for Super Admin approval.');
      setMode('login');
      toast.success('OTP Verification Passed!', {
        description: 'Your request is submitted for Super Admin approval.',
      });
    } catch (err: any) {
      setAuthError('OTP Verification network error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. RESEND OTP HANDLER
  const handleResendOtp = async () => {
    try {
      const res = await fetch('/api/auth/resend-admin-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail }),
      });
      const json = await res.json();
      if (json.success) {
        setDevOtpCode(json.devOtp || null);
        setOtpTimeLeft(300);
        toast.success('Fresh OTP Code Dispatched');
      } else {
        toast.error(json.error || 'Failed to resend OTP');
      }
    } catch (e) {
      toast.error('Network error resending OTP');
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-8 border border-slate-200 animate-scaleIn relative overflow-hidden">
      {/* Header Branding */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-3">
          <AppLogo size={42} />
          <div className="text-left">
            <div className="font-extrabold text-slate-900 text-lg leading-tight">
              Application Development Club
            </div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Vignan University · CSE Dept
            </div>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        {mode !== 'otp' && (
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200/80 mb-2 font-bold text-xs">
            <button
              onClick={() => {
                setMode('login');
                setAuthError('');
                setAuthNotice('');
              }}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin Login
            </button>
            <button
              onClick={() => {
                setMode('register');
                setAuthError('');
                setAuthNotice('');
              }}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Register New Admin
            </button>
            <button
              onClick={() => {
                setMode('super-admin');
                setAuthError('');
                setAuthNotice('');
                setLoginValue('email', 'uvr_cse@vignan.ac.in');
                setLoginValue('password', 'SuperAdmin@2026');
              }}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                mode === 'super-admin'
                  ? 'bg-indigo-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Super Admin
            </button>
          </div>
        )}

        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {mode === 'login' && 'Admin Portal Sign In'}
          {mode === 'register' && 'Admin Account Registration'}
          {mode === 'super-admin' && 'Super Admin Command Center'}
          {mode === 'otp' && 'OTP Email Security Verification'}
        </h1>
      </div>

      {/* Global Status Banner Notices */}
      {authNotice && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold flex items-start gap-3 shadow-2xs">
          <Clock size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-extrabold text-amber-950 text-sm mb-1">
              Approval Pending
            </div>
            <div>{authNotice}</div>
          </div>
        </div>
      )}

      {authError && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-semibold flex items-start gap-3 shadow-2xs">
          <ShieldAlert size={20} className="text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-extrabold text-rose-950 text-sm mb-1">
              Access Restricted
            </div>
            <div>{authError}</div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODE 1: ADMIN & SUPER ADMIN LOGIN FORM
      ------------------------------------------------------------- */}
      {(mode === 'login' || mode === 'super-admin') && (
        <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                {...regLogin('email', { required: 'Email address is required' })}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-bold focus:outline-none focus:border-blue-600 shadow-xs"
                placeholder={mode === 'super-admin' ? 'uvr_cse@vignan.ac.in' : 'admin@cse.vignan.ac.in'}
              />
            </div>
            {loginErrors.email && (
              <p className="text-xs text-rose-600 font-bold mt-1">{loginErrors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...regLogin('password', { required: 'Password is required' })}
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-bold focus:outline-none focus:border-blue-600 shadow-xs"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {loginErrors.password && (
              <p className="text-xs text-rose-600 font-bold mt-1">{loginErrors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3.5 px-4 rounded-xl text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'super-admin'
                ? 'bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-900 hover:from-indigo-800 hover:to-purple-800'
                : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Authenticating...
              </span>
            ) : mode === 'super-admin' ? (
              'Sign In as Super Admin'
            ) : (
              'Sign In to Admin Dashboard'
            )}
          </button>
        </form>
      )}

      {/* -------------------------------------------------------------
          MODE 2: ADMIN REGISTRATION FORM
      ------------------------------------------------------------- */}
      {mode === 'register' && (
        <form onSubmit={handleAdminRegSubmit(onAdminRegisterSubmit)} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  {...regAdmin('name', { required: 'Name is required' })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-sky-600 shadow-2xs"
                  placeholder="e.g. Dr. Ramesh Kumar"
                />
              </div>
              {regErrors.name && (
                <p className="text-[10px] text-rose-600 font-bold mt-0.5">{regErrors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Staff / Faculty ID *
              </label>
              <div className="relative">
                <BadgeCheck size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  {...regAdmin('staffId', { required: 'Staff/Faculty ID is required' })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-sky-600 shadow-2xs"
                  placeholder="e.g. FAC-CSE-102"
                />
              </div>
              {regErrors.staffId && (
                <p className="text-[10px] text-rose-600 font-bold mt-0.5">{regErrors.staffId.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  {...regAdmin('email', { required: 'Email address is required' })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-sky-600 shadow-2xs"
                  placeholder="faculty@vignan.ac.in"
                />
              </div>
              {regErrors.email && (
                <p className="text-[10px] text-rose-600 font-bold mt-0.5">{regErrors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  {...regAdmin('phone', { required: 'Phone number is required' })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-sky-600 shadow-2xs"
                  placeholder="+91 9876543210"
                />
              </div>
              {regErrors.phone && (
                <p className="text-[10px] text-rose-600 font-bold mt-0.5">{regErrors.phone.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Department *
            </label>
            <div className="relative">
              <Building size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                {...regAdmin('department', { required: 'Department is required' })}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-sky-600 shadow-2xs cursor-pointer"
              >
                <option value="CSE">Computer Science & Engineering (CSE)</option>
                <option value="IT">Information Technology (IT)</option>
                <option value="AI/ML">Artificial Intelligence & Machine Learning</option>
                <option value="ECE">Electronics & Communication (ECE)</option>
                <option value="EEE">Electrical & Electronics (EEE)</option>
                <option value="MECH">Mechanical Engineering</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  {...regAdmin('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 chars required' },
                  })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-sky-600 shadow-2xs"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  {...regAdmin('confirmPassword', { required: 'Confirm password is required' })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-sky-600 shadow-2xs"
                  placeholder="Confirm password"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting Registration...
              </span>
            ) : (
              'Submit Admin Account Request'
            )}
          </button>
        </form>
      )}

      {/* -------------------------------------------------------------
          MODE 3: OTP SECURITY VERIFICATION SCREEN
      ------------------------------------------------------------- */}
      {mode === 'otp' && (
        <form onSubmit={onVerifyOtpSubmit} className="space-y-4">
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-center space-y-2">
            <div className="text-xs text-sky-900 font-medium">
              We have generated a 6-digit Security Verification OTP code for:
            </div>
            <div className="text-sm font-extrabold text-sky-950 font-mono">
              {pendingEmail}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider text-center mb-2">
              Enter 6-Digit OTP Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={otpInput}
              onChange={e => setOtpInput(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full py-3 text-center font-mono font-black text-2xl tracking-[12px] bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white shadow-inner"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-sky-600" />
              <span>
                Expires in: {Math.floor(otpTimeLeft / 60)}:
                {String(otpTimeLeft % 60).padStart(2, '0')}
              </span>
            </div>

            <button
              type="button"
              onClick={handleResendOtp}
              className="text-sky-600 hover:underline font-bold cursor-pointer"
            >
              Resend OTP
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || otpInput.length !== 6}
            className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-sky-600 text-white font-extrabold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Verifying OTP...' : 'Verify OTP & Complete Registration'}
          </button>

          <button
            type="button"
            onClick={() => setMode('register')}
            className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-900 pt-1 flex items-center justify-center gap-1 cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Admin Registration
          </button>
        </form>
      )}
    </div>
  );
}