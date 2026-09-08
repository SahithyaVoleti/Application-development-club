import { NextResponse } from 'next/server';
import { approveAdminRequest, isSuperAdminEmail } from '@/lib/userStore';
import { sendAdminStatusUpdateEmail } from '@/lib/emailService';
import { verifyApprovalActionToken, verifySuperAdmin } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tokenParam = searchParams.get('token');
    const adminIdParam = searchParams.get('adminId');
    const emailParam = searchParams.get('email');

    let targetId = adminIdParam || emailParam || '';
    let performedBy = 'Super Admin (Email Link)';

    if (tokenParam) {
      const payload = verifyApprovalActionToken(tokenParam);
      if (!payload) {
        return new NextResponse(
          `
          <html>
            <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #fff1f2; padding: 50px; text-align: center;">
              <div style="max-width: 500px; margin: 0 auto; background: white; padding: 32px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #fecdd3;">
                <h2 style="color: #e11d48; margin-top: 0;">Invalid or Malformed Approval Token</h2>
                <p style="color: #475569; font-size: 15px; line-height: 1.6;">
                  This approval link is invalid or has been corrupted. Please sign in to the Super Admin portal to process this request.
                </p>
                <div style="margin-top: 24px;">
                  <a href="/admin-dashboard" style="background: #0f172a; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px;">Open Super Admin Portal</a>
                </div>
              </div>
            </body>
          </html>
          `,
          { status: 400, headers: { 'content-type': 'text/html' } }
        );
      }

      if ((payload as any).isExpired) {
        return new NextResponse(
          `
          <html>
            <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #fffbeb; padding: 50px; text-align: center;">
              <div style="max-width: 500px; margin: 0 auto; background: white; padding: 32px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #fde68a;">
                <h2 style="color: #d97706; margin-top: 0;">Approval Link Expired</h2>
                <p style="color: #475569; font-size: 15px; line-height: 1.6;">
                  This approval link has expired. Please log in to the Super Admin Control Center to review and approve this request.
                </p>
                <div style="margin-top: 24px;">
                  <a href="/admin-dashboard" style="background: #0f172a; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px;">Open Super Admin Portal</a>
                </div>
              </div>
            </body>
          </html>
          `,
          { status: 400, headers: { 'content-type': 'text/html' } }
        );
      }

      targetId = payload.adminId || payload.adminEmail;
      performedBy = payload.superAdminEmail ? `Super Admin (${payload.superAdminEmail})` : 'Super Admin (Email Link)';
    }

    if (!targetId) {
      return new NextResponse(
        `<html><body style="font-family: sans-serif; padding: 40px; text-align: center;"><h2>Invalid Request</h2><p>Missing Admin ID or Email parameters.</p></body></html>`,
        { status: 400, headers: { 'content-type': 'text/html' } }
      );
    }

    const result = await approveAdminRequest(targetId, performedBy);

    if (result.alreadyProcessed) {
      return new NextResponse(
        `
        <html>
          <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; padding: 50px; text-align: center;">
            <div style="max-width: 500px; margin: 0 auto; background: white; padding: 32px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
              <h2 style="color: #d97706; margin-top: 0;">Notice: Request Already Processed</h2>
              <p style="color: #475569; font-size: 15px; line-height: 1.6;">
                This approval request has already been processed by a Super Admin.
              </p>
              <div style="margin-top: 24px;">
                <a href="/admin-dashboard" style="background: #0f172a; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px;">Open Super Admin Portal</a>
              </div>
            </div>
          </body>
        </html>
        `,
        { status: 409, headers: { 'content-type': 'text/html' } }
      );
    }

    if (!result.user) {
      return new NextResponse(
        `<html><body style="font-family: sans-serif; padding: 40px; text-align: center;"><h2>Admin Account Not Found</h2></body></html>`,
        { status: 404, headers: { 'content-type': 'text/html' } }
      );
    }

    // Send Status Update Email to Applicant
    try {
      await sendAdminStatusUpdateEmail({
        adminEmail: result.user.email,
        adminName: result.user.name,
        status: 'APPROVED',
        approvedBy: performedBy,
      });
    } catch (e) {
      console.error('Error sending approval confirmation email:', e);
    }

    return new NextResponse(
      `
      <html>
        <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f0fdf4; padding: 50px; text-align: center;">
          <div style="max-width: 500px; margin: 0 auto; background: white; padding: 32px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #bbf7d0;">
            <h2 style="color: #16a34a; margin-top: 0;">✔ Admin Approved Successfully</h2>
            <p style="color: #334155; font-size: 15px; line-height: 1.6;">
              Admin account for <strong>${result.user.name}</strong> (${result.user.email}) has been approved and activated by <strong>${performedBy}</strong>.
            </p>
            <div style="margin-top: 24px;">
              <a href="/admin-dashboard" style="background: #16a34a; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px;">Go to Admin Dashboard</a>
            </div>
          </div>
        </body>
      </html>
      `,
      { status: 200, headers: { 'content-type': 'text/html' } }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Approval failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { adminId, approvedBy } = body;

    if (!adminId) {
      return NextResponse.json({ success: false, error: 'Admin ID is required' }, { status: 400 });
    }

    const result = await approveAdminRequest(adminId, approvedBy || 'Super Admin');

    if (result.alreadyProcessed) {
      return NextResponse.json({
        success: false,
        alreadyProcessed: true,
        message: 'This approval request has already been processed.',
        user: result.user,
      }, { status: 409 });
    }

    if (!result.user) {
      return NextResponse.json({ success: false, error: 'Admin account not found.' }, { status: 404 });
    }

    // Send confirmation email to applicant
    try {
      await sendAdminStatusUpdateEmail({
        adminEmail: result.user.email,
        adminName: result.user.name,
        status: 'APPROVED',
        approvedBy: approvedBy || 'Super Admin',
      });
    } catch (e) {
      console.error('Approval confirmation email exception:', e);
    }

    return NextResponse.json({
      success: true,
      message: `Admin account for ${result.user.name} has been approved successfully.`,
      user: result.user,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Approval failed' }, { status: 500 });
  }
}
