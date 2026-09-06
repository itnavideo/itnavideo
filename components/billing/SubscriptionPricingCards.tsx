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
    <section id="pricing" className="border-y border-zinc-800/80 bg-zinc-950 text-zinc-100 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        {/* M3 Expressive Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold text-orange-400 backdrop-blur-md">
            <Sparkles size={14} className="text-orange-400" />
            <span>TRANSPARENT CREATOR PRICING</span>
          </div>

          <h1 className="mt-5 text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Simple, Powerful{" "}
            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              AI Video Plans
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-zinc-400">
            Publish viral vertical reels and widescreen YouTube videos without editing timelines.
            <span className="block text-zinc-500 text-sm mt-1">No surprise fees · Cancel, top-up, or upgrade anytime</span>
          </p>
        </div>

        {message && (
          <p className="mx-auto mt-6 max-w-xl rounded-2xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-center text-sm font-semibold text-orange-300">
            {message}
          </p>
        )}

        {/* 4-Column Material 3 Grid */}
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {pricingPlans.map((plan) => {
            const isPopular = plan.popular;
            const isFree = plan.id === "free";

            return (
              <article
                key={plan.id}
                className={`relative flex min-h-[510px] flex-col rounded-3xl border p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                  isPopular
                    ? "border-orange-500 ring-2 ring-orange-500/30 bg-gradient-to-b from-zinc-900/90 to-zinc-950 shadow-xl shadow-orange-950/20"
                    : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"
                }`}
              >
                {/* Popular Pill */}
                {isPopular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-4 py-1 text-[11px] font-black tracking-wide text-white shadow-lg">
                    ⭐ MOST POPULAR · BEST VALUE
                  </span>
                )}

                {/* Plan Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-white">{plan.name}</h2>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      isPopular
                        ? "bg-orange-500/20 text-orange-300 border-orange-500/30"
                        : isFree
                        ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/25"
                        : "bg-zinc-800 text-zinc-300 border-zinc-700"
                    }`}
                  >
                    {isFree ? "1 Free Video" : `${plan.credits} Credits`}
                  </span>
                </div>

                <p className="mt-2 text-xs leading-relaxed text-zinc-400 min-h-[36px]">
                  {plan.description}
                </p>

                {/* Pricing Display */}
                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                    {displayPrices[plan.id] || plan.quotes.USD?.displayPrice || "$0"}
                  </span>
                  <span className="text-xs font-semibold text-zinc-400">
                    / {plan.billingPeriodLabel}
                  </span>
                </div>

                <p className="mt-2 text-xs font-medium text-orange-400/90">
                  {isFree ? "✓ No credit card required" : `✓ ${plan.credits} credits valid for 30 days`}
                </p>

                {/* Features List */}
                <ul className="mt-6 flex-1 space-y-3 text-xs sm:text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2.5 items-start text-zinc-300">
                      <Check
                        size={16}
                        className={`mt-0.5 shrink-0 ${isPopular ? "text-orange-400" : "text-emerald-400"}`}
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
                  className={`mt-8 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                    isPopular
                      ? "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white hover:from-amber-400 hover:to-orange-500 shadow-lg shadow-orange-500/25"
                      : isFree
                      ? "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                      : "bg-white text-zinc-950 hover:bg-zinc-200 shadow-sm"
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
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-orange-400" />
            <span>100% Secure Checkout via Razorpay</span>
          </div>
          <span>•</span>
          <span>Instant Credit Delivery</span>
          <span>•</span>
          <span>Cancel or Recharge Anytime</span>
        </div>
      </div>
    </section>
  );
}
