'use client';
import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const DONUT_COLORS = ['#2563eb', '#7c3aed', '#059669', '#ea580c', '#db2777', '#0284c7'];

const FALLBACK_MONTHLY_DATA = [
  { month: 'Jan', registrations: 42 },
  { month: 'Feb', registrations: 78 },
  { month: 'Mar', registrations: 95 },
  { month: 'Apr', registrations: 61 },
  { month: 'May', registrations: 134 },
  { month: 'Jun', registrations: 112 },
  { month: 'Jul', registrations: 463 },
  { month: 'Aug', registrations: 390 },
];

const FALLBACK_CATEGORY_DATA = [
  { name: 'AI/ML Workshops', value: 244 },
  { name: 'Hackathons', value: 187 },
  { name: 'Coding Contests', value: 180 },
  { name: 'Web & Cloud', value: 117 },
  { name: 'Seminars', value: 145 },
];

const FALLBACK_REGISTRATIONS_PER_EVENT = [
  { event: 'AI & ML Workshop', count: 124 },
  { event: 'CSE Hackathon', count: 87 },
  { event: 'Web Dev Bootcamp', count: 72 },
  { event: 'Cloud Seminar', count: 45 },
  { event: 'Cyber Security', count: 38 },
];

export default function AdminOverviewCharts() {
  const [monthlyData, setMonthlyData] = useState<any[]>(FALLBACK_MONTHLY_DATA);
  const [categoryData, setCategoryData] = useState<any[]>(FALLBACK_CATEGORY_DATA);
  const [eventData, setEventData] = useState<any[]>(FALLBACK_REGISTRATIONS_PER_EVENT);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    async function loadChartData() {
      try {
        const [eventsRes, regRes] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/registrations'),
        ]);

        let events: any[] = [];
        let registrations: any[] = [];

        if (eventsRes.ok && eventsRes.headers.get('content-type')?.includes('application/json')) {
          const eventsJson = await eventsRes.json();
          if (eventsJson.success && Array.isArray(eventsJson.data)) {
            events = eventsJson.data;
          }
        }

        if (regRes.ok && regRes.headers.get('content-type')?.includes('application/json')) {
          const regJson = await regRes.json();
          if (regJson.success && Array.isArray(regJson.data)) {
            registrations = regJson.data;
          }
        }

        if (events.length > 0) {
          // Map registrations per event
          const countMap: Record<string, number> = {};
          registrations.forEach((r: any) => {
            if (r.eventId) countMap[r.eventId] = (countMap[r.eventId] || 0) + 1;
          });

          const perEvent = events.slice(0, 8).map((e: any) => ({
            event: e.title.length > 18 ? e.title.slice(0, 16) + '...' : e.title,
            count: countMap[e.id] || 0,
          }));
          setEventData(perEvent);

          // Map registrations by category
          const catMap: Record<string, number> = {};
          events.forEach((e: any) => {
            const cat = e.category || 'General';
            catMap[cat] = (catMap[cat] || 0) + (countMap[e.id] || 1);
          });

          const catList = Object.entries(catMap).map(([name, value]) => ({ name, value }));
          if (catList.length > 0) setCategoryData(catList);
        }
      } catch (err) {
        console.error('Error fetching dynamic chart data:', err);
      }
    }

    loadChartData();
  }, []);

  const totalCategoryRegistrations = categoryData.reduce((acc, item) => acc + (item.value || 0), 0);

  if (!isMounted) return null;

  return (
    <div className="space-y-4">
      {/* 2-Column Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left 65%: Monthly Registrations Trend */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="text-sm font-black text-slate-900 tracking-tight">
              Monthly Registrations Trend
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Registration activity overview across recent months
            </p>
          </div>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height={200} minHeight={160}>
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="blueAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 'bold',
                  }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Area
                  type="monotone"
                  dataKey="registrations"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fill="url(#blueAreaGrad)"
                  name="Registrations"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 35%: Registrations by Category */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="text-sm font-black text-slate-900 tracking-tight">
              Registrations by Category
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Distribution across event categories
            </p>
          </div>

          <div className="relative h-[170px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height={170} minHeight={150}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cat-donut-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 'bold',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Donut Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-extrabold text-slate-900 leading-none">
                {totalCategoryRegistrations}
              </span>
              <span className="text-[9px] font-mono text-slate-500 font-bold uppercase mt-0.5">
                Total Regs
              </span>
            </div>
          </div>

          {/* Custom Legend */}
          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100 text-xs font-semibold">
            {categoryData.slice(0, 4).map((item, idx) => (
              <div key={`legend-${idx}`} className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: DONUT_COLORS[idx % DONUT_COLORS.length] }}
                />
                <span className="text-slate-600 truncate text-[10px]">{item.name}</span>
                <span className="text-slate-900 font-bold text-[10px] ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar Chart: Registrations Per Event */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs">
        <div className="mb-2">
          <h3 className="text-sm font-black text-slate-900 tracking-tight">
            Registrations Per Event
          </h3>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            Compare registration volume across active events
          </p>
        </div>

        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height={180} minHeight={150}>
            <BarChart data={eventData} barSize={24} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="event"
                tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }}
                interval={0}
                angle={-15}
                textAnchor="end"
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 'bold',
                }}
              />
              <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} name="Registrations" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}