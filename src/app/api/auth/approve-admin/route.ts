import { NextResponse } from 'next/server';
import {
  approveAdminRequest,
  findUserById,
  findUserByEmail,
  isTokenUsed,
  markTokenAsUsed,
} from '@/lib/userStore';
import { sendAdminStatusUpdateEmail } from '@/lib/emailService';
import { verifyApprovalActionToken } from '@/lib/auth';

function renderAlreadyApprovedResponse(adminName?: string, adminEmail?: string) {
  return new NextResponse(
    `
    <html>
      <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; padding: 50px; text-align: center;">
        <div style="max-width: 500px; margin: 0 auto; background: white; padding: 32px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
          <h2 style="color: #0284c7; margin-top: 0;">Admin Already Approved</h2>
          <p style="color: #475569; font-size: 15px; line-height: 1.6;">
            This admin account has already been approved. No further action is required.
          </p>
          ${
            adminEmail || adminName
              ? `<div style="margin-top: 16px; padding: 12px; background-color: #f1f5f9; border-radius: 10px; font-size: 14px; color: #334155;">
                  ${adminName ? `<strong>${adminName}</strong> ` : ''}${adminEmail ? `(${adminEmail})` : ''}
                </div>`
              : ''
          }
          <div style="margin-top: 24px;">
            <a href="/admin-dashboard" style="background: #0f172a; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px;">Open Super Admin Portal</a>
          </div>
        </div>
      </body>
    </html>
    `,
    { status: 200, headers: { 'content-type': 'text/html' } }
  );
}

function renderSuccessResponse(adminName: string, adminEmail: string, approvedBy: string) {
  return new NextResponse(
    `
    <html>
      <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f0fdf4; padding: 50px; text-align: center;">
        <div style="max-width: 500px; margin: 0 auto; background: white; padding: 32px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #bbf7d0;">
          <h2 style="color: #16a34a; margin-top: 0;">✔ Admin Approved Successfully</h2>
          <p style="color: #334155; font-size: 15px; line-height: 1.6;">
            This admin account has been approved and can now sign in.
          </p>
          <div style="margin-top: 16px; padding: 12px; background-color: #f0fdf4; border-radius: 10px; font-size: 14px; color: #166534;">
            <strong>${adminName}</strong> (${adminEmail})<br/>
            <span style="font-size: 12px; color: #15803d;">Approved by ${approvedBy}</span>
          </div>
          <div style="margin-top: 24px;">
            <a href="/admin-dashboard" style="background: #16a34a; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px;">Go to Admin Dashboard</a>
          </div>
        </div>
      </body>
    </html>
    `,
    { status: 200, headers: { 'content-type': 'text/html' } }
  );
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tokenParam = searchParams.get('token');
    const adminIdParam = searchParams.get('adminId');
    const emailParam = searchParams.get('email');

    let targetId = adminIdParam || emailParam || '';
    let performedBy = 'Super Admin (Email Link)';
    let tokenPayload: any = null;

    if (tokenParam) {
      tokenPayload = verifyApprovalActionToken(tokenParam);

      if (isTokenUsed(tokenParam)) {
        const payloadEmail = tokenPayload?.adminEmail || emailParam;
        const payloadId = tokenPayload?.adminId || adminIdParam;
        let existingUser = null;
        if (payloadId) existingUser = await findUserById(payloadId);
        if (!existingUser && payloadEmail) existingUser = await findUserByEmail(payloadEmail);
        return renderAlreadyApprovedResponse(existingUser?.name || payloadEmail, existingUser?.email || payloadEmail);
      }

      if (!tokenPayload) {
        // Fallback: Check if target admin is already approved even with malformed token link
        if (targetId) {
          let u = (await findUserById(targetId)) || (await findUserByEmail(targetId));
          if (u && (u.status === 'APPROVED' || u.status === 'ACTIVE' || u.status === 'TRUSTED_ADMIN')) {
            return renderAlreadyApprovedResponse(u.name, u.email);
          }
        }
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

      if (tokenPayload.isExpired) {
        if (targetId || tokenPayload.adminId || tokenPayload.adminEmail) {
          const checkId = tokenPayload.adminId || targetId;
          const checkEmail = tokenPayload.adminEmail || emailParam;
          let u = null;
          if (checkId) u = await findUserById(checkId);
          if (!u && checkEmail) u = await findUserByEmail(checkEmail);
          if (u && (u.status === 'APPROVED' || u.status === 'ACTIVE' || u.status === 'TRUSTED_ADMIN')) {
            markTokenAsUsed(tokenParam);
            return renderAlreadyApprovedResponse(u.name, u.email);
          }
        }
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

      targetId = tokenPayload.adminId || tokenPayload.adminEmail || targetId;
      performedBy = tokenPayload.superAdminEmail
        ? `Super Admin (${tokenPayload.superAdminEmail})`
        : 'Super Admin (Email Link)';
    }

    if (!targetId) {
      return new NextResponse(
        `<html><body style="font-family: sans-serif; padding: 40px; text-align: center;"><h2>Invalid Request</h2><p>Missing Admin ID or Email parameters.</p></body></html>`,
        { status: 400, headers: { 'content-type': 'text/html' } }
      );
    }

    // Check if target user is already approved prior to processing
    let existingUser = (await findUserById(targetId)) || (await findUserByEmail(targetId));
    if (existingUser && (existingUser.status === 'APPROVED' || existingUser.status === 'ACTIVE' || existingUser.status === 'TRUSTED_ADMIN')) {
      if (tokenParam) markTokenAsUsed(tokenParam);
      return renderAlreadyApprovedResponse(existingUser.name, existingUser.email);
    }

    const result = await approveAdminRequest(targetId, performedBy);

    if (result.alreadyProcessed) {
      if (tokenParam) markTokenAsUsed(tokenParam);
      return renderAlreadyApprovedResponse(result.user?.name, result.user?.email);
    }

    if (!result.user) {
      // Secondary check: search by token payload email if targetId failed
      const altEmail = tokenPayload?.adminEmail || emailParam;
      if (altEmail) {
        const altUser = await findUserByEmail(altEmail);
        if (altUser && (altUser.status === 'APPROVED' || altUser.status === 'ACTIVE' || altUser.status === 'TRUSTED_ADMIN')) {
          if (tokenParam) markTokenAsUsed(tokenParam);
          return renderAlreadyApprovedResponse(altUser.name, altUser.email);
        }
      }
      return new NextResponse(
        `<html><body style="font-family: sans-serif; padding: 40px; text-align: center;"><h2>Admin Account Not Found</h2></body></html>`,
        { status: 404, headers: { 'content-type': 'text/html' } }
      );
    }

    // Mark token as consumed on first successful approval
    if (tokenParam) {
      markTokenAsUsed(tokenParam);
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

    return renderSuccessResponse(result.user.name, result.user.email, performedBy);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Approval failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { adminId, approvedBy, token } = body;

    if (!adminId) {
      return NextResponse.json({ success: false, error: 'Admin ID is required' }, { status: 400 });
    }

    const existingUser = (await findUserById(adminId)) || (await findUserByEmail(adminId));
    if (existingUser && (existingUser.status === 'APPROVED' || existingUser.status === 'ACTIVE' || existingUser.status === 'TRUSTED_ADMIN')) {
      if (token) markTokenAsUsed(token);
      return NextResponse.json({
        success: true,
        alreadyProcessed: true,
        message: 'This admin account has already been approved.',
        user: existingUser,
      });
    }

    const result = await approveAdminRequest(adminId, approvedBy || 'Super Admin');

    if (token) {
      markTokenAsUsed(token);
    }

    if (result.alreadyProcessed) {
      return NextResponse.json({
        success: true,
        alreadyProcessed: true,
        message: 'This admin account has already been approved.',
        user: result.user,
      });
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
