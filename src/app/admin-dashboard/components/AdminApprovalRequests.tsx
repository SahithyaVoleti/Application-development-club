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
  Calendar,
  Users,
  KeyRound,
  Plus,
  UserPlus,
  Trash2,
  Edit3,
  Eye,
  User,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import ChangePasswordModal from '@/components/auth/ChangePasswordModal';
import ClubAdminManagement from './ClubAdminManagement';
import NotificationHistoryTable from './NotificationHistoryTable';

interface AdminUserRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  staffId?: string;
  department?: string;
  designation?: string;
  role: string;
  status: 'PENDING' | 'PENDING_OTP' | 'PENDING_APPROVAL' | 'APPROVED' | 'TRUSTED_ADMIN' | 'REJECTED' | 'ACTIVE';
  otpVerified: boolean;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
}

const DEFAULT_SUPER_ADMINS: AdminUserRequest[] = [
  {
    id: 'user-super-admin-001',
    name: 'Sahithya Voleti (Super Admin)',
    email: 'sahithyalakshmivoleti@gmail.com',
    phone: '+91 9876543210',
    staffId: 'SA-001',
    department: 'Computer Science & Engineering',
    designation: 'Super Admin',
    role: 'SUPER_ADMIN',
    status: 'APPROVED',
    otpVerified: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'user-super-admin-002',
    name: 'E. Deepak Chowdary (Super Admin)',
    email: 'edaradeepakchowdary@gmail.com',
    phone: '+91 9876543211',
    staffId: 'SA-002',
    department: 'Computer Science & Engineering',
    designation: 'Super Admin',
    role: 'SUPER_ADMIN',
    status: 'APPROVED',
    otpVerified: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'user-super-admin-003',
    name: 'U. Venkateswarao (Super Admin)',
    email: 'uvr_cse@vignan.ac.in',
    phone: '+91 9876543212',
    staffId: 'SA-003',
    department: 'Computer Science & Engineering',
    designation: 'Super Admin',
    role: 'SUPER_ADMIN',
    status: 'APPROVED',
    otpVerified: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

export default function AdminApprovalRequests() {
  const [currentUserRole, setCurrentUserRole] = useState<string>('ADMIN');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('adhub_admin_user');
      if (userStr) {
        try {
          const u = JSON.parse(userStr);
          if (u?.role) setCurrentUserRole(u.role);
        } catch (e) {}
      }
    }
  }, []);

  const [topTab, setTopTab] = useState<'APPROVALS' | 'CLUB_ASSIGNMENTS' | 'NOTIFICATION_HISTORY'>('APPROVALS');
  const [requests, setRequests] = useState<AdminUserRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [portalTab, setPortalTab] = useState<'SUPER_ADMIN' | 'NORMAL_ADMIN'>('NORMAL_ADMIN');
  const [filter, setFilter] = useState<'SUPER_ADMIN' | 'PENDING' | 'ALL' | 'APPROVED' | 'REJECTED' | 'AUDIT'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [viewingUser, setViewingUser] = useState<AdminUserRequest | null>(null);
  const [rejectingUser, setRejectingUser] = useState<AdminUserRequest | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUserRequest | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUserRequest | null>(null);
  const [resetUser, setResetUser] = useState<AdminUserRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add Admin modal state
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addStaffId, setAddStaffId] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addDepartment, setAddDepartment] = useState('CSE');
  const [addDesignation, setAddDesignation] = useState('Faculty Coordinator');
  const [addClubId, setAddClubId] = useState('club-appdev');
  const [addPassword, setAddPassword] = useState('');

  // Edit Admin form fields
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editStaffId, setEditStaffId] = useState('');
  const [editDepartment, setEditDepartment] = useState('CSE');
  const [editDesignation, setEditDesignation] = useState('Faculty Coordinator');
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  const superAdminEmails = [
    'sahithyalakshmivoleti@gmail.com',
    'edaradeepakchowdary@gmail.com',
    'uvr_cse@vignan.ac.in',
  ];

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adhub_admin_token') : '';
      const res = await fetch('/api/super-admin/admins', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.admins)) {
        setRequests(data.admins);
      } else if (Array.isArray(data.requests)) {
        setRequests(data.requests);
      }

      // Fetch Audit Logs
      const auditRes = await fetch('/api/super-admin/audit-logs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const auditData = await auditRes.json();
      if (auditData.success && Array.isArray(auditData.auditLogs)) {
        setAuditLogs(auditData.auditLogs);
      }
    } catch (err) {
      toast.error('Network error fetching admin accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAddAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim() || !addEmail.trim() || !addPassword) {
      toast.error('Name, Email, and Password are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adhub_admin_token') : '';
      const res = await fetch('/api/super-admin/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: addName.trim(),
          email: addEmail.trim(),
          staffId: addStaffId.trim(),
          phone: addPhone.trim(),
          department: addDepartment,
          designation: addDesignation,
          clubId: addClubId,
          password: addPassword,
        }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.emailSent) {
          toast.success(data.message || `Admin account created & welcome email delivered to ${addEmail}`);
        } else {
          toast.warning(data.message || `Admin created, but notification email failed to send.`);
        }
        setIsAddAdminOpen(false);
        setAddName('');
        setAddEmail('');
        setAddStaffId('');
        setAddPhone('');
        setAddPassword('');
        fetchRequests();
      } else {
        toast.error(data.message || data.error || 'Failed to add new admin.');
      }
    } catch (err: any) {
      toast.error('Network error adding admin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendEmail = async (user: AdminUserRequest) => {
    setIsSubmitting(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adhub_admin_token') : '';
      const res = await fetch(`/api/super-admin/admins/${encodeURIComponent(user.id || user.email)}/resend-email`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message || `Welcome email resent to ${user.email}`);
      } else {
        toast.error(data.message || data.error || 'Failed to resend welcome email.');
      }
    } catch (err) {
      toast.error('Network error resending email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async (idOrEmail: string, name: string) => {
    if (!confirm(`Are you sure you want to approve ${name} as an APPROVED ADMIN?`)) return;

    setIsSubmitting(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adhub_admin_token') : '';
      const res = await fetch(`/api/super-admin/admins/${encodeURIComponent(idOrEmail)}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Admin access APPROVED for ${name}`, {
          description: 'User is now an APPROVED ADMIN and can access the Admin Dashboard.',
        });
        fetchRequests();
      } else if (data.alreadyProcessed) {
        toast.info('Request Processed', {
          description: 'This approval request has already been processed by a Super Admin.',
        });
        fetchRequests();
      } else {
        toast.error(data.message || data.error || 'Failed to approve admin request');
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
      const res = await fetch(`/api/super-admin/admins/${encodeURIComponent(rejectingUser.id)}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason: rejectionReason.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.warning(`Admin request REJECTED for ${rejectingUser.name}`);
        setRejectingUser(null);
        setRejectionReason('');
        fetchRequests();
      } else if (data.alreadyProcessed) {
        toast.info('Request Processed', {
          description: 'This approval request has already been processed by a Super Admin.',
        });
        setRejectingUser(null);
        fetchRequests();
      } else {
        toast.error(data.message || data.error || 'Failed to reject admin request');
      }
    } catch (e) {
      toast.error('Network error during rejection');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletingUser) return;

    setIsSubmitting(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adhub_admin_token') : '';
      const res = await fetch(`/api/super-admin/admins/${encodeURIComponent(deletingUser.id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || `Admin ${deletingUser.name} deleted successfully.`);
        setDeletingUser(null);
        setViewingUser(null);
        fetchRequests();
      } else {
        toast.error(data.message || data.error || 'Failed to delete admin.');
      }
    } catch (e) {
      toast.error('Network error deleting admin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (user: AdminUserRequest) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPhone(user.phone || '');
    setEditStaffId(user.staffId || '');
    setEditDepartment(user.department || 'CSE');
    setEditDesignation(user.designation || 'Faculty Coordinator');
  };

  const handleConfirmEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setIsSubmitting(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adhub_admin_token') : '';
      const res = await fetch(`/api/super-admin/admins/${encodeURIComponent(editingUser.id)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName.trim(),
          email: editEmail.trim(),
          phone: editPhone.trim(),
          staffId: editStaffId.trim(),
          department: editDepartment,
          designation: editDesignation.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Updated details for ${editName}`);
        setEditingUser(null);
        fetchRequests();
      } else {
        toast.error(data.message || data.error || 'Failed to update admin details');
      }
    } catch (e) {
      toast.error('Network error updating admin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchedSuperAdmins = requests.filter(
    r => r.role === 'SUPER_ADMIN' || superAdminEmails.includes((r.email || '').toLowerCase())
  );

  const superAdminsList = fetchedSuperAdmins.length > 0 ? fetchedSuperAdmins : DEFAULT_SUPER_ADMINS;

  const normalAdminsList = requests.filter(
    r => r.role !== 'SUPER_ADMIN' && !superAdminEmails.includes((r.email || '').toLowerCase())
  );

  const targetList = portalTab === 'SUPER_ADMIN' || filter === 'SUPER_ADMIN' ? superAdminsList : normalAdminsList;

  const filteredRequests = targetList.filter(req => {
    if (portalTab === 'NORMAL_ADMIN' && filter !== 'SUPER_ADMIN') {
      const isPending = req.status === 'PENDING' || req.status === 'PENDING_APPROVAL' || req.status === 'PENDING_OTP';
      const isApproved = req.status === 'APPROVED' || req.status === 'TRUSTED_ADMIN' || req.status === 'ACTIVE';
      const isRejected = req.status === 'REJECTED';

      if (filter === 'PENDING' && !isPending) return false;
      if (filter === 'APPROVED' && !isApproved) return false;
      if (filter === 'REJECTED' && !isRejected) return false;
    }

    if (searchQuery) {
      const q = (searchQuery || '').toLowerCase();
      const matchName = req.name ? req.name.toLowerCase().includes(q) : false;
      const matchEmail = req.email ? req.email.toLowerCase().includes(q) : false;
      const matchStaff = (req.staffId || '').toLowerCase().includes(q);
      const matchDept = (req.department || '').toLowerCase().includes(q);
      return matchName || matchEmail || matchStaff || matchDept;
    }
    return true;
  });

  const pendingCount = normalAdminsList.filter(r => r.status === 'PENDING' || r.status === 'PENDING_APPROVAL' || r.status === 'PENDING_OTP').length;
  const approvedCount = normalAdminsList.filter(r => r.status === 'APPROVED' || r.status === 'TRUSTED_ADMIN' || r.status === 'ACTIVE').length;
  const rejectedCount = normalAdminsList.filter(r => r.status === 'REJECTED').length;

  if (currentUserRole !== 'SUPER_ADMIN') {
    return (
      <div className="p-8 max-w-xl mx-auto my-12 bg-white rounded-3xl border border-rose-200 shadow-xl text-center space-y-4 font-sans">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert size={30} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900">403 Forbidden</h2>
          <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
            You do not have permission to manage administrators. This section is restricted exclusively to Super Admins.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* TOP GOVERNANCE SUB-NAVIGATION TABS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-100 p-2 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => setTopTab('APPROVALS')}
          className={`flex-1 py-3 px-3 sm:px-4 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
            topTab === 'APPROVALS'
              ? 'bg-gradient-to-r from-indigo-900 to-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <ShieldCheck size={16} /> Faculty Approvals & Accounts
        </button>

        <button
          onClick={() => setTopTab('CLUB_ASSIGNMENTS')}
          className={`flex-1 py-3 px-3 sm:px-4 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
            topTab === 'CLUB_ASSIGNMENTS'
              ? 'bg-gradient-to-r from-indigo-900 to-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Building size={16} /> Club Admin Assignments
        </button>

        <button
          onClick={() => setTopTab('NOTIFICATION_HISTORY')}
          className={`flex-1 py-3 px-3 sm:px-4 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
            topTab === 'NOTIFICATION_HISTORY'
              ? 'bg-gradient-to-r from-indigo-900 to-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Mail size={16} /> Notification Audit History
        </button>
      </div>

      {topTab === 'CLUB_ASSIGNMENTS' ? (
        <ClubAdminManagement />
      ) : topTab === 'NOTIFICATION_HISTORY' ? (
        <NotificationHistoryTable />
      ) : (
        <>
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-mono font-bold mb-3">
                  <ShieldCheck size={14} /> SUPER ADMIN & FACULTY CONTROL CENTER
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Admin Access & Governance Portals
                </h1>
                <p className="text-sm text-slate-300 mt-1 max-w-2xl font-medium">
                  Manage configured Super Admins and review, approve, or reject requested Faculty Admin accounts.
                </p>
              </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={() => setIsAddAdminOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs backdrop-blur-md shadow-md transition-all cursor-pointer"
            >
              <UserPlus size={15} />
              + Add New Admin
            </button>

            <button
              onClick={fetchRequests}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* TOP DUAL-PORTAL SWITCHER TABS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-100 p-2 rounded-3xl border border-slate-200 shadow-sm">
        <button
          onClick={() => {
            setPortalTab('SUPER_ADMIN');
            setFilter('SUPER_ADMIN');
          }}
          className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer text-left ${
            portalTab === 'SUPER_ADMIN'
              ? 'bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-lg ring-2 ring-purple-400'
              : 'bg-white text-slate-700 hover:bg-purple-50/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
              portalTab === 'SUPER_ADMIN' ? 'bg-purple-500/30 text-purple-200' : 'bg-purple-100 text-purple-700'
            }`}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base tracking-tight">Super Admin Portal</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  portalTab === 'SUPER_ADMIN' ? 'bg-purple-400/20 text-purple-200' : 'bg-purple-100 text-purple-800'
                }`}>
                  👑 3 Super Admins
                </span>
              </div>
              <p className={`text-xs mt-0.5 font-medium ${portalTab === 'SUPER_ADMIN' ? 'text-purple-200' : 'text-slate-500'}`}>
                Sahithya Voleti, E. Deepak Chowdary, U. Venkateswarao
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            setPortalTab('NORMAL_ADMIN');
            if (filter === 'SUPER_ADMIN') setFilter('PENDING');
          }}
          className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer text-left ${
            portalTab === 'NORMAL_ADMIN'
              ? 'bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white shadow-lg ring-2 ring-indigo-400'
              : 'bg-white text-slate-700 hover:bg-indigo-50/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
              portalTab === 'NORMAL_ADMIN' ? 'bg-blue-500/30 text-blue-200' : 'bg-blue-100 text-blue-700'
            }`}>
              <Users size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base tracking-tight">Normal Admin Portal</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  portalTab === 'NORMAL_ADMIN' ? 'bg-blue-400/20 text-blue-200' : 'bg-blue-100 text-blue-800'
                }`}>
                  🛡️ {normalAdminsList.length} Faculty Accounts
                </span>
              </div>
              <p className={`text-xs mt-0.5 font-medium ${portalTab === 'NORMAL_ADMIN' ? 'text-blue-200' : 'text-slate-500'}`}>
                Faculty Coordinators, Pending Approvals & Status Control
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* PORTAL SPECIFIC CONTENT */}
      {portalTab === 'SUPER_ADMIN' ? (
        /* SUPER ADMIN PORTAL VIEW */
        <div className="space-y-6 animate-fadeIn">
          {/* Search Bar for Super Admins */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800">
              <ShieldCheck size={16} className="text-purple-600" />
              <span>Super Admin Accounts ({superAdminsList.length})</span>
            </div>

            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Super Admins by Name, Email, or Staff ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-semibold focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Super Admins Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredRequests.map(superAdmin => (
              <div
                key={superAdmin.id}
                className="bg-white rounded-3xl border-2 border-purple-200 p-6 shadow-md hover:shadow-xl transition-all flex flex-col justify-between relative group overflow-hidden"
              >
                {/* Top Purple Accent line */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600" />

                <div className="space-y-4 pt-1">
                  {/* Status & Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase border bg-purple-100 text-purple-800 border-purple-300 flex items-center gap-1">
                      👑 SUPER ADMIN
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      ID: {superAdmin.staffId || 'SA-00' + (superAdmin.id.slice(-1) || '1')}
                    </span>
                  </div>

                  {/* Super Admin Info */}
                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-purple-900 transition-colors">
                      {superAdmin.name}
                    </h3>
                    <p className="text-xs text-purple-700 font-semibold mt-0.5 flex items-center gap-1.5">
                      <Mail size={13} className="text-purple-500" />
                      {superAdmin.email}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="text-[11px] font-bold text-slate-500">Phone:</span>
                      <span className="font-extrabold text-slate-900">{superAdmin.phone || '+91 9876543210'}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="text-[11px] font-bold text-slate-500">Department:</span>
                      <span className="font-extrabold text-slate-900">{superAdmin.department || 'Computer Science & Eng.'}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="text-[11px] font-bold text-slate-500">Designation:</span>
                      <span className="font-extrabold text-purple-900">{superAdmin.designation || 'Super Admin'}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="text-[11px] font-bold text-slate-500">Privileges:</span>
                      <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                        Full System Control
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setViewingUser(superAdmin)}
                    className="flex-1 py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-purple-200"
                  >
                    <Eye size={15} /> View Details
                  </button>
                  <button
                    onClick={() => handleOpenEdit(superAdmin)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
                    title="Edit Super Admin details"
                  >
                    <Edit3 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* NORMAL ADMIN PORTAL VIEW */
        <div className="space-y-6 animate-fadeIn">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div
              onClick={() => setFilter('PENDING')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                filter === 'PENDING'
                  ? 'bg-amber-500/10 border-amber-500/50 shadow-md'
                  : 'bg-white border-slate-200 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Pending Requests
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                  <Clock size={16} />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{pendingCount}</div>
              <div className="text-[10px] text-amber-700 font-semibold mt-1 truncate">
                {pendingCount > 0 ? 'Awaiting Review' : 'All Clear'}
              </div>
            </div>

            <div
              onClick={() => setFilter('APPROVED')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                filter === 'APPROVED'
                  ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md'
                  : 'bg-white border-slate-200 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Approved Admins
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  <UserCheck size={16} />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{approvedCount}</div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-1 truncate">Active & Eligible</div>
            </div>

            <div
              onClick={() => setFilter('REJECTED')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                filter === 'REJECTED'
                  ? 'bg-rose-500/10 border-rose-500/50 shadow-md'
                  : 'bg-white border-slate-200 hover:border-rose-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Rejected Admins
                </span>
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                  <UserX size={16} />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{rejectedCount}</div>
              <div className="text-[10px] text-rose-700 font-semibold mt-1 truncate">Access Denied</div>
            </div>

            <div
              onClick={() => setFilter('ALL')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                filter === 'ALL'
                  ? 'bg-indigo-500/10 border-indigo-500/50 shadow-md'
                  : 'bg-white border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Total Accounts
                </span>
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                  <Users size={16} />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{normalAdminsList.length}</div>
              <div className="text-[10px] text-indigo-700 font-semibold mt-1 truncate">All Normal Admin Accounts</div>
            </div>
          </div>

          {/* Filter Tabs & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto max-w-full">
              <button
                onClick={() => setFilter('PENDING')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  filter === 'PENDING' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setFilter('APPROVED')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  filter === 'APPROVED' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Approved ({approvedCount})
              </button>
              <button
                onClick={() => setFilter('REJECTED')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  filter === 'REJECTED' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Rejected ({rejectedCount})
              </button>
              <button
                onClick={() => setFilter('ALL')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  filter === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All Accounts ({normalAdminsList.length})
              </button>
              <button
                onClick={() => setFilter('AUDIT')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  filter === 'AUDIT' ? 'bg-indigo-900 text-white shadow-2xs' : 'text-indigo-600 hover:text-indigo-900'
                }`}
              >
                Audit History ({auditLogs.length})
              </button>
            </div>

            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Name, Email, Staff ID or Dept..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Audit Logs View */}
          {filter === 'AUDIT' ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-indigo-600" />
                  Super Admin Approval Audit History
                </h3>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {auditLogs.length} Actions Logged
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Admin Name & Email</th>
                      <th className="py-3 px-4">Performed By</th>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Details / Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {auditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          No audit history records available yet.
                        </td>
                      </tr>
                    ) : (
                      auditLogs.map((log: any) => (
                        <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold font-mono ${
                                log.action === 'APPROVED'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-rose-100 text-rose-800 border border-rose-300'
                              }`}
                            >
                              {log.action}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{log.adminName}</div>
                            <div className="text-[11px] text-slate-500">{log.adminEmail}</div>
                          </td>
                          <td className="py-3 px-4 font-bold text-indigo-900">
                            {log.performedBy || 'Super Admin'}
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                            {new Date(log.performedAt).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {log.rejectionReason || 'Approved Admin Access'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : loading ? (
            <div className="py-16 text-center text-slate-500 text-xs font-bold space-y-2">
              <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <div>Loading Admin Accounts...</div>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3 animate-fadeIn">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                {filter === 'PENDING' && 'No Pending Approval Requests'}
                {filter === 'APPROVED' && 'No Approved Admin Accounts'}
                {filter === 'REJECTED' && 'No Rejected Admin Accounts'}
                {filter === 'ALL' && 'No Normal Admin Accounts Found'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                {filter === 'REJECTED' && 'There are currently 0 rejected normal admin accounts.'}
                {filter === 'PENDING' && 'All submitted faculty registration requests have been reviewed.'}
                {filter === 'APPROVED' && 'No active approved normal admin accounts found.'}
                {filter === 'ALL' && 'No admin accounts match your search query.'}
              </p>
              {filter !== 'ALL' && (
                <button
                  onClick={() => setFilter('ALL')}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  View All Accounts ({normalAdminsList.length})
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests.map(req => {
                const isApproved = req.status === 'APPROVED' || req.status === 'TRUSTED_ADMIN' || req.status === 'ACTIVE';
                const isPending = req.status === 'PENDING' || req.status === 'PENDING_APPROVAL' || req.status === 'PENDING_OTP';
                const isRejected = req.status === 'REJECTED';
                const isSuper = req.role === 'SUPER_ADMIN';

                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative group"
                  >
                    <div className="space-y-4">
                      {/* Status Badge & Role */}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase border ${
                            isApproved
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : isRejected
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                          }`}
                        >
                          {isApproved ? 'APPROVED' : isRejected ? 'REJECTED' : 'PENDING'}
                        </span>

                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          ID: {req.staffId || 'STAFF-N/A'}
                        </span>
                      </div>

                      {/* Account Name */}
                      <div>
                    <h3 className="text-lg font-black text-slate-900 leading-snug tracking-tight">
                      {req.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Registered: {new Date(req.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Info Details */}
                  <div className="space-y-2 text-xs font-semibold text-slate-700 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail size={15} className="text-slate-400 flex-shrink-0" />
                      <span className="break-all truncate text-xs font-semibold text-slate-700" title={req.email}>{req.email}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone size={15} className="text-slate-400 flex-shrink-0" />
                      <span>{req.phone || 'N/A'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Building size={15} className="text-slate-400 flex-shrink-0" />
                      <span>Dept: {req.department || 'CSE'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Sparkles size={15} className="text-indigo-500 flex-shrink-0" />
                      <span>Role/Desig: {req.designation || 'Faculty Coordinator'}</span>
                    </div>
                  </div>

                  {req.rejectionReason && (
                    <div className="mt-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 font-semibold space-y-1">
                      <div className="font-extrabold text-rose-950 flex items-center gap-1">
                        <AlertTriangle size={13} /> Rejection Reason:
                      </div>
                      <div>{req.rejectionReason}</div>
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-5 mt-4 border-t border-slate-100 flex flex-col gap-2">
                  <button
                    onClick={() => setViewingUser(req)}
                    className="w-full py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-indigo-200"
                  >
                    <Eye size={15} /> View Details
                  </button>

                  {isPending && (
                    <div className="flex items-center gap-2 w-full">
                      <button
                        onClick={() => handleApprove(req.id || req.email, req.name)}
                        disabled={isSubmitting}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <UserCheck size={15} /> Approve
                      </button>
                      <button
                        onClick={() => setRejectingUser(req)}
                        disabled={isSubmitting}
                        className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <UserX size={15} /> Reject
                      </button>
                      {!isSuper && (
                        <button
                          onClick={() => setDeletingUser(req)}
                          disabled={isSubmitting}
                          className="p-2.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-700 font-bold text-xs transition-all flex items-center justify-center cursor-pointer"
                          title="Delete Request"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  )}

                  {!isPending && (
                    <div className="flex flex-wrap items-center justify-between gap-2 w-full">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          onClick={() => handleOpenEdit(req)}
                          className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        {isApproved && (
                          <>
                            <button
                              onClick={() => setResetUser(req)}
                              className="py-2 px-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <KeyRound size={14} /> Password
                            </button>
                            <button
                              onClick={() => handleResendEmail(req)}
                              disabled={isSubmitting}
                              className="py-2 px-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                              title="Resend welcome email with club assignment"
                            >
                              <Mail size={14} /> Resend Email
                            </button>
                          </>
                        )}
                      </div>

                      {!isSuper && (
                        <button
                          onClick={() => setDeletingUser(req)}
                          className="py-2 px-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                          title="Delete Admin Account"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      <ChangePasswordModal
        isOpen={!!resetUser}
        onClose={() => setResetUser(null)}
        targetUser={resetUser ? { id: resetUser.id, name: resetUser.name, email: resetUser.email } : undefined}
        isSuperAdminReset={true}
      />

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

      {/* DELETE CONFIRMATION MODAL */}
      {deletingUser && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleIn">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center font-bold">
                <Trash2 size={22} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Delete Admin Account</h3>
                <p className="text-xs text-slate-500 font-bold">{deletingUser.name} ({deletingUser.email})</p>
              </div>
            </div>

            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 font-semibold leading-relaxed">
              Are you sure you want to delete this Admin? This action cannot be undone.
            </div>

            <form onSubmit={handleConfirmDelete} className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                {isSubmitting ? 'Deleting...' : 'Delete Admin'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ADMIN MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-scaleIn">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Edit3 size={22} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Edit Admin Details</h3>
                <p className="text-xs text-slate-500 font-medium">Update profile for {editingUser.name}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Staff ID</label>
                  <input
                    type="text"
                    value={editStaffId}
                    onChange={e => setEditStaffId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono uppercase focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Department</label>
                  <select
                    value={editDepartment}
                    onChange={e => setEditDepartment(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white cursor-pointer"
                  >
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="MECH">MECH</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Designation</label>
                  <input
                    type="text"
                    value={editDesignation}
                    onChange={e => setEditDesignation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW ADMIN MODAL (SUPER ADMIN ONLY) */}
      {isAddAdminOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-scaleIn relative">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0">
                <UserPlus size={22} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Add New Trusted Admin</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Directly register and grant Approved Admin dashboard access to a faculty member.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddAdminSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Faculty / Admin Full Name *
                </label>
                <div className="relative">
                  <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Dr. Jane Doe"
                    value={addName}
                    onChange={e => setAddName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Faculty Email Address *
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="faculty@vignan.ac.in"
                      value={addEmail}
                      onChange={e => setAddEmail(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="+91 9876543210"
                      value={addPhone}
                      onChange={e => setAddPhone(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Staff / Faculty ID
                  </label>
                  <div className="relative">
                    <BadgeCheck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="FAC-CSE-005"
                      value={addStaffId}
                      onChange={e => setAddStaffId(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono uppercase focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Department *
                  </label>
                  <div className="relative">
                    <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                    <select
                      value={addDepartment}
                      onChange={e => setAddDepartment(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer"
                    >
                      <option value="CSE">Computer Science & Engineering (CSE)</option>
                      <option value="IT">Information Technology (IT)</option>
                      <option value="AI/ML">Artificial Intelligence & Machine Learning</option>
                      <option value="ECE">Electronics & Communication (ECE)</option>
                      <option value="EEE">Electrical & Electronics (EEE)</option>
                      <option value="MECH">Mechanical Engineering</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Assign to Club / Organization *
                </label>
                <div className="relative">
                  <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                  <select
                    value={addClubId}
                    onChange={e => setAddClubId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer"
                  >
                    <option value="club-appdev">Application Development Club</option>
                    <option value="club-ai">AI & ML Club</option>
                    <option value="club-coding">Competitive Coding Club</option>
                    <option value="club-webdev">Web & Cloud Developers Club</option>
                    <option value="club-cyber">Cyber Security & Forensics Club</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Set Initial Password *
                </label>
                <div className="relative">
                  <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Minimum 6 characters"
                    value={addPassword}
                    onChange={e => setAddPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddAdminOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting ? 'Creating Admin...' : 'Create Approved Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* VIEW DETAILS MODAL */}
      {viewingUser && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-scaleIn max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">{viewingUser.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">Admin Approval Request & Profile Details</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase border ${
                    viewingUser.role === 'SUPER_ADMIN'
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : viewingUser.status === 'APPROVED' || viewingUser.status === 'TRUSTED_ADMIN' || viewingUser.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : viewingUser.status === 'REJECTED'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                  }`}
                >
                  {viewingUser.role === 'SUPER_ADMIN' ? '👑 SUPER ADMIN' : viewingUser.status}
                </span>
                <button
                  onClick={() => setViewingUser(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <XCircle size={22} />
                </button>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-4 text-xs">
              {/* 1. Personal Information */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-indigo-900 flex items-center gap-2 mb-3">
                  <User size={15} /> Personal Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-medium text-slate-700">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Full Name</span>
                    <span className="font-extrabold text-slate-900 text-sm">{viewingUser.name}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Email Address</span>
                    <span className="font-bold text-slate-900">{viewingUser.email}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Phone Number</span>
                    <span className="font-bold text-slate-900">{viewingUser.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* 2. Professional Information */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-indigo-900 flex items-center gap-2 mb-3">
                  <BadgeCheck size={15} /> Professional Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-medium text-slate-700">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Staff / Employee ID</span>
                    <span className="font-bold font-mono text-slate-900">{viewingUser.staffId || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Department</span>
                    <span className="font-bold text-slate-900">{viewingUser.department || 'CSE'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Designation / Position</span>
                    <span className="font-bold text-slate-900">{viewingUser.designation || 'Faculty Coordinator'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Requested Role</span>
                    <span className="font-extrabold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">{viewingUser.role}</span>
                  </div>
                </div>
              </div>

              {/* 3. Registration & System Information */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-indigo-900 flex items-center gap-2 mb-3">
                  <Clock size={15} /> Registration & System Audit Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-medium text-slate-700">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Request ID</span>
                    <span className="font-mono text-[11px] text-slate-800">{viewingUser.id}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Registered Date & Time</span>
                    <span className="font-bold text-slate-900">
                      {new Date(viewingUser.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">2FA OTP Security Status</span>
                    <span className={`font-bold ${viewingUser.otpVerified ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {viewingUser.otpVerified ? '✔ Verified OTP' : '⏳ Pending OTP Verification'}
                    </span>
                  </div>
                </div>

                {viewingUser.approvedBy && (
                  <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                    <span className="text-slate-500 font-bold">
                      Approved By: <strong className="text-emerald-800">{viewingUser.approvedBy}</strong>
                    </span>
                    {viewingUser.approvedAt && (
                      <span className="text-slate-500 font-bold">
                        Approved At: <strong className="text-slate-800">{new Date(viewingUser.approvedAt).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}</strong>
                      </span>
                    )}
                  </div>
                )}

                {viewingUser.rejectionReason && (
                  <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 font-semibold">
                    <strong>Rejection Reason:</strong> {viewingUser.rejectionReason}
                  </div>
                )}
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-100">
              <div>
                {viewingUser.role !== 'SUPER_ADMIN' && (
                  <button
                    onClick={() => {
                      const u = viewingUser;
                      setViewingUser(null);
                      setDeletingUser(u);
                    }}
                    disabled={isSubmitting}
                    className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 size={16} /> Delete Account
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {(viewingUser.status === 'PENDING' || viewingUser.status === 'PENDING_APPROVAL' || viewingUser.status === 'PENDING_OTP') && (
                  <>
                    <button
                      onClick={() => {
                        const u = viewingUser;
                        setViewingUser(null);
                        handleApprove(u.id || u.email, u.name);
                      }}
                      disabled={isSubmitting}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <UserCheck size={16} /> Approve Admin
                    </button>
                    <button
                      onClick={() => {
                        const u = viewingUser;
                        setViewingUser(null);
                        setRejectingUser(u);
                      }}
                      disabled={isSubmitting}
                      className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <UserX size={16} /> Reject Admin
                    </button>
                  </>
                )}
                {viewingUser.status !== 'PENDING' && viewingUser.status !== 'PENDING_APPROVAL' && viewingUser.status !== 'PENDING_OTP' && (
                  <button
                    onClick={() => {
                      const u = viewingUser;
                      setViewingUser(null);
                      handleResendEmail(u);
                    }}
                    disabled={isSubmitting}
                    className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Mail size={16} /> Resend Welcome Email
                  </button>
                )}
                <button
                  onClick={() => setViewingUser(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
