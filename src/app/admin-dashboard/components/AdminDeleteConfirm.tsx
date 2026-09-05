'use client';
import React from 'react';
import type { Event } from '@/lib/mockData';
import { AlertTriangle } from 'lucide-react';

interface Props {
  event: Event;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function AdminDeleteConfirm({ event, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay" onClick={e => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-md p-6 animate-scaleIn">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={22} className="text-red-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Delete Event</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Are you sure you want to delete <strong>"{event.title}"</strong>? This will also remove all associated registrations and gallery images. This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-secondary flex-1 justify-center py-2.5">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 justify-center py-2.5 inline-flex items-center gap-2 bg-red-600 text-white font-semibold text-sm rounded-lg hover:bg-red-700 transition-colors active:scale-95"
          >
            Delete Event
          </button>
        </div>
      </div>
    </div>
  );
}