import { NextResponse } from 'next/server';
import { approveAdminRequest, rejectAdminRequest, getAllAdminRequests, getPendingAdminRequests } from '@/lib/userStore';
import { verifySuperAdmin } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const superAdmin = verifySuperAdmin(authHeader);

    // Require Super Admin permissions to accept or reject Admin requests
    if (!superAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Super Admin permissions required to approve or reject admins.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { requestId, action, rejectionReason } = body;

    if (!requestId || !action) {
      return NextResponse.json(
        { success: false, error: 'Request ID and action (ACCEPT or REJECT) are required.' },
        { status: 400 }
      );
    }

    let result = null;

    if (action === 'ACCEPT') {
      result = await approveAdminRequest(requestId, superAdmin.name);
    } else if (action === 'REJECT') {
      const reason = rejectionReason || 'Verification details did not match CSE Faculty records.';
      result = await rejectAdminRequest(requestId, superAdmin.name, reason);
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Must be ACCEPT or REJECT.' },
        { status: 400 }
      );
    }

    if (result.alreadyProcessed) {
      return NextResponse.json(
        {
          success: false,
          alreadyProcessed: true,
          error: 'This approval request has already been processed.',
          user: result.user,
        },
        { status: 409 }
      );
    }

    if (!result.user) {
      return NextResponse.json(
        { success: false, error: 'Admin request record not found.' },
        { status: 404 }
      );
    }

    const updatedUser = result.user;
    const allRequests = await getAllAdminRequests();
    const pendingRequests = await getPendingAdminRequests();

    return NextResponse.json({
      success: true,
      action,
      updatedUser,
      pendingCount: pendingRequests.length,
      requests: allRequests,
      message: action === 'ACCEPT'
        ? `Successfully verified and approved ${updatedUser.name} as Trusted Admin!`
        : `Rejected admin registration request for ${updatedUser.name}.`,
    });
  } catch (error: any) {
    console.error('Approve Admin Request API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Action failed' },
      { status: 500 }
    );
  }
}
