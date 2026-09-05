import { NextResponse } from 'next/server';
import { getEventsFromDb, createEventInDb } from '@/lib/events';
import { verifyTrustedAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const events = await getEventsFromDb();
    return NextResponse.json({ success: true, data: events });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const adminUser = verifyTrustedAdmin(authHeader);
    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Trusted Admin privileges required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const newEvent = await createEventInDb(body);
    return NextResponse.json({ success: true, data: newEvent }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
