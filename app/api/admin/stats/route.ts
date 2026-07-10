import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

async function isAuthorized() {
  const cookieStore = await cookies();
  return cookieStore.get('admin_session')?.value === 'authenticated';
}

export async function GET() {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({
      ok: true,
      stats: {
        totalUsers: 0,
        activeToday: 0,
        activeThisWeek: 0,
        totalRenders: 0,
        rendersToday: 0,
        errors: [],
      },
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // Get user counts
  let totalUsers = 0;
  let activeToday = 0;
  let activeThisWeek = 0;
  try {
    const { count: total } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    totalUsers = total || 0;

    const { count: today } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('last_sign_in_at', todayStart);
    activeToday = today || 0;

    const { count: week } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('last_sign_in_at', weekStart);
    activeThisWeek = week || 0;
  } catch (e) {
    console.warn('[ADMIN_STATS] profiles query failed:', e);
  }

  // Get render counts
  let totalRenders = 0;
  let rendersToday = 0;
  try {
    const { count: allRenders } = await supabase.from('render_history').select('*', { count: 'exact', head: true });
    totalRenders = allRenders || 0;

    const { count: todayRenders } = await supabase
      .from('render_history')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayStart);
    rendersToday = todayRenders || 0;
  } catch (e) {
    console.warn('[ADMIN_STATS] render_history query failed:', e);
  }

  // Get recent errors (last 20)
  let errors: Array<{ id: string; message: string; mode: string; createdAt: string; userId: string }> = [];
  try {
    const { data: errorData } = await supabase
      .from('render_history')
      .select('id, mode, user_id, created_at, error_message')
      .not('error_message', 'is', null)
      .order('created_at', { ascending: false })
      .limit(20);

    errors = (errorData || []).map((row: any) => ({
      id: row.id,
      message: row.error_message || 'Unknown error',
      mode: row.mode || 'unknown',
      createdAt: row.created_at,
      userId: row.user_id || '',
    }));
  } catch (e) {
    console.warn('[ADMIN_STATS] errors query failed:', e);
  }

  return NextResponse.json({
    ok: true,
    stats: {
      totalUsers,
      activeToday,
      activeThisWeek,
      totalRenders,
      rendersToday,
      errors,
    },
  });
}
