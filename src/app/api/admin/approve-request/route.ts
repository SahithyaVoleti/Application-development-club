import { NextResponse } from 'next/server';
import { approveAdminRequest, rejectAdminRequest, getAllAdminRequests, getPendingAdminRequests } from '@/lib/userStore';
import { verifyTrustedAdmin } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const superAdmin = verifyTrustedAdmin(authHeader);

    // Require Super Admin permissions to accept or reject Admin requests
    if (!superAdmin || superAdmin.role !== 'SUPER_ADMIN') {
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

    let updatedUser = null;

    if (action === 'ACCEPT') {
      updatedUser = await approveAdminRequest(requestId, superAdmin.name);
    } else if (action === 'REJECT') {
      const reason = rejectionReason || 'Verification details did not match CSE Faculty records.';
      updatedUser = await rejectAdminRequest(requestId, reason);
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Must be ACCEPT or REJECT.' },
        { status: 400 }
      );
    }

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'Admin request record not found.' },
        { status: 404 }
      );
    }

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
