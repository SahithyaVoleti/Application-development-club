import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { getEventByIdFromDb, getRegistrationsFromDb } from '@/lib/events';
import { verifyTrustedAdmin } from '@/lib/auth';

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

function formatTime(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch (e) {
    return '12:00 PM';
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const adminUser = verifyTrustedAdmin(authHeader);
    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Trusted Admin privileges required.' },
        { status: 403 }
      );
    }

    const { eventId } = await params;
    const event = await getEventByIdFromDb(eventId);

    if (!event) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    // Strict Event Isolation: fetch ONLY registrations belonging to eventId
    const allRegistrations = await getRegistrationsFromDb(eventId);
    const eventRegistrations = allRegistrations.filter((r) => r.eventId === eventId);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Application Development Hub - Dept. of CSE';
    workbook.created = new Date();

    const sheetName = event.title.replace(/[:\\/?*\[\]]/g, '').slice(0, 31) || 'Registrations';
    const worksheet = workbook.addWorksheet(sheetName, {
      pageSetup: { paperSize: 9, orientation: 'landscape' },
    });

    // 1. TOP EVENT SUMMARY BLOCK
    const titleRow = worksheet.addRow(['EVENT REGISTRATION REPORT']);
    titleRow.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
    titleRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
    worksheet.mergeCells('A1:P1');
    titleRow.alignment = { horizontal: 'center', vertical: 'middle' };
    titleRow.height = 36;

    worksheet.addRow([]); // Blank spacer

    const summaryRows = [
      ['Event Name:', event.title, '', 'Total Capacity:', event.capacity],
      ['Event Date:', formatDate(event.date), '', 'Total Registered:', eventRegistrations.length],
      ['Venue:', event.venue, '', 'Available Seats:', Math.max(0, event.capacity - eventRegistrations.length)],
      ['Organizer:', event.organizer, '', 'Report Generated:', new Date().toLocaleString('en-GB')],
    ];

    summaryRows.forEach((rowVals) => {
      const row = worksheet.addRow(rowVals);
      row.font = { name: 'Calibri', size: 11, bold: false };
      // Bold label cells
      row.getCell(1).font = { bold: true, color: { argb: 'FF334155' } };
      row.getCell(4).font = { bold: true, color: { argb: 'FF334155' } };
      row.getCell(2).font = { bold: true, color: { argb: 'FF0284C7' } };
      row.getCell(5).font = { bold: true, color: { argb: 'FF16A34A' } };
    });

    worksheet.addRow([]); // Blank spacer

    // 2. STUDENT REGISTRATION TABLE HEADERS
    const headers = [
      'S.No',
      'Event Name',
      'Event Date',
      'Registration ID',
      'Full Name',
      'Student ID',
      'Department / Branch',
      'Year',
      'Section',
      'Email Address',
      'Mobile Number',
      'Gender',
      'Relevant Technical Skills',
      'Registration Status',
      'Registered Date',
      'Registered Time',
    ];

    const headerRow = worksheet.addRow(headers);
    headerRow.height = 28;
    headerRow.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    const tableStartRowIndex = headerRow.number;

    // 3. STUDENT REGISTRATION DATA ROWS
    eventRegistrations.forEach((reg, idx) => {
      const row = worksheet.addRow([
        idx + 1,
        event.title,
        formatDate(event.date),
        reg.registrationId,
        reg.studentName,
        String(reg.studentId), // Ensure text string
        reg.department,
        reg.year,
        reg.section,
        reg.email,
        String(reg.mobile), // Ensure text string to PREVENT scientific notation (9.87654E+09)
        reg.gender,
        reg.skills || 'N/A',
        'Confirmed',
        formatDate(reg.registrationDate),
        formatTime(reg.registrationDate),
      ]);

      row.height = 22;

      // Formatting specific cells
      row.getCell(1).alignment = { horizontal: 'center' };
      row.getCell(4).font = { name: 'Consolas', size: 10, color: { argb: 'FF0284C7' } };
      row.getCell(4).alignment = { horizontal: 'center' };
      
      // Student ID & Mobile Number explicitly stored as STRING to avoid scientific notation
      const studentIdCell = row.getCell(6);
      studentIdCell.value = String(reg.studentId);
      studentIdCell.numFmt = '@';
      studentIdCell.font = { name: 'Consolas', size: 10, bold: true };
      studentIdCell.alignment = { horizontal: 'center' };

      const mobileCell = row.getCell(11);
      mobileCell.value = String(reg.mobile);
      mobileCell.numFmt = '@';
      mobileCell.font = { name: 'Consolas', size: 10 };
      mobileCell.alignment = { horizontal: 'center' };

      row.getCell(14).font = { bold: true, color: { argb: 'FF16A34A' } };
      row.getCell(14).alignment = { horizontal: 'center' };
    });

    // 4. EXCEL FORMATTING (Auto Widths, Freeze Panes, Auto-Filter)
    worksheet.columns.forEach((column) => {
      let maxLen = 12;
      column.eachCell?.({ includeEmpty: true }, (cell) => {
        const str = cell.value ? String(cell.value) : '';
        if (str.length > maxLen) maxLen = Math.min(str.length, 45);
      });
      column.width = maxLen + 4;
    });

    // Enable Auto-Filter on Table Headers
    const lastRowIndex = Math.max(tableStartRowIndex + 1, worksheet.rowCount);
    worksheet.autoFilter = {
      from: { row: tableStartRowIndex, column: 1 },
      to: { row: lastRowIndex, column: headers.length },
    };

    // Freeze panes below table header row
    worksheet.views = [
      { state: 'frozen', xSplit: 0, ySplit: tableStartRowIndex, activeCell: `A${tableStartRowIndex + 1}` },
    ];

    // Generate XLSX Buffer
    const buffer = await workbook.xlsx.writeBuffer();

    const sanitizedTitle = event.title.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
    const filename = `${sanitizedTitle}_Registrations.xlsx`;

    return new NextResponse(buffer as ArrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error('Excel Export Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
