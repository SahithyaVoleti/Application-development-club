'use client';
import React, { useState, useRef, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';
import StatusBadge from '@/components/ui/StatusBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import type { Event } from '@/lib/mockData';
import { REGISTERED_COUNTS, ATTENDED_COUNTS } from '@/lib/mockData';
import {
  Calendar,
  MapPin,
  Users,
  UserCheck,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  LayoutGrid,
  SlidersHorizontal,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  events: Event[];
  onViewDetails: (event: Event) => void;
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

export default function PastEventsSection({ events, onViewDetails }: Props) {
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Filter strictly Completed / Finished events
  const completedEventsOnly = events.filter(e => e.status === 'COMPLETED');

  // Auto-scrolling animation loop
  useEffect(() => {
    if (viewMode !== 'slider' || !isAutoScrolling || isHovered) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const speed = 0.5; // smooth pixels per frame

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
  }, [viewMode, isAutoScrolling, isHovered, events]);

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -420, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 420, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-white border-t border-slate-200/80 overflow-hidden" id="completed-events">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full px-3.5 py-1 text-xs font-mono font-extrabold uppercase tracking-widest mb-2">
              <CheckCircle2 size={14} className="text-emerald-600" /> ACCOMPLISHED DEPARTMENTAL EVENTS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Completed & Finished Events ({completedEventsOnly.length})
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Explore concluded hackathons, workshops, and student app expos — view attendance statistics, photo galleries, and certified outcomes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode & Auto-Scroll Controls */}
            <div className="flex items-center gap-2 bg-slate-100/80 border border-slate-200 rounded-xl p-1 shadow-2xs">
              {viewMode === 'slider' && (
                <button
                  onClick={() => setIsAutoScrolling(prev => !prev)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isAutoScrolling
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                  title={isAutoScrolling ? 'Pause Auto-Scroll' : 'Play Auto-Scroll'}
                >
                  {isAutoScrolling ? <Pause size={13} /> : <Play size={13} />}
                  <span className="hidden sm:inline">{isAutoScrolling ? 'Auto-Scrolling' : 'Paused'}</span>
                </button>
              )}

              <button
                onClick={() => setViewMode('slider')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'slider'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                }`}
                title="Scrolling View"
              >
                <SlidersHorizontal size={15} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                }`}
                title="Grid View"
              >
                <LayoutGrid size={15} />
              </button>
            </div>

            {/* Manual Navigation Arrows */}
            {viewMode === 'slider' && completedEventsOnly.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleScrollLeft}
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-emerald-600 hover:text-white transition-all shadow-2xs cursor-pointer"
                  title="Scroll Left"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={handleScrollRight}
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-emerald-600 hover:text-white transition-all shadow-2xs cursor-pointer"
                  title="Scroll Right"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        {viewMode === 'slider' ? (
          /* Auto-Scrolling Track for Completed Events */
          <div
            className="relative overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-white to-transparent" />

            <div
              ref={scrollRef}
              className="flex gap-6 pb-4 overflow-x-auto no-scrollbar scroll-smooth pt-1"
              style={{ scrollBehavior: isAutoScrolling && !isHovered ? 'auto' : 'smooth' }}
            >
              {completedEventsOnly.map(event => {
                const registered = REGISTERED_COUNTS[event.id] || Math.floor(event.capacity * 0.85);
                const attended = ATTENDED_COUNTS[event.id] || Math.floor(registered * 0.9);
                const attendanceRate = registered > 0 ? Math.round((attended / registered) * 100) : 92;

                return (
                  <div
                    key={`completed-${event.id}`}
                    className="w-[380px] sm:w-[420px] flex-shrink-0 bg-white rounded-3xl border border-slate-200/90 overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-emerald-300"
                  >
                    <div className="relative h-48 overflow-hidden bg-slate-900">
                      <AppImage
                        src={event.posterUrl}
                        alt={`Completed event photo for ${event.title}`}
                        fill
                        sizes="420px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                        <CategoryBadge category={event.category} />
                        <span className="px-2.5 py-1 rounded-full bg-slate-900/90 text-emerald-400 font-extrabold text-[10px] border border-emerald-500/30">
                          ⚫ COMPLETED
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-medium">
                        <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-0.5 rounded-lg backdrop-blur-xs font-bold">
                          <Calendar size={12} className="text-emerald-400" />
                          <span>{formatDate(event.date)}</span>
                        </div>

                        <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-0.5 rounded-lg backdrop-blur-xs font-bold">
                          <MapPin size={12} className="text-sky-400" />
                          <span>{event.venue}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-snug line-clamp-1 group-hover:text-emerald-600 transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                          {event.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100">
                        <div className="bg-emerald-50/60 rounded-xl p-2 text-center border border-emerald-100">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">Registered</div>
                          <div className="text-sm font-extrabold text-slate-900 font-tabular">{registered}</div>
                        </div>

                        <div className="bg-emerald-50/60 rounded-xl p-2 text-center border border-emerald-100">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">Attended</div>
                          <div className="text-sm font-extrabold text-emerald-700 font-tabular">{attended}</div>
                        </div>

                        <div className="bg-emerald-50/60 rounded-xl p-2 text-center border border-emerald-100">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">Attendance %</div>
                          <div className="text-sm font-extrabold text-purple-700 font-tabular">{attendanceRate}%</div>
                        </div>
                      </div>

                      <button
                        onClick={() => onViewDetails(event)}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <BarChart2 size={14} />
                        View Event Report & Outcomes
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Grid View Fallback */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedEventsOnly.map(event => {
              const registered = REGISTERED_COUNTS[event.id] || Math.floor(event.capacity * 0.85);
              const attended = ATTENDED_COUNTS[event.id] || Math.floor(registered * 0.9);
              const attendanceRate = registered > 0 ? Math.round((attended / registered) * 100) : 92;

              return (
                <div
                  key={`grid-completed-${event.id}`}
                  className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-md transition-all"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-900">
                    <AppImage
                      src={event.posterUrl}
                      alt={`Completed event photo for ${event.title}`}
                      fill
                      className="object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <CategoryBadge category={event.category} />
                      <StatusBadge status="COMPLETED" size="sm" />
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base leading-snug">{event.title}</h3>
                      <div className="text-xs text-slate-500 font-medium mt-1">{formatDate(event.date)} · {event.venue}</div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <div className="text-[10px] text-slate-400">Registered</div>
                        <div className="font-bold text-slate-900">{registered}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Attended</div>
                        <div className="font-bold text-emerald-700">{attended}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Turnout</div>
                        <div className="font-bold text-purple-700">{attendanceRate}%</div>
                      </div>
                    </div>

                    <button
                      onClick={() => onViewDetails(event)}
                      className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <BarChart2 size={14} /> View Details & Gallery
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}