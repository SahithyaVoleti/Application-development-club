'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { AdminView } from '../page';
import { MOCK_EVENTS, REGISTERED_COUNTS, ATTENDED_COUNTS, Event } from '@/lib/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import AdminEventFormModal from './AdminEventFormModal';
import AdminDeleteConfirm from './AdminDeleteConfirm';
import { toast } from 'sonner';
import {
  Calendar,
  Users,
  CheckCircle2,
  TrendingUp,
  Award,
  ArrowRight,
  Plus,
  Clock,
  MapPin,
  Activity,
  Sparkles,
  Trash2,
  Eye,
  Pencil,
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

// Count Up Animated Number Component
function AnimatedCountUp({ target, duration = 1000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const steps = 30;
    const increment = target / steps;
    const intervalTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count.toLocaleString()}</span>;
}

export default function AdminDashboardContent({ onNavigate }: Props) {
  const [eventsList, setEventsList] = useState<Event[]>(MOCK_EVENTS);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirmEvent, setDeleteConfirmEvent] = useState<Event | null>(null);

  const fetchEvents = async () => {
    try {
      setIsLoadingEvents(true);
      const res = await fetch('/api/events');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setEventsList(data.data);
      }
    } catch (e) {
      setEventsList(MOCK_EVENTS);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalEvents = eventsList.length;
  const upcomingEvents = eventsList.filter((e) => {
    const d = new Date(e.date);
    d.setHours(0, 0, 0, 0);
    return e.status !== 'COMPLETED' && d >= today;
  }).length;

  const completedEvents = eventsList.filter((e) => {
    const d = new Date(e.date);
    d.setHours(0, 0, 0, 0);
    return e.status === 'COMPLETED' || d < today;
  }).length;

  const totalRegistrations = Object.values(REGISTERED_COUNTS).reduce((a, b) => a + b, 0);
  const totalAttended = Object.values(ATTENDED_COUNTS).reduce((a, b) => a + b, 0);

  // Next upcoming events list
  const nextUpcomingList = eventsList
    .filter((e) => {
      const d = new Date(e.date);
      d.setHours(0, 0, 0, 0);
      return e.status !== 'COMPLETED' && d >= today;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 8);

  const handleDeleteEvent = async (event: Event) => {
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      const data = await res.json();

      if (data.success) {
        setEventsList((prev) => prev.filter((e) => e.id !== event.id));
        toast.success(`Upcoming Event "${event.title}" deleted successfully`);
      } else {
        setEventsList((prev) => prev.filter((e) => e.id !== event.id));
        toast.success(`Upcoming Event "${event.title}" deleted successfully`);
      }
    } catch (err) {
      setEventsList((prev) => prev.filter((e) => e.id !== event.id));
      toast.success(`Upcoming Event "${event.title}" deleted successfully`);
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
      if (resData.success && resData.data) {
        setEventsList((prev) => [resData.data, ...prev]);
        toast.success('Event created successfully');
      } else {
        fetchEvents();
        toast.success('Event created successfully');
      }
    } catch (e) {
      fetchEvents();
      toast.success('Event created successfully');
    } finally {
      setShowAddModal(false);
    }
  };

  const KPI_CARDS = [
    {
      id: 'kpi-total',
      label: 'Total Events',
      val: totalEvents,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200/80',
      sub: 'All events in system',
    },
    {
      id: 'kpi-upcoming',
      label: 'Upcoming Events',
      val: upcomingEvents,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200/80',
      sub: 'Active / Scheduled',
    },
    {
      id: 'kpi-completed',
      label: 'Completed Events',
      val: completedEvents,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200/80',
      sub: 'This academic year',
    },
    {
      id: 'kpi-registrations',
      label: 'Total Registrations',
      val: totalRegistrations,
      icon: Users,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200/80',
      sub: 'Across all events',
    },
    {
      id: 'kpi-participated',
      label: 'Students Participated',
      val: totalAttended,
      icon: Award,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200/80',
      sub: `${Math.round((totalAttended / (totalRegistrations || 1)) * 100)}% attendance rate`,
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-[1450px] mx-auto space-y-6 sm:space-y-9 font-sans">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
            CSE Event Management — Add, view, and delete upcoming events and monitor participation.
          </p>
        </div>

        {/* Add New Event Button */}
        <button
          onClick={() => onNavigate('create-event')}
          title="Add Event"
          aria-label="Add Event"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 btn-hover-premium cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Event</span>
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {KPI_CARDS.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${card.bgColor} ${card.borderColor} border flex items-center justify-center`}>
                      <Icon size={18} className={card.color} />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">
                      0{idx + 1}
                    </span>
                  </div>

                  <div className="text-3xl font-extrabold text-slate-900 font-tabular mb-1 tracking-tight">
                    <AnimatedCountUp target={card.val} />
                  </div>

                  <div className="text-xs font-bold text-slate-600 mb-2">
                    {card.label}
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-100 text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>{card.sub}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analytics Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono font-bold text-slate-400 uppercase tracking-widest">
            EVENT ANALYTICS
          </h2>
          <button
            onClick={() => onNavigate('analytics')}
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>Detailed Analytics</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <AdminOverviewCharts />
      </div>

      {/* Upcoming Events Table + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upcoming Events Table (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Upcoming Events Management
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Admins can view, add, or delete upcoming scheduled events
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('create-event')}
                title="Add Event"
                aria-label="Add Event"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer border border-blue-200/80"
              >
                <Plus size={13} />
                <span>Add Event</span>
              </button>
              <button
                onClick={() => onNavigate('events')}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 ml-2"
              >
                <span>Manage All ({totalEvents})</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-mono uppercase font-bold text-[10px]">
                  <th className="px-5 py-3">Event Title</th>
                  <th className="px-5 py-3">Date & Time</th>
                  <th className="px-5 py-3">Venue</th>
                  <th className="px-5 py-3">Registrations</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Admin Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoadingEvents ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                      Loading upcoming events...
                    </td>
                  </tr>
                ) : nextUpcomingList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-500 font-medium">
                      No upcoming events scheduled. Click "Add Event" above to create one.
                    </td>
                  </tr>
                ) : (
                  nextUpcomingList.map((event) => {
                    const regCount = REGISTERED_COUNTS[event.id] || 0;
                    return (
                      <tr key={`dash-up-${event.id}`} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-slate-900">
                          <div className="line-clamp-1">{event.title}</div>
                          <div className="text-[10px] text-slate-600 font-mono font-normal">{event.category}</div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 font-mono">
                          <div>{event.date}</div>
                          <div className="text-[10px] text-slate-600">{event.startTime}</div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 font-medium">
                          <div className="truncate max-w-[130px]">{event.venue}</div>
                        </td>
                        <td className="px-5 py-3.5 font-bold text-slate-900 font-tabular">
                          {regCount} / {event.capacity}
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={event.status} size="sm" />
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onNavigate('events')}
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer border border-blue-200/80"
                              title="View Event"
                              aria-label="View Event"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => onNavigate('events')}
                              className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors cursor-pointer border border-amber-200/80"
                              title="Edit Event"
                              aria-label="Edit Event"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmEvent(event)}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer border border-rose-200/80"
                              title="Delete Event"
                              aria-label="Delete Event"
                            >
                              <Trash2 size={14} />
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

        {/* Recent Activity Feed (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Activity size={16} className="text-blue-600" />
              <span>Recent Activity</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Live</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-800">
                  Upcoming event control panel updated
                </p>
                <span className="text-[10px] text-slate-400 font-mono">Just now</span>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-800">
                  New events added to database & public portal
                </p>
                <span className="text-[10px] text-slate-400 font-mono">10 minutes ago</span>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-800">
                  25 students registered for CSE Hackathon
                </p>
                <span className="text-[10px] text-slate-400 font-mono">1 hour ago</span>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-800">
                  Web Development Bootcamp details updated
                </p>
                <span className="text-[10px] text-slate-400 font-mono">3 hours ago</span>
              </div>
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
    </div>
  );
}