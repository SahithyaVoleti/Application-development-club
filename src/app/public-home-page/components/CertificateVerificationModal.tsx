'use client';
import React, { useState } from 'react';
import { X, Search, ShieldCheck, AlertCircle, CheckCircle2, Award, Calendar, User, Building2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CertificateVerificationModal({ isOpen, onClose }: Props) {
  const [certInput, setCertInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationData, setVerificationData] = useState<any>(null);

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certInput.trim()) {
      toast.error('Please enter a Certificate ID.');
      return;
    }

    setIsLoading(true);
    setVerificationData(null);

    try {
      const res = await fetch(`/api/certificates/verify/${encodeURIComponent(certInput.trim())}`);
      const data = await res.json();

      if (data.success && data.verified) {
        setVerificationData(data.certificate);
        toast.success('Certificate Verified Successfully!');
      } else {
        setVerificationData({ error: data.error || 'Certificate ID not found' });
        toast.error('Verification Failed', { description: data.error });
      }
    } catch (err: any) {
      toast.error('Failed to connect to verification server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-scaleIn space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto shadow-2xs">
            <ShieldCheck size={26} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Verify Credential</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Enter an official Application Development Hub Certificate ID to verify authentic student participation.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={certInput}
              onChange={(e) => setCertInput(e.target.value)}
              placeholder="e.g. ADH-2026-AIH-00042"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'Verifying Credentials...' : 'Verify Certificate'}
          </button>
        </form>

        {verificationData && !verificationData.error && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 text-emerald-900 space-y-3 shadow-2xs animate-fadeIn">
            <div className="flex items-center gap-2 font-extrabold text-emerald-800 text-sm border-b border-emerald-200 pb-2">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <span>Credential Verified ✓</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-emerald-700 font-medium">Certificate ID:</span>
                <span className="font-mono font-bold">{verificationData.certificateId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700 font-medium">Student Name:</span>
                <span className="font-bold text-slate-900">{verificationData.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700 font-medium">Student ID:</span>
                <span className="font-mono">{verificationData.studentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700 font-medium">Event:</span>
                <span className="font-bold text-slate-900">{verificationData.eventTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700 font-medium">Event Date:</span>
                <span>{verificationData.eventDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700 font-medium">Issued By:</span>
                <span className="font-semibold">{verificationData.organizer || 'Dept of CSE'}</span>
              </div>
            </div>
          </div>
        )}

        {verificationData?.error && (
          <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 text-rose-900 space-y-1.5 shadow-2xs animate-fadeIn">
            <div className="flex items-center gap-2 font-extrabold text-rose-800 text-sm">
              <AlertCircle size={18} className="text-rose-600" />
              <span>Certificate Not Found</span>
            </div>
            <p className="text-xs text-rose-700 font-medium">{verificationData.error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
