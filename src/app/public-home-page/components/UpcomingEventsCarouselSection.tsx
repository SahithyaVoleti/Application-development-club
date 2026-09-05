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
} from 'lucide-react';

interface Props {
  events: Event[];
  onRegisterClick: (event: Event) => void;
  onViewDetails: (event: Event) => void;
}

function formatDateFormatted(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

export default function UpcomingEventsCarouselSection({ events, onRegisterClick, onViewDetails }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Filter ONLY Upcoming Events (status !== 'COMPLETED')
  const upcomingEventsOnly = events.filter(e => e.status !== 'COMPLETED');

  const filteredEvents = upcomingEventsOnly.filter(e => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'Hackathons' && e.category.toLowerCase().includes('hackathon')) ||
      (selectedCategory === 'Coding Challenges' && (e.category.toLowerCase().includes('coding') || e.category.toLowerCase().includes('challenge'))) ||
      (selectedCategory === 'Workshops' && (e.category.toLowerCase().includes('workshop') || e.category.toLowerCase().includes('fdp')));

    return matchesCategory;
  });

  // Continuous smooth auto-scrolling animation loop
  useEffect(() => {
    if (!isAutoScrolling || isHovered) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const scrollContainer = scrollTrackRef.current;
    if (!scrollContainer) return;

    const speed = 0.5; // pixels per frame

    const step = () => {
      if (scrollContainer) {
        if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 5) {
          scrollContainer.scrollLeft = 0;
        } else {
          scrollContainer.scrollLeft += speed;
        }
      }
      animationFrameRef.current = requestAnimationFrame(step);
    };

    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAutoScrolling, isHovered, filteredEvents]);

  const handleScrollLeft = () => {
    if (scrollTrackRef.current) {
      scrollTrackRef.current.scrollBy({ left: -380, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollTrackRef.current) {
      scrollTrackRef.current.scrollBy({ left: 380, behavior: 'smooth' });
    }
  };

  return (
    <section id="events" className="py-16 bg-slate-50 border-b border-slate-200/60 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 space-y-12">
        
        {/* UPCOMING EVENTS SCROLLING SECTION */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-extrabold text-blue-600 uppercase tracking-widest block mb-1">
                UPCOMING EVENTS & HACKATHONS
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Upcoming Events ({filteredEvents.length})
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                Discover upcoming hackathons, coding competitions, and technology workshops open for registration.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs text-xs font-bold flex-wrap">
                {['All', 'Hackathons', 'Coding Challenges', 'Workshops'].map(cat => (
                  <button
                    key={`cat-${cat}`}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Auto-Scroll Toggle & Manual Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAutoScrolling(prev => !prev)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    isAutoScrolling
                      ? 'bg-sky-600 text-white border-sky-500 shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
                  }`}
                  title={isAutoScrolling ? 'Pause Auto-Scroll' : 'Play Auto-Scroll'}
                >
                  {isAutoScrolling ? <Pause size={13} /> : <Play size={13} />}
                  <span className="hidden sm:inline">{isAutoScrolling ? 'Auto-Scrolling' : 'Paused'}</span>
                </button>

                <button
                  onClick={handleScrollLeft}
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-blue-600 hover:text-white transition-all shadow-2xs cursor-pointer"
                  title="Scroll Left"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  onClick={handleScrollRight}
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-blue-600 hover:text-white transition-all shadow-2xs cursor-pointer"
                  title="Scroll Right"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Continuous Auto-Scrolling Track for Upcoming Events */}
          <div
            className="relative overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-slate-50 to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-slate-50 to-transparent" />

            <div
              ref={scrollTrackRef}
              className="flex gap-6 overflow-x-auto no-scrollbar pb-4 pt-1"
              style={{ scrollBehavior: isAutoScrolling && !isHovered ? 'auto' : 'smooth' }}
            >
              {[...filteredEvents, ...filteredEvents].map((item, idx) => {
                const registeredCount = REGISTERED_COUNTS[item.id] || Math.floor(item.capacity * 0.8);
                let statusBadge = '🟢 Registration Open';
                let statusStyle = 'bg-emerald-500 text-white border-emerald-400';

                if (item.status === 'REGISTRATION_CLOSED') {
                  statusBadge = '🟡 Reg. Closed';
                  statusStyle = 'bg-amber-500 text-white border-amber-400';
                }

                return (
                  <div
                    key={`upcoming-card-${item.id}-${idx}`}
                    className="w-[360px] sm:w-[400px] flex-shrink-0 bg-white rounded-3xl border border-slate-200/90 overflow-hidden hover:border-sky-300 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Event Poster */}
                      <div className="relative w-full h-48 bg-slate-900 overflow-hidden">
                        <Image
                          src={item.posterUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-mono font-bold border border-white/20 truncate">
                            {item.category}
                          </span>

                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border backdrop-blur-md ${statusStyle}`}>
                            {statusBadge}
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-medium">
                          <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-0.5 rounded-lg backdrop-blur-xs font-bold">
                            <Calendar size={12} className="text-sky-400" />
                            <span>{formatDateFormatted(item.date)}</span>
                          </div>

                          <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-0.5 rounded-lg backdrop-blur-xs font-bold">
                            <Clock size={12} className="text-indigo-400" />
                            <span>{item.startTime}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 space-y-3">
                        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug line-clamp-2 group-hover:text-sky-600 transition-colors">
                          {item.title}
                        </h3>

                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>

                        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium">
                          <div className="flex items-center gap-1">
                            <Users size={13} className="text-sky-600" />
                            <span>{registeredCount} Participants</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Code2 size={13} className="text-indigo-600" />
                            <span>Venue: {item.venue}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="p-5 pt-0 flex items-center gap-2">
                      <button
                        onClick={() => onViewDetails(item)}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer text-center"
                      >
                        View Details
                      </button>

                      <button
                        onClick={() => onRegisterClick(item)}
                        className="flex-1 py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors cursor-pointer text-center shadow-xs"
                      >
                        Register Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
