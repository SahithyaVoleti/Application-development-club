import { NextResponse } from 'next/server';
import { getEventsFromDb, getRegistrationsFromDb } from '@/lib/events';
import { REGISTERED_COUNTS } from '@/lib/mockData';

export async function GET() {
  try {
    const events = await getEventsFromDb();
    const registrations = await getRegistrationsFromDb();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalEvents = events.length;

    const upcomingEvents = events.filter((e) => {
      const d = new Date(e.date);
      d.setHours(0, 0, 0, 0);
      return e.status !== 'COMPLETED' && d >= today;
    }).length;

    const completedEvents = events.filter((e) => {
      const d = new Date(e.date);
      d.setHours(0, 0, 0, 0);
      return e.status === 'COMPLETED' || d < today;
    }).length;

    // Sum registration counts dynamically from DB and mock counts
    let totalStudentsRegistered = registrations.length;
    if (totalStudentsRegistered < 100) {
      const mockTotal = Object.values(REGISTERED_COUNTS).reduce((a, b) => a + b, 0);
      totalStudentsRegistered = Math.max(totalStudentsRegistered, mockTotal);
    }

    return NextResponse.json({
      success: true,
      data: {
        totalEvents,
        upcomingEvents,
        completedEvents,
        totalStudentsRegistered,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch public event statistics' },
      { status: 500 }
    );
  }
}
