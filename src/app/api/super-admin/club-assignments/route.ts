import { NextResponse } from 'next/server';
import { getAllAssignments, assignAdminToClub } from '@/lib/clubStore';
import { findUserById, findUserByEmail } from '@/lib/userStore';
import { verifySuperAdmin } from '@/lib/auth';
import { sendClubAssignmentEmail } from '@/lib/emailService';

export async function GET(request: Request) {
  try {
    const assignments = await getAllAssignments();
    return NextResponse.json({ success: true, assignments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch assignments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const superAdmin = verifySuperAdmin(authHeader);

    const body = await request.json();
    const { adminId, adminEmail, clubId, assignedBy } = body;

    if ((!adminId && !adminEmail) || !clubId) {
      return NextResponse.json(
        { success: false, error: 'Admin ID or Email and Club ID are required.' },
        { status: 400 }
      );
    }

    let user = null;
    if (adminId) {
      user = await findUserById(adminId);
    }
    if (!user && adminEmail) {
      user = await findUserByEmail(adminEmail);
    }

    if (!user) {
      return NextResponse.json({ success: false, error: 'Admin user account not found.' }, { status: 404 });
    }

    const performerName = superAdmin?.name || assignedBy || 'Super Admin';

    const result = await assignAdminToClub({
      adminId: user.id,
      adminName: user.name,
      adminEmail: user.email,
      clubId,
      assignedBy: performerName,
    });

    // Send "Added to Club as Admin" Email notification (Requirement 17)
    try {
      const host = request.headers.get('host') || 'localhost:4028';
      const protocol = host.includes('localhost') ? 'http' : 'https';
      const baseUrl = `${protocol}://${host}`;

      await sendClubAssignmentEmail({
        adminEmail: user.email,
        adminName: user.name,
        clubName: result.assignment.clubName,
        assignedBy: performerName,
        assignedAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
        baseUrl,
      });
    } catch (emailErr) {
      console.error('[CLUB ASSIGNMENT EMAIL ERROR]:', emailErr);
    }

    const allAssignments = await getAllAssignments();

    return NextResponse.json({
      success: true,
      message: `Successfully assigned ${user.name} as Admin to ${result.assignment.clubName}.`,
      assignment: result.assignment,
      assignments: allAssignments,
      alreadyAssigned: result.alreadyAssigned,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Club assignment failed' },
      { status: 500 }
    );
  }
}
