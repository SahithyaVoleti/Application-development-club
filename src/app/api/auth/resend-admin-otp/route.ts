import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/userStore';
import { adminOtpStore } from '@/lib/adminOtpStore';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await findUserByEmail(cleanEmail);

    if (!user) {
      return NextResponse.json({ success: false, error: 'User record not found.' }, { status: 404 });
    }

    // Generate fresh 6-digit OTP code & set 5-minute expiration
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    adminOtpStore.set(cleanEmail, { code: otpCode, expiresAt });

    const subject = `[Admin Security] Resent OTP Verification Code: ${otpCode}`;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
        <h2 style="color: #0f172a; margin-top: 0;">Resent Admin Registration OTP</h2>
        <p style="color: #475569; font-size: 14px;">Your new 6-digit OTP code for Admin Registration is:</p>
        <div style="background: #f0f9ff; border: 2px dashed #0284c7; padding: 18px; text-align: center; border-radius: 12px; margin: 20px 0;">
          <div style="font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #0369a1;">${otpCode}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Valid for 5 minutes</div>
        </div>
      </div>
    `;

    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: cleanEmail,
        subject,
        html: htmlContent,
      });
    } catch (e) {}

    console.log(`[RESEND OTP] Sent code ${otpCode} to ${cleanEmail}`);

    return NextResponse.json({
      success: true,
      message: `Fresh OTP code sent to ${cleanEmail}`,
      devOtp: otpCode,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
