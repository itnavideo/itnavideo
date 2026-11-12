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
  if (!ent.active) return true; // no active plan at all
  if (ent.planId === 'free-signup-credit') return true; // free trial tier
  if (ent.planId === 'founder-test') return false; // founder always has full access
  if (ent.planId === 'dev-test') return false; // local dev always has full access
  return false; // active paid plan
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
