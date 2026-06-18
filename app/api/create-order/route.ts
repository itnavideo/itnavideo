import { NextResponse } from "next/server";
import { pricingPlans } from "@/lib/billing/plans";
import { getRazorpayClient, RazorpayConfigError } from "@/lib/payments/razorpay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_AMOUNT_PAISE = 100;

type CreateOrderBody = {
  amount?: unknown;
  currency?: unknown;
  receipt?: unknown;
  planId?: unknown;
  planName?: unknown;
  userId?: unknown;
  userEmail?: unknown;
};

function getErrorStatus(error: unknown) {
  if (error instanceof RazorpayConfigError) return 401;
  if (typeof error === "object" && error && "statusCode" in error) {
    const statusCode = Number((error as { statusCode?: unknown }).statusCode);
    if (statusCode === 401 || statusCode === 403) return 401;
  }
  return 500;
}

function sanitizeReceipt(value: unknown) {
  const receipt = String(value || `itnavideo-${Date.now()}`)
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .slice(0, 40);

  return receipt || `itnavideo-${Date.now()}`.slice(0, 40);
}

function sanitizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateOrderBody;
    const currency = String(body.currency || "INR").toUpperCase();
    const planId = sanitizeString(body.planId);
    const plan = pricingPlans.find((item) => item.id === planId && item.amountPaise > 0);

    if (!plan) {
      return NextResponse.json(
        { ok: false, error: "Please choose a valid paid plan." },
        { status: 400 },
      );
    }

    const amount = plan.amountPaise;
    if (!Number.isInteger(amount) || amount < MIN_AMOUNT_PAISE) {
      return NextResponse.json(
        { ok: false, error: "Plan amount must be at least 100 paise." },
        { status: 400 },
      );
    }

    if (currency !== "INR" && currency !== "USD") {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Only INR and USD payments are supported right now.",
        },
        { status: 400 },
      );
    }

    const { client, keyId } = getRazorpayClient();
    const order = await client.orders.create({
      amount,
      currency,
      receipt: sanitizeReceipt(body.receipt),
      notes: {
        planId: plan.id,
        planName: plan.name,
        userId: String(body.userId || ""),
        userEmail: String(body.userEmail || ""),
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
    });
  } catch (error) {
    const status = getErrorStatus(error);
    return NextResponse.json(
      {
        ok: false,
        error:
          status === 401
            ? "Razorpay authentication failed. Check server credentials."
            : "Could not create Razorpay order.",
      },
      { status },
    );
  }
}
