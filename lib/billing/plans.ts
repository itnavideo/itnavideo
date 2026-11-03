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

export const PRICE_VERSION = "2026-10-15-v6";

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
      "1080p Full HD export",
      "All 14 video studios preview",
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
    name: "Starter (Shorts & Long)",
    credits: 100,
    monthlyVideoLimit: 100,
    validDays: 30,
    billingCycle: "monthly",
    description: "100 Credits per month. Create 100 Shorts or up to twenty 5-minute Long Videos.",
    features: [
      "100 Credits / month (1 Cr = 1 Short / 1 Min Long)",
      "100 × 9:16 Shorts OR 20 × 5-Min Long Videos",
      "Auto Captions, Kinetic Typography & Whiteboard",
      "Faceless Video Generator & Book Summary",
      "1080p Full HD, zero watermark",
      "30-day validity, top up anytime",
    ],
    button: "Buy Starter",
    href: "/pricing",
    popular: false,
    billingPeriodLabel: "30-day pack",
    razorpayPlanEnv: "RAZORPAY_PLAN_STARTER",
    quotes: {
      USD: { currency: "USD", amount: 1999, displayPrice: "$19.99", priceVersion: PRICE_VERSION },
      INR: { currency: "INR", amount: 99900, displayPrice: "₹999", priceVersion: PRICE_VERSION },
      EUR: { currency: "EUR", amount: 1999, displayPrice: "€19.99", priceVersion: PRICE_VERSION },
      GBP: { currency: "GBP", amount: 1600, displayPrice: "£16.99", priceVersion: PRICE_VERSION },
      AED: { currency: "AED", amount: 7500, displayPrice: "75 AED", priceVersion: PRICE_VERSION },
      THB: { currency: "THB", amount: 69000, displayPrice: "690 ฿", priceVersion: PRICE_VERSION },
    },
  },
  {
    id: "growth",
    name: "Growth (Shorts + Long)",
    credits: 250,
    monthlyVideoLimit: 250,
    validDays: 30,
    billingCycle: "monthly",
    description: "Best for active YouTubers & creators publishing weekly long-form & daily reels.",
    features: [
      "250 Credits / month (1 Cr = 1 Short / 1 Min Long)",
      "Up to 250 Shorts OR 50 × 5-Min Long Videos",
      "Faceless Video Generator (16:9 Cinema)",
      "Book Summary & Image to Video AI",
      "Long Video to Viral Clips & AI Audio Cleaner",
      "1080p Full HD, Priority Cloud Queue",
    ],
    button: "Buy Growth",
    href: "/pricing",
    popular: true,
    billingPeriodLabel: "30-day pack",
    razorpayPlanEnv: "RAZORPAY_PLAN_GROWTH",
    quotes: {
      USD: { currency: "USD", amount: 3999, displayPrice: "$39.99", priceVersion: PRICE_VERSION },
      INR: { currency: "INR", amount: 199900, displayPrice: "₹1,999", priceVersion: PRICE_VERSION },
      EUR: { currency: "EUR", amount: 3999, displayPrice: "€39.99", priceVersion: PRICE_VERSION },
      GBP: { currency: "GBP", amount: 3200, displayPrice: "£32.99", priceVersion: PRICE_VERSION },
      AED: { currency: "AED", amount: 14900, displayPrice: "149 AED", priceVersion: PRICE_VERSION },
      THB: { currency: "THB", amount: 139000, displayPrice: "1,390 ฿", priceVersion: PRICE_VERSION },
    },
  },
  {
    id: "pro",
    name: "Pro Agency",
    credits: 600,
    monthlyVideoLimit: 600,
    validDays: 30,
    billingCycle: "monthly",
    description: "High-volume power pack for agencies, media studios & multi-channel creators.",
    features: [
      "600 Credits / month (1 Cr = 1 Short / 1 Min Long)",
      "Up to 600 Shorts OR 120 × 5-Min Long Videos",
      "All 14 dedicated studio engines unlocked",
      "Max 5-Minute Video Length (9,000 frames @ 30 FPS)",
      "Turbo Fast-Lane Cloud Queue & Retake Detection",
      "Full Commercial & Client Rights + VIP Support",
    ],
    button: "Buy Pro",
    href: "/pricing",
    popular: false,
    billingPeriodLabel: "30-day pack",
    razorpayPlanEnv: "RAZORPAY_PLAN_PRO",
    quotes: {
      USD: { currency: "USD", amount: 7999, displayPrice: "$79.99", priceVersion: PRICE_VERSION },
      INR: { currency: "INR", amount: 399900, displayPrice: "₹3,999", priceVersion: PRICE_VERSION },
      EUR: { currency: "EUR", amount: 7999, displayPrice: "€79.99", priceVersion: PRICE_VERSION },
      GBP: { currency: "GBP", amount: 6500, displayPrice: "£64.99", priceVersion: PRICE_VERSION },
      AED: { currency: "AED", amount: 29900, displayPrice: "299 AED", priceVersion: PRICE_VERSION },
      THB: { currency: "THB", amount: 279000, displayPrice: "2,790 ฿", priceVersion: PRICE_VERSION },
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
