import React from 'react';
import type { EventStatus } from '@/lib/mockData';

interface StatusBadgeProps {
  status: EventStatus;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<EventStatus, { label: string; className: string; dot: string }> = {
  UPCOMING: { label: 'Upcoming', className: 'badge-upcoming', dot: 'bg-blue-500' },
  ONGOING: { label: 'Ongoing', className: 'badge-ongoing', dot: 'bg-green-500' },
  COMPLETED: { label: 'Completed', className: 'badge-completed', dot: 'bg-gray-400' },
  REGISTRATION_CLOSED: { label: 'Reg. Closed', className: 'badge-closed', dot: 'bg-red-500' },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 ${config.className} ${size === 'sm' ? 'text-[0.68rem] px-2 py-0.5' : ''}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} inline-block`} />
      {config.label}
    </span>
  );
}