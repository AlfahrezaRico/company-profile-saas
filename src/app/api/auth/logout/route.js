import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  });
}

// Support GET logout just in case
export async function GET() {
  await clearSessionCookie();
  // Redirect back to login or just return json
  return NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  });
}
