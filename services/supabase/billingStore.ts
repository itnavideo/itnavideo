import { createSupabaseServerClient } from "@/lib/supabase/server";
import { pricingPlans } from "@/lib/billing/plans";

export type BillingEntitlement = {
  userId: string;
  email: string | null;
  planId: string;
  planName: string;
  monthlyVideoLimit: number;
  amount: number;
  currency: string;
  paymentId: string;
  orderId: string;
  status: "active";
  activatedAt: string;
  expiresAt: string;
};

const ENTITLEMENT_PREFIX = "billing_entitlement";

export async function getBillingEntitlementFromServer(userId: string) {
  const cleanUserId = sanitizeString(userId);
  if (!cleanUserId) throw new Error("User id is required.");

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", entitlementKey(cleanUserId))
    .maybeSingle();

  if (error) throw new Error(`Billing entitlement read failed: ${error.message}`);
  return normalizeEntitlement(data?.value, cleanUserId);
}

export async function upsertBillingEntitlementFromServer(input: {
  userId: string;
  email?: string | null;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  paymentId: string;
  orderId: string;
}) {
  const userId = sanitizeString(input.userId);
  if (!userId) throw new Error("User id is required.");

  const now = new Date();
  const validDays = getPlanValidityDays(input.planId);
  const entitlement: BillingEntitlement = {
    userId,
    email: sanitizeString(input.email) || null,
    planId: sanitizeString(input.planId) || "paid",
    planName: sanitizeString(input.planName) || "Paid plan",
    monthlyVideoLimit: getPlanLimit(input.planId),
    amount: Math.max(0, Math.round(Number(input.amount) || 0)),
    currency: sanitizeString(input.currency || "INR").toUpperCase() || "INR",
    paymentId: sanitizeString(input.paymentId),
    orderId: sanitizeString(input.orderId),
    status: "active",
    activatedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + validDays * 24 * 60 * 60 * 1000).toISOString(),
  };

  if (!entitlement.paymentId || !entitlement.orderId) {
    throw new Error("Payment id and order id are required.");
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("app_settings")
    .upsert(
      {
        key: entitlementKey(userId),
        value: entitlement,
        updated_by: "razorpay",
        updated_at: now.toISOString(),
      },
      { onConflict: "key" },
    );

  if (error) throw new Error(`Billing entitlement write failed: ${error.message}`);
  return entitlement;
}

export function isEntitlementActive(entitlement: BillingEntitlement | null) {
  if (!entitlement || entitlement.status !== "active") return false;
  return new Date(entitlement.expiresAt).getTime() > Date.now();
}

function entitlementKey(userId: string) {
  return `${ENTITLEMENT_PREFIX}:${userId}`;
}

function normalizeEntitlement(value: unknown, expectedUserId: string): BillingEntitlement | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const entitlement: BillingEntitlement = {
    userId: sanitizeString(item.userId),
    email: sanitizeString(item.email) || null,
    planId: sanitizeString(item.planId),
    planName: sanitizeString(item.planName),
    monthlyVideoLimit: Math.max(0, Math.round(Number(item.monthlyVideoLimit) || getPlanLimit(item.planId))),
    amount: Math.max(0, Math.round(Number(item.amount) || 0)),
    currency: sanitizeString(item.currency || "INR").toUpperCase() || "INR",
    paymentId: sanitizeString(item.paymentId),
    orderId: sanitizeString(item.orderId),
    status: item.status === "active" ? "active" : "active",
    activatedAt: sanitizeString(item.activatedAt),
    expiresAt: sanitizeString(item.expiresAt),
  };

  if (entitlement.userId !== expectedUserId || !entitlement.planId || !entitlement.expiresAt) {
    return null;
  }

  return entitlement;
}

function getPlanLimit(planId: unknown) {
  const id = sanitizeString(planId);
  return pricingPlans.find((plan) => plan.id === id)?.monthlyVideoLimit || 0;
}

function getPlanValidityDays(planId: unknown) {
  const id = sanitizeString(planId);
  const validDays = pricingPlans.find((plan) => plan.id === id)?.validDays;
  return Math.max(1, Math.round(Number(validDays) || 31));
}

function sanitizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
