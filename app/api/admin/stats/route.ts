import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

async function isAuthorized() {
  const cookieStore = await cookies();
  return cookieStore.get('admin_session')?.value === 'authenticated';
}

export async function GET() {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Lightweight response — full analytics will be built later
  return NextResponse.json({
    ok: true,
    message: 'Admin stats API ready. Full dashboard coming at 50+ users.',
    services: {
      supabase: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      groq: Boolean(process.env.GROQ_API_KEY),
      aws: Boolean(process.env.AWS_ACCESS_KEY_ID),
      razorpay: Boolean(process.env.RAZORPAY_KEY_ID),
      remotion: Boolean(process.env.REMOTION_LAMBDA_FUNCTION_NAME),
    },
  });
}
