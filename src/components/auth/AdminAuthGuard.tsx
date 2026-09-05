'use client';
import React, { useState, useEffect } from 'react';
import AdminLoginModal from '@/app/admin-dashboard/components/AdminLoginModal';

interface Props {
  children: React.ReactNode;
}

export default function AdminAuthGuard({ children }: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adhub_admin_token') : null;
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('adhub_admin_user') : null;
    
    if (!token || !userStr) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const user = JSON.parse(userStr);
      // STRICT ROLE & STATUS CHECK: Only SUPER_ADMIN or TRUSTED_ADMIN can enter Admin Panel
      const isAuthorizedAdmin =
        user.role === 'SUPER_ADMIN' ||
        (user.role === 'ADMIN' && user.status === 'TRUSTED_ADMIN');

      if (!isAuthorizedAdmin) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('adhub_admin_token');
          localStorage.removeItem('adhub_admin_user');
          sessionStorage.removeItem('adhub_admin_otp_verified');
        }
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLoginSuccess = (user: any) => {
    const isAuthorizedAdmin =
      user.role === 'SUPER_ADMIN' ||
      (user.role === 'ADMIN' && user.status === 'TRUSTED_ADMIN');

    if (isAuthorizedAdmin) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#1a3558] to-[#0f2040] flex items-center justify-center p-4">
        <AdminLoginModal onSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return <>{children}</>;
}
