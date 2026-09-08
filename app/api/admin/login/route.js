import { cookies } from 'next/headers';
import { timingSafeEqual } from 'node:crypto';

export async function POST(request) {
  try {
    const { apiKey } = await request.json();
    const cookieStore = await cookies();
    const adminApiKey = process.env.ADMIN_API_KEY || '';
    const founderEmails = (process.env.FOUNDER_TEST_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);

    if (!adminApiKey && !founderEmails.length) {
      return Response.json(
        { success: false, message: 'Admin API key is not configured' },
        { status: 503 }
      );
    }

    // Accept either the API key OR the founder email as valid credentials
    const inputTrimmed = (apiKey || '').trim();
    const isValidApiKey = adminApiKey && safeEqual(inputTrimmed, adminApiKey);
    const isFounderEmail = founderEmails.includes(inputTrimmed.toLowerCase());

    if (isValidApiKey || isFounderEmail) {
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

function safeEqual(input, expected) {
  if (typeof input !== 'string' || typeof expected !== 'string') return false;
  const inputBuffer = Buffer.from(input.trim());
  const expectedBuffer = Buffer.from(expected.trim());
  if (!inputBuffer.length || inputBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(inputBuffer, expectedBuffer);
}
