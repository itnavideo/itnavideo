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

export const PRICE_VERSION = "2026-09-05-v3";

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    credits: 1,
    monthlyVideoLimit: 1,
    validDays: 30,
    billingCycle: "monthly",
    description: "Try Itnavideo with zero risk. No credit card required.",
    features: [
      "1 Free Video Credit",
      "Auto Caption Video (All 10 Styles)",
      "1080p Full HD Export",
      "Includes Itnavideo watermark",
      "No credit card required",
      "Instant setup & browser export",
    ],
    button: "Get Started Free",
    href: "/signup",
    popular: false,
    billingPeriodLabel: "forever",
    razorpayPlanEnv: "",
    quotes: {
      USD: { currency: "USD", amount: 0, displayPrice: "$0", priceVersion: PRICE_VERSION },
      INR: { currency: "INR", amount: 0, displayPrice: "$0", priceVersion: PRICE_VERSION },
    },
  },
  {
    id: "starter",
    name: "Starter",
    credits: 50,
    monthlyVideoLimit: 50,
    validDays: 30,
    billingCycle: "monthly",
    description: "For creators publishing viral vertical Shorts & Reels.",
    features: [
      "50 Video Credits / month ($0.58 / video)",
      "TikTok, Instagram Reels & YT Shorts (9:16)",
      "Auto Caption Generator (All 10 Styles)",
      "Typography & Whiteboard Videos",
      "1080p Full HD, zero watermark",
      "Cancel or top-up anytime",
    ],
    button: "Get Starter ($29/mo)",
    href: "/pricing",
    popular: false,
    billingPeriodLabel: "month",
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
    credits: 150,
    monthlyVideoLimit: 150,
    validDays: 30,
    billingCycle: "monthly",
    description: "Best value for full-time creators & YouTube channels.",
    features: [
      "150 Video Credits / month (Best Value)",
      "TikTok, IG & YT Shorts & Reels (9:16)",
      "YouTube Long Videos & Explainers (16:9)",
      "Faceless Video Generator (16:9 Widescreen)",
      "AI Audio Cleaner (Noise & Filler Removal)",
      "Priority Fast Lambda Render Queue",
      "1080p Full HD, zero watermark",
    ],
    button: "Get Growth ($49/mo)",
    href: "/pricing",
    popular: true,
    billingPeriodLabel: "month",
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
    credits: 600,
    monthlyVideoLimit: 600,
    validDays: 30,
    billingCycle: "monthly",
    description: "High-volume studio power for agencies & multi-channel creators.",
    features: [
      "600 Video Credits / month (High-Volume)",
      "All 9:16 Shorts & Reels + 16:9 Long Videos",
      "Multi-Language & Hinglish Support",
      "Early Access to Brand New AI Features",
      "Unlimited Creation Allowance",
      "Dedicated Maximum Priority Render Queue",
      "1080p Full HD & 4K Export",
    ],
    button: "Get Pro ($149/mo)",
    href: "/pricing",
    popular: false,
    billingPeriodLabel: "month",
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
