'use client';
import React from 'react';
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
  Legend,
} from 'recharts';

const MONTHLY_DATA = [
  { month: 'Jan', registrations: 42 },
  { month: 'Feb', registrations: 78 },
  { month: 'Mar', registrations: 95 },
  { month: 'Apr', registrations: 61 },
  { month: 'May', registrations: 134 },
  { month: 'Jun', registrations: 112 },
  { month: 'Jul', registrations: 463 },
  { month: 'Aug', registrations: 390 },
];

const CATEGORY_DATA = [
  { name: 'AI/ML Workshops', value: 244 },
  { name: 'Hackathons', value: 187 },
  { name: 'Coding Contests', value: 180 },
  { name: 'Web & Cloud', value: 117 },
  { name: 'Seminars', value: 145 },
];

const DONUT_COLORS = ['#2563eb', '#7c3aed', '#059669', '#ea580c', '#db2777'];

const REGISTRATIONS_PER_EVENT = [
  { event: 'AI & ML Workshop', count: 124 },
  { event: 'CSE Hackathon', count: 87 },
  { event: 'Web Dev Bootcamp', count: 72 },
  { event: 'Cloud Seminar', count: 45 },
  { event: 'Cyber Security', count: 38 },
  { event: 'LudusForge', count: 150 },
  { event: 'Code Storm', count: 180 },
  { event: 'QuBioDL 2K26', count: 210 },
];

export default function AdminOverviewCharts() {
  const totalCategoryRegistrations = CATEGORY_DATA.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="space-y-6">
      {/* 2-Column Analytics: Monthly Trend (65%) + Category Donut (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 65%: Monthly Registrations Trend Area Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Monthly Registrations Trend
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Registration activity over the last 8 months
            </p>
          </div>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="blueAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Area
                  type="monotone"
                  dataKey="registrations"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fill="url(#blueAreaGrad)"
                  name="Registrations"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 35%: Registrations by Category Donut Chart */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Registrations by Category
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Distribution across event formats
            </p>
          </div>

          <div className="relative h-[200px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {CATEGORY_DATA.map((entry, index) => (
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
              <span className="text-xl font-extrabold text-slate-900 leading-none">
                {totalCategoryRegistrations}
              </span>
              <span className="text-[10px] font-mono text-slate-600 font-bold uppercase mt-1">
                Total Regs
              </span>
            </div>
          </div>

          {/* Category Custom Legend */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs font-semibold">
            {CATEGORY_DATA.map((item, idx) => (
              <div key={`legend-${idx}`} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: DONUT_COLORS[idx % DONUT_COLORS.length] }}
                />
                <span className="text-slate-600 truncate text-[11px]">{item.name}</span>
                <span className="text-slate-900 font-bold text-[11px] ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Width Bar Chart: Registrations Per Event */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="mb-4">
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
            Registrations Per Event
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Compare registration volume across active events
          </p>
        </div>

        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REGISTRATIONS_PER_EVENT} barSize={28} margin={{ top: 10, right: 10, left: -15, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="event"
                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                interval={0}
                angle={-20}
                textAnchor="end"
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              />
              <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} name="Registrations" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}