import { CREDIT_UNITS_PER_CREDIT, type BillableRenderMode, normalizeCreditUnits } from "@/lib/billing/creditPricing";
import { getBillingEntitlementFromServer, getEntitlementCreditWindow, isEntitlementActive } from "@/services/supabase/billingStore";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { countRenderHistoryInWindowFromServer, getAppSettingFromServer, setAppSettingFromServer } from "@/services/supabase/siteStore";
import { ensureFreeSignupCreditForUser, getFreeSignupCreditWindow, isFreeSignupCreditActive } from "@/services/supabase/freeTrialCredits";

const USAGE_PREFIX = "render_usage";
const USAGE_LEDGER_LIMIT = 600;
const RESERVATION_TTL_MS = 24 * 60 * 60 * 1000;
const FOUNDER_TEST_LIMIT = 999;
const FOUNDER_TEST_START_AT = "2000-01-01T00:00:00.000Z";
const FOUNDER_TEST_EXPIRES_AT = "2099-12-31T23:59:59.000Z";

type UsageStatus = "reserved" | "settled" | "released";
type UsageEntry = { renderId: string; createdAt: string; mode?: string; title?: string; creditUnits?: number; status?: UsageStatus };
type UsageLedger = { userId: string; renders: UsageEntry[] };

export type RenderAccess = {
  allowed: boolean;
  planId: string;
  planName: string;
  activePaidPlan: boolean;
  used: number;
  limit: number;
  remaining: number;
  expiresAt?: string;
  watermark?: boolean;
  reason?: string;
};

type RenderAccessRequest = {
  mode?: BillableRenderMode;
  creditUnits?: number;
};

export async function getRenderAccessForUser(userId: string, request: RenderAccessRequest = {}): Promise<RenderAccess> {
  const cleanUserId = sanitizeString(userId);
  const requiredCreditUnits = normalizeCreditUnits(request.creditUnits, CREDIT_UNITS_PER_CREDIT);
  if (!cleanUserId || cleanUserId === "anonymous") return deniedAccess("none", "Account required", "Please log in before creating a video.");

  const founderAccess = await getFounderTestAccessForUser(cleanUserId, requiredCreditUnits);
  if (founderAccess) return founderAccess;

  const entitlement = await getBillingEntitlementFromServer(cleanUserId);
  if (isEntitlementActive(entitlement) && entitlement) {
    const creditWindow = getEntitlementCreditWindow(entitlement);
    return accessForWindow(cleanUserId, entitlement.planId, entitlement.planName, true, creditWindow.startAt, creditWindow.endAt, entitlement.monthlyVideoLimit, requiredCreditUnits);
  }

  const freeSignupCredit = await ensureFreeSignupCreditForUser(cleanUserId);
  if (isFreeSignupCreditActive(freeSignupCredit) && freeSignupCredit) {
    if (request.mode !== "autoCaption" || requiredCreditUnits > CREDIT_UNITS_PER_CREDIT) {
      return deniedAccess("free-signup-credit", "1 Free Watermarked Auto Caption", "Your one free trial is only for a watermarked Auto Caption Video. Buy credits to use other video types.");
    }
    const window = getFreeSignupCreditWindow(freeSignupCredit);
    const trialAccess = await accessForWindow(cleanUserId, "free-signup-credit", "1 Free Watermarked Auto Caption", false, window.startAt, window.endAt, window.limit, requiredCreditUnits);
    return {...trialAccess, watermark: trialAccess.allowed};
  }

  return deniedAccess("credits-required", "Credits required", "Upgrade to Pro or Business to create another video.");
}

export async function getFounderTestAccessForUser(userId: string, requiredCreditUnits = CREDIT_UNITS_PER_CREDIT): Promise<RenderAccess | null> {
  const cleanUserId = sanitizeString(userId);
  if (!cleanUserId || cleanUserId === "anonymous") return null;
  const founderEmail = cleanUserId.includes("@") ? cleanUserId.toLowerCase() : await getUserEmailFromServer(cleanUserId);
  if (!isFounderTestEmail(founderEmail)) return null;
  return accessForWindow(cleanUserId, "founder-test", "Founder Test", true, FOUNDER_TEST_START_AT, FOUNDER_TEST_EXPIRES_AT, FOUNDER_TEST_LIMIT, requiredCreditUnits);
}

export async function getBillingUsageForUser(userId: string, startAt: string, endAt: string, limit: number) {
  const usedUnits = await getWindowUsageUnits(userId, startAt, endAt);
  const limitUnits = Math.max(0, Math.round(Number(limit) || 0)) * CREDIT_UNITS_PER_CREDIT;
  return usageSummary(usedUnits, limitUnits);
}

export async function reserveRenderUsageFromServer(input: { userId: string; renderId: string; creditUnits: number; createdAt?: string | number | Date; mode?: string; title?: string }) {
  const userId = requireUserId(input.userId);
  const renderId = requireRenderId(input.renderId);
  const ledger = await readUsageLedger(userId);
  if (ledger.renders.some((entry) => entry.renderId === renderId)) return ledger;
  const createdAt = parseDate(input.createdAt) || new Date();
  const nextLedger: UsageLedger = {
    userId,
    renders: [{ renderId, createdAt: createdAt.toISOString(), mode: sanitizeString(input.mode) || undefined, title: sanitizeString(input.title).slice(0, 120) || undefined, creditUnits: normalizeCreditUnits(input.creditUnits), status: "reserved" as UsageStatus }, ...ledger.renders].slice(0, USAGE_LEDGER_LIMIT),
  };
  await setAppSettingFromServer(usageKey(userId), nextLedger, "render-usage");
  return nextLedger;
}

export async function recordRenderUsageFromServer(input: { userId: string; renderId: string; createdAt?: string | number | Date; mode?: string; title?: string; creditUnits?: number }) {
  const userId = requireUserId(input.userId);
  const renderId = requireRenderId(input.renderId);
  const ledger = await readUsageLedger(userId);
  const createdAt = parseDate(input.createdAt) || new Date();
  const existing = ledger.renders.find((entry) => entry.renderId === renderId);
  if (existing?.status === "settled") return ledger;
  const settled: UsageEntry = {
    renderId,
    createdAt: existing?.createdAt || createdAt.toISOString(),
    mode: existing?.mode || sanitizeString(input.mode) || undefined,
    title: existing?.title || sanitizeString(input.title).slice(0, 120) || undefined,
    creditUnits: normalizeCreditUnits(existing?.creditUnits ?? input.creditUnits),
    status: "settled",
  };
  const nextLedger: UsageLedger = {
    userId,
    renders: existing ? ledger.renders.map((entry) => entry.renderId === renderId ? settled : entry) : [settled, ...ledger.renders].slice(0, USAGE_LEDGER_LIMIT),
  };
  await setAppSettingFromServer(usageKey(userId), nextLedger, "render-usage");
  return nextLedger;
}

export async function releaseReservedRenderUsageFromServer(input: { userId: string; renderId: string }) {
  const userId = requireUserId(input.userId);
  const renderId = requireRenderId(input.renderId);
  const ledger = await readUsageLedger(userId);
  const existing = ledger.renders.find((entry) => entry.renderId === renderId);
  if (!existing || existing.status !== "reserved") return ledger;
  const nextLedger: UsageLedger = { userId, renders: ledger.renders.map((entry) => entry.renderId === renderId ? {...entry, status: "released" as const} : entry) };
  await setAppSettingFromServer(usageKey(userId), nextLedger, "render-usage");
  return nextLedger;
}

async function accessForWindow(userId: string, planId: string, planName: string, activePaidPlan: boolean, startAt: string, endAt: string, limitCredits: number, requiredCreditUnits: number): Promise<RenderAccess> {
  const limitUnits = Math.max(0, Math.round(Number(limitCredits) || 0)) * CREDIT_UNITS_PER_CREDIT;
  const usedUnits = await getWindowUsageUnits(userId, startAt, endAt);
  const summary = usageSummary(usedUnits, limitUnits);
  const required = normalizeCreditUnits(requiredCreditUnits);
  return { allowed: summary.remaining * CREDIT_UNITS_PER_CREDIT >= required, planId, planName, activePaidPlan, ...summary, expiresAt: endAt, reason: summary.remaining * CREDIT_UNITS_PER_CREDIT >= required ? undefined : `Your ${planName} plan does not have enough credits for this video.` };
}

function deniedAccess(planId: string, planName: string, reason: string): RenderAccess {
  return { allowed: false, planId, planName, activePaidPlan: false, used: 0, limit: 0, remaining: 0, reason };
}

function usageSummary(usedUnits: number, limitUnits: number) {
  return { used: usedUnits / CREDIT_UNITS_PER_CREDIT, limit: limitUnits / CREDIT_UNITS_PER_CREDIT, remaining: Math.max(0, limitUnits - usedUnits) / CREDIT_UNITS_PER_CREDIT };
}

async function getWindowUsageUnits(userId: string, startAt: string, endAt: string) {
  const ledgerUnits = countLedgerUnitsInWindow(await readUsageLedger(userId), startAt, endAt);
  let historyUnits = 0;
  try {
    historyUnits = (await countRenderHistoryInWindowFromServer(userId, startAt, endAt)) * CREDIT_UNITS_PER_CREDIT;
  } catch (err) {
    console.warn("[renderAccess] countRenderHistoryInWindowFromServer failed:", err);
  }
  return Math.max(ledgerUnits, historyUnits);
}

async function readUsageLedger(userId: string): Promise<UsageLedger> {
  const value = await getAppSettingFromServer<unknown>(usageKey(userId), null);
  if (!value || typeof value !== "object") return { userId, renders: [] };
  const item = value as Record<string, unknown>;
  const renders = Array.isArray(item.renders) ? item.renders.map(normalizeUsageEntry).filter((entry): entry is UsageEntry => Boolean(entry)) : [];
  return { userId, renders };
}

function normalizeUsageEntry(value: unknown): UsageEntry | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const renderId = sanitizeString(item.renderId);
  const createdAt = sanitizeString(item.createdAt);
  if (!renderId || !createdAt) return null;
  const status = item.status === "reserved" || item.status === "released" || item.status === "settled" ? item.status : "settled";
  return { renderId, createdAt, mode: sanitizeString(item.mode) || undefined, title: sanitizeString(item.title) || undefined, creditUnits: normalizeCreditUnits(item.creditUnits), status };
}

function countLedgerUnitsInWindow(ledger: UsageLedger, startAt: string, endAt: string) {
  const start = parseDate(startAt);
  const end = parseDate(endAt);
  if (!start || !end) return 0;
  const now = Date.now();
  return ledger.renders.reduce((total, entry) => {
    const createdAt = parseDate(entry.createdAt);
    const isLiveReservation = entry.status === "reserved" && createdAt && now - createdAt.getTime() <= RESERVATION_TTL_MS;
    const chargeable = entry.status === "settled" || isLiveReservation;
    return chargeable && createdAt && createdAt >= start && createdAt <= end ? total + normalizeCreditUnits(entry.creditUnits) : total;
  }, 0);
}

async function getUserEmailFromServer(userId: string) {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.auth.admin.getUserById(userId);
    return error ? "" : sanitizeString(data.user?.email).toLowerCase();
  } catch { return ""; }
}

function isFounderTestEmail(email: string) {
  const normalizedEmail = sanitizeString(email).toLowerCase();
  return Boolean(normalizedEmail && getFounderTestEmails().includes(normalizedEmail));
}

function getFounderTestEmails() {
  const envEmails = (process.env.FOUNDER_TEST_EMAILS || process.env.INTERNAL_TEST_EMAILS || "").split(/[\s,;]+/).map((item) => item.trim().toLowerCase()).filter(Boolean);
  return Array.from(new Set([...envEmails, 'itnavideo@gmail.com']));
}

function requireUserId(value: string) {
  const userId = sanitizeString(value);
  if (!userId || userId === "anonymous") throw new Error("User id is required.");
  return userId;
}

function requireRenderId(value: string) {
  const renderId = sanitizeString(value);
  if (!renderId || renderId === "current-render") throw new Error("Render id is required.");
  return renderId;
}

function usageKey(userId: string) { return `${USAGE_PREFIX}:${userId}`; }
function parseDate(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "number" && Number.isFinite(value)) { const date = new Date(value); return Number.isNaN(date.getTime()) ? null : date; }
  if (typeof value === "string" && value.trim()) { const date = new Date(value); return Number.isNaN(date.getTime()) ? null : date; }
  return null;
}
function sanitizeString(value: unknown) { return typeof value === "string" ? value.trim() : ""; }
