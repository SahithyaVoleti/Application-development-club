import { NextResponse } from 'next/server';
import { findUserByEmail, updateUser, createUser } from '@/lib/userStore';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, newPassword } = body;

    if (!email || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Edu Email ID and new password are required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const hashedPassword = hashPassword(newPassword);

    let user = await findUserByEmail(cleanEmail);

    if (user) {
      // Update existing user password
      await updateUser(user.id, { passwordHash: hashedPassword });
    } else {
      // Create new student record with new password
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
    }

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully! You can now log in with your new password.',
    });
  } catch (error: any) {
    console.error('Forgot Password API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Password reset failed.' },
      { status: 500 }
    );
  }
}
