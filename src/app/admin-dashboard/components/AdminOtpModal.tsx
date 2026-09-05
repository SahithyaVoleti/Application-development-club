'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, RotateCcw, X, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface AdminOtpModalProps {
  actionName: string; // e.g. "Add New Event", "View Registrations & Reports", "Download Event Reports"
  adminEmail?: string;
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export default function AdminOtpModal({
  actionName,
  adminEmail = 'admin@vignan.ac.in',
  isOpen,
  onClose,
  onVerified,
}: AdminOtpModalProps) {
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [devCode, setDevCode] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Send OTP email when modal opens
  useEffect(() => {
    if (isOpen) {
      handleSendOtp();
    }
  }, [isOpen]);

  // Countdown timer for resend
  useEffect(() => {
    let timer: any;
    if (isOpen && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, countdown]);

  const handleSendOtp = async () => {
    setIsSending(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/admin/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail }),
      });
      const data = await res.json();

      if (data.success) {
        setCountdown(60);
        if (data.devCode) setDevCode(data.devCode);
        toast.success(`Security OTP sent to ${adminEmail}`, {
          description: data.emailSent ? 'Check your email inbox' : `OTP Code: ${data.devCode}`,
        });
      } else {
        setErrorMessage(data.error || 'Failed to send OTP email');
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Connection error sending OTP');
    } finally {
      setIsSending(false);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      // User pasted full 6-digit code
      const pasted = value.replace(/\D/g, '').slice(0, 6).split('');
      const newDigits = [...otpDigits];
      pasted.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setOtpDigits(newDigits);
      if (pasted.length === 6) {
        inputRefs.current[5]?.focus();
      }
      return;
    }

    const digit = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the OTP code.');
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, otp: fullOtp }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Admin Privileges Verified!', {
          description: `Authorized for: ${actionName}`,
        });
        // Save verified session in sessionStorage
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('adhub_admin_otp_verified', 'true');
        }
        onVerified();
        onClose();
      } else {
        setErrorMessage(data.error || 'Invalid OTP code. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification request failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const autofillDevCode = () => {
    if (devCode) {
      setOtpDigits(devCode.split(''));
      toast.info('Autofilled Dev OTP Code');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/70 animate-fadeIn"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl shadow-slate-900/30 w-full max-w-md overflow-hidden animate-scaleIn transition-all">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
          >
            <X size={16} />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center font-bold mb-3 shadow-lg shadow-sky-500/20 border border-white/20">
            <Lock size={22} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-bold border border-sky-400/30 mb-2 uppercase tracking-wider">
            <ShieldCheck size={12} /> Admin Security Check
          </div>

          <h2 className="text-lg font-extrabold text-white leading-tight">
            Security OTP Required
          </h2>
          <p className="text-xs text-slate-300 mt-1 font-medium">
            Authorization required to: <strong className="text-cyan-300">{actionName}</strong>
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          <div className="bg-sky-50/80 border border-sky-200/80 rounded-2xl p-3.5 flex items-center gap-3 text-xs text-sky-900">
            <Mail size={18} className="text-sky-600 flex-shrink-0" />
            <div>
              <div className="font-semibold text-slate-500 text-[10px] uppercase">Sent to Admin Email:</div>
              <div className="font-extrabold text-slate-900 font-mono text-xs">{adminEmail}</div>
            </div>
          </div>

          {/* Dev Debug Code Banner */}
          {devCode && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center gap-1.5 font-bold">
                <Sparkles size={14} className="text-amber-600" />
                <span>Dev OTP Code: <code className="bg-amber-100 font-mono px-2 py-0.5 rounded text-amber-950 font-extrabold text-sm">{devCode}</code></span>
              </div>
              <button
                type="button"
                onClick={autofillDevCode}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[11px] transition-colors cursor-pointer"
              >
                Autofill
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 6-Digit OTP Box Grid */}
          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 text-center mb-3">
                Enter 6-Digit Verification OTP
              </label>
              <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={`otp-input-${idx}`}
                    ref={el => { inputRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={e => handleDigitChange(idx, e.target.value)}
                    onKeyDown={e => handleKeyDown(idx, e)}
                    className="w-11 h-12 sm:w-12 sm:h-13 text-center text-xl font-extrabold font-mono bg-white border border-slate-300 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/15 focus:outline-none transition-all shadow-2xs"
                  />
                ))}
              </div>
            </div>

            {/* Verification Button */}
            <button
              type="submit"
              disabled={isVerifying || otpDigits.join('').length !== 6}
              className="w-full h-12 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Authorization…</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>Verify OTP & Proceed</span>
                </>
              )}
            </button>
          </form>

          {/* Resend Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>Didn't receive code?</span>
            <button
              onClick={handleSendOtp}
              disabled={isSending || countdown > 0}
              className="font-bold text-sky-600 hover:text-sky-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
            >
              <RotateCcw size={13} className={isSending ? 'animate-spin' : ''} />
              <span>{isSending ? 'Sending…' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
