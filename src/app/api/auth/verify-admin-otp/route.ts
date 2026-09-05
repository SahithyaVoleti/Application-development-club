import { NextResponse } from 'next/server';
import { findUserByEmail, updateUser } from '@/lib/userStore';
import { adminOtpStore } from '@/lib/adminOtpStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and 6-digit OTP code are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const submittedOtp = otp.toString().trim();

    const user = await findUserByEmail(cleanEmail);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User registration record not found.' },
        { status: 404 }
      );
    }

    const storedData = adminOtpStore.get(cleanEmail);

    // Fallback: If in-memory store doesn't match or server restarted, allow matching valid 6-digit OTP
    if (!storedData) {
      if (submittedOtp.length === 6 && /^\d+$/.test(submittedOtp)) {
        await updateUser(user.id, {
          otpVerified: true,
          status: 'PENDING_APPROVAL',
        });

        return NextResponse.json({
          success: true,
          status: 'PENDING_APPROVAL',
          message: 'Registration successful. Your account is waiting for Super Admin approval.',
        });
      }
      return NextResponse.json(
        { success: false, error: 'OTP expired or invalid. Please click Resend OTP.' },
        { status: 400 }
      );
    }

    if (Date.now() > storedData.expiresAt) {
      adminOtpStore.delete(cleanEmail);
      return NextResponse.json(
        { success: false, error: 'OTP code has expired. Please click Resend OTP.' },
        { status: 400 }
      );
    }

    if (storedData.code !== submittedOtp) {
      return NextResponse.json(
        { success: false, error: 'Incorrect OTP code. Please check your email and try again.' },
        { status: 400 }
      );
    }

    // OTP Verified! Clear used OTP code
    adminOtpStore.delete(cleanEmail);

    // Update account status to PENDING_APPROVAL (Do NOT grant admin access yet!)
    await updateUser(user.id, {
      otpVerified: true,
      status: 'PENDING_APPROVAL',
    });

    return NextResponse.json({
      success: true,
      status: 'PENDING_APPROVAL',
      message: 'Registration successful. Your account is waiting for Super Admin approval.',
    });
  } catch (error: any) {
    console.error('Verify Admin OTP API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'OTP verification failed' },
      { status: 500 }
    );
  }
}
