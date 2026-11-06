"use client";

import { CheckCircle2, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { pricingPlans, type PricingPlan } from "@/lib/billing/plans";

type RazorpayResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type RazorpayInstance = { open: () => void; on: (event: "payment.failed", callback: (response: { error?: { description?: string } }) => void) => void };
type RazorpayConstructor = new (options: { key: string; order_id: string; amount: number; currency: string; name: string; description: string; handler: (response: RazorpayResponse) => void; theme: { color: string }; modal: { ondismiss: () => void } }) => RazorpayInstance;
type RazorpayWindow = Window & { Razorpay?: RazorpayConstructor };

async function sessionHeaders() {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session?.access_token) throw new Error("Please log in again before checkout.");
  return { Authorization: `Bearer ${data.session.access_token}` };
}

function loadCheckout() {
  if ((window as RazorpayWindow).Razorpay) return Promise.resolve(true);
  return new Promise<boolean>((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) { existing.addEventListener("load", () => resolve(true), { once: true }); existing.addEventListener("error", () => resolve(false), { once: true }); return; }
    const script = document.createElement("script"); script.src = "https://checkout.razorpay.com/v1/checkout.js"; script.async = true;
    script.onload = () => resolve(true); script.onerror = () => resolve(false); document.body.appendChild(script);
  });
}

function getPlanPricing(planId: string, currency: 'USD' | 'INR', isAnnual: boolean) {
  if (currency === 'USD') {
    if (planId === 'starter') {
      return {
        displayPrice: isAnnual ? '$16.60' : '$19.99',
        savingsLine: isAnnual ? 'Save $40/year vs monthly' : 'Save $40/year with annual billing',
        annualBilled: '$199.90/year',
      };
    }
    if (planId === 'growth') {
      return {
        displayPrice: isAnnual ? '$33.30' : '$39.99',
        savingsLine: isAnnual ? 'Save $80/year vs monthly' : 'Save $80/year with annual billing',
        annualBilled: '$399.90/year',
      };
    }
    if (planId === 'pro') {
      return {
        displayPrice: isAnnual ? '$66.60' : '$79.99',
        savingsLine: isAnnual ? 'Save $160/year vs monthly' : 'Save $160/year with annual billing',
        annualBilled: '$799.90/year',
      };
    }
  } else {
    if (planId === 'starter') {
      return {
        displayPrice: isAnnual ? '₹832' : '₹999',
        savingsLine: isAnnual ? 'Save ₹2,000/year vs monthly' : 'Save ₹2,000/year with annual billing',
        annualBilled: '₹9,990/year',
      };
    }
    if (planId === 'growth') {
      return {
        displayPrice: isAnnual ? '₹1,665' : '₹1,999',
        savingsLine: isAnnual ? 'Save ₹4,000/year vs monthly' : 'Save ₹4,000/year with annual billing',
        annualBilled: '₹19,990/year',
      };
    }
    if (planId === 'pro') {
      return {
        displayPrice: isAnnual ? '₹3,332' : '₹3,999',
        savingsLine: isAnnual ? 'Save ₹8,000/year vs monthly' : 'Save ₹8,000/year with annual billing',
        annualBilled: '₹39,990/year',
      };
    }
  }
  return {
    displayPrice: '$19.99',
    savingsLine: 'Save $40/year with annual billing',
    annualBilled: '$199.90/year',
  };
}

export function SubscriptionPricingCards({ displayPrices }: { displayPrices: Record<string, string> }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');

  const buyPlan = async (plan: PricingPlan) => {
    if (plan.id === "free") {
      router.push(user ? "/dashboard" : "/signup");
      return;
    }
    if (!user) {
      router.push("/login?next=/pricing");
      return;
    }
    setLoadingPlan(plan.id);
    setMessage("");
    try {
      const headers = await sessionHeaders();
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ planId: plan.id }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        key_id?: string;
        order_id?: string;
        amount?: number;
        currency?: string;
        error?: string;
      };
      if (!response.ok || !payload.ok || !payload.key_id || !payload.order_id || !payload.amount || !payload.currency) {
        throw new Error(payload.error || "Could not start checkout.");
      }
      if (!(await loadCheckout())) {
        throw new Error("Could not open secure checkout. Please refresh and try again.");
      }
      const Razorpay = (window as RazorpayWindow).Razorpay;
      if (!Razorpay) {
        throw new Error("Could not open secure checkout. Please refresh and try again.");
      }
      const checkout = new Razorpay({
        key: payload.key_id,
        order_id: payload.order_id,
        amount: payload.amount,
        currency: payload.currency,
        name: "Itnavideo",
        description: `${plan.name} (${plan.credits} Credits)`,
        theme: { color: "#EA580C" },
        modal: {
          ondismiss: () => {
            setLoadingPlan(null);
            setMessage("Checkout cancelled. You can try again anytime.");
          },
        },
        handler: async (payment) => {
          const verification = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json", ...headers },
            body: JSON.stringify(payment),
          });
          const result = (await verification.json()) as { ok?: boolean; error?: string };
          setLoadingPlan(null);
          if (!verification.ok || !result.ok) {
            setMessage(result.error || "We could not verify your payment.");
            return;
          }
          setMessage("Payment verified! Your credits have been added.");
          router.push(`/dashboard?payment=success&plan=${encodeURIComponent(plan.id)}`);
        },
      });
      checkout.on("payment.failed", (event) => {
        setLoadingPlan(null);
        setMessage(event.error?.description || "Payment failed. Please try again.");
      });
      checkout.open();
    } catch (error) {
      setLoadingPlan(null);
      setMessage(error instanceof Error ? error.message : "Could not start checkout.");
    }
  };

  return (
    <section id="pricing" className="border-t border-slate-100 bg-white text-slate-900 px-4 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-700 shadow-xs">
            <Sparkles size={14} className="text-[#FF5722]" />
            <span>Transparent Creator Pricing</span>
          </div>

          <h2 className="mt-4 text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight font-sans">
            Simple, Powerful{" "}
            <span className="bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] bg-clip-text text-transparent">
              AI Video Plans
            </span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Create Faceless videos, YouTube long-form, Reels, subtitles, and viral clips with dedicated studios.
          </p>

          {/* Monthly / Annual Floating Pill Toggle (Reference Design) */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3">
            <div className="inline-flex items-center rounded-full border border-stone-200 bg-stone-100/90 p-1 shadow-xs">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`rounded-full px-6 py-2 text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-[#18181b] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === 'annual'
                    ? 'bg-[#18181b] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Annual</span>
                <span className="rounded-full bg-emerald-500 text-white px-2 py-0.5 text-[10px] font-bold">
                  2 months free
                </span>
              </button>
            </div>

            {/* Currency Switcher */}
            <div className="inline-flex items-center rounded-full border border-stone-200 bg-stone-50 p-0.5 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`rounded-full px-3 py-1 transition cursor-pointer ${
                  currency === 'USD' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                $ USD
              </button>
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`rounded-full px-3 py-1 transition cursor-pointer ${
                  currency === 'INR' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                ₹ INR
              </button>
            </div>
          </div>
        </div>

        {message && (
          <p className="mx-auto mt-6 max-w-xl rounded-2xl border border-orange-500/30 bg-orange-50 px-4 py-3 text-center text-sm font-semibold text-orange-950">
            {message}
          </p>
        )}

        {/* 3-Column Grid for Paid Plans (Starter, Growth, Pro) */}
        <div className="mt-12 grid gap-6 md:grid-cols-3 max-w-6xl mx-auto items-stretch">
          {pricingPlans.filter((plan) => plan.id !== "free").map((plan) => {
            const isPopular = plan.popular;
            const pricing = getPlanPricing(plan.id, currency, billingCycle === 'annual');
            const planShortName = plan.name.split(" (")[0];

            return (
              <article
                key={plan.id}
                className={`relative flex flex-col rounded-3xl transition-all duration-300 p-6 sm:p-8 bg-white ${
                  isPopular
                    ? "border-2 border-orange-500 ring-4 ring-orange-500/15 shadow-xl shadow-orange-500/10 lg:scale-[1.02] z-10"
                    : "border border-stone-200/90 shadow-xs hover:border-stone-300 hover:shadow-md"
                }`}
              >
                {/* Most Popular Floating Pill Badge */}
                {isPopular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-4 py-0.5 text-[11px] font-bold text-white shadow-md">
                    Most Popular
                  </span>
                )}

                {/* Plan Header */}
                <h3 className="text-2xl font-black text-slate-900">{planShortName}</h3>

                {/* Pricing Display */}
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
                    {pricing.displayPrice}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-500">
                    /month
                  </span>
                </div>

                {/* Green Savings Line (Exact Reference) */}
                <p className="mt-2 text-xs font-bold text-emerald-600">
                  {pricing.savingsLine}
                </p>

                {/* Description */}
                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal min-h-[40px]">
                  {plan.description}
                </p>

                {/* Feature List with Green Checkmark Circles */}
                <ul className="mt-6 flex-1 space-y-3.5 text-xs sm:text-sm border-t border-stone-100 pt-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2.5 items-start text-slate-700 font-medium">
                      <CheckCircle2
                        size={17}
                        className="mt-0.5 shrink-0 text-emerald-500"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Action CTA Button */}
                <button
                  type="button"
                  disabled={loading || Boolean(loadingPlan)}
                  onClick={() => buyPlan(plan)}
                  className={`mt-8 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 px-5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isPopular
                      ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-white shadow-md shadow-orange-500/25 hover:brightness-110 active:scale-98"
                      : "bg-[#18181b] hover:bg-black text-white shadow-xs active:scale-98"
                  }`}
                >
                  {loadingPlan === plan.id && <Loader2 size={16} className="animate-spin" />}
                  {loadingPlan === plan.id ? "Preparing checkout..." : `Get Started with ${planShortName}`}
                </button>
              </article>
            );
          })}
        </div>

        {/* Simple Credit Rate & Guarantee Trust Bar */}
        <div className="mt-12 flex flex-col items-center justify-center gap-3">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold text-orange-800 shadow-xs">
            <span>Simple Pricing Rule:</span>
            <span className="font-extrabold text-orange-950">1 Credit = 1 Minute YouTube Video</span>
            <span className="text-orange-400">•</span>
            <span className="font-extrabold text-orange-950">1 Credit = 1 Vertical Short / Clip</span>
            <span className="text-orange-400">•</span>
            <span className="font-extrabold text-orange-950">1 Credit = 1 Audio Clean</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 mt-1">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#FF5722]" />
              <span>100% Secure Checkout via Razorpay</span>
            </div>
            <span>•</span>
            <span>Instant Credit Delivery</span>
            <span>•</span>
            <span>Top Up Credits Anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
