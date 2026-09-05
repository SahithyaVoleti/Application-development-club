import { NextResponse } from 'next/server';
import { adminOtpStore } from '@/lib/adminOtpStore';
import { sendOtpEmail } from '@/lib/emailService';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const targetEmail = body.email || process.env.ADMIN_EMAIL || '221fa04049@gmail.com';

    // Generate secure 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

    adminOtpStore.set(targetEmail.toLowerCase(), { code: otpCode, expiresAt });

    const sendResult = await sendOtpEmail({
      toEmail: targetEmail,
      recipientName: 'Admin',
      otpCode,
      isResend: false,
    });

    console.log(`[ADMIN OTP DISPATCH] Sent OTP: ${otpCode} to ${targetEmail} (Success: ${sendResult.success})`);

    return NextResponse.json({
      success: true,
      email: targetEmail,
      emailSent: sendResult.success,
      provider: sendResult.provider,
      message: `OTP code dispatched to ${targetEmail}`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
