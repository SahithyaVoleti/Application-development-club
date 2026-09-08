import { NextResponse } from 'next/server';
import { getAllAdminRequests, createDirectAdmin, addAuditLog } from '@/lib/userStore';
import { verifySuperAdmin, hashPassword } from '@/lib/auth';
import { getClubById, assignAdminToClub } from '@/lib/clubStore';
import { sendAdminAddedEmail } from '@/lib/emailService';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const superAdmin = verifySuperAdmin(authHeader);

    if (!superAdmin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Super Admin permissions required.' },
        { status: 403 }
      );
    }

    const admins = await getAllAdminRequests();
    return NextResponse.json({ success: true, admins });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const superAdmin = verifySuperAdmin(authHeader);

    if (!superAdmin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Super Admin permissions required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, phone, staffId, department, designation, password, clubId, clubName } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, Email, and Password are required.' },
        { status: 400 }
      );
    }

    const targetClubId = clubId || 'club-appdev';
    let targetClubName = clubName;
    if (!targetClubName) {
      const clubObj = await getClubById(targetClubId);
      targetClubName = clubObj ? clubObj.name : 'Application Development Club';
    }

    // 1. Create/Approve Admin Account in Database / Persistent Store
    const hashedPassword = hashPassword(password);
    const newAdmin = await createDirectAdmin(
      {
        name: name.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : undefined,
        staffId: staffId ? staffId.trim() : undefined,
        department: department || 'CSE',
        designation: designation || 'Faculty Coordinator',
        passwordHash: hashedPassword,
      },
      superAdmin.name
    );

    // 2. Assign Admin to Selected Club
    await assignAdminToClub({
      adminId: newAdmin.id,
      adminName: newAdmin.name,
      adminEmail: newAdmin.email,
      clubId: targetClubId,
      clubName: targetClubName,
      role: 'ADMIN',
      assignedBy: superAdmin.name,
    });

    // 3. Add Audit Log
    await addAuditLog({
      adminId: newAdmin.id,
      adminName: newAdmin.name,
      adminEmail: newAdmin.email,
      action: 'CREATED',
      performedBy: superAdmin.name,
      metadata: { clubId: targetClubId, clubName: targetClubName },
    });

    // 4. Server-Side Email Dispatch to Newly Added Admin
    let emailStatus = 'SENT';
    let emailMessage = `Admin account created and notification email sent to ${newAdmin.email}`;
    let emailError: string | undefined = undefined;

    try {
      const emailRes = await sendAdminAddedEmail({
        adminEmail: newAdmin.email,
        adminName: newAdmin.name,
        clubName: targetClubName,
        assignedBy: superAdmin.name,
        assignedAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
      });

      if (!emailRes.success) {
        emailStatus = 'FAILED';
        emailError = emailRes.error || 'SMTP/Brevo dispatch did not confirm delivery';
        emailMessage = `Admin account created successfully, but the notification email could not be sent to ${newAdmin.email}`;
        console.warn(`[ADMIN ADDED EMAIL WARNING] To: ${newAdmin.email}, Error: ${emailError}`);
      } else {
        console.log(`[ADMIN ADDED EMAIL SUCCESS] Sent to ${newAdmin.email} for club ${targetClubName}`);
      }
    } catch (mailErr: any) {
      emailStatus = 'FAILED';
      emailError = mailErr?.message || 'Email dispatch exception';
      emailMessage = `Admin account created successfully, but the notification email could not be sent to ${newAdmin.email}`;
      console.error(`[ADMIN ADDED EMAIL EXCEPTION] To: ${newAdmin.email}:`, mailErr);
    }

    const allAdmins = await getAllAdminRequests();
    return NextResponse.json({
      success: true,
      message: emailMessage,
      admin: newAdmin,
      admins: allAdmins,
      emailSent: emailStatus === 'SENT',
      emailStatus,
      emailError,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
