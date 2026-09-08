'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  Building,
  UserPlus,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Calendar,
  UserCheck,
  UserX,
  XCircle,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';

export interface ClubItem {
  id: string;
  name: string;
  code: string;
  description?: string;
  department?: string;
}

export interface AssignmentItem {
  id: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  clubId: string;
  clubName: string;
  role: string;
  status: string;
  assignedBy: string;
  assignedAt: string;
  removedAt?: string | null;
}

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  department?: string;
}

export default function ClubAdminManagement() {
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [clubs, setClubs] = useState<ClubItem[]>([]);
  const [admins, setAdmins] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'REMOVED'>('ACTIVE');

  // Modals state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [removingAssignment, setRemovingAssignment] = useState<AssignmentItem | null>(null);
  const [selectedAdminId, setSelectedAdminId] = useState('');
  const [selectedClubId, setSelectedClubId] = useState('');
  const [assignedRole, setAssignedRole] = useState('ADMIN');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adhub_admin_token') : '';
      const headers = { Authorization: `Bearer ${token}` };

      const [assignRes, clubsRes, adminsRes] = await Promise.all([
        fetch('/api/super-admin/club-assignments', { headers }),
        fetch('/api/super-admin/clubs', { headers }),
        fetch('/api/super-admin/admins', { headers }),
      ]);

      const assignData = await assignRes.json();
      const clubsData = await clubsRes.json();
      const adminsData = await adminsRes.json();

      if (assignData.success) {
        setAssignments(assignData.data || []);
      }
      if (clubsData.success) {
        setClubs(clubsData.data || []);
      }
      if (adminsData.success) {
        const list = adminsData.admins || adminsData.requests || [];
        setAdmins(list.filter((u: AdminUserItem) => u.status === 'APPROVED' || u.status === 'ACTIVE' || u.role === 'ADMIN'));
      }
    } catch (err) {
      toast.error('Error loading Club Admin Assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdminId || !selectedClubId) {
      toast.error('Please select both an Admin and a Club.');
      return;
    }

    const adminObj = admins.find(a => a.id === selectedAdminId || a.email === selectedAdminId);
    const clubObj = clubs.find(c => c.id === selectedClubId);

    if (!adminObj || !clubObj) {
      toast.error('Invalid admin or club selected.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adhub_admin_token') : '';
      const res = await fetch('/api/super-admin/club-assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          adminId: adminObj.id,
          adminName: adminObj.name,
          adminEmail: adminObj.email,
          clubId: clubObj.id,
          clubName: clubObj.name,
          role: assignedRole,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Successfully assigned ${adminObj.name} to ${clubObj.name}`, {
          description: `Notification email dispatched to ${adminObj.email}`,
        });
        setIsAssignModalOpen(false);
        setSelectedAdminId('');
        setSelectedClubId('');
        fetchData();
      } else {
        toast.error(data.error || data.message || 'Failed to assign Admin to Club.');
      }
    } catch (err) {
      toast.error('Network error during assignment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!removingAssignment) return;

    setIsSubmitting(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adhub_admin_token') : '';
      const res = await fetch(`/api/super-admin/club-assignments/${encodeURIComponent(removingAssignment.id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        toast.warning(`Removed ${removingAssignment.adminName} from ${removingAssignment.clubName}`, {
          description: 'Removal notification email dispatched to Admin.',
        });
        setRemovingAssignment(null);
        fetchData();
      } else {
        toast.error(data.error || data.message || 'Failed to remove assignment.');
      }
    } catch (err) {
      toast.error('Network error removing assignment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAssignments = assignments.filter(item => {
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const mName = item.adminName.toLowerCase().includes(q);
      const mEmail = item.adminEmail.toLowerCase().includes(q);
      const mClub = item.clubName.toLowerCase().includes(q);
      return mName || mEmail || mClub;
    }
    return true;
  });

  const activeCount = assignments.filter(a => a.status === 'ACTIVE').length;
  const removedCount = assignments.filter(a => a.status === 'REMOVED').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-mono font-bold mb-3">
              <Building size={14} /> SUPER ADMIN CLUB GOVERNANCE
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Club Admin Assignments & Permissions
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl font-medium">
              Manually assign or remove Faculty Admins to specific Student Clubs. Dispatches automated role notifications and enforces club-level RBAC for event creation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs backdrop-blur-md shadow-md transition-all cursor-pointer"
            >
              <UserPlus size={15} />
              + Assign Admin to Club
            </button>
            <button
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setStatusFilter('ACTIVE')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              statusFilter === 'ACTIVE' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setStatusFilter('REMOVED')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              statusFilter === 'REMOVED' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Removed ({removedCount})
          </button>
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              statusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Assignments ({assignments.length})
          </button>
        </div>

        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Admin Name, Email, or Club Name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Assignments Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck size={18} className="text-indigo-600" />
            Active & Historic Club Admin Assignments
          </h3>
          <span className="text-xs font-mono font-bold text-slate-500">
            {filteredAssignments.length} Records Shown
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Admin Name & Email</th>
                <th className="py-3.5 px-4">Assigned Club</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Assigned By</th>
                <th className="py-3.5 px-4">Assigned Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-bold">
                    Loading Club Assignments...
                  </td>
                </tr>
              ) : filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-bold">
                    No matching admin club assignments found.
                  </td>
                </tr>
              ) : (
                filteredAssignments.map(item => {
                  const isActive = item.status === 'ACTIVE';
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{item.adminName}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Mail size={12} className="text-slate-400" />
                          {item.adminEmail}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-indigo-950 flex items-center gap-1.5">
                          <Building size={14} className="text-indigo-600" />
                          {item.clubName}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-700">
                        <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 text-[11px]">
                          {item.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold font-mono uppercase border ${
                            isActive
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border-rose-300'
                          }`}
                        >
                          {isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {item.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-semibold">{item.assignedBy}</td>

                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                        {new Date(item.assignedAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {isActive ? (
                          <button
                            onClick={() => setRemovingAssignment(item)}
                            className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-all cursor-pointer inline-flex items-center gap-1"
                          >
                            <Trash2 size={13} /> Remove
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono italic">
                            Removed {item.removedAt ? new Date(item.removedAt).toLocaleDateString('en-GB') : ''}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ASSIGN ADMIN TO CLUB MODAL */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-[95vw] sm:max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto animate-scaleIn">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <UserPlus size={22} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Assign Admin to Club</h3>
                <p className="text-xs text-slate-500 font-medium">Select an approved Faculty Admin and target Club</p>
              </div>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Select Faculty Admin *
                </label>
                <select
                  required
                  value={selectedAdminId}
                  onChange={e => setSelectedAdminId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white cursor-pointer"
                >
                  <option value="">-- Choose Admin Account --</option>
                  {admins.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.email}) - {a.department || 'CSE'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Select Target Club *
                </label>
                <select
                  required
                  value={selectedClubId}
                  onChange={e => setSelectedClubId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white cursor-pointer"
                >
                  <option value="">-- Choose Club --</option>
                  {clubs.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Assigned Privilege Role
                </label>
                <input
                  type="text"
                  readOnly
                  value="ADMIN"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold uppercase"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[11px] font-semibold leading-relaxed">
                ℹ An automated assignment email will immediately be dispatched to the selected Admin informing them of their new Club Admin privileges.
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                >
                  {isSubmitting ? 'Assigning...' : 'Confirm Club Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REMOVE ASSIGNMENT CONFIRM MODAL */}
      {removingAssignment && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleIn">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center font-bold">
                <Trash2 size={22} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Remove Club Admin</h3>
                <p className="text-xs text-slate-500 font-bold">
                  {removingAssignment.adminName} from {removingAssignment.clubName}
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 font-semibold leading-relaxed">
              Removing this assignment will revoke event creation & management privileges for {removingAssignment.clubName}. A notification email will be sent to {removingAssignment.adminEmail}.
            </div>

            <form onSubmit={handleRemoveConfirm} className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRemovingAssignment(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                {isSubmitting ? 'Removing...' : 'Confirm Revoke Assignment'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
