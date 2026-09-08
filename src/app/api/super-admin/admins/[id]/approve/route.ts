import { NextResponse } from 'next/server';
import { approveAdminRequest, getAllAdminRequests } from '@/lib/userStore';
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
    if (!id) {
      return NextResponse.json({ success: false, message: 'Admin ID is required.' }, { status: 400 });
    }

    const performerName = superAdmin?.name || 'Super Admin';
    const result = await approveAdminRequest(id, performerName);

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

    const approvedUser = result.user;

    // Send email confirmation to Admin
    try {
      await sendAdminStatusUpdateEmail({
        adminEmail: approvedUser.email,
        adminName: approvedUser.name,
        status: 'APPROVED',
        approvedBy: performerName,
      });
    } catch (emailErr) {
      console.error('[APPROVAL CONFIRMATION EMAIL ERROR]:', emailErr);
    }

    const allAdmins = await getAllAdminRequests();
    return NextResponse.json({
      success: true,
      message: `Admin account for ${approvedUser.name} has been approved successfully.`,
      admin: approvedUser,
      admins: allAdmins,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Approval failed.' }, { status: 500 });
  }
}

export const POST = PATCH;
