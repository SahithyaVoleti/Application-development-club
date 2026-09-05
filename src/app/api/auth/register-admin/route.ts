import { NextResponse } from 'next/server';
import { findUserByEmail, findUserByStaffId, createUser } from '@/lib/userStore';
import { hashPassword } from '@/lib/auth';
import { adminOtpStore } from '@/lib/adminOtpStore';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');

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

    // 2. Prevent duplicate email registration
    const existingEmailUser = await findUserByEmail(cleanEmail);
    if (existingEmailUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email address already exists.' },
        { status: 409 }
      );
    }

    // 3. Prevent duplicate Staff / Faculty ID registration
    const existingStaffUser = await findUserByStaffId(cleanStaffId);
    if (existingStaffUser) {
      return NextResponse.json(
        { success: false, error: `Faculty/Staff ID "${cleanStaffId}" is already registered.` },
        { status: 409 }
      );
    }

    // 4. Create Admin Account in PENDING_OTP status (NOT TRUSTED_ADMIN)
    const hashedPassword = hashPassword(password);
    const newUser = await createUser({
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

    // 5. Generate secure 6-digit OTP code & set 5-minute expiration
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    adminOtpStore.set(cleanEmail, { code: otpCode, expiresAt });

    // 6. Dispatch Email Notification
    const subject = `[Admin Security] Your Verification OTP Code: ${otpCode}`;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
        <h2 style="color: #0f172a; margin-top: 0;">Admin Account Registration OTP</h2>
        <p style="color: #475569; font-size: 14px;">Hello ${name},</p>
        <p style="color: #475569; font-size: 14px;">Use the verification code below to verify your email address for your Application Development Club Admin Registration:</p>
        <div style="background: #f0f9ff; border: 2px dashed #0284c7; padding: 18px; text-align: center; border-radius: 12px; margin: 20px 0;">
          <div style="font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #0369a1;">${otpCode}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Valid for 5 minutes</div>
        </div>
        <p style="font-size: 12px; color: #94a3b8;">After OTP verification, your account will be sent to the Super Admin for approval.</p>
      </div>
    `;

    let emailSent = false;
    try {
      const sendRes = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: cleanEmail,
        subject,
        html: htmlContent,
      });
      if (sendRes.data?.id) emailSent = true;
    } catch (e) {
      console.warn('Resend email error:', e);
    }

    console.log(`[ADMIN REGISTRATION OTP] Sent code ${otpCode} to ${cleanEmail}`);

    return NextResponse.json({
      success: true,
      email: cleanEmail,
      message: `OTP verification code dispatched to ${cleanEmail}`,
      emailSent,
      devOtp: otpCode, // Provided for easy development testing
    });
  } catch (error: any) {
    console.error('Admin Registration API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Admin registration failed' },
      { status: 500 }
    );
  }
}
