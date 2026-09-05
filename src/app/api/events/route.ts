import { NextResponse } from 'next/server';
import { getEventsFromDb, createEventInDb } from '@/lib/events';

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
    const body = await request.json();
    const newEvent = await createEventInDb(body);
    return NextResponse.json({ success: true, data: newEvent }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
