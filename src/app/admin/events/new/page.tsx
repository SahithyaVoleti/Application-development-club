'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';
import AdminSidebar from '../../../admin-dashboard/components/AdminSidebar';
import AdminCreateEventWorkspace from '../../../admin-dashboard/components/AdminCreateEventWorkspace';
import { Event } from '@/lib/mockData';
import { toast } from 'sonner';

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('admin_token') || localStorage.getItem('adhub_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function CreateEventPage() {
  const router = useRouter();

  const handleSave = async (eventData: Partial<Event>) => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(eventData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Event created successfully');
      } else {
        toast.success('Event created successfully');
      }
    } catch (e) {
      toast.error('Failed to create event');
    } finally {
      router.push('/admin-dashboard');
    }
  };

  const handleCancel = () => {
    router.push('/admin-dashboard');
  };

  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen bg-slate-50">
        <AdminSidebar activeView="events" onNavigate={() => router.push('/admin-dashboard')} onLogout={() => router.push('/')} />
        <main className="flex-1 min-w-0 overflow-auto">
          <AdminCreateEventWorkspace onCancel={handleCancel} onSave={handleSave} />
        </main>
      </div>
    </AdminAuthGuard>
  );
}
