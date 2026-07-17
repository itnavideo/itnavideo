export type BillingCurrency = "INR" | "USD";

export type PricingQuote = {
  currency: BillingCurrency;
  amount: number;
  displayPrice: string;
  priceVersion: string;
};

export type PricingPlan = {
  id: string;
  name: string;
  monthlyVideoLimit: number;
  validDays: number;
  description: string;
  features: string[];
  button: string;
  href: string;
  popular: boolean;
  billingPeriodLabel: string;
  quotes: Record<BillingCurrency, PricingQuote>;
};

export const PRICE_VERSION = "2026-07-24";

export const pricingPlans: PricingPlan[] = [
  {
    id: "pro",
    name: "Pro",
    monthlyVideoLimit: 25,
    validDays: 31,
    description: "For creators who publish regularly.",
    features: [
      "25 AI videos/month",
      "No watermark",
      "All templates",
      "Faster generation",
      "Commercial use",
      "Priority support",
    ],
    button: "Upgrade to Pro",
    href: "/pricing",
    popular: true,
    billingPeriodLabel: "/month",
    quotes: {
      INR: {currency: "INR", amount: 49900, displayPrice: "₹499", priceVersion: PRICE_VERSION},
      USD: {currency: "USD", amount: 1900, displayPrice: "$19", priceVersion: PRICE_VERSION},
    },
  },
  {
    id: "business",
    name: "Business",
    monthlyVideoLimit: 65,
    validDays: 31,
    description: "For teams and agencies creating at scale.",
    features: [
      "65 AI videos/month",
      "Team collaboration",
      "Brand Kit",
      "Premium templates",
      "Faster rendering",
      "Early access to new features",
      "Priority support",
    ],
    button: "Get Business",
    href: "/pricing",
    popular: false,
    billingPeriodLabel: "/month",
    quotes: {
      INR: {currency: "INR", amount: 149900, displayPrice: "₹1,499", priceVersion: PRICE_VERSION},
      USD: {currency: "USD", amount: 4900, displayPrice: "$49", priceVersion: PRICE_VERSION},
    },
  },
];

export function getPricingPlan(planId: string) {
  return pricingPlans.find((plan) => plan.id === planId) || null;
}

export function getPlanQuoteForCurrency(plan: PricingPlan, currency: string) {
  const normalizedCurrency = String(currency || "").toUpperCase() as BillingCurrency;
  return plan.quotes[normalizedCurrency] || null;
}

export function resolvePlanQuoteForCountry(plan: PricingPlan, countryCode?: string | null) {
  return String(countryCode || "").trim().toUpperCase() === "IN"
    ? plan.quotes.INR
    : plan.quotes.USD;
}
