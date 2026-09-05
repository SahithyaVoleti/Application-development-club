import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const registrationId = searchParams.get('registrationId');
    const studentId = searchParams.get('studentId');
    const eventId = searchParams.get('eventId');

    if (!registrationId && (!studentId || !eventId)) {
      return NextResponse.json(
        { success: false, error: 'Registration ID or Student ID + Event ID required' },
        { status: 400 }
      );
    }

    // Query registration from Prisma database
    let registration;

    if (registrationId) {
      registration = await prisma.registration.findFirst({
        where: { OR: [{ id: registrationId }, { registrationId }] },
        include: { event: true },
      });
    } else if (studentId && eventId) {
      registration = await prisma.registration.findFirst({
        where: { studentId, eventId },
        include: { event: true },
      });
    }

    if (!registration) {
      return NextResponse.json(
        { success: false, error: 'Registration record not found.' },
        { status: 404 }
      );
    }

    // STRICT ATTENDANCE ENFORCEMENT BACKEND SECURITY CHECK
    if (registration.attendanceStatus !== 'present') {
      return NextResponse.json(
        {
          success: false,
          error: 'Certificate Not Available. Attendance status is PENDING or ABSENT. Only verified ATTENDED participants can download certificates.',
          attendanceStatus: registration.attendanceStatus,
        },
        { status: 403 }
      );
    }

    // Retrieve or generate certificate record
    let cert = await prisma.certificate.findFirst({
      where: { registrationId: registration.id },
    });

    if (!cert) {
      const certId = `ADH-${new Date().getFullYear()}-${registration.eventId.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
      cert = await prisma.certificate.create({
        data: {
          certificateId: certId,
          eventId: registration.eventId,
          studentId: registration.studentId,
          userId: registration.userId,
          registrationId: registration.id,
          issuedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      certificate: {
        certificateId: cert.certificateId,
        issuedAt: cert.issuedAt,
        studentName: registration.studentName,
        studentId: registration.studentId,
        department: registration.department,
        eventTitle: registration.event.title,
        eventCategory: registration.event.category,
        eventDate: registration.event.date,
        venue: registration.event.venue,
        organizer: registration.event.organizer,
        certificateTemplateUrl: registration.event.certificateTemplateUrl,
      },
    });
  } catch (error: any) {
    console.error('Certificate API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch certificate' },
      { status: 500 }
    );
  }
}
