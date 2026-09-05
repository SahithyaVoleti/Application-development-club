import { NextResponse } from 'next/server';
import { getAllAdminRequests, getPendingAdminRequests } from '@/lib/userStore';
import { verifyTrustedAdmin } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const adminUser = verifyTrustedAdmin(authHeader);

    // Require Super Admin role to access Admin Approval Requests list
    if (!adminUser || adminUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Super Admin permissions required.' },
        { status: 403 }
      );
    }

    const allRequests = await getAllAdminRequests();
    const pendingRequests = await getPendingAdminRequests();

    return NextResponse.json({
      success: true,
      pendingCount: pendingRequests.length,
      requests: allRequests,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
