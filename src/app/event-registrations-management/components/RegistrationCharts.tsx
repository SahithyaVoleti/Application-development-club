'use client';
import React from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import type { Event } from '@/lib/mockData';
import { REGISTERED_COUNTS, ATTENDED_COUNTS } from '@/lib/mockData';

interface Props {
  eventId: string;
  event: Event;
}

// BACKEND: GET /api/events/:id/statistics — all data from DB aggregations
const YEAR_DATA_BY_EVENT: Record<string, { year: string; count: number }[]> = {
  'event-001': [
    { year: '1st Year', count: 8 },
    { year: '2nd Year', count: 32 },
    { year: '3rd Year', count: 54 },
    { year: '4th Year', count: 30 },
  ],
  'event-002': [
    { year: '1st Year', count: 0 },
    { year: '2nd Year', count: 18 },
    { year: '3rd Year', count: 42 },
    { year: '4th Year', count: 27 },
  ],
  'event-003': [
    { year: '1st Year', count: 5 },
    { year: '2nd Year', count: 38 },
    { year: '3rd Year', count: 24 },
    { year: '4th Year', count: 5 },
  ],
  'event-007': [
    { year: '1st Year', count: 12 },
    { year: '2nd Year', count: 45 },
    { year: '3rd Year', count: 78 },
    { year: '4th Year', count: 45 },
  ],
  'event-008': [
    { year: '1st Year', count: 5 },
    { year: '2nd Year', count: 22 },
    { year: '3rd Year', count: 48 },
    { year: '4th Year', count: 45 },
  ],
};

const DEPT_DATA_BY_EVENT: Record<string, { dept: string; count: number }[]> = {
  'event-001': [
    { dept: 'CSE', count: 89 },
    { dept: 'IT', count: 22 },
    { dept: 'ECE', count: 10 },
    { dept: 'Others', count: 3 },
  ],
  'event-002': [
    { dept: 'CSE', count: 72 },
    { dept: 'IT', count: 12 },
    { dept: 'ECE', count: 3 },
  ],
  'event-003': [
    { dept: 'CSE', count: 58 },
    { dept: 'IT', count: 10 },
    { dept: 'ECE', count: 4 },
  ],
  'event-007': [
    { dept: 'CSE', count: 145 },
    { dept: 'IT', count: 25 },
    { dept: 'ECE', count: 10 },
  ],
  'event-008': [
    { dept: 'CSE', count: 98 },
    { dept: 'IT', count: 15 },
    { dept: 'ECE', count: 7 },
  ],
};

const TREND_DATA_BY_EVENT: Record<string, { date: string; count: number }[]> = {
  'event-001': [
    { date: '10 Aug', count: 12 },
    { date: '11 Aug', count: 28 },
    { date: '12 Aug', count: 19 },
    { date: '13 Aug', count: 31 },
    { date: '14 Aug', count: 17 },
    { date: '15 Aug', count: 9 },
    { date: '16 Aug', count: 5 },
    { date: '17 Aug', count: 3 },
  ],
  'event-002': [
    { date: '12 Aug', count: 15 },
    { date: '13 Aug', count: 22 },
    { date: '14 Aug', count: 18 },
    { date: '15 Aug', count: 14 },
    { date: '16 Aug', count: 11 },
    { date: '17 Aug', count: 7 },
  ],
  'event-003': [
    { date: '15 Aug', count: 20 },
    { date: '16 Aug', count: 31 },
    { date: '17 Aug', count: 15 },
    { date: '18 Aug', count: 6 },
  ],
  'event-007': [
    { date: '14 Jul', count: 35 },
    { date: '15 Jul', count: 42 },
    { date: '16 Jul', count: 38 },
    { date: '17 Jul', count: 65 },
  ],
  'event-008': [
    { date: '28 Jul', count: 28 },
    { date: '29 Jul', count: 45 },
    { date: '30 Jul', count: 32 },
    { date: '31 Jul', count: 15 },
  ],
};

const DEPT_COLORS = ['#2563eb', '#7c3aed', '#0891b2', '#ca8a04'];
const DEFAULT_YEAR_DATA = [
  { year: '1st Year', count: 5 },
  { year: '2nd Year', count: 12 },
  { year: '3rd Year', count: 8 },
  { year: '4th Year', count: 4 },
];
const DEFAULT_DEPT_DATA = [{ dept: 'CSE', count: 20 }, { dept: 'IT', count: 7 }, { dept: 'Others', count: 2 }];
const DEFAULT_TREND = [{ date: 'Day 1', count: 5 }, { date: 'Day 2', count: 12 }, { date: 'Day 3', count: 8 }];

export default function RegistrationCharts({ eventId, event }: Props) {
  const yearData = YEAR_DATA_BY_EVENT[eventId] || DEFAULT_YEAR_DATA;
  const deptData = DEPT_DATA_BY_EVENT[eventId] || DEFAULT_DEPT_DATA;
  const trendData = TREND_DATA_BY_EVENT[eventId] || DEFAULT_TREND;
  const registered = REGISTERED_COUNTS[eventId] || 0;
  const attended = ATTENDED_COUNTS[eventId] || 0;
  const isCompleted = event.status === 'COMPLETED';

  return (
    <div className="space-y-6">
      {/* Row 1: Year distribution + Dept pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-border p-5 shadow-card">
          <h3 className="text-sm font-bold text-foreground mb-4">Registrations by Year</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={yearData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-border p-5 shadow-card">
          <h3 className="text-sm font-bold text-foreground mb-4">Registrations by Department</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={deptData} cx="50%" cy="45%" outerRadius={80} dataKey="count" nameKey="dept" paddingAngle={3} label={({ dept, percent }) => `${dept} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {deptData.map((_, index) => (
                  <Cell key={`dept-reg-cell-${index}`} fill={DEPT_COLORS[index % DEPT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} />
              <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Registration trend + (if completed) attended vs registered */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-border p-5 shadow-card">
          <h3 className="text-sm font-bold text-foreground mb-4">Registration Trend Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="count" stroke="var(--accent)" strokeWidth={2.5} dot={{ r: 4, fill: 'var(--accent)' }} name="New Registrations" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {isCompleted ? (
          <div className="bg-white rounded-2xl border border-border p-5 shadow-card">
            <h3 className="text-sm font-bold text-foreground mb-4">Registered vs Attended</h3>
            <div className="flex items-center justify-center gap-8 mb-4">
              {[
                { label: 'Registered', value: registered, color: 'text-accent' },
                { label: 'Attended', value: attended, color: 'text-emerald-600' },
                { label: 'Attendance Rate', value: `${Math.round((attended / registered) * 100)}%`, color: 'text-purple-600' },
              ].map(item => (
                <div key={`att-summary-${item.label}`} className="text-center">
                  <div className={`text-2xl font-extrabold font-tabular ${item.color}`}>{item.value}</div>
                  <div className="text-xs text-muted-foreground font-medium">{item.label}</div>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={[{ name: 'Event', registered, attended }]} barSize={48} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="registered" fill="var(--accent)" radius={[4, 4, 0, 0]} name="Registered" />
                <Bar dataKey="attended" fill="#16a34a" radius={[4, 4, 0, 0]} name="Attended" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border p-5 shadow-card flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Attendance Data Unavailable</h3>
            <p className="text-xs text-muted-foreground max-w-xs">
              Registered vs attended comparison will be available once the event is completed and attendance is marked.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}