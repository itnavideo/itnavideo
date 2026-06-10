"use client";

import { useRouter } from "next/navigation";
import { BadgeCheck, Check, CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { useCallback, useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";

export type PricingPlan = {
  id: string;
  name: string;
  price: string;
  amountPaise: number;
  monthlyVideoLimit: number;
  billingLabel?: string;
  validDays?: number;
  description: string;
  features: string[];
  button: string;
  href: string;
  popular: boolean;
};

type CreateOrderResponse = {
  ok: boolean;
  key_id?: string;
  order_id?: string;
  amount?: number;
  currency?: string;
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

function formatReceipt(plan: PricingPlan) {
  return `${plan.id}-${Date.now()}`.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 40);
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

export function PricingCheckoutCards({ plans }: { plans: PricingPlan[] }) {
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

      const order = await readJson<CreateOrderResponse>(
        await fetch("/api/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: plan.amountPaise,
            currency: "INR",
            receipt: formatReceipt(plan),
            planId: plan.id,
            planName: plan.name,
            userId: user.id,
            userEmail: user.email,
          }),
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
        description: `${plan.name} ${plan.billingLabel || "monthly plan"}`,
        order_id: order.order_id,
        theme: { color: "#58e6d0" },
        notes: {
          planId: plan.id,
          planName: plan.name,
        },
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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...payment,
                  userId: user.id,
                  userEmail: user.email,
                  planId: plan.id,
                  planName: plan.name,
                }),
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
              text: "Payment verified. Your render access is active now.",
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

  return (
    <>
      {message && (
        <div
          className={`mx-auto mb-8 max-w-7xl rounded-lg border px-5 py-4 text-sm font-bold ${
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

      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => {
          const isLoading = loadingPlan === plan.id;

          return (
            <div
              key={plan.name}
              className={`relative rounded-lg border p-7 ${
                plan.popular
                  ? "border-brand-mint/50 bg-brand-mint/10 shadow-2xl shadow-emerald-950/30"
                  : "border-white/10 bg-zinc-950"
              }`}
            >
              {plan.popular && (
                <div className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-md bg-brand-mint px-3 py-1 text-xs font-black text-black">
                  <BadgeCheck size={14} />
                  Best fit
                </div>
              )}
              <h2 className="text-3xl font-black">{plan.name}</h2>
              <p className="mt-3 min-h-12 text-sm leading-6 text-zinc-400">{plan.description}</p>
              <div className="mt-8">
                <span className="text-6xl font-black">{plan.price}</span>
                <span className="ml-2 text-zinc-500">{plan.billingLabel || "/ month"}</span>
              </div>
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm leading-6 text-zinc-300">
                    <Check className="mt-1 shrink-0 text-brand-mint" size={17} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`mt-9 inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-4 font-black transition ${
                  plan.popular
                    ? "bg-brand-mint text-black hover:bg-white"
                    : "border border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                } disabled:cursor-not-allowed disabled:opacity-70`}
                disabled={Boolean(loadingPlan) || authLoading}
                onClick={() => startCheckout(plan)}
                type="button"
              >
                {isLoading ? <Loader2 className="animate-spin" size={17} /> : <CreditCard size={17} />}
                {isLoading ? "Opening..." : plan.button}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl items-start gap-3 rounded-lg border border-brand-mint/20 bg-brand-mint/10 p-5 text-sm leading-6 text-zinc-200">
        <ShieldCheck className="mt-1 shrink-0 text-brand-mint" size={20} />
        <p>
          Razorpay checkout is live in INR. The ₹9 test plan unlocks one real export without starting a subscription.
        </p>
      </div>
    </>
  );
}
