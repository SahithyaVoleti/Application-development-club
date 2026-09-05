'use client';
import React from 'react';
import type { Event } from '@/lib/mockData';
import CategoryBadge from '@/components/ui/CategoryBadge';
import { Calendar, MapPin, Sparkles, ArrowRight, Pause, Play } from 'lucide-react';

interface Props {
  events: Event[];
  liveCounts: Record<string, number>;
  onRegisterClick: (event: Event) => void;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

export default function AutoScrollEventsTicker({ events, liveCounts, onRegisterClick }: Props) {
  const [isPaused, setIsPaused] = React.useState(false);
  if (!events || events.length === 0) return null;

  // Duplicate items array for seamless looping animation
  const marqueeItems = [...events, ...events, ...events];

  return (
    <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white py-3 overflow-hidden border-y border-blue-500/20 shadow-inner relative group">
      {/* Ticker Header Badge */}
      <div className="w-full px-6 md:px-10 lg:px-16 mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Sparkles size={12} /> Live Auto-Scrolling Event Stream
          </span>
          <span className="hidden sm:inline-block text-[11px] text-blue-300/80 font-normal">
            (Hover over any event to pause)
          </span>
        </div>
        <button
          onClick={() => setIsPaused(prev => !prev)}
          className="flex items-center gap-1 text-xs font-medium text-blue-200 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full transition-all"
          title={isPaused ? 'Resume Scrolling' : 'Pause Scrolling'}
        >
          {isPaused ? <Play size={11} /> : <Pause size={11} />}
          <span>{isPaused ? 'Resume' : 'Pause'}</span>
        </button>
      </div>

      {/* Marquee Track */}
      <div className="overflow-hidden whitespace-nowrap relative">
        <div
          className={`inline-flex gap-4 animate-marquee transition-all ${isPaused ? '[animation-play-state:paused]' : ''}`}
        >
          {marqueeItems.map((event, index) => {
            const count = liveCounts[event.id] || 0;
            const seatsLeft = Math.max(0, event.capacity - count);

            return (
              <div
                key={`ticker-${event.id}-${index}`}
                className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/15 border border-white/15 hover:border-blue-400/50 rounded-xl px-4 py-2 text-xs transition-all duration-200 backdrop-blur-md flex-shrink-0 cursor-pointer"
                onClick={() => onRegisterClick(event)}
              >
                <CategoryBadge category={event.category} />
                
                <span className="font-bold text-white max-w-[180px] sm:max-w-[220px] truncate">
                  {event.title}
                </span>

                <div className="flex items-center gap-1 text-blue-200 text-[11px]">
                  <Calendar size={11} className="text-blue-400" />
                  <span>{formatDate(event.date)}</span>
                </div>

                <div className="hidden md:flex items-center gap-1 text-slate-300 text-[11px]">
                  <MapPin size={11} className="text-cyan-400" />
                  <span className="max-w-[100px] truncate">{event.venue}</span>
                </div>

                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                  {seatsLeft} seats left
                </span>

                <span className="text-blue-300 hover:text-white font-semibold flex items-center gap-0.5 text-[11px] underline underline-offset-2">
                  Register <ArrowRight size={10} />
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
