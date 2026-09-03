import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = createSupabaseServerClient();
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '7d';

    // Fetch renders and settings for metering calculations
    const { data: renders, error: rendersError } = await supabase
      .from('render_history')
      .select('*')
      .order('created_at', { ascending: false });

    if (rendersError) {
      return NextResponse.json({ error: rendersError.message }, { status: 500 });
    }

    const { data: settings } = await supabase.from('app_settings').select('*');

    // Aggregate credit usage by template mode
    const templateMetering: Record<string, { totalRenders: number; totalCredits: number; avgCredits: number }> = {};
    let totalMeteredCredits = 0;

    (renders || []).forEach((r) => {
      const mode = r.mode || 'videoCaption';
      const costs = r.costs as any;
      const credits = costs?.credits ? Number(costs.credits) : 1.0;

      totalMeteredCredits += credits;

      if (!templateMetering[mode]) {
        templateMetering[mode] = { totalRenders: 0, totalCredits: 0, avgCredits: 0 };
      }
      templateMetering[mode].totalRenders += 1;
      templateMetering[mode].totalCredits += credits;
    });

    Object.keys(templateMetering).forEach((mode) => {
      const item = templateMetering[mode];
      item.avgCredits = item.totalRenders > 0 ? Number((item.totalCredits / item.totalRenders).toFixed(2)) : 0;
    });

    // Credit Grants Ledger
    const creditGrants = (settings || [])
      .filter((s) => s.key.startsWith('free_signup_credit:'))
      .map((s) => {
        const val = s.value as any;
        return {
          key: s.key,
          userId: val?.userId,
          email: val?.email || 'user@itnavideo.com',
          amount: Number(val?.amount) || 0,
          reason: val?.reason || 'Sign-up Bonus / Plan Entitlement',
          grantedAt: val?.grantedAt || s.updated_at,
        };
      });

    return NextResponse.json({
      status: 'ok',
      meteringSummary: {
        totalMeteredCredits: Number(totalMeteredCredits.toFixed(1)),
        templateBreakdown: templateMetering,
        activeCreditGrantsCount: creditGrants.length,
        timeframe,
      },
      ledgerLogs: creditGrants.slice(0, 20),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Metering processing failed' }, { status: 500 });
  }
}
