import { NextResponse } from 'next/server';
import { getEventByIdFromDb, updateEventInDb, deleteEventInDb, togglePublishInDb } from '@/lib/events';
import { verifyToken } from '@/lib/auth';
import { getAssignmentsByAdmin, isAdminAssignedToClub } from '@/lib/clubStore';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const event = await getEventByIdFromDb(eventId);

    if (!event) {
      return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: event });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const authHeader = request.headers.get('authorization');
    const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '') : '';
    const userPayload = verifyToken(token);

    const existingEvent = await getEventByIdFromDb(eventId);
    if (!existingEvent) {
      return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
    }

    // Backend RBAC check for ADMIN
    if (userPayload && userPayload.role === 'ADMIN') {
      const adminId = userPayload.email || userPayload.id;
      const activeAssignments = await getAssignmentsByAdmin(adminId);
      if (existingEvent.clubId && activeAssignments.length > 0) {
        const isAuthorized = await isAdminAssignedToClub(adminId, existingEvent.clubId);
        if (!isAuthorized) {
          return NextResponse.json(
            { success: false, error: 'You are not authorized to manage events for this Club.' },
            { status: 403 }
          );
        }
      }
    }

    const body = await request.json().catch(() => ({}));

    // Special action handling for publish toggle
    if (body.action === 'toggle-publish') {
      const toggled = await togglePublishInDb(eventId);
      if (!toggled) {
        return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: 'Publish status updated', data: toggled });
    }

    const updated = await updateEventInDb(eventId, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Event updated successfully', data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const authHeader = request.headers.get('authorization');
    const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '') : '';
    const userPayload = verifyToken(token);

    const existingEvent = await getEventByIdFromDb(eventId);
    if (!existingEvent) {
      return NextResponse.json({ success: false, message: 'Event not found or already deleted' }, { status: 404 });
    }

    // Backend RBAC check for ADMIN
    if (userPayload && userPayload.role === 'ADMIN') {
      const adminId = userPayload.email || userPayload.id;
      const activeAssignments = await getAssignmentsByAdmin(adminId);
      if (existingEvent.clubId && activeAssignments.length > 0) {
        const isAuthorized = await isAdminAssignedToClub(adminId, existingEvent.clubId);
        if (!isAuthorized) {
          return NextResponse.json(
            { success: false, error: 'You are not authorized to manage events for this Club.' },
            { status: 403 }
          );
        }
      }
    }

    const deleted = await deleteEventInDb(eventId);

    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Event not found or already deleted' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Event deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
