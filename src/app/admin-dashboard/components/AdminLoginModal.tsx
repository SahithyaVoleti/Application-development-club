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
  ShieldCheck,
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

type AuthType = 'admin' | 'super-admin';
type Mode = 'login' | 'register' | 'otp' | 'not-found' | 'pending' | 'rejected';

export default function AdminLoginModal({ onSuccess }: Props) {
  const [authType, setAuthType] = useState<AuthType>('admin');
  const [mode, setMode] = useState<Mode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authNotice, setAuthNotice] = useState('');
  const [notFoundEmail, setNotFoundEmail] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingName, setPendingName] = useState('');
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);

  // OTP State
  const [otpInput, setOtpInput] = useState('');
  const [otpTimeLeft, setOtpTimeLeft] = useState(300); // 5 minutes
  const otpInputRef = React.useRef<HTMLInputElement>(null);

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
      designation: '',
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
        body: JSON.stringify({
          ...data,
          loginAs: authType === 'super-admin' ? 'SUPER_ADMIN' : 'ADMIN',
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        if (json.code === 'ACCOUNT_NOT_FOUND') {
          setNotFoundEmail(json.email || data.email);
          setMode('not-found');
        } else if (json.code === 'ADMIN_PENDING' || json.status === 'PENDING' || json.status === 'PENDING_APPROVAL') {
          setPendingEmail(json.email || data.email);
          setMode('pending');
        } else if (json.code === 'ADMIN_REJECTED' || json.status === 'REJECTED') {
          setRejectionReason(json.rejectionReason || null);
          setMode('rejected');
        } else {
          setAuthError(json.error || 'Incorrect email or password. Please check your credentials and try again.');
        }
        setIsSubmitting(false);
        return;
      }

      // Check if OTP 2FA verification is required
      if (json.requiresOtp) {
        setPendingEmail(json.email || data.email);
        setOtpInput('');
        setOtpTimeLeft(300);
        setMode('otp');
        toast.info('Security OTP Required', {
          description: `6-digit security verification code sent to ${json.email || data.email}`,
        });
        setTimeout(() => {
          otpInputRef.current?.focus();
        }, 50);
        setIsSubmitting(false);
        return;
      }

      // Role check from backend response
      const user = json.user;
      const token = json.token;

      if (user.role === 'STUDENT') {
        setAuthError(
          'Access Denied: Student accounts cannot access the Admin Panel. Only approved Faculty Admins and Super Admins can sign in here.'
        );
        setIsSubmitting(false);
        return;
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('adhub_admin_token', token);
        localStorage.setItem('adhub_admin_user', JSON.stringify(user));
      }

      toast.success(user.role === 'SUPER_ADMIN' ? 'Welcome Super Admin!' : 'Admin Sign In Successful!');
      onSuccess(user);
    } catch (err: any) {
      setAuthError('Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. ADMIN REGISTRATION SUBMIT HANDLER (Admin ONLY)
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

      // Transition to Pending Approval screen
      setPendingEmail(data.email);
      setPendingName(data.name);
      setMode('pending');

      toast.success('Account Created Successfully', {
        description: 'Your account is waiting for Super Admin approval.',
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
      const res = await fetch('/api/auth/verify-login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail, otp: otpInput.trim() }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        const errorMsg = json.error || 'Invalid OTP. Please try again with the latest OTP.';
        setAuthError(errorMsg);
        setOtpInput('');
        setTimeout(() => {
          otpInputRef.current?.focus();
        }, 50);
        setIsSubmitting(false);
        return;
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('adhub_admin_token', json.token);
        localStorage.setItem('adhub_admin_user', JSON.stringify(json.user));
        sessionStorage.setItem('adhub_admin_otp_verified', 'true');
      }

      toast.success(
        json.user.role === 'SUPER_ADMIN' ? 'Welcome Super Admin!' : 'Admin Sign In Successful!'
      );
      onSuccess(json.user);
    } catch (err: any) {
      setAuthError('OTP Verification network error.');
      setOtpInput('');
      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 50);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. RESEND OTP HANDLER
  const handleResendOtp = async () => {
    setOtpInput('');
    setAuthError('');
    try {
      const res = await fetch('/api/auth/resend-login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail }),
      });
      const json = await res.json();
      if (json.success) {
        setOtpTimeLeft(300);
        toast.success('New OTP sent successfully.');
        setTimeout(() => {
          otpInputRef.current?.focus();
        }, 50);
      } else {
        toast.error(json.error || 'Failed to resend OTP');
      }
    } catch (e) {
      toast.error('Network error resending OTP');
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-6 sm:p-8 border border-slate-200 animate-scaleIn relative overflow-hidden font-sans">
      {/* Header Branding */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2.5 mb-3">
          <AppLogo size={40} />
          <div className="text-left">
            <div className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight tracking-tight">
              Application Development Club
            </div>
            <div className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">
              Vignan University · CSE Dept
            </div>
          </div>
        </div>

        {/* TWO SEPARATE LOGIN OPTIONS TAB SWITCHER */}
        {mode !== 'otp' && mode !== 'pending' && mode !== 'rejected' && mode !== 'not-found' && (
          <div className="flex items-center p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200 shadow-xs my-4 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => {
                setAuthType('admin');
                setMode('login');
                setAuthError('');
                setAuthNotice('');
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                authType === 'admin'
                  ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-200'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Shield size={16} className={authType === 'admin' ? 'text-blue-600' : 'text-slate-400'} />
              <span>Admin</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthType('super-admin');
                setMode('login');
                setAuthError('');
                setAuthNotice('');
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                authType === 'super-admin'
                  ? 'bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white shadow-md ring-1 ring-purple-500/40'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <ShieldCheck size={16} className={authType === 'super-admin' ? 'text-purple-300' : 'text-slate-400'} />
              <span>Super Admin</span>
            </button>
          </div>
        )}

        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {mode === 'register' && 'Admin Account Registration'}
          {mode === 'otp' && 'OTP Email Security Verification'}
          {mode === 'login' && (authType === 'super-admin' ? 'Super Admin Login' : 'Admin Login')}
        </h1>
        {mode === 'login' && (
          <p className="text-xs text-slate-500 font-medium mt-1">
            {authType === 'super-admin'
              ? 'Welcome Back — Restricted Super Admin Governance'
              : 'Welcome Back — Enter your credentials to sign in'}
          </p>
        )}
      </div>

      {/* Global Status Banner Notices */}
      {authNotice && (
        <div className="mb-5 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold flex items-start gap-3 shadow-2xs">
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
        <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-semibold flex items-start gap-3 shadow-2xs">
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
          MODE 1: LOGIN FORM (ADMIN & SUPER ADMIN)
      ------------------------------------------------------------- */}
      {mode === 'login' && (
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
              />
            </div>
            {loginErrors.email && (
              <p className="text-xs text-rose-600 font-bold mt-1">{loginErrors.email.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() =>
                  toast.info('Password Reset', {
                    description: 'Please contact the Super Admin to reset your account password.',
                  })
                }
                className="text-xs font-bold text-slate-500 hover:text-sky-600 transition-colors cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...regLogin('password', { required: 'Password is required' })}
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-bold focus:outline-none focus:border-blue-600 shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
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
              authType === 'super-admin'
                ? 'bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 hover:from-purple-800 hover:to-indigo-800'
                : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Authenticating...
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          {/* ADMIN ONLY: Don't Have an Account? -> Create Account */}
          {authType === 'admin' ? (
            <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-600 font-medium">
              <span>Don't have an account? </span>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setAuthError('');
                  setAuthNotice('');
                }}
                className="font-extrabold text-blue-600 hover:text-blue-700 underline cursor-pointer ml-1"
              >
                Create Account
              </button>
            </div>
          ) : (
            <div className="mt-6 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-500 font-mono font-medium flex items-center justify-center gap-1.5">
              <ShieldCheck size={13} className="text-purple-600 flex-shrink-0" />
              <span>Super Admin access is strictly limited to pre-configured accounts.</span>
            </div>
          )}
        </form>
      )}

      {/* -------------------------------------------------------------
          MODE: ACCOUNT NOT FOUND SCREEN
      ------------------------------------------------------------- */}
      {mode === 'not-found' && (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 text-center space-y-4 animate-fadeIn">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center border border-amber-200 shadow-xs">
            <AlertTriangle size={28} />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
              Account not found
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              Account not found. Please create an Admin account first.
            </p>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Email: {notFoundEmail}
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            {authType === 'admin' && (
              <button
                onClick={() => {
                  setMode('register');
                  setLoginValue('email', notFoundEmail);
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Create Account</span>
              </button>
            )}

            <button
              onClick={() => setMode('login')}
              className="w-full py-3 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODE: ACCOUNT PENDING APPROVAL SCREEN
      ------------------------------------------------------------- */}
      {mode === 'pending' && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-3xl p-6 sm:p-8 text-center space-y-4 animate-fadeIn">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Clock size={28} />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight mb-2">
              Account Pending Approval
            </h2>
            <p className="text-xs sm:text-sm font-extrabold text-amber-900 leading-relaxed max-w-md mx-auto">
              Account created successfully. Your account is waiting for Super Admin approval.
            </p>
            <p className="text-xs text-amber-800 mt-2 font-medium">
              Approval notification emails have been dispatched to Super Admins. You will be able to sign in once approved.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-amber-100/80 text-amber-900 px-4 py-2 rounded-full text-xs font-mono font-extrabold border border-amber-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            Status: Pending Super Admin Approval
          </div>

          <div className="pt-3">
            <button
              onClick={() => {
                setAuthType('admin');
                setMode('login');
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODE: ACCOUNT REJECTED SCREEN
      ------------------------------------------------------------- */}
      {mode === 'rejected' && (
        <div className="bg-rose-50/90 border border-rose-200 rounded-3xl p-6 sm:p-8 text-center space-y-4 animate-fadeIn">
          <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-rose-600/30">
            <ShieldAlert size={28} />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-rose-950 tracking-tight mb-2">
              Account Registration Rejected
            </h2>
            <p className="text-xs sm:text-sm text-rose-900 font-extrabold leading-relaxed max-w-md mx-auto">
              Your Admin account request has been rejected.
            </p>
            {rejectionReason && (
              <div className="mt-3 p-3 bg-white/80 rounded-xl border border-rose-200 text-xs text-rose-900 font-medium">
                Reason: {rejectionReason}
              </div>
            )}
            <p className="text-xs text-rose-700 mt-3 font-medium">
              Please contact the Super Admin team if you believe this was an error.
            </p>
          </div>

          <div className="pt-3">
            <button
              onClick={() => {
                setAuthType('admin');
                setMode('login');
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODE 2: ADMIN REGISTRATION FORM (ADMIN ONLY)
      ------------------------------------------------------------- */}
      {mode === 'register' && authType === 'admin' && (
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
                />
              </div>
              {regErrors.phone && (
                <p className="text-[10px] text-rose-600 font-bold mt-0.5">{regErrors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Designation / Position *
              </label>
              <div className="relative">
                <Sparkles size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  {...regAdmin('designation', { required: 'Designation is required' })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-sky-600 shadow-2xs"
                />
              </div>
              {regErrors.designation && (
                <p className="text-[10px] text-rose-600 font-bold mt-0.5">{(regErrors.designation as any).message}</p>
              )}
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
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting Registration...
              </span>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setMode('login')}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <ArrowLeft size={14} /> Already have an account? Back to Sign In
            </button>
          </div>
        </form>
      )}

      {/* -------------------------------------------------------------
          MODE 3: OTP SECURITY VERIFICATION SCREEN
      ------------------------------------------------------------- */}
      {mode === 'otp' && (
        <form onSubmit={onVerifyOtpSubmit} className="space-y-4">
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-center space-y-2">
            <div className="text-xs text-sky-900 font-medium">
              We've sent a 6-digit verification code to:
            </div>
            <div className="text-sm font-extrabold text-sky-950 font-mono">
              {pendingEmail}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider text-center mb-2">
              Enter 6-Digit Verification Code
            </label>
            <input
              ref={otpInputRef}
              type="text"
              maxLength={6}
              value={otpInput}
              onChange={e => setOtpInput(e.target.value.replace(/\D/g, ''))}
              className="w-full py-3 text-center font-mono font-black text-2xl tracking-[12px] bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white shadow-inner"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-sky-600" />
              <span>
                OTP expires in: {Math.floor(otpTimeLeft / 60)}:
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
            {isSubmitting ? 'Verifying OTP...' : 'Verify & Continue'}
          </button>

          <button
            type="button"
            onClick={() => setMode('login')}
            className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-900 pt-1 flex items-center justify-center gap-1 cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Sign In
          </button>
        </form>
      )}
    </div>
  );
}