'use client';
import React, { useState } from 'react';
import { Event, Registration, REGISTERED_COUNTS, ATTENDED_COUNTS, MOCK_REGISTRATIONS } from '@/lib/mockData';
import AppLogo from '@/components/ui/AppLogo';
import { X, Printer, Download, Award, FileText, Newspaper, DollarSign, CheckCircle2, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

export type DocumentType = 'press_release' | 'event_report' | 'certificate' | 'budget_report';

interface Props {
  event: Event;
  docType: DocumentType;
  onClose: () => void;
}

export default function EventDocumentModal({ event, docType, onClose }: Props) {
  // Find registered students for certificate selection
  const eventRegistrations = MOCK_REGISTRATIONS.filter((r) => r.eventId === event.id);
  const [selectedStudent, setSelectedStudent] = useState<Registration | null>(
    eventRegistrations[0] || null
  );

  const registered = REGISTERED_COUNTS[event.id] || 210;
  const attended = ATTENDED_COUNTS[event.id] || 195;
  const attendanceRate = registered > 0 ? Math.round((attended / registered) * 100) : 93;

  // Financial Calculations (Section 6)
  const allocatedBudget = event.allocatedBudget || 50000;
  const venueExpense = event.venueExpense || 12000;
  const foodExpense = event.foodExpense || 15000;
  const certificateExpense = event.certificateExpense || 5000;
  const prizeExpense = event.prizeExpense || 6000;
  const marketingExpense = event.marketingExpense || 2500;
  const equipmentExpense = event.equipmentExpense || 2000;
  const otherExpense = event.otherExpense || 0;

  const totalExpenses =
    venueExpense +
    foodExpense +
    certificateExpense +
    prizeExpense +
    marketingExpense +
    equipmentExpense +
    otherExpense;

  const remainingBudget = allocatedBudget - totalExpenses;

  // Certificate ID generation (Section 11)
  const certId = selectedStudent
    ? `CSE-2026-${event.id.toUpperCase().slice(-4)}-${selectedStudent.registrationId.slice(-4)}`
    : `CSE-2026-${event.id.toUpperCase().slice(-4)}-SMPL`;

  const studentName = selectedStudent ? selectedStudent.studentName : 'Varun Kumar';
  const studentRegId = selectedStudent ? selectedStudent.studentId : '221FA04001';
  const department = selectedStudent ? selectedStudent.department : 'Computer Science & Engineering';

  // Print Document (Section 17)
  const handlePrint = () => {
    window.print();
  };

  // Download PDF / Document (Section 3)
  const handleDownloadPDF = () => {
    const element = document.getElementById('printable-document-content');
    if (!element) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${event.title} - ${docType.toUpperCase()}</title>
          <style>
            body { font-family: sans-serif; padding: 30px; color: #1e293b; background: #ffffff; }
            .cert-box { border: 8px double #1e3a8a; padding: 40px; text-align: center; background: #fafafa; }
            h1 { color: #1e3a8a; font-size: 24px; margin-bottom: 5px; }
            h2 { color: #0284c7; font-size: 18px; margin-top: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-size: 13px; }
            th { background: #f1f5f9; }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${docType}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Document downloaded successfully');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn print:bg-white print:p-0">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Top Header Bar (Hidden during print) */}
        <div className="p-4 sm:p-6 border-b border-slate-200/80 bg-slate-50 flex items-center justify-between gap-4 flex-shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              {docType === 'certificate' && <Award size={20} />}
              {docType === 'press_release' && <Newspaper size={20} />}
              {docType === 'event_report' && <FileText size={20} />}
              {docType === 'budget_report' && <DollarSign size={20} />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                {docType === 'certificate' && 'Official Certificate Viewer'}
                {docType === 'press_release' && 'Official Press Release'}
                {docType === 'event_report' && 'Comprehensive Event Report'}
                {docType === 'budget_report' && 'Financial Budget Statement'}
              </h2>
              <p className="text-xs text-slate-500 font-medium truncate max-w-md">
                {event.title} • {event.date}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Download PDF</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
            >
              <Printer size={14} />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Certificate Student Selector Bar (Only for Certificate) */}
        {docType === 'certificate' && eventRegistrations.length > 0 && (
          <div className="px-6 py-3 bg-blue-50/70 border-b border-blue-100 flex flex-wrap items-center justify-between gap-3 text-xs flex-shrink-0 print:hidden">
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-900 uppercase text-[11px]">Select Student:</span>
              <select
                value={selectedStudent?.id || ''}
                onChange={(e) => {
                  const s = eventRegistrations.find((r) => r.id === e.target.value);
                  if (s) setSelectedStudent(s);
                }}
                className="h-8 px-3 rounded-lg bg-white border border-blue-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {eventRegistrations.map((r) => (
                  <option key={`reg-opt-${r.id}`} value={r.id}>
                    {r.studentName} ({r.studentId}) — {r.department}
                  </option>
                ))}
              </select>
            </div>

            <span className="font-mono font-bold text-blue-700 bg-white px-2.5 py-1 rounded-md border border-blue-200">
              Cert ID: {certId}
            </span>
          </div>
        )}

        {/* Document Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-100 print:bg-white print:p-0">
          <div
            id="printable-document-content"
            className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200/90 p-8 sm:p-12 print:shadow-none print:border-none print:p-0"
          >

            {/* ==================== 1. SAMPLE / STUDENT CERTIFICATE ==================== */}
            {docType === 'certificate' && (
              <div className="relative border-[10px] border-double border-blue-900 p-8 sm:p-12 text-center bg-radial from-slate-50 to-blue-50/30 rounded-xl overflow-hidden print:border-8">
                {/* Background Watermark Pill */}
                <div className="absolute top-4 right-4 bg-amber-500/10 border border-amber-500/30 text-amber-800 text-[10px] font-mono font-black px-3 py-1 rounded-full tracking-widest uppercase">
                  {!selectedStudent ? 'SAMPLE CERTIFICATE' : 'OFFICIAL PARTICIPATION RECORD'}
                </div>

                {/* University Header Branding */}
                <div className="space-y-1 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-blue-900 text-white mx-auto flex items-center justify-center font-extrabold text-xl shadow-md mb-3">
                    VU
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight uppercase">
                    VIGNAN UNIVERSITY
                  </h1>
                  <h2 className="text-xs sm:text-sm font-extrabold text-sky-700 tracking-wider uppercase">
                    Department of Computer Science & Engineering
                  </h2>
                  <p className="text-[10px] text-slate-500 font-mono">Accredited NAAC A+ Grade • Vadlamudi, Guntur, A.P.</p>
                </div>

                {/* Certificate Title */}
                <div className="my-6">
                  <div className="inline-block border-b-2 border-amber-500 pb-1">
                    <h3 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-widest uppercase">
                      CERTIFICATE OF PARTICIPATION
                    </h3>
                  </div>
                </div>

                {/* Certificate Body Text */}
                <div className="space-y-4 max-w-2xl mx-auto my-8 text-slate-700 text-sm sm:text-base leading-relaxed">
                  <p className="font-serif italic text-slate-500">This is to certify that</p>
                  
                  <div className="text-2xl sm:text-3xl font-black text-blue-900 font-serif border-b border-slate-300 pb-1 inline-block px-6">
                    {studentName}
                  </div>
                  <p className="text-xs font-mono text-slate-500 font-bold">
                    Reg. ID: {studentRegId} • Department of {department}
                  </p>

                  <p className="font-serif italic text-slate-500 pt-2">
                    has successfully participated in the department technical event
                  </p>

                  <div className="text-lg sm:text-xl font-extrabold text-slate-900 font-sans tracking-tight">
                    &quot;{event.title}&quot;
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    organized by the <strong className="text-slate-900">Department of Computer Science & Engineering</strong>, Vignan University on <strong className="text-slate-900">{event.date}</strong> at <strong className="text-slate-900">{event.venue}</strong>.
                  </p>
                </div>

                {/* Footer Signatures & Certificate ID */}
                <div className="grid grid-cols-2 gap-8 pt-12 mt-8 border-t border-slate-200 text-xs font-bold text-slate-800">
                  <div className="text-center">
                    <div className="font-serif text-slate-900 font-extrabold text-sm mb-1">{event.contactPerson || 'Dr. T. H. Rajesh'}</div>
                    <div className="w-32 h-0.5 bg-slate-300 mx-auto mb-1" />
                    <div className="text-[11px] text-slate-500 font-mono">Event Coordinator</div>
                  </div>

                  <div className="text-center">
                    <div className="font-serif text-slate-900 font-extrabold text-sm mb-1">Dr. K. Venkateswara Rao</div>
                    <div className="w-32 h-0.5 bg-slate-300 mx-auto mb-1" />
                    <div className="text-[11px] text-slate-500 font-mono">Head of Department, CSE</div>
                  </div>
                </div>

                <div className="mt-8 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Certificate ID: {certId}</span>
                  <span>Issued: {new Date().toLocaleDateString('en-GB')}</span>
                </div>
              </div>
            )}

            {/* ==================== 2. PRESS RELEASE ==================== */}
            {docType === 'press_release' && (
              <div className="space-y-6 font-sans text-slate-800">
                <div className="border-b-2 border-blue-900 pb-4 flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-black text-blue-950 uppercase tracking-tight">PRESS RELEASE</h1>
                    <p className="text-xs font-bold text-sky-700 uppercase">FOR IMMEDIATE RELEASE</p>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-slate-900 text-sm">Vignan University</div>
                    <div className="text-xs text-slate-500">Dept. of Computer Science & Engineering</div>
                  </div>
                </div>

                <div className="text-xs font-mono font-bold text-slate-500">
                  DATE: {event.date} • VENUE: {event.venue}
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                  {event.title}: CSE Department Conducts Landmark Technical Event at Vignan University
                </h2>

                <p className="text-sm leading-relaxed text-slate-700">
                  <strong>VADLAMUDI, GUNTUR —</strong> The Department of Computer Science & Engineering at Vignan University successfully hosted <strong>&quot;{event.title}&quot;</strong> on {event.date} at {event.venue}. The event brought together student developers, faculty members, and technology enthusiasts to foster innovation and practical software development skills.
                </p>

                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
                  <h3 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">EVENT HIGHLIGHTS & OUTCOMES</h3>
                  <ul className="text-xs sm:text-sm text-slate-700 space-y-2 list-disc list-inside">
                    <li>Total Student Registrations: <strong>{registered} participants</strong></li>
                    <li>Verified Event Attendance: <strong>{attended} students ({attendanceRate}% attendance rate)</strong></li>
                    <li>Category & Focus Area: <strong>{event.category}</strong></li>
                    <li>Eligible Departments: <strong>{event.branches?.join(', ') || 'CSE, IT, AI/ML, ECE'}</strong></li>
                    <li>Organized under the leadership of <strong>{event.organizer}</strong></li>
                  </ul>
                </div>

                <p className="text-sm leading-relaxed text-slate-700">
                  {event.description}
                </p>

                <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-600">
                  <div>
                    <span className="font-bold text-slate-900 uppercase block mb-1">Event Coordinator</span>
                    <span>{event.contactPerson}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 uppercase block mb-1">Media Contact & Email</span>
                    <span>{event.contactEmail}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== 3. COMPREHENSIVE EVENT REPORT ==================== */}
            {docType === 'event_report' && (
              <div className="space-y-6 font-sans text-slate-800">
                <div className="border-b border-slate-200 pb-4 text-center">
                  <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">OFFICIAL EVENT REPORT</h1>
                  <h2 className="text-sm font-extrabold text-blue-700">{event.title}</h2>
                  <p className="text-xs text-slate-500 font-mono mt-1">Department of Computer Science & Engineering • Vignan University</p>
                </div>

                {/* 14-Point Report Sections */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                  <div><span className="text-slate-400 font-bold block text-[10px]">EVENT DATE</span><span className="font-extrabold text-slate-900">{event.date}</span></div>
                  <div><span className="text-slate-400 font-bold block text-[10px]">TOTAL REGISTERED</span><span className="font-extrabold text-slate-900">{registered}</span></div>
                  <div><span className="text-slate-400 font-bold block text-[10px]">TOTAL ATTENDED</span><span className="font-extrabold text-slate-900">{attended}</span></div>
                  <div><span className="text-slate-400 font-bold block text-[10px]">ATTENDANCE RATE</span><span className="font-extrabold text-emerald-600">{attendanceRate}%</span></div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm mb-1">1. Event Overview & Objective</h3>
                    <p className="leading-relaxed">{event.description}</p>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm mb-1">2. Venue & Schedule</h3>
                    <p className="leading-relaxed">Conducted at {event.venue} from {event.startTime} to {event.endTime}.</p>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm mb-1">3. Eligibility & Target Audience</h3>
                    <p className="leading-relaxed">{event.eligibility}</p>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm mb-1">4. Registration & Participation Statistics</h3>
                    <p className="leading-relaxed">A total of {registered} students registered online through the Application Development Hub portal. Attendance verification confirmed {attended} attendees ({attendanceRate}% participation rate).</p>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm mb-1">5. Financial Summary</h3>
                    <p className="leading-relaxed">Total Allocated Budget: ₹{allocatedBudget.toLocaleString()} • Total Utilized Expenses: ₹{totalExpenses.toLocaleString()} • Remaining Balance: ₹{remainingBudget.toLocaleString()}.</p>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm mb-1">6. Key Deliverables & Student Outcomes</h3>
                    <p className="leading-relaxed">Students gained hands-on development experience, submitted technical deliverables, and received verified digital participation certificates.</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 flex justify-between text-xs font-bold text-slate-600">
                  <span>Report Prepared By: {event.contactPerson}</span>
                  <span>Approved By: HOD CSE</span>
                </div>
              </div>
            )}

            {/* ==================== 4. FINANCIAL BUDGET REPORT ==================== */}
            {docType === 'budget_report' && (
              <div className="space-y-6 font-sans text-slate-800">
                <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">FINANCIAL BUDGET STATEMENT</h1>
                    <p className="text-xs font-bold text-sky-700">{event.title}</p>
                  </div>
                  <div className="text-right text-xs font-mono font-bold text-slate-500">
                    <div>DATE: {event.date}</div>
                    <div>VENUE: {event.venue}</div>
                  </div>
                </div>

                {/* 3 Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                    <span className="text-[10px] font-mono font-bold text-blue-700 uppercase block mb-1">ALLOCATED BUDGET</span>
                    <span className="text-2xl font-black text-blue-950 font-tabular">₹{allocatedBudget.toLocaleString()}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
                    <span className="text-[10px] font-mono font-bold text-indigo-700 uppercase block mb-1">TOTAL EXPENSES</span>
                    <span className="text-2xl font-black text-indigo-950 font-tabular">₹{totalExpenses.toLocaleString()}</span>
                  </div>

                  <div className={`p-4 rounded-2xl border ${remainingBudget >= 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'}`}>
                    <span className="text-[10px] font-mono font-bold uppercase block mb-1">REMAINING BALANCE</span>
                    <span className="text-2xl font-black font-tabular">₹{remainingBudget.toLocaleString()}</span>
                  </div>
                </div>

                {/* Expense Breakdown Table */}
                <div className="space-y-3">
                  <h3 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">EXPENSE ITEM BREAKDOWN</h3>
                  <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3 border-b">Category / Particulars</th>
                        <th className="p-3 border-b text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      <tr><td className="p-3">Venue Setup & Infrastructure</td><td className="p-3 text-right font-tabular">₹{venueExpense.toLocaleString()}</td></tr>
                      <tr><td className="p-3">Food, Snacks & Refreshments</td><td className="p-3 text-right font-tabular">₹{foodExpense.toLocaleString()}</td></tr>
                      <tr><td className="p-3">Certificate Printing & Badges</td><td className="p-3 text-right font-tabular">₹{certificateExpense.toLocaleString()}</td></tr>
                      <tr><td className="p-3">Prizes & Cash Awards</td><td className="p-3 text-right font-tabular">₹{prizeExpense.toLocaleString()}</td></tr>
                      <tr><td className="p-3">Marketing, Banners & Posters</td><td className="p-3 text-right font-tabular">₹{marketingExpense.toLocaleString()}</td></tr>
                      <tr><td className="p-3">Technical Equipment & AV Hardware</td><td className="p-3 text-right font-tabular">₹{equipmentExpense.toLocaleString()}</td></tr>
                      <tr><td className="p-3">Other Contingency Expenses</td><td className="p-3 text-right font-tabular">₹{otherExpense.toLocaleString()}</td></tr>
                    </tbody>
                    <tfoot className="bg-slate-50 font-extrabold text-slate-900">
                      <tr>
                        <td className="p-3 border-t">TOTAL EXPENDITURE</td>
                        <td className="p-3 border-t text-right font-tabular text-sm">₹{totalExpenses.toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="pt-6 border-t border-slate-200 flex justify-between text-xs font-bold text-slate-600">
                  <span>Finance Officer Signature</span>
                  <span>HOD CSE Approval</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer (Hidden during print) */}
        <div className="p-4 border-t border-slate-200/80 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-medium flex-shrink-0 print:hidden">
          <span>Generated by Application Development Hub • Dept. of CSE</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
