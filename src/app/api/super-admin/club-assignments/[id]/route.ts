import { NextResponse } from 'next/server';
import { removeAdminFromClub, getAllAssignments } from '@/lib/clubStore';
import { verifySuperAdmin } from '@/lib/auth';
import { sendClubRemovalEmail } from '@/lib/emailService';

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const superAdmin = verifySuperAdmin(authHeader);

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Assignment ID is required.' }, { status: 400 });
    }

    const performerName = superAdmin?.name || 'Super Admin';
    const removedAssignment = await removeAdminFromClub({ assignmentId: id }, performerName);

    if (!removedAssignment) {
      return NextResponse.json({ success: false, error: 'Club assignment record not found.' }, { status: 404 });
    }

    // Send removal email notification (Requirement 20)
    try {
      await sendClubRemovalEmail({
        adminEmail: removedAssignment.adminEmail,
        adminName: removedAssignment.adminName,
        clubName: removedAssignment.clubName,
        removedBy: performerName,
        removedAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
      });
    } catch (emailErr) {
      console.error('[CLUB REMOVAL EMAIL ERROR]:', emailErr);
    }

    const allAssignments = await getAllAssignments();

    return NextResponse.json({
      success: true,
      message: `Admin ${removedAssignment.adminName} removed from ${removedAssignment.clubName}.`,
      assignment: removedAssignment,
      assignments: allAssignments,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to remove assignment' },
      { status: 500 }
    );
  }
}
