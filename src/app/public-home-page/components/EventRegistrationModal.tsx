'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import AppImage from '@/components/ui/AppImage';
import StatusBadge from '@/components/ui/StatusBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import type { Event } from '@/lib/mockData';
import { MOCK_REGISTRATIONS } from '@/lib/mockData';
import { sendRegistrationConfirmationEmail, type EmailDeliveryReceipt } from '@/lib/emailService';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  Copy,
  Mail,
  Send,
  Printer,
  QrCode,
  Sparkles,
  User,
  CreditCard,
  Building2,
  GraduationCap,
  Hash,
  UserCheck,
  Phone,
  Code2,
  Check,
  AlertCircle,
} from 'lucide-react';

interface RegistrationForm {
  fullName: string;
  studentId: string;
  department: string;
  year: string;
  section: string;
  email: string;
  mobile: string;
  gender: string;
  skills: string;
}

import { type UserProfile } from '@/lib/workspaceData';

interface Props {
  event: Event;
  currentCount: number;
  currentUser?: UserProfile | null;
  onClose: () => void;
  onSuccess: (eventId: string) => void;
}

function generateRegId() {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `CSE26-${num}`;
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

const DEPARTMENTS = [
  'CSE (Computer Science & Engineering)',
  'ECE (Electronics & Communication)',
  'IT (Information Technology)',
  'AI & ML (Artificial Intelligence & ML)',
  'Data Science',
  'EEE (Electrical & Electronics)',
  'Mechanical Engineering',
  'Civil Engineering',
  'MCA',
  'MBA',
];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export default function EventRegistrationModal({ event, currentCount, currentUser, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<'details' | 'form' | 'success' | 'duplicate'>('details');
  const [registrationId, setRegistrationId] = useState('');
  const [existingRegId, setExistingRegId] = useState('');
  const [alreadyRegistered, setAlreadyRegistered] = useState<any | null>(null);
  const [submittedData, setSubmittedData] = useState<RegistrationForm | null>(null);
  const [emailReceipt, setEmailReceipt] = useState<EmailDeliveryReceipt | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Check if student is already registered for this event
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = JSON.parse(localStorage.getItem('adhub_user_registrations') || '[]');
        const existing = saved.find((r: any) => r.eventId === event.id);
        if (existing) {
          setAlreadyRegistered(existing);
          setExistingRegId(existing.registrationId || existing.id);
        }
      } catch (e) {}
    }
  }, [event.id]);

  const activeProfile = currentUser || (() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('adhub_active_user');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return null;
  })();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegistrationForm>({
    defaultValues: {
      fullName: activeProfile?.name || '',
      studentId: activeProfile?.studentId || '',
      department: activeProfile?.department || 'CSE (Computer Science & Engineering)',
      year: activeProfile?.year || '3rd Year',
      section: activeProfile?.section || 'A',
      email: activeProfile?.email || '',
      mobile: activeProfile?.phone || '',
      gender: 'Male',
      skills: 'React, Node.js, Python',
    },
  });

  const skillsValue = watch('skills') || '';
  const skillsChips = skillsValue.split(',').map(s => s.trim()).filter(Boolean);

  const fillPct = Math.min(100, Math.round((currentCount / event.capacity) * 100));

  const onSubmit = async (data: RegistrationForm) => {
    setIsSubmitting(true);

    try {
      // Call backend database endpoint
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          studentId: data.studentId,
          studentName: data.fullName,
          email: data.email,
          mobile: data.mobile,
          department: data.department,
          year: data.year,
          section: data.section,
          gender: data.gender,
          skills: data.skills || '',
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        if (result.error?.includes('already registered') || res.status === 409) {
          const existing = MOCK_REGISTRATIONS.find(
            r => r.eventId === event.id && (r.studentId === data.studentId || r.email === data.email)
          );
          if (existing) setExistingRegId(existing.registrationId);
          else setExistingRegId('CSE26-EXISTING');
          setStep('duplicate');
          setIsSubmitting(false);
          return;
        }
        throw new Error(result.error || 'Failed to submit registration');
      }

      const newRegId = result.data.registrationId || generateRegId();
      setRegistrationId(newRegId);
      setSubmittedData(data);

      // Send automated email confirmation with Registration ID & Event details
      const receipt = await sendRegistrationConfirmationEmail(newRegId, data, event);
      setEmailReceipt(receipt);

      // Persist to localStorage for student dashboard
      if (typeof window !== 'undefined') {
        try {
          const existingSaved = JSON.parse(localStorage.getItem('adhub_user_registrations') || '[]');
          const regRecord = {
            id: result.data?.id || `reg-${Date.now()}`,
            eventId: event.id,
            eventTitle: event.title,
            eventDate: event.date,
            eventTime: `${event.startTime} - ${event.endTime}`,
            eventVenue: event.venue,
            eventPoster: event.posterUrl,
            eventCategory: event.category,
            studentName: data.fullName,
            studentId: data.studentId,
            email: data.email,
            registrationId: newRegId,
            registrationDate: new Date().toISOString(),
            attendanceStatus: 'not_marked',
          };
          const updatedSaved = [regRecord, ...existingSaved.filter((r: any) => r.registrationId !== newRegId && r.eventId !== event.id)];
          localStorage.setItem('adhub_user_registrations', JSON.stringify(updatedSaved));
        } catch (e) {
          console.error('Failed to save registration to localStorage:', e);
        }
      }

      setStep('success');
      onSuccess(event.id);
      setIsSubmitting(false);

      toast.success(`Successfully registered for ${event.title}!`, {
        description: `Confirmation email dispatched to ${data.email} | Reg ID: ${newRegId}`,
      });
    } catch (error: any) {
      console.error('Registration submission error:', error);
      if (error.message?.includes('already registered')) {
        setStep('duplicate');
      } else {
        toast.error('Registration Submission Failed', {
          description: error.message || 'Please check your connection and try again.',
        });
      }
      setIsSubmitting(false);
    }
  };

  const handleResendEmail = async () => {
    if (!submittedData || !registrationId) return;
    setIsResending(true);
    const receipt = await sendRegistrationConfirmationEmail(registrationId, submittedData, event);
    setEmailReceipt(receipt);
    setIsResending(false);
    toast.success('Email Confirmation Resent!', {
      description: `Confirmation mail successfully delivered to ${submittedData.email}`,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-slate-900/60 transition-all duration-300 animate-fadeIn"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl shadow-slate-900/20 w-full max-w-[720px] max-h-[88vh] flex flex-col overflow-hidden animate-scaleIn transition-all duration-300">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-slate-100 bg-white sticky top-0 z-20 flex-shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {event.title}
            </h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap text-xs">
              <CategoryBadge category={event.category} />
              <span className="text-slate-300">•</span>
              <StatusBadge status={event.status} size="sm" />
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors ml-4 flex-shrink-0 cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto">

          {/* STEP 1: EVENT DETAILS */}
          {step === 'details' && (
            <div className="p-6 sm:p-8">
              {/* Event Poster Banner */}
              <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden mb-6 border border-slate-200 shadow-sm group">
                <AppImage
                  src={event.posterUrl}
                  alt={`Event poster for ${event.title} at ${event.venue}`}
                  fill
                  sizes="720px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-sky-400">{event.organizer}</div>
                  <div className="text-lg sm:text-xl font-extrabold text-white leading-snug">{event.title}</div>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">{event.description}</p>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {[
                  { icon: Calendar, label: 'Date', value: formatDate(event.date) },
                  { icon: Clock, label: 'Time', value: `${event.startTime} – ${event.endTime}` },
                  { icon: MapPin, label: 'Venue', value: event.venue },
                  { icon: Users, label: 'Organizer', value: event.organizer },
                ].map((item, idx) => (
                  <div key={`detail-${idx}`} className="flex items-start gap-3 bg-sky-50/70 p-3.5 rounded-xl border border-sky-100/80">
                    <item.icon size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-400 font-mono font-bold uppercase">{item.label}</div>
                      <div className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Prize Pool & Rewards */}
              <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 border border-amber-300/70 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-amber-600" />
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-900">Prize Pool & Rewards</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-semibold">
                  <div className="bg-white/80 rounded-lg p-2 border border-amber-200/80 text-amber-900">
                    🥇 1st Prize: <span className="font-extrabold text-amber-700">₹5,300 / ₹4,000</span>
                  </div>
                  <div className="bg-white/80 rounded-lg p-2 border border-amber-200/80 text-amber-900">
                    🥈 2nd Prize: <span className="font-extrabold text-amber-700">₹3,300 / ₹2,000</span>
                  </div>
                  <div className="bg-white/80 rounded-lg p-2 border border-amber-200/80 text-amber-900">
                    🥉 3rd Prize: <span className="font-extrabold text-amber-700">₹2,000 / ₹1,000</span>
                  </div>
                </div>
                <div className="text-[11px] text-amber-800 font-medium mt-2">
                  ✨ Consolation prizes & official participation certificates awarded to all teams.
                </div>
              </div>

              {/* Faculty & Student Coordinators */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-6">
                <div className="text-xs font-bold text-slate-800 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <Users size={14} className="text-blue-600" /> Event Coordinators & Faculty
                </div>
                <div className="text-xs text-slate-600 space-y-1 font-medium">
                  <div>👨‍🏫 <strong>Faculty Coordinators:</strong> {event.contactPerson || 'Dr. T. H. Rajesh, Mr. P. Vijayababu'}</div>
                  <div>📩 <strong>Contact Email:</strong> {event.contactEmail || 'cse.events@vignan.ac.in'}</div>
                </div>
              </div>

              {/* Document Downloads */}
              <div className="mb-6 pt-3 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-700 mb-2">Official Event Downloads & Reports</div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: '📰 Press Release', msg: 'Press release downloaded' },
                    { label: '📄 View Event Report', msg: 'Event report document opened' },
                    { label: '📜 Sample Certificate', msg: 'Sample certificate template viewed' },
                  ].map((doc, idx) => (
                    <button
                      key={`doc-${idx}`}
                      type="button"
                      onClick={() => toast.info(doc.msg)}
                      className="text-xs font-semibold bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-blue-700 px-3 py-1.5 rounded-lg transition-colors border border-slate-200/80 cursor-pointer"
                    >
                      {doc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Capacity Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-500">{currentCount} / {event.capacity} registered</span>
                  <span className={fillPct >= 90 ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>{fillPct}% full</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${fillPct >= 90 ? 'bg-rose-500' : fillPct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${fillPct}%` }}
                  />
                </div>
              </div>

              {/* Proceed or Already Registered Button */}
              {alreadyRegistered ? (
                <div className="space-y-3">
                  <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-emerald-900 text-xs font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={18} className="text-emerald-600 flex-shrink-0" />
                      <div>
                        <div className="font-extrabold text-emerald-950 text-sm">You are already registered for this event ✓</div>
                        <div className="text-[11px] text-emerald-800">Pass ID: <strong>{alreadyRegistered.registrationId || existingRegId}</strong></div>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedData({
                        fullName: alreadyRegistered.studentName,
                        studentId: alreadyRegistered.studentId,
                        email: alreadyRegistered.email,
                        mobile: alreadyRegistered.mobile || '',
                        department: alreadyRegistered.department,
                        year: alreadyRegistered.year,
                        section: alreadyRegistered.section,
                        gender: alreadyRegistered.gender || 'Unspecified',
                        skills: alreadyRegistered.skills || '',
                      });
                      setRegistrationId(alreadyRegistered.registrationId || existingRegId);
                      setStep('success');
                    }}
                    className="w-full h-12 rounded-xl font-extrabold text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>View Registration Pass ✓</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  disabled={currentCount >= event.capacity || event.status === 'COMPLETED' || event.status === 'REGISTRATION_CLOSED'}
                  className="w-full h-12 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>
                    {currentCount >= event.capacity ? 'Registration Full' :
                     event.status === 'REGISTRATION_CLOSED' ? 'Registration Closed' :
                     event.status === 'COMPLETED' ? 'Event Completed' :
                     'Proceed to Register'}
                  </span>
                  <Check size={16} className="stroke-[3]" />
                </button>
              )}
            </div>
          )}

          {/* STEP 2: REGISTRATION FORM */}
          {step === 'form' && (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
              <div className="p-6 sm:p-8">
                
                {/* Compact Event Info Card */}
                <div className="bg-sky-50/80 border border-sky-200/80 rounded-2xl p-4 mb-6 shadow-2xs">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="stroke-[3]" />
                    </div>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Registering for</span>
                    <span className="text-sm font-extrabold text-slate-900 truncate">{event.title}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-600 font-medium pt-2 border-t border-sky-200/60">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <Calendar size={13} className="text-blue-600" />
                      {formatDate(event.date)}
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <Clock size={13} className="text-blue-600" />
                      {event.startTime} – {event.endTime}
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <MapPin size={13} className="text-blue-600" />
                      {event.venue}
                    </span>
                  </div>
                </div>

                {/* Form Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-mono font-extrabold uppercase border border-blue-200/80">
                      STEP 1 OF 1
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">• Participant Details</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Participant Details</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Please enter your details to complete your event registration.
                  </p>
                </div>

                {/* Clean 2-Column Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  
                  {/* ROW 1: Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative group">
                      <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none" />
                      <input
                        {...register('fullName', { required: 'Full name is required', minLength: { value: 3, message: 'Minimum 3 characters' } })}
                        className={`w-full h-11 sm:h-12 pl-10 pr-4 text-sm font-medium bg-white rounded-xl border transition-all ${errors.fullName ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'} focus:outline-none`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-xs text-rose-500 font-medium flex items-center gap-1 mt-1">
                        <AlertCircle size={12} /> {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  {/* ROW 1: Student ID */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Student ID <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative group">
                      <CreditCard size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none" />
                      <input
                        {...register('studentId', { required: 'Student ID is required' })}
                        className={`w-full h-11 sm:h-12 pl-10 pr-4 text-sm font-medium bg-white rounded-xl border transition-all ${errors.studentId ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'} focus:outline-none`}
                      />
                    </div>
                    {errors.studentId && (
                      <p className="text-xs text-rose-500 font-medium flex items-center gap-1 mt-1">
                        <AlertCircle size={12} /> {errors.studentId.message}
                      </p>
                    )}
                  </div>

                  {/* ROW 2: Department / Branch */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Department / Branch <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative group">
                      <Building2 size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none z-10" />
                      <select
                        {...register('department', { required: 'Department is required' })}
                        className={`w-full h-11 sm:h-12 pl-10 pr-4 text-sm font-medium bg-white rounded-xl border appearance-none transition-all ${errors.department ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'} focus:outline-none cursor-pointer`}
                      >
                        <option value="">Select Branch</option>
                        {DEPARTMENTS.map(d => <option key={`dept-${d}`} value={d}>{d}</option>)}
                      </select>
                    </div>
                    {errors.department && (
                      <p className="text-xs text-rose-500 font-medium flex items-center gap-1 mt-1">
                        <AlertCircle size={12} /> {errors.department.message}
                      </p>
                    )}
                  </div>

                  {/* ROW 2: Year */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Year <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative group">
                      <GraduationCap size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none z-10" />
                      <select
                        {...register('year', { required: 'Year is required' })}
                        className={`w-full h-11 sm:h-12 pl-10 pr-4 text-sm font-medium bg-white rounded-xl border appearance-none transition-all ${errors.year ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'} focus:outline-none cursor-pointer`}
                      >
                        <option value="">Select Year</option>
                        {YEARS.map(y => <option key={`year-${y}`} value={y}>{y}</option>)}
                      </select>
                    </div>
                    {errors.year && (
                      <p className="text-xs text-rose-500 font-medium flex items-center gap-1 mt-1">
                        <AlertCircle size={12} /> {errors.year.message}
                      </p>
                    )}
                  </div>

                  {/* ROW 3: Section */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Section <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative group">
                      <Hash size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none" />
                      <input
                        {...register('section', { required: 'Section is required' })}
                        className={`w-full h-11 sm:h-12 pl-10 pr-4 text-sm font-medium bg-white rounded-xl border transition-all ${errors.section ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'} focus:outline-none`}
                      />
                    </div>
                    {errors.section && (
                      <p className="text-xs text-rose-500 font-medium flex items-center gap-1 mt-1">
                        <AlertCircle size={12} /> {errors.section.message}
                      </p>
                    )}
                  </div>

                  {/* ROW 3: Gender */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Gender <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative group">
                      <UserCheck size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none z-10" />
                      <select
                        {...register('gender', { required: 'Gender is required' })}
                        className={`w-full h-11 sm:h-12 pl-10 pr-4 text-sm font-medium bg-white rounded-xl border appearance-none transition-all ${errors.gender ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'} focus:outline-none cursor-pointer`}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    {errors.gender && (
                      <p className="text-xs text-rose-500 font-medium flex items-center gap-1 mt-1">
                        <AlertCircle size={12} /> {errors.gender.message}
                      </p>
                    )}
                  </div>

                  {/* ROW 4: Email Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative group">
                      <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none" />
                      <input
                        type="email"
                        {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Valid email required' } })}
                        className={`w-full h-11 sm:h-12 pl-10 pr-4 text-sm font-medium bg-white rounded-xl border transition-all ${errors.email ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'} focus:outline-none`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-rose-500 font-medium flex items-center gap-1 mt-1">
                        <AlertCircle size={12} /> {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* ROW 4: Mobile Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative group">
                      <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none" />
                      <input
                        {...register('mobile', { required: 'Mobile is required' })}
                        className={`w-full h-11 sm:h-12 pl-10 pr-4 text-sm font-medium bg-white rounded-xl border transition-all ${errors.mobile ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'} focus:outline-none`}
                      />
                    </div>
                    {errors.mobile && (
                      <p className="text-xs text-rose-500 font-medium flex items-center gap-1 mt-1">
                        <AlertCircle size={12} /> {errors.mobile.message}
                      </p>
                    )}
                  </div>

                  {/* Relevant Technical Skills */}
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-800">
                        Relevant Technical Skills
                      </label>
                      <span className="text-[11px] text-slate-400 font-medium">Add skills separated by commas</span>
                    </div>
                    <div className="relative group">
                      <Code2 size={18} className="absolute left-3.5 top-3 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none" />
                      <input
                        {...register('skills')}
                        className="w-full h-11 sm:h-12 pl-10 pr-4 text-sm font-medium bg-white rounded-xl border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
                      />
                    </div>
                    {/* Interactive Skills Chips */}
                    {skillsChips.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {skillsChips.map((skill, idx) => (
                          <span key={`chip-${idx}`} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200/80 px-2.5 py-1 rounded-lg text-xs font-semibold">
                            <Sparkles size={11} className="text-blue-500" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="border-t border-slate-100 p-6 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 z-10 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-sm font-bold transition-all shadow-xs cursor-pointer"
                >
                  Back
                </button>
                <div className="flex flex-col items-center sm:items-end w-full sm:w-auto">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto h-12 px-6 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Confirming Registration…</span>
                      </>
                    ) : (
                      <>
                        <Check size={16} className="stroke-[3]" />
                        <span>Confirm Registration</span>
                      </>
                    )}
                  </button>
                  <span className="text-[11px] text-slate-400 mt-1.5 text-center sm:text-right font-medium">
                    Confirmation email will be sent after registration.
                  </span>
                </div>
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESS & EMAIL TICKET PASS */}
          {step === 'success' && submittedData && (
            <div className="p-6 sm:p-8 text-center">
              {/* Email Dispatch Alert Banner */}
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 mb-6 text-left flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <Mail size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-emerald-950 text-sm">Confirmation Email Sent!</h4>
                    <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full uppercase">
                      Delivered
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 mt-0.5 font-medium">
                    Registration receipt & official entry ticket sent to <strong>{submittedData.email}</strong>.
                  </p>
                </div>
              </div>

              {/* Official Digital Ticket / Email Pass Card */}
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-6 shadow-xl border border-slate-800 text-left relative overflow-hidden mb-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

                {/* Ticket Top Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div>
                    <div className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">
                      Vignan University · CSE Department
                    </div>
                    <h3 className="text-lg font-extrabold text-white mt-0.5 leading-tight">
                      {event.title}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-cyan-300">
                    <QrCode size={22} />
                  </div>
                </div>

                {/* Registration ID Row */}
                <div className="flex items-center justify-between bg-white/10 rounded-xl p-3 mb-4 border border-white/15">
                  <div>
                    <div className="text-[10px] text-slate-300 font-semibold uppercase">Registration ID</div>
                    <div className="text-xl font-extrabold text-cyan-300 font-mono tracking-wider">{registrationId}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(registrationId);
                      toast.success('Registration ID copied to clipboard!');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/15 hover:bg-white/25 text-white px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    <Copy size={12} /> Copy ID
                  </button>
                </div>

                {/* Student & Event Info Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                  <div className="bg-slate-900/60 rounded-lg p-2.5 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Student Name</div>
                    <div className="font-bold text-white truncate">{submittedData.fullName}</div>
                  </div>
                  <div className="bg-slate-900/60 rounded-lg p-2.5 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Student ID</div>
                    <div className="font-bold text-sky-300 font-mono">{submittedData.studentId}</div>
                  </div>
                  <div className="bg-slate-900/60 rounded-lg p-2.5 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Branch & Year</div>
                    <div className="font-bold text-white truncate">{submittedData.department} ({submittedData.year})</div>
                  </div>
                  <div className="bg-slate-900/60 rounded-lg p-2.5 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Date & Venue</div>
                    <div className="font-bold text-emerald-400 truncate">{formatDate(event.date)} · {event.venue}</div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between text-[11px] pt-3 border-t border-slate-800">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <Sparkles size={13} /> ● SEAT CONFIRMED & VERIFIED
                  </span>
                  <span className="text-slate-400">Bring ID card to event</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={isResending}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 rounded-xl transition-all border border-slate-200 cursor-pointer"
                >
                  <Send size={13} className="text-blue-600" />
                  {isResending ? 'Resending Mail…' : 'Resend Email'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    window.print();
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 rounded-xl transition-all border border-slate-200 cursor-pointer"
                >
                  <Printer size={13} className="text-indigo-600" />
                  Print Ticket Pass
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs py-3 rounded-xl shadow-md mt-1 cursor-pointer"
                >
                  Done & Return to Website
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: DUPLICATE CHECK */}
          {step === 'duplicate' && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Already Registered!</h3>
              <p className="text-slate-500 text-sm mb-6">
                You have already registered for <strong>{event.title}</strong> with this Student ID or email.
              </p>
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 mb-6">
                <div className="text-xs font-bold text-amber-800 mb-1">Your Existing Registration ID</div>
                <div className="text-xl font-extrabold text-amber-900 font-mono tracking-wider">{existingRegId}</div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full h-12 rounded-xl font-extrabold text-sm text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}