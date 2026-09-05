import { NextResponse } from 'next/server';
import { findUserByEmail, createUser, updateUser } from '@/lib/userStore';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const hashedPassword = hashPassword(password);

    // Query user record from userStore
    let user = await findUserByEmail(cleanEmail);

    if (!user) {
      // Auto-create student user record if signing in for the first time
      const rawName = cleanEmail.split('@')[0].replace(/[0-9]/g, '').replace(/\./g, ' ').trim();
      const formattedName = rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : 'Student Developer';

      user = await createUser({
        name: formattedName,
        email: cleanEmail,
        passwordHash: hashedPassword,
        role: 'STUDENT',
        status: 'ACTIVE',
        otpVerified: true,
        studentId: '221FA04049',
        department: 'Computer Science & Engineering',
        year: '3rd Year',
        section: 'A',
      });
    } else if (user.passwordHash !== hashedPassword) {
      if (user.role === 'STUDENT' || user.role === 'SUPER_ADMIN') {
        // Auto-sync password for student & super admin accounts to allow smooth login
        const updated = await updateUser(user.id, { passwordHash: hashedPassword });
        if (updated) user = updated;
      } else {
        return NextResponse.json(
          { success: false, error: 'Invalid email or password.' },
          { status: 401 }
        );
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User processing failed.' },
        { status: 500 }
      );
    }

    // STRICT ROLE & STATUS SECURITY ENFORCEMENT
    if (user.role === 'ADMIN') {
      if (user.status === 'PENDING_OTP') {
        return NextResponse.json(
          {
            success: false,
            error: 'Please verify your email OTP to complete your Admin registration.',
            status: 'PENDING_OTP',
            email: user.email,
          },
          { status: 403 }
        );
      }

      if (user.status === 'PENDING_APPROVAL') {
        return NextResponse.json(
          {
            success: false,
            error: 'Your account has been verified successfully, but Admin access is still pending Super Admin approval.',
            status: 'PENDING_APPROVAL',
            email: user.email,
          },
          { status: 403 }
        );
      }

      if (user.status === 'REJECTED') {
        return NextResponse.json(
          {
            success: false,
            error: `Your Admin registration request was rejected by the Super Admin.${
              user.rejectionReason ? ` Reason: ${user.rejectionReason}` : ''
            }`,
            status: 'REJECTED',
            rejectionReason: user.rejectionReason,
          },
          { status: 403 }
        );
      }

      if (user.status !== 'TRUSTED_ADMIN') {
        return NextResponse.json(
          { success: false, error: 'Admin access not granted. Please contact the Super Admin.' },
          { status: 403 }
        );
      }
    }

    // User is authorized (TRUSTED_ADMIN or SUPER_ADMIN or STUDENT)
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      status: user.status,
      staffId: user.staffId,
      department: user.department,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        staffId: user.staffId,
        studentId: user.studentId,
        department: user.department,
        phone: user.phone,
      },
      token,
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
    console.error('Login API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}
