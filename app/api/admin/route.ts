import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  return NextResponse.json({
    endpoint: '/api/admin',
    authenticated: session?.value === 'authenticated',
    message: session?.value === 'authenticated' ? 'Admin session active' : 'Not authenticated',
  });
}

export async function POST() {
  return NextResponse.json({ message: 'Use GET for admin status checks' }, { status: 405 });
}
