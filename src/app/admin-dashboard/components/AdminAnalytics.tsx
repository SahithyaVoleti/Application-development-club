'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const AdminAnalyticsCharts = dynamic(() => import('./AdminAnalyticsCharts'), { ssr: false });

export default function AdminAnalytics() {
  return (
    <div className="p-6 lg:p-8 max-w-screen-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Overall Analytics</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Comprehensive view of event performance and student participation</p>
      </div>
      <AdminAnalyticsCharts />
    </div>
  );
}