'use client';
import React, { useState, useEffect } from 'react';
import type { Event, Registration } from '@/lib/mockData';
import { MOCK_REGISTRATIONS } from '@/lib/mockData';
import { toast } from 'sonner';
import StatusBadge from '@/components/ui/StatusBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import {
  X,
  Search,
  Download,
  Trash2,
  Calendar,
  MapPin,
  Users,
  FileSpreadsheet,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Award,
} from 'lucide-react';

interface Props {
  event: Event;
  registeredCount: number;
  onClose: () => void;
  onCountChange?: (newEventId: string, newCount: number) => void;
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

function formatDateTime(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
  } catch (e) {
    return dateStr;
  }
}

const DEPARTMENTS = ['All', 'CSE', 'ECE', 'IT', 'AI & ML', 'Data Science', 'EEE', 'Mechanical', 'Civil', 'MCA', 'MBA'];
const YEARS = ['All', '1st Year', '2nd Year', '3rd Year', '4th Year'];

export default function AdminEventRegistrationsModal({ event, registeredCount, onClose, onCountChange }: Props) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [deleteConfirmReg, setDeleteConfirmReg] = useState<Registration | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch registrations strictly belonging to this event
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/registrations?eventId=${event.id}`);
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          setRegistrations(result.data.filter((r: Registration) => r.eventId === event.id));
        } else {
          setRegistrations(MOCK_REGISTRATIONS.filter((r) => r.eventId === event.id));
        }
      } catch (e) {
        setRegistrations(MOCK_REGISTRATIONS.filter((r) => r.eventId === event.id));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [event.id]);

  const handleUpdateAttendance = async (reg: Registration, newStatus: 'present' | 'absent' | 'not_marked') => {
    try {
      const res = await fetch('/api/attendance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId: reg.id,
          attendanceStatus: newStatus,
        }),
      });

      const result = await res.json();

      if (result.success) {
        setRegistrations((prev) =>
          prev.map((r) => (r.id === reg.id ? { ...r, attendanceStatus: newStatus } : r))
        );
        const statusLabel = newStatus === 'present' ? 'ATTENDED ✓' : newStatus === 'absent' ? 'ABSENT ✗' : 'PENDING';
        toast.success(`Attendance updated for ${reg.studentName}`, {
          description: `Status: ${statusLabel}${newStatus === 'present' ? ' | Certificate unlocked!' : ''}`,
        });
      } else {
        toast.error(result.error || 'Failed to update attendance');
      }
    } catch (err: any) {
      toast.error('Failed to connect to attendance API');
    }
  };

  const filtered = registrations.filter((r) => {
    const matchSearch =
      !search ||
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.studentId.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase()) ||
      r.registrationId.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'All' || r.department.includes(deptFilter);
    const matchYear = yearFilter === 'All' || r.year === yearFilter;
    return matchSearch && matchDept && matchYear;
  });

  const availableSeats = Math.max(0, event.capacity - registrations.length);
  const fillPct = Math.min(100, Math.round((registrations.length / event.capacity) * 100));

  const handleDownloadExcel = async () => {
    setIsExporting(true);
    try {
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
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteRegistration = async () => {
    if (!deleteConfirmReg) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/registrations/${deleteConfirmReg.id}`, { method: 'DELETE' });
      const result = await res.json();
      if (res.ok && result.success) {
        setRegistrations((prev) => prev.filter((r) => r.id !== deleteConfirmReg.id));
        const newCount = Math.max(0, registrations.length - 1);
        if (onCountChange) onCountChange(event.id, newCount);
        toast.success(`Registration for ${deleteConfirmReg.studentName} deleted`);
      } else {
        throw new Error(result.error || 'Failed to delete registration');
      }
    } catch (error: any) {
      toast.error('Delete Failed', { description: error.message });
    } finally {
      setIsDeleting(false);
      setDeleteConfirmReg(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-slate-900/60 transition-all duration-300 animate-fadeIn"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-900/20 w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn">
        
        {/* Modal Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-slate-100 bg-white sticky top-0 z-20 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <CategoryBadge category={event.category} />
                <span className="text-slate-300">•</span>
                <StatusBadge status={event.status} size="sm" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {event.title}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1"><Calendar size={13} className="text-blue-600" /> {formatDate(event.date)}</span>
                <span className="flex items-center gap-1"><MapPin size={13} className="text-blue-600" /> {event.venue}</span>
              </p>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDownloadExcel}
                disabled={isExporting}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <FileSpreadsheet size={16} />
                <span>{isExporting ? 'Generating Excel…' : 'Download Excel (.xlsx)'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Seat Capacity Progress Bar Card */}
          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Users size={18} />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-mono font-bold uppercase">Registered Students</div>
                <div className="text-sm font-extrabold text-slate-900 font-tabular">
                  {registrations.length} / {event.capacity}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-mono font-bold uppercase">Available Seats</div>
                <div className="text-sm font-extrabold text-emerald-700 font-tabular">
                  {availableSeats} seats
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-500">Fill Rate</span>
                <span className={fillPct >= 90 ? 'text-rose-600' : 'text-emerald-600'}>{fillPct}%</span>
              </div>
              <div className="h-2 bg-slate-200/80 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${fillPct >= 90 ? 'bg-rose-500' : fillPct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${fillPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 sm:px-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search student by Name, Student ID, Email, Department…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              {DEPARTMENTS.map((d) => (
                <option key={`dept-${d}`} value={d}>{d === 'All' ? 'All Depts' : d}</option>
              ))}
            </select>

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              {YEARS.map((y) => (
                <option key={`year-${y}`} value={y}>{y === 'All' ? 'All Years' : y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Scrollable Table Container */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold">Loading registrations from database…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-3xl">
                📋
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900">
                  {registrations.length === 0 ? 'No students have registered for this event yet.' : 'No matching registrations found.'}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {registrations.length === 0
                    ? 'You can still download the Excel template with event summary headers.'
                    : 'Try clearing your search query or filter parameters.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left min-w-[1100px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-mono uppercase font-bold text-[10px]">
                    <th className="px-4 py-3.5 w-12 text-center">S.No</th>
                    <th className="px-4 py-3.5">Full Name</th>
                    <th className="px-4 py-3.5">Student ID</th>
                    <th className="px-4 py-3.5">Department</th>
                    <th className="px-4 py-3.5">Year & Sec</th>
                    <th className="px-4 py-3.5">Email Address</th>
                    <th className="px-4 py-3.5">Mobile Number</th>
                    <th className="px-4 py-3.5 text-center">Attendance Status</th>
                    <th className="px-4 py-3.5 text-center">Mark Attendance</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((reg, idx) => (
                    <tr key={`modal-reg-${reg.id}`} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3.5 text-center font-bold text-slate-400 font-tabular">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">
                        {reg.studentName}
                      </td>
                      <td className="px-4 py-3.5 font-mono font-bold text-blue-600">
                        {reg.studentId}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-700">
                        {reg.department}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-600 whitespace-nowrap">
                        {reg.year} ({reg.section})
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-600 truncate max-w-[160px]">
                        {reg.email}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-800 whitespace-nowrap">
                        {reg.mobile}
                      </td>
                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        {reg.attendanceStatus === 'present' ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-[11px] inline-flex items-center gap-1">
                            <CheckCircle2 size={12} className="text-emerald-600" /> ATTENDED
                          </span>
                        ) : reg.attendanceStatus === 'absent' ? (
                          <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-300 font-bold text-[11px] inline-flex items-center gap-1">
                            <XCircle size={12} className="text-rose-600" /> ABSENT
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-bold text-[11px]">
                            PENDING
                          </span>
                        )}
                      </td>

                      {/* Interactive Attendance Marking Buttons */}
                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleUpdateAttendance(reg, 'present')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              reg.attendanceStatus === 'present'
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                            }`}
                            title="Mark Attended (Unlocks Certificate)"
                          >
                            Attended
                          </button>

                          <button
                            type="button"
                            onClick={() => handleUpdateAttendance(reg, 'absent')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              reg.attendanceStatus === 'absent'
                                ? 'bg-rose-600 text-white shadow-2xs'
                                : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                            }`}
                            title="Mark Absent (Blocks Certificate)"
                          >
                            Absent
                          </button>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmReg(reg)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Remove registration"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Alert Modal */}
        {deleteConfirmReg && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-scaleIn">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle size={24} />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-extrabold text-slate-900">Remove Registration?</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to remove <strong>{deleteConfirmReg.studentName}</strong> ({deleteConfirmReg.studentId}) from <strong>{event.title}</strong>?
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmReg(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteRegistration}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md disabled:opacity-50"
                >
                  {isDeleting ? 'Removing…' : 'Yes, Remove Registration'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
