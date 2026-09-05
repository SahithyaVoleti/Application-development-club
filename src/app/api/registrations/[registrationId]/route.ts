import { NextResponse } from 'next/server';
import { deleteRegistrationInDb } from '@/lib/events';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ registrationId: string }> }
) {
  try {
    const { registrationId } = await params;
    const result = await deleteRegistrationInDb(registrationId);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
