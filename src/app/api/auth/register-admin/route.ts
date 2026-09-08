import { NextResponse } from 'next/server';
import { findUserByEmail, findUserByStaffId, createUser, updateUser } from '@/lib/userStore';
import { hashPassword } from '@/lib/auth';
import {
  sendAdminRegistrationConfirmationToApplicant,
  sendAdminApprovalRequestToAllSuperAdmins,
} from '@/lib/emailService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, staffId, department, designation, organization, college, password, confirmPassword } = body;
    const cleanDesignation = designation ? designation.trim() : 'Faculty Coordinator';
    const cleanOrganization = (organization || college || 'VFSTR / Vignan University').trim();

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
        if (existingEmailUser.status === 'APPROVED' || existingEmailUser.status === 'TRUSTED_ADMIN') {
          return NextResponse.json(
            { success: false, error: 'This Admin account is already active and approved. Please sign in directly.' },
            { status: 409 }
          );
        }
        if (existingEmailUser.status === 'PENDING_APPROVAL' || existingEmailUser.status === 'PENDING') {
          return NextResponse.json(
            { success: false, error: 'Your Admin registration is already submitted and pending Super Admin approval.' },
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

    let adminUser;
    // 4. Create or Update Admin Account in PENDING_APPROVAL status
    if (existingEmailUser) {
      adminUser = await updateUser(existingEmailUser.id, {
        name: name.trim(),
        phone: phone.trim(),
        staffId: cleanStaffId,
        department: department.trim(),
        designation: cleanDesignation,
        organization: cleanOrganization,
        college: cleanOrganization,
        passwordHash: hashedPassword,
        role: 'ADMIN',
        status: 'PENDING_APPROVAL',
        otpVerified: false,
      });
    } else {
      adminUser = await createUser({
        name: name.trim(),
        email: cleanEmail,
        phone: phone.trim(),
        staffId: cleanStaffId,
        department: department.trim(),
        designation: cleanDesignation,
        organization: cleanOrganization,
        college: cleanOrganization,
        passwordHash: hashedPassword,
        role: 'ADMIN',
        status: 'PENDING_APPROVAL',
        otpVerified: false,
      });
    }

    const host = request.headers.get('host') || 'localhost:4028';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // 5. Send registration confirmation email to applicant
    await sendAdminRegistrationConfirmationToApplicant({
      adminEmail: cleanEmail,
      adminName: name.trim(),
      registeredAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
    });

    // 6. Send Admin Approval Request to ALL 3 Super Admin emails independently
    const superAdminDispatchResult = await sendAdminApprovalRequestToAllSuperAdmins({
      adminId: adminUser?.id || `user-admin-${Date.now()}`,
      adminName: name.trim(),
      adminEmail: cleanEmail,
      adminPhone: phone.trim(),
      staffId: cleanStaffId,
      department: department.trim(),
      designation: cleanDesignation,
      organization: cleanOrganization,
      college: cleanOrganization,
      registeredAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
      baseUrl,
    });

    return NextResponse.json({
      success: true,
      email: cleanEmail,
      status: 'PENDING_APPROVAL',
      message: 'Registration submitted successfully. Your request is waiting for Super Admin approval.',
      superAdminNotificationsSent: superAdminDispatchResult.totalSent,
    });
  } catch (error: any) {
    console.error('Admin Registration API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Admin registration failed' },
      { status: 500 }
    );
  }
}
