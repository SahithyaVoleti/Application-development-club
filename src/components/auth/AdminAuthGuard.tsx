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
      // Valid if SUPER_ADMIN or TRUSTED_ADMIN (or legacy status ACTIVE / undefined for seeded users)
      const isTrusted =
        user.role === 'SUPER_ADMIN' ||
        user.status === 'TRUSTED_ADMIN' ||
        user.status === 'ACTIVE' ||
        !user.status;

      setIsAuthenticated(isTrusted);
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLoginSuccess = (user: any) => {
    setIsAuthenticated(true);
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
