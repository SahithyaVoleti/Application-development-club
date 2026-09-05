'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { MOCK_REGISTRATIONS, type Registration, type AttendanceStatus } from '@/lib/mockData';
import { toast } from 'sonner';
import { Search, Download, UserCheck, UserX, ChevronUp, ChevronDown } from 'lucide-react';

interface Props {
  eventId: string;
}

type SortKey = 'studentName' | 'department' | 'year' | 'registrationDate';
type SortDir = 'asc' | 'desc';

const DEPT_FILTERS = ['All', 'CSE', 'IT', 'ECE', 'EEE', 'Mech', 'Civil', 'MBA', 'MCA'];
const YEAR_FILTERS = ['All', '1st Year', '2nd Year', '3rd Year', '4th Year'];
const ATTENDANCE_FILTERS = ['All', 'present', 'absent', 'not_marked'];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function RegistrationsTable({ eventId }: Props) {
  const [baseRegistrations, setBaseRegistrations] = useState<Registration[]>(
    () => MOCK_REGISTRATIONS.filter(r => r.eventId === eventId)
  );
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [attendanceFilter, setAttendanceFilter] = useState('All');
  const [sortKey, setSortKey] = useState<SortKey>('registrationDate');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Re-filter when eventId changes
  React.useEffect(() => {
    setBaseRegistrations(MOCK_REGISTRATIONS.filter(r => r.eventId === eventId));
    setSelectedIds(new Set());
    setCurrentPage(1);
  }, [eventId]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const handleAttendance = useCallback((regId: string, status: AttendanceStatus) => {
    // BACKEND: PUT /api/registrations/:id/attendance
    setBaseRegistrations(prev =>
      prev.map(r => r.id === regId ? { ...r, attendanceStatus: status } : r)
    );
    toast.success(`Attendance marked as ${status}`);
  }, []);

  const handleBulkAttendance = (status: AttendanceStatus) => {
    setBaseRegistrations(prev =>
      prev.map(r => selectedIds.has(r.id) ? { ...r, attendanceStatus: status } : r)
    );
    toast.success(`${selectedIds.size} students marked as ${status}`);
    setSelectedIds(new Set());
  };

  const filtered = baseRegistrations
    .filter(r => {
      const matchSearch = !search ||
        r.studentName.toLowerCase().includes(search.toLowerCase()) ||
        r.studentId.toLowerCase().includes(search.toLowerCase()) ||
        r.email.toLowerCase().includes(search.toLowerCase()) ||
        r.registrationId.toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter === 'All' || r.department === deptFilter;
      const matchYear = yearFilter === 'All' || r.year === yearFilter;
      const matchAtt = attendanceFilter === 'All' || r.attendanceStatus === attendanceFilter;
      return matchSearch && matchDept && matchYear && matchAtt;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'studentName') cmp = a.studentName.localeCompare(b.studentName);
      else if (sortKey === 'department') cmp = a.department.localeCompare(b.department);
      else if (sortKey === 'year') cmp = a.year.localeCompare(b.year);
      else if (sortKey === 'registrationDate') cmp = new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime();
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginated.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(paginated.map(r => r.id)));
  };

  const exportCSV = () => {
    // BACKEND: GET /api/events/:id/registrations?format=csv
    const headers = ['Reg ID', 'Student ID', 'Name', 'Department', 'Year', 'Section', 'Email', 'Mobile', 'Gender', 'Skills', 'Reg Date', 'Attendance'];
    const rows = filtered.map(r => [
      r.registrationId, r.studentId, r.studentName, r.department, r.year, r.section,
      r.email, r.mobile, r.gender, r.skills, formatDateTime(r.registrationDate), r.attendanceStatus
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${eventId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} registrations as CSV`);
  };

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col
      ? sortDir === 'asc' ? <ChevronUp size={11} className="text-accent" /> : <ChevronDown size={11} className="text-accent" />
      : <ChevronUp size={11} className="opacity-20" />;

  const ATTENDANCE_BADGE: Record<AttendanceStatus, { label: string; className: string }> = {
    present: { label: 'Present', className: 'bg-emerald-50 text-emerald-700' },
    absent: { label: 'Absent', className: 'bg-red-50 text-red-700' },
    not_marked: { label: 'Not Marked', className: 'bg-gray-100 text-gray-600' },
  };

  return (
    <div className="bg-white rounded-2xl border border-border shadow-card">
      {/* Table header / filters */}
      <div className="p-5 border-b border-border">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, student ID, email, or registration ID…"
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              className="input-field pl-8"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={deptFilter}
              onChange={e => { setDeptFilter(e.target.value); setCurrentPage(1); }}
              className="input-field w-auto text-sm"
            >
              {DEPT_FILTERS.map(d => <option key={`dept-f-${d}`} value={d}>{d === 'All' ? 'All Depts' : d}</option>)}
            </select>
            <select
              value={yearFilter}
              onChange={e => { setYearFilter(e.target.value); setCurrentPage(1); }}
              className="input-field w-auto text-sm"
            >
              {YEAR_FILTERS.map(y => <option key={`year-f-${y}`} value={y}>{y === 'All' ? 'All Years' : y}</option>)}
            </select>
            <select
              value={attendanceFilter}
              onChange={e => { setAttendanceFilter(e.target.value); setCurrentPage(1); }}
              className="input-field w-auto text-sm"
            >
              {ATTENDANCE_FILTERS.map(a => (
                <option key={`att-f-${a}`} value={a}>
                  {a === 'All' ? 'All Attendance' : a === 'not_marked' ? 'Not Marked' : a.charAt(0).toUpperCase() + a.slice(1)}
                </option>
              ))}
            </select>
            <button onClick={exportCSV} className="btn-secondary text-sm py-2 px-3">
              <Download size={13} />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="bg-accent/5 border-b border-accent/20 px-5 py-2.5 flex items-center gap-3 animate-fadeIn">
          <span className="text-sm font-semibold text-accent">{selectedIds.size} selected</span>
          <button
            onClick={() => handleBulkAttendance('present')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <UserCheck size={12} />
            Mark Present
          </button>
          <button
            onClick={() => handleBulkAttendance('absent')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            <UserX size={12} />
            Mark Absent
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-xs text-muted-foreground hover:text-foreground font-medium ml-1"
          >
            Clear selection
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-5 py-3 w-10">
                <input
                  type="checkbox"
                  checked={paginated.length > 0 && selectedIds.size === paginated.length}
                  onChange={toggleSelectAll}
                  className="rounded border-border"
                />
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Reg ID</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Student ID</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                <button onClick={() => handleSort('studentName')} className="flex items-center gap-1 hover:text-foreground transition-colors whitespace-nowrap">
                  Name <SortIcon col="studentName" />
                </button>
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                <button onClick={() => handleSort('department')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                  Dept <SortIcon col="department" />
                </button>
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                <button onClick={() => handleSort('year')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                  Year <SortIcon col="year" />
                </button>
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Section</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Mobile</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                <button onClick={() => handleSort('registrationDate')} className="flex items-center gap-1 hover:text-foreground transition-colors whitespace-nowrap">
                  Reg Date <SortIcon col="registrationDate" />
                </button>
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Attendance</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-5 py-16 text-center">
                  <div className="text-3xl mb-2">📋</div>
                  <div className="font-semibold text-foreground mb-1">No registrations found</div>
                  <div className="text-sm text-muted-foreground">
                    {search || deptFilter !== 'All' || yearFilter !== 'All' || attendanceFilter !== 'All' ?'Try adjusting your search or filters.' :'No students have registered for this event yet.'}
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map(reg => {
                const attConfig = ATTENDANCE_BADGE[reg.attendanceStatus];
                return (
                  <tr key={`reg-row-${reg.id}`} className={`border-b border-border last:border-0 table-row-hover ${selectedIds.has(reg.id) ? 'bg-blue-50/50' : ''}`}>
                    <td className="px-5 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(reg.id)}
                        onChange={() => toggleSelect(reg.id)}
                        className="rounded border-border"
                      />
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs font-semibold text-accent">{reg.registrationId}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs text-muted-foreground">{reg.studentId}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-semibold text-foreground text-sm">{reg.studentName}</div>
                      <div className="text-xs text-muted-foreground">{reg.gender}</div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm font-medium text-foreground">{reg.department}</span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-sm text-muted-foreground">{reg.year}</td>
                    <td className="px-5 py-3 text-sm text-muted-foreground">{reg.section}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs text-muted-foreground truncate block max-w-[160px]">{reg.email}</span>
                    </td>
                    <td className="px-5 py-3 text-sm font-tabular text-muted-foreground whitespace-nowrap">{reg.mobile}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground whitespace-nowrap">{formatDate(reg.registrationDate)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${attConfig.className}`}>
                          {attConfig.label}
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            title="Mark Present"
                            onClick={() => handleAttendance(reg.id, 'present')}
                            disabled={reg.attendanceStatus === 'present'}
                            className="p-1 rounded hover:bg-emerald-50 text-emerald-600 disabled:opacity-30 transition-colors"
                          >
                            <UserCheck size={13} />
                          </button>
                          <button
                            title="Mark Absent"
                            onClick={() => handleAttendance(reg.id, 'absent')}
                            disabled={reg.attendanceStatus === 'absent'}
                            className="p-1 rounded hover:bg-red-50 text-red-600 disabled:opacity-30 transition-colors"
                          >
                            <UserX size={13} />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filtered.length > pageSize && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/20">
          <span className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} registrations
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted disabled:opacity-40 transition-colors"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .map((p, idx, arr) => (
                <React.Fragment key={`page-${p}`}>
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span key={`ellipsis-${p}`} className="px-2 text-muted-foreground text-sm">…</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(p)}
                    className={`px-3 py-1.5 text-sm border rounded-lg transition-colors ${
                      currentPage === p
                        ? 'bg-accent text-white border-accent' :'border-border hover:bg-muted'
                    }`}
                  >
                    {p}
                  </button>
                </React.Fragment>
              ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {filtered.length > 0 && filtered.length <= pageSize && (
        <div className="px-5 py-3 border-t border-border bg-muted/20 text-sm text-muted-foreground">
          {filtered.length} registration{filtered.length !== 1 ? 's' : ''} total
        </div>
      )}
    </div>
  );
}