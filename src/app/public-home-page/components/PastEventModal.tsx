'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import AppImage from '@/components/ui/AppImage';
import CategoryBadge from '@/components/ui/CategoryBadge';
import type { Event } from '@/lib/mockData';
import { REGISTERED_COUNTS, ATTENDED_COUNTS, GALLERY_IMAGES } from '@/lib/mockData';
import {
  X,
  Calendar,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  FileText,
  Award,
  DollarSign,
  CheckCircle2,
  Download,
  Eye,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import EventDocumentModal, { DocumentType } from './EventDocumentModal';

const PastEventCharts = dynamic(() => import('./PastEventCharts'), { ssr: false });

interface Props {
  event: Event;
  onClose: () => void;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function PastEventModal({ event, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'gallery'>('overview');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [activeDocument, setActiveDocument] = useState<DocumentType | null>(null);

  const registered = REGISTERED_COUNTS[event.id] || 210;
  const attended = ATTENDED_COUNTS[event.id] || 195;
  const attendanceRate = registered > 0 ? Math.round((attended / registered) * 100) : 93;

  const rawGallery = GALLERY_IMAGES.filter((g) => {
    if (g.eventId === event.id) return true;
    if (event.id === 'remote-event-7' && g.eventId === 'event-015') return true;
    if (event.id === 'event-015' && g.eventId === 'remote-event-7') return true;
    if (event.id === 'remote-event-8' && g.eventId === 'event-016') return true;
    if (event.id === 'event-016' && g.eventId === 'remote-event-8') return true;
    if (event.id === 'remote-event-9' && g.eventId === 'event-017') return true;
    if (event.id === 'event-017' && g.eventId === 'remote-event-9') return true;
    if (event.id === 'remote-event-10' && g.eventId === 'event-018') return true;
    if (event.id === 'event-018' && g.eventId === 'remote-event-10') return true;
    return false;
  });

  const galleryMap = new Map();
  for (const item of rawGallery) {
    if (!galleryMap.has(item.imageUrl)) {
      galleryMap.set(item.imageUrl, item);
    }
  }
  const gallery = Array.from(galleryMap.values());

  const DOCUMENTS = [
    {
      id: 'press_release' as DocumentType,
      title: 'Press Release',
      desc: 'Official media press release for immediate release',
      status: 'Available',
      icon: Newspaper,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      id: 'event_report' as DocumentType,
      title: 'Event Report',
      desc: 'Comprehensive 14-point official university event report',
      status: 'Available',
      icon: FileText,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    },
    {
      id: 'certificate' as DocumentType,
      title: 'Sample Certificate',
      desc: 'Official Vignan University participation certificate builder',
      status: 'Generated',
      icon: Award,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'budget_report' as DocumentType,
      title: 'Budget Report',
      desc: 'Financial expense breakdown and budget utilization statement',
      status: 'Generated',
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Section 13: Full-Viewport Event Details Workspace Container */}
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-[1350px] max-h-[94vh] flex flex-col overflow-hidden animate-scaleIn">
        
        {/* Workspace Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black">
              CSE
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight leading-none">
                  {event.title}
                </h2>
                <CategoryBadge category={event.category} />
                <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-200 text-[10px] font-mono font-bold">
                  {event.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Event ID: {event.id} • Date: {formatDate(event.date)} • Venue: {event.venue}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Workspace Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-2 flex-shrink-0">
          {[
            { id: 'overview', label: 'Overview & Statistics' },
            { id: 'documents', label: 'Documentation & Official Reports' },
            { id: 'gallery', label: `Photo Gallery (${gallery.length})` },
          ].map((tab) => (
            <button
              key={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 text-xs font-extrabold border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Workspace Main Body Grid (2 Columns Desktop Layout) */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Main Column (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Poster Banner */}
                <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900">
                  <AppImage
                    src={event.posterUrl}
                    alt={event.title}
                    fill
                    sizes="1000px"
                    className="object-cover opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 block mb-1">
                      {event.organizer}
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black">{event.title}</h1>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 space-y-2">
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    EVENT DESCRIPTION & SCOPE
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed font-normal">
                    {event.description}
                  </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Date', value: formatDate(event.date), icon: Calendar },
                    { label: 'Venue', value: event.venue, icon: MapPin },
                    { label: 'Registered', value: registered, icon: Users },
                    { label: 'Attended', value: attended, icon: Users },
                  ].map((item) => (
                    <div key={`overview-${item.label}`} className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
                      <item.icon size={16} className="text-blue-600 mb-1" />
                      <div className="text-[10px] font-bold text-slate-400 uppercase">{item.label}</div>
                      <div className="text-sm sm:text-base font-black text-slate-900 font-tabular truncate">{item.value}</div>
                    </div>
                  ))}
                </div>

                {/* Attendance Rate Banner */}
                <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-5 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-emerald-900">Attendance Verification Rate</span>
                    <span className="text-2xl font-black text-emerald-700 font-tabular">{attendanceRate}%</span>
                  </div>
                  <div className="h-2.5 bg-emerald-200/70 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full transition-all duration-500" style={{ width: `${attendanceRate}%` }} />
                  </div>
                </div>

                {/* Section 9 & 10: Official Document Cards Grid */}
                <div className="space-y-3 pt-4 border-t border-slate-200/80">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <FileText size={16} className="text-blue-600" />
                      Official Event Documentation & Reports
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {DOCUMENTS.map((doc) => {
                      const Icon = doc.icon;
                      return (
                        <div
                          key={`doc-card-${doc.id}`}
                          className="bg-white rounded-2xl border border-slate-200/90 p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className={`w-9 h-9 rounded-xl ${doc.color} border flex items-center justify-center`}>
                                <Icon size={18} />
                              </div>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold border border-emerald-200 flex items-center gap-1">
                                <CheckCircle2 size={10} /> {doc.status}
                              </span>
                            </div>

                            <h4 className="font-extrabold text-slate-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                              {doc.title}
                            </h4>
                            <p className="text-slate-500 text-xs leading-snug mb-4">
                              {doc.desc}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                            <button
                              onClick={() => setActiveDocument(doc.id)}
                              className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <Eye size={13} />
                              <span>View</span>
                            </button>

                            <button
                              onClick={() => setActiveDocument(doc.id)}
                              className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                              title="Download Document"
                            >
                              <Download size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <PastEventCharts registered={registered} attended={attended} eventId={event.id} />
              </div>

              {/* Sidebar Column (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                {/* Event Information Box */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-5 space-y-4">
                  <h3 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-3">
                    <ShieldCheck size={16} className="text-indigo-600" />
                    Event Specifications
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Category</span>
                      <span className="font-extrabold text-slate-900">{event.category}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Organizer</span>
                      <span className="font-extrabold text-slate-900">{event.organizer}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Capacity</span>
                      <span className="font-extrabold text-slate-900 font-tabular">{event.capacity} seats</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Eligibility</span>
                      <span className="font-medium text-slate-700">{event.eligibility}</span>
                    </div>
                  </div>
                </div>

                {/* Coordinators Box */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3 shadow-2xs">
                  <h3 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Users size={16} className="text-blue-600" />
                    Event Faculty & Coordinators
                  </h3>

                  <div className="text-xs text-slate-700 space-y-2 font-medium">
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Faculty Coordinator</span>
                      <span className="font-extrabold text-slate-900">{event.contactPerson}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Contact Email</span>
                      <span className="font-mono text-blue-600">{event.contactEmail}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">Event Documentation Hub</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Official reports, press releases, certificates of participation, and financial statements.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {DOCUMENTS.map((doc) => {
                  const Icon = doc.icon;
                  return (
                    <div
                      key={`hub-doc-${doc.id}`}
                      className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs hover:border-blue-300 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-2xl ${doc.color} border flex items-center justify-center`}>
                            <Icon size={24} />
                          </div>

                          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-mono font-bold border border-emerald-200 flex items-center gap-1.5">
                            <CheckCircle2 size={12} /> {doc.status}
                          </span>
                        </div>

                        <h4 className="font-extrabold text-slate-900 text-base mb-1 group-hover:text-blue-600 transition-colors">
                          {doc.title}
                        </h4>
                        <p className="text-slate-600 text-xs leading-relaxed mb-6">
                          {doc.desc}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                        <button
                          onClick={() => setActiveDocument(doc.id)}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                        >
                          <Eye size={15} />
                          <span>View Document</span>
                        </button>

                        <button
                          onClick={() => setActiveDocument(doc.id)}
                          className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download size={15} />
                          <span>PDF</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div>
              {gallery.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200">
                  <div className="text-4xl mb-3">📷</div>
                  <p className="text-slate-500 text-sm font-semibold">No photos uploaded for this event yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {gallery.map((img, idx) => (
                    <button
                      key={`gal-${img.id}`}
                      onClick={() => setLightboxIdx(idx)}
                      className="relative aspect-video rounded-2xl overflow-hidden group cursor-pointer border border-slate-200 shadow-2xs"
                    >
                      <AppImage
                        src={img.imageUrl}
                        alt={img.caption}
                        fill
                        sizes="400px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/30 transition-colors" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs font-semibold line-clamp-2">{img.caption}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Document Viewer Modal */}
      {activeDocument && (
        <EventDocumentModal
          event={event}
          docType={activeDocument}
          onClose={() => setActiveDocument(null)}
        />
      )}

      {/* Lightbox Modal */}
      {lightboxIdx !== null && gallery[lightboxIdx] && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/90 backdrop-blur-xs" onClick={() => setLightboxIdx(null)}>
          <button className="absolute top-4 right-4 text-white p-2 rounded-full bg-white/10 hover:bg-white/20" onClick={() => setLightboxIdx(null)}>
            <X size={20} />
          </button>
          <button
            className="absolute left-4 text-white p-2 rounded-full bg-white/10 hover:bg-white/20"
            onClick={e => { e.stopPropagation(); setLightboxIdx(i => i !== null ? Math.max(0, i - 1) : 0); }}
          >
            <ChevronLeft size={24} />
          </button>
          <div className="max-w-3xl max-h-[80vh] relative" onClick={e => e.stopPropagation()}>
            <AppImage
              src={gallery[lightboxIdx].imageUrl}
              alt={gallery[lightboxIdx].caption}
              width={800}
              height={533}
              className="rounded-2xl object-contain max-h-[80vh]"
            />
            <p className="text-white text-sm text-center mt-3 font-semibold opacity-90">{gallery[lightboxIdx].caption}</p>
          </div>
          <button
            className="absolute right-4 text-white p-2 rounded-full bg-white/10 hover:bg-white/20"
            onClick={e => { e.stopPropagation(); setLightboxIdx(i => i !== null ? Math.min(gallery.length - 1, i + 1) : 0); }}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
}