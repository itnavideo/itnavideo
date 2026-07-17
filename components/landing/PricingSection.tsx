import { getRegionalPlanDisplayPrices } from "@/lib/billing/region";
import { PricingSectionClient } from "@/components/landing/PricingSectionClient";

export default async function PricingSection() {
  const { proPrice } = await getRegionalPlanDisplayPrices();
  return <PricingSectionClient proPrice={proPrice} />;
}
