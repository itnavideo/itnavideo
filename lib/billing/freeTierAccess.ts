/**
 * Free-tier feature access policy.
 *
 * Per product policy: free users (no active paid plan, including the free
 * signup-credit trial) may only use `autoCaption` and `youtubeSubtitleGenerator`.
 * All other video types require a paid plan.
 *
 * The free-vs-paid decision is made from the billing entitlement already fetched
 * by each dashboard page client. This keeps the gating consistent across features
 * and trivially adjustable in one place if the policy changes.
 */

export type FreeTierEntitlement = {
  active?: boolean;
  planId?: string;
  status?: string;
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

/**
 * A user is on the free tier when they have NO active paid plan. Both a missing
 * entitlement and the `free-signup-credit` trial count as free here, so the trial
 * only unlocks the two free features. Adjust this single function to change policy.
 */
export function isFreeTierUser(ent?: FreeTierEntitlement | null): boolean {
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
export function isFeatureLockedForUser(featureId: string, ent?: FreeTierEntitlement | null): boolean {
  if (!isFreeTierUser(ent)) return false; // paid users can access everything
  return !isFeatureFree(featureId);
}
