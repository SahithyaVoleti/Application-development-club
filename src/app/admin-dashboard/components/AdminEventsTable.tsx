'use client';
import React, { useState } from 'react';
import { MOCK_EVENTS, REGISTERED_COUNTS, type Event } from '@/lib/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import AdminEventFormModal from './AdminEventFormModal';
import AdminDeleteConfirm from './AdminDeleteConfirm';
import AdminEventRegistrationsModal from './AdminEventRegistrationsModal';
import Link from 'next/link';
import { toast } from 'sonner';
import { Plus, Search, Eye, Edit2, Trash2, ClipboardList, ChevronUp, ChevronDown, FileSpreadsheet, Download } from 'lucide-react';

type SortKey = 'title' | 'date' | 'status' | 'registered';
type SortDir = 'asc' | 'desc';

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

interface Props {
  onNavigate?: (view: any) => void;
  onEditEvent?: (event: Event) => void;
}

export default function AdminEventsTable({ onNavigate, onEditEvent }: Props) {
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [counts, setCounts] = useState<Record<string, number>>({ ...REGISTERED_COUNTS });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [formModal, setFormModal] = useState<{ open: boolean; event?: Event }>({ open: false });
  const [deleteConfirm, setDeleteConfirm] = useState<Event | null>(null);
  const [regModal, setRegModal] = useState<{ open: boolean; event?: Event }>({ open: false });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const handleCountChange = (eventId: string, newCount: number) => {
    setCounts(prev => ({ ...prev, [eventId]: newCount }));
    REGISTERED_COUNTS[eventId] = newCount;
  };

  const handleDownloadExcel = async (e: React.MouseEvent, event: Event) => {
    e.stopPropagation();
    try {
      toast.info(`Generating Excel export for ${event.title}…`);
      const response = await fetch(`/api/events/${event.id}/registrations/export`);
      if (!response.ok) throw new Error('Failed to generate Excel export');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const sanitizedTitle = event.title.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
      a.download = `${sanitizedTitle}_Registrations.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`Downloaded Excel export for ${event.title}`);
    } catch (error: any) {
      toast.error('Excel Download Failed', { description: error.message });
    }
  };

  const filtered = events
    .filter(e => {
      const matchSearch = !search ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.category.toLowerCase().includes(search.toLowerCase()) ||
        e.venue.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || e.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'title') cmp = a.title.localeCompare(b.title);
      else if (sortKey === 'date') cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      else if (sortKey === 'registered') cmp = (counts[a.id] || 0) - (counts[b.id] || 0);
      else if (sortKey === 'status') cmp = a.status.localeCompare(b.status);
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const handleDelete = (event: Event) => {
    setEvents(prev => prev.filter(e => e.id !== event.id));
    setDeleteConfirm(null);
    toast.success(`"${event.title}" deleted successfully`);
  };

  const handleSave = (eventData: Partial<Event>) => {
    if (formModal.event) {
      setEvents(prev => prev.map(e => e.id === formModal.event!.id ? { ...e, ...eventData } : e));
      toast.success('Event updated successfully');
    } else {
      const newEvent: Event = {
        ...eventData as Event,
        id: `event-${Date.now()}`,
        status: 'UPCOMING',
        createdAt: new Date().toISOString(),
      };
      setEvents(prev => [newEvent, ...prev]);
      toast.success('Event created successfully');
    }
    setFormModal({ open: false });
  };

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col
      ? sortDir === 'asc' ? <ChevronUp size={13} className="text-blue-600" /> : <ChevronDown size={13} className="text-blue-600" />
      : <ChevronUp size={13} className="opacity-20" />;

  return (
    <div className="p-6 lg:p-10 max-w-[1450px] mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Event Management
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
            Manage events, view student registrations, and export event-wise Excel reports.
          </p>
        </div>

        <button
          onClick={() => {
            if (onNavigate) onNavigate('create-event');
            else setFormModal({ open: true });
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 btn-hover-premium cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Event</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search events by name, category, venue…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="UPCOMING">Upcoming</option>
          <option value="ONGOING">Ongoing</option>
          <option value="COMPLETED">Completed</option>
          <option value="REGISTRATION_CLOSED">Reg. Closed</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[980px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-mono uppercase font-bold text-[10px]">
                <th className="px-5 py-3.5">
                  <button onClick={() => handleSort('title')} className="flex items-center gap-1 hover:text-slate-900 transition-colors">
                    Event <SortIcon col="title" />
                  </button>
                </th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">
                  <button onClick={() => handleSort('date')} className="flex items-center gap-1 hover:text-slate-900 transition-colors">
                    Date <SortIcon col="date" />
                  </button>
                </th>
                <th className="px-5 py-3.5">
                  <button onClick={() => handleSort('status')} className="flex items-center gap-1 hover:text-slate-900 transition-colors">
                    Status <SortIcon col="status" />
                  </button>
                </th>
                <th className="px-5 py-3.5">
                  <button onClick={() => handleSort('registered')} className="flex items-center gap-1 hover:text-slate-900 transition-colors">
                    Registered <SortIcon col="registered" />
                  </button>
                </th>
                <th className="px-5 py-3.5">Capacity</th>
                <th className="px-5 py-3.5">Fill Rate</th>
                <th className="px-5 py-3.5 text-right">Registrations & Excel</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-16 text-center">
                    <div className="text-3xl mb-2">🗓️</div>
                    <div className="font-bold text-slate-900 mb-1 text-sm">No events found</div>
                    <div className="text-xs text-slate-500">Try adjusting your search or filters.</div>
                  </td>
                </tr>
              ) : (
                filtered.map(event => {
                  const registered = counts[event.id] || 0;
                  const fillPct = Math.round((registered / event.capacity) * 100);
                  return (
                    <tr key={`admin-event-${event.id}`} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-extrabold text-slate-900 text-xs max-w-[200px] truncate">{event.title}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5 truncate">{event.venue}</div>
                      </td>
                      <td className="px-5 py-4">
                        <CategoryBadge category={event.category} />
                      </td>
                      <td className="px-5 py-4 font-mono text-slate-600 whitespace-nowrap">
                        {formatDate(event.date)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={event.status} size="sm" />
                      </td>
                      <td className="px-5 py-4 font-tabular font-bold text-slate-900">{registered}</td>
                      <td className="px-5 py-4 font-tabular text-slate-500">{event.capacity}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${fillPct >= 90 ? 'bg-rose-500' : fillPct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${fillPct}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold font-tabular text-slate-600">{fillPct}%</span>
                        </div>
                      </td>
                      
                      {/* View Registrations & Download Excel Action Buttons */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setRegModal({ open: true, event })}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors cursor-pointer border border-blue-200/80"
                            title="View registered students"
                          >
                            <ClipboardList size={13} />
                            <span>View Registrations</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleDownloadExcel(e, event)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors cursor-pointer border border-emerald-200/80"
                            title="Download Excel export (.xlsx)"
                          >
                            <FileSpreadsheet size={13} />
                            <span>Excel</span>
                          </button>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/events/${event.id}`}
                            title="View event on public site"
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors"
                          >
                            <Eye size={15} />
                          </Link>
                          <button
                            title="Edit event"
                            onClick={() => setFormModal({ open: true, event })}
                            className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-500 hover:text-amber-600 transition-colors cursor-pointer"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            title="Delete event"
                            onClick={() => setDeleteConfirm(event)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500">
            <span>Showing {filtered.length} of {events.length} events</span>
          </div>
        )}
      </div>

      {formModal.open && (
        <AdminEventFormModal
          event={formModal.event}
          onClose={() => setFormModal({ open: false })}
          onSave={handleSave}
        />
      )}

      {deleteConfirm && (
        <AdminDeleteConfirm
          event={deleteConfirm}
          onConfirm={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}

      {regModal.open && regModal.event && (
        <AdminEventRegistrationsModal
          event={regModal.event}
          registeredCount={counts[regModal.event.id] || 0}
          onClose={() => setRegModal({ open: false })}
          onCountChange={handleCountChange}
        />
      )}
    </div>
  );
}