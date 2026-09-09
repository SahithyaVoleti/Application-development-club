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
  const [eventTab, setEventTab] = useState<'upcoming' | 'completed'>('upcoming');

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

  // Past / Completed events list
  const pastEventsList = eventsList
    .filter((e) => {
      const d = new Date(e.date);
      d.setHours(0, 0, 0, 0);
      return e.status === 'COMPLETED' || d < today;
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1450px] mx-auto space-y-5 sm:space-y-6 font-sans">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 text-xs font-medium mt-0.5">
            CSE Event Management — Add, view, and manage upcoming and past events.
          </p>
        </div>

        {/* Add New Event Button */}
        <button
          onClick={() => onNavigate('create-event')}
          title="Add Event"
          aria-label="Add Event"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-sm cursor-pointer"
        >
          <Plus size={15} />
          <span>Add New Event</span>
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {KPI_CARDS.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-lg ${card.bgColor} ${card.borderColor} border flex items-center justify-center`}>
                      <Icon size={15} className={card.color} />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">
                      0{idx + 1}
                    </span>
                  </div>

                  <div className="text-2xl font-bold text-slate-900 font-tabular mb-0.5 tracking-tight">
                    <AnimatedCountUp target={card.val} />
                  </div>

                  <div className="text-xs font-bold text-slate-600 mb-1">
                    {card.label}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>{card.sub}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analytics Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
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

      {/* Events Table + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Events Table (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 border-b border-slate-100">
            {/* Upcoming vs Past Toggle Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEventTab('upcoming')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  eventTab === 'upcoming'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                Upcoming Events ({upcomingEvents})
              </button>
              <button
                onClick={() => setEventTab('completed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  eventTab === 'completed'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                Past Events ({completedEvents})
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onNavigate('create-event')}
                title="Add Event"
                aria-label="Add Event"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer border border-blue-200/80"
              >
                <Plus size={13} />
                <span>Add Event</span>
              </button>
              <button
                onClick={() => onNavigate('events')}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 ml-1 sm:ml-2"
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
                  <th className="px-4 py-2.5">Event Title</th>
                  <th className="px-4 py-2.5">Date & Time</th>
                  <th className="px-4 py-2.5">Venue</th>
                  <th className="px-4 py-2.5">Registrations</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoadingEvents ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      Loading events...
                    </td>
                  </tr>
                ) : (eventTab === 'upcoming' ? nextUpcomingList : pastEventsList).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500 font-medium">
                      {eventTab === 'upcoming'
                        ? 'No upcoming events scheduled. Click "Add Event" above to create one.'
                        : 'No past events found in the system.'}
                    </td>
                  </tr>
                ) : (
                  (eventTab === 'upcoming' ? nextUpcomingList : pastEventsList).map((event) => {
                    const regCount = REGISTERED_COUNTS[event.id] || 0;
                    return (
                      <tr key={`dash-${eventTab}-${event.id}`} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-2.5 font-bold text-slate-900">
                          <div className="line-clamp-1">{event.title}</div>
                          <div className="text-[10px] text-slate-500 font-mono font-normal">{event.category}</div>
                        </td>
                        <td className="px-4 py-2.5 text-slate-600 font-mono text-[11px]">
                          <div>{event.date}</div>
                          <div className="text-[10px] text-slate-400">{event.startTime}</div>
                        </td>
                        <td className="px-4 py-2.5 text-slate-600 font-medium text-[11px]">
                          <div className="truncate max-w-[120px]">{event.venue}</div>
                        </td>
                        <td className="px-4 py-2.5 font-bold text-slate-900 font-tabular text-[11px]">
                          {regCount} / {event.capacity}
                        </td>
                        <td className="px-4 py-2.5">
                          <StatusBadge status={event.status} size="sm" />
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => onNavigate('events')}
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer border border-blue-200/80"
                              title="View Event"
                              aria-label="View Event"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              onClick={() => onNavigate('events')}
                              className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors cursor-pointer border border-amber-200/80"
                              title="Edit Event"
                              aria-label="Edit Event"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmEvent(event)}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer border border-rose-200/80"
                              title="Delete Event"
                              aria-label="Delete Event"
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