import { NextResponse } from 'next/server';
import { getRegistrationsFromDb, createRegistrationInDb } from '@/lib/events';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId') || undefined;
    const registrations = await getRegistrationsFromDb(eventId);
    return NextResponse.json({ success: true, data: registrations });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newRegistration = await createRegistrationInDb(body);
    return NextResponse.json({ success: true, data: newRegistration }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
