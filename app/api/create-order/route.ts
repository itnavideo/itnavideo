import { NextResponse } from "next/server";
import { getPricingPlan, resolvePlanQuoteForCountry } from "@/lib/billing/plans";
import { getAuthenticatedRequestUser } from "@/lib/billing/requestAuth";
import { getRazorpayClient, RazorpayConfigError } from "@/lib/payments/razorpay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_ORDER_AMOUNT = 100;

type CreateOrderBody = {
  planId?: unknown;
};

function getErrorStatus(error: unknown) {
  if (error instanceof RazorpayConfigError) return 401;
  if (typeof error === "object" && error && "statusCode" in error) {
    const statusCode = Number((error as { statusCode?: unknown }).statusCode);
    if (statusCode === 401 || statusCode === 403) return 401;
  }
  return 500;
}

function sanitizeReceipt(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 40) || `itnavideo-${Date.now()}`;
}

function sanitizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedRequestUser(request);
    if (!user) {
      return NextResponse.json({ok: false, error: "Please log in again before checkout."}, {status: 401});
    }

    const body = (await request.json()) as CreateOrderBody;
    const plan = getPricingPlan(sanitizeString(body.planId));
    if (!plan) {
      return NextResponse.json({ok: false, error: "Please choose a valid plan."}, {status: 400});
    }

    // Vercel supplies this trusted edge header in production. Browser input never sets the billing country.
    const quote = resolvePlanQuoteForCountry(plan, request.headers.get("x-vercel-ip-country"));
    if (!Number.isInteger(quote.amount) || quote.amount < MIN_ORDER_AMOUNT) {
      return NextResponse.json({ok: false, error: "The checkout price is unavailable. Please try again."}, {status: 400});
    }

    const {client, keyId} = getRazorpayClient();
    const order = await client.orders.create({
      amount: quote.amount,
      currency: quote.currency,
      receipt: sanitizeReceipt(`${plan.id}-${Date.now()}`),
      notes: {
        planId: plan.id,
        planName: plan.name,
        userId: user.id,
        userEmail: user.email || "",
        quoteAmount: String(quote.amount),
        quoteCurrency: quote.currency,
        priceVersion: quote.priceVersion,
        source: "itnavideo-web-checkout",
      },
    });

    return NextResponse.json({
      ok: true,
      key_id: keyId,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      planId: plan.id,
      planName: plan.name,
      priceLabel: quote.displayPrice,
      billingLabel: plan.billingPeriodLabel,
    });
  } catch (error) {
    const status = getErrorStatus(error);
    return NextResponse.json(
      {ok: false, error: status === 401 ? "Razorpay authentication failed. Check server credentials." : "Could not create Razorpay order."},
      {status},
    );
  }
}
