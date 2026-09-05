import { NextResponse } from 'next/server';
import { sendRegistrationConfirmationEmail } from '@/lib/emailService';

export async function POST(request: Request) {
  try {
    const { registrationId, student, event } = await request.json();

    if (!registrationId || !student?.email || !event?.title) {
      return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 });
    }

    const receipt = await sendRegistrationConfirmationEmail(registrationId, student, event);

    return NextResponse.json({
      success: receipt.success,
      provider: receipt.provider || 'Brevo',
      messageId: receipt.messageId || `msg-${Date.now()}`,
      recipient: student.email,
      registrationId,
      sentAt: receipt.sentAt || new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
