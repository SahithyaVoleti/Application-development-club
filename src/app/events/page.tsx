'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PublicNavbar from '../public-home-page/components/PublicNavbar';
import PublicFooter from '../public-home-page/components/PublicFooter';
import ResourceBreadcrumbs from '../resources/components/ResourceBreadcrumbs';
import { MOCK_EVENTS, REGISTERED_COUNTS, Event } from '@/lib/mockData';
import {
  Calendar,
  Search,
  MapPin,
  Clock,
  User,
  Users,
  ArrowRight,
  Filter,
  Sparkles,
} from 'lucide-react';

export default function AllEventsPage() {
  const [eventsList, setEventsList] = useState<Event[]>(MOCK_EVENTS);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadEvents() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/events?filter=published');
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setEventsList(data.data);
        }
      } catch (e) {
        console.error('Failed to load events', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadEvents();
  }, []);

  const now = new Date();

  // Upcoming events: published events whose date & end time is >= now or status !== COMPLETED
  const upcomingList = eventsList
    .filter((e) => {
      if ((e as any).isPublished === false) return false;
      const endDateTime = new Date(`${e.date}T${e.endTime || '23:59'}:00`);
      if (!isNaN(endDateTime.getTime())) {
        return now <= endDateTime && e.status !== 'COMPLETED';
      }
      return e.status !== 'COMPLETED';
    })
    .sort((a, b) => new Date(`${a.date}T${a.startTime || '00:00'}`).getTime() - new Date(`${b.date}T${b.startTime || '00:00'}`).getTime());

  // Past events: published events whose date & end time < now or status === COMPLETED
  const pastList = eventsList
    .filter((e) => {
      if ((e as any).isPublished === false) return false;
      const endDateTime = new Date(`${e.date}T${e.endTime || '23:59'}:00`);
      if (!isNaN(endDateTime.getTime())) {
        return now > endDateTime || e.status === 'COMPLETED';
      }
      return e.status === 'COMPLETED';
    })
    .sort((a, b) => new Date(`${b.date}T${b.startTime || '00:00'}`).getTime() - new Date(`${a.date}T${a.startTime || '00:00'}`).getTime());

  const currentList = activeTab === 'upcoming' ? upcomingList : pastList;

  const filteredEvents = currentList.filter((e) => {
    const matchesSearch =
      !searchQuery ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.venue.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      e.category.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <PublicNavbar />

      <main className="flex-1 pt-28 pb-20 max-w-screen-2xl mx-auto px-6 lg:px-10 w-full">
        {/* Breadcrumb Navigation */}
        <ResourceBreadcrumbs
          backHref="/"
          backLabel="Back to Home"
          items={[{ label: 'CSE Events Portal' }]}
        />

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 text-white rounded-3xl p-8 sm:p-12 mb-12 shadow-xl">
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-bold text-sky-300 uppercase tracking-widest block mb-3">
              CSE EVENTS & ACTIVITIES PORTAL
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
              Events & Hackathons
            </h1>
            <p className="text-blue-100 text-base leading-relaxed">
              Discover technical workshops, 24-hour hackathons, coding contests, seminars, and faculty development programs.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Tabs: Upcoming vs Past */}
          <div className="flex items-center gap-2 bg-slate-200/80 p-1.5 rounded-2xl border border-slate-300/60">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'upcoming'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Upcoming Events ({upcomingList.length})
            </button>

            <button
              onClick={() => setActiveTab('past')}
              className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'past'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Past Events ({pastList.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative max-w-sm w-full">
            <Search size={16} className="absolute left-4 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events by name, venue..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-medium text-slate-500">Loading events catalog...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center my-8">
            <div className="text-4xl mb-3">🗓️</div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No events found</h3>
            <p className="text-xs text-slate-500">There are no {activeTab} events matching your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((item) => {
              const capacity = item.capacity || (item as any).max_participants || 150;
              const registeredCount = (item as any).registeredCount !== undefined
                ? (item as any).registeredCount
                : REGISTERED_COUNTS[item.id] || 0;
              const availableSeats = (item as any).availableSeats !== undefined
                ? (item as any).availableSeats
                : Math.max(0, capacity - registeredCount);
              const fillPct = Math.min(100, Math.round((registeredCount / capacity) * 100));

              return (
                <div
                  key={`all-event-${item.id}`}
                  className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-card-hover hover:border-blue-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative w-full h-56 bg-slate-950 overflow-hidden">
                    <Image
                      src={item.posterUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'}
                      alt=""
                      fill
                      className="object-cover blur-xl opacity-35 scale-110 pointer-events-none"
                    />
                    <Image
                      src={item.posterUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'}
                      alt={item.title}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold mb-2">
                        <span className="text-blue-600 font-mono uppercase tracking-wider">{item.category}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'COMPLETED' ? 'bg-slate-100 text-slate-700' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-extrabold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                        {item.description}
                      </p>
                    </div>

                    <div className="space-y-2 text-xs text-slate-500 pt-3 border-t border-slate-100 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-blue-600 shrink-0" />
                        <span>
                          {item.date} ({item.startTime} - {item.endTime})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-indigo-600 shrink-0" />
                        <span className="truncate">{item.venue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-amber-600 shrink-0" />
                        <span className="truncate">{item.organizer}</span>
                      </div>
                    </div>

                    {/* Seat & Registration Stats */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px] font-mono font-bold">
                      <div className="flex items-center justify-between text-slate-700">
                        <span>Registered: <span className="text-blue-600">{registeredCount}</span> / {capacity}</span>
                        <span className={availableSeats <= 5 ? 'text-rose-600' : 'text-emerald-600'}>
                          Available: {availableSeats}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all"
                          style={{ width: `${fillPct}%` }}
                        />
                      </div>
                    </div>

                    <Link
                      href={`/events/${item.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-sm group-hover:shadow-md"
                    >
                      <span>View Event Details</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
