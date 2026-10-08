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

export const PRICE_VERSION = "2026-10-06-v4";

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    credits: 20,
    monthlyVideoLimit: 3,
    validDays: 3,
    billingCycle: "monthly",
    description: "Try ItnaVideo before you commit.",
    features: [
      "3 days access • 20 free credits",
      "All 11 video studios unlocked",
      "9:16 Shorts & Reels (up to 3 min)",
      "1080p Full HD export",
      "No credit card required",
    ],
    button: "Get Started Free",
    href: "/signup",
    popular: false,
    billingPeriodLabel: "3-day trial",
    razorpayPlanEnv: "",
    quotes: {
      USD: { currency: "USD", amount: 0, displayPrice: "$0", priceVersion: PRICE_VERSION },
      INR: { currency: "INR", amount: 0, displayPrice: "$0", priceVersion: PRICE_VERSION },
    },
  },
  {
    id: "starter",
    name: "Starter",
    credits: 75,
    monthlyVideoLimit: 75,
    validDays: 30,
    billingCycle: "monthly",
    description: "For creators publishing Shorts & Reels consistently.",
    features: [
      "75 credits valid for 30 days",
      "9:16 Shorts & Reels — 1 credit / min",
      "16:9 YouTube videos — 2 credits / min",
      "All 11 dedicated studios unlocked",
      "1080p Full HD, zero watermark",
    ],
    button: "Buy Starter — $29",
    href: "/pricing",
    popular: false,
    billingPeriodLabel: "30-day pack",
    razorpayPlanEnv: "RAZORPAY_PLAN_STARTER",
    quotes: {
      USD: { currency: "USD", amount: 2900, displayPrice: "$29", priceVersion: PRICE_VERSION },
      INR: { currency: "INR", amount: 249900, displayPrice: "$29", priceVersion: PRICE_VERSION },
      EUR: { currency: "EUR", amount: 2700, displayPrice: "$29", priceVersion: PRICE_VERSION },
      GBP: { currency: "GBP", amount: 2300, displayPrice: "$29", priceVersion: PRICE_VERSION },
      AED: { currency: "AED", amount: 10700, displayPrice: "$29", priceVersion: PRICE_VERSION },
      THB: { currency: "THB", amount: 99000, displayPrice: "$29", priceVersion: PRICE_VERSION },
    },
  },
  {
    id: "growth",
    name: "Growth",
    credits: 135,
    monthlyVideoLimit: 135,
    validDays: 30,
    billingCycle: "monthly",
    description: "Best for serious creators.",
    features: [
      "135 credits valid for 30 days",
      "9:16 Shorts & Reels — 1 credit / min",
      "16:9 YouTube videos — 2 credits / min",
      "Faceless Video, Image to Video & Book Summary",
      "AI Audio Cleaner & Retake Detector",
      "1080p Full HD, zero watermark",
    ],
    button: "Buy Growth — $49",
    href: "/pricing",
    popular: true,
    billingPeriodLabel: "30-day pack",
    razorpayPlanEnv: "RAZORPAY_PLAN_GROWTH",
    quotes: {
      USD: { currency: "USD", amount: 4900, displayPrice: "$49", priceVersion: PRICE_VERSION },
      INR: { currency: "INR", amount: 419900, displayPrice: "$49", priceVersion: PRICE_VERSION },
      EUR: { currency: "EUR", amount: 4500, displayPrice: "$49", priceVersion: PRICE_VERSION },
      GBP: { currency: "GBP", amount: 3900, displayPrice: "$49", priceVersion: PRICE_VERSION },
      AED: { currency: "AED", amount: 18000, displayPrice: "$49", priceVersion: PRICE_VERSION },
      THB: { currency: "THB", amount: 169000, displayPrice: "$49", priceVersion: PRICE_VERSION },
    },
  },
  {
    id: "pro",
    name: "Pro",
    credits: 300,
    monthlyVideoLimit: 300,
    validDays: 30,
    billingCycle: "monthly",
    description: "High-volume power for agencies & multi-channel creators.",
    features: [
      "300 credits valid for 30 days",
      "9:16 Shorts & Reels — 1 credit / min",
      "16:9 YouTube videos — 2 credits / min",
      "All 11 dedicated studios unlocked",
      "Priority fast-lane rendering",
      "1080p Full HD, zero watermark",
    ],
    button: "Buy Pro — $149",
    href: "/pricing",
    popular: false,
    billingPeriodLabel: "30-day pack",
    razorpayPlanEnv: "RAZORPAY_PLAN_PRO",
    quotes: {
      USD: { currency: "USD", amount: 14900, displayPrice: "$149", priceVersion: PRICE_VERSION },
      INR: { currency: "INR", amount: 1249900, displayPrice: "$149", priceVersion: PRICE_VERSION },
      EUR: { currency: "EUR", amount: 13900, displayPrice: "$149", priceVersion: PRICE_VERSION },
      GBP: { currency: "GBP", amount: 11900, displayPrice: "$149", priceVersion: PRICE_VERSION },
      AED: { currency: "AED", amount: 54900, displayPrice: "$149", priceVersion: PRICE_VERSION },
      THB: { currency: "THB", amount: 519000, displayPrice: "$149", priceVersion: PRICE_VERSION },
    },
  },
];

export function getPricingPlan(planId: string) {
  const clean = (planId || "").trim().toLowerCase();
  if (clean === "free" || clean === "trial") {
    return pricingPlans.find((p) => p.id === "free") || pricingPlans[0];
  }
  if (clean === "starter" || clean === "starter_pack" || clean === "starter-pack" || clean === "starter-29") {
    return pricingPlans.find((p) => p.id === "starter") || pricingPlans[1];
  }
  if (clean === "growth" || clean === "growth_pack" || clean === "growth-49" || clean === "creator") {
    return pricingPlans.find((p) => p.id === "growth") || pricingPlans[2];
  }
  if (clean === "pro" || clean === "channel" || clean === "agency" || clean === "studio" || clean === "pro-149") {
    return pricingPlans.find((p) => p.id === "pro") || pricingPlans[3];
  }
  return pricingPlans.find((plan) => plan.id === clean) || null;
}

export function getPlanQuoteForCurrency(plan: PricingPlan, currency: string) {
  return plan.quotes[currency.toUpperCase() as BillingCurrency] || plan.quotes.USD || plan.quotes.INR;
}

export function resolvePlanQuoteForCountry(plan: PricingPlan, countryCode?: string | null) {
  const currency = countryCurrency(countryCode);
  const quote = plan.quotes[currency] || plan.quotes.USD || plan.quotes.INR;
  return {
    ...quote,
    displayPrice: plan.quotes.USD?.displayPrice || quote.displayPrice || "$0",
  };
}

export function getRazorpayPlanId(plan: PricingPlan, currency: BillingCurrency = "INR") {
  if (!plan.razorpayPlanEnv) return "";
  const env = currency === "INR" ? plan.razorpayPlanEnv : `${plan.razorpayPlanEnv}_${currency}`;
  return process.env[env]?.trim() || "";
}

function countryCurrency(countryCode?: string | null): BillingCurrency {
  const country = (countryCode || "").toUpperCase();
  if (country === "IN") return "INR";
  if (country === "US") return "USD";
  if (["GB", "UK"].includes(country)) return "GBP";
  if (country === "AE") return "AED";
  if (country === "TH") return "THB";
  if (["AT", "BE", "CY", "DE", "EE", "ES", "FI", "FR", "GR", "HR", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PT", "SI", "SK"].includes(country)) return "EUR";
  return "USD";
}
