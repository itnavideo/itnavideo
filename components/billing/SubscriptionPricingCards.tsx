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
  const paidPlans = pricingPlans.filter((plan) => plan.id !== "free");

  const buyPlan = async (plan: PricingPlan) => {
    if (!user) { router.push("/login?next=/pricing"); return; }
    setLoadingPlan(plan.id); setMessage("");
    try {
      const headers = await sessionHeaders();
      const response = await fetch("/api/create-order", { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify({ planId: plan.id }) });
      const payload = await response.json() as { ok?: boolean; key_id?: string; order_id?: string; amount?: number; currency?: string; error?: string };
      if (!response.ok || !payload.ok || !payload.key_id || !payload.order_id || !payload.amount || !payload.currency) throw new Error(payload.error || "Could not start checkout.");
      if (!await loadCheckout()) throw new Error("Could not open secure checkout. Please refresh and try again.");
      const Razorpay = (window as RazorpayWindow).Razorpay;
      if (!Razorpay) throw new Error("Could not open secure checkout. Please refresh and try again.");
      const checkout = new Razorpay({
        key: payload.key_id, order_id: payload.order_id, amount: payload.amount, currency: payload.currency, name: "Itnavideo", description: `${plan.name} (${plan.credits} Credits)`, theme: { color: "#2563EB" },
        modal: { ondismiss: () => { setLoadingPlan(null); setMessage("Checkout cancelled. You can try again anytime."); } },
        handler: async (payment) => {
          const verification = await fetch("/api/verify-payment", { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(payment) });
          const result = await verification.json() as { ok?: boolean; error?: string };
          setLoadingPlan(null);
          if (!verification.ok || !result.ok) { setMessage(result.error || "We could not verify your payment."); return; }
          setMessage("Payment verified! Your credits have been added.");
          router.push(`/dashboard?payment=success&plan=${encodeURIComponent(plan.id)}`);
        },
      });
      checkout.on("payment.failed", (event) => { setLoadingPlan(null); setMessage(event.error?.description || "Payment failed. Please try again."); });
      checkout.open();
    } catch (error) { setLoadingPlan(null); setMessage(error instanceof Error ? error.message : "Could not start checkout."); }
  };

  return <section id="pricing" className="border-y border-slate-200 bg-[#fff7fb] px-4 py-16 sm:px-6 sm:py-24">
    <div className="mx-auto max-w-5xl">
      <div className="mx-auto max-w-3xl text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-1.5 text-xs font-bold text-blue-700"><Sparkles size={14} /> SIMPLE MONTHLY PLANS</p>
        <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">Simple, Affordable Pricing</h2>
        <p className="mt-4 text-base text-slate-600">Get monthly video credits for all AI workflows. No hidden fees · Top-up or change plans anytime.</p>
      </div>
      {message && <p className="mx-auto mt-6 max-w-xl rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-center text-sm font-semibold text-blue-900">{message}</p>}
      <div className="mt-12 grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
        {paidPlans.map((plan) => <article key={plan.id} className={`relative flex min-h-[470px] flex-col rounded-3xl border p-6 sm:p-8 shadow-sm ${plan.popular ? "border-blue-600 ring-2 ring-blue-600 bg-slate-900 text-white shadow-2xl" : "border-slate-200 bg-white text-slate-900"}`}>
          {plan.popular && <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-[11px] font-black tracking-wide text-white shadow-md">MOST POPULAR · BEST VALUE</span>}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black">{plan.name}</h2>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${plan.popular ? "bg-blue-500/20 text-blue-300 border border-blue-400/30" : "bg-slate-100 text-slate-700 border border-slate-200"}`}>{plan.credits} Credits</span>
          </div>
          <p className={`mt-2 text-sm ${plan.popular ? "text-slate-300" : "text-slate-500"}`}>{plan.description}</p>
          <div className="mt-6 flex items-baseline gap-1.5"><span className="text-5xl font-black tracking-tight">{displayPrices[plan.id] || plan.quotes.INR.displayPrice}</span><span className={`text-xs font-semibold ${plan.popular ? "text-slate-400" : "text-slate-500"}`}>/ month</span></div>
          <p className={`mt-2 text-xs font-medium ${plan.popular ? "text-blue-300" : "text-blue-600"}`}>✓ {plan.credits} credits valid for 30 days · Top up or renew anytime</p>
          <ul className="mt-8 flex-1 space-y-3.5 text-sm">{plan.features.map((feature) => <li key={feature} className="flex gap-3 items-start"><Check size={17} className="mt-0.5 shrink-0 text-blue-500" strokeWidth={3} /><span>{feature}</span></li>)}</ul>
          <button type="button" disabled={loading || Boolean(loadingPlan)} onClick={() => buyPlan(plan)} className={`mt-8 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-4 text-sm font-black transition cursor-pointer ${plan.popular ? "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30" : "bg-slate-900 text-white hover:bg-slate-800"}`}>{loadingPlan === plan.id && <Loader2 size={17} className="animate-spin" />}{loadingPlan === plan.id ? "Preparing secure checkout..." : plan.button}</button>
        </article>)}
      </div>
      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500"><ShieldCheck size={15} className="text-blue-600" /> 100% Secure payment via Razorpay. Supports UPI (GPay, PhonePe, Paytm), Cards & NetBanking.</div>
    </div>
  </section>;
}
