import { headers } from "next/headers";
import { pricingPlans, resolvePlanQuoteForCountry } from "@/lib/billing/plans";

/**
 * Resolves the visitor's billing region and returns exact local price per plan.
 */
export async function getRegionalPlanDisplayPrices() {
  const headersList = await headers();
  const countryCode = headersList.get("x-vercel-ip-country") || "";

  const displayPrices = Object.fromEntries(pricingPlans.map((plan) => [plan.id, resolvePlanQuoteForCountry(plan, countryCode).displayPrice]));

  return {
    countryCode,
    displayPrices,
    freePrice: displayPrices.free || "$0",
    starterPrice: displayPrices.starter || "$29",
    growthPrice: displayPrices.growth || "$49",
    proPrice: displayPrices.pro || "$149",
    agencyPrice: displayPrices.pro || "$149",
    businessPrice: displayPrices.pro || "$149",
    enterprisePrice: displayPrices.pro || "$149",
  };
}
