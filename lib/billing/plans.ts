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

export const PRICE_VERSION = "2026-10-11-v5";

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free Trial",
    credits: 1,
    monthlyVideoLimit: 1,
    validDays: 3,
    billingCycle: "monthly",
    description: "Try ItnaVideo free. No credit card required.",
    features: [
      "1 free credit on signup",
      "1 × 9:16 Short Video (up to 90s)",
      "All 11 video studios unlocked",
      "1080p Full HD export",
      "No credit card required",
    ],
    button: "Get Started Free",
    href: "/signup",
    popular: false,
    billingPeriodLabel: "Free trial",
    razorpayPlanEnv: "",
    quotes: {
      USD: { currency: "USD", amount: 0, displayPrice: "$0", priceVersion: PRICE_VERSION },
      INR: { currency: "INR", amount: 0, displayPrice: "₹0", priceVersion: PRICE_VERSION },
    },
  },
  {
    id: "starter",
    name: "Basic",
    credits: 40,
    monthlyVideoLimit: 40,
    validDays: 30,
    billingCycle: "monthly",
    description: "Ultra-affordable starter pack for new creators.",
    features: [
      "40 credits valid for 30 days",
      "9:16 Shorts & Reels (up to 90s) — 1 credit",
      "16:9 Widescreen (up to 3 min) — 2 credits",
      "All 11 dedicated studios unlocked",
      "1080p Full HD, zero watermark",
    ],
    button: "Buy Basic — ₹499",
    href: "/pricing",
    popular: false,
    billingPeriodLabel: "30-day pack",
    razorpayPlanEnv: "RAZORPAY_PLAN_STARTER",
    quotes: {
      USD: { currency: "USD", amount: 600, displayPrice: "$6", priceVersion: PRICE_VERSION },
      INR: { currency: "INR", amount: 49900, displayPrice: "₹499", priceVersion: PRICE_VERSION },
      EUR: { currency: "EUR", amount: 600, displayPrice: "€6", priceVersion: PRICE_VERSION },
      GBP: { currency: "GBP", amount: 500, displayPrice: "£5", priceVersion: PRICE_VERSION },
      AED: { currency: "AED", amount: 2200, displayPrice: "22 AED", priceVersion: PRICE_VERSION },
      THB: { currency: "THB", amount: 21000, displayPrice: "210 ฿", priceVersion: PRICE_VERSION },
    },
  },
  {
    id: "growth",
    name: "Growth",
    credits: 90,
    monthlyVideoLimit: 90,
    validDays: 30,
    billingCycle: "monthly",
    description: "Best value for active creators publishing weekly.",
    features: [
      "90 credits valid for 30 days",
      "9:16 Shorts & Reels (up to 90s) — 1 credit",
      "16:9 Widescreen (up to 3 min) — 2 credits",
      "Faceless Video, Image to Video & Book Summary",
      "AI Audio Cleaner & Priority Queue",
      "1080p Full HD, zero watermark",
    ],
    button: "Buy Growth — ₹999",
    href: "/pricing",
    popular: true,
    billingPeriodLabel: "30-day pack",
    razorpayPlanEnv: "RAZORPAY_PLAN_GROWTH",
    quotes: {
      USD: { currency: "USD", amount: 1200, displayPrice: "$12", priceVersion: PRICE_VERSION },
      INR: { currency: "INR", amount: 99900, displayPrice: "₹999", priceVersion: PRICE_VERSION },
      EUR: { currency: "EUR", amount: 1200, displayPrice: "€12", priceVersion: PRICE_VERSION },
      GBP: { currency: "GBP", amount: 1000, displayPrice: "£10", priceVersion: PRICE_VERSION },
      AED: { currency: "AED", amount: 4400, displayPrice: "44 AED", priceVersion: PRICE_VERSION },
      THB: { currency: "THB", amount: 42000, displayPrice: "420 ฿", priceVersion: PRICE_VERSION },
    },
  },
  {
    id: "pro",
    name: "Pro Agency",
    credits: 200,
    monthlyVideoLimit: 200,
    validDays: 30,
    billingCycle: "monthly",
    description: "High-volume power pack for agencies & multi-channel creators.",
    features: [
      "200 credits valid for 30 days",
      "9:16 Shorts & Reels (up to 90s) — 1 credit",
      "16:9 Widescreen (up to 3 min) — 2 credits",
      "All 11 dedicated studios unlocked",
      "Priority fast-lane rendering",
      "1080p Full HD, zero watermark",
    ],
    button: "Buy Pro — ₹1,999",
    href: "/pricing",
    popular: false,
    billingPeriodLabel: "30-day pack",
    razorpayPlanEnv: "RAZORPAY_PLAN_PRO",
    quotes: {
      USD: { currency: "USD", amount: 2400, displayPrice: "$24", priceVersion: PRICE_VERSION },
      INR: { currency: "INR", amount: 199900, displayPrice: "₹1,999", priceVersion: PRICE_VERSION },
      EUR: { currency: "EUR", amount: 2400, displayPrice: "€24", priceVersion: PRICE_VERSION },
      GBP: { currency: "GBP", amount: 1900, displayPrice: "£19", priceVersion: PRICE_VERSION },
      AED: { currency: "AED", amount: 8800, displayPrice: "88 AED", priceVersion: PRICE_VERSION },
      THB: { currency: "THB", amount: 84000, displayPrice: "840 ฿", priceVersion: PRICE_VERSION },
    },
  },
];

export function getPricingPlan(planId: string) {
  const clean = (planId || "").trim().toLowerCase();
  if (clean === "free" || clean === "trial") {
    return pricingPlans.find((p) => p.id === "free") || pricingPlans[0];
  }
  if (clean === "starter" || clean === "basic" || clean === "starter_pack" || clean === "starter-pack" || clean === "basic-499") {
    return pricingPlans.find((p) => p.id === "starter") || pricingPlans[1];
  }
  if (clean === "growth" || clean === "growth_pack" || clean === "growth-999" || clean === "creator") {
    return pricingPlans.find((p) => p.id === "growth") || pricingPlans[2];
  }
  if (clean === "pro" || clean === "agency" || clean === "channel" || clean === "studio" || clean === "pro-1999") {
    return pricingPlans.find((p) => p.id === "pro") || pricingPlans[3];
  }
  return pricingPlans.find((plan) => plan.id === clean) || null;
}

export function getPlanQuoteForCurrency(plan: PricingPlan, currency: string) {
  return plan.quotes[currency.toUpperCase() as BillingCurrency] || plan.quotes.INR || plan.quotes.USD;
}

export function resolvePlanQuoteForCountry(plan: PricingPlan, countryCode?: string | null) {
  const currency = countryCurrency(countryCode);
  const quote = plan.quotes[currency] || plan.quotes.INR || plan.quotes.USD;
  return {
    ...quote,
    displayPrice: quote.displayPrice || "₹0",
  };
}

export function getRazorpayPlanId(plan: PricingPlan, currency: BillingCurrency = "INR") {
  if (!plan.razorpayPlanEnv) return "";
  const env = currency === "INR" ? plan.razorpayPlanEnv : `${plan.razorpayPlanEnv}_${currency}`;
  return process.env[env]?.trim() || "";
}

function countryCurrency(countryCode?: string | null): BillingCurrency {
  const country = (countryCode || "").toUpperCase();
  if (country === "IN" || !countryCode) return "INR";
  if (country === "US") return "USD";
  if (["GB", "UK"].includes(country)) return "GBP";
  if (country === "AE") return "AED";
  if (country === "TH") return "THB";
  if (["AT", "BE", "CY", "DE", "EE", "ES", "FI", "FR", "GR", "HR", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PT", "SI", "SK"].includes(country)) return "EUR";
  return "INR";
}
