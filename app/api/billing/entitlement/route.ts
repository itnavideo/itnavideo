import { NextRequest, NextResponse } from "next/server";
import { getBillingEntitlementFromServer, getEntitlementCreditWindow, isEntitlementActive } from "@/services/supabase/billingStore";
import { getBillingUsageForUser, getFounderTestAccessForUser } from "@/services/billing/renderAccess";
import {
  ensureFreeSignupCreditForUser,
  getFreeSignupCreditWindow,
  isFreeSignupCreditActive,
} from "@/services/supabase/freeTrialCredits";

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
    if (active && entitlement) {
      const creditWindow = getEntitlementCreditWindow(entitlement);
      const usage = await getBillingUsageForUser(userId, creditWindow.startAt, creditWindow.endAt, entitlement.monthlyVideoLimit);
      return NextResponse.json({
        ok: true,
        active,
        entitlement: { ...entitlement, creditRenewalAt: creditWindow.endAt },
        usage,
        creditWindow,
      });
    }

    const freeSignupCredit = await ensureFreeSignupCreditForUser(userId);
    if (isFreeSignupCreditActive(freeSignupCredit) && freeSignupCredit) {
      const window = getFreeSignupCreditWindow(freeSignupCredit);
      const usage = await getBillingUsageForUser(userId, window.startAt, window.endAt, window.limit);
      return NextResponse.json({
        ok: true,
        active: true,
        entitlement: {
          userId,
          email: freeSignupCredit.email,
          planId: "free-signup-credit",
          planName: "Free Signup Credit",
          monthlyVideoLimit: window.limit,
          amount: 0,
          currency: "INR",
          paymentId: "free-signup-credit",
          orderId: "free-signup-credit",
          status: "active",
          activatedAt: window.startAt,
          expiresAt: window.endAt,
          freeTrialGranted: true,
          transaction: freeSignupCredit.transaction,
        },
        usage,
      });
    }

    return NextResponse.json({
      ok: true,
      active: false,
      entitlement,
      usage: { used: 0, limit: entitlement?.monthlyVideoLimit || 0, remaining: 0 },
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
