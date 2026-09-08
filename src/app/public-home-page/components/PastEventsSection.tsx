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
      scrollRef.current.scrollBy({ left: -420, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 420, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-14 bg-white border-t border-slate-200/80 overflow-hidden" id="completed-events">
      {/* Header */}
      <div className="max-w-[1450px] mx-auto px-6 lg:px-10 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full px-4 py-1 text-xs font-mono font-extrabold uppercase tracking-widest mb-2">
              <CheckCircle2 size={14} className="text-emerald-600" /> PAST DEPARTMENTAL EVENTS
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
              Past Events ({completedEventsOnly.length})
            </h2>
            <p className="text-slate-600 text-sm sm:text-base lg:text-lg mt-2 max-w-3xl leading-relaxed">
              Explore past hackathons, technology workshops, and student app expos — view attendance statistics, photo galleries, and certified outcomes.
            </p>
          </div>
        </div>
      </div>

      {viewMode === 'slider' ? (
        /* Auto-Scrolling Track for Completed Events */
        <div
          className="w-full overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className="flex gap-10 animate-continuous-marquee pb-8 pt-4"
          >
              {[...completedEventsOnly, ...completedEventsOnly, ...completedEventsOnly].map((event, idx) => {
                const registered = REGISTERED_COUNTS[event.id] || Math.floor(event.capacity * 0.85);
                const attended = ATTENDED_COUNTS[event.id] || Math.floor(registered * 0.9);
                const attendanceRate = registered > 0 ? Math.round((attended / registered) * 100) : 92;

                return (
                  <div
                    key={`completed-${event.id}-${idx}`}
                    className="w-[520px] sm:w-[620px] lg:w-[720px] flex-shrink-0 bg-white rounded-[32px] border border-slate-200 shadow-lg overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-emerald-400 p-4 sm:p-5"
                  >
                    {/* Neatly Formatted Poster Container Frame */}
                    <div className="relative h-72 sm:h-80 lg:h-[360px] overflow-hidden rounded-[24px] bg-slate-950 border border-slate-800 shadow-md">
                      {/* Ambient Blurred Background */}
                      <AppImage
                        src={event.posterUrl}
                        alt=""
                        fill
                        className="object-cover blur-2xl opacity-35 scale-110 pointer-events-none"
                      />
                      {/* Full Un-cropped Poster */}
                      <AppImage
                        src={event.posterUrl}
                        alt={`Past event poster for ${event.title}`}
                        fill
                        sizes="720px"
                        className="object-contain p-2 transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                    </div>

                    <div className="p-8 flex flex-col flex-1 justify-between space-y-6">
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold mb-2">
                          <span className="text-emerald-700 font-mono uppercase tracking-wider">{event.category}</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold border border-emerald-300">
                            Completed Event
                          </span>
                        </div>
                        <h3 className="font-black text-slate-900 text-2xl sm:text-3xl leading-snug line-clamp-1 group-hover:text-emerald-600 transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-base text-slate-600 line-clamp-3 mt-3 leading-relaxed">
                          {event.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={15} className="text-emerald-600" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={15} className="text-sky-600" />
                          <span>{event.venue}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 py-3 border-y border-slate-100">
                        <div className="bg-emerald-50/70 rounded-2xl p-3 text-center border border-emerald-100">
                          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Registered</div>
                          <div className="text-base font-black text-slate-900 font-tabular mt-0.5">{registered}</div>
                        </div>

                        <div className="bg-emerald-50/70 rounded-2xl p-3 text-center border border-emerald-100">
                          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Attended</div>
                          <div className="text-base font-black text-emerald-700 font-tabular mt-0.5">{attended}</div>
                        </div>

                        <div className="bg-emerald-50/70 rounded-2xl p-3 text-center border border-emerald-100">
                          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Turnout %</div>
                          <div className="text-base font-black text-purple-700 font-tabular mt-0.5">{attendanceRate}%</div>
                        </div>
                      </div>

                      <button
                        onClick={() => onViewDetails(event)}
                        className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <BarChart2 size={16} />
                        View Event Report & Certified Outcomes
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
                  <div className="relative h-56 overflow-hidden bg-slate-950">
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
                      className="object-contain p-2"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
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
    </section>
  );
}