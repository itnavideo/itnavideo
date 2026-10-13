"use client";

import { Check, Loader2, ShieldCheck, Sparkles } from "lucide-react";
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

export function SubscriptionPricingCards({ displayPrices }: { displayPrices: Record<string, string> }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [message, setMessage] = useState("");

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
    <section id="pricing" className="border-t border-slate-200/80 bg-white text-slate-900 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold text-orange-700">
            <Sparkles size={14} className="text-[#FF5722]" />
            <span>TRANSPARENT CREATOR PRICING</span>
          </div>

          <h2 className="mt-5 text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            Simple, Powerful{" "}
            <span className="bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] bg-clip-text text-transparent">
              AI Video Plans
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Create Faceless videos, YouTube long-form, Reels, subtitles, and viral clips with purpose-built studios.
            <span className="block text-orange-600 text-sm font-bold mt-2">Monthly subscription • Credits reset every 30 days • Top up anytime</span>
          </p>

          {/* Simple Credit Breakdown Pill */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-700 shadow-2xs">
            <span className="flex items-center gap-1.5 font-bold text-slate-900">
              <span className="flex h-2 w-2 rounded-full bg-[#FF5722]" />
              <span>9:16 Short (upto 90s):</span>
              <span className="text-orange-600 font-mono">1 Credit</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 font-bold text-slate-900">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span>16:9 Long Video (upto 10m):</span>
              <span className="text-emerald-600 font-mono">1 Min = 1 Credit</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 font-bold text-slate-900">
              <span className="flex h-2 w-2 rounded-full bg-amber-500" />
              <span>AI Audio Cleaner:</span>
              <span className="text-amber-600 font-mono">1 Credit</span>
            </span>
          </div>
        </div>

        {message && (
          <p className="mx-auto mt-6 max-w-xl rounded-2xl border border-orange-500/30 bg-orange-50 px-4 py-3 text-center text-sm font-semibold text-orange-950">
            {message}
          </p>
        )}

        {/* 4-Column Grid */}
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {pricingPlans.map((plan) => {
            const isPopular = plan.popular;
            const isFree = plan.id === "free";

            return (
              <article
                key={plan.id}
                className={`relative flex min-h-[510px] flex-col rounded-[28px] border p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  isPopular
                    ? "border-[#FF5722] ring-2 ring-[#FF5722]/30 bg-gradient-to-b from-orange-50/50 via-white to-white shadow-xl shadow-orange-500/10"
                    : "border-slate-200 bg-white hover:border-orange-500/40"
                }`}
              >
                {/* Popular Pill */}
                {isPopular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FFA000] px-4 py-1 text-[11px] font-black tracking-wide text-white shadow-lg shadow-orange-500/30">
                    ⭐ MOST POPULAR · BEST VALUE
                  </span>
                )}

                {/* Plan Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900">{plan.name}</h3>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      isPopular
                        ? "bg-orange-500/15 text-orange-700 border-orange-500/30 font-black"
                        : isFree
                        ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 font-bold"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {isFree ? "20 Free Credits" : `${plan.credits.toLocaleString()} Credits`}
                  </span>
                </div>

                <p className="mt-2 text-xs leading-relaxed text-slate-600 min-h-[36px]">
                  {plan.description}
                </p>

                {/* Pricing Display */}
                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
                    {displayPrices[plan.id] || plan.quotes.USD?.displayPrice || "$0"}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    / {plan.billingPeriodLabel}
                  </span>
                </div>

                <p className="mt-2 text-xs font-bold text-orange-600">
                  {isFree ? "✓ No credit card required" : `✓ ${plan.credits} credits valid for 30 days`}
                </p>

                {/* Features List */}
                <ul className="mt-6 flex-1 space-y-3 text-xs sm:text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2.5 items-start text-slate-700">
                      <Check
                        size={16}
                        className={`mt-0.5 shrink-0 ${isPopular ? "text-[#FF5722]" : "text-emerald-500"}`}
                        strokeWidth={2.5}
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
                  className={`mt-8 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-xs sm:text-sm font-black transition cursor-pointer ${
                    isPopular
                      ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-white hover:brightness-110 shadow-lg shadow-orange-500/25 active:scale-95"
                      : isFree
                      ? "border border-slate-200 bg-slate-50 text-slate-800 hover:bg-orange-50 hover:border-orange-500/40 hover:text-orange-950 font-bold active:scale-95 shadow-2xs"
                      : "border border-slate-200 bg-slate-50 text-slate-800 hover:bg-orange-50 hover:border-orange-500/40 hover:text-orange-950 font-bold active:scale-95 shadow-2xs"
                  }`}
                >
                  {loadingPlan === plan.id && <Loader2 size={16} className="animate-spin" />}
                  {loadingPlan === plan.id ? "Preparing checkout..." : plan.button}
                </button>
              </article>
            );
          })}
        </div>

        {/* Security & Guarantee Trust Bar */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#FF5722]" />
            <span>100% Secure Checkout via Razorpay</span>
          </div>
          <span>•</span>
          <span>Instant Credit Delivery</span>
          <span>•</span>
          <span>Buy More Credits Anytime</span>
        </div>
      </div>
    </section>
  );
}
