"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  Coins,
  CreditCard,
  Film,
  HelpCircle,
  Info,
  Loader2,
  Rocket,
  ShieldCheck,
  Sparkles,
  Zap
} from "lucide-react";
import { useCallback, useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { supabase } from "@/lib/supabase/client";
import type { PricingPlan } from "@/lib/billing/plans";

type CreateOrderResponse = {
  ok: boolean;
  key_id?: string;
  order_id?: string;
  amount: number;
  currency: string;
  planId?: string;
  planName?: string;
  priceLabel?: string;
  billingLabel?: string;
  error?: string;
};

type VerifyPaymentResponse = {
  ok: boolean;
  paid?: boolean;
  accessActivated?: boolean;
  entitlement?: {
    planId?: string;
    planName?: string;
    expiresAt?: string;
  };
  error?: string;
};

type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayFailureResponse = {
  error?: {
    code?: string;
    description?: string;
    reason?: string;
  };
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  theme: { color: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal: { ondismiss: () => void };
  notes: Record<string, string>;
};

type RazorpayInstance = {
  open: () => void;
  on: (event: "payment.failed", callback: (response: RazorpayFailureResponse) => void) => void;
};

type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

async function getSessionHeaders() {
  const { data, error } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;
  if (error || !accessToken) throw new Error("Please log in again before checkout.");
  return { Authorization: `Bearer ${accessToken}` };
}

function loadRazorpayScript() {
  if (window.Razorpay) return Promise.resolve(true);

  return new Promise<boolean>((resolve) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true), { once: true });
      existingScript.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

async function readJson<T>(response: Response) {
  const payload = (await response.json().catch(() => ({}))) as T;
  if (!response.ok) {
    const error =
      payload && typeof payload === "object" && "error" in payload
        ? String((payload as { error?: unknown }).error)
        : "Request failed.";
    throw new Error(error);
  }
  return payload;
}

export function PricingCheckoutCards({
  plans,
  displayPrices,
}: {
  plans: PricingPlan[];
  displayPrices: Record<string, string>;
}) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  const startCheckout = useCallback(
    async (plan: PricingPlan) => {
      if (plan.id === "free") {
        router.push(user ? "/create" : "/signup");
        return;
      }

      if (!user) {
        setMessage({ type: "info", text: "Please log in first so we can activate access on your account." });
        router.push("/login");
        return;
      }

      setLoadingPlan(plan.id);
      setMessage({ type: "info", text: "Opening secure Razorpay checkout..." });

      try {
        const scriptReady = await loadRazorpayScript();
        if (!scriptReady || !window.Razorpay) {
          throw new Error("Could not load Razorpay checkout. Please refresh and try again.");
        }

        const authHeaders = await getSessionHeaders();
        const order = await readJson<CreateOrderResponse>(
          await fetch("/api/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json", ...authHeaders },
            body: JSON.stringify({ planId: plan.id }),
          }),
        );

        if (!order.ok || !order.key_id || !order.order_id || !order.amount || !order.currency) {
          throw new Error(order.error || "Could not prepare checkout order.");
        }

        const razorpay = new window.Razorpay({
          key: order.key_id,
          amount: order.amount,
          currency: order.currency,
          name: "Itnavideo",
          description: `${order.planName || plan.name} plan (${plan.credits} credits)`,
          order_id: order.order_id,
          theme: { color: "#2563EB" },
          notes: { source: "itnavideo-web-checkout" },
          modal: {
            ondismiss: () => {
              setLoadingPlan(null);
              setMessage({ type: "info", text: "Payment cancelled. You can try again anytime." });
            },
          },
          handler: async (payment) => {
            try {
              const verification = await readJson<VerifyPaymentResponse>(
                await fetch("/api/verify-payment", {
                  method: "POST",
                  headers: { "Content-Type": "application/json", ...authHeaders },
                  body: JSON.stringify(payment),
                }),
              );

              if (!verification.ok || !verification.paid || !verification.accessActivated) {
                throw new Error(verification.error || "Payment verification failed.");
              }

              setMessage({
                type: "success",
                text: "Payment verified! Your credits are now active.",
              });
              router.push(`/dashboard?payment=success&plan=${encodeURIComponent(plan.id)}`);
            } catch (error) {
              setMessage({
                type: "error",
                text: error instanceof Error ? error.message : "Payment verification failed.",
              });
            } finally {
              setLoadingPlan(null);
            }
          },
        });

        razorpay.on("payment.failed", (response) => {
          setLoadingPlan(null);
          setMessage({
            type: "error",
            text: response.error?.description || response.error?.reason || "Payment failed. Please try again.",
          });
        });

        razorpay.open();
      } catch (error) {
        setLoadingPlan(null);
        setMessage({
          type: "error",
          text: error instanceof Error ? error.message : "Could not start Razorpay checkout.",
        });
      }
    },
    [router, user],
  );

  return (
    <div className="space-y-12">
      {message && (
        <div
          className={`mx-auto max-w-5xl rounded-2xl border px-5 py-4 text-sm font-bold shadow-md ${
            message.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
              : message.type === "error"
                ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-300"
                : "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* 4 Pricing Cards Grid with high contrast styling */}
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => {
          const isPopular = plan.popular;
          const displayPrice = displayPrices[plan.id] || (plan.id === "free" ? "₹0" : plan.quotes?.USD?.displayPrice || "$0");

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl border p-6 transition-all duration-300 backdrop-blur-md ${
                isPopular
                  ? "border-blue-500 bg-card text-card-foreground shadow-2xl shadow-blue-500/15 ring-2 ring-blue-500/40 lg:-translate-y-2 dark:bg-slate-900"
                  : "border-slate-200 bg-card text-card-foreground shadow-md hover:border-blue-500/30 dark:border-slate-800 dark:bg-slate-900/60"
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/30">
                  <BadgeCheck size={13} />
                  Most Popular
                </div>
              )}

              {/* Plan Header */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{plan.name}</span>
                <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-600 dark:text-cyan-400">
                  {plan.credits} {plan.credits === 1 ? "credit" : "credits"}
                </span>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  {displayPrice}
                </span>
                {plan.billingPeriodLabel && (
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {plan.billingPeriodLabel}
                  </span>
                )}
              </div>

              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400 min-h-[36px]">
                {plan.description}
              </p>

              {/* Divider */}
              <div className="my-5 border-t border-slate-200 dark:border-slate-800" />

              {/* Features List */}
              <ul className="flex-1 space-y-3 text-xs">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-slate-700 dark:text-slate-200">
                    <Check size={15} className="mt-0.5 shrink-0 text-blue-600 dark:text-cyan-400" />
                    <span className="leading-tight">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                type="button"
                disabled={Boolean(loadingPlan) || authLoading}
                onClick={() => startCheckout(plan)}
                className={`mt-8 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-xs font-black transition-all duration-300 ${
                  isPopular
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500"
                    : plan.id === "free"
                      ? "border border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                      : "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                }`}
              >
                {loadingPlan === plan.id ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <CreditCard size={15} />
                )}
                <span>{loadingPlan === plan.id ? "Preparing..." : plan.button}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Explainer Section: "What Do Credits Get You? (All Templates Included)" */}
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-gradient-to-b from-blue-50/50 to-card p-8 shadow-sm dark:border-slate-800 dark:from-slate-900/40 dark:to-slate-950">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-bold text-blue-600 dark:text-cyan-400">
            <Coins size={14} />
            How Credits Work
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white font-sans">
            What you get when you upgrade
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            1 credit equals 1 short video render. All paid plans remove watermarks and unlock all 11 AI video templates!
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Credit Conversion 1 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/80">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 font-bold">
                1x
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Short Reel / Short (9:16)</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">1 Credit per video render</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              Ideal for Instagram Reels, YouTube Shorts, and TikTok up to 60 seconds long.
            </p>
          </div>

          {/* Credit Conversion 2 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/80">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold">
                3x
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Long-Form Video (16:9)</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">3 Credits per 5-minute video</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              For YouTube explainer videos, online courses, and long promotional promos.
            </p>
          </div>

          {/* Credit Conversion 3 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/80 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                11
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">All 11 Video Templates</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Full access on all paid plans</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              Compare Explainers, Auto-Captions, Whiteboard Videos, Typography, Clips &amp; Audio Cleaners.
            </p>
          </div>
        </div>

        {/* List of included templates so users understand */}
        <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-center mb-4">
            Templates Included in Your Plan
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Auto Caption Reel",
              "Compare Explainer",
              "Whiteboard Explainer",
              "Long Video Promo",
              "Long Video Clips",
              "Caption Studio",
              "Long Caption Pro",
              "Typography Video",
              "Multi-Images Video",
              "AI Audio Cleaner",
              "Long Video Pro",
            ].map((tmpl) => (
              <span
                key={tmpl}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              >
                <Check size={12} className="text-blue-500" />
                {tmpl}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
