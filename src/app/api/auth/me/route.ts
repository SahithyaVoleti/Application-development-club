import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { findUserById, findUserByEmail } from '@/lib/userStore';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.headers.get('cookie')?.split('adhub_auth_token=')[1]?.split(';')[0];
    const token = authHeader?.replace('Bearer ', '') || cookieToken;

    if (!token) {
      return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
    }

    let user: any = null;

    // Try Prisma DB first
    try {
      if (process.env.DATABASE_URL) {
        user = await prisma.user.findUnique({
          where: { id: payload.id },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            studentId: true,
            department: true,
            year: true,
            section: true,
            phone: true,
            college: true,
          },
        });
      }
    } catch (dbErr) {
      console.warn('Prisma DB lookup error, falling back to userStore:', dbErr);
    }

    // Fallback to userStore if Prisma record is not found or DB throws connection error
    if (!user) {
      const storeUser = (await findUserById(payload.id)) || (await findUserByEmail(payload.email));
      if (storeUser) {
        user = {
          id: storeUser.id,
          name: storeUser.name,
          email: storeUser.email,
          role: storeUser.role,
          studentId: storeUser.studentId || null,
          department: storeUser.department || 'CSE',
          year: storeUser.year || 'III Year',
          section: storeUser.section || 'A',
          phone: storeUser.phone || '',
          college: 'VFSTR / Vignan University',
        };
      }
    }

    if (!user) {
      return NextResponse.json({ success: false, authenticated: false }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
