import { NextRequest, NextResponse } from "next/server";
import { readUsageLedger } from "@/services/billing/renderAccess";
import { CREDIT_UNITS_PER_CREDIT } from "@/lib/billing/creditPricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")?.trim();
    if (!userId) {
      return NextResponse.json({ ok: false, error: "userId is required" }, { status: 400 });
    }

    const ledger = await readUsageLedger(userId);
    const transactions = (ledger.renders || []).map((entry) => {
      const creditUnits = entry.creditUnits ?? CREDIT_UNITS_PER_CREDIT;
      const credits = Math.round((creditUnits / CREDIT_UNITS_PER_CREDIT) * 10) / 10;
      return {
        renderId: entry.renderId,
        createdAt: entry.createdAt,
        mode: entry.mode || "Video Generation",
        title: entry.title || "AI Video Render",
        creditUnits,
        creditsConsumed: credits,
        status: entry.status || "settled",
      };
    });

    return NextResponse.json({
      ok: true,
      userId,
      totalCount: transactions.length,
      transactions,
    });
  } catch (error) {
    console.error("Credit history fetch failed:", error);
    return NextResponse.json(
      { ok: false, error: "Could not fetch credit usage history" },
      { status: 500 }
    );
  }
}
