'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Clock, ShieldCheck, Search, RefreshCw, Eye, FileText, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export interface NotificationLogItem {
  id: string;
  recipient: string;
  type: string;
  subject: string;
  sentDate: string;
  status: string;
  relatedId?: string | null;
  metadata?: string | null;
}

export default function NotificationHistoryTable() {
  const [logs, setLogs] = useState<NotificationLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [viewingLog, setViewingLog] = useState<NotificationLogItem | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adhub_admin_token') : '';
      const res = await fetch('/api/super-admin/notification-history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setLogs(data.data);
      }
    } catch (err) {
      toast.error('Failed to load notification history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    if (typeFilter !== 'ALL' && log.type !== typeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const mRecipient = log.recipient.toLowerCase().includes(q);
      const mSubject = log.subject.toLowerCase().includes(q);
      const mType = log.type.toLowerCase().includes(q);
      return mRecipient || mSubject || mType;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-mono font-bold mb-3">
              <Mail size={14} /> SYSTEM NOTIFICATION AUDIT TRAIL
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Notification & Email History Logs
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl font-medium">
              Complete historical record of automated email notifications dispatched by the portal (Admin Registrations, Approvals, Rejections, Club Assignments, and Removals).
            </p>
          </div>

          <button
            onClick={fetchLogs}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition-all cursor-pointer self-start md:self-auto"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh History
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto max-w-full">
          <button
            onClick={() => setTypeFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              typeFilter === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Logs ({logs.length})
          </button>
          <button
            onClick={() => setTypeFilter('CLUB_ADMIN_ASSIGNED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              typeFilter === 'CLUB_ADMIN_ASSIGNED' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Club Assigned
          </button>
          <button
            onClick={() => setTypeFilter('CLUB_ADMIN_REMOVED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              typeFilter === 'CLUB_ADMIN_REMOVED' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Club Removed
          </button>
          <button
            onClick={() => setTypeFilter('ADMIN_APPROVED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              typeFilter === 'ADMIN_APPROVED' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Admin Approved
          </button>
          <button
            onClick={() => setTypeFilter('ADMIN_REGISTRATION')}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              typeFilter === 'ADMIN_REGISTRATION' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Registration Request
          </button>
        </div>

        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Recipient Email, Subject, or Type..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Clock size={18} className="text-indigo-600" />
            Dispatched Email Audit Log Trail
          </h3>
          <span className="text-xs font-mono font-bold text-slate-500">
            {filteredLogs.length} Records Listed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Notification Type</th>
                <th className="py-3.5 px-4">Recipient Email</th>
                <th className="py-3.5 px-4">Email Subject</th>
                <th className="py-3.5 px-4">Delivery Status</th>
                <th className="py-3.5 px-4">Sent Date & Time</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-bold">
                    Loading Notification History...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-bold">
                    No notification history records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold font-mono uppercase bg-indigo-50 text-indigo-900 border border-indigo-200">
                        {item.type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Mail size={13} className="text-slate-400" />
                        {item.recipient}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800 max-w-xs truncate">
                      {item.subject}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-mono ${
                          item.status === 'SUCCESS'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {item.status === 'SUCCESS' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                      {new Date(item.sentDate).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setViewingLog(item)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="View Log Payload"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW LOG MODAL */}
      {viewingLog && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Notification Log Details</h3>
                  <p className="text-xs text-slate-500 font-mono">Log ID: {viewingLog.id}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingLog(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="space-y-3 text-xs font-semibold text-slate-700">
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Recipient</span>
                <span className="font-extrabold text-slate-900 text-sm">{viewingLog.recipient}</span>
              </div>

              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Subject</span>
                <span className="font-bold text-indigo-900">{viewingLog.subject}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Notification Type</span>
                  <span className="font-mono text-slate-900">{viewingLog.type}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Sent Date & Time</span>
                  <span className="font-mono text-slate-900">
                    {new Date(viewingLog.sentDate).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}
                  </span>
                </div>
              </div>

              {viewingLog.metadata && (
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Metadata / Dispatch Payload</span>
                  <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto max-h-40">
                    {viewingLog.metadata}
                  </pre>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setViewingLog(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
              >
                Close Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
