'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Event } from '@/lib/mockData';
import { X } from 'lucide-react';

const CATEGORIES = [
  'Hackathon', 'Coding Competition', 'Workshop', 'Seminar', 'Technical Talk',
  'Guest Lecture', 'Project Expo', 'Ideathon', 'Quiz', 'AI/ML Workshop',
  'Web Development Workshop', 'Cloud Computing Workshop', 'Cyber Security Event',
  'Career Development Event',
];

interface Props {
  event?: Event;
  onClose: () => void;
  onSave: (data: Partial<Event>) => void;
}

type FormData = {
  title: string;
  category: string;
  status: Event['status'];
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  organizer: string;
  registrationDeadline: string;
  capacity: number;
  eligibility: string;
  rules: string;
  requirements: string;
  contactPerson: string;
  contactEmail: string;
  posterUrl: string;
  certificateTemplateUrl: string;
};

export default function AdminEventFormModal({ event, onClose, onSave }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: event
      ? {
          title: event.title,
          category: event.category,
          status: event.status || 'UPCOMING',
          description: event.description,
          date: event.date,
          startTime: event.startTime,
          endTime: event.endTime,
          venue: event.venue,
          organizer: event.organizer,
          registrationDeadline: event.registrationDeadline.replace('T', ' ').slice(0, 16),
          capacity: event.capacity,
          eligibility: event.eligibility,
          rules: event.rules,
          requirements: event.requirements,
          contactPerson: event.contactPerson,
          contactEmail: event.contactEmail,
          posterUrl: event.posterUrl,
          certificateTemplateUrl: event.certificateTemplateUrl || '',
        }
      : {
          status: 'UPCOMING',
        },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    // BACKEND: POST /api/events (create) or PUT /api/events/:id (update)
    await new Promise(r => setTimeout(r, 700));
    onSave({
      ...data,
      registrationDeadline: data.registrationDeadline.replace(' ', 'T'),
    });
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scaleIn">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-foreground">
            {event ? 'Edit Event' : 'Add New Event'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Basic Info */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label-text">Event Title *</label>
                <input
                  {...register('title', { required: 'Event title is required' })}
                  className={`input-field ${errors.title ? 'error' : ''}`}
                  placeholder="e.g. AI & Machine Learning Workshop"
                />
                {errors.title && <p className="error-text">{errors.title.message}</p>}
              </div>
              <div>
                <label className="label-text">Category *</label>
                <select {...register('category', { required: 'Category is required' })} className={`input-field ${errors.category ? 'error' : ''}`}>
                  <option value="">Select Category</option>
                  {CATEGORIES.map(c => <option key={`cat-opt-${c}`} value={c}>{c}</option>)}
                </select>
                {errors.category && <p className="error-text">{errors.category.message}</p>}
              </div>
              <div>
                <label className="label-text">Organizer *</label>
                <input
                  {...register('organizer', { required: 'Organizer is required' })}
                  className={`input-field ${errors.organizer ? 'error' : ''}`}
                  placeholder="e.g. Dr. Ramesh Babu, Dept. of CSE"
                />
                {errors.organizer && <p className="error-text">{errors.organizer.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="label-text">Description *</label>
                <textarea
                  {...register('description', { required: 'Description is required', minLength: { value: 50, message: 'Minimum 50 characters' } })}
                  rows={3}
                  className={`input-field resize-none ${errors.description ? 'error' : ''}`}
                  placeholder="Detailed description of the event, what students will learn, activities planned…"
                />
                {errors.description && <p className="error-text">{errors.description.message}</p>}
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border">Date & Time</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label-text">Event Date *</label>
                <input
                  type="date"
                  {...register('date', { required: 'Date is required' })}
                  className={`input-field ${errors.date ? 'error' : ''}`}
                />
                {errors.date && <p className="error-text">{errors.date.message}</p>}
              </div>
              <div>
                <label className="label-text">Start Time *</label>
                <input
                  type="time"
                  {...register('startTime', { required: 'Start time is required' })}
                  className={`input-field ${errors.startTime ? 'error' : ''}`}
                />
                {errors.startTime && <p className="error-text">{errors.startTime.message}</p>}
              </div>
              <div>
                <label className="label-text">End Time *</label>
                <input
                  type="time"
                  {...register('endTime', { required: 'End time is required' })}
                  className={`input-field ${errors.endTime ? 'error' : ''}`}
                />
                {errors.endTime && <p className="error-text">{errors.endTime.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="label-text">Registration Deadline *</label>
                <p className="text-xs text-muted-foreground mb-1">Format: YYYY-MM-DD HH:MM</p>
                <input
                  {...register('registrationDeadline', { required: 'Deadline is required' })}
                  className={`input-field ${errors.registrationDeadline ? 'error' : ''}`}
                  placeholder="2026-09-07 23:59"
                />
                {errors.registrationDeadline && <p className="error-text">{errors.registrationDeadline.message}</p>}
              </div>
            </div>
          </div>

          {/* Venue & Capacity */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border">Venue & Capacity</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label-text">Venue *</label>
                <input
                  {...register('venue', { required: 'Venue is required' })}
                  className={`input-field ${errors.venue ? 'error' : ''}`}
                  placeholder="e.g. CSE Seminar Hall, Block A"
                />
                {errors.venue && <p className="error-text">{errors.venue.message}</p>}
              </div>
              <div>
                <label className="label-text">Capacity *</label>
                <p className="text-xs text-muted-foreground mb-1">Maximum number of registrations allowed</p>
                <input
                  type="number"
                  min={1}
                  {...register('capacity', { required: 'Capacity is required', min: { value: 1, message: 'Minimum 1' }, valueAsNumber: true })}
                  className={`input-field ${errors.capacity ? 'error' : ''}`}
                  placeholder="200"
                />
                {errors.capacity && <p className="error-text">{errors.capacity.message}</p>}
              </div>
              <div>
                <label className="label-text">Event Status *</label>
                <select {...register('status', { required: 'Status is required' })} className="input-field">
                  <option value="UPCOMING">Upcoming Event (Registration Open)</option>
                  <option value="ONGOING">Ongoing Event</option>
                  <option value="COMPLETED">Completed Event</option>
                  <option value="REGISTRATION_CLOSED">Registration Closed</option>
                </select>
              </div>

              <div>
                <label className="label-text">Event Poster (Upload or URL)</label>
                <p className="text-xs text-muted-foreground mb-1">Upload image file or paste URL</p>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          if (ev.target?.result) {
                            setValue('posterUrl', ev.target.result as string);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                  <input
                    {...register('posterUrl')}
                    className="input-field"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="label-text">Template Certificate (Upload Image or URL)</label>
                <p className="text-xs text-muted-foreground mb-1">Add a custom certificate template for this event (used when students view/download certificate)</p>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          if (ev.target?.result) {
                            setValue('certificateTemplateUrl', ev.target.result as string);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                  <input
                    {...register('certificateTemplateUrl')}
                    className="input-field font-mono text-xs"
                    placeholder="https://... (or base64 uploaded image)"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Eligibility & Rules */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border">Eligibility & Rules</h3>
            <div className="space-y-4">
              <div>
                <label className="label-text">Eligibility Criteria</label>
                <input
                  {...register('eligibility')}
                  className="input-field"
                  placeholder="e.g. All CSE, IT, ECE students from 2nd to 4th year"
                />
              </div>
              <div>
                <label className="label-text">Rules</label>
                <textarea
                  {...register('rules')}
                  rows={2}
                  className="input-field resize-none"
                  placeholder="Event rules and regulations…"
                />
              </div>
              <div>
                <label className="label-text">Requirements</label>
                <input
                  {...register('requirements')}
                  className="input-field"
                  placeholder="e.g. Laptop with Python 3.9+, College ID"
                />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-text">Contact Person *</label>
                <input
                  {...register('contactPerson', { required: 'Contact person is required' })}
                  className={`input-field ${errors.contactPerson ? 'error' : ''}`}
                  placeholder="Dr. Ramesh Babu"
                />
                {errors.contactPerson && <p className="error-text">{errors.contactPerson.message}</p>}
              </div>
              <div>
                <label className="label-text">Contact Email *</label>
                <input
                  type="email"
                  {...register('contactEmail', {
                    required: 'Contact email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Valid email required' }
                  })}
                  className={`input-field ${errors.contactEmail ? 'error' : ''}`}
                  placeholder="faculty@vignan.ac.in"
                />
                {errors.contactEmail && <p className="error-text">{errors.contactEmail.message}</p>}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-border">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center py-2.5">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 justify-center py-2.5">
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving…
                </span>
              ) : event ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}