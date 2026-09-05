'use client';
import React, { useState, use } from 'react';
import Image from 'next/image';
import PublicNavbar from '../../public-home-page/components/PublicNavbar';
import PublicFooter from '../../public-home-page/components/PublicFooter';
import ResourceBreadcrumbs from '../../resources/components/ResourceBreadcrumbs';
import EventRegistrationModal from '../../public-home-page/components/EventRegistrationModal';
import { MOCK_EVENTS, REGISTERED_COUNTS, Event } from '@/lib/mockData';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  CheckCircle2,
  AlertCircle,
  Award,
  Tag,
  ArrowRight,
} from 'lucide-react';

interface Props {
  params: Promise<{ eventId: string }>;
}

export default function EventDetailPage({ params }: Props) {
  const { eventId } = use(params);
  const [showRegModal, setShowRegModal] = useState(false);

  const event = MOCK_EVENTS.find(e => e.id === eventId) || MOCK_EVENTS[0];
  const isCompleted = event.status === 'COMPLETED';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <PublicNavbar />

      <main className="flex-1 pt-28 pb-20 max-w-screen-xl mx-auto px-6 lg:px-10 w-full">
        {/* Breadcrumb */}
        <ResourceBreadcrumbs
          backHref="/events"
          backLabel="Back to Events"
          items={[
            { label: 'Events', href: '/events' },
            { label: event.title },
          ]}
        />

        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden mb-8">
          {/* Poster Hero Banner */}
          <div className="relative w-full h-64 sm:h-80 bg-slate-900 overflow-hidden">
            <Image
              src={event.posterUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'}
              alt={event.title}
              fill
              className="object-cover opacity-80"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-blue-600 font-mono text-xs font-bold">
                  {event.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  isCompleted ? 'bg-slate-800 text-slate-300' : 'bg-emerald-500 text-white'
                }`}>
                  {event.status}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
                {event.title}
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
                Organized by {event.organizer}
              </p>
            </div>
          </div>

          {/* Details Content Layout */}
          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Content (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              <div>
                <h3 className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest mb-3">
                  EVENT DESCRIPTION
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              {/* Eligibility & Rules */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <Award size={15} className="text-blue-600" /> Eligibility
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{event.eligibility}</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-emerald-600" /> Rules & Requirements
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{event.rules}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200">
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider font-mono mb-2">
                  CONTACT INFORMATION
                </h4>
                <div className="text-xs text-blue-950 font-semibold space-y-1">
                  <div>Coordinator: {event.contactPerson}</div>
                  <div>Email: {event.contactEmail}</div>
                </div>
              </div>
            </div>

            {/* Right Meta Sidebar (4 cols) */}
            <aside className="lg:col-span-4 bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-6">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-200">
                EVENT SPECIFICATIONS
              </h3>

              <div className="space-y-4 text-xs font-medium text-slate-700">
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-blue-600 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Date</div>
                    <div className="font-bold text-slate-900">{event.date}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-sky-500 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Time</div>
                    <div className="font-bold text-slate-900">{event.startTime} - {event.endTime}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-indigo-500 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Venue</div>
                    <div className="font-bold text-slate-900">{event.venue}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User size={18} className="text-purple-500 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Organizer</div>
                    <div className="font-bold text-slate-900">{event.organizer}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Tag size={18} className="text-emerald-500 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Registration Deadline</div>
                    <div className="font-bold text-slate-900">{event.registrationDeadline}</div>
                  </div>
                </div>
              </div>

              {/* Section 13: Register Now Button */}
              {!isCompleted ? (
                <button
                  onClick={() => setShowRegModal(true)}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 btn-hover-premium cursor-pointer"
                >
                  Register Now
                </button>
              ) : (
                <div className="p-3 bg-slate-200 text-slate-700 text-center font-bold text-xs rounded-xl">
                  Event Completed
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>

      {/* Registration Modal */}
      {showRegModal && (
        <EventRegistrationModal
          event={event}
          currentCount={REGISTERED_COUNTS[event.id] || 0}
          onClose={() => setShowRegModal(false)}
          onSuccess={() => setShowRegModal(false)}
        />
      )}

      <PublicFooter />
    </div>
  );
}
