'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import AppLogo from '@/components/ui/AppLogo';
import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react';

interface LoginForm {
  email: string;
  password: string;
}

// BACKEND: POST /api/admin/login — JWT auth with bcrypt password verification
const DEMO_CREDENTIALS = { email: 'admin@cse.vignan.ac.in', password: 'ADHub@2026' };

interface Props {
  onSuccess: () => void;
}

export default function AdminLoginModal({ onSuccess }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    setAuthError('');
    // BACKEND: Replace with real JWT auth call
    await new Promise(r => setTimeout(r, 900));
    if (data.email === DEMO_CREDENTIALS.email && data.password === DEMO_CREDENTIALS.password) {
      onSuccess();
    } else {
      setAuthError('Invalid credentials — use the demo account below to sign in');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-modal w-full max-w-md p-8 animate-scaleIn">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <AppLogo size={44} />
          <div className="text-left">
            <div className="font-bold text-primary text-base">AppDevHub</div>
            <div className="text-xs text-muted-foreground">Admin Portal</div>
          </div>
        </div>
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <Shield size={22} className="text-primary" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Admin Login</h1>
        <p className="text-sm text-muted-foreground mt-1">Access the CSE Event Management Dashboard</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label-text">Email Address</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className={`input-field pl-9 ${errors.email ? 'error' : ''}`}
              placeholder="admin@cse.vignan.ac.in"
            />
          </div>
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>

        <div>
          <label className="label-text">Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', { required: 'Password is required' })}
              className={`input-field pl-9 pr-10 ${errors.password ? 'error' : ''}`}
              placeholder="Enter admin password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && <p className="error-text">{errors.password.message}</p>}
        </div>

        {authError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {authError}
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center py-3">
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Authenticating…
            </span>
          ) : 'Sign In to Dashboard'}
        </button>
      </form>

      {/* Demo credentials box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="text-xs font-semibold text-blue-700 mb-2">Demo Credentials</div>
        <div className="space-y-1.5">
          {[
            { label: 'Email', value: DEMO_CREDENTIALS.email },
            { label: 'Password', value: DEMO_CREDENTIALS.password },
          ].map(cred => (
            <div key={`cred-${cred.label}`} className="flex items-center justify-between gap-2">
              <span className="text-xs text-blue-600">{cred.label}:</span>
              <div className="flex items-center gap-1.5">
                <code className="text-xs bg-white border border-blue-200 rounded px-2 py-0.5 text-blue-800 font-mono">{cred.value}</code>
                <button
                  onClick={() => {
                    if (cred.label === 'Email') setValue('email', cred.value);
                    else setValue('password', cred.value);
                  }}
                  className="text-xs text-blue-600 font-medium hover:underline"
                >
                  Use
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}