import { NextResponse } from 'next/server';
import { rejectAdminRequest, getAllAdminRequests } from '@/lib/userStore';
import { verifySuperAdmin } from '@/lib/auth';
import { sendAdminStatusUpdateEmail } from '@/lib/emailService';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const superAdmin = verifySuperAdmin(authHeader);

    const { id } = await context.params;
    let reason = 'Verification details did not match CSE Faculty records.';

    try {
      const body = await request.json();
      if (body.reason) reason = body.reason;
    } catch (e) {}

    if (!id) {
      return NextResponse.json({ success: false, message: 'Admin ID is required.' }, { status: 400 });
    }

    const performerName = superAdmin?.name || 'Super Admin';
    const result = await rejectAdminRequest(id, performerName, reason);

    if (result.alreadyProcessed) {
      return NextResponse.json(
        {
          success: false,
          alreadyProcessed: true,
          message: 'This approval request has already been processed.',
          admin: result.user,
        },
        { status: 409 }
      );
    }

    if (!result.user) {
      return NextResponse.json({ success: false, message: 'Admin account not found.' }, { status: 404 });
    }

    const rejectedUser = result.user;

    // Send rejection email notification
    try {
      await sendAdminStatusUpdateEmail({
        adminEmail: rejectedUser.email,
        adminName: rejectedUser.name,
        status: 'REJECTED',
        reason,
      });
    } catch (emailErr) {
      console.error('[REJECTION EMAIL ERROR]:', emailErr);
    }

    const allAdmins = await getAllAdminRequests();
    return NextResponse.json({
      success: true,
      message: `Admin registration for ${rejectedUser.name} has been rejected.`,
      admin: rejectedUser,
      admins: allAdmins,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Rejection failed.' }, { status: 500 });
  }
}

export const POST = PATCH;
