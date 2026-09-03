export type BillingCurrency = "INR" | "USD" | "EUR" | "AED" | "THB" | "GBP";

export type PricingQuote = {
  currency: BillingCurrency;
  amount: number;
  displayPrice: string;
  priceVersion: string;
};

export type PricingPlan = {
  id: string;
  name: string;
  credits: number;
  monthlyVideoLimit: number;
  validDays: number;
  billingCycle: "monthly" | "annual";
  description: string;
  features: string[];
  button: string;
  href: string;
  popular: boolean;
  billingPeriodLabel: string;
  razorpayPlanEnv: string;
  quotes: Partial<Record<BillingCurrency, PricingQuote>> & { INR: PricingQuote };
};

export const PRICE_VERSION = "2026-09-01-v2";

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    credits: 15,
    monthlyVideoLimit: 15,
    validDays: 30,
    billingCycle: "monthly",
    description: "Ideal for trying out & quick video creation needs.",
    features: [
      "15 Video Credits / month (₹6.6 / video)",
      "Auto Caption Generator (All 10 Styles)",
      "Standard 9:16 & 16:9 Formats",
      "1080p Full HD, zero watermark",
      "Credits valid for 30 days",
      "Cancel or recharge anytime",
    ],
    button: "Get Starter (₹99/mo)",
    href: "/pricing",
    popular: false,
    billingPeriodLabel: "month",
    razorpayPlanEnv: "RAZORPAY_PLAN_STARTER",
    quotes: {
      INR: { currency: "INR", amount: 9900, displayPrice: "₹99", priceVersion: PRICE_VERSION },
      USD: { currency: "USD", amount: 200, displayPrice: "$2", priceVersion: PRICE_VERSION },
      EUR: { currency: "EUR", amount: 200, displayPrice: "€2", priceVersion: PRICE_VERSION },
      AED: { currency: "AED", amount: 800, displayPrice: "AED 8", priceVersion: PRICE_VERSION },
      THB: { currency: "THB", amount: 7500, displayPrice: "฿75", priceVersion: PRICE_VERSION },
      GBP: { currency: "GBP", amount: 200, displayPrice: "£2", priceVersion: PRICE_VERSION },
    },
  },
  {
    id: "pro",
    name: "Creator Pro",
    credits: 100,
    monthlyVideoLimit: 100,
    validDays: 30,
    billingCycle: "monthly",
    description: "Best value for active creators, reels & daily posters.",
    features: [
      "100 Video Credits / month (₹4.9 / video — Best Value)",
      "All Templates & Auto Caption Generator",
      "Priority Fast Lambda Render Queue",
      "1080p Full HD & 4K Export",
      "Credits valid for 30 days",
      "Cancel or recharge anytime",
    ],
    button: "Get Creator Pro (₹499/mo)",
    href: "/pricing",
    popular: true,
    billingPeriodLabel: "month",
    razorpayPlanEnv: "RAZORPAY_PLAN_PRO",
    quotes: {
      INR: { currency: "INR", amount: 49900, displayPrice: "₹499", priceVersion: PRICE_VERSION },
      USD: { currency: "USD", amount: 600, displayPrice: "$6", priceVersion: PRICE_VERSION },
      EUR: { currency: "EUR", amount: 600, displayPrice: "€6", priceVersion: PRICE_VERSION },
      AED: { currency: "AED", amount: 2500, displayPrice: "AED 25", priceVersion: PRICE_VERSION },
      THB: { currency: "THB", amount: 22000, displayPrice: "฿220", priceVersion: PRICE_VERSION },
      GBP: { currency: "GBP", amount: 500, displayPrice: "£5", priceVersion: PRICE_VERSION },
    },
  },
];

export function getPricingPlan(planId: string) {
  const clean = (planId || "").trim().toLowerCase();
  if (clean === "starter" || clean === "creator" || clean === "starter_pack" || clean === "starter-pack" || clean === "starter-99") {
    return pricingPlans.find((p) => p.id === "starter") || pricingPlans[0];
  }
  if (clean === "pro" || clean === "channel" || clean === "agency" || clean === "creator_pro_pack" || clean === "creator-pro" || clean === "pro-499") {
    return pricingPlans.find((p) => p.id === "pro") || pricingPlans[1];
  }
  return pricingPlans.find((plan) => plan.id === clean) || null;
}

export function getPlanQuoteForCurrency(plan: PricingPlan, currency: string) {
  return plan.quotes[currency.toUpperCase() as BillingCurrency] || plan.quotes.INR;
}

export function resolvePlanQuoteForCountry(plan: PricingPlan, countryCode?: string | null) {
  const currency = countryCurrency(countryCode);
  return plan.quotes[currency] || plan.quotes.INR;
}

export function getRazorpayPlanId(plan: PricingPlan, currency: BillingCurrency = "INR") {
  if (!plan.razorpayPlanEnv) return "";
  const env = currency === "INR" ? plan.razorpayPlanEnv : `${plan.razorpayPlanEnv}_${currency}`;
  return process.env[env]?.trim() || "";
}

function countryCurrency(countryCode?: string | null): BillingCurrency {
  const country = (countryCode || "").toUpperCase();
  if (country === "US") return "USD";
  if (["GB", "UK"].includes(country)) return "GBP";
  if (country === "AE") return "AED";
  if (country === "TH") return "THB";
  if (["AT", "BE", "CY", "DE", "EE", "ES", "FI", "FR", "GR", "HR", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PT", "SI", "SK"].includes(country)) return "EUR";
  return "INR";
}
