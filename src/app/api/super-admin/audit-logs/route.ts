import { NextResponse } from 'next/server';
import { getAuditLogs } from '@/lib/userStore';

export async function GET() {
  try {
    const auditLogs = await getAuditLogs();
    return NextResponse.json({
      success: true,
      auditLogs,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}
