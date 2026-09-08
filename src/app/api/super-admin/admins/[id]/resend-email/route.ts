import { NextResponse } from 'next/server';
import { getAllUsers, addAuditLog } from '@/lib/userStore';
import { verifySuperAdmin } from '@/lib/auth';
import { getAssignmentsByAdmin } from '@/lib/clubStore';
import { sendAdminAddedEmail } from '@/lib/emailService';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    const superAdmin = verifySuperAdmin(authHeader);

    if (!superAdmin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Super Admin permissions required.' },
        { status: 403 }
      );
    }

    const cleanIdentifier = decodeURIComponent(id).trim().toLowerCase();
    const allUsers = await getAllUsers();
    const admin = allUsers.find(
      u => u.id === cleanIdentifier || (u.id && u.id.toLowerCase() === cleanIdentifier) || (u.email && u.email.toLowerCase() === cleanIdentifier)
    );

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Admin account not found.' },
        { status: 404 }
      );
    }

    const activeAssignments = await getAssignmentsByAdmin(admin.email || admin.id);
    const clubName = activeAssignments.length > 0 ? activeAssignments[0].clubName : 'Application Development Club';

    const emailRes = await sendAdminAddedEmail({
      adminEmail: admin.email,
      adminName: admin.name,
      clubName,
      assignedBy: superAdmin.name,
      assignedAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
    });

    await addAuditLog({
      adminId: admin.id,
      adminName: admin.name,
      adminEmail: admin.email,
      action: 'CREATED',
      performedBy: superAdmin.name,
      metadata: { resend: true, clubName },
    });

    if (emailRes.success) {
      console.log(`[RESEND EMAIL SUCCESS] Resent welcome notification to ${admin.email}`);
      return NextResponse.json({
        success: true,
        message: `Welcome notification email resent to ${admin.name} (${admin.email})`,
        emailSent: true,
      });
    } else {
      console.warn(`[RESEND EMAIL FAILED] To ${admin.email}: ${emailRes.error}`);
      return NextResponse.json({
        success: false,
        message: `Could not send email to ${admin.email}. ${emailRes.error || 'Check SMTP configuration.'}`,
        emailSent: false,
        error: emailRes.error,
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
