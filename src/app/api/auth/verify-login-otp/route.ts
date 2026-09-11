import { NextResponse } from 'next/server';
import { findUserByEmail, updateUser } from '@/lib/userStore';
import { isSuperAdminEmail } from '@/lib/constants';
import { verifyLoginOtp } from '@/lib/otpStore';
import { generateToken } from '@/lib/auth';

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
        { success: false, error: 'Account not found.' },
        { status: 404 }
      );
    }

    // Verify OTP using otpStore
    const verifyResult = verifyLoginOtp(cleanEmail, submittedOtp);

    if (!verifyResult.success) {
      return NextResponse.json(
        { success: false, error: verifyResult.error || 'Invalid or expired OTP code.' },
        { status: 400 }
      );
    }

    // OTP Verified! Check Super Admin status & generate authenticated token
    const isSuper = isSuperAdminEmail(cleanEmail);
    const effectiveRole = isSuper ? 'SUPER_ADMIN' : (user.role === 'SUPER_ADMIN' ? 'ADMIN' : user.role);
    const effectiveStatus = isSuper ? 'APPROVED' : user.status;

    await updateUser(user.id, {
      otpVerified: true,
      ...(isSuper && { role: 'SUPER_ADMIN', status: 'APPROVED' }),
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: effectiveRole,
      name: user.name,
      status: effectiveStatus,
      staffId: user.staffId,
      department: user.department,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: effectiveRole,
        status: effectiveStatus,
        staffId: user.staffId,
        studentId: user.studentId,
        department: user.department,
        phone: user.phone,
      },
      token,
      redirectTo: '/admin-dashboard',
      message: 'OTP Security Verification Successful! Access Granted.',
    });

    response.cookies.set('adhub_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Verify Login OTP Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'OTP verification failed' },
      { status: 500 }
    );
  }
}
