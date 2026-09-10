import { NextResponse } from 'next/server';
import { PersistentEventStore } from '@/lib/eventStore';
import { PersistentRegistrationStore } from '@/lib/registrationStore';
import { getAllUsers, getAuditLogs } from '@/lib/userStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allEvents = PersistentEventStore.getAllEvents();
    const upcomingEvents = PersistentEventStore.getUpcomingEvents();
    const pastEvents = PersistentEventStore.getPastEvents();

    const allRegistrations = PersistentRegistrationStore.getAllRegistrations();
    const totalRegistrations = allRegistrations.length;
    const totalAttended = allRegistrations.filter(r => r.attendanceStatus === 'present').length;

    const allUsers = await getAllUsers();

    const admins = allUsers.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN');
    const totalAdmins = admins.length;
    const activeAdmins = admins.filter(u => u.role === 'SUPER_ADMIN' || u.status === 'APPROVED' || u.status === 'TRUSTED_ADMIN' || u.status === 'ACTIVE').length;
    const pendingAdmins = admins.filter(u => u.role === 'ADMIN' && (u.status === 'PENDING' || u.status === 'PENDING_APPROVAL' || u.status === 'PENDING_OTP')).length;
    const rejectedAdmins = admins.filter(u => u.role === 'ADMIN' && u.status === 'REJECTED').length;

    const auditLogs = await getAuditLogs();
    const recentActivity = auditLogs.slice(0, 10);

    const recentRegistrations = allRegistrations.slice(0, 10);

    return NextResponse.json({
      success: true,
      stats: {
        totalEvents: allEvents.length,
        upcomingEvents: upcomingEvents.length,
        pastEvents: pastEvents.length,
        totalRegistrations,
        totalAttended,
        totalAdmins,
        activeAdmins,
        pendingAdmins,
        rejectedAdmins,
      },
      recentActivity,
      recentRegistrations,
    });
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}
