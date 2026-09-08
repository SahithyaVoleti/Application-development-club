import { NextResponse } from 'next/server';
import { getEventsFromDb, createEventInDb } from '@/lib/events';
import { PersistentEventStore } from '@/lib/eventStore';
import { verifyToken } from '@/lib/auth';
import { getAssignmentsByAdmin, isAdminAssignedToClub, getClubById } from '@/lib/clubStore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter');
    const clubId = searchParams.get('clubId');

    let events = await getEventsFromDb();

    if (clubId) {
      events = events.filter(e => e.clubId === clubId);
    }

    if (filter === 'upcoming') {
      const upcoming = PersistentEventStore.getUpcomingEvents().filter(e => !clubId || e.clubId === clubId);
      return NextResponse.json({ success: true, data: upcoming });
    }

    if (filter === 'past') {
      const past = PersistentEventStore.getPastEvents().filter(e => !clubId || e.clubId === clubId);
      return NextResponse.json({ success: true, data: past });
    }

    if (filter === 'published') {
      const published = events.filter((e) => e.isPublished !== false);
      return NextResponse.json({ success: true, data: published });
    }

    return NextResponse.json({ success: true, data: events });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '') : '';
    const userPayload = verifyToken(token);

    const body = await request.json().catch(() => ({}));

    // Minimum check: Title (or generate fallback title)
    if (!body.title && !body.name) {
      return NextResponse.json(
        { success: false, message: 'Event Name / Title is required.' },
        { status: 400 }
      );
    }

    let targetClubId = body.clubId;
    let targetClubName = body.clubName;

    // Backend RBAC Guard (Requirements 18, 22, 23)
    if (userPayload && userPayload.role === 'ADMIN') {
      const activeAssignments = await getAssignmentsByAdmin(userPayload.email || userPayload.id);

      if (targetClubId) {
        const isAuthorized = await isAdminAssignedToClub(userPayload.email || userPayload.id, targetClubId);
        if (!isAuthorized && activeAssignments.length > 0) {
          return NextResponse.json(
            { success: false, error: 'You are not authorized to manage events for this Club.' },
            { status: 403 }
          );
        }
      } else if (activeAssignments.length > 0) {
        targetClubId = activeAssignments[0].clubId;
        targetClubName = activeAssignments[0].clubName;
      }
    }

    if (targetClubId && !targetClubName) {
      const clubObj = await getClubById(targetClubId);
      if (clubObj) targetClubName = clubObj.name;
    }

    if (!targetClubId) {
      targetClubId = 'club-appdev';
      targetClubName = 'Application Development Club';
    }

    const payloadToSave = {
      title: body.title || body.name || 'Untitled Event',
      clubId: targetClubId,
      clubName: targetClubName,
      category: body.category || 'AI/ML Workshop',
      description: body.description || 'Comprehensive event overview and learning objectives.',
      date: body.date || new Date().toISOString().slice(0, 10),
      startTime: body.startTime || '09:00',
      endTime: body.endTime || '18:00',
      venue: body.venue || 'CSE Seminar Hall, Block A',
      organizer: targetClubName || body.organizer || 'Dept. of Computer Science & Engineering',
      registrationDeadline: body.registrationDeadline || `${body.date || new Date().toISOString().slice(0, 10)}T23:59`,
      capacity: body.capacity ? Number(body.capacity) : 150,
      posterUrl: body.posterUrl || '/images/events/remote-event-10.png',
      eligibility: body.eligibility || 'Open to all CSE & IT Students',
      rules: body.rules || 'Standard workshop guidelines apply.',
      requirements: body.requirements || 'College ID Card, Laptop',
      contactPerson: body.contactPerson || userPayload?.name || 'Event Coordinator',
      contactEmail: body.contactEmail || userPayload?.email || 'admin@vignan.ac.in',
      status: body.status || 'UPCOMING',
      isPublished: body.isPublished !== false,
      allocatedBudget: body.allocatedBudget ? Number(body.allocatedBudget) : null,
      certificateTemplateUrl: body.certificateTemplateUrl || null,
    };

    const newEvent = await createEventInDb(payloadToSave as any);
    return NextResponse.json({ success: true, message: 'Event created successfully', data: newEvent }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
