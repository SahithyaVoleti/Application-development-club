import { getSuperAdminEmails } from '@/lib/userStore';
import { generateApprovalActionToken } from '@/lib/auth';
import { addNotificationLog } from '@/lib/notificationStore';

export interface EmailDeliveryReceipt {
  success: boolean;
  messageId?: string;
  provider?: string;
  sentAt?: string;
  error?: string;
}

interface SendOtpEmailOptions {
  toEmail: string;
  recipientName: string;
  otpCode: string;
  isResend?: boolean;
}

const BREVO_KEY = process.env.BREVO_API_KEY || process.env.BREVO_SMTP_KEY || '';
const SENDER_EMAIL = process.env.EMAIL_FROM || process.env.BREVO_SENDER_EMAIL || process.env.BREVO_ACCOUNT_EMAIL || 'sahithyalakshmivoleti@gmail.com';
const SENDER_NAME = process.env.EMAIL_FROM_NAME || process.env.BREVO_SENDER_NAME || 'Application Development Club';

/** Helper to dispatch email via SMTP (using env vars) or Brevo REST API v3 fallback */
async function dispatchEmail({
  toEmail,
  recipientName,
  subject,
  htmlContent,
  type = 'ADMIN_APPROVAL',
  relatedId,
}: {
  toEmail: string;
  recipientName: string;
  subject: string;
  htmlContent: string;
  type?: any;
  relatedId?: string;
}): Promise<{ success: boolean; provider?: string; error?: string }> {
  let outcome: { success: boolean; provider?: string; error?: string } = { success: false, error: 'No email service configured' };

  // 1. Attempt NodeMailer SMTP if SMTP env variables are provided
  if (typeof window === 'undefined') {
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;
    const smtpPort = Number(process.env.SMTP_PORT) || 587;

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const nodemailer = (await import('nodemailer')).default;
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 10000,
          tls: {
            rejectUnauthorized: false,
          },
        });

        const info = await transporter.sendMail({
          from: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
          to: toEmail,
          subject,
          html: htmlContent,
        });

        if (info.messageId) {
          console.log(`[SMTP SUCCESS] Email "${subject}" sent to ${toEmail} (ID: ${info.messageId})`);
          outcome = { success: true, provider: 'SMTP Transporter' };
        }
      } catch (err: any) {
        console.error('[SMTP Dispatch Exception]:', err?.message || err);
        outcome = { success: false, error: `SMTP Error: ${err?.message || 'Failed to send'}` };
      }
    }
  }

  // 2. Fallback: Brevo REST API v3
  if (!outcome.success) {
    if (BREVO_KEY) {
      try {
        const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-key': BREVO_KEY,
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            sender: { name: SENDER_NAME, email: SENDER_EMAIL },
            to: [{ email: toEmail, name: recipientName }],
            subject,
            htmlContent,
          }),
        });

        const brevoJson = await brevoRes.json();
        if (brevoRes.ok && (brevoJson.messageId || brevoJson.id)) {
          console.log(`[BREVO API SUCCESS] Email "${subject}" sent to ${toEmail}`);
          outcome = { success: true, provider: 'Brevo REST API v3' };
        } else {
          console.warn('[BREVO API Error]:', brevoJson);
          if (!outcome.provider) {
            outcome = { success: false, error: brevoJson?.message || 'Brevo API dispatch failed' };
          }
        }
      } catch (err: any) {
        console.warn('[BREVO REST API Exception]:', err?.message || err);
        if (!outcome.provider) {
          outcome = { success: false, error: err?.message || 'Brevo API error' };
        }
      }
    }
  }

  // Record notification log entry (Requirement 24)
  try {
    await addNotificationLog({
      recipient: toEmail,
      type: type || 'ADMIN_APPROVAL',
      subject,
      status: outcome.success ? 'SUCCESS' : 'FAILED',
      relatedId,
      metadata: { recipientName, provider: outcome.provider },
    });
  } catch (logErr) {
    console.error('Failed to save notification log entry:', logErr);
  }

  return outcome;
}

/** 1. Admin Registration Confirmation Email (Sent to new Admin applicant) */
export async function sendAdminRegistrationConfirmationToApplicant(data: {
  adminEmail: string;
  adminName: string;
  registeredAt?: string;
}): Promise<{ success: boolean; provider?: string; error?: string }> {
  const subject = '[Admin Registration] Request Received - Pending Approval';
  const registeredAtStr = data.registeredAt || new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #0f172a; margin: 0; font-size: 22px; font-weight: 800;">Application Development Club</h2>
        <p style="color: #64748b; font-size: 12px; margin-top: 4px; font-weight: bold; text-transform: uppercase;">Vignan University · CSE Dept</p>
      </div>

      <p style="color: #1e293b; font-size: 15px; font-weight: 600;">Hello ${data.adminName},</p>
      <p style="color: #475569; font-size: 14px; line-height: 1.6;">
        Thank you for registering as an Admin for the Application Development Club. Your account request has been received and is currently <strong>PENDING APPROVAL</strong> by the Super Admin team.
      </p>

      <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 14px; padding: 18px; margin: 20px 0;">
        <div style="font-size: 13px; font-weight: 800; color: #92400e; text-transform: uppercase; margin-bottom: 8px;">Registration Details</div>
        <p style="margin: 4px 0; font-size: 14px; color: #1e293b;"><strong>Applicant Name:</strong> ${data.adminName}</p>
        <p style="margin: 4px 0; font-size: 14px; color: #1e293b;"><strong>Registered Email:</strong> ${data.adminEmail}</p>
        <p style="margin: 4px 0; font-size: 14px; color: #1e293b;"><strong>Submitted Date:</strong> ${registeredAtStr}</p>
        <p style="margin: 4px 0; font-size: 14px; color: #d97706; font-weight: 800;"><strong>Status:</strong> Pending Approval</p>
      </div>

      <p style="color: #475569; font-size: 13px; line-height: 1.6;">
        You will receive an automated email notification as soon as a Super Admin reviews and approves your account. Access to the Admin Dashboard will be granted upon approval.
      </p>
    </div>
  `;

  return await dispatchEmail({
    toEmail: data.adminEmail,
    recipientName: data.adminName,
    subject,
    htmlContent,
  });
}

/** 2. Admin Approval Request Email (Sent independently to ALL 3 Super Admins) */
export async function sendAdminApprovalRequestToAllSuperAdmins(data: {
  adminId: string;
  adminName: string;
  adminEmail: string;
  adminPhone?: string;
  staffId?: string;
  department?: string;
  designation?: string;
  organization?: string;
  college?: string;
  registeredAt?: string;
  baseUrl?: string;
}): Promise<{ totalSent: number; errors: string[] }> {
  const superAdminEmails = getSuperAdminEmails();
  const registeredAtStr = data.registeredAt || new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  const appBaseUrl = data.baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4028';
  const orgName = data.organization || data.college || 'VFSTR / Vignan University';

  let totalSent = 0;
  const errors: string[] = [];

  const subject = `[Admin Approval Required] New Admin Applicant: ${data.adminName}`;

  // Loop over ALL 3 Super Admin emails independently so failure on one does not block others
  for (const superAdminEmail of superAdminEmails) {
    try {
      const approveToken = generateApprovalActionToken(
        data.adminId,
        data.adminEmail,
        'approve',
        superAdminEmail
      );
      const rejectToken = generateApprovalActionToken(
        data.adminId,
        data.adminEmail,
        'reject',
        superAdminEmail
      );

      const approveUrl = `${appBaseUrl}/api/auth/approve-admin?token=${encodeURIComponent(approveToken)}&adminId=${encodeURIComponent(data.adminId)}&email=${encodeURIComponent(data.adminEmail)}`;
      const rejectUrl = `${appBaseUrl}/api/auth/reject-admin?token=${encodeURIComponent(rejectToken)}&adminId=${encodeURIComponent(data.adminId)}&email=${encodeURIComponent(data.adminEmail)}`;

      const htmlContent = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff;">
          <div style="border-bottom: 2px solid #f1f5f9; padding-bottom: 16px; margin-bottom: 20px;">
            <h2 style="color: #0f172a; margin: 0; font-size: 20px; font-weight: 800;">Admin Registration Approval Request</h2>
            <p style="color: #64748b; font-size: 13px; margin-top: 4px; font-weight: 600;">Application Development Club · Super Admin Notification</p>
          </div>

          <p style="color: #334155; font-size: 14px; line-height: 1.6;">
            A new user has registered for an Admin account and requires your approval:
          </p>

          <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 14px; padding: 18px; margin: 20px 0;">
            <p style="margin: 6px 0; font-size: 14px; color: #0f172a;"><strong>Admin Name:</strong> ${data.adminName}</p>
            <p style="margin: 6px 0; font-size: 14px; color: #0f172a;"><strong>Email Address:</strong> ${data.adminEmail}</p>
            <p style="margin: 6px 0; font-size: 14px; color: #0f172a;"><strong>Phone Number:</strong> ${data.adminPhone || 'N/A'}</p>
            <p style="margin: 6px 0; font-size: 14px; color: #0f172a;"><strong>Organization / College:</strong> ${orgName}</p>
            <p style="margin: 6px 0; font-size: 14px; color: #0f172a;"><strong>Designation:</strong> ${data.designation || 'Faculty Coordinator'}</p>
            <p style="margin: 6px 0; font-size: 14px; color: #0f172a;"><strong>Faculty/Staff ID:</strong> ${data.staffId || 'N/A'}</p>
            <p style="margin: 6px 0; font-size: 14px; color: #0f172a;"><strong>Department:</strong> ${data.department || 'CSE'}</p>
            <p style="margin: 6px 0; font-size: 14px; color: #0f172a;"><strong>Registration Date:</strong> ${registeredAtStr}</p>
            <p style="margin: 6px 0; font-size: 14px; color: #d97706; font-weight: 800;"><strong>Current Status:</strong> Pending</p>
          </div>

          <div style="display: flex; gap: 12px; margin: 28px 0; justify-content: center;">
            <a href="${approveUrl}" style="background-color: #16a34a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-weight: 800; font-size: 14px; display: inline-block;">
              [ APPROVE ADMIN ]
            </a>
            <a href="${rejectUrl}" style="background-color: #dc2626; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-weight: 800; font-size: 14px; display: inline-block; margin-left: 10px;">
              [ REJECT ADMIN ]
            </a>
          </div>

          <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin-top: 20px; border-top: 1px solid #f1f5f9; padding-top: 14px;">
            Note: This approval link is single-action secured for <strong>${superAdminEmail}</strong>. If another Super Admin processes this request first, the status will automatically update cleanly.
          </p>
        </div>
      `;

      const res = await dispatchEmail({
        toEmail: superAdminEmail,
        recipientName: 'Super Admin',
        subject,
        htmlContent,
      });
      if (res.success) {
        totalSent++;
      } else if (res.error) {
        errors.push(`${superAdminEmail}: ${res.error}`);
      }
    } catch (err: any) {
      console.error(`[SUPER ADMIN EMAIL DELIVERY EXCEPTION] To ${superAdminEmail}:`, err?.message || err);
      errors.push(`${superAdminEmail}: ${err?.message || 'Delivery failed'}`);
    }
  }

  return { totalSent, errors };
}

/** Backward-compatible helper for Super Admin registration email dispatch */
export async function sendAdminRegistrationNotificationToSuperAdmin(data: {
  adminName: string;
  adminEmail: string;
  adminPhone?: string;
  registeredAt?: string;
}) {
  return sendAdminApprovalRequestToAllSuperAdmins({
    adminId: `user-admin-${Date.now()}`,
    adminName: data.adminName,
    adminEmail: data.adminEmail,
    adminPhone: data.adminPhone,
    registeredAt: data.registeredAt,
  });
}

/** 3. Admin Approval Confirmation / Rejection Status Update Email */
export async function sendAdminStatusUpdateEmail(data: {
  adminEmail: string;
  adminName: string;
  status: 'APPROVED' | 'REJECTED';
  reason?: string;
  approvedBy?: string;
}): Promise<{ success: boolean; provider?: string; error?: string }> {
  const isApproved = data.status === 'APPROVED';
  const subject = isApproved
    ? '[Admin Approved] Your Admin Account Has Been Approved!'
    : '[Admin Update] Your Admin Account Registration Status';

  const htmlContent = isApproved
    ? `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #16a34a; margin: 0; font-size: 22px; font-weight: 800;">Admin Account Approved! 🎉</h2>
          <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Application Development Club</p>
        </div>

        <p style="color: #1e293b; font-size: 15px; font-weight: 600;">Hello ${data.adminName},</p>
        <p style="color: #334155; font-size: 14px; line-height: 1.6;">
          Great news! Your Admin registration request has been reviewed and official approval has been granted by <strong>${data.approvedBy || 'Super Admin'}</strong>.
        </p>

        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 14px; padding: 18px; margin: 20px 0; text-align: center;">
          <div style="font-size: 16px; font-weight: 800; color: #15803d; margin-bottom: 6px;">Status: APPROVED</div>
          <p style="margin: 0; font-size: 13px; color: #166534;">You are now authorized to sign in, create events, and manage club operations.</p>
        </div>

        <p style="color: #475569; font-size: 14px; line-height: 1.6;">
          You can now visit the Admin Portal and log in with your email and password. A 6-digit OTP code will be sent to your email upon signing in.
        </p>
      </div>
    `
    : `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #dc2626; margin: 0; font-size: 22px; font-weight: 800;">Admin Registration Status Update</h2>
          <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Application Development Club</p>
        </div>

        <p style="color: #1e293b; font-size: 15px; font-weight: 600;">Hello ${data.adminName},</p>
        <p style="color: #334155; font-size: 14px; line-height: 1.6;">
          Your Admin registration request was reviewed by the Super Admin team. Regrettably, your account request was <strong>NOT APPROVED</strong> at this time.
        </p>

        ${
          data.reason
            ? `<div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 14px; padding: 16px; margin: 20px 0; color: #991b1b; font-size: 13px; font-weight: 600;">
                Reason: ${data.reason}
              </div>`
            : ''
        }

        <p style="color: #475569; font-size: 13px; line-height: 1.6;">
          If you believe this decision is in error or require further clarification, please contact the CSE Department executive board.
        </p>
      </div>
    `;

  return await dispatchEmail({
    toEmail: data.adminEmail,
    recipientName: data.adminName,
    subject,
    htmlContent,
  });
}

/** 4. Security Verification OTP Email (Sent during Admin & Super Admin Login) */
export async function sendOtpEmail({
  toEmail,
  recipientName,
  otpCode,
  isResend = false,
}: SendOtpEmailOptions): Promise<{ success: boolean; provider?: string; error?: string }> {
  const subject = `[Admin Security] ${isResend ? 'Resent ' : ''}Verification OTP Code: ${otpCode}`;
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #0f172a; margin: 0; font-size: 20px; font-weight: 800;">Application Development Club</h2>
        <p style="color: #64748b; font-size: 12px; margin-top: 4px; font-weight: bold; text-transform: uppercase;">VFSTR · CSE Department 2FA Security</p>
      </div>

      <p style="color: #334155; font-size: 14px; font-weight: 600;">Hello ${recipientName || 'Admin User'},</p>
      <p style="color: #475569; font-size: 14px; line-height: 1.5;">
        ${isResend ? 'Here is your fresh 6-digit verification code' : 'Your 6-digit Security Verification OTP code'} to complete your sign in to the Admin Dashboard:
      </p>

      <div style="background: #f0f9ff; border: 2px dashed #0284c7; padding: 20px; text-align: center; border-radius: 16px; margin: 24px 0;">
        <div style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #0369a1; font-family: monospace;">${otpCode}</div>
        <div style="font-size: 11px; color: #64748b; margin-top: 8px; font-weight: bold;">Valid for 5 minutes · Single Use Only</div>
      </div>

      <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin-top: 20px; border-top: 1px solid #f1f5f9; padding-top: 14px;">
        If you did not request this login attempt, please change your password immediately.
      </p>
    </div>
  `;

  console.log(`\n🔑 [SECURITY 2FA OTP] Sent to ${toEmail}: ${otpCode}\n`);
  return await dispatchEmail({ toEmail, recipientName, subject, htmlContent });
}

/** Confirmation receipt for event registration */
export async function sendRegistrationConfirmationEmail(
  registrationIdOrPayload: string | any,
  registrationData?: any,
  eventData?: any
): Promise<EmailDeliveryReceipt> {
  let regId = '';
  let registration: any = {};
  let event: any = {};

  if (typeof registrationIdOrPayload === 'string') {
    regId = registrationIdOrPayload;
    registration = registrationData || {};
    event = eventData || {};
  } else if (registrationIdOrPayload) {
    regId = registrationIdOrPayload.regId || registrationIdOrPayload.registrationId || '';
    registration = registrationIdOrPayload.registration || {};
    event = registrationIdOrPayload.event || {};
  }

  const toEmail = registration.email || registration.studentEmail || '';
  const recipientName = registration.fullName || registration.name || 'Student';
  const subject = `[Registration Confirmed] ${event.title || 'Event'} - Pass #${regId}`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <h2 style="color: #0f172a; margin-top: 0;">Event Registration Confirmed!</h2>
      <p style="color: #475569; font-size: 14px;">Hello ${recipientName},</p>
      <p style="color: #475569; font-size: 14px;">Your registration for <strong>${event.title || 'Event'}</strong> has been successfully confirmed.</p>
    </div>
  `;

  if (toEmail) {
    await dispatchEmail({ toEmail, recipientName, subject, htmlContent, type: 'STUDENT_REGISTRATION', relatedId: regId });
  }

  return {
    success: true,
    messageId: `msg-${Date.now()}`,
    provider: 'Email Service',
    sentAt: new Date().toISOString(),
  };
}

/** 5. Admin Added to Club / Organization Email Notification (Requirement 17) */
export async function sendClubAssignmentEmail(data: {
  adminEmail: string;
  adminName: string;
  clubName: string;
  assignedBy?: string;
  assignedAt?: string;
  baseUrl?: string;
}): Promise<{ success: boolean; provider?: string; error?: string }> {
  const appBaseUrl = data.baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4028';
  const loginUrl = `${appBaseUrl}/admin-dashboard`;
  const dateStr = data.assignedAt || new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  const assignedByStr = data.assignedBy || 'Super Admin';

  const subject = `[Club Admin] You have been added as an Admin to ${data.clubName}`;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff;">
      <div style="border-bottom: 2px solid #f1f5f9; padding-bottom: 16px; margin-bottom: 20px; text-align: center;">
        <h2 style="color: #0f172a; margin: 0; font-size: 22px; font-weight: 800;">Application Development Club</h2>
        <p style="color: #64748b; font-size: 12px; margin-top: 4px; font-weight: bold; text-transform: uppercase;">Vignan University · CSE Department</p>
      </div>

      <p style="color: #1e293b; font-size: 15px; font-weight: 600;">Hello ${data.adminName},</p>
      <p style="color: #334155; font-size: 14px; line-height: 1.6;">
        You have been successfully added as an Admin to <strong>${data.clubName}</strong> by the Super Admin.
      </p>

      <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 14px; padding: 18px; margin: 20px 0;">
        <div style="font-size: 12px; font-weight: 800; color: #0369a1; text-transform: uppercase; margin-bottom: 8px;">Assignment Overview</div>
        <p style="margin: 4px 0; font-size: 14px; color: #0f172a;"><strong>Admin Name:</strong> ${data.adminName}</p>
        <p style="margin: 4px 0; font-size: 14px; color: #0f172a;"><strong>Assigned Club:</strong> ${data.clubName}</p>
        <p style="margin: 4px 0; font-size: 14px; color: #0f172a;"><strong>Your Assigned Role:</strong> Admin</p>
        <p style="margin: 4px 0; font-size: 14px; color: #0f172a;"><strong>Added By:</strong> ${assignedByStr}</p>
        <p style="margin: 4px 0; font-size: 14px; color: #0f172a;"><strong>Date of Assignment:</strong> ${dateStr}</p>
      </div>

      <p style="color: #475569; font-size: 14px; line-height: 1.6;">
        You can now log in to the portal and manage the activities and events associated with <strong>${data.clubName}</strong>.
      </p>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${loginUrl}" style="background-color: #0284c7; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 12px; font-weight: 800; font-size: 14px; display: inline-block;">
          Go to Admin Portal / Login
        </a>
      </div>

      <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 14px;">
        Regards,<br/>
        <strong>Application Development Club Executive Board</strong><br/>
        Vignan University
      </p>
    </div>
  `;

  return await dispatchEmail({
    toEmail: data.adminEmail,
    recipientName: data.adminName,
    subject,
    htmlContent,
    type: 'CLUB_ASSIGNMENT',
  });
}

/** 5b. Super Admin Manually Added Admin Notification Email (Workflow B) */
export async function sendAdminAddedEmail(data: {
  adminEmail: string;
  adminName: string;
  clubName?: string;
  assignedBy?: string;
  assignedAt?: string;
  baseUrl?: string;
}): Promise<{ success: boolean; provider?: string; error?: string }> {
  const appBaseUrl = data.baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4028';
  const loginUrl = `${appBaseUrl}/admin-dashboard`;
  const dateStr = data.assignedAt || new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  const assignedByStr = data.assignedBy || 'Super Admin';
  const clubStr = data.clubName || 'Application Development Club';

  const subject = `You Have Been Added as an Admin`;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff;">
      <div style="border-bottom: 2px solid #f1f5f9; padding-bottom: 16px; margin-bottom: 20px; text-align: center;">
        <h2 style="color: #0f172a; margin: 0; font-size: 22px; font-weight: 800;">Application Development Club</h2>
        <p style="color: #64748b; font-size: 12px; margin-top: 4px; font-weight: bold; text-transform: uppercase;">Vignan University · CSE Department</p>
      </div>

      <p style="color: #1e293b; font-size: 15px; font-weight: 600;">Hello ${data.adminName},</p>
      <p style="color: #334155; font-size: 14px; line-height: 1.6;">
        You have been successfully added as an Admin to <strong>${clubStr}</strong> by the Super Admin.
      </p>

      <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 14px; padding: 18px; margin: 20px 0;">
        <div style="font-size: 12px; font-weight: 800; color: #0369a1; text-transform: uppercase; margin-bottom: 8px;">Account Details</div>
        <p style="margin: 4px 0; font-size: 14px; color: #0f172a;"><strong>Name:</strong> ${data.adminName}</p>
        <p style="margin: 4px 0; font-size: 14px; color: #0f172a;"><strong>Email:</strong> ${data.adminEmail}</p>
        <p style="margin: 4px 0; font-size: 14px; color: #0f172a;"><strong>Role:</strong> Admin</p>
        <p style="margin: 4px 0; font-size: 14px; color: #0f172a;"><strong>Club:</strong> ${clubStr}</p>
        <p style="margin: 4px 0; font-size: 14px; color: #0f172a;"><strong>Added By:</strong> ${assignedByStr}</p>
        <p style="margin: 4px 0; font-size: 14px; color: #0f172a;"><strong>Date:</strong> ${dateStr}</p>
      </div>

      <p style="color: #475569; font-size: 14px; line-height: 1.6;">
        You can now log in to the Admin Portal and manage the events and activities associated with your assigned club.
      </p>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${loginUrl}" style="background-color: #0284c7; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 12px; font-weight: 800; font-size: 14px; display: inline-block;">
          [ LOGIN TO ADMIN PORTAL ]
        </a>
      </div>

      <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 14px;">
        Regards,<br/>
        <strong>AppDevHub</strong><br/>
        Admin Management Team
      </p>
    </div>
  `;

  return await dispatchEmail({
    toEmail: data.adminEmail,
    recipientName: data.adminName,
    subject,
    htmlContent,
    type: 'ADMIN_ADDED',
  });
}

/** 6. Admin Removed from Club Notification (Requirement 20) */
export async function sendClubRemovalEmail(data: {
  adminEmail: string;
  adminName: string;
  clubName: string;
  removedBy?: string;
  removedAt?: string;
}): Promise<{ success: boolean; provider?: string; error?: string }> {
  const dateStr = data.removedAt || new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  const removedByStr = data.removedBy || 'Super Admin';

  const subject = `[Club Update] Admin assignment updated for ${data.clubName}`;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff;">
      <div style="border-bottom: 2px solid #f1f5f9; padding-bottom: 16px; margin-bottom: 20px; text-align: center;">
        <h2 style="color: #0f172a; margin: 0; font-size: 22px; font-weight: 800;">Application Development Club</h2>
        <p style="color: #64748b; font-size: 12px; margin-top: 4px; font-weight: bold; text-transform: uppercase;">Vignan University · CSE Department</p>
      </div>

      <p style="color: #1e293b; font-size: 15px; font-weight: 600;">Hello ${data.adminName},</p>
      <p style="color: #334155; font-size: 14px; line-height: 1.6;">
        This email is to inform you that your Admin assignment for <strong>${data.clubName}</strong> has concluded.
      </p>

      <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 14px; padding: 18px; margin: 20px 0;">
        <p style="margin: 4px 0; font-size: 14px; color: #991b1b;"><strong>Admin Name:</strong> ${data.adminName}</p>
        <p style="margin: 4px 0; font-size: 14px; color: #991b1b;"><strong>Club:</strong> ${data.clubName}</p>
        <p style="margin: 4px 0; font-size: 14px; color: #991b1b;"><strong>Action Performed By:</strong> ${removedByStr}</p>
        <p style="margin: 4px 0; font-size: 14px; color: #991b1b;"><strong>Date:</strong> ${dateStr}</p>
      </div>

      <p style="color: #475569; font-size: 13px; line-height: 1.6;">
        You will no longer have management permissions for events or data associated with ${data.clubName}. If you have questions regarding this update, please contact the Super Admin board.
      </p>
    </div>
  `;

  return await dispatchEmail({
    toEmail: data.adminEmail,
    recipientName: data.adminName,
    subject,
    htmlContent,
    type: 'CLUB_REMOVAL',
  });
}
