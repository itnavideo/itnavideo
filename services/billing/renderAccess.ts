import { getBillingEntitlementFromServer, isEntitlementActive } from "@/services/supabase/billingStore";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  countRenderHistoryInWindowFromServer,
  getAppSettingFromServer,
  setAppSettingFromServer,
} from "@/services/supabase/siteStore";
import {
  ensureFreeSignupCreditForUser,
  getFreeSignupCreditWindow,
  isFreeSignupCreditActive,
} from "@/services/supabase/freeTrialCredits";

const USAGE_PREFIX = "render_usage";
const USAGE_LEDGER_LIMIT = 600;
const FOUNDER_TEST_LIMIT = 999;
const FOUNDER_TEST_START_AT = "2000-01-01T00:00:00.000Z";
const FOUNDER_TEST_EXPIRES_AT = "2099-12-31T23:59:59.000Z";

type UsageEntry = {
  renderId: string;
  createdAt: string;
  mode?: string;
  title?: string;
};

type UsageLedger = {
  userId: string;
  renders: UsageEntry[];
};

export type RenderAccess = {
  allowed: boolean;
  planId: string;
  planName: string;
  activePaidPlan: boolean;
  used: number;
  limit: number;
  remaining: number;
  expiresAt?: string;
  reason?: string;
};

export async function getRenderAccessForUser(userId: string): Promise<RenderAccess> {
  const cleanUserId = sanitizeString(userId);
  if (!cleanUserId || cleanUserId === "anonymous") {
    return {
      allowed: false,
      planId: "none",
      planName: "Account required",
      activePaidPlan: false,
      used: 0,
      limit: 0,
      remaining: 0,
      reason: "Please log in before creating a reel.",
    };
  }

  const founderAccess = await getFounderTestAccessForUser(cleanUserId);
  if (founderAccess) return founderAccess;

  const entitlement = await getBillingEntitlementFromServer(cleanUserId);
  if (isEntitlementActive(entitlement) && entitlement) {
    const used = await getWindowUsage(cleanUserId, entitlement.activatedAt, entitlement.expiresAt);
    const limit = Math.max(0, entitlement.monthlyVideoLimit);
    const remaining = Math.max(0, limit - used);
    return {
      allowed: remaining > 0,
      planId: entitlement.planId,
      planName: entitlement.planName,
      activePaidPlan: true,
      used,
      limit,
      remaining,
      expiresAt: entitlement.expiresAt,
      reason: remaining > 0
        ? undefined
        : `Your ${entitlement.planName} plan limit is complete for this billing period. Please upgrade or wait for renewal.`,
    };
  }

  const freeSignupCredit = await ensureFreeSignupCreditForUser(cleanUserId);
  if (isFreeSignupCreditActive(freeSignupCredit) && freeSignupCredit) {
    const window = getFreeSignupCreditWindow(freeSignupCredit);
    const used = await getWindowUsage(cleanUserId, window.startAt, window.endAt);
    const remaining = Math.max(0, window.limit - used);
    return {
      allowed: remaining > 0,
      planId: "free-signup-credit",
      planName: "Free Signup Credit",
      activePaidPlan: false,
      used,
      limit: window.limit,
      remaining,
      expiresAt: window.endAt,
      reason: remaining > 0
        ? undefined
        : "Your free signup credit is used. Upgrade or buy credits to create more reels.",
    };
  }

  return {
    allowed: false,
    planId: "test",
    planName: "Test Itnavideo",
    activePaidPlan: false,
    used: 0,
    limit: 0,
    remaining: 0,
    reason: "Please buy the ₹9 Test Itnavideo plan to create your first reel.",
  };
}

export async function getFounderTestAccessForUser(userId: string): Promise<RenderAccess | null> {
  const cleanUserId = sanitizeString(userId);
  if (!cleanUserId || cleanUserId === "anonymous") return null;

  const founderEmail = await getUserEmailFromServer(cleanUserId);
  if (!isFounderTestEmail(founderEmail)) return null;

  const used = await getWindowUsage(cleanUserId, FOUNDER_TEST_START_AT, FOUNDER_TEST_EXPIRES_AT);
  const remaining = Math.max(0, FOUNDER_TEST_LIMIT - used);
  return {
    allowed: remaining > 0,
    planId: "founder-test",
    planName: "Founder Test",
    activePaidPlan: true,
    used,
    limit: FOUNDER_TEST_LIMIT,
    remaining,
    expiresAt: FOUNDER_TEST_EXPIRES_AT,
    reason: remaining > 0 ? undefined : "Founder test render limit is complete.",
  };
}

export async function getBillingUsageForUser(userId: string, startAt: string, endAt: string, limit: number) {
  const used = await getWindowUsage(userId, startAt, endAt);
  const safeLimit = Math.max(0, Math.round(Number(limit) || 0));
  return {
    used,
    limit: safeLimit,
    remaining: Math.max(0, safeLimit - used),
  };
}

export async function recordRenderUsageFromServer(input: {
  userId: string;
  renderId: string;
  createdAt?: string | number | Date;
  mode?: string;
  title?: string;
}) {
  const userId = sanitizeString(input.userId);
  const renderId = sanitizeString(input.renderId);
  if (!userId || userId === "anonymous") throw new Error("User id is required.");
  if (!renderId || renderId === "current-render") throw new Error("Render id is required.");

  const ledger = await readUsageLedger(userId);
  if (ledger.renders.some((entry) => entry.renderId === renderId)) return ledger;

  const createdAt = parseDate(input.createdAt) || new Date();
  const nextLedger: UsageLedger = {
    userId,
    renders: [
      {
        renderId,
        createdAt: createdAt.toISOString(),
        mode: sanitizeString(input.mode) || undefined,
        title: sanitizeString(input.title).slice(0, 120) || undefined,
      },
      ...ledger.renders,
    ].slice(0, USAGE_LEDGER_LIMIT),
  };

  await setAppSettingFromServer(usageKey(userId), nextLedger, "render-usage");
  return nextLedger;
}

async function getWindowUsage(userId: string, startAt: string, endAt: string) {
  const ledgerCount = countLedgerInWindow(await readUsageLedger(userId), startAt, endAt);
  const historyCount = await countRenderHistoryInWindowFromServer(userId, startAt, endAt);
  return Math.max(ledgerCount, historyCount);
}

async function readUsageLedger(userId: string): Promise<UsageLedger> {
  const value = await getAppSettingFromServer<unknown>(usageKey(userId), null);
  if (!value || typeof value !== "object") return { userId, renders: [] };
  const item = value as Record<string, unknown>;
  const renders = Array.isArray(item.renders)
    ? item.renders
        .map((entry) => normalizeUsageEntry(entry))
        .filter((entry): entry is UsageEntry => Boolean(entry))
    : [];
  return { userId, renders };
}

async function getUserEmailFromServer(userId: string) {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.auth.admin.getUserById(userId);
    if (error) return "";
    return sanitizeString(data.user?.email).toLowerCase();
  } catch {
    return "";
  }
}

function isFounderTestEmail(email: string) {
  const normalizedEmail = sanitizeString(email).toLowerCase();
  if (!normalizedEmail) return false;
  return getFounderTestEmails().includes(normalizedEmail);
}

function getFounderTestEmails() {
  return (process.env.FOUNDER_TEST_EMAILS || process.env.INTERNAL_TEST_EMAILS || "")
    .split(/[\s,;]+/)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function normalizeUsageEntry(value: unknown): UsageEntry | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const renderId = sanitizeString(item.renderId);
  const createdAt = sanitizeString(item.createdAt);
  if (!renderId || !createdAt) return null;
  return {
    renderId,
    createdAt,
    mode: sanitizeString(item.mode) || undefined,
    title: sanitizeString(item.title) || undefined,
  };
}

function countLedgerInWindow(ledger: UsageLedger, startAt: string, endAt: string) {
  const start = parseDate(startAt);
  const end = parseDate(endAt);
  if (!start || !end) return 0;
  return ledger.renders.filter((entry) => {
    const createdAt = parseDate(entry.createdAt);
    return createdAt && createdAt >= start && createdAt <= end;
  }).length;
}

function usageKey(userId: string) {
  return `${USAGE_PREFIX}:${userId}`;
}

function parseDate(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "number" && Number.isFinite(value)) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  if (typeof value === "string" && value.trim()) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
}

function sanitizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
