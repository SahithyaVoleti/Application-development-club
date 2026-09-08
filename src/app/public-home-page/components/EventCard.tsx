'use client';
import React from 'react';
import AppImage from '@/components/ui/AppImage';
import StatusBadge from '@/components/ui/StatusBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import type { Event } from '@/lib/mockData';
import { Calendar, Clock, MapPin, Users, ArrowRight, AlertCircle } from 'lucide-react';

interface Props {
  event: Event;
  registeredCount: number;
  onRegisterClick: (event: Event) => void;
}

function getFormattedDateParts(dateStr: string) {
  const d = new Date(dateStr);
  const day = d.getDate();
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const year = d.getFullYear();
  const full = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  return { day, month, year, full };
}

function formatDeadline(deadlineStr: string) {
  const d = new Date(deadlineStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function EventCard({ event, registeredCount, onRegisterClick }: Props) {
  const dateParts = getFormattedDateParts(event.date);
  const fillPct = Math.min(100, Math.round((registeredCount / event.capacity) * 100));
  const isFull = registeredCount >= event.capacity;
  const isClosed = event.status === 'REGISTRATION_CLOSED' || event.status === 'COMPLETED';

  return (
    <div
      onClick={() => onRegisterClick(event)}
      className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-sky-500/15 hover:border-sky-300 h-full cursor-pointer"
    >
      {/* Poster Image & Badges Overlay */}
      <div className="relative h-60 overflow-hidden bg-slate-950">
        <AppImage
          src={event.posterUrl}
          alt=""
          fill
          className="object-cover blur-xl opacity-35 scale-110 pointer-events-none"
        />
        <AppImage
          src={event.posterUrl}
          alt={`Event poster for ${event.title} — ${event.category}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center justify-between text-xs font-bold gap-2 mb-2">
          <span className="text-sky-600 font-mono uppercase tracking-wider">{event.category}</span>
          <StatusBadge status={event.status} size="sm" />
        </div>
        <h3 className="font-extrabold text-stone-900 text-lg leading-snug mb-2 line-clamp-2 tracking-tight group-hover:text-sky-600 transition-colors">
          {event.title}
        </h3>
        <p className="text-stone-500 text-xs leading-relaxed mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Event Meta Information */}
        <div className="space-y-2 mb-5 p-3 rounded-2xl bg-sky-50/50 border border-sky-100/60">
          <div className="flex items-center gap-2 text-xs text-stone-600 font-medium">
            <Clock size={13} className="text-sky-500 flex-shrink-0" />
            <span>{event.startTime} – {event.endTime}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-600 font-medium">
            <MapPin size={13} className="text-sky-500 flex-shrink-0" />
            <span className="line-clamp-1">{event.venue}</span>
          </div>
        </div>

        {/* Registration Progress */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-stone-500 font-semibold">Seat Occupancy</span>
            <span className={`font-tabular ${fillPct >= 90 ? 'text-red-500' : 'text-sky-600'}`}>
              {fillPct}%
            </span>
          </div>
          <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                fillPct >= 90 ? 'bg-red-500' : fillPct >= 70 ? 'bg-amber-400' : 'bg-gradient-to-r from-sky-500 to-blue-500'
              }`}
              style={{ width: `${fillPct}%` }}
            />
          </div>
          {isFull && (
            <div className="flex items-center gap-1 mt-1.5 text-xs text-red-500 font-semibold">
              <AlertCircle size={12} />
              Capacity Reached
            </div>
          )}
        </div>

        {/* Card Action Footer */}
        <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
          <div className="text-[10px] text-stone-400">
            <span className="font-bold text-stone-500 block">Deadline</span>
            {formatDeadline(event.registrationDeadline)}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRegisterClick(event);
            }}
            className={`text-xs font-bold px-4 py-2.5 rounded-xl flex-shrink-0 transition-all duration-200 flex items-center gap-1.5 ${
              isFull || isClosed
                ? 'bg-stone-100 text-stone-700 hover:bg-sky-100 hover:text-sky-800'
                : 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-400 hover:to-blue-500 shadow-sm shadow-sky-300'
            }`}
          >
            <span>{isClosed || isFull ? 'Details' : 'Register'}</span>
            <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}