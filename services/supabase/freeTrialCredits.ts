import { createSupabaseServerClient, isSupabaseServerConfigured } from "@/lib/supabase/server";
import { getAppSettingFromServer, setAppSettingFromServer } from "@/services/supabase/siteStore";

const FREE_SIGNUP_CREDIT_PREFIX = "free_signup_credit";
const FREE_SIGNUP_CREDIT_AMOUNT = 3;        // 3 total free videos (1 per day × 3 days)
const FREE_DAILY_VIDEO_LIMIT = 1;           // max 1 free video per calendar day
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
    amount: 3;
    reason: "New user free trial — 1 free video per day for 3 days";
    createdAt: string;
  };
};

export async function ensureFreeSignupCreditForUser(userId: string) {
  const cleanUserId = sanitizeString(userId);
  if (!cleanUserId || cleanUserId === "anonymous") return null;

  try {
    if (!isSupabaseServerConfigured()) return null;

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
        reason: "New user free trial — 1 free video per day for 3 days",
        createdAt: now,
      },
    };

    await setAppSettingFromServer(freeSignupCreditKey(cleanUserId), grant, "free-signup-credit");
    return grant;
  } catch (error) {
    console.warn(`[freeTrialCredits] Failed to ensure free credit: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

export async function getFreeSignupCreditForUser(userId: string) {
  const cleanUserId = sanitizeString(userId);
  if (!cleanUserId) return null;
  try {
    if (!isSupabaseServerConfigured()) return null;
    return normalizeFreeSignupCredit(
      await getAppSettingFromServer<unknown>(freeSignupCreditKey(cleanUserId), null),
      cleanUserId,
    );
  } catch {
    return null;
  }
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
      reason: "New user free trial — 1 free video per day for 3 days",
      createdAt: sanitizeString(transaction.createdAt) || sanitizeString(item.grantedAt),
    },
  };

  if (grant.userId !== expectedUserId || !grant.freeTrialGranted || !grant.grantedAt) return null;
  return grant;
}

// ─── Daily Rate Limit ─────────────────────────────────────────────────────────
// Free users can create at most FREE_DAILY_VIDEO_LIMIT video(s) per calendar day.
// Pass in the user's render history (list of ISO date strings) for today.
// Returns true if the user is still allowed to render today.
export function isFreeUserAllowedToday(rendersToday: number): boolean {
  return rendersToday < FREE_DAILY_VIDEO_LIMIT;
}

// Compute how many videos a free user has used today from a ledger of timestamps.
export function countFreeRendersToday(renderTimestamps: string[]): number {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  return renderTimestamps.filter((ts) => {
    const d = new Date(ts);
    return !Number.isNaN(d.getTime()) && d >= todayStart && d <= todayEnd;
  }).length;
}

export { FREE_DAILY_VIDEO_LIMIT };

function sanitizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
