import { SubscriptionPricingCards } from "@/components/billing/SubscriptionPricingCards";
import { getRegionalPlanDisplayPrices } from "@/lib/billing/region";

export default async function PricingSection() {
  const { displayPrices } = await getRegionalPlanDisplayPrices();
  return <SubscriptionPricingCards displayPrices={displayPrices} />;
}
