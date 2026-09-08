import { NextResponse } from 'next/server';
import { findUserByEmail, findUserByStaffId, createUser } from '@/lib/userStore';
import { hashPassword } from '@/lib/auth';
import { sendAdminRegistrationNotificationToSuperAdmin } from '@/lib/emailService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, staffId, department, password } = body;

    // 1. Required fields validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Full Name, Email Address, and Password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanStaffId = staffId ? staffId.toUpperCase().trim() : undefined;
    const hashedPassword = hashPassword(password);

    // 2. Check existing user registration
    const existingEmailUser = await findUserByEmail(cleanEmail);
    if (existingEmailUser) {
      if (existingEmailUser.status === 'APPROVED' || existingEmailUser.status === 'TRUSTED_ADMIN') {
        return NextResponse.json(
          { success: false, message: 'This Admin account is already active and approved. Please sign in directly.' },
          { status: 409 }
        );
      }
      if (existingEmailUser.status === 'PENDING' || existingEmailUser.status === 'PENDING_APPROVAL') {
        return NextResponse.json(
          { success: false, message: 'Your Admin registration has been submitted and is pending Super Admin approval.' },
          { status: 409 }
        );
      }
      if (existingEmailUser.status === 'REJECTED') {
        return NextResponse.json(
          { success: false, message: 'Your previous Admin registration request was rejected by Super Admin.' },
          { status: 403 }
        );
      }
    }

    if (cleanStaffId) {
      const existingStaffUser = await findUserByStaffId(cleanStaffId);
      if (existingStaffUser && existingStaffUser.email.toLowerCase() !== cleanEmail) {
        return NextResponse.json(
          { success: false, message: `Staff ID "${cleanStaffId}" is already registered to another user.` },
          { status: 409 }
        );
      }
    }

    // 3. Create Admin user record in database with role = ADMIN, status = PENDING
    const registeredAt = new Date().toISOString();
    const newAdmin = await createUser({
      name: name.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : undefined,
      staffId: cleanStaffId,
      department: department ? department.trim() : 'CSE',
      passwordHash: hashedPassword,
      role: 'ADMIN',
      status: 'PENDING',
      otpVerified: true,
    });

    // 4. Send Brevo Email Notification to Super Admin (failsafe: logs error if email fails without failing registration)
    try {
      await sendAdminRegistrationNotificationToSuperAdmin({
        adminName: newAdmin.name,
        adminEmail: newAdmin.email,
        adminPhone: newAdmin.phone,
        registeredAt,
      });
    } catch (emailErr) {
      console.error('[BREVO EMAIL NOTIFICATION ERROR]:', emailErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Admin account registered successfully! Awaiting Super Admin review and approval.',
      admin: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        status: newAdmin.status,
        createdAt: newAdmin.createdAt,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error('Admin Register API Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Admin registration failed.' },
      { status: 500 }
    );
  }
}
