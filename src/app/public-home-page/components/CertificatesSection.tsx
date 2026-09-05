'use client';
import React, { useState } from 'react';
import { Award, Download, CheckCircle2, AlertTriangle, Sparkles, Shield, Search, Lock, XCircle, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_EVENTS, MOCK_REGISTRATIONS } from '@/lib/mockData';

const CERTIFICATE_TYPES = [
  { id: 'cert-1', title: 'Participation Certificate', desc: 'Issued for verified attendance & engagement in hackathons' },
  { id: 'cert-2', title: 'Winner Certificate', desc: 'Presented to top 3 podium teams in innovation challenges' },
  { id: 'cert-3', title: 'Hackathon Certificate', desc: 'Official credential for completing 24h/48h hackathon sprints' },
  { id: 'cert-4', title: 'Innovation Award', desc: 'Special recognition for outstanding project design & impact' },
  { id: 'cert-5', title: 'Project Completion Certificate', desc: 'Awarded upon successfully deploying a live campus app' },
];

export default function CertificatesSection() {
  const completedEvents = MOCK_EVENTS.filter(e => e.status === 'COMPLETED');
  const [selectedEventId, setSelectedEventId] = useState(completedEvents[0]?.id || 'event-007');
  const [studentSearchInput, setStudentSearchInput] = useState('V22CSE001');

  // Verified record state
  const [verificationResult, setVerificationResult] = useState<{
    status: 'idle' | 'verified' | 'absent' | 'not_found';
    registration?: (typeof MOCK_REGISTRATIONS)[0];
    message?: string;
  }>({
    status: 'verified',
    registration: MOCK_REGISTRATIONS.find(r => r.studentId === 'V22CSE001' && r.eventId === 'event-007'),
  });

  const selectedEvent = MOCK_EVENTS.find(e => e.id === selectedEventId) || completedEvents[0];
  const [selectedCert, setSelectedCert] = useState(CERTIFICATE_TYPES[0]);
  const [customStudentName, setCustomStudentName] = useState('');

  const handleVerifyStudent = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = studentSearchInput.trim().toUpperCase();

    if (!query) {
      toast.error('Please enter a Student ID or Email to verify eligibility.');
      return;
    }

    const foundReg = MOCK_REGISTRATIONS.find(
      r => (r.studentId.toUpperCase() === query || r.email.toUpperCase() === query) && r.eventId === selectedEventId
    );

    if (!foundReg) {
      setVerificationResult({
        status: 'not_found',
        message: `No registration record found for Student ID / Email "${studentSearchInput}" in ${selectedEvent?.title}. Certificates are only issued to registered participants.`,
      });
      toast.error('Certificate Generation Blocked', {
        description: 'Student is not registered for this event.',
      });
      return;
    }

    if (foundReg.attendanceStatus !== 'present') {
      setVerificationResult({
        status: 'absent',
        registration: foundReg,
        message: `Student ${foundReg.studentName} (${foundReg.studentId}) registered for ${selectedEvent?.title}, but attendance was marked as ABSENT. Certificates are strictly issued to students who participated.`,
      });
      toast.error('Attendance Not Verified', {
        description: 'Participant was marked absent for this event.',
      });
      return;
    }

    // Verified: Registered AND Present!
    setVerificationResult({
      status: 'verified',
      registration: foundReg,
    });
    setCustomStudentName(foundReg.studentName);

    toast.success('Certificate Verification Passed!', {
      description: `Verified participant: ${foundReg.studentName} (${foundReg.studentId})`,
    });
  };

  const activeReg = verificationResult.status === 'verified' ? verificationResult.registration : null;
  const displayName = customStudentName.trim() || activeReg?.studentName || '';

  const handleDownload = () => {
    if (!activeReg) {
      toast.error('Cannot download certificate without verified event participation.');
      return;
    }

    toast.success(`Downloading ${selectedCert.title} for ${displayName}`);

    const templateBgCss = selectedEvent?.certificateTemplateUrl
      ? `background-image: url('${selectedEvent.certificateTemplateUrl}'); background-size: cover; background-position: center;`
      : '';

    const certHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${selectedCert.title} - ${displayName}</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; text-align: center; padding: 40px; background: #f8fafc; }
          .cert-box { border: 12px double #0f172a; padding: 50px; background: #ffffff; max-width: 820px; margin: auto; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); relative; ${templateBgCss} }
          .header { color: #0284c7; font-weight: bold; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; }
          h1 { color: #0f172a; font-size: 30px; letter-spacing: 2px; text-transform: uppercase; margin-top: 15px; }
          p { color: #475569; font-size: 14px; margin: 12px 0; }
          .name { font-size: 32px; font-weight: 800; color: #1e1b4b; text-decoration: underline; margin: 20px 0; font-family: Georgia, serif; }
          .event-title { color: #0369a1; font-size: 22px; font-weight: bold; margin-top: 10px; }
          .meta { font-size: 13px; color: #334155; font-weight: 600; margin-top: 20px; }
          .footer { margin-top: 45px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 11px; color: #64748b; font-family: monospace; display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        <div class="cert-box">
          <div class="header">
            <img src="/images/vignan-logo.png" alt="Vignan Logo" style="height: 36px; margin: 0 auto 10px auto; display: block;" />
            APPLICATION DEVELOPMENT CLUB — VIGNAN UNIVERSITY
          </div>
          <h1>${selectedCert.title}</h1>
          <p>This is to certify that</p>
          <div class="name">${displayName}</div>
          <div class="meta">Student ID: <strong>${activeReg.studentId}</strong> | Department of <strong>${activeReg.department}</strong> (${activeReg.year})</div>
          <p style="margin-top:20px;">has registered and actively participated in the event</p>
          <div class="event-title">"${selectedEvent?.title}"</div>
          <p>conducted by Department of Computer Science & Engineering on ${selectedEvent?.date}.</p>
          
          <div class="footer">
            <div>
              <div>Verified Participation Status: 🟢 PRESENT</div>
              <div>Registration ID: ${activeReg.registrationId}</div>
            </div>
            <div style="text-align:right;">
              <div>Credential Code: ADH-VERIFIED-${activeReg.registrationId}</div>
              <div>Issued by Department of CSE</div>
            </div>
          </div>
        </div>
        <script>window.print();</script>
      </body>
      </html>
    `;

    const blob = new Blob([certHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certificate_${displayName.replace(/\s+/g, '_')}_${selectedEvent?.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="certificates" className="py-16 bg-white text-slate-900 border-b border-slate-200/80 overflow-hidden">
      <div className="w-full px-4 sm:px-8 lg:px-12 space-y-10">
        
        {/* Section Header — Minimalist Corporate University Style */}
        <div className="text-center max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 border border-blue-200 rounded-full px-4 py-1 text-xs font-mono font-extrabold uppercase tracking-widest">
            <Building2 size={14} className="text-blue-700" /> OFFICIAL UNIVERSITY CREDENTIALS
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900">
            Build. Participate. Get Recognized.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg lg:text-xl leading-relaxed font-normal">
            Official digital certificates are generated for students who registered and participated in departmental hackathons & coding events.
          </p>
        </div>

        {/* Verification & Generation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Verification Form & Event Selector */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Step 1: Select Event */}
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
              <label className="block text-xs font-mono font-extrabold text-slate-700 uppercase tracking-wider">
                1. Select Completed Event
              </label>
              <select
                value={selectedEventId}
                onChange={e => {
                  setSelectedEventId(e.target.value);
                  setVerificationResult({ status: 'idle' });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-blue-600 cursor-pointer shadow-xs"
              >
                {completedEvents.map(evt => (
                  <option key={evt.id} value={evt.id}>
                    {evt.title} ({evt.date})
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Student Verification Input */}
            <form onSubmit={handleVerifyStudent} className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
              <label className="block text-xs font-mono font-extrabold text-slate-700 uppercase tracking-wider">
                2. Enter Student ID or Email
              </label>
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={studentSearchInput}
                  onChange={e => setStudentSearchInput(e.target.value)}
                  placeholder="e.g. V22CSE001 or student@vignan.ac.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-blue-600 shadow-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 size={15} />
                <span>Verify Participation & Unlock Certificate</span>
              </button>
            </form>

            {/* Verification Status Alert Box */}
            {verificationResult.status === 'verified' && activeReg && (
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-emerald-900 text-xs font-semibold space-y-1 shadow-2xs">
                <div className="flex items-center gap-2 font-extrabold text-emerald-800 text-sm">
                  <CheckCircle2 size={18} className="text-emerald-600" /> Attendance Verified: Eligible For Certificate
                </div>
                <div>Name: <strong>{activeReg.studentName}</strong> ({activeReg.studentId})</div>
                <div>Branch: {activeReg.department} | Reg ID: {activeReg.registrationId}</div>
              </div>
            )}

            {verificationResult.status === 'absent' && (
              <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 text-rose-900 text-xs space-y-1 shadow-2xs">
                <div className="flex items-center gap-2 font-extrabold text-rose-800 text-sm">
                  <XCircle size={18} className="text-rose-600" /> Attendance Marked Absent
                </div>
                <p className="text-rose-800 font-medium">{verificationResult.message}</p>
              </div>
            )}

            {verificationResult.status === 'not_found' && (
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-amber-900 text-xs space-y-1 shadow-2xs">
                <div className="flex items-center gap-2 font-extrabold text-amber-800 text-sm">
                  <AlertTriangle size={18} className="text-amber-600" /> Registration Not Found
                </div>
                <p className="text-amber-800 font-medium">{verificationResult.message}</p>
              </div>
            )}

          </div>

          {/* Right Column: Dynamic Certificate Canvas — Minimalist Corporate University Style */}
          <div className="lg:col-span-7 space-y-4">
            {verificationResult.status === 'verified' && activeReg ? (
              <div className="space-y-4">
                {/* Editable Participant Name Bar */}
                <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                  <label className="text-xs font-bold text-blue-950 flex items-center gap-2">
                    <span>✏️ Edit Name on Certificate:</span>
                  </label>
                  <input
                    type="text"
                    value={customStudentName}
                    onChange={e => setCustomStudentName(e.target.value)}
                    placeholder="Enter participant name"
                    className="w-full sm:w-72 px-3 py-1.5 rounded-xl bg-white border border-blue-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                </div>

                <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-10 border-4 border-double border-slate-900 shadow-xl space-y-6 relative overflow-hidden">
                  {selectedEvent?.certificateTemplateUrl && (
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                      <img src={selectedEvent.certificateTemplateUrl} alt="Template Certificate Background" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="absolute top-4 right-4 opacity-10">
                    <Shield size={120} />
                  </div>

                  <div className="text-center space-y-2 relative z-10">
                    <img src="/images/vignan-logo.png" alt="Vignan University Logo" className="h-8 w-auto mx-auto object-contain mb-1" />
                    <div className="text-[11px] font-bold font-mono text-blue-700 tracking-widest uppercase">
                      APPLICATION DEVELOPMENT CLUB — VIGNAN UNIVERSITY
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold tracking-wider uppercase text-slate-900">
                      {selectedCert.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium italic">
                      This official credential certifies that
                    </p>
                  </div>

                  <div className="text-center py-4 border-y border-slate-200 relative z-10">
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif underline decoration-blue-600 decoration-2">
                      {displayName}
                    </div>
                    <div className="text-xs font-mono font-bold text-slate-600 mt-1">
                      Student ID: {activeReg.studentId} | Dept of {activeReg.department} ({activeReg.year})
                    </div>
                    <p className="text-xs text-slate-600 font-medium mt-3">
                      has registered and actively participated in the event
                    </p>
                    <div className="text-base font-extrabold text-blue-700 mt-1">
                      "{selectedEvent?.title}"
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 text-[11px] text-slate-600 font-mono relative z-10">
                    <div>
                      <div className="text-emerald-700 font-bold">● Status: VERIFIED PRESENT</div>
                      <div>Reg ID: {activeReg.registrationId}</div>
                    </div>

                    <button
                      onClick={handleDownload}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-md cursor-pointer"
                    >
                      <Download size={14} /> Download Verified Certificate
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Locked Placeholder when not verified */
              <div className="bg-slate-50/80 rounded-3xl p-12 border border-slate-200/90 text-center space-y-4 shadow-2xs">
                <div className="w-16 h-16 rounded-2xl bg-white text-slate-400 flex items-center justify-center mx-auto border border-slate-200 shadow-2xs">
                  <Lock size={32} />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">Certificate Generator Locked</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Enter a valid Student ID or Email of a registered participant who attended the event to unlock and generate their official certificate.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
