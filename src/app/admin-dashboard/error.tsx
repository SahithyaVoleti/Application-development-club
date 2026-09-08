'use client';
import React, { useEffect } from 'react';
import { RefreshCw, AlertTriangle, LogOut } from 'lucide-react';

export default function AdminDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin Dashboard Error Boundary Caught:', error);
  }, [error]);

  const handleResetSession = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adhub_admin_token');
      localStorage.removeItem('adhub_admin_user');
      sessionStorage.removeItem('adhub_admin_otp_verified');
      window.location.href = '/admin-dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center space-y-5 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
          <AlertTriangle size={28} />
        </div>

        <div>
          <h2 className="text-xl font-black text-white">Dashboard Notice</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
            A temporary client view error occurred while rendering the dashboard.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={() => reset()}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <RefreshCw size={15} />
            <span>Try Again</span>
          </button>

          <button
            onClick={handleResetSession}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut size={15} />
            <span>Re-authenticate Session</span>
          </button>
        </div>
      </div>
    </div>
  );
}
