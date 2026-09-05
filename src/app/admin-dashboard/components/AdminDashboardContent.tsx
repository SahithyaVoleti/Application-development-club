'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { AdminView } from '../page';
import { MOCK_EVENTS, REGISTERED_COUNTS, ATTENDED_COUNTS, Event } from '@/lib/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import AdminEventFormModal from './AdminEventFormModal';
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
} from 'lucide-react';

const AdminOverviewCharts = dynamic(() => import('./AdminOverviewCharts'), { ssr: false });

interface Props {
  onNavigate: (view: AdminView) => void;
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
  const [showAddModal, setShowAddModal] = useState(false);

  // Section 26 & 27: Dynamic Date Calculations
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

  // Next 5 upcoming events
  const nextUpcomingList = eventsList
    .filter((e) => {
      const d = new Date(e.date);
      d.setHours(0, 0, 0, 0);
      return e.status !== 'COMPLETED' && d >= today;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  // Handle Event Creation
  const handleSaveEvent = (data: Partial<Event>) => {
    const newEvent: Event = {
      ...(data as Event),
      id: `event-${Date.now()}`,
      status: 'UPCOMING',
      createdAt: new Date().toISOString(),
    };
    setEventsList((prev) => [newEvent, ...prev]);
    setShowAddModal(false);
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
      sub: '+3 this month',
    },
    {
      id: 'kpi-upcoming',
      label: 'Upcoming Events',
      val: upcomingEvents,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200/80',
      sub: 'Next: 10 Sep 2026',
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
      sub: '+124 this week',
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
    <div className="p-6 lg:p-10 max-w-[1450px] mx-auto space-y-9 font-sans">
      {/* Section 5 & 6: Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
            CSE Event Management — Monitor events, registrations and student participation from one place.
          </p>
        </div>

        {/* Section 19: Add New Event Button */}
        <button
          onClick={() => onNavigate('create-event')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 btn-hover-premium cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Event</span>
        </button>
      </div>

      {/* Section 7, 8, 9, 10: Responsive KPI Summary Cards (5 Cards in 1 Row) */}
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

      {/* Section 11, 12, 13, 14, 15: Analytics Section */}
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

      {/* Section 17 & 18: Upcoming Events Table + Recent Activity (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Section 17: Upcoming Events Table (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Upcoming Events
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Next {nextUpcomingList.length} scheduled CSE department events
              </p>
            </div>

            <button
              onClick={() => onNavigate('events')}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View All Events</span>
              <ArrowRight size={13} />
            </button>
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
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {nextUpcomingList.map((event) => {
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
                        <button
                          onClick={() => onNavigate('events')}
                          className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 18: Recent Activity Feed (4 Cols) */}
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
                  AI & ML Workshop registration opened
                </p>
                <span className="text-[10px] text-slate-400 font-mono">2 minutes ago</span>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-800">
                  New event <span className="font-mono text-blue-600 font-bold">LUDUSFORGE</span> created
                </p>
                <span className="text-[10px] text-slate-400 font-mono">15 minutes ago</span>
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

            <div className="flex gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-400 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-800">
                  Faculty Development Program (FDP) completed
                </p>
                <span className="text-[10px] text-slate-400 font-mono">1 day ago</span>
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
    </div>
  );
}