'use client';
import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { AdminView } from '../page';
import { Event, Registration } from '@/lib/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import AdminEventFormModal from './AdminEventFormModal';
import AdminDeleteConfirm from './AdminDeleteConfirm';
import AdminEventRegistrationsModal from './AdminEventRegistrationsModal';
import { toast } from 'sonner';
import {
  Calendar,
  Users,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Plus,
  Activity,
  Trash2,
  Eye,
  Pencil,
  ShieldCheck,
  Clock,
  RefreshCw,
  AlertTriangle,
  FileText,
  UserCheck,
} from 'lucide-react';

const AdminOverviewCharts = dynamic(() => import('./AdminOverviewCharts'), { ssr: false });

interface Props {
  onNavigate: (view: AdminView) => void;
}

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('admin_token') || localStorage.getItem('adhub_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Count Up Animated Number Component with defensive fallback
function AnimatedCountUp({ target = 0, duration = 800 }: { target?: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const safeTarget = Math.max(0, target || 0);

  useEffect(() => {
    let start = 0;
    const steps = 25;
    const increment = safeTarget / steps;
    const intervalTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= safeTarget) {
        setCount(safeTarget);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [safeTarget, duration]);

  return <span>{count.toLocaleString()}</span>;
}

export default function AdminDashboardContent({ onNavigate }: Props) {
  const [eventsList, setEventsList] = useState<Event[]>([]);
  const [registrationsMap, setRegistrationsMap] = useState<Record<string, number>>({});
  const [recentRegistrations, setRecentRegistrations] = useState<Registration[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  
  const [dbStats, setDbStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    pastEvents: 0,
    totalRegistrations: 0,
    totalAttended: 0,
    totalAdmins: 0,
    activeAdmins: 0,
    pendingAdmins: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirmEvent, setDeleteConfirmEvent] = useState<Event | null>(null);
  const [viewRegistrationsEvent, setViewRegistrationsEvent] = useState<Event | null>(null);
  const [eventTab, setEventTab] = useState<'upcoming' | 'completed'>('upcoming');

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      setErrorMessage('');

      // 1. Fetch Events
      const eventsRes = await fetch('/api/events');
      const eventsData = await eventsRes.json();
      let fetchedEvents: Event[] = [];
      if (eventsData.success && Array.isArray(eventsData.data)) {
        fetchedEvents = eventsData.data;
      }
      setEventsList(fetchedEvents);

      // 2. Fetch Admin Stats & Metrics
      const statsRes = await fetch('/api/admin/stats');
      const statsData = await statsRes.json();
      if (statsData.success && statsData.stats) {
        setDbStats(statsData.stats);
        if (Array.isArray(statsData.recentActivity)) {
          setRecentActivity(statsData.recentActivity);
        }
        if (Array.isArray(statsData.recentRegistrations)) {
          setRecentRegistrations(statsData.recentRegistrations);
        }
      }

      // 3. Fetch All Registrations to compute dynamic per-event counts
      const regRes = await fetch('/api/registrations');
      const regData = await regRes.json();
      if (regData.success && Array.isArray(regData.data)) {
        const map: Record<string, number> = {};
        regData.data.forEach((r: Registration) => {
          if (r.eventId) {
            map[r.eventId] = (map[r.eventId] || 0) + 1;
          }
        });
        setRegistrationsMap(map);
      }
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setHasError(true);
      setErrorMessage(err?.message || 'Failed to load live database data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Dynamic Event Status Separation
  const nextUpcomingList = eventsList
    .filter((e) => {
      if (e.status === 'COMPLETED') return false;
      try {
        const d = new Date(e.date);
        d.setHours(23, 59, 59, 999);
        return d >= today;
      } catch {
        return true;
      }
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 8);

  const pastEventsList = eventsList
    .filter((e) => {
      if (e.status === 'COMPLETED') return true;
      try {
        const d = new Date(e.date);
        d.setHours(23, 59, 59, 999);
        return d < today;
      } catch {
        return false;
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  const handleDeleteEvent = async (event: Event) => {
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(`Event "${event.title}" deleted successfully`);
        fetchDashboardData();
      } else {
        toast.error(data.message || 'Failed to delete event');
      }
    } catch (err) {
      toast.error('Error deleting event');
    } finally {
      setDeleteConfirmEvent(null);
    }
  };

  const handleSaveEvent = async (data: Partial<Event>) => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (resData.success) {
        toast.success('Event saved successfully');
        fetchDashboardData();
      } else {
        toast.error(resData.message || 'Failed to save event');
      }
    } catch (e) {
      toast.error('Network error saving event');
    } finally {
      setShowAddModal(false);
    }
  };

  const [userRole, setUserRole] = useState<string>('ADMIN');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('adhub_admin_user');
      if (userStr) {
        try {
          const u = JSON.parse(userStr);
          if (u?.role) setUserRole(u.role);
        } catch (e) {}
      }
    }
  }, []);

  // Dynamic KPI Cards
  const isSuperAdmin = userRole === 'SUPER_ADMIN';

  const KPI_CARDS = [
    {
      id: 'kpi-total-events',
      label: 'Total Events',
      val: dbStats.totalEvents || eventsList.length,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200/80',
      sub: 'All registered events',
    },
    {
      id: 'kpi-upcoming-events',
      label: 'Upcoming Events',
      val: dbStats.upcomingEvents || nextUpcomingList.length,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200/80',
      sub: 'Active & scheduled',
    },
    {
      id: 'kpi-past-events',
      label: 'Past Events',
      val: dbStats.pastEvents || pastEventsList.length,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200/80',
      sub: 'Completed history',
    },
    {
      id: 'kpi-total-registrations',
      label: 'Total Registrations',
      val: dbStats.totalRegistrations,
      icon: Users,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200/80',
      sub: 'Across all events',
    },
    ...(isSuperAdmin
      ? [
          {
            id: 'kpi-total-admins',
            label: 'Total Admins',
            val: dbStats.totalAdmins,
            icon: ShieldCheck,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
            borderColor: 'border-indigo-200/80',
            sub: `${dbStats.activeAdmins} Approved Admins`,
          },
          {
            id: 'kpi-pending-admins',
            label: 'Pending Approvals',
            val: dbStats.pendingAdmins,
            icon: Clock,
            color: 'text-rose-600',
            bgColor: 'bg-rose-50',
            borderColor: 'border-rose-200/80',
            sub: dbStats.pendingAdmins > 0 ? 'Action required' : 'All clear',
          },
        ]
      : [
          {
            id: 'kpi-attended',
            label: 'Students Participated',
            val: dbStats.totalAttended,
            icon: ShieldCheck,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
            borderColor: 'border-indigo-200/80',
            sub: 'Verified attendance',
          },
        ]),
  ];

  if (hasError) {
    return (
      <div className="p-6 max-w-4xl mx-auto my-12 bg-white rounded-3xl border border-rose-200 shadow-xl text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Dashboard Loading Error</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">{errorMessage}</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition-all cursor-pointer"
        >
          <RefreshCw size={14} /> Retry Database Fetch
        </button>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-5 lg:p-6 max-w-[1550px] mx-auto space-y-4 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Admin Control Panel</span>
            {isLoading && <RefreshCw size={14} className="animate-spin text-blue-600" />}
          </h1>
          <p className="text-slate-500 text-xs font-medium mt-0.5">
            Application Development Club — Real-time event, registration, and governance statistics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSuperAdmin && (
            <button
              onClick={() => onNavigate('approvals')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-extrabold transition-all cursor-pointer border border-indigo-200/80"
            >
              <UserCheck size={14} />
              <span>Manage Admins ({dbStats.pendingAdmins})</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('create-event')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-sm cursor-pointer"
          >
            <Plus size={14} />
            <span>Add New Event</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid (Requirement 8) */}
      <div className="grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {KPI_CARDS.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className={`w-7 h-7 rounded-lg ${card.bgColor} ${card.borderColor} border flex items-center justify-center`}>
                    <Icon size={14} className={card.color} />
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 font-bold">
                    0{idx + 1}
                  </span>
                </div>

                <div className="text-xl font-black text-slate-900 font-tabular leading-none tracking-tight mb-1">
                  <AnimatedCountUp target={card.val} />
                </div>

                <div className="text-[11px] font-extrabold text-slate-700 truncate">
                  {card.label}
                </div>
              </div>

              <div className="pt-1.5 mt-1.5 border-t border-slate-100 text-[9px] font-semibold text-slate-500 flex items-center gap-1 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                <span className="truncate">{card.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
            ANALYTICS OVERVIEW
          </h2>
          <button
            onClick={() => onNavigate('analytics')}
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Detailed Reports</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <AdminOverviewCharts />
      </div>

      {/* Events Table & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Events Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 border-b border-slate-100 bg-slate-50/50">
            {/* Upcoming vs Past Tabs */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setEventTab('upcoming')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  eventTab === 'upcoming'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                Upcoming Events ({nextUpcomingList.length})
              </button>
              <button
                onClick={() => setEventTab('completed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  eventTab === 'completed'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                Past Events ({pastEventsList.length})
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('events')}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>All Events ({eventsList.length})</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-mono uppercase font-bold text-[10px]">
                  <th className="px-3.5 py-2">Event Name</th>
                  <th className="px-3.5 py-2">Date & Time</th>
                  <th className="px-3.5 py-2">Venue</th>
                  <th className="px-3.5 py-2">Registrations</th>
                  <th className="px-3.5 py-2">Status</th>
                  <th className="px-3.5 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400 font-medium">
                      Loading database records...
                    </td>
                  </tr>
                ) : (eventTab === 'upcoming' ? nextUpcomingList : pastEventsList).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500 font-medium">
                      {eventTab === 'upcoming'
                        ? 'No upcoming events scheduled. Click "Add New Event" to create one.'
                        : 'No past events found in database.'}
                    </td>
                  </tr>
                ) : (
                  (eventTab === 'upcoming' ? nextUpcomingList : pastEventsList).map((event) => {
                    const regCount = registrationsMap[event.id] || 0;
                    return (
                      <tr key={`dash-${eventTab}-${event.id}`} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-3.5 py-2 font-bold text-slate-900">
                          <div className="line-clamp-1">{event.title}</div>
                          <div className="text-[10px] text-slate-500 font-mono font-normal">{event.category}</div>
                        </td>
                        <td className="px-3.5 py-2 text-slate-600 font-mono text-[11px]">
                          <div>{event.date}</div>
                          <div className="text-[10px] text-slate-400">{event.startTime || '09:00'}</div>
                        </td>
                        <td className="px-3.5 py-2 text-slate-600 font-medium text-[11px]">
                          <div className="truncate max-w-[110px]">{event.venue}</div>
                        </td>
                        <td className="px-3.5 py-2 font-bold text-slate-900 font-tabular text-[11px]">
                          <span className="text-blue-600">{regCount}</span> / {event.capacity || 150}
                        </td>
                        <td className="px-3.5 py-2">
                          <StatusBadge status={event.status} size="sm" />
                        </td>
                        <td className="px-3.5 py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setViewRegistrationsEvent(event)}
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer border border-blue-200/80"
                              title="View Event & Participants"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              onClick={() => onNavigate('events')}
                              className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors cursor-pointer border border-amber-200/80"
                              title="Edit Event"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmEvent(event)}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer border border-rose-200/80"
                              title="Delete Event"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Feed Column (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          {/* Recent Event Registrations Feed */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                <FileText size={14} className="text-amber-600" />
                <span>Recent Registrations</span>
              </h3>
              <button
                onClick={() => onNavigate('registrations')}
                className="text-[10px] font-bold text-blue-600 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {recentRegistrations.length === 0 ? (
                <div className="text-slate-400 text-center py-4 text-[11px]">
                  No recent registrations logged yet.
                </div>
              ) : (
                recentRegistrations.slice(0, 5).map((reg) => (
                  <div key={reg.id} className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-extrabold text-slate-900 truncate text-[11px]">{reg.studentName}</p>
                      <p className="text-[10px] text-slate-500 font-mono truncate">{reg.studentId} • {reg.department}</p>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 flex-shrink-0">
                      Registered
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* System Audit Activity Feed */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                <Activity size={14} className="text-blue-600" />
                <span>Recent Activity</span>
              </h3>
              <span className="text-[9px] font-mono text-emerald-600 font-bold uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live DB
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {recentActivity.length === 0 ? (
                <div className="text-slate-400 text-center py-4 text-[11px]">
                  System initialized and waiting for actions.
                </div>
              ) : (
                recentActivity.slice(0, 5).map((act: any) => (
                  <div key={act.id} className="flex gap-2.5 items-start">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      act.action === 'APPROVED' ? 'bg-emerald-500' : act.action === 'REJECTED' ? 'bg-rose-500' : 'bg-blue-500'
                    }`} />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-[11px] leading-tight">
                        {act.adminName || act.performedBy || 'Admin'} - {act.action}
                      </p>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {new Date(act.performedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <AdminEventFormModal
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveEvent}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmEvent && (
        <AdminDeleteConfirm
          event={deleteConfirmEvent}
          onConfirm={() => handleDeleteEvent(deleteConfirmEvent)}
          onCancel={() => setDeleteConfirmEvent(null)}
        />
      )}

      {/* View Event & Participants History Modal (Requirement 6) */}
      {viewRegistrationsEvent && (
        <AdminEventRegistrationsModal
          event={viewRegistrationsEvent}
          registeredCount={registrationsMap[viewRegistrationsEvent.id] || 0}
          onClose={() => setViewRegistrationsEvent(null)}
          onCountChange={() => fetchDashboardData()}
        />
      )}
    </div>
  );
}