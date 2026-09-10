import { NextResponse } from 'next/server';
import { rejectAdminRequest, findUserById, findUserByEmail, isTokenUsed, markTokenAsUsed } from '@/lib/userStore';
import { sendAdminStatusUpdateEmail } from '@/lib/emailService';
import { verifyApprovalActionToken } from '@/lib/auth';

function renderAlreadyProcessedResponse(adminName?: string, adminEmail?: string, currentStatus?: string) {
  const isApproved = currentStatus === 'APPROVED' || currentStatus === 'ACTIVE' || currentStatus === 'TRUSTED_ADMIN';
  return new NextResponse(
    `
    <html>
      <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; padding: 50px; text-align: center;">
        <div style="max-width: 500px; margin: 0 auto; background: white; padding: 32px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
          <h2 style="color: ${isApproved ? '#0284c7' : '#d97706'}; margin-top: 0;">
            ${isApproved ? 'Admin Already Approved' : 'Request Already Processed'}
          </h2>
          <p style="color: #475569; font-size: 15px; line-height: 1.6;">
            ${
              isApproved
                ? 'This admin account has already been approved. No further action is required.'
                : 'This approval/rejection request has already been processed by a Super Admin.'
            }
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tokenParam = searchParams.get('token');
    const adminIdParam = searchParams.get('adminId');
    const emailParam = searchParams.get('email');
    const reason = searchParams.get('reason') || 'Verification details did not match CSE Faculty records.';

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
        return renderAlreadyProcessedResponse(existingUser?.name || payloadEmail, existingUser?.email || payloadEmail, existingUser?.status);
      }

      if (!tokenPayload) {
        if (targetId) {
          let u = (await findUserById(targetId)) || (await findUserByEmail(targetId));
          if (u && (u.status === 'APPROVED' || u.status === 'REJECTED' || u.status === 'ACTIVE' || u.status === 'TRUSTED_ADMIN')) {
            return renderAlreadyProcessedResponse(u.name, u.email, u.status);
          }
        }
        return new NextResponse(
          `
          <html>
            <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #fff1f2; padding: 50px; text-align: center;">
              <div style="max-width: 500px; margin: 0 auto; background: white; padding: 32px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #fecdd3;">
                <h2 style="color: #e11d48; margin-top: 0;">Invalid or Malformed Rejection Token</h2>
                <p style="color: #475569; font-size: 15px; line-height: 1.6;">
                  This link is invalid or has been corrupted. Please sign in to the Super Admin portal to process this request.
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
          if (u && (u.status === 'APPROVED' || u.status === 'REJECTED' || u.status === 'ACTIVE' || u.status === 'TRUSTED_ADMIN')) {
            markTokenAsUsed(tokenParam);
            return renderAlreadyProcessedResponse(u.name, u.email, u.status);
          }
        }
        return new NextResponse(
          `
          <html>
            <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #fffbeb; padding: 50px; text-align: center;">
              <div style="max-width: 500px; margin: 0 auto; background: white; padding: 32px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #fde68a;">
                <h2 style="color: #d97706; margin-top: 0;">Rejection Link Expired</h2>
                <p style="color: #475569; font-size: 15px; line-height: 1.6;">
                  This rejection link has expired. Please log in to the Super Admin Control Center to review and process this request.
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
      performedBy = tokenPayload.superAdminEmail ? `Super Admin (${tokenPayload.superAdminEmail})` : 'Super Admin (Email Link)';
    }

    if (!targetId) {
      return new NextResponse(
        `<html><body style="font-family: sans-serif; padding: 40px; text-align: center;"><h2>Invalid Request</h2><p>Missing Admin ID or Email parameters.</p></body></html>`,
        { status: 400, headers: { 'content-type': 'text/html' } }
      );
    }

    let existingUser = (await findUserById(targetId)) || (await findUserByEmail(targetId));
    if (existingUser && (existingUser.status === 'APPROVED' || existingUser.status === 'REJECTED' || existingUser.status === 'ACTIVE' || existingUser.status === 'TRUSTED_ADMIN')) {
      if (tokenParam) markTokenAsUsed(tokenParam);
      return renderAlreadyProcessedResponse(existingUser.name, existingUser.email, existingUser.status);
    }

    const result = await rejectAdminRequest(targetId, performedBy, reason);

    if (result.alreadyProcessed) {
      if (tokenParam) markTokenAsUsed(tokenParam);
      return renderAlreadyProcessedResponse(result.user?.name, result.user?.email, result.user?.status);
    }

    if (!result.user) {
      const altEmail = tokenPayload?.adminEmail || emailParam;
      if (altEmail) {
        const altUser = await findUserByEmail(altEmail);
        if (altUser && (altUser.status === 'APPROVED' || altUser.status === 'REJECTED' || altUser.status === 'ACTIVE' || altUser.status === 'TRUSTED_ADMIN')) {
          if (tokenParam) markTokenAsUsed(tokenParam);
          return renderAlreadyProcessedResponse(altUser.name, altUser.email, altUser.status);
        }
      }
      return new NextResponse(
        `<html><body style="font-family: sans-serif; padding: 40px; text-align: center;"><h2>Admin Account Not Found</h2></body></html>`,
        { status: 404, headers: { 'content-type': 'text/html' } }
      );
    }

    if (tokenParam) {
      markTokenAsUsed(tokenParam);
    }

    // Send Rejection Email to Applicant
    try {
      await sendAdminStatusUpdateEmail({
        adminEmail: result.user.email,
        adminName: result.user.name,
        status: 'REJECTED',
        reason,
      });
    } catch (e) {
      console.error('Error sending rejection update email:', e);
    }

    return new NextResponse(
      `
      <html>
        <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #fef2f2; padding: 50px; text-align: center;">
          <div style="max-width: 500px; margin: 0 auto; background: white; padding: 32px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #fecaca;">
            <h2 style="color: #dc2626; margin-top: 0;">✖ Admin Request Rejected</h2>
            <p style="color: #334155; font-size: 15px; line-height: 1.6;">
              Admin request for <strong>${result.user.name}</strong> (${result.user.email}) has been rejected by <strong>${performedBy}</strong>.
            </p>
            <div style="margin-top: 24px;">
              <a href="/admin-dashboard" style="background: #0f172a; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px;">Return to Dashboard</a>
            </div>
          </div>
        </body>
      </html>
      `,
      { status: 200, headers: { 'content-type': 'text/html' } }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Rejection failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { adminId, rejectedBy, reason, token } = body;

    if (!adminId) {
      return NextResponse.json({ success: false, error: 'Admin ID is required' }, { status: 400 });
    }

    const existingUser = (await findUserById(adminId)) || (await findUserByEmail(adminId));
    if (existingUser && (existingUser.status === 'APPROVED' || existingUser.status === 'REJECTED' || existingUser.status === 'ACTIVE' || existingUser.status === 'TRUSTED_ADMIN')) {
      if (token) markTokenAsUsed(token);
      return NextResponse.json({
        success: true,
        alreadyProcessed: true,
        message: 'This approval request has already been processed.',
        user: existingUser,
      });
    }

    const result = await rejectAdminRequest(
      adminId,
      rejectedBy || 'Super Admin',
      reason || 'Verification details did not match CSE Faculty records.'
    );

    if (token) {
      markTokenAsUsed(token);
    }

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

    // Send rejection email
    try {
      await sendAdminStatusUpdateEmail({
        adminEmail: result.user.email,
        adminName: result.user.name,
        status: 'REJECTED',
        reason: reason || 'Verification details did not match CSE Faculty records.',
      });
    } catch (e) {
      console.error('Rejection email exception:', e);
    }

    return NextResponse.json({
      success: true,
      message: `Admin account for ${result.user.name} has been rejected.`,
      user: result.user,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Rejection failed' }, { status: 500 });
  }
}
