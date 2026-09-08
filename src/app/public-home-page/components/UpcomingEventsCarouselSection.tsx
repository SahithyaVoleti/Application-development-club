'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Event, REGISTERED_COUNTS } from '@/lib/mockData';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Zap,
  Hourglass,
  Code2,
  Play,
  Pause,
  CheckCircle2,
} from 'lucide-react';
import type { UserProfile } from '@/lib/workspaceData';

interface Props {
  events: Event[];
  onRegisterClick: (event: Event) => void;
  onViewDetails: (event: Event) => void;
  currentUser?: UserProfile | null;
  userRegistrations?: any[];
}

function formatDateFormatted(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

export default function UpcomingEventsCarouselSection({
  events,
  onRegisterClick,
  onViewDetails,
  currentUser,
  userRegistrations = [],
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Filter ONLY Upcoming Events (status !== 'COMPLETED')
  const upcomingEventsOnly = events.filter((e) => e.status !== 'COMPLETED');

  const filteredEvents = upcomingEventsOnly.filter((e) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'Hackathons' && e.category.toLowerCase().includes('hackathon')) ||
      (selectedCategory === 'Coding Challenges' &&
        (e.category.toLowerCase().includes('coding') || e.category.toLowerCase().includes('challenge'))) ||
      (selectedCategory === 'Workshops' &&
        (e.category.toLowerCase().includes('workshop') || e.category.toLowerCase().includes('fdp')));

    return matchesCategory;
  });

  // Duplicate items to ensure seamless infinite horizontal continuous marquee scrolling
  const displayEvents =
    filteredEvents.length > 0
      ? filteredEvents.length < 4
        ? [...filteredEvents, ...filteredEvents, ...filteredEvents, ...filteredEvents, ...filteredEvents, ...filteredEvents]
        : [...filteredEvents, ...filteredEvents, ...filteredEvents, ...filteredEvents]
      : [];

  const handleScrollLeft = () => {
    if (scrollTrackRef.current) {
      scrollTrackRef.current.scrollBy({ left: -420, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollTrackRef.current) {
      scrollTrackRef.current.scrollBy({ left: 420, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden border-b border-slate-200/80">
      <div className="max-w-[1450px] mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="px-3.5 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-mono font-bold uppercase tracking-widest inline-flex items-center gap-1.5 mb-3">
              <Sparkles size={13} className="text-sky-600" />
              <span>LIVE AUTO-SCROLLING UPCOMING EVENTS</span>
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Upcoming Events ({filteredEvents.length})
            </h2>
            <p className="text-slate-600 text-sm sm:text-base lg:text-lg mt-2 max-w-3xl leading-relaxed">
              Discover upcoming hackathons, coding competitions, and technology workshops open for registration.
            </p>
          </div>

          {/* Controls: Play/Pause Auto-scroll + Prev/Next Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAutoScrolling(!isAutoScrolling)}
              className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer flex items-center gap-2 text-xs font-bold"
              title={isAutoScrolling ? 'Pause Auto-Scroll' : 'Play Auto-Scroll'}
            >
              {isAutoScrolling ? (
                <>
                  <Pause size={16} className="text-sky-600" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <Play size={16} className="text-emerald-600 fill-emerald-600" />
                  <span className="hidden sm:inline">Auto Play</span>
                </>
              )}
            </button>

            <button
              onClick={handleScrollLeft}
              className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
              title="Previous Event"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={handleScrollRight}
              className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
              title="Next Event"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Full-Width Edge-to-Edge Continuous Auto-Scrolling Track */}
      <div
        ref={scrollTrackRef}
        className="w-full overflow-hidden overflow-x-auto scrollbar-hide scroll-smooth"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="flex gap-8 animate-continuous-marquee pb-6 pt-2"
          style={{
            animationPlayState: isAutoScrolling ? (isHovered ? 'paused' : 'running') : 'paused',
          }}
        >
            {displayEvents.map((item, idx) => {
              const capacity = item.capacity || (item as any).max_participants || 150;
              const registeredCount =
                (item as any).registeredCount !== undefined
                  ? (item as any).registeredCount
                  : REGISTERED_COUNTS[item.id] || 0;
              const availableSeats =
                (item as any).availableSeats !== undefined
                  ? (item as any).availableSeats
                  : Math.max(0, capacity - registeredCount);
              const isFull = availableSeats <= 0 || registeredCount >= capacity;

              // Check duplicate registration for current student
              const isAlreadyRegistered = userRegistrations.some(
                (r) => r.eventId === item.id || (r.eventTitle && r.eventTitle === item.title)
              );

              let statusBadge = isFull ? '🔴 Event Full' : '🟢 Registration Open';
              let statusStyle = isFull
                ? 'bg-rose-500 text-white border-rose-400'
                : 'bg-emerald-500 text-white border-emerald-400';

              if (item.status === 'REGISTRATION_CLOSED') {
                statusBadge = '🟡 Reg. Closed';
                statusStyle = 'bg-amber-500 text-white border-amber-400';
              }

              const fillPct = Math.min(100, Math.round((registeredCount / capacity) * 100));

              return (
                <div
                  key={`upcoming-card-${item.id}-${idx}`}
                  className="w-[380px] sm:w-[420px] lg:w-[450px] flex-shrink-0 bg-white rounded-3xl border border-slate-200/90 overflow-hidden hover:border-sky-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Event Poster */}
                    <div className="relative w-full h-60 sm:h-64 bg-slate-950 overflow-hidden">
                      {/* Clean Edge-to-Edge Poster Display without overlay badges */}
                      <Image
                        src={item.posterUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'}
                        alt=""
                        fill
                        className="object-cover blur-2xl opacity-35 scale-110 pointer-events-none"
                      />
                      <Image
                        src={item.posterUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'}
                        alt={item.title}
                        fill
                        className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Card Content */}
                    <div className="p-6 space-y-4">
                      {/* Clean Category & Status Header */}
                      <div className="flex items-center justify-between text-xs font-bold gap-2">
                        <span className="text-sky-600 font-mono uppercase tracking-wider">{item.category}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${statusStyle}`}>
                          {statusBadge}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug line-clamp-2 group-hover:text-sky-600 transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-sky-600 shrink-0" />
                          <span>{formatDateFormatted(item.date)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} className="text-indigo-600 shrink-0" />
                          <span>{item.startTime}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <MapPin size={14} className="text-indigo-600 shrink-0" />
                        <span className="truncate">{item.venue}</span>
                      </div>

                      {/* Dynamic Seat & Registration Capacity Stats */}
                      <div className="pt-4 border-t border-slate-100 space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono font-bold">
                          <span className="text-slate-700">
                            Registered: <span className="text-sky-600 font-extrabold">{registeredCount}</span> / {capacity}
                          </span>
                          <span className={availableSeats <= 5 ? 'text-rose-600 font-extrabold' : 'text-emerald-600 font-extrabold'}>
                            Available Seats: {availableSeats}
                          </span>
                        </div>

                        {/* Seat utilization progress bar */}
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 rounded-full ${
                              isFull
                                ? 'bg-rose-500'
                                : availableSeats <= 10
                                ? 'bg-amber-500'
                                : 'bg-gradient-to-r from-sky-500 to-indigo-600'
                            }`}
                            style={{ width: `${fillPct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="p-6 pt-0 flex items-center gap-3">
                      <button
                        onClick={() => onViewDetails(item)}
                        className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-colors cursor-pointer text-center"
                      >
                        View Details
                      </button>

                      {isAlreadyRegistered ? (
                        <button
                          disabled
                          className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 text-white font-extrabold text-xs sm:text-sm cursor-not-allowed text-center shadow-sm flex items-center justify-center gap-1"
                        >
                          <CheckCircle2 size={16} />
                          <span>Registered ✓</span>
                        </button>
                      ) : isFull ? (
                        <button
                          disabled
                          className="flex-1 py-3 px-4 rounded-xl bg-slate-200 text-slate-500 font-extrabold text-xs sm:text-sm cursor-not-allowed text-center"
                        >
                          Event Full
                        </button>
                      ) : (
                        <button
                          onClick={() => onRegisterClick(item)}
                          className="flex-1 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs sm:text-sm transition-colors cursor-pointer text-center shadow-md"
                        >
                          Register Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
    </section>
  );
}
