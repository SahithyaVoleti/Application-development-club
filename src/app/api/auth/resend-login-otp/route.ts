import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/userStore';
import { createLoginOtp, getResendCooldownSeconds } from '@/lib/otpStore';
import { sendOtpEmail } from '@/lib/emailService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email address is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await findUserByEmail(cleanEmail);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Account not found.' },
        { status: 404 }
      );
    }

    const cooldownRemaining = getResendCooldownSeconds(cleanEmail);
    if (cooldownRemaining > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Please wait ${cooldownRemaining} second(s) before requesting a new OTP code.`,
          cooldownRemaining,
        },
        { status: 429 }
      );
    }

    const otpResult = createLoginOtp(cleanEmail);
    if (otpResult.code) {
      await sendOtpEmail({
        toEmail: cleanEmail,
        recipientName: user.name,
        otpCode: otpResult.code,
        isResend: true,
      });
    }

    return NextResponse.json({
      success: true,
      email: cleanEmail,
      message: `Fresh 6-digit OTP code dispatched to ${cleanEmail}`,
    });
  } catch (error: any) {
    console.error('Resend Login OTP Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to resend OTP' },
      { status: 500 }
    );
  }
}
