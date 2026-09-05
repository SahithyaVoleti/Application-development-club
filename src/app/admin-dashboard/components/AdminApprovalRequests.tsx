'use client';
import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  Clock,
  Mail,
  Phone,
  Building,
  BadgeCheck,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';

interface AdminUserRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  staffId?: string;
  department?: string;
  role: string;
  status: 'PENDING_OTP' | 'PENDING_APPROVAL' | 'TRUSTED_ADMIN' | 'REJECTED' | 'ACTIVE';
  otpVerified: boolean;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
}

export default function AdminApprovalRequests() {
  const [requests, setRequests] = useState<AdminUserRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'PENDING' | 'ALL' | 'TRUSTED' | 'REJECTED'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');

  // Rejection modal state
  const [rejectingUser, setRejectingUser] = useState<AdminUserRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adhub_admin_token') : '';
      const res = await fetch('/api/admin/approval-requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.requests)) {
        setRequests(data.requests);
      } else {
        toast.error(data.error || 'Failed to fetch admin approval requests');
      }
    } catch (err) {
      toast.error('Network error fetching admin requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (email: string, name: string) => {
    if (!confirm(`Are you sure you want to approve ${name} as a TRUSTED ADMIN?`)) return;

    setIsSubmitting(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adhub_admin_token') : '';
      const res = await fetch('/api/admin/approve-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, action: 'ACCEPT' }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Admin access GRANTED to ${name}`, {
          description: 'User is now a TRUSTED ADMIN and can access the Admin Dashboard.',
        });
        fetchRequests();
      } else {
        toast.error(data.error || 'Failed to approve admin request');
      }
    } catch (e) {
      toast.error('Network error during approval');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingUser) return;

    setIsSubmitting(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adhub_admin_token') : '';
      const res = await fetch('/api/admin/approve-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: rejectingUser.email,
          action: 'REJECT',
          rejectionReason: rejectionReason.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.warning(`Admin request REJECTED for ${rejectingUser.name}`);
        setRejectingUser(null);
        setRejectionReason('');
        fetchRequests();
      } else {
        toast.error(data.error || 'Failed to reject admin request');
      }
    } catch (e) {
      toast.error('Network error during rejection');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered requests list
  const filteredRequests = requests.filter(req => {
    // Filter by status tab
    if (filter === 'PENDING' && req.status !== 'PENDING_APPROVAL' && req.status !== 'PENDING_OTP') return false;
    if (filter === 'TRUSTED' && req.status !== 'TRUSTED_ADMIN' && req.status !== 'ACTIVE') return false;
    if (filter === 'REJECTED' && req.status !== 'REJECTED') return false;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = req.name.toLowerCase().includes(q);
      const matchEmail = req.email.toLowerCase().includes(q);
      const matchStaff = (req.staffId || '').toLowerCase().includes(q);
      const matchDept = (req.department || '').toLowerCase().includes(q);
      return matchName || matchEmail || matchStaff || matchDept;
    }
    return true;
  });

  const pendingCount = requests.filter(r => r.status === 'PENDING_APPROVAL' || r.status === 'PENDING_OTP').length;
  const trustedCount = requests.filter(r => r.status === 'TRUSTED_ADMIN' || r.status === 'ACTIVE').length;
  const rejectedCount = requests.filter(r => r.status === 'REJECTED').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-mono font-bold mb-3">
              <ShieldCheck size={14} /> SUPER ADMIN CONTROL CENTER
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Admin Access Approval Requests
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl font-medium">
              Review and approve or reject requested Admin accounts. Unverified pending accounts MUST be approved by Super Admin before gaining portal privileges.
            </p>
          </div>

          <button
            onClick={fetchRequests}
            disabled={loading}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition-all cursor-pointer"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh Requests
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setFilter('PENDING')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            filter === 'PENDING'
              ? 'bg-amber-500/10 border-amber-500/50 shadow-md'
              : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pending Approvals
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <Clock size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{pendingCount}</div>
          <div className="text-xs text-amber-700 font-semibold mt-1">
            {pendingCount > 0 ? 'Requires Super Admin Action' : 'All clear'}
          </div>
        </div>

        <div
          onClick={() => setFilter('TRUSTED')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            filter === 'TRUSTED'
              ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md'
              : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Trusted Admins
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <UserCheck size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{trustedCount}</div>
          <div className="text-xs text-emerald-700 font-semibold mt-1">Active Admin Accounts</div>
        </div>

        <div
          onClick={() => setFilter('REJECTED')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            filter === 'REJECTED'
              ? 'bg-rose-500/10 border-rose-500/50 shadow-md'
              : 'bg-white border-slate-200 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Rejected Requests
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
              <UserX size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{rejectedCount}</div>
          <div className="text-xs text-rose-700 font-semibold mt-1">Access Denied</div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto font-bold text-xs">
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              filter === 'PENDING'
                ? 'bg-amber-500 text-white shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('TRUSTED')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              filter === 'TRUSTED'
                ? 'bg-emerald-600 text-white shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Trusted ({trustedCount})
          </button>
          <button
            onClick={() => setFilter('REJECTED')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              filter === 'REJECTED'
                ? 'bg-rose-600 text-white shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rejected ({rejectedCount})
          </button>
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              filter === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({requests.length})
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, ID..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Admin Requests Cards List */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <div className="text-sm font-bold text-slate-600">Loading admin approval requests...</div>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">No requests found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {filter === 'PENDING'
              ? 'There are currently no pending Admin access approval requests.'
              : 'No admin accounts match your current filter or search criteria.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRequests.map(req => (
            <div
              key={req.id}
              className={`bg-white rounded-3xl border p-6 shadow-sm flex flex-col justify-between transition-all hover:shadow-md ${
                req.status === 'PENDING_APPROVAL' || req.status === 'PENDING_OTP'
                  ? 'border-amber-300 ring-2 ring-amber-400/20'
                  : req.status === 'TRUSTED_ADMIN' || req.status === 'ACTIVE'
                  ? 'border-emerald-200'
                  : 'border-rose-200'
              }`}
            >
              <div>
                {/* Status Badge Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {req.status === 'PENDING_APPROVAL' && (
                      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-extrabold text-[11px] flex items-center gap-1 border border-amber-200">
                        <Clock size={13} /> PENDING APPROVAL
                      </span>
                    )}
                    {req.status === 'PENDING_OTP' && (
                      <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 font-extrabold text-[11px] flex items-center gap-1 border border-orange-200">
                        <Clock size={13} /> PENDING OTP
                      </span>
                    )}
                    {(req.status === 'TRUSTED_ADMIN' || req.status === 'ACTIVE') && (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] flex items-center gap-1 border border-emerald-200">
                        <ShieldCheck size={13} /> TRUSTED ADMIN
                      </span>
                    )}
                    {req.status === 'REJECTED' && (
                      <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-extrabold text-[11px] flex items-center gap-1 border border-rose-200">
                        <UserX size={13} /> REJECTED
                      </span>
                    )}
                  </div>

                  {req.otpVerified ? (
                    <span
                      title="OTP Email Security Verified"
                      className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1"
                    >
                      <CheckCircle2 size={11} /> OTP Verified
                    </span>
                  ) : (
                    <span
                      title="OTP Email Verification Pending"
                      className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 flex items-center gap-1"
                    >
                      <Clock size={11} /> Unverified OTP
                    </span>
                  )}
                </div>

                {/* User Details */}
                <h3 className="text-lg font-black text-slate-900 leading-snug">{req.name}</h3>

                <div className="space-y-2 mt-3 text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-2 text-slate-800 font-bold">
                    <BadgeCheck size={15} className="text-indigo-600 flex-shrink-0" />
                    <span>Staff ID: {req.staffId || 'N/A'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail size={15} className="text-slate-400 flex-shrink-0" />
                    <span className="truncate">{req.email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone size={15} className="text-slate-400 flex-shrink-0" />
                    <span>{req.phone || 'N/A'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Building size={15} className="text-slate-400 flex-shrink-0" />
                    <span>Dept: {req.department || 'CSE'}</span>
                  </div>
                </div>

                {req.rejectionReason && (
                  <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 font-semibold space-y-1">
                    <div className="font-extrabold text-rose-950 flex items-center gap-1">
                      <AlertTriangle size={13} /> Rejection Reason:
                    </div>
                    <div>{req.rejectionReason}</div>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                {(req.status === 'PENDING_APPROVAL' || req.status === 'PENDING_OTP' || req.status === 'REJECTED') && (
                  <button
                    onClick={() => handleApprove(req.email, req.name)}
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <UserCheck size={15} /> Approve Access
                  </button>
                )}

                {(req.status === 'PENDING_APPROVAL' || req.status === 'PENDING_OTP' || req.status === 'TRUSTED_ADMIN' || req.status === 'ACTIVE') && (
                  <button
                    onClick={() => setRejectingUser(req)}
                    disabled={isSubmitting}
                    className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <UserX size={15} /> Reject
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {rejectingUser && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleIn">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center font-bold">
                <ShieldAlert size={22} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Reject Admin Account</h3>
                <p className="text-xs text-slate-500 font-bold">Denying access for {rejectingUser.name}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Rejection Reason (Optional)
                </label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  placeholder="e.g. Staff ID verification failed / Invalid department specified"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-rose-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setRejectingUser(null);
                    setRejectionReason('');
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
