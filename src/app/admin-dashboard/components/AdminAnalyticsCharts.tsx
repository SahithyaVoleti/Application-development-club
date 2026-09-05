'use client';
import React from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// BACKEND: GET /api/admin/analytics — all data from DB aggregations
const MONTHLY_TREND = [
  { month: 'Jan 26', registrations: 42, events: 1 },
  { month: 'Feb 26', registrations: 78, events: 2 },
  { month: 'Mar 26', registrations: 95, events: 2 },
  { month: 'Apr 26', registrations: 61, events: 1 },
  { month: 'May 26', registrations: 134, events: 3 },
  { month: 'Jun 26', registrations: 112, events: 2 },
  { month: 'Jul 26', registrations: 463, events: 4 },
  { month: 'Aug 26', registrations: 390, events: 3 },
];

const BY_YEAR = [
  { year: '1st Year', students: 127 },
  { year: '2nd Year', students: 342 },
  { year: '3rd Year', students: 487 },
  { year: '4th Year', students: 419 },
];

const BY_DEPARTMENT = [
  { name: 'CSE', value: 892 },
  { name: 'IT', value: 234 },
  { name: 'ECE', value: 156 },
  { name: 'EEE', value: 43 },
  { name: 'Mech', value: 28 },
  { name: 'Others', value: 22 },
];

const DEPT_COLORS = ['#2563eb', '#7c3aed', '#0891b2', '#ca8a04', '#dc2626', '#6b7280'];

const REGISTERED_VS_ATTENDED = [
  { event: 'Coding Challenge', registered: 180, attended: 162 },
  { event: 'AI Innovation', registered: 120, attended: 108 },
  { event: 'Web3 Talk', registered: 198, attended: 175 },
  { event: 'Data Ideathon', registered: 85, attended: 74 },
  { event: 'Career Workshop', registered: 247, attended: 221 },
];

const FILL_RATE_DATA = [
  { name: 'AI & ML Workshop', fillRate: 62, fill: '#2563eb' },
  { name: 'CSE Hackathon', fillRate: 58, fill: '#7c3aed' },
  { name: 'Web Dev Bootcamp', fillRate: 72, fill: '#0891b2' },
  { name: 'Cloud Seminar', fillRate: 15, fill: '#ca8a04' },
  { name: 'Cyber Security', fillRate: 48, fill: '#dc2626' },
];

export default function AdminAnalyticsCharts() {
  return (
    <div className="space-y-6">
      {/* Row 1: Monthly trend + By Year */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-5 shadow-card">
          <h3 className="text-sm font-bold text-foreground mb-1">Monthly Registration Trend</h3>
          <p className="text-xs text-muted-foreground mb-4">Registrations and events organized per month in 2026</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={MONTHLY_TREND}>
              <defs>
                <linearGradient id="regGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Area type="monotone" dataKey="registrations" stroke="var(--accent)" strokeWidth={2} fill="url(#regGrad2)" name="Registrations" />
              <Line type="monotone" dataKey="events" stroke="#7c3aed" strokeWidth={2} dot={{ r: 3 }} name="Events" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-border p-5 shadow-card">
          <h3 className="text-sm font-bold text-foreground mb-1">Students by Year</h3>
          <p className="text-xs text-muted-foreground mb-4">Participation distribution across academic years</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={BY_YEAR} layout="vertical" barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
              <YAxis dataKey="year" type="category" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} width={60} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="students" fill="var(--accent)" radius={[0, 4, 4, 0]} name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: By Department + Registered vs Attended */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-border p-5 shadow-card">
          <h3 className="text-sm font-bold text-foreground mb-1">Participation by Department</h3>
          <p className="text-xs text-muted-foreground mb-4">Total registrations across all events by department</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={BY_DEPARTMENT} cx="50%" cy="45%" outerRadius={85} dataKey="value" paddingAngle={2} label={({ name, percent }) => `${name} ${(percent * 100)?.toFixed(0)}%`} labelLine={false}>
                {BY_DEPARTMENT?.map((_, index) => (
                  <Cell key={`dept-cell-${index}`} fill={DEPT_COLORS?.[index % DEPT_COLORS?.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} />
              <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-border p-5 shadow-card">
          <h3 className="text-sm font-bold text-foreground mb-1">Registered vs Attended (Completed Events)</h3>
          <p className="text-xs text-muted-foreground mb-4">Comparison of registrations and actual attendance</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={REGISTERED_VS_ATTENDED} barGap={4} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="event" tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} angle={-10} textAnchor="end" height={40} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="registered" fill="var(--accent)" radius={[4, 4, 0, 0]} name="Registered" />
              <Bar dataKey="attended" fill="#16a34a" radius={[4, 4, 0, 0]} name="Attended" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Upcoming event fill rates */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-card">
        <h3 className="text-sm font-bold text-foreground mb-1">Upcoming Event Fill Rates</h3>
        <p className="text-xs text-muted-foreground mb-4">Registration capacity utilization for upcoming events</p>
        <div className="space-y-3">
          {FILL_RATE_DATA?.map(item => (
            <div key={`fill-${item?.name}`} className="flex items-center gap-4">
              <div className="text-sm text-foreground font-medium w-44 flex-shrink-0 truncate">{item?.name}</div>
              <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${item?.fillRate}%`, background: item?.fill }}
                />
              </div>
              <div className="text-sm font-bold font-tabular w-10 text-right" style={{ color: item?.fill }}>
                {item?.fillRate}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}