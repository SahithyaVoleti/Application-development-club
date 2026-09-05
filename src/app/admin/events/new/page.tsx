'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';
import AdminSidebar from '../../../admin-dashboard/components/AdminSidebar';
import AdminCreateEventWorkspace from '../../../admin-dashboard/components/AdminCreateEventWorkspace';
import { MOCK_EVENTS, Event } from '@/lib/mockData';
import { toast } from 'sonner';

export default function CreateEventPage() {
  const router = useRouter();

  const handleSave = (eventData: Partial<Event>) => {
    const newEvent: Event = {
      ...(eventData as Event),
      id: `event-${Date.now()}`,
      status: eventData.status || 'UPCOMING',
      createdAt: new Date().toISOString(),
    };
    MOCK_EVENTS.unshift(newEvent);
    toast.success('Event created successfully');
    router.push('/admin-dashboard');
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
