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
      scrollTrackRef.current.scrollBy({ left: -390, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollTrackRef.current) {
      scrollTrackRef.current.scrollBy({ left: 390, behavior: 'smooth' });
    }
  };

  return (
    <section id="events" className="py-10 sm:py-14 bg-slate-50 dark:bg-slate-950 relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Upcoming Events ({filteredEvents.length})
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Discover upcoming hackathons, coding competitions, and technology workshops open for registration.
            </p>
          </div>

          {/* Controls: Play/Pause Auto-scroll + Prev/Next Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoScrolling(!isAutoScrolling)}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title={isAutoScrolling ? 'Pause Auto-Scroll' : 'Play Auto-Scroll'}
            >
              {isAutoScrolling ? (
                <>
                  <Pause size={14} className="text-sky-600 dark:text-sky-400" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <Play size={14} className="text-emerald-600 fill-emerald-600" />
                  <span className="hidden sm:inline">Auto Play</span>
                </>
              )}
            </button>

            <button
              onClick={handleScrollLeft}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors shadow-2xs cursor-pointer"
              title="Previous Event"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={handleScrollRight}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors shadow-2xs cursor-pointer"
              title="Next Event"
            >
              <ChevronRight size={16} />
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
          className="flex gap-5 animate-continuous-marquee pb-4 pt-1"
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
                  className="w-[310px] sm:w-[360px] lg:w-[390px] flex-shrink-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden hover:border-sky-300 dark:hover:border-sky-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Event Poster */}
                    <div className="relative w-full h-44 sm:h-48 bg-slate-950 overflow-hidden">
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
                        className="object-contain p-1.5 transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-3">
                      {/* Clean Category & Status Header */}
                      <div className="flex items-center justify-between text-xs font-bold gap-2">
                        <span className="text-sky-600 dark:text-sky-400 font-mono uppercase tracking-wider text-[11px]">{item.category}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${statusStyle}`}>
                          {statusBadge}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-snug line-clamp-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-1">
                          <Calendar size={13} className="text-sky-600 dark:text-sky-400 shrink-0" />
                          <span>{formatDateFormatted(item.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={13} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                          <span>{item.startTime}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        <MapPin size={13} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <span className="truncate">{item.venue}</span>
                      </div>

                      {/* Dynamic Seat & Registration Capacity Stats */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                          <span className="text-slate-700 dark:text-slate-300">
                            Registered: <span className="text-sky-600 dark:text-sky-400 font-extrabold">{registeredCount}</span> / {capacity}
                          </span>
                          <span className={availableSeats <= 5 ? 'text-rose-600 dark:text-rose-400 font-extrabold' : 'text-emerald-600 dark:text-emerald-400 font-extrabold'}>
                            Seats: {availableSeats}
                          </span>
                        </div>

                        {/* Seat utilization progress bar */}
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
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
                    <div className="p-3.5 pt-0 flex items-center gap-2">
                      <button
                        onClick={() => onViewDetails(item)}
                        className="flex-1 py-2 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer text-center"
                      >
                        View Details
                      </button>

                      {isAlreadyRegistered ? (
                        <button
                          disabled
                          className="flex-1 py-2 px-2.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs cursor-not-allowed text-center shadow-xs flex items-center justify-center gap-1"
                        >
                          <CheckCircle2 size={14} />
                          <span>Registered ✓</span>
                        </button>
                      ) : isFull ? (
                        <button
                          disabled
                          className="flex-1 py-2 px-2.5 rounded-xl bg-slate-200 text-slate-500 font-extrabold text-xs cursor-not-allowed text-center"
                        >
                          Event Full
                        </button>
                      ) : (
                        <button
                          onClick={() => onRegisterClick(item)}
                          className="flex-1 py-2 px-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs transition-colors cursor-pointer text-center shadow-xs"
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
