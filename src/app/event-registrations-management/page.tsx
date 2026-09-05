'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';
import RegistrationsTable from './components/RegistrationsTable';
import RegistrationAnalytics from './components/RegistrationAnalytics';
import AttendanceSummary from './components/AttendanceSummary';
import { MOCK_EVENTS, REGISTERED_COUNTS } from '@/lib/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import { ArrowLeft, LayoutDashboard, ClipboardList, BarChart2, LogOut, Home } from 'lucide-react';

type TabView = 'registrations' | 'analytics';

export default function EventRegistrationsManagementPage() {
  const [selectedEventId, setSelectedEventId] = useState<string>(MOCK_EVENTS[0].id);
  const [activeTab, setActiveTab] = useState<TabView>('registrations');

  const selectedEvent = MOCK_EVENTS.find(e => e.id === selectedEventId)!;

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adhub_admin_token');
      localStorage.removeItem('adhub_admin_user');
      window.location.reload();
    }
  };

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-muted/30">
        {/* Top bar */}
        <header className="bg-white border-b border-border sticky top-0 z-30 shadow-card">
          <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/admin-dashboard" className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <ArrowLeft size={16} />
              </Link>
              <div className="flex items-center gap-2">
                <AppLogo size={28} />
                <span className="font-bold text-primary text-sm hidden sm:block">AppDevHub</span>
              </div>
              <span className="text-border">|</span>
              <span className="text-sm font-semibold text-foreground">Registrations Management</span>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/" className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-xs transition-colors flex items-center gap-1.5 shadow-2xs">
                <Home size={13} />
                Home
              </Link>
              <Link href="/admin-dashboard" className="btn-secondary text-xs py-1.5 px-3">
                <LayoutDashboard size={13} />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="btn-secondary text-xs py-1.5 px-3 text-red-600 hover:bg-red-50 border-red-200"
                title="Logout"
              >
                <LogOut size={13} />
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 py-6">
          {/* Event selector */}
          <div className="bg-white rounded-2xl border border-border p-5 shadow-card mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <label className="label-text mb-2">Select Event</label>
                <select
                  value={selectedEventId}
                  onChange={e => setSelectedEventId(e.target.value)}
                  className="input-field max-w-lg"
                >
                  {MOCK_EVENTS.map(event => (
                    <option key={`event-opt-${event.id}`} value={event.id}>
                      {event.title} — {event.date}
                    </option>
                  ))}
                </select>
              </div>
              {selectedEvent && (
                <div className="flex items-center gap-3 flex-shrink-0">
                  <StatusBadge status={selectedEvent.status} />
                  <div className="text-sm">
                    <span className="text-muted-foreground">Registered: </span>
                    <span className="font-bold text-foreground font-tabular">{REGISTERED_COUNTS[selectedEventId] || 0}</span>
                    <span className="text-muted-foreground"> / {selectedEvent.capacity}</span>
                  </div>
                </div>
              )}
            </div>

            {selectedEvent && (
              <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                {[
                  { label: 'Date', value: selectedEvent.date },
                  { label: 'Venue', value: selectedEvent.venue },
                  { label: 'Organizer', value: selectedEvent.organizer },
                  { label: 'Category', value: selectedEvent.category },
                ].map(item => (
                  <div key={`sel-${item.label}`}>
                    <span className="text-muted-foreground text-xs">{item.label}: </span>
                    <span className="font-medium text-foreground text-xs">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tab navigation */}
          <div className="flex border-b border-border mb-6 bg-white rounded-t-2xl px-2 pt-2">
            {([
              { key: 'registrations', label: 'Registrations & Attendance', icon: ClipboardList },
              { key: 'analytics', label: 'Analytics', icon: BarChart2 },
            ] as const).map(tab => (
              <button
                key={`reg-tab-${tab.key}`}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors rounded-t-lg ${
                  activeTab === tab.key
                    ? 'border-accent text-accent bg-blue-50/50' :'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'registrations' && (
            <>
              <AttendanceSummary eventId={selectedEventId} />
              <RegistrationsTable eventId={selectedEventId} />
            </>
          )}
          {activeTab === 'analytics' && (
            <RegistrationAnalytics eventId={selectedEventId} event={selectedEvent} />
          )}
        </div>
      </div>
    </AdminAuthGuard>
  );
}