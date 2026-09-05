import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
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

    // Query user from Prisma DB
    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    // Fallback for default Admin if not seeded yet
    if (!user && (cleanEmail === 'admin@appdevhub.com' || cleanEmail === 'admin@vignan.ac.in') && password === 'AdminPassword2026!') {
      user = await prisma.user.create({
        data: {
          name: 'Application Hub Admin',
          email: cleanEmail,
          passwordHash: hashedPassword,
          role: 'ADMIN',
          studentId: 'ADMIN-001',
          department: 'CSE',
        },
      });
    }

    if (!user || user.passwordHash !== hashedPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        department: user.department,
        year: user.year,
        section: user.section,
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
