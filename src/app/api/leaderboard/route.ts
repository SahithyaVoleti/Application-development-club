import { NextResponse } from 'next/server';
import {
  getLeaderboardEntries,
  addLeaderboardEntry,
  deleteLeaderboardEntry,
  clearLeaderboard,
} from '@/lib/leaderboardStore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    const entries = getLeaderboardEntries(eventId);
    return NextResponse.json({ success: true, count: entries.length, data: entries });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      eventId,
      eventTitle,
      rank,
      teamName,
      members,
      projectName,
      points,
      projectsCount,
      hackathonsCount,
      badge,
      award,
    } = body;

    if (!teamName || !members) {
      return NextResponse.json(
        { success: false, error: 'Team name and members are required' },
        { status: 400 }
      );
    }

    const entry = addLeaderboardEntry({
      eventId: eventId || null,
      eventTitle: eventTitle || null,
      rank: Number(rank) || 1,
      teamName,
      members,
      projectName: projectName || null,
      points: Number(points) || 0,
      projectsCount: Number(projectsCount) || 1,
      hackathonsCount: Number(hackathonsCount) || 1,
      badge: badge || null,
      award: award || null,
    });

    return NextResponse.json({ success: true, data: entry });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create leaderboard entry' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const eventId = searchParams.get('eventId');
    const clearAll = searchParams.get('clearAll');

    if (clearAll === 'true') {
      clearLeaderboard(eventId);
      return NextResponse.json({ success: true, message: 'Leaderboard cleared' });
    }

    if (id) {
      const deleted = deleteLeaderboardEntry(id);
      return NextResponse.json({ success: deleted, id });
    }

    return NextResponse.json({ success: false, error: 'Missing id parameter' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete entry' },
      { status: 500 }
    );
  }
}
