'use client';
import React, { useState, useEffect } from 'react';
import RegistrationsTable from '@/app/event-registrations-management/components/RegistrationsTable';
import RegistrationAnalytics from '@/app/event-registrations-management/components/RegistrationAnalytics';
import AttendanceSummary from '@/app/event-registrations-management/components/AttendanceSummary';
import { MOCK_EVENTS, REGISTERED_COUNTS, Event } from '@/lib/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import { ClipboardList, BarChart2, Calendar, Filter, Users } from 'lucide-react';

type TabView = 'registrations' | 'analytics';

export default function AdminRegistrationsContent() {
  const [eventsList, setEventsList] = useState<Event[]>(MOCK_EVENTS);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabView>('registrations');

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setEventsList(data.data);
          setSelectedEventId(data.data[0].id);
        } else if (MOCK_EVENTS.length > 0) {
          setSelectedEventId(MOCK_EVENTS[0].id);
        }
      } catch (e) {
        if (MOCK_EVENTS.length > 0) setSelectedEventId(MOCK_EVENTS[0].id);
      }
    }
    loadEvents();
  }, []);

  const selectedEvent = eventsList.find((e) => e.id === selectedEventId) || eventsList[0];
  const capacity = selectedEvent?.capacity || (selectedEvent as any)?.max_participants || 150;
  const registeredCount = (selectedEvent as any)?.registeredCount !== undefined
    ? (selectedEvent as any).registeredCount
    : REGISTERED_COUNTS[selectedEvent?.id] || 0;
  const availableSeats = Math.max(0, capacity - registeredCount);

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-[1450px] mx-auto space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Registrations Management
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
            Track student registrations dynamically from database, mark live attendance, and view available seat capacity.
          </p>
        </div>
      </div>

      {/* Event Selector Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 max-w-xl">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Event
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-extrabold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              {eventsList.map((event) => (
                <option key={`event-sel-${event.id}`} value={event.id}>
                  {event.title} — {event.date} ({event.category})
                </option>
              ))}
            </select>
          </div>

          {selectedEvent && (
            <div className="flex flex-wrap items-center gap-4 flex-shrink-0 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 font-mono text-xs">
              <StatusBadge status={selectedEvent.status} size="sm" />
              <div>
                <span className="text-slate-500 font-medium">Registered: </span>
                <span className="font-extrabold text-blue-600">
                  {registeredCount}
                </span>
                <span className="text-slate-500 font-medium"> / {capacity}</span>
              </div>
              <div className="pl-3 border-l border-slate-200">
                <span className="text-slate-500 font-medium">Available Seats: </span>
                <span className={availableSeats <= 5 ? 'font-extrabold text-rose-600' : 'font-extrabold text-emerald-600'}>
                  {availableSeats}
                </span>
              </div>
            </div>
          )}
        </div>

        {selectedEvent && (
          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-slate-600">
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Date</span>
              <span className="font-bold text-slate-900">{selectedEvent.date}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Venue</span>
              <span className="font-bold text-slate-900 truncate block">{selectedEvent.venue}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Organizer</span>
              <span className="font-bold text-slate-900 truncate block">{selectedEvent.organizer}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Category</span>
              <span className="font-bold text-slate-900">{selectedEvent.category}</span>
            </div>
          </div>
        )}
      </div>

      {/* Tab Controls */}
      <div className="flex border-b border-slate-200/80 bg-white rounded-t-2xl px-3 pt-3 gap-2">
        <button
          onClick={() => setActiveTab('registrations')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold transition-all rounded-t-xl cursor-pointer ${
            activeTab === 'registrations'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ClipboardList size={15} />
          <span>Registrations & Attendance</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold transition-all rounded-t-xl cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart2 size={15} />
          <span>Analytics & Metrics</span>
        </button>
      </div>

      {/* Tab Contents */}
      {selectedEvent && (
        <div className="space-y-6">
          <AttendanceSummary eventId={selectedEvent.id} />

          {activeTab === 'registrations' ? (
            <RegistrationsTable eventId={selectedEvent.id} />
          ) : (
            <RegistrationAnalytics eventId={selectedEvent.id} event={selectedEvent} />
          )}
        </div>
      )}
    </div>
  );
}
