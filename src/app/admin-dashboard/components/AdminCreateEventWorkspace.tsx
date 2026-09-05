'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import type { Event, EventStatus } from '@/lib/mockData';
import CategoryBadge from '@/components/ui/CategoryBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  Save,
  PlusCircle,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  Tag,
  Shield,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';

const CATEGORIES = [
  'Hackathon',
  'Coding Competition',
  'Workshop',
  'Seminar',
  'Technical Talk',
  'Guest Lecture',
  'Project Expo',
  'Ideathon',
  'Quiz',
  'AI/ML Workshop',
  'Web Development Workshop',
  'Cloud Computing Workshop',
  'Cyber Security Event',
  'Career Development Event',
];

interface Props {
  eventToEdit?: Event;
  onCancel: () => void;
  onSave: (data: Partial<Event>) => void;
}

type FormData = {
  title: string;
  category: string;
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
  contactPhone?: string;
  posterUrl: string;
  certificateTemplateUrl?: string;
  status: EventStatus;
  allocatedBudget?: number;
  venueExpense?: number;
  foodExpense?: number;
  certificateExpense?: number;
  prizeExpense?: number;
  marketingExpense?: number;
  equipmentExpense?: number;
  otherExpense?: number;
};

export default function AdminCreateEventWorkspace({ eventToEdit, onCancel, onSave }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    defaultValues: eventToEdit
      ? {
          title: eventToEdit.title,
          category: eventToEdit.category,
          description: eventToEdit.description,
          date: eventToEdit.date,
          startTime: eventToEdit.startTime,
          endTime: eventToEdit.endTime,
          venue: eventToEdit.venue,
          organizer: eventToEdit.organizer,
          registrationDeadline: eventToEdit.registrationDeadline.replace('T', ' ').slice(0, 16),
          capacity: eventToEdit.capacity,
          eligibility: eventToEdit.eligibility,
          rules: eventToEdit.rules,
          requirements: eventToEdit.requirements,
          contactPerson: eventToEdit.contactPerson,
          contactEmail: eventToEdit.contactEmail,
          contactPhone: '+91 98765 43210',
          posterUrl: eventToEdit.posterUrl,
          certificateTemplateUrl: eventToEdit.certificateTemplateUrl || '',
          status: eventToEdit.status || 'UPCOMING',
        }
      : {
          category: 'AI/ML Workshop',
          status: 'UPCOMING',
          capacity: 150,
          date: '2026-09-15',
          startTime: '10:00',
          endTime: '16:00',
          registrationDeadline: '2026-09-12 23:59',
          organizer: 'Dept. of CSE',
          posterUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
        },
  });

  const watchAll = watch();
  const charCount = watchAll.description?.length || 0;

  // Form Submit Handler
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    onSave({
      ...data,
      registrationDeadline: data.registrationDeadline ? data.registrationDeadline.replace(' ', 'T') : new Date().toISOString(),
    });

    setIsSubmitting(false);
  };

  // Draft Handler
  const handleSaveDraft = async () => {
    setIsDrafting(true);
    await new Promise((r) => setTimeout(r, 400));
    toast.success('Draft saved successfully');
    setIsDrafting(false);
  };

  // Cancel Handler with Unsaved Guard
  const handleCancelClick = () => {
    if (isDirty) {
      setShowDiscardConfirm(true);
    } else {
      onCancel();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative">
      {/* Top Fixed Breadcrumb & Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancelClick}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Back to Event Management"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              {/* Section 26: Breadcrumb */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono mb-0.5">
                <button onClick={onCancel} className="hover:underline cursor-pointer">
                  Event Management
                </button>
                <span>/</span>
                <span className="text-blue-600 font-bold">
                  {eventToEdit ? 'Edit Event' : 'Create New Event'}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {eventToEdit ? 'Edit Event Details' : 'Create New Event'}
              </h1>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isDrafting}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <Save size={14} className="text-slate-500" />
              <span>{isDrafting ? 'Saving Draft...' : 'Save Draft'}</span>
            </button>

            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 btn-hover-premium cursor-pointer flex items-center gap-1.5"
            >
              <PlusCircle size={15} />
              <span>{isSubmitting ? 'Creating Event...' : eventToEdit ? 'Update Event' : 'Create Event'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Full-Screen Form Container (Section 4: Max-width 1280px) */}
      <main className="max-w-[1280px] mx-auto px-6 py-8 pb-36">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Columns: Form Sections */}
            <div className="lg:col-span-8 space-y-6">
              {/* Card 1: EVENT INFORMATION (Section 5) */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
                <div className="pb-3 border-b border-slate-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">
                      EVENT INFORMATION
                    </h2>
                    <p className="text-xs text-slate-500">
                      Basic details about your event, title, category, and description.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Event Title (Full Width) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Event Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      {...register('title', { required: 'Event name is required' })}
                      placeholder="e.g. AI & Machine Learning Workshop 2026"
                      className={`w-full h-11 px-4 rounded-xl bg-slate-50 border text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:ring-2 transition-all ${
                        errors.title ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
                      }`}
                    />
                    {errors.title && (
                      <p className="text-[11px] font-bold text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.title.message}
                      </p>
                    )}
                  </div>

                  {/* Category (50%) & Organizer (50%) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Event Type / Category <span className="text-rose-500">*</span>
                      </label>
                      <select
                        {...register('category', { required: 'Category is required' })}
                        className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={`opt-${cat}`} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Organizer <span className="text-rose-500">*</span>
                      </label>
                      <input
                        {...register('organizer', { required: 'Organizer is required' })}
                        placeholder="e.g. Dr. Ramesh Babu, Dept. of CSE"
                        className={`w-full h-11 px-4 rounded-xl bg-slate-50 border text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:ring-2 transition-all ${
                          errors.organizer ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
                        }`}
                      />
                      {errors.organizer && (
                        <p className="text-[11px] font-bold text-rose-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.organizer.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Description (Section 6: Min 140px & character counter) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Description <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[11px] font-mono font-bold text-slate-400">
                        {charCount} / 1000 characters
                      </span>
                    </div>

                    <textarea
                      {...register('description', {
                        required: 'Description is required',
                        minLength: { value: 30, message: 'Minimum 30 characters required' },
                        maxLength: { value: 1000, message: 'Maximum 1000 characters allowed' },
                      })}
                      rows={5}
                      placeholder="Provide a comprehensive overview of the event, learning objectives, agenda, and project outcomes..."
                      className={`w-full min-h-[140px] p-4 rounded-xl bg-slate-50 border text-xs font-normal text-slate-900 leading-relaxed focus:outline-none focus:bg-white focus:ring-2 transition-all resize-y ${
                        errors.description ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
                      }`}
                    />
                    {errors.description && (
                      <p className="text-[11px] font-bold text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.description.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 2: DATE & TIME (Section 7: 4-Column Grid) */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
                <div className="pb-3 border-b border-slate-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">
                      DATE & TIME
                    </h2>
                    <p className="text-xs text-slate-500">
                      Set event date, schedule timing, and student registration deadline.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Event Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      {...register('date', { required: 'Event date is required' })}
                      className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Start Time <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="time"
                      {...register('startTime', { required: 'Start time is required' })}
                      className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      End Time <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="time"
                      {...register('endTime', { required: 'End time is required' })}
                      className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Registration Deadline <span className="text-rose-500">*</span>
                    </label>
                    <input
                      {...register('registrationDeadline', { required: 'Deadline is required' })}
                      placeholder="2026-09-12 23:59"
                      className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: VENUE & CAPACITY (Section 8) */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
                <div className="pb-3 border-b border-slate-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">
                      VENUE & CAPACITY
                    </h2>
                    <p className="text-xs text-slate-500">
                      Location hall, max seat capacity, and poster URL thumbnail.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Venue (2/3 width) */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Venue / Location <span className="text-rose-500">*</span>
                      </label>
                      <input
                        {...register('venue', { required: 'Venue location is required' })}
                        placeholder="e.g. CSE Seminar Hall, Block A, 2nd Floor"
                        className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    {/* Capacity (1/3 width) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Max Capacity <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        min={1}
                        {...register('capacity', { required: 'Capacity is required', valueAsNumber: true })}
                        className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-extrabold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-tabular"
                      />
                    </div>
                  </div>

                  {/* Event Poster Upload & URL */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Upload Event Poster Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              if (ev.target?.result) {
                                setValue('posterUrl', ev.target.result as string, { shouldDirty: true });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="block w-full text-xs text-slate-500 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Event Poster URL
                      </label>
                      <input
                        {...register('posterUrl')}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  {/* Template Certificate Upload & URL */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Upload Certificate Template Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              if (ev.target?.result) {
                                setValue('certificateTemplateUrl', ev.target.result as string, { shouldDirty: true });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="block w-full text-xs text-slate-500 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Certificate Template URL
                      </label>
                      <input
                        {...register('certificateTemplateUrl')}
                        placeholder="https://... (or base64 uploaded image)"
                        className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: ELIGIBILITY & RULES (Section 9) */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
                <div className="pb-3 border-b border-slate-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <Shield size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">
                      ELIGIBILITY & RULES
                    </h2>
                    <p className="text-xs text-slate-500">
                      Prerequisites, student eligibility guidelines, and participation rules.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Eligibility Criteria
                    </label>
                    <input
                      {...register('eligibility')}
                      placeholder="e.g. Open to all CSE, IT and ECE 2nd to 4th year students."
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Rules & Regulations
                    </label>
                    <textarea
                      {...register('rules')}
                      rows={3}
                      placeholder="Participants must carry their college ID cards. Attendance mandatory for certificates..."
                      className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-normal text-slate-900 leading-relaxed focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Technical Requirements
                    </label>
                    <input
                      {...register('requirements')}
                      placeholder="e.g. Laptop with Python 3.10+, VS Code, GitHub account."
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Card 5: CONTACT INFORMATION (Section 10: 3 Columns) */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
                <div className="pb-3 border-b border-slate-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <User size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">
                      CONTACT INFORMATION
                    </h2>
                    <p className="text-xs text-slate-500">
                      Faculty coordinator or student head contact details for student inquiries.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Contact Person <span className="text-rose-500">*</span>
                    </label>
                    <input
                      {...register('contactPerson', { required: 'Contact person required' })}
                      placeholder="Dr. Ramesh Babu"
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Contact Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      {...register('contactEmail', { required: 'Contact email required' })}
                      placeholder="faculty@vignan.ac.in"
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Contact Phone
                    </label>
                    <input
                      {...register('contactPhone')}
                      placeholder="+91 98765 43210"
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Card 6: REGISTRATION SETTINGS (Section 11) */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
                <div className="pb-3 border-b border-slate-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                    <Layers size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">
                      REGISTRATION SETTINGS
                    </h2>
                    <p className="text-xs text-slate-500">
                      Configure initial registration status state.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Registration Status
                  </label>
                  <select
                    {...register('status')}
                    className="w-full sm:w-64 h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="UPCOMING">Registration Open (Upcoming)</option>
                    <option value="ONGOING">Ongoing Event</option>
                    <option value="REGISTRATION_CLOSED">Registration Closed</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              {/* Card 7: DOCUMENTATION & FINANCIAL DETAILS (Section 7) */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
                <div className="pb-3 border-b border-slate-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    7
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">
                      DOCUMENTATION & FINANCIAL DETAILS
                    </h2>
                    <p className="text-xs text-slate-500">
                      Set event budget allocation and expense breakdown for official university reporting.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Allocated Budget (₹)
                    </label>
                    <input
                      type="number"
                      {...register('allocatedBudget')}
                      placeholder="50000"
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Venue Expense (₹)
                    </label>
                    <input
                      type="number"
                      {...register('venueExpense')}
                      placeholder="12000"
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Food & Refreshments (₹)
                    </label>
                    <input
                      type="number"
                      {...register('foodExpense')}
                      placeholder="15000"
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Certificates & Badges (₹)
                    </label>
                    <input
                      type="number"
                      {...register('certificateExpense')}
                      placeholder="5000"
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Prizes & Cash Awards (₹)
                    </label>
                    <input
                      type="number"
                      {...register('prizeExpense')}
                      placeholder="6000"
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Marketing & Banners (₹)
                    </label>
                    <input
                      type="number"
                      {...register('marketingExpense')}
                      placeholder="2500"
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Equipment & AV (₹)
                    </label>
                    <input
                      type="number"
                      {...register('equipmentExpense')}
                      placeholder="2000"
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Other Expenses (₹)
                    </label>
                    <input
                      type="number"
                      {...register('otherExpense')}
                      placeholder="0"
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Columns: Live Event Summary / Preview Panel (Section 12) */}
            <aside className="lg:col-span-4 sticky top-24 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-md overflow-hidden">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-500" />
                    <span>LIVE EVENT PREVIEW</span>
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-mono font-bold">
                    Real-time
                  </span>
                </div>

                {/* Poster Preview */}
                <div className="relative w-full h-44 rounded-2xl bg-slate-900 overflow-hidden mb-5">
                  <Image
                    src={watchAll.posterUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'}
                    alt="Event Poster Preview"
                    fill
                    className="object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <CategoryBadge category={watchAll.category || 'Workshop'} />
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-mono text-sky-300 font-bold block">
                      {watchAll.organizer || 'Dept. of CSE'}
                    </span>
                    <h4 className="text-sm font-extrabold leading-tight truncate">
                      {watchAll.title || 'Untitled Event'}
                    </h4>
                  </div>
                </div>

                {/* Live Specification Metadata */}
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Calendar size={14} className="text-blue-600" /> Date
                    </span>
                    <span className="font-bold text-slate-900 font-mono">{watchAll.date || 'TBD'}</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Clock size={14} className="text-sky-500" /> Timing
                    </span>
                    <span className="font-bold text-slate-900 font-mono">
                      {watchAll.startTime || '10:00'} - {watchAll.endTime || '16:00'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <MapPin size={14} className="text-indigo-500" /> Venue
                    </span>
                    <span className="font-bold text-slate-900 truncate max-w-[140px]">
                      {watchAll.venue || 'CSE Hall'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <User size={14} className="text-emerald-500" /> Max Capacity
                    </span>
                    <span className="font-extrabold text-slate-900 font-tabular">
                      {watchAll.capacity || 150} Seats
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-500 font-medium">Registration Status</span>
                    <StatusBadge status={watchAll.status || 'UPCOMING'} size="sm" />
                  </div>
                </div>
              </div>

              {/* Helpful Tips Card */}
              <div className="p-5 rounded-3xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-2">
                <div className="font-extrabold flex items-center gap-1.5 text-blue-950">
                  <Info size={15} className="text-blue-600" /> Administrative Notice
                </div>
                <p className="text-blue-900/80 leading-relaxed">
                  Events created here immediately reflect across the student portal, public website ticker, and interactive registration forms.
                </p>
              </div>
            </aside>
          </div>
        </form>
      </main>

      {/* Section 13: Sticky Action Bar Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-3.5 px-6 sm:px-10 shadow-lg">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            {isDirty ? (
              <span className="inline-flex items-center gap-1.5 text-amber-600 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Unsaved changes
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold">
                <CheckCircle2 size={14} /> All changes saved
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCancelClick}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isDrafting}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {isDrafting ? 'Saving...' : 'Save Draft'}
            </button>

            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 btn-hover-premium cursor-pointer"
            >
              {isSubmitting ? 'Submitting...' : eventToEdit ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </div>
      </div>

      {/* Discard Unsaved Changes Confirmation Modal (Section 18) */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200 animate-scaleIn">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Discard Unsaved Changes?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                You have unsaved changes in this event form. Are you sure you want to leave without saving?
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDiscardConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDiscardConfirm(false);
                  onCancel();
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-extrabold text-xs hover:bg-rose-500 transition-colors cursor-pointer"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
