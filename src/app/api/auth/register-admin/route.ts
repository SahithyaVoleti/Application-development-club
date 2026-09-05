import { NextResponse } from 'next/server';
import { findUserByEmail, findUserByStaffId, createUser, updateUser } from '@/lib/userStore';
import { hashPassword } from '@/lib/auth';
import { adminOtpStore } from '@/lib/adminOtpStore';
import { sendOtpEmail } from '@/lib/emailService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, staffId, department, password, confirmPassword } = body;

    // 1. Required fields validation
    if (!name || !email || !phone || !staffId || !department || !password) {
      return NextResponse.json(
        { success: false, error: 'All fields (Name, Email, Phone, Staff ID, Department, Password) are required.' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Passwords do not match. Please verify and re-enter.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanStaffId = staffId.toUpperCase().trim();
    const hashedPassword = hashPassword(password);

    // 2. Check existing user registration
    const existingEmailUser = await findUserByEmail(cleanEmail);
    if (existingEmailUser) {
      if (existingEmailUser.role === 'SUPER_ADMIN') {
        return NextResponse.json(
          { success: false, error: 'Super Admin account is already active.' },
          { status: 409 }
        );
      }
      if (existingEmailUser.role === 'ADMIN') {
        if (existingEmailUser.status === 'TRUSTED_ADMIN') {
          return NextResponse.json(
            { success: false, error: 'This Admin account is already active and approved. Please sign in directly.' },
            { status: 409 }
          );
        }
        if (existingEmailUser.status === 'PENDING_APPROVAL') {
          return NextResponse.json(
            { success: false, error: 'Your Admin registration has been verified and is pending Super Admin approval.' },
            { status: 409 }
          );
        }
      }
    }

    // 3. Prevent duplicate Staff / Faculty ID registration for other users
    const existingStaffUser = await findUserByStaffId(cleanStaffId);
    if (existingStaffUser && existingStaffUser.email.toLowerCase() !== cleanEmail) {
      return NextResponse.json(
        { success: false, error: `Faculty/Staff ID "${cleanStaffId}" is already registered to another user.` },
        { status: 409 }
      );
    }

    // 4. Create or Update Admin Account in PENDING_OTP status (NOT TRUSTED_ADMIN)
    if (existingEmailUser) {
      await updateUser(existingEmailUser.id, {
        name: name.trim(),
        phone: phone.trim(),
        staffId: cleanStaffId,
        department: department.trim(),
        passwordHash: hashedPassword,
        role: 'ADMIN',
        status: 'PENDING_OTP',
        otpVerified: false,
      });
    } else {
      await createUser({
        name: name.trim(),
        email: cleanEmail,
        phone: phone.trim(),
        staffId: cleanStaffId,
        department: department.trim(),
        passwordHash: hashedPassword,
        role: 'ADMIN',
        status: 'PENDING_OTP',
        otpVerified: false,
      });
    }

    // 5. Generate secure 6-digit OTP code & set 5-minute expiration
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    adminOtpStore.set(cleanEmail, { code: otpCode, expiresAt });

    // 6. Dispatch Email Notification via Brevo/SMTP/Resend
    const sendResult = await sendOtpEmail({
      toEmail: cleanEmail,
      recipientName: name.trim(),
      otpCode,
      isResend: false,
    });

    return NextResponse.json({
      success: true,
      email: cleanEmail,
      message: `OTP verification code sent to ${cleanEmail}`,
      emailSent: sendResult.success,
      provider: sendResult.provider,
    });
  } catch (error: any) {
    console.error('Admin Registration API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Admin registration failed' },
      { status: 500 }
    );
  }
}
