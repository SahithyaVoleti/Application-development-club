import { NextResponse } from 'next/server';
import { createDirectAdmin, getAllAdminRequests } from '@/lib/userStore';
import { verifyTrustedAdmin, hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const superAdmin = verifyTrustedAdmin(authHeader);

    // Require Super Admin permissions to directly add new Admin accounts
    if (!superAdmin || superAdmin.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Super Admin privileges required to add admins.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, phone, staffId, department, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Full Name, Email Address, and Password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const hashedPassword = hashPassword(password);

    const newAdmin = await createDirectAdmin(
      {
        name: name.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : undefined,
        staffId: staffId ? staffId.trim() : undefined,
        department: department || 'CSE',
        passwordHash: hashedPassword,
      },
      superAdmin.name
    );

    const allRequests = await getAllAdminRequests();

    return NextResponse.json({
      success: true,
      user: newAdmin,
      requests: allRequests,
      message: `Successfully created and added ${newAdmin.name} as a Trusted Admin!`,
    });
  } catch (error: any) {
    console.error('Add Admin API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to add new admin.' },
      { status: 500 }
    );
  }
}
