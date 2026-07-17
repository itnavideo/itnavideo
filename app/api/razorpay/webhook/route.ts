import { NextResponse } from "next/server";
import { getValidatedOrderQuote, isPaidRazorpayOrder } from "@/lib/billing/orderQuote";
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
    payment?: { entity?: Record<string, unknown> };
    order?: { entity?: Record<string, unknown> };
  };
};

const ACTIVATION_EVENTS = new Set(["payment.captured", "order.paid"]);

export async function POST(request: Request) {
  const signature = request.headers.get("x-razorpay-signature") || "";
  const eventId = request.headers.get("x-razorpay-event-id") || "";
  const rawBody = await request.text();

  try {
    if (!signature) return NextResponse.json({ok: false, error: "Missing Razorpay webhook signature."}, {status: 400});
    if (!verifyRazorpayWebhookSignature({rawBody, signature})) {
      return NextResponse.json({ok: false, error: "Invalid Razorpay webhook signature."}, {status: 400});
    }

    const payload = JSON.parse(rawBody) as RazorpayWebhookPayload;
    const eventName = String(payload.event || "");
    if (!ACTIVATION_EVENTS.has(eventName)) return NextResponse.json({ok: true, ignored: true, event: eventName, eventId});

    const payment = payload.payload?.payment?.entity || {};
    const orderEntity = payload.payload?.order?.entity || {};
    const orderId = readString(payment.order_id || orderEntity.id);
    const paymentId = readString(payment.id || orderEntity.payment_id) || `webhook-${eventId || orderId}`;
    if (!orderId) return NextResponse.json({ok: false, error: "Webhook payment order id is missing."}, {status: 400});

    const order = await getRazorpayClient().client.orders.fetch(orderId);
    const validated = getValidatedOrderQuote(order);
    const userId = readString(validated?.notes.userId);
    if (!validated || !userId || !isPaidRazorpayOrder(order)) {
      return NextResponse.json({ok: true, activated: false, reason: "Webhook order is not a captured current-price checkout.", event: eventName, eventId});
    }

    const entitlement = await upsertBillingEntitlementFromServer({
      userId,
      email: readString(validated.notes.userEmail || payment.email) || null,
      planId: validated.plan.id,
      planName: validated.plan.name,
      amount: validated.quote.amount,
      currency: validated.quote.currency,
      paymentId,
      orderId,
    });

    return NextResponse.json({ok: true, activated: true, event: eventName, eventId, entitlement});
  } catch (error) {
    console.error("Razorpay webhook failed:", error);
    return NextResponse.json(
      {ok: false, error: error instanceof RazorpayConfigError ? "Razorpay webhook is not configured." : "Could not process Razorpay webhook."},
      {status: error instanceof RazorpayConfigError ? 401 : 500},
    );
  }
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

