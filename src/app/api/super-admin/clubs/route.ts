import { NextResponse } from 'next/server';
import { getAllClubs } from '@/lib/clubStore';

export async function GET() {
  try {
    const clubs = await getAllClubs();
    return NextResponse.json({ success: true, clubs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch clubs' }, { status: 500 });
  }
}
