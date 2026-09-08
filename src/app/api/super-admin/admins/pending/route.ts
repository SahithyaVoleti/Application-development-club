import { NextResponse } from 'next/server';
import { getPendingAdminRequests } from '@/lib/userStore';
import { verifySuperAdmin } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const superAdmin = verifySuperAdmin(authHeader);

    if (!superAdmin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Super Admin permissions required.' },
        { status: 403 }
      );
    }

    const pendingAdmins = await getPendingAdminRequests();
    return NextResponse.json({ success: true, count: pendingAdmins.length, admins: pendingAdmins });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
