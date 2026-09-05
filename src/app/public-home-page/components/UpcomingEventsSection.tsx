'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { type Event, type EventStatus } from '@/lib/mockData';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Tag,
} from 'lucide-react';

interface Props {
  events?: Event[];
  liveCounts?: Record<string, number>;
  onRegisterClick?: (event: Event) => void;
  onViewDetails?: (event: Event) => void;
}

const CATEGORY_FILTERS = [
  'All',
  'Workshops',
  'Hackathons',
  'Seminars',
  'Competitions',
  'Conferences',
];

// Helper: Calculate relative date badge (Today, Tomorrow, In X days)
function getRelativeDateLabel(dateStr: string): { label: string; isHot: boolean } {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDate = new Date(dateStr);
    eventDate.setHours(0, 0, 0, 0);

    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: 'Past Event', isHot: false };
    if (diffDays === 0) return { label: 'Today', isHot: true };
    if (diffDays === 1) return { label: 'Tomorrow', isHot: true };
    if (diffDays <= 7) return { label: `In ${diffDays} days`, isHot: true };
    return { label: `In ${diffDays} days`, isHot: false };
  } catch (e) {
    return { label: dateStr, isHot: false };
  }
}

// Helper: Format month & day for card date badge
function parseDateBadge(dateStr: string) {
  try {
    const d = new Date(dateStr);
    const month = d.toLocaleString('default', { month: 'short' }).toUpperCase();
    const day = d.getDate().toString().padStart(2, '0');
    return { month, day };
  } catch (e) {
    return { month: 'FEB', day: '15' };
  }
}

// Helper: Determine Registration Status Pill
function getRegistrationStatusPill(event: Event, currentCount: number) {
  if (currentCount >= event.capacity) {
    return { label: 'Full', color: 'bg-rose-100 text-rose-800 border-rose-200' };
  }
  if (event.status === 'REGISTRATION_CLOSED') {
    return { label: 'Registration Closed', color: 'bg-slate-100 text-slate-700 border-slate-200' };
  }
  
  // Check if deadline is within 3 days
  const deadline = new Date(event.registrationDeadline);
  const now = new Date();
  const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 3600 * 24));
  
  if (diffDays > 0 && diffDays <= 3) {
    return { label: 'Closing Soon', color: 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse' };
  }
  
  return { label: 'Registration Open', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
}

export default function UpcomingEventsSection({
  events: initialEvents,
  liveCounts = {},
  onRegisterClick,
  onViewDetails,
}: Props) {
  const [eventsData, setEventsData] = useState<Event[]>(initialEvents || []);
  const [loading, setLoading] = useState<boolean>(!initialEvents || initialEvents.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; scrollLeft: number } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Section 14 & 15: Fetch from real backend API if initialEvents not passed
  const fetchUpcomingEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error('HTTP error ' + res.status);
      const data = await res.json();
      if (data.events) {
        setEventsData(data.events);
      } else if (Array.isArray(data)) {
        setEventsData(data);
      }
    } catch (err: any) {
      console.error('Failed fetching events:', err);
      // Fallback to initial events if available
      if (initialEvents && initialEvents.length > 0) {
        setEventsData(initialEvents);
      } else {
        setError('Unable to load upcoming events.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialEvents || initialEvents.length === 0) {
      fetchUpcomingEvents();
    } else {
      setEventsData(initialEvents);
      setLoading(false);
    }
  }, [initialEvents]);

  // Section 10 & 23: Filter event.date >= today & sort nearest date first
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return eventsData
      .filter((e) => {
        // Filter out completed events or dates in past
        const eDate = new Date(e.date);
        eDate.setHours(0, 0, 0, 0);
        return e.status !== 'COMPLETED' && eDate >= today;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [eventsData]);

  // Section 9: Category Filter
  const filteredEvents = useMemo(() => {
    if (activeCategory === 'All') return upcomingEvents;
    
    return upcomingEvents.filter((e) => {
      const cat = e.category.toLowerCase();
      const title = e.title.toLowerCase();
      const target = activeCategory.toLowerCase();

      if (target === 'workshops') return cat.includes('workshop') || title.includes('workshop');
      if (target === 'hackathons') return cat.includes('hack') || title.includes('hack');
      if (target === 'seminars') return cat.includes('seminar') || title.includes('seminar');
      if (target === 'competitions') return cat.includes('contest') || cat.includes('competition') || title.includes('storm');
      if (target === 'conferences') return cat.includes('conference') || title.includes('conference');
      return cat.includes(target);
    });
  }, [upcomingEvents, activeCategory]);

  // Section 4 & 5: Auto-scroll Infinite Loop (8–12 seconds cycle, pause on hover)
  useEffect(() => {
    if (loading || filteredEvents.length === 0 || isHovered) return;

    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    const speed = 0.65; // GPU-friendly smooth speed

    const scrollStep = () => {
      if (scrollContainer) {
        // Seamless loop reset when reaching halfway of cloned items
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
        } else {
          scrollContainer.scrollLeft += speed;
        }
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);

    return () => cancelAnimationFrame(animationFrameId);
  }, [loading, filteredEvents, isHovered]);

  // Section 7: Manual Scroll Controls (Previous / Next)
  const handleScrollPrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -380, behavior: 'smooth' });
    }
  };

  const handleScrollNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 380, behavior: 'smooth' });
    }
  };

  // Section 8: Drag / Touch Swipe Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setDragStart({
      x: e.pageX - scrollRef.current.offsetLeft,
      scrollLeft: scrollRef.current.scrollLeft,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStart || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - dragStart.x) * 1.5;
    scrollRef.current.scrollLeft = dragStart.scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setDragStart(null);
  };

  // Duplicate items for seamless infinite marquee loop
  const displayCards = [...filteredEvents, ...filteredEvents];

  return (
    <section
      id="upcoming-events"
      className="py-20 bg-slate-50/70 border-b border-slate-200/60 relative overflow-hidden"
    >
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10">
        {/* Section Top Bar: Heading + Subtitle + Dynamic Event Count + View All */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 scroll-reveal">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold mb-3 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
              </span>
              <span>LIVE UPCOMING SCHEDULE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-2">
              Upcoming Events
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              Stay updated with the latest events, workshops, hackathons and activities.
            </p>
          </div>

          {/* Section 12 & 22: Dynamic Count & View All Link */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-extrabold text-xs shadow-2xs">
              {upcomingEvents.length} Upcoming Events
            </span>

            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 btn-hover-premium cursor-pointer group"
            >
              <span>View All Events</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Section 9: Category Filters & Manual Navigation Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 scroll-reveal delay-100">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORY_FILTERS.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={`filter-${cat}`}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                      : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Section 7: Manual Scroll Controls (Previous / Next) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleScrollPrev}
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
              title="Previous Event"
              aria-label="Previous event"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleScrollNext}
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
              title="Next Event"
              aria-label="Next event"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Section 15: Loading Skeleton State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
            {[1, 2, 3].map((n) => (
              <div key={`skeleton-${n}`} className="bg-white rounded-3xl p-6 border border-slate-200 animate-pulse space-y-4">
                <div className="flex justify-between items-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-200" />
                  <div className="w-24 h-6 rounded-full bg-slate-200" />
                </div>
                <div className="h-6 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="h-10 bg-slate-200 rounded-xl w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Section 15: Error State with Retry Button */}
        {!loading && error && (
          <div className="py-12 bg-white rounded-3xl border border-rose-200 text-center max-w-md mx-auto p-8 shadow-xs">
            <AlertCircle size={32} className="text-rose-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">{error}</h3>
            <p className="text-xs text-slate-500 mb-5">Could not fetch live schedule from backend events API.</p>
            <button
              onClick={fetchUpcomingEvents}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-blue-600 transition-colors cursor-pointer"
            >
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {/* Section 16: Empty State */}
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="py-16 bg-white rounded-3xl border border-slate-200 text-center max-w-lg mx-auto p-8 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <Calendar size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No upcoming events</h3>
            <p className="text-xs text-slate-500 mb-6">
              Check back soon for new workshops, hackathons and activities in {activeCategory}.
            </p>
            <button
              onClick={() => setActiveCategory('All')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-blue-600 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Section 3, 4, 5, 6, 8: Auto-Scrolling Horizontal Marquee Carousel */}
        {!loading && !error && filteredEvents.length > 0 && (
          <div
            className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none py-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              handleMouseUpOrLeave();
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
          >
            {/* Fade Edges Mask */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-slate-50 to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-slate-50 to-transparent" />

            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth py-2"
              style={{ scrollbarWidth: 'none' }}
            >
              {displayCards.map((event, idx) => {
                const { month, day } = parseDateBadge(event.date);
                const relDate = getRelativeDateLabel(event.date);
                const statusPill = getRegistrationStatusPill(event, liveCounts[event.id] || 0);

                return (
                  <div
                    key={`upcoming-card-${event.id}-${idx}`}
                    className="flex-shrink-0 w-[340px] sm:w-[380px] lg:w-[400px]"
                  >
                    {/* Section 2 & 17: Event Card Design & Hover Animations */}
                    <div
                      onClick={() => {
                        if (onViewDetails) onViewDetails(event);
                        else if (onRegisterClick) onRegisterClick(event);
                      }}
                      className="group bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover hover:border-blue-300 flex flex-col justify-between h-full cursor-pointer"
                    >
                      <div>
                        {/* Top Bar: Date Badge + Relative Label + Status Pill */}
                        <div className="flex items-center justify-between gap-3 mb-5">
                          <div className="flex items-center gap-3">
                            {/* Section 17: Date Badge with scale 1 -> 1.03 on hover */}
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex flex-col items-center justify-center text-center shadow-xs transition-transform duration-300 group-hover:scale-105">
                              <span className="text-[10px] font-mono font-bold leading-none uppercase tracking-wider opacity-90">
                                {month}
                              </span>
                              <span className="text-base font-extrabold leading-none mt-0.5 font-tabular">
                                {day}
                              </span>
                            </div>

                            <div>
                              <span className={`text-[11px] font-mono font-bold block ${relDate.isHot ? 'text-blue-600 font-extrabold' : 'text-slate-500'}`}>
                                {relDate.label}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {event.date}
                              </span>
                            </div>
                          </div>

                          {/* Registration Status Pill */}
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border font-mono ${statusPill.color}`}>
                            {statusPill.label}
                          </span>
                        </div>

                        {/* Event Category Tag */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono font-bold border border-slate-200/80 mb-3">
                          <Tag size={11} className="text-blue-600" />
                          <span>{event.category}</span>
                        </div>

                        {/* Title & Short Description */}
                        <h3 className="text-lg font-extrabold text-slate-900 mb-2 leading-snug line-clamp-2 h-14 group-hover:text-blue-600 transition-colors">
                          {event.title}
                        </h3>

                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 h-9 mb-5">
                          {event.description}
                        </p>

                        {/* Venue, Time & Organizer */}
                        <div className="space-y-2 mb-6 pt-4 border-t border-slate-100 text-xs text-slate-600">
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-blue-600 flex-shrink-0" />
                            <span className="truncate">{event.venue}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-sky-500 flex-shrink-0" />
                            <span>{event.startTime} - {event.endTime}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <User size={14} className="text-indigo-500 flex-shrink-0" />
                            <span className="truncate">{event.organizer}</span>
                          </div>
                        </div>
                      </div>

                      {/* View Event Button (Section 10 Micro-interaction) */}
                      <Link
                        href={`/events/${event.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onViewDetails) onViewDetails(event);
                        }}
                        className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 btn-hover-premium group-hover:bg-blue-600 shadow-xs cursor-pointer"
                      >
                        <span>View Event</span>
                        <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hover Paused Tooltip Indicator */}
            {isHovered && (
              <div className="absolute top-3 right-6 bg-slate-900/90 text-white text-[10px] font-mono px-3 py-1 rounded-full backdrop-blur-md border border-slate-700 shadow-md animate-fadeIn pointer-events-none z-20 flex items-center gap-1.5">
                <Sparkles size={11} className="text-sky-400" />
                <span>Auto-scroll paused on hover</span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}