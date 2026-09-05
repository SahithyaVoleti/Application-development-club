'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import type { Event } from '@/lib/mockData';

const RegistrationCharts = dynamic(() => import('./RegistrationCharts'), { ssr: false });

interface Props {
  eventId: string;
  event: Event;
}

export default function RegistrationAnalytics({ eventId, event }: Props) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-base font-bold text-foreground">Registration Analytics</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Data for: {event.title}</p>
      </div>
      <RegistrationCharts eventId={eventId} event={event} />
    </div>
  );
}