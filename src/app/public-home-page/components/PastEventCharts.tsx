'use client';
import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

interface Props {
  registered: number;
  attended: number;
  eventId: string;
}

const YEAR_DATA_MAP: Record<string, { year: string; count: number }[]> = {
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
  'event-009': [
    { year: '1st Year', count: 30 },
    { year: '2nd Year', count: 55 },
    { year: '3rd Year', count: 68 },
    { year: '4th Year', count: 45 },
  ],
  'event-010': [
    { year: '1st Year', count: 0 },
    { year: '2nd Year', count: 15 },
    { year: '3rd Year', count: 40 },
    { year: '4th Year', count: 30 },
  ],
  'event-011': [
    { year: '1st Year', count: 0 },
    { year: '2nd Year', count: 0 },
    { year: '3rd Year', count: 82 },
    { year: '4th Year', count: 165 },
  ],
};

const COLORS = ['#2563eb', '#e2e8f0'];

export default function PastEventCharts({ registered, attended, eventId }: Props) {
  const absent = registered - attended;
  const donutData = [
    { name: 'Attended', value: attended },
    { name: 'Absent', value: absent },
  ];
  const yearData = YEAR_DATA_MAP[eventId] || [];

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">Registered vs Attended</h4>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={donutData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
              {donutData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }}
            />
            <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {yearData.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Participants by Year</h4>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={yearData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }}
              />
              <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}