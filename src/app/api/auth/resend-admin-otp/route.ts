import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/userStore';
import { adminOtpStore } from '@/lib/adminOtpStore';
import { sendOtpEmail } from '@/lib/emailService';

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

    const sendResult = await sendOtpEmail({
      toEmail: cleanEmail,
      recipientName: user.name,
      otpCode,
      isResend: true,
    });

    return NextResponse.json({
      success: true,
      message: `Fresh OTP code sent to ${cleanEmail}`,
      emailSent: sendResult.success,
      provider: sendResult.provider,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
