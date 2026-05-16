import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    const cookieStore = await cookies();
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'changeme';

    if (username === adminUsername && password === adminPassword) {
      cookieStore.set('admin_session', 'authenticated', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 8,
      });

      return Response.json({ success: true, message: 'Admin login successful' });
    }

    return Response.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Admin login error:', error);
    return Response.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}


