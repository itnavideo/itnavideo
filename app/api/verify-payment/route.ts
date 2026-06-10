import { NextResponse } from "next/server";
import { getRazorpayClient, RazorpayConfigError, verifyRazorpaySignature } from "@/lib/payments/razorpay";
import { pricingPlans } from "@/lib/billing/plans";
import { upsertBillingEntitlementFromServer } from "@/services/supabase/billingStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type VerifyPaymentBody = {
  razorpay_payment_id?: unknown;
  razorpay_order_id?: unknown;
  razorpay_signature?: unknown;
  userId?: unknown;
  userEmail?: unknown;
  planId?: unknown;
  planName?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VerifyPaymentBody;
    const paymentId = String(body.razorpay_payment_id || "");
    const orderId = String(body.razorpay_order_id || "");
    const signature = String(body.razorpay_signature || "");
    const userId = sanitizeString(body.userId);
    const userEmail = sanitizeString(body.userEmail);

    if (!paymentId || !orderId || !signature) {
      return NextResponse.json(
        { ok: false, error: "Payment id, order id, and signature are required." },
        { status: 400 },
      );
    }

    const isValid = verifyRazorpaySignature({ orderId, paymentId, signature });

    if (!isValid) {
      return NextResponse.json(
        { ok: false, error: "Payment signature mismatch. Payment was not marked as paid." },
        { status: 400 },
      );
    }

    const order = await getRazorpayClient().client.orders.fetch(orderId);
    const orderNotes = readOrderNotes(order);
    const planId = sanitizeString(orderNotes.planId) || sanitizeString(body.planId);
    const matchedPlan = pricingPlans.find((plan) => plan.id === planId && plan.amountPaise > 0);
    const amount = Number(order.amount || matchedPlan?.amountPaise || 0);
    const currency = String(order.currency || "INR");

    if (!matchedPlan) {
      return NextResponse.json(
        { ok: false, error: "Paid plan could not be matched. Payment was verified but access was not activated." },
        { status: 400 },
      );
    }

    if (!userId) {
      return NextResponse.json(
        { ok: true, paid: true, accessActivated: false, error: "Payment verified, but login is required to activate access." },
        { status: 202 },
      );
    }

    const entitlement = await upsertBillingEntitlementFromServer({
      userId,
      email: userEmail,
      planId: matchedPlan.id,
      planName: matchedPlan.name,
      amount,
      currency,
      paymentId,
      orderId,
    });

    return NextResponse.json({
      ok: true,
      paid: true,
      accessActivated: true,
      entitlement,
      order_id: orderId,
      payment_id: paymentId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof RazorpayConfigError
            ? "Razorpay credentials are not configured."
            : "Could not verify Razorpay payment.",
      },
      { status: error instanceof RazorpayConfigError ? 401 : 500 },
    );
  }
}

function readOrderNotes(order: unknown) {
  const notes = order && typeof order === "object" && "notes" in order
    ? (order as { notes?: unknown }).notes
    : null;
  return notes && typeof notes === "object" ? notes as Record<string, unknown> : {};
}

function sanitizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
