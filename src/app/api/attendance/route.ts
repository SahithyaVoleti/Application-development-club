import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { AttendanceStatus } from '@prisma/client';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { registrationId, studentId, eventId, attendanceStatus } = body;

    if (!attendanceStatus || !['present', 'absent', 'not_marked'].includes(attendanceStatus)) {
      return NextResponse.json(
        { success: false, error: 'Invalid attendance status. Allowed: present, absent, not_marked' },
        { status: 400 }
      );
    }

    let targetRegistration;

    if (registrationId) {
      targetRegistration = await prisma.registration.findFirst({
        where: { OR: [{ id: registrationId }, { registrationId }] },
      });
    } else if (studentId && eventId) {
      targetRegistration = await prisma.registration.findFirst({
        where: { studentId, eventId },
      });
    }

    if (!targetRegistration) {
      return NextResponse.json(
        { success: false, error: 'Registration record not found' },
        { status: 404 }
      );
    }

    // Update attendance status in database
    const updated = await prisma.registration.update({
      where: { id: targetRegistration.id },
      data: {
        attendanceStatus: attendanceStatus as AttendanceStatus,
      },
    });

    // If marked as present (ATTENDED), generate certificate record automatically
    if (attendanceStatus === 'present') {
      const certId = `ADH-${new Date().getFullYear()}-${updated.eventId.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;

      await prisma.certificate.upsert({
        where: { registrationId: updated.id },
        update: {
          issuedAt: new Date(),
        },
        create: {
          certificateId: certId,
          eventId: updated.eventId,
          studentId: updated.studentId,
          userId: updated.userId,
          registrationId: updated.id,
          issuedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Attendance updated to ${attendanceStatus}`,
      registration: updated,
    });
  } catch (error: any) {
    console.error('Attendance API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update attendance' },
      { status: 500 }
    );
  }
}
