'use client';

import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BadgeCheck, 
  Check, 
  Sparkles, 
  Coins, 
  X, 
  Video, 
  Zap, 
  ShieldCheck, 
  HelpCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Loader2,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';

type PricingSectionClientProps = {
  proPrice?: string;
  businessPrice?: string;
  enterprisePrice?: string;
};

async function getSessionHeaders() {
  const { data, error } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;
  if (error || !accessToken) throw new Error("Please log in again before checkout.");
  return { Authorization: `Bearer ${accessToken}` };
}

function loadRazorpayScript() {
  if (typeof window !== 'undefined' && window.Razorpay) return Promise.resolve(true);

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

const PLAN_CARDS = [
  {
    id: 'free',
    name: 'Free Trial',
    price: '₹0',
    priceSub: '1 Free Credit',
    description: 'Try Itnavideo before subscribing.',
    credits: '1 Free Credit',
    videoCapacity: '1 Free AI Reel Video',
    videoTypes: 'Try All 11 AI Video Workflows',
    shortLimit: '1 Reel (up to 60s)',
    longLimit: 'Not included',
    quality: '720p Export',
    watermark: 'Watermark Included',
    renderSpeed: 'Standard Queue',
    cta: 'Get Started Free',
    href: '/signup',
    popular: false,
    badgeColor: 'border-slate-200 bg-white text-slate-800',
    accentColor: 'text-slate-500',
  },
  {
    id: 'caption-only',
    name: 'Caption Pack',
    price: '$2',
    priceSub: '/month',
    description: 'Captions only — 10 videos/month. Perfect entry point.',
    credits: '10 Credits / month',
    videoCapacity: '≈ 10 Caption Videos',
    videoTypes: 'Auto Caption + Caption Studio (20+ styles)',
    shortLimit: '10 Caption Videos (9:16)',
    longLimit: 'Not included',
    quality: '1080p Full HD',
    watermark: 'No Watermark',
    renderSpeed: 'Standard Queue',
    cta: 'Get Caption Pack ($2)',
    href: '/pricing',
    popular: false,
    badgeColor: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    accentColor: 'text-emerald-600',
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '$9',
    priceSub: '/month',
    description: 'For creators starting out on reels & shorts.',
    credits: '35 Credits / month',
    videoCapacity: '≈ 35 Short Reels or 17 Explainers',
    videoTypes: 'All 11 AI Video Workflows',
    shortLimit: '35 Short Reels (9:16)',
    longLimit: '16:9 Videos (1 credit/min)',
    quality: '1080p Full HD',
    watermark: 'No Watermark',
    renderSpeed: 'Fast Render Queue',
    cta: 'Get Starter ($9)',
    href: '/pricing',
    popular: false,
    badgeColor: 'border-blue-200 bg-blue-50 text-blue-700',
    accentColor: 'text-blue-600',
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$24',
    priceSub: '/month',
    description: 'For active creators publishing consistently.',
    credits: '99 Credits / month',
    videoCapacity: '≈ 99 Short Reels or 49 Explainers',
    videoTypes: 'All 11 AI Video Workflows',
    shortLimit: '99 Short Reels (9:16)',
    longLimit: '16:9 Videos (1 credit/min)',
    quality: '1080p Full HD',
    watermark: 'No Watermark',
    renderSpeed: 'Priority Render Queue',
    cta: 'Get Growth ($24)',
    href: '/pricing',
    popular: true,
    badgeColor: 'border-blue-500 bg-blue-600 text-white shadow-md',
    accentColor: 'text-blue-600',
  },
  {
    id: 'agency',
    name: 'Agency',
    price: '$49',
    priceSub: '/month',
    description: 'For agencies, teams & high-volume creators.',
    credits: '250 Credits / month',
    videoCapacity: '≈ 250 Short Reels or 125 Explainers',
    videoTypes: 'All 11 AI Video Workflows',
    shortLimit: '250 Short Reels (9:16)',
    longLimit: '16:9 Videos (1 credit/min)',
    quality: '1080p Full HD',
    watermark: 'No Watermark',
    renderSpeed: 'Ultra-Fast Priority Queue',
    cta: 'Get Agency ($49)',
    href: '/pricing',
    popular: false,
    badgeColor: 'border-slate-200 bg-white text-slate-800',
    accentColor: 'text-cyan-600',
  },
];

const COMPARISON_ROWS = [
  {
    category: 'Video Workflows',
    items: [
      { name: 'Auto Caption Reel (9:16)', free: '1 Trial', captionOnly: true, starter: true, growth: true, agency: true },
      { name: 'Caption Studio', free: '1 Trial', captionOnly: true, starter: true, growth: true, agency: true },
      { name: 'Compare Explainer', free: '1 Trial', captionOnly: true, starter: true, growth: true, agency: true },
      { name: 'Long Video Promo (Reel)', free: '1 Trial', captionOnly: true, starter: true, growth: true, agency: true },
      { name: 'Whiteboard Video', free: '1 Trial', captionOnly: false, starter: true, growth: true, agency: true },
      { name: 'Kinetic Typography', free: '1 Trial', captionOnly: false, starter: true, growth: true, agency: true },
      { name: 'Multi Images Video', free: '1 Trial', captionOnly: false, starter: true, growth: true, agency: true },
      { name: 'Long Caption Pro (16:9)', free: false, captionOnly: false, starter: true, growth: true, agency: true },
      { name: 'Long Video Clips', free: false, captionOnly: false, starter: true, growth: true, agency: true },
      { name: 'Long Video Pro', free: false, captionOnly: false, starter: true, growth: true, agency: true },
      { name: 'Auto Draw Explainer', free: '1 Trial', captionOnly: false, starter: true, growth: true, agency: true },
      { name: 'AI Audio Cleaner', free: '1 Trial', captionOnly: false, starter: true, growth: true, agency: true },
      { name: 'Dynamic Creator Reel', free: '1 Trial', captionOnly: false, starter: true, growth: true, agency: true },
      { name: 'Background Replace', free: '1 Trial', captionOnly: false, starter: true, growth: true, agency: true },
      { name: 'Custom AI Director', free: '1 Trial', captionOnly: false, starter: true, growth: true, agency: true },
    ],
  },
  {
    category: 'Usage & Video Limits',
    items: [
      { name: 'Monthly Credits', free: '1 Credit', captionOnly: '10 / mo', starter: '35 / mo', growth: '99 / mo', agency: '250 / mo' },
      { name: 'Short-Form Reels (9:16)', free: '1 Reel', captionOnly: '≈ 10 Reels', starter: '≈ 35 Reels', growth: '≈ 99 Reels', agency: '≈ 250 Reels' },
      { name: 'Long-Form Videos (16:9)', free: '—', captionOnly: '—', starter: 'Up to 35 min', growth: 'Up to 99 min', agency: 'Up to 250 min' },
      { name: 'Maximum Reel Duration', free: '60 sec', captionOnly: '60 sec', starter: '60 sec', growth: '60 sec', agency: '60 sec' },
      { name: 'Maximum Long Video Duration', free: '—', captionOnly: '—', starter: '10 Minutes', growth: '10 Minutes', agency: '10 Minutes' },
    ],
  },
  {
    category: 'Output & Quality',
    items: [
      { name: 'Export Resolution', free: '720p HD', captionOnly: '1080p Full HD', starter: '1080p Full HD', growth: '1080p Full HD', agency: '1080p Full HD' },
      { name: 'Itnavideo Watermark', free: 'Included', captionOnly: 'No Watermark', starter: 'No Watermark', growth: 'No Watermark', agency: 'No Watermark' },
      { name: 'Aspect Ratios Supported', free: '9:16 Portrait', captionOnly: '9:16 Only', starter: '9:16 & 16:9', growth: '9:16 & 16:9', agency: '9:16 & 16:9' },
      { name: 'Render Queue Priority', free: 'Standard Queue', captionOnly: 'Standard Queue', starter: 'Fast Queue', growth: 'Priority Queue', agency: 'Ultra-Fast VIP' },
    ],
  },
  {
    category: 'Support & Collaboration',
    items: [
      { name: 'Support Level', free: 'Community', captionOnly: 'Email Support', starter: 'Email Support', growth: 'Priority Chat & Email', agency: 'VIP Dedicated Support' },
      { name: 'Team Collaboration', free: false, captionOnly: false, starter: false, growth: false, agency: true },
    ],
  },
];

export function PricingSectionClient({ proPrice, businessPrice, enterprisePrice }: PricingSectionClientProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [showTable, setShowTable] = useState<boolean>(true);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  const startCheckout = useCallback(
    async (planId: string) => {
      if (planId === "free") {
        router.push(user ? "/dashboard" : "/signup");
        return;
      }

      if (!user) {
        setMessage({ type: "info", text: "Please log in first so we can activate access on your account." });
        router.push("/login");
        return;
      }

      setLoadingPlan(planId);
      setMessage({ type: "info", text: "Opening secure Razorpay checkout..." });

      try {
        const scriptReady = await loadRazorpayScript();
        if (!scriptReady || !window.Razorpay) {
          throw new Error("Could not load Razorpay checkout. Please refresh and try again.");
        }

        const authHeaders = await getSessionHeaders();
        const order = await readJson<{
          ok: boolean;
          key_id?: string;
          order_id?: string;
          amount: number;
          currency: string;
          planName?: string;
          error?: string;
        }>(
          await fetch("/api/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json", ...authHeaders },
            body: JSON.stringify({ planId }),
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
          description: `${order.planName || planId} plan`,
          order_id: order.order_id,
          theme: { color: "#2563EB" },
          notes: { source: "itnavideo-web-checkout" },
          modal: {
            ondismiss: () => {
              setLoadingPlan(null);
              setMessage({ type: "info", text: "Payment cancelled. You can try again anytime." });
            },
          },
          handler: async (payment: any) => {
            try {
              const verification = await readJson<{
                ok: boolean;
                paid?: boolean;
                accessActivated?: boolean;
                error?: string;
              }>(
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
              router.push(`/dashboard?payment=success&plan=${encodeURIComponent(planId)}`);
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

        razorpay.on("payment.failed", (response: any) => {
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
    <section id="pricing" className="relative px-4 py-20 sm:px-6 sm:py-28 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="mb-14 text-center max-w-3xl mx-auto space-y-3">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700">
            <Sparkles size={13} className="text-blue-600" />
            <span>Transparent Video Creation Pricing</span>
          </p>
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-5xl font-sans tracking-tight">
            Plans built for video production.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-normal max-w-2xl mx-auto">
            Pay for the amount and quality of video production you need. All paid plans include all 11 AI video workflows with 1080p export and no watermark.
          </p>
        </div>

        {message && (
          <div
            className={`mx-auto mb-10 max-w-4xl rounded-2xl border px-5 py-4 text-sm font-bold shadow-md ${
              message.type === "success"
                ? "border-emerald-500/30 bg-emerald-50 text-emerald-800"
                : message.type === "error"
                  ? "border-red-500/30 bg-red-50 text-red-800"
                  : "border-blue-500/30 bg-blue-50 text-blue-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* 4 Pricing Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 mb-12">
          {PLAN_CARDS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`relative flex flex-col rounded-3xl border p-5 sm:p-6 transition-all duration-200 bg-white ${
                plan.popular
                  ? 'border-blue-600 shadow-xl ring-2 ring-blue-600 lg:-translate-y-2'
                  : 'border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-blue-600 px-3.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-white shadow-md">
                  <BadgeCheck size={12} />
                  <span>Most Popular</span>
                </div>
              )}

              {/* Plan Title & Subtitle */}
              <div>
                <h3 className="text-lg font-black text-slate-900 font-sans">{plan.name}</h3>
                <p className="text-xs text-slate-500 font-normal mt-0.5 min-h-[32px]">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mt-4 pb-4 border-b border-slate-100 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 font-sans tracking-tight">{plan.price}</span>
                <span className="text-xs font-semibold text-slate-500">{plan.priceSub}</span>
              </div>

              {/* Video Capacity Highlight Badge */}
              <div className="my-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                <span className="text-[11px] font-extrabold text-blue-700 block truncate">
                  {plan.videoCapacity}
                </span>
              </div>

              {/* Core Feature Bullet Points */}
              <ul className="space-y-2.5 text-xs text-slate-700 flex-1 my-2">
                <li className="flex items-center gap-2 font-medium">
                  <Check size={14} className="text-blue-600 shrink-0" strokeWidth={2.5} />
                  <span><strong>{plan.credits}</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-blue-600 shrink-0" strokeWidth={2.5} />
                  <span>{plan.videoTypes}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-blue-600 shrink-0" strokeWidth={2.5} />
                  <span>{plan.quality}</span>
                </li>
                <li className="flex items-center gap-2 font-bold text-slate-900">
                  <Check size={14} className="text-blue-600 shrink-0" strokeWidth={2.5} />
                  <span>{plan.watermark}</span>
                </li>
                <li className="flex items-center gap-2 text-slate-600">
                  <Check size={14} className="text-blue-600 shrink-0" strokeWidth={2.5} />
                  <span>{plan.renderSpeed}</span>
                </li>
              </ul>

              {/* CTA Button */}
              <button
                type="button"
                disabled={Boolean(loadingPlan) || authLoading}
                onClick={() => startCheckout(plan.id)}
                className={`mt-6 flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-black transition-all duration-150 ${
                  plan.popular
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 hover:bg-blue-700'
                    : 'bg-slate-100 text-slate-800 hover:bg-blue-600 hover:text-white border border-slate-200'
                }`}
              >
                {loadingPlan === plan.id ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : (
                  <CreditCard size={14} />
                )}
                <span>{loadingPlan === plan.id ? "Preparing..." : plan.cta}</span>
                {!loadingPlan && <ArrowRight size={14} />}
              </button>
            </motion.div>
          ))}
        </div>

        {/* HOW VIDEO CREDITS WORK (EXPLAINER BOX) */}
        <div className="mb-14 rounded-3xl border border-blue-200 bg-blue-50/50 p-6 sm:p-8 shadow-xs max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-blue-200/80 mb-6">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-blue-600 text-white shadow-2xs">
                <Coins size={18} />
              </span>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-sans">How Video Credits Work</h3>
                <p className="text-xs text-slate-600 font-normal">Simple, transparent render calculation for every workflow</p>
              </div>
            </div>

            <span className="text-[11px] font-bold bg-white border border-blue-200 px-3 py-1 rounded-full text-blue-700">
              1 Credit = 1 Short Reel (up to 60s)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            
            {/* Rule 1 */}
            <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                <span>1 Credit / Video</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                <strong>Standard Short Reels (9:16)</strong><br />
                Auto Caption Reel, Long Video Promo, Kinetic Typography.
              </p>
            </div>

            {/* Rule 2 */}
            <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
                <span>2 Credits / Video</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                <strong>Complex AI Workflows</strong><br />
                Caption Studio, Compare Explainer, Whiteboard, Multi Images.
              </p>
            </div>

            {/* Rule 3 */}
            <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                <span className="h-2 w-2 rounded-full bg-cyan-600"></span>
                <span>1 Credit / Minute</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                <strong>16:9 Long-Form Videos</strong><br />
                Long Caption Pro &amp; Long Video Pro (up to 10 min duration).
              </p>
            </div>

          </div>

          {/* Quick Examples */}
          <div className="mt-6 pt-4 border-t border-blue-200/60 flex flex-wrap items-center justify-between gap-3 text-slate-600 text-[11px]">
            <span className="font-bold text-slate-900">Example Monthly Yields:</span>
            <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200"><strong>35 Credits</strong> = 35 Reels OR 17 Explainers OR 35 Mins Long-Form</span>
            <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200"><strong>99 Credits</strong> = 99 Reels OR 49 Explainers OR 99 Mins Long-Form</span>
            <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200"><strong>250 Credits</strong> = 250 Reels OR 125 Explainers OR 250 Mins Long-Form</span>
          </div>
        </div>

        {/* COMPARISON TABLE SECTION */}
        <div className="mt-12 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900 font-sans tracking-tight">
                Detailed Plan Comparison
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                Compare workflows, credit rules, resolution, and rendering priority across all plans.
              </p>
            </div>

            <button
              onClick={() => setShowTable(!showTable)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            >
              <span>{showTable ? 'Hide Table' : 'Show Full Comparison'}</span>
              {showTable ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {showTable && (
            <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="p-4 font-black text-slate-900 font-sans">Features &amp; Workflows</th>
                    <th className="p-4 font-black text-slate-800 text-center font-sans">Free Trial</th>
                    <th className="p-4 font-black text-violet-700 text-center font-sans bg-violet-50/50">Reel Starter ($2)</th>
                    <th className="p-4 font-black text-blue-700 text-center font-sans">Starter ($9)</th>
                    <th className="p-4 font-black text-blue-700 text-center font-sans bg-blue-50/60">Growth ($24)</th>
                    <th className="p-4 font-black text-slate-900 text-center font-sans">Agency ($49)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {COMPARISON_ROWS.map((sec, idx) => (
                    <tr key={idx} className="contents">
                      <tr className="bg-slate-100/70 border-y border-slate-200/80">
                        <td colSpan={6} className="px-4 py-2.5 font-black text-[11px] uppercase tracking-wider text-slate-700 font-sans">
                          {sec.category}
                        </td>
                      </tr>
                      {sec.items.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50/50 transition duration-150">
                          <td className="p-3.5 font-semibold text-slate-800 font-sans pl-6">
                            {row.name}
                          </td>

                          {/* Free */}
                          <td className="p-3.5 text-center text-slate-600">
                            {typeof row.free === 'boolean' ? (
                              row.free ? <Check size={16} className="text-emerald-600 mx-auto" strokeWidth={3} /> : <X size={16} className="text-muted-foreground mx-auto" />
                            ) : (
                              <span className="font-bold text-slate-700">{row.free}</span>
                            )}
                          </td>

                          {/* Reel Starter */}
                          <td className="p-3.5 text-center bg-violet-50/30 text-violet-700 font-medium">
                            {typeof (row as any).captionOnly === 'boolean' ? (
                              (row as any).captionOnly ? <Check size={16} className="text-violet-600 mx-auto" strokeWidth={3} /> : <X size={16} className="text-muted-foreground mx-auto" />
                            ) : (
                              <span className="font-bold text-violet-700">{(row as any).captionOnly}</span>
                            )}
                          </td>

                          {/* Starter */}
                          <td className="p-3.5 text-center text-slate-700 font-medium">
                            {typeof row.starter === 'boolean' ? (
                              row.starter ? <Check size={16} className="text-blue-600 mx-auto" strokeWidth={3} /> : <X size={16} className="text-muted-foreground mx-auto" />
                            ) : (
                              <span className="font-bold text-slate-900">{row.starter}</span>
                            )}
                          </td>

                          {/* Growth */}
                          <td className="p-3.5 text-center bg-blue-50/30 font-bold text-blue-900">
                            {typeof row.growth === 'boolean' ? (
                              row.growth ? <Check size={16} className="text-blue-600 mx-auto" strokeWidth={3} /> : <X size={16} className="text-muted-foreground mx-auto" />
                            ) : (
                              <span className="font-extrabold text-blue-700">{row.growth}</span>
                            )}
                          </td>

                          {/* Agency */}
                          <td className="p-3.5 text-center text-slate-900 font-extrabold">
                            {typeof row.agency === 'boolean' ? (
                              row.agency ? <Check size={16} className="text-emerald-600 mx-auto" strokeWidth={3} /> : <X size={16} className="text-muted-foreground mx-auto" />
                            ) : (
                              <span className="font-extrabold text-slate-900">{row.agency}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

