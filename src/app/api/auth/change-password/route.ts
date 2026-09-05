import { NextResponse } from 'next/server';
import { verifyToken, hashPassword } from '@/lib/auth';
import { findUserByEmail, findUserById, updateUser } from '@/lib/userStore';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Valid session token required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword, targetUserId } = body;

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'New password and confirmation do not match.' },
        { status: 400 }
      );
    }

    // Determine target user to update password for
    let userToUpdate = await findUserById(payload.id);
    if (!userToUpdate) {
      userToUpdate = await findUserByEmail(payload.email);
    }

    // If Super Admin is resetting another user's password
    if (targetUserId && payload.role === 'SUPER_ADMIN') {
      const targetUser = await findUserById(targetUserId);
      if (targetUser) {
        userToUpdate = targetUser;
      }
    } else {
      // Normal self-password change: verify current password
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, error: 'Current password is required to change password.' },
          { status: 400 }
        );
      }

      if (userToUpdate && userToUpdate.passwordHash !== hashPassword(currentPassword)) {
        return NextResponse.json(
          { success: false, error: 'Incorrect current password. Please try again.' },
          { status: 400 }
        );
      }
    }

    if (!userToUpdate) {
      return NextResponse.json(
        { success: false, error: 'User account not found.' },
        { status: 404 }
      );
    }

    const newPasswordHash = hashPassword(newPassword);

    // Update password in userStore persistent memory
    await updateUser(userToUpdate.id, { passwordHash: newPasswordHash });

    // Sync with Prisma Database if available
    try {
      await prisma.user.updateMany({
        where: { email: userToUpdate.email.toLowerCase() },
        data: { passwordHash: newPasswordHash },
      });
    } catch (e) {
      // Ignore Prisma sync error if record only exists in userStore
    }

    return NextResponse.json({
      success: true,
      message: `Password changed successfully for ${userToUpdate.name} (${userToUpdate.email}).`,
    });
  } catch (error: any) {
    console.error('Change Password API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to change password.' },
      { status: 500 }
    );
  }
}
