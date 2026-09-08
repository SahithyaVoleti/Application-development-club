import { NextResponse } from 'next/server';
import { getRegistrationsFromDb, createRegistrationInDb } from '@/lib/events';
import { PersistentRegistrationStore } from '@/lib/registrationStore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId') || undefined;
    const registrations = await getRegistrationsFromDb(eventId);

    let seatStats = null;
    if (eventId) {
      seatStats = PersistentRegistrationStore.getEventSeatStats(eventId);
    }

    return NextResponse.json({ success: true, data: registrations, seatStats });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.eventId || !body.studentId || !body.email || !body.studentName) {
      return NextResponse.json(
        { success: false, error: 'Event ID, Student ID, Email, and Full Name are required.' },
        { status: 400 }
      );
    }

    const newRegistration = await createRegistrationInDb(body);
    const seatStats = PersistentRegistrationStore.getEventSeatStats(body.eventId);

    return NextResponse.json(
      {
        success: true,
        data: newRegistration,
        seatStats,
        message: 'Event registration completed successfully.',
      },
      { status: 201 }
    );
  } catch (error: any) {
    const errorMsg = error.message || 'Registration failed';
    const isDuplicate = errorMsg.includes('already registered') || error.code === 'DUPLICATE_REGISTRATION';
    const isFull = errorMsg.includes('full') || error.code === 'EVENT_FULL';

    const statusCode = isDuplicate ? 409 : isFull ? 400 : 500;

    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
        code: error.code || (isDuplicate ? 'DUPLICATE_REGISTRATION' : isFull ? 'EVENT_FULL' : 'REGISTRATION_ERROR'),
      },
      { status: statusCode }
    );
  }
}
