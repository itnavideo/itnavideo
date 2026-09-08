import { NextResponse } from "next/server";
import { getValidatedOrderQuote, isPaidRazorpayOrder } from "@/lib/billing/orderQuote";
import { getAuthenticatedRequestUser } from "@/lib/billing/requestAuth";
import { getRazorpayClient, RazorpayConfigError, verifyRazorpaySignature } from "@/lib/payments/razorpay";
import { upsertBillingEntitlementFromServer } from "@/services/supabase/billingStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type VerifyPaymentBody = {
  razorpay_payment_id?: unknown;
  razorpay_order_id?: unknown;
  razorpay_signature?: unknown;
};

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedRequestUser(request);
    if (!user) return NextResponse.json({ok: false, error: "Please log in again to activate your credits."}, {status: 401});

    const body = (await request.json()) as VerifyPaymentBody;
    const paymentId = String(body.razorpay_payment_id || "");
    const orderId = String(body.razorpay_order_id || "");
    const signature = String(body.razorpay_signature || "");
    if (!paymentId || !orderId || !signature) {
      return NextResponse.json({ok: false, error: "Payment id, order id, and signature are required."}, {status: 400});
    }
    if (!verifyRazorpaySignature({orderId, paymentId, signature})) {
      return NextResponse.json({ok: false, error: "Payment signature mismatch. Payment was not marked as paid."}, {status: 400});
    }

    const order = await getRazorpayClient().client.orders.fetch(orderId);
    const validated = getValidatedOrderQuote(order);
    if (!validated || !isPaidRazorpayOrder(order)) {
      return NextResponse.json({ok: false, error: "Payment is not captured with a valid current price yet. Please wait a moment and retry."}, {status: 409});
    }
    if (String(validated.notes.userId || "") !== user.id) {
      return NextResponse.json({ok: false, error: "This payment belongs to a different account."}, {status: 403});
    }

    const entitlement = await upsertBillingEntitlementFromServer({
      userId: user.id,
      email: user.email,
      planId: validated.plan.id,
      planName: validated.plan.name,
      amount: validated.quote.amount,
      currency: validated.quote.currency,
      paymentId,
      orderId,
    });

    return NextResponse.json({ok: true, paid: true, accessActivated: true, entitlement, order_id: orderId, payment_id: paymentId});
  } catch (error) {
    return NextResponse.json(
      {ok: false, error: error instanceof RazorpayConfigError ? "Razorpay credentials are not configured." : "Could not verify Razorpay payment."},
      {status: error instanceof RazorpayConfigError ? 401 : 500},
    );
  }
}
