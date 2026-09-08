import { NextResponse } from 'next/server';
import { updateUser, deleteUser, getAllAdminRequests, findUserById } from '@/lib/userStore';
import { verifySuperAdmin } from '@/lib/auth';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const superAdmin = verifySuperAdmin(authHeader);

    if (!superAdmin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Super Admin permissions required to edit admins.' },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    const target = await findUserById(id);
    if (!target) {
      return NextResponse.json({ success: false, message: 'Admin account not found.' }, { status: 404 });
    }

    // Update details safely
    const updated = await updateUser(id, {
      ...(body.name && { name: body.name.trim() }),
      ...(body.email && { email: body.email.toLowerCase().trim() }),
      ...(body.phone && { phone: body.phone.trim() }),
      ...(body.staffId && { staffId: body.staffId.toUpperCase().trim() }),
      ...(body.department && { department: body.department.trim() }),
      ...(body.designation && { designation: body.designation.trim() }),
      ...(body.status && { status: body.status }),
    });

    const allAdmins = await getAllAdminRequests();
    return NextResponse.json({
      success: true,
      message: `Admin details for ${target.name} updated successfully.`,
      admin: updated,
      admins: allAdmins,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Update failed.' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const superAdmin = verifySuperAdmin(authHeader);

    if (!superAdmin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Only SUPER_ADMIN can delete admin accounts.' },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const target = await findUserById(id);

    if (!target) {
      return NextResponse.json({ success: false, message: 'Admin account not found.' }, { status: 404 });
    }

    if (target.role === 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Super Admin accounts cannot be deleted.' },
        { status: 400 }
      );
    }

    const deleted = await deleteUser(id);
    const allAdmins = await getAllAdminRequests();

    return NextResponse.json({
      success: true,
      message: `Admin account ${target.name} (${target.email}) deleted successfully.`,
      deletedId: id,
      admins: allAdmins,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Deletion failed.' }, { status: 500 });
  }
}
