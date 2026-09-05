'use client';
import React from 'react';
import { MOCK_REGISTRATIONS, REGISTERED_COUNTS, ATTENDED_COUNTS } from '@/lib/mockData';
import { Users, UserCheck, UserX, Percent } from 'lucide-react';

interface Props {
  eventId: string;
}

export default function AttendanceSummary({ eventId }: Props) {
  const registrations = MOCK_REGISTRATIONS.filter(r => r.eventId === eventId);
  const registered = REGISTERED_COUNTS[eventId] || registrations.length;
  const attended = registrations.filter(r => r.attendanceStatus === 'present').length ||
    ATTENDED_COUNTS[eventId] || 0;
  const absent = registrations.filter(r => r.attendanceStatus === 'absent').length;
  const notMarked = registrations.filter(r => r.attendanceStatus === 'not_marked').length;
  const attendanceRate = registered > 0 ? Math.round((attended / registered) * 100) : 0;

  const STATS = [
    { id: 'stat-registered', icon: Users, label: 'Total Registered', value: registered, color: 'text-accent', bg: 'bg-blue-50' },
    { id: 'stat-attended', icon: UserCheck, label: 'Attended', value: attended, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'stat-absent', icon: UserX, label: 'Absent', value: absent, color: 'text-red-600', bg: 'bg-red-50' },
    { id: 'stat-rate', icon: Percent, label: 'Attendance Rate', value: `${attendanceRate}%`, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {STATS.map(stat => (
        <div key={stat.id} className="bg-white rounded-2xl border border-border p-4 shadow-card">
          <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
            <stat.icon size={16} className={stat.color} />
          </div>
          <div className={`text-2xl font-extrabold ${stat.color} font-tabular`}>{stat.value}</div>
          <div className="text-xs font-semibold text-muted-foreground mt-0.5">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}