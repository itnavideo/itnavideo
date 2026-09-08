import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAppSettingFromServer, setAppSettingFromServer } from "@/services/supabase/siteStore";

const FREE_SIGNUP_CREDIT_PREFIX = "free_signup_credit";
const FREE_SIGNUP_CREDIT_AMOUNT = 1;
const FREE_SIGNUP_CREDIT_ROLLOUT_AT = "2026-07-04T00:00:00.000Z";
const FREE_SIGNUP_CREDIT_EXPIRES_AT = "2099-12-31T23:59:59.000Z";

export type FreeSignupCreditGrant = {
  userId: string;
  email: string | null;
  freeTrialGranted: true;
  amount: number;
  reason: string;
  grantedAt: string;
  expiresAt: string;
  transaction: {
    type: "free_signup_credit";
    amount: 1;
    reason: "New user free trial credit";
    createdAt: string;
  };
};

export async function ensureFreeSignupCreditForUser(userId: string) {
  const cleanUserId = sanitizeString(userId);
  if (!cleanUserId || cleanUserId === "anonymous") return null;

  const existing = await getFreeSignupCreditForUser(cleanUserId);
  if (existing) return existing;

  const authUser = await getAuthUser(cleanUserId);
  if (!authUser || !isEligibleNewUser(authUser.createdAt)) return null;

  const now = new Date().toISOString();
  const grant: FreeSignupCreditGrant = {
    userId: cleanUserId,
    email: authUser.email || null,
    freeTrialGranted: true,
    amount: FREE_SIGNUP_CREDIT_AMOUNT,
    reason: "Free signup credit",
    grantedAt: now,
    expiresAt: FREE_SIGNUP_CREDIT_EXPIRES_AT,
    transaction: {
      type: "free_signup_credit",
      amount: FREE_SIGNUP_CREDIT_AMOUNT,
      reason: "New user free trial credit",
      createdAt: now,
    },
  };

  await setAppSettingFromServer(freeSignupCreditKey(cleanUserId), grant, "free-signup-credit");
  return grant;
}

export async function getFreeSignupCreditForUser(userId: string) {
  const cleanUserId = sanitizeString(userId);
  if (!cleanUserId) return null;
  return normalizeFreeSignupCredit(
    await getAppSettingFromServer<unknown>(freeSignupCreditKey(cleanUserId), null),
    cleanUserId,
  );
}

export function isFreeSignupCreditActive(grant: FreeSignupCreditGrant | null) {
  return Boolean(grant?.freeTrialGranted && Date.parse(grant.expiresAt) > Date.now());
}

export function getFreeSignupCreditWindow(grant: FreeSignupCreditGrant) {
  return {
    startAt: grant.grantedAt,
    endAt: grant.expiresAt,
    limit: grant.amount,
  };
}

function freeSignupCreditKey(userId: string) {
  return `${FREE_SIGNUP_CREDIT_PREFIX}:${userId}`;
}

async function getAuthUser(userId: string) {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.auth.admin.getUserById(userId);
    if (error || !data.user) return null;
    return {
      email: sanitizeString(data.user.email),
      createdAt: sanitizeString(data.user.created_at),
    };
  } catch {
    return null;
  }
}

function isEligibleNewUser(createdAt: string) {
  const createdTime = Date.parse(createdAt);
  const rolloutTime = Date.parse(FREE_SIGNUP_CREDIT_ROLLOUT_AT);
  return Number.isFinite(createdTime) && createdTime >= rolloutTime;
}

function normalizeFreeSignupCredit(value: unknown, expectedUserId: string): FreeSignupCreditGrant | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const transaction = item.transaction && typeof item.transaction === "object"
    ? item.transaction as Record<string, unknown>
    : {};
  if (item.freeTrialGranted !== true) return null;

  const grant: FreeSignupCreditGrant = {
    userId: sanitizeString(item.userId),
    email: sanitizeString(item.email) || null,
    freeTrialGranted: true,
    amount: Math.max(0, Math.round(Number(item.amount) || FREE_SIGNUP_CREDIT_AMOUNT)),
    reason: sanitizeString(item.reason) || "Free signup credit",
    grantedAt: sanitizeString(item.grantedAt),
    expiresAt: sanitizeString(item.expiresAt) || FREE_SIGNUP_CREDIT_EXPIRES_AT,
    transaction: {
      type: "free_signup_credit",
      amount: FREE_SIGNUP_CREDIT_AMOUNT,
      reason: "New user free trial credit",
      createdAt: sanitizeString(transaction.createdAt) || sanitizeString(item.grantedAt),
    },
  };

  if (grant.userId !== expectedUserId || !grant.freeTrialGranted || !grant.grantedAt) return null;
  return grant;
}

function sanitizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
