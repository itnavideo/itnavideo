import { NextRequest, NextResponse } from "next/server";
import { getBillingEntitlementFromServer, isEntitlementActive } from "@/services/supabase/billingStore";
import { getBillingUsageForUser, getFounderTestAccessForUser } from "@/services/billing/renderAccess";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const userId = sanitizeString(request.nextUrl.searchParams.get("userId"));
    if (!userId) {
      return NextResponse.json({ ok: false, active: false, error: "userId is required" }, { status: 400 });
    }

    const founderAccess = await getFounderTestAccessForUser(userId);
    if (founderAccess) {
      return NextResponse.json({
        ok: true,
        active: true,
        entitlement: {
          userId,
          email: null,
          planId: founderAccess.planId,
          planName: founderAccess.planName,
          monthlyVideoLimit: founderAccess.limit,
          amount: 0,
          currency: "INR",
          paymentId: "internal-founder",
          orderId: "internal-founder",
          status: "active",
          activatedAt: "2000-01-01T00:00:00.000Z",
          expiresAt: founderAccess.expiresAt,
        },
        usage: {
          used: founderAccess.used,
          limit: founderAccess.limit,
          remaining: founderAccess.remaining,
        },
      });
    }

    const entitlement = await getBillingEntitlementFromServer(userId);
    const active = isEntitlementActive(entitlement);
    const usage = active && entitlement
      ? await getBillingUsageForUser(userId, entitlement.activatedAt, entitlement.expiresAt, entitlement.monthlyVideoLimit)
      : { used: 0, limit: entitlement?.monthlyVideoLimit || 0, remaining: 0 };

    return NextResponse.json({
      ok: true,
      active,
      entitlement,
      usage,
    });
  } catch (error) {
    console.error("Billing entitlement read failed:", error);
    return NextResponse.json(
      { ok: false, active: false, error: "Could not load billing status." },
      { status: 500 },
    );
  }
}

function sanitizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
