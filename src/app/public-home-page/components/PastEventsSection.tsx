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

    const speed = 0.18; // gentle, smooth pixels per frame

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
      scrollRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  if (completedEventsOnly.length === 0) {
    return null;
  }

  const marqueeEvents =
    completedEventsOnly.length < 6
      ? [...completedEventsOnly, ...completedEventsOnly, ...completedEventsOnly]
      : [...completedEventsOnly, ...completedEventsOnly];

  return (
    <section className="py-10 sm:py-14 bg-white border-t border-slate-200/80 overflow-hidden" id="completed-events">
      {/* Header */}
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-10 mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full px-3 py-0.5 text-[11px] font-mono font-extrabold uppercase tracking-wider mb-1.5">
              <CheckCircle2 size={13} className="text-emerald-600" /> Past Events
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Past Events & Outcomes ({completedEventsOnly.length})
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Explore past hackathons, workshops, and project expos — check turnout metrics, event reports, and certified outcomes.
            </p>
          </div>

          {/* Controls: Slider/Grid Toggle + Play/Pause + Arrows */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('slider')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  viewMode === 'slider' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Carousel View"
              >
                <SlidersHorizontal size={13} />
                <span className="hidden sm:inline">Carousel</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid View"
              >
                <LayoutGrid size={13} />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>

            {viewMode === 'slider' && (
              <>
                <button
                  onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                  className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-xs cursor-pointer text-xs font-bold flex items-center gap-1"
                  title={isAutoScrolling ? 'Pause Auto-Scroll' : 'Play Auto-Scroll'}
                >
                  {isAutoScrolling ? <Pause size={14} className="text-sky-600" /> : <Play size={14} className="text-emerald-600 fill-emerald-600" />}
                </button>

                <button
                  onClick={handleScrollLeft}
                  className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-xs cursor-pointer"
                  title="Previous"
                >
                  <ChevronLeft size={16} />
                </button>

                <button
                  onClick={handleScrollRight}
                  className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-xs cursor-pointer"
                  title="Next"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {viewMode === 'slider' ? (
        /* Compact Auto-Scrolling Track for Completed Events */
        <div
          ref={scrollRef}
          className="w-full overflow-x-auto scrollbar-hide scroll-smooth"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex gap-4 pb-4 pt-1 px-4 sm:px-6 lg:px-10">
            {marqueeEvents.map((event, idx) => {
              const registered = REGISTERED_COUNTS[event.id] || Math.floor(event.capacity * 0.85);
              const attended = ATTENDED_COUNTS[event.id] || Math.floor(registered * 0.9);
              const attendanceRate = registered > 0 ? Math.round((attended / registered) * 100) : 92;

              return (
                <div
                  key={`completed-${event.id}-${idx}`}
                  className="w-[280px] sm:w-[320px] lg:w-[340px] flex-shrink-0 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between p-3.5 group"
                >
                  <div>
                    {/* Compact Poster Container */}
                    <div className="relative h-40 sm:h-44 overflow-hidden rounded-xl bg-slate-950 border border-slate-800 shadow-xs mb-3">
                      <AppImage
                        src={event.posterUrl}
                        alt=""
                        fill
                        className="object-cover blur-xl opacity-35 scale-110 pointer-events-none"
                      />
                      <AppImage
                        src={event.posterUrl}
                        alt={`Past event poster for ${event.title}`}
                        fill
                        sizes="340px"
                        className="object-contain p-1.5 transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-900/80 text-emerald-400 px-2 py-0.5 rounded-md backdrop-blur-xs border border-emerald-500/30">
                          {event.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-extrabold backdrop-blur-xs">
                          Completed
                        </span>
                      </div>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-emerald-600 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 mt-2.5 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} className="text-emerald-600 shrink-0" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-1 truncate max-w-[140px]">
                        <MapPin size={12} className="text-sky-600 shrink-0" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-1.5 py-2 my-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                      <div>
                        <div className="text-[9px] text-slate-400 font-bold uppercase">Regs</div>
                        <div className="text-xs font-extrabold text-slate-900 font-tabular">{registered}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-400 font-bold uppercase">Attended</div>
                        <div className="text-xs font-extrabold text-emerald-700 font-tabular">{attended}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-400 font-bold uppercase">Turnout</div>
                        <div className="text-xs font-extrabold text-purple-700 font-tabular">{attendanceRate}%</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onViewDetails(event)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <BarChart2 size={13} />
                    <span>View Report</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Compact Grid View */
        <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {completedEventsOnly.map(event => {
            const registered = REGISTERED_COUNTS[event.id] || Math.floor(event.capacity * 0.85);
            const attended = ATTENDED_COUNTS[event.id] || Math.floor(registered * 0.9);
            const attendanceRate = registered > 0 ? Math.round((attended / registered) * 100) : 92;

            return (
              <div
                key={`grid-completed-${event.id}`}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all p-3.5 group"
              >
                <div>
                  <div className="relative h-40 overflow-hidden rounded-xl bg-slate-950 mb-3">
                    <AppImage
                      src={event.posterUrl}
                      alt=""
                      fill
                      className="object-cover blur-xl opacity-35 scale-110 pointer-events-none"
                    />
                    <AppImage
                      src={event.posterUrl}
                      alt={`Completed event photo for ${event.title}`}
                      fill
                      className="object-contain p-1.5"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                      <CategoryBadge category={event.category} />
                      <StatusBadge status="COMPLETED" size="sm" />
                    </div>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-1">{event.title}</h3>
                  <div className="text-[11px] text-slate-500 font-medium mt-1">{formatDate(event.date)} · {event.venue}</div>

                  <div className="grid grid-cols-3 gap-1 py-2 my-2 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs">
                    <div>
                      <div className="text-[9px] text-slate-400">Regs</div>
                      <div className="font-bold text-slate-900">{registered}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-400">Attended</div>
                      <div className="font-bold text-emerald-700">{attended}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-400">Turnout</div>
                      <div className="font-bold text-purple-700">{attendanceRate}%</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onViewDetails(event)}
                  className="w-full py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <BarChart2 size={13} /> View Details & Report
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}