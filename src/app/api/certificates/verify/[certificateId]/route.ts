import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ certificateId: string }> }
) {
  try {
    const { certificateId } = await params;

    if (!certificateId) {
      return NextResponse.json({ success: false, error: 'Certificate ID is required' }, { status: 400 });
    }

    const cert = await prisma.certificate.findUnique({
      where: { certificateId: certificateId.trim() },
      include: {
        event: true,
        registration: true,
      },
    });

    if (!cert || !cert.registration) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          error: 'Certificate Not Found. The specified Certificate ID is invalid or has not been issued.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      certificate: {
        certificateId: cert.certificateId,
        issuedAt: cert.issuedAt,
        studentName: cert.registration.studentName,
        studentId: cert.registration.studentId,
        department: cert.registration.department,
        college: cert.registration.section ? 'Vignan University (VFSTR)' : 'College Innovation Platform',
        eventTitle: cert.event.title,
        eventCategory: cert.event.category,
        eventDate: cert.event.date,
        organizer: cert.event.organizer,
        status: 'OFFICIALLY VERIFIED',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Verification query failed' },
      { status: 500 }
    );
  }
}
