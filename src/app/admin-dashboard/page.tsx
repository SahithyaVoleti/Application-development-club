'use client';
import React, { useState, useEffect } from 'react';
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';
import AdminSidebar from './components/AdminSidebar';
import AdminDashboardContent from './components/AdminDashboardContent';
import AdminEventsTable from './components/AdminEventsTable';
import AdminAnalytics from './components/AdminAnalytics';
import AdminCreateEventWorkspace from './components/AdminCreateEventWorkspace';
import AdminRegistrationsContent from './components/AdminRegistrationsContent';
import AdminLeaderboardModal from './components/AdminLeaderboardModal';
import AdminApprovalRequests from './components/AdminApprovalRequests';
import AdminOtpModal from './components/AdminOtpModal';
import { MOCK_EVENTS, Event } from '@/lib/mockData';
import { toast } from 'sonner';

export type AdminView = 'dashboard' | 'events' | 'analytics' | 'create-event' | 'registrations' | 'leaderboard' | 'approvals';

const PROTECTED_VIEWS: AdminView[] = ['create-event', 'registrations', 'leaderboard', 'approvals'];

export default function AdminDashboardPage() {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [editingEvent, setEditingEvent] = useState<Event | undefined>(undefined);

  // Security OTP Verification state
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState<boolean>(false);
  const [pendingView, setPendingView] = useState<AdminView | null>(null);
  const [actionName, setActionName] = useState<string>('Administrative Action');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const verified = sessionStorage.getItem('adhub_admin_otp_verified');
      if (verified === 'true') {
        setIsOtpVerified(true);
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adhub_admin_token');
      localStorage.removeItem('adhub_admin_user');
      sessionStorage.removeItem('adhub_admin_otp_verified');
      window.location.reload();
    }
  };

  const handleNavigate = (targetView: AdminView) => {
    // If navigating to protected view (Add Event, View/Download Reports, Leaderboard) and not verified yet
    if (PROTECTED_VIEWS.includes(targetView) && !isOtpVerified) {
      let desc = 'Access Protected View';
      if (targetView === 'create-event') desc = 'Add / Edit Events';
      if (targetView === 'registrations') desc = 'View & Download Event Reports';
      if (targetView === 'leaderboard') desc = 'Manage Event Leaderboards';

      setActionName(desc);
      setPendingView(targetView);
      setIsOtpModalOpen(true);
      return;
    }

    setActiveView(targetView);
  };

  const handleOtpVerified = () => {
    setIsOtpVerified(true);
    if (pendingView) {
      setActiveView(pendingView);
      setPendingView(null);
    }
  };

  const handleSaveEvent = (eventData: Partial<Event>) => {
    if (editingEvent) {
      toast.success('Event updated successfully');
    } else {
      const newEvent: Event = {
        ...(eventData as Event),
        id: `event-${Date.now()}`,
        status: eventData.status || 'UPCOMING',
        createdAt: new Date().toISOString(),
      };
      MOCK_EVENTS.unshift(newEvent);
      toast.success('Event created successfully');
    }
    setActiveView('events');
  };

  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen bg-slate-50 font-sans">
        <AdminSidebar activeView={activeView} onNavigate={handleNavigate} onLogout={handleLogout} />
        <main className="flex-1 min-w-0 overflow-auto">
          {activeView === 'dashboard' && <AdminDashboardContent onNavigate={handleNavigate} />}
          {activeView === 'events' && (
            <AdminEventsTable
              onNavigate={handleNavigate}
              onEditEvent={(event: Event) => {
                setEditingEvent(event);
                handleNavigate('create-event');
              }}
            />
          )}
          {activeView === 'analytics' && <AdminAnalytics />}
          {activeView === 'registrations' && <AdminRegistrationsContent />}
          {activeView === 'leaderboard' && (
            <AdminLeaderboardModal
              events={MOCK_EVENTS}
              onClose={() => setActiveView('dashboard')}
            />
          )}
          {activeView === 'create-event' && (
            <AdminCreateEventWorkspace
              eventToEdit={editingEvent}
              onCancel={() => {
                setEditingEvent(undefined);
                setActiveView('events');
              }}
              onSave={handleSaveEvent}
            />
          )}
          {activeView === 'approvals' && <AdminApprovalRequests />}
        </main>

        {/* Security OTP Verification Modal */}
        <AdminOtpModal
          actionName={actionName}
          isOpen={isOtpModalOpen}
          onClose={() => setIsOtpModalOpen(false)}
          onVerified={handleOtpVerified}
        />
      </div>
    </AdminAuthGuard>
  );
}