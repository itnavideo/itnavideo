/**
 * Free-tier feature access policy.
 *
 * Per product policy: free users (no active paid plan, including the free
 * signup-credit trial) may only use `autoCaption` and `youtubeSubtitleGenerator`.
 * All other video types require a paid plan.
 *
 * Founder accounts (itnavideo@gmail.com) have full unrestricted access across
 * every studio, feature, and resolution.
 */

export type FreeTierEntitlement = {
  active?: boolean;
  planId?: string;
  status?: string;
  email?: string | null;
  userId?: string | null;
  usage?: {
    used?: number;
    limit?: number;
    remaining?: number;
  };
};

/** Feature ids that remain accessible to free users. */
export const FREE_FEATURE_IDS = new Set<string>([
  'autoCaption',
  'youtubeSubtitleGenerator',
]);

export const PERMANENT_FOUNDER_EMAILS = new Set<string>([
  'itnavideo@gmail.com',
  'rohi@itnavideo.com',
]);

export const PERMANENT_FOUNDER_USER_IDS = new Set<string>([
  '349a5053-941d-4238-9924-4575d5755a24',
  'a50a8342-f362-4f49-adfe-fc7a9a4e14db',
]);

/**
 * A user is on the free tier when they have NO active paid plan. Both a missing
 * entitlement and the `free-signup-credit` trial count as free here, so the trial
 * only unlocks the two free features. Adjust this single function to change policy.
 */
export function isFreeTierUser(
  ent?: FreeTierEntitlement | null,
  userEmail?: string,
  userId?: string
): boolean {
  // 0. Founder bypass: itnavideo@gmail.com and founder UUIDs always have complete access to everything
  const normalizedEmail = (userEmail || ent?.email || '').toLowerCase().trim();
  const cleanId = (userId || ent?.userId || '').trim();

  if (
    PERMANENT_FOUNDER_EMAILS.has(normalizedEmail) ||
    normalizedEmail.includes('itnavideo') ||
    PERMANENT_FOUNDER_USER_IDS.has(cleanId)
  ) {
    return false; // Founder is never a free tier user! Full access unlocked.
  }

  if (!ent) return true; // entitlement not loaded yet → treat conservatively as free

  // 1. Founder and dev testers always have full access to all features
  if (
    ent.planId === 'founder-test' ||
    ent.planId === 'dev-test' ||
    ent.planId === 'dev-tester'
  ) {
    return false;
  }

  // 2. If user has active remaining credits on a paid/founder plan, unlock everything
  if (
    typeof ent.usage?.remaining === 'number' &&
    ent.usage.remaining > 0 &&
    ent.planId !== 'free-signup-credit'
  ) {
    return false;
  }

  // 3. Free trial signup credit is restricted to free features only
  if (ent.planId === 'free-signup-credit') return true;

  // 4. Inactive plan
  if (!ent.active && ent.status !== 'active') return true;

  // 5. Active paid plan
  return false;
}

/** Whether a given feature id is available to free-tier users. */
export function isFeatureFree(featureId: string): boolean {
  return FREE_FEATURE_IDS.has(featureId);
}

/**
 * Returns true if access to `featureId` should be blocked for the given
 * entitlement (i.e. the user is free AND the feature is not in the free set).
 */
export function isFeatureLockedForUser(
  featureId: string,
  ent?: FreeTierEntitlement | null,
  userEmail?: string,
  userId?: string
): boolean {
  if (!isFreeTierUser(ent, userEmail, userId)) return false; // paid/founder users can access everything
  return !isFeatureFree(featureId);
}
