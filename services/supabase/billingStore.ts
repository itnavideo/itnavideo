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
  subscriptionId?: string;
  subscriptionStatus?: string;
  billingCycle?: "monthly" | "annual";
  cancelAtPeriodEnd?: boolean;
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

  const existing = await getBillingEntitlementFromServer(userId);
  if (existing && existing.paymentId === sanitizeString(input.paymentId) && existing.orderId === sanitizeString(input.orderId)) {
    return existing;
  }

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

export async function upsertSubscriptionEntitlementFromServer(input: {
  userId: string;
  email?: string | null;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  paymentId: string;
  subscriptionId: string;
  currentStart: number;
  currentEnd: number;
  status: string;
}) {
  const userId = sanitizeString(input.userId);
  const subscriptionId = sanitizeString(input.subscriptionId);
  if (!userId || !subscriptionId || !input.currentEnd) throw new Error("Subscription details are required.");
  const entitlement: BillingEntitlement = {
    userId,
    email: sanitizeString(input.email) || null,
    planId: sanitizeString(input.planId),
    planName: sanitizeString(input.planName),
    monthlyVideoLimit: getPlanLimit(input.planId),
    amount: Math.max(0, Math.round(Number(input.amount) || 0)),
    currency: sanitizeString(input.currency || "INR").toUpperCase() || "INR",
    paymentId: sanitizeString(input.paymentId),
    orderId: subscriptionId,
    subscriptionId,
    subscriptionStatus: sanitizeString(input.status) || "active",
    billingCycle: getPlanCycle(input.planId),
    status: "active",
    activatedAt: new Date(Math.max(0, Number(input.currentStart) || Date.now() / 1000) * 1000).toISOString(),
    expiresAt: new Date(Number(input.currentEnd) * 1000).toISOString(),
  };
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("app_settings").upsert({ key: entitlementKey(userId), value: entitlement, updated_by: "razorpay-subscription", updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw new Error(`Billing entitlement write failed: ${error.message}`);
  return entitlement;
}

export async function markSubscriptionCancellationFromServer(userId: string, subscriptionId: string) {
  const existing = await getBillingEntitlementFromServer(userId);
  if (!existing || existing.subscriptionId !== sanitizeString(subscriptionId)) return existing;
  const entitlement = {...existing, cancelAtPeriodEnd: true};
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("app_settings").upsert({ key: entitlementKey(userId), value: entitlement, updated_by: "razorpay-subscription-cancel", updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw new Error(`Billing entitlement write failed: ${error.message}`);
  return entitlement;
}

export function getEntitlementCreditWindow(entitlement: BillingEntitlement, now = new Date()) {
  const billingStart = new Date(entitlement.activatedAt);
  const billingEnd = new Date(entitlement.expiresAt);
  if (entitlement.billingCycle !== "annual" || Number.isNaN(billingStart.getTime()) || Number.isNaN(billingEnd.getTime())) {
    return { startAt: entitlement.activatedAt, endAt: entitlement.expiresAt };
  }
  let start = billingStart;
  while (addMonths(start, 1) <= now && addMonths(start, 1) < billingEnd) start = addMonths(start, 1);
  const end = addMonths(start, 1) < billingEnd ? addMonths(start, 1) : billingEnd;
  return { startAt: start.toISOString(), endAt: end.toISOString() };
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
    subscriptionId: sanitizeString(item.subscriptionId) || undefined,
    subscriptionStatus: sanitizeString(item.subscriptionStatus) || undefined,
    billingCycle: item.billingCycle === "annual" ? "annual" : "monthly",
    cancelAtPeriodEnd: item.cancelAtPeriodEnd === true,
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

function getPlanCycle(planId: unknown) { return pricingPlans.find((plan) => plan.id === sanitizeString(planId))?.billingCycle || "monthly"; }
function getPlanValidityDays(planId: unknown) {
  const id = sanitizeString(planId);
  return pricingPlans.find((plan) => plan.id === id)?.validDays || 30;
}
function addMonths(date: Date, count: number) {
  const result = new Date(date);
  const day = result.getUTCDate();
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + count);
  result.setUTCDate(Math.min(day, new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)).getUTCDate()));
  return result;
}

function sanitizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
