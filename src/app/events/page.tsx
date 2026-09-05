'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PublicNavbar from '../public-home-page/components/PublicNavbar';
import PublicFooter from '../public-home-page/components/PublicFooter';
import ResourceBreadcrumbs from '../resources/components/ResourceBreadcrumbs';
import { MOCK_EVENTS, Event } from '@/lib/mockData';
import {
  Calendar,
  Search,
  MapPin,
  Clock,
  User,
  ArrowRight,
  Filter,
} from 'lucide-react';

export default function AllEventsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingList = MOCK_EVENTS.filter(e => {
    const d = new Date(e.date);
    d.setHours(0, 0, 0, 0);
    return e.status !== 'COMPLETED' && d >= today;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastList = MOCK_EVENTS.filter(e => {
    const d = new Date(e.date);
    d.setHours(0, 0, 0, 0);
    return e.status === 'COMPLETED' || d < today;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const currentList = activeTab === 'upcoming' ? upcomingList : pastList;

  const filteredEvents = currentList.filter(e => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((item) => (
            <div
              key={`all-event-${item.id}`}
              className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-card-hover hover:border-blue-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative w-full h-48 bg-slate-900 overflow-hidden">
                <Image
                  src={item.posterUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-mono font-bold">
                    {item.category}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    item.status === 'COMPLETED' ? 'bg-slate-800 text-slate-300' : 'bg-emerald-500 text-white'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 mb-2 leading-snug line-clamp-2 h-14 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 h-9 mb-4">
                    {item.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-500 mb-5">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-blue-600" />
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-sky-500" />
                      <span className="truncate">{item.venue}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/events/${item.id}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 btn-hover-premium group-hover:bg-blue-600 transition-colors shadow-xs"
                >
                  <span>View Event Details</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
