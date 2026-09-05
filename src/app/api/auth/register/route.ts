import { NextResponse } from 'next/server';
import { hashPassword, generateToken } from '@/lib/auth';
import { findUserByEmail, createUser } from '@/lib/userStore';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, studentId, department, year, section, phone, role } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check duplicate user in userStore
    const existingUser = await findUserByEmail(cleanEmail);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email address already exists.' },
        { status: 409 }
      );
    }

    const hashedPassword = hashPassword(password);
    const assignedRole = role === 'ADMIN' ? 'ADMIN' : 'STUDENT';

    // 1. Create in persistent userStore
    const newUser = await createUser({
      name: name.trim(),
      email: cleanEmail,
      passwordHash: hashedPassword,
      role: assignedRole,
      status: 'ACTIVE',
      studentId: studentId || `STU-${Math.floor(10000 + Math.random() * 90000)}`,
      department: department || 'CSE',
      year: year || 'III Year',
      section: section || 'A',
      phone: phone || '',
      otpVerified: true,
    });

    // 2. Sync to Prisma DB if available
    try {
      if (process.env.DATABASE_URL) {
        await prisma.user.create({
          data: {
            id: newUser.id,
            name: newUser.name,
            email: cleanEmail,
            passwordHash: hashedPassword,
            role: assignedRole as any,
            studentId: newUser.studentId,
            department: newUser.department,
            year: newUser.year,
            section: newUser.section,
            phone: newUser.phone,
            college: 'VFSTR / Vignan University',
          },
        });
      }
    } catch (e) {
      console.warn('Prisma DB sync error during student register:', e);
    }

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
      status: newUser.status,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        studentId: newUser.studentId,
        department: newUser.department,
        year: newUser.year,
        section: newUser.section,
        phone: newUser.phone,
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
    console.error('Registration API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
