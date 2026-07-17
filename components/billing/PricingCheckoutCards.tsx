"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, Check, CreditCard, Loader2, Rocket, ShieldCheck, Sparkles } from "lucide-react";
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
  const {data, error} = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;
  if (error || !accessToken) throw new Error("Please log in again before checkout.");
  return {Authorization: `Bearer ${accessToken}`};
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
    const error = payload && typeof payload === "object" && "error" in payload
      ? String((payload as { error?: unknown }).error)
      : "Request failed.";
    throw new Error(error);
  }
  return payload;
}

/**
 * displayPrices maps plan id -> the ONE local price string already resolved
 * server-side (via the trusted billing region). This component must never
 * receive or show more than one currency for the same plan.
 */
export function PricingCheckoutCards({ plans, displayPrices }: { plans: PricingPlan[]; displayPrices: Record<string, string> }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  const startCheckout = useCallback(async (plan: PricingPlan) => {
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
          headers: {"Content-Type": "application/json", ...authHeaders},
          body: JSON.stringify({planId: plan.id}),
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
        description: `${order.planName || plan.name} plan`,
        order_id: order.order_id,
        theme: { color: "#22D3EE" },
        notes: {source: "itnavideo-web-checkout"},
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
                headers: {"Content-Type": "application/json", ...authHeaders},
                body: JSON.stringify(payment),
              }),
            );

            if (!verification.ok || !verification.paid || !verification.accessActivated) {
              throw new Error(verification.error || "Payment verification failed.");
            }

            try {
              window.localStorage.setItem(
                `itnavideo.billing.entitlement.${user.id}`,
                JSON.stringify(verification.entitlement || { planId: plan.id, planName: plan.name }),
              );
            } catch {
              // Local storage is only a dashboard speed-up; server entitlement is already saved.
            }

            setMessage({
              type: "success",
              text: "Payment verified. Your plan is active now.",
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
  }, [router, user]);

  const proPlan = plans.find((plan) => plan.id === "pro");
  const businessPlan = plans.find((plan) => plan.id === "business");

  return (
    <>
      {message && (
        <div
          className={`mx-auto mb-8 max-w-6xl rounded-lg border px-5 py-4 text-sm font-bold ${
            message.type === "success"
              ? "border-brand-mint/30 bg-brand-mint/10 text-brand-mint"
              : message.type === "error"
                ? "border-red-400/30 bg-red-500/10 text-red-100"
                : "border-white/10 bg-white/5 text-zinc-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 xl:grid-cols-4">
        {/* Free */}
        <div className="relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-7">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-300">
            <Sparkles size={16} />
          </div>
          <h2 className="text-2xl font-black text-white">Free</h2>
          <p className="mt-2 min-h-12 text-sm leading-6 text-zinc-500">Try Itnavideo before you buy.</p>
          <div className="mt-6">
            <span className="text-4xl font-black text-white">₹0</span>
          </div>
          <ul className="mt-7 flex-1 space-y-3.5">
            {["1 free AI video", "Watermark included", "Limited features"].map((feature) => (
              <li key={feature} className="flex gap-3 text-sm leading-6 text-zinc-400">
                <Check className="mt-0.5 shrink-0 text-zinc-500" size={16} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/signup"
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3.5 text-sm font-black text-zinc-200 transition hover:bg-white/[0.08]"
          >
            Get Started Free
          </Link>
        </div>

        {/* Pro */}
        {proPlan && (
          <div
            className="relative flex flex-col rounded-2xl p-7"
            style={{
              border: "2px solid #22D3EE",
              background: "linear-gradient(160deg, rgba(34,211,238,0.1) 0%, rgba(11,17,32,0.98) 55%)",
              boxShadow: "0 24px 60px rgba(34,211,238,0.18)",
            }}
          >
            <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#22D3EE] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#0B1120]">
              <BadgeCheck size={12} />
              Most Popular
            </div>
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-300/25 bg-cyan-400/10 text-cyan-200">
              <Rocket size={16} />
            </div>
            <h2 className="text-2xl font-black text-white">{proPlan.name}</h2>
            <p className="mt-2 min-h-12 text-sm leading-6 text-zinc-400">{proPlan.description}</p>
            <div className="mt-6">
              <span className="text-4xl font-black text-white">{displayPrices[proPlan.id] || ""}</span>
              <span className="ml-1.5 text-sm font-semibold text-zinc-500">{proPlan.billingPeriodLabel}</span>
            </div>
            <ul className="mt-7 flex-1 space-y-3.5">
              {proPlan.features.map((feature) => (
                <li key={feature} className="flex gap-3 text-sm leading-6 text-zinc-200">
                  <Check className="mt-0.5 shrink-0 text-cyan-300" size={16} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#22D3EE] px-5 py-3.5 text-sm font-black text-[#0B1120] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={Boolean(loadingPlan) || authLoading}
              onClick={() => startCheckout(proPlan)}
              type="button"
            >
              {loadingPlan === proPlan.id ? <Loader2 className="animate-spin" size={16} /> : <CreditCard size={16} />}
              {loadingPlan === proPlan.id ? "Opening..." : proPlan.button}
            </button>
          </div>
        )}

        {/* Business */}
        {businessPlan && (
          <div className="relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-7">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-violet-200">
              <Building2 size={16} />
            </div>
            <h2 className="text-2xl font-black text-white">{businessPlan.name}</h2>
            <p className="mt-2 min-h-12 text-sm leading-6 text-zinc-400">{businessPlan.description}</p>
            <div className="mt-6">
              <span className="text-4xl font-black text-white">{displayPrices[businessPlan.id] || ""}</span>
              <span className="ml-1.5 text-sm font-semibold text-zinc-500">{businessPlan.billingPeriodLabel}</span>
            </div>
            <ul className="mt-7 flex-1 space-y-3.5">
              {businessPlan.features.map((feature) => (
                <li key={feature} className="flex gap-3 text-sm leading-6 text-zinc-300">
                  <Check className="mt-0.5 shrink-0 text-violet-300" size={16} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-5 py-3.5 text-sm font-black text-white transition hover:bg-white/[0.09] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={Boolean(loadingPlan) || authLoading}
              onClick={() => startCheckout(businessPlan)}
              type="button"
            >
              {loadingPlan === businessPlan.id ? <Loader2 className="animate-spin" size={16} /> : <CreditCard size={16} />}
              {loadingPlan === businessPlan.id ? "Opening..." : businessPlan.button}
            </button>
          </div>
        )}

        {/* Enterprise */}
        <div className="relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-7">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg border border-amber-300/25 bg-amber-400/10 text-amber-200">
            <ShieldCheck size={16} />
          </div>
          <h2 className="text-2xl font-black text-white">Enterprise</h2>
          <p className="mt-2 min-h-12 text-sm leading-6 text-zinc-400">For agencies and organizations with custom needs.</p>
          <div className="mt-6">
            <span className="text-3xl font-black text-white">Custom Pricing</span>
          </div>
          <ul className="mt-7 flex-1 space-y-3.5">
            {["Custom usage limits", "API access", "Custom integrations", "Dedicated account manager", "SLA support", "Guided onboarding"].map((feature) => (
              <li key={feature} className="flex gap-3 text-sm leading-6 text-zinc-300">
                <Check className="mt-0.5 shrink-0 text-amber-300" size={16} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Link
            href="mailto:rohi@itnavideo.com"
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-black text-black transition hover:bg-zinc-200"
          >
            Contact Sales
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-6xl items-start gap-3 rounded-lg border border-brand-mint/20 bg-brand-mint/10 p-5 text-sm leading-6 text-zinc-200">
        <ShieldCheck className="mt-1 shrink-0 text-brand-mint" size={20} />
        <p>Secure Razorpay checkout. Pricing is shown in your local currency.</p>
      </div>
    </>
  );
}
