import { NextResponse } from "next/server";
import { pricingPlans } from "@/lib/billing/plans";
import {
  getRazorpayClient,
  RazorpayConfigError,
  verifyRazorpayWebhookSignature,
} from "@/lib/payments/razorpay";
import { upsertBillingEntitlementFromServer } from "@/services/supabase/billingStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RazorpayWebhookPayload = {
  event?: string;
  payload?: {
    payment?: {
      entity?: Record<string, unknown>;
    };
    order?: {
      entity?: Record<string, unknown>;
    };
  };
};

const ACTIVATION_EVENTS = new Set(["payment.captured", "order.paid"]);

export async function POST(request: Request) {
  const signature = request.headers.get("x-razorpay-signature") || "";
  const eventId = request.headers.get("x-razorpay-event-id") || "";
  const rawBody = await request.text();

  try {
    if (!signature) {
      return NextResponse.json({ ok: false, error: "Missing Razorpay webhook signature." }, { status: 400 });
    }

    const isValid = verifyRazorpayWebhookSignature({ rawBody, signature });
    if (!isValid) {
      return NextResponse.json({ ok: false, error: "Invalid Razorpay webhook signature." }, { status: 400 });
    }

    const payload = JSON.parse(rawBody) as RazorpayWebhookPayload;
    const eventName = String(payload.event || "");

    if (!ACTIVATION_EVENTS.has(eventName)) {
      return NextResponse.json({ ok: true, ignored: true, event: eventName, eventId });
    }

    const payment = payload.payload?.payment?.entity || {};
    const orderEntity = payload.payload?.order?.entity || {};
    const orderId = sanitizeString(payment.order_id || orderEntity.id);
    const paymentId = sanitizeString(payment.id || orderEntity.payment_id);

    if (!orderId) {
      return NextResponse.json({ ok: false, error: "Webhook payment order id is missing." }, { status: 400 });
    }

    const order = await getRazorpayClient().client.orders.fetch(orderId);
    const notes = readOrderNotes(order);
    const planId = sanitizeString(notes.planId);
    const userId = sanitizeString(notes.userId);
    const userEmail = sanitizeString(notes.userEmail || payment.email);
    const matchedPlan = pricingPlans.find((plan) => plan.id === planId && plan.amountPaise > 0);

    if (!matchedPlan || !userId) {
      return NextResponse.json({
        ok: true,
        activated: false,
        reason: "Webhook verified, but paid plan or user was not found in order notes.",
        event: eventName,
        eventId,
      });
    }

    const entitlement = await upsertBillingEntitlementFromServer({
      userId,
      email: userEmail,
      planId: matchedPlan.id,
      planName: matchedPlan.name,
      amount: Number(order.amount || payment.amount || matchedPlan.amountPaise || 0),
      currency: String(order.currency || payment.currency || "INR"),
      paymentId: paymentId || `webhook-${eventId || orderId}`,
      orderId,
    });

    return NextResponse.json({
      ok: true,
      activated: true,
      event: eventName,
      eventId,
      entitlement,
    });
  } catch (error) {
    console.error("Razorpay webhook failed:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof RazorpayConfigError
            ? "Razorpay webhook is not configured."
            : "Could not process Razorpay webhook.",
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

