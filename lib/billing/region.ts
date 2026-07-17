import { headers } from "next/headers";
import { getPricingPlan, resolvePlanQuoteForCountry } from "@/lib/billing/plans";

/**
 * Resolves the visitor's billing region from the trusted Vercel edge header
 * and returns exactly ONE local price per plan. Never expose both INR and
 * USD together — the visitor should only ever see their own region's price.
 */
export async function getRegionalPlanDisplayPrices() {
  const headersList = await headers();
  const countryCode = headersList.get("x-vercel-ip-country") || "";

  const proPlan = getPricingPlan("pro");
  const businessPlan = getPricingPlan("business");

  return {
    countryCode,
    proPrice: proPlan ? resolvePlanQuoteForCountry(proPlan, countryCode).displayPrice : "₹499",
    businessPrice: businessPlan ? resolvePlanQuoteForCountry(businessPlan, countryCode).displayPrice : "₹1,499",
  };
}
