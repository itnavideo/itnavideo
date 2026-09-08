import { SubscriptionPricingCards } from "@/components/billing/SubscriptionPricingCards";
import { pricingPlans, resolvePlanQuoteForCountry } from "@/lib/billing/plans";

const defaultDisplayPrices = Object.fromEntries(
  pricingPlans.map((plan) => [plan.id, resolvePlanQuoteForCountry(plan, "IN").displayPrice])
);

export default function PricingSection() {
  return <SubscriptionPricingCards displayPrices={defaultDisplayPrices} />;
}
