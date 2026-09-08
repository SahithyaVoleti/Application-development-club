import { NextResponse } from 'next/server';
import { getNotificationLogs } from '@/lib/notificationStore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const recipient = searchParams.get('recipient') || undefined;
    const logs = await getNotificationLogs(recipient);
    return NextResponse.json({ success: true, notificationLogs: logs });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch notification history' },
      { status: 500 }
    );
  }
}
