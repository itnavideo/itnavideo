'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Sparkles, 
  Coins, 
  X, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Loader2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { trackViewPricing, trackBeginCheckout, trackPurchase } from '@/lib/analytics/gtag';

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
  if (typeof window !== 'undefined' && (window as any).Razorpay) return Promise.resolve(true);

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
    priceMonthly: 0,
    priceAnnual: 0,
    priceSubMonthly: '1 video / day',
    priceSubAnnual: 'forever',
    description: 'Try any video type free. No credit card required.',
    credits: '3 Free Videos',
    videoCapacity: '1 free video per day',
    videoTypes: 'All 11 AI Video Studios',
    shortLimit: '9:16 Shorts & Reels (up to 3 min)',
    longLimit: 'Not included',
    quality: '1080p Full HD',
    watermark: 'Watermark Included',
    renderSpeed: 'Standard Queue',
    cta: 'Get Started Free',
    popular: false,
  },
  {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 29,
    priceAnnual: 23,
    priceSubMonthly: '/month',
    priceSubAnnual: '/mo (billed annually)',
    description: 'For creators publishing Shorts & Reels consistently.',
    credits: '75 Videos',
    videoCapacity: '75 Shorts or ~18 YouTube videos',
    videoTypes: 'All 11 AI Video Studios',
    shortLimit: '75 × 9:16 Shorts & Reels (up to 3 min)',
    longLimit: '~18 × 16:9 YouTube videos (up to 12 min)',
    quality: '1080p Full HD',
    watermark: 'No Watermark',
    renderSpeed: 'Fast Render Queue',
    cta: 'Get Starter Plan',
    popular: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    priceMonthly: 49,
    priceAnnual: 39,
    priceSubMonthly: '/month',
    priceSubAnnual: '/mo (billed annually)',
    description: 'Best value for full-time creators & YouTube channels.',
    credits: '130 Videos',
    videoCapacity: '130 Shorts or ~32 YouTube videos',
    videoTypes: 'All 11 AI Video Studios',
    shortLimit: '130 × 9:16 Shorts & Reels (up to 3 min)',
    longLimit: '~32 × 16:9 YouTube videos (up to 12 min)',
    quality: '1080p Full HD',
    watermark: 'No Watermark',
    renderSpeed: 'Priority Render Queue',
    cta: 'Get Growth Plan',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 149,
    priceAnnual: 119,
    priceSubMonthly: '/month',
    priceSubAnnual: '/mo (billed annually)',
    description: 'High-volume power for agencies & multi-channel creators.',
    credits: '260 Videos',
    videoCapacity: '260 Shorts or ~65 YouTube videos',
    videoTypes: 'All 11 AI Video Studios',
    shortLimit: '260 × 9:16 Shorts & Reels (up to 3 min)',
    longLimit: '~65 × 16:9 YouTube videos (up to 12 min)',
    quality: '1080p Full HD',
    watermark: 'No Watermark',
    renderSpeed: 'Ultra-Fast Priority Queue',
    cta: 'Get Pro Plan',
    popular: false,
  },
];

const COMPARISON_ROWS = [
  {
    category: 'Video Workflows',
    items: [
      { name: 'Auto Caption Generator (9:16)', free: '1 Trial', starter: true, growth: true, pro: true },
      { name: 'Compare Explainer (9:16)', free: '1 Trial', starter: true, growth: true, pro: true },
      { name: 'Whiteboard Video (9:16)', free: '1 Trial', starter: true, growth: true, pro: true },
      { name: 'Kinetic Motion Video (9:16)', free: '1 Trial', starter: true, growth: true, pro: true },
      { name: 'Long Video Promotion (9:16)', free: '1 Trial', starter: true, growth: true, pro: true },
      { name: 'Long Video Clips (9:16)', free: false, starter: true, growth: true, pro: true },
      { name: 'YouTube Subtitle Generator (16:9)', free: false, starter: true, growth: true, pro: true },
      { name: 'Image to Video AI (16:9)', free: false, starter: true, growth: true, pro: true },
      { name: 'Faceless Video (16:9)', free: false, starter: true, growth: true, pro: true },
      { name: 'AI Audio Cleaner', free: '1 Trial', starter: true, growth: true, pro: true },
      { name: 'Book Summary Video (16:9)', free: false, starter: true, growth: true, pro: true },
    ],
  },
  {
    category: 'Usage & Video Limits',
    items: [
      { name: 'Videos Included', free: '3 Videos', starter: '75 Videos', growth: '130 Videos', pro: '260 Videos' },
      { name: '9:16 Shorts & Reels (TikTok / Reels / Shorts)', free: '1 trial/day', starter: '75 videos', growth: '130 videos', pro: '260 videos' },
      { name: '16:9 YouTube Videos (up to 12 min)', free: '—', starter: '~18 videos', growth: '~32 videos', pro: '~65 videos' },
      { name: 'Max Short Duration (9:16)', free: '3 min', starter: '3 min', growth: '3 min', pro: '3 min' },
      { name: 'Max Long Video Duration (16:9)', free: '—', starter: '12 min', growth: '12 min', pro: '12 min' },
    ],
  },
  {
    category: 'Output & Quality',
    items: [
      { name: 'Export Resolution', free: '1080p Full HD', starter: '1080p Full HD', growth: '1080p Full HD', pro: '1080p Full HD' },
      { name: 'Itnavideo Watermark', free: 'Included', starter: 'No Watermark', growth: 'No Watermark', pro: 'No Watermark' },
      { name: 'Aspect Ratios Supported', free: '9:16 Portrait', starter: '9:16 & 16:9', growth: '9:16 & 16:9', pro: '9:16 & 16:9' },
      { name: 'Render Queue Priority', free: 'Standard Queue', starter: 'Fast Queue', growth: 'Priority Queue', pro: 'Ultra-Fast VIP' },
    ],
  },
  {
    category: 'Support & Features',
    items: [
      { name: 'Support Level', free: 'Community', starter: 'Email Support', growth: 'Priority Email', pro: 'VIP Dedicated Support' },
      { name: 'Cloud AWS Lambda Rendering', free: true, starter: true, growth: true, pro: true },
    ],
  },
];

export function PricingSectionClient({ proPrice, businessPrice, enterprisePrice }: PricingSectionClientProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [showTable, setShowTable] = useState<boolean>(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  useEffect(() => {
    trackViewPricing('pricing_page');
  }, []);

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
        if (!scriptReady || !(window as any).Razorpay) {
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
            body: JSON.stringify({ planId, billingCycle }),
          }),
        );

        if (!order.ok || !order.key_id || !order.order_id || !order.amount || !order.currency) {
          throw new Error(order.error || "Could not prepare checkout order.");
        }

        // GA4 Funnel Step: Begin Checkout
        trackBeginCheckout({
          packId: planId,
          packName: order.planName || planId,
          price: (order.amount || 0) / 100,
          currency: order.currency || "USD",
          credits: planId === 'pro' ? 260 : planId === 'growth' ? 130 : planId === 'starter' ? 75 : 3,
        });

        const razorpay = new (window as any).Razorpay({
          key: order.key_id,
          amount: order.amount,
          currency: order.currency,
          name: "Itnavideo",
          description: `${order.planName || planId} plan (${billingCycle})`,
          order_id: order.order_id,
          theme: { color: "#FF6D00" },
          notes: { source: "itnavideo-web-checkout", billingCycle },
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

              // GA4 Primary Revenue Conversion: Purchase
              trackPurchase({
                transactionId: payment.razorpay_payment_id || payment.razorpay_order_id || `tx_${Date.now()}`,
                packId: planId,
                packName: order.planName || planId,
                price: (order.amount || 0) / 100,
                currency: order.currency || "USD",
                credits: planId === 'pro' ? 260 : planId === 'growth' ? 130 : planId === 'starter' ? 75 : 3,
              });

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
    [router, user, billingCycle],
  );

  return (
    <section id="pricing" className="relative border-b border-white/10 bg-[#050505] px-4 py-16 sm:px-6 sm:py-24 text-zinc-100 overflow-hidden">
      {/* Ambient Brand Orange Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[600px] w-[800px] rounded-full bg-[#FF6D00]/10 blur-[160px]" />

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto space-y-3">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#FF9100]">
            <Sparkles size={13} className="text-[#FF8F00] animate-pulse" />
            <span>Transparent Video Creation Pricing</span>
          </p>
          <h2 className="text-3xl font-black text-white sm:text-5xl font-sans tracking-tight">
            Plans built for <span className="bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] bg-clip-text text-transparent">video production.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-normal max-w-2xl mx-auto leading-relaxed">
            Pay for the amount and quality of video production you need. All paid plans include all 11 AI video studios with 1080p Full HD export and no watermark.
          </p>

          {/* Monthly / Annual Billing Toggle Switch */}
          <div className="pt-4 flex items-center justify-center">
            <div className="inline-flex items-center rounded-full border border-white/[0.08] bg-[#0F1117] p-1.5 shadow-xl">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`rounded-full px-5 py-2 text-xs font-black transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-md shadow-[#FF6D00]/30 scale-[1.02]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-black transition-all cursor-pointer ${
                  billingCycle === 'annual'
                    ? 'bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-md shadow-[#FF6D00]/30 scale-[1.02]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Annual Billing</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-black tracking-tight ${
                  billingCycle === 'annual' ? 'bg-black/25 text-black' : 'bg-[#FF6D00]/20 text-[#FF9100] border border-[#FF6D00]/40'
                }`}>
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {message && (
          <div
            className={`mx-auto mb-10 max-w-4xl rounded-2xl border px-5 py-4 text-sm font-bold shadow-md ${
              message.type === "success"
                ? "border-emerald-500/30 bg-emerald-950/40 text-emerald-300"
                : message.type === "error"
                  ? "border-red-500/30 bg-red-950/40 text-red-300"
                  : "border-amber-500/30 bg-amber-950/40 text-amber-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* 4 Pricing Cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-14 items-stretch">
          {PLAN_CARDS.map((plan, i) => {
            const displayPrice = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;
            const subtext = plan.id === 'free' 
              ? 'forever' 
              : billingCycle === 'annual' 
                ? plan.priceSubAnnual 
                : plan.priceSubMonthly;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`relative flex flex-col rounded-[28px] border p-6 transition-all duration-300 ${
                  plan.popular
                    ? 'border-[#FF6D00] shadow-2xl shadow-[#FF6D00]/25 ring-2 ring-[#FF6D00] lg:scale-105 z-10 bg-[#0F1117]'
                    : 'border-white/[0.08] shadow-xl bg-[#0F1117] hover:border-[#FF6D00]/40 hover:bg-[#151821]'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] px-4 py-1 text-[11px] font-black uppercase tracking-wider text-black shadow-lg shadow-[#FF6D00]/30">
                    <Sparkles size={12} className="fill-black stroke-black" />
                    <span>🔥 RECOMMENDED</span>
                  </div>
                )}

                {/* Plan Title & Subtitle */}
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-white font-sans">{plan.name}</h3>
                    {billingCycle === 'annual' && plan.id !== 'free' && (
                      <span className="rounded-full bg-[#FF6D00]/15 border border-[#FF6D00]/30 px-2 py-0.5 text-[10px] font-extrabold text-[#FF9100]">
                        Save 20%
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-normal mt-1 min-h-[32px]">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mt-4 pb-4 border-b border-white/[0.08] flex items-baseline gap-1.5">
                  <span className="text-4xl sm:text-5xl font-black text-white font-sans tracking-tight">
                    ${displayPrice}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {subtext}
                  </span>
                </div>

                {/* Video Capacity Highlight Badge */}
                <div className="my-4 p-2.5 rounded-xl bg-[#151821] border border-white/[0.08] text-center">
                  <span className="text-[11px] font-extrabold text-[#FF9100] block truncate">
                    ⚡ {plan.credits} ({plan.videoCapacity})
                  </span>
                </div>

                {/* Plan Features */}
                <ul className="space-y-2.5 text-xs text-slate-300 flex-1 my-2">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#FF9100] shrink-0" />
                    <span>{plan.videoTypes}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#FF9100] shrink-0" />
                    <span>{plan.shortLimit}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#FF9100] shrink-0" />
                    <span>{plan.longLimit}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#FF9100] shrink-0" />
                    <span>{plan.quality} ({plan.watermark})</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#FF9100] shrink-0" />
                    <span>{plan.renderSpeed}</span>
                  </li>
                </ul>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={() => startCheckout(plan.id)}
                  disabled={loadingPlan === plan.id}
                  className={`mt-6 w-full rounded-2xl py-3 px-4 text-xs font-black transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] text-black shadow-lg shadow-[#FF6D00]/25 hover:brightness-110 active:scale-95'
                      : 'bg-[#151821] border border-white/15 text-white hover:border-[#FF6D00]/50 hover:text-[#FFA726] active:scale-95'
                  }`}
                >
                  {loadingPlan === plan.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <span>{plan.cta}</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* HOW VIDEO CREDITS WORK (EXPLAINER BOX) - NORMALIZED DARK THEME */}
        <div className="mb-14 rounded-3xl border border-white/[0.08] bg-[#0F1117] p-6 sm:p-8 shadow-2xl max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08] mb-6">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-md shadow-[#FF6D00]/20">
                <Coins size={18} />
              </span>
              <div>
                <h3 className="text-base font-extrabold text-white font-sans">How Video Credits Work</h3>
                <p className="text-xs text-slate-400 font-normal">Simple — 1 credit = 1 Short render. Long 16:9 videos count as 4.</p>
              </div>
            </div>

            <span className="text-[11px] font-bold bg-[#151821] border border-white/[0.08] px-3 py-1 rounded-full text-[#FF9100]">
              1 Video = 1 Short Reel (9:16)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Rule 1 */}
            <div className="rounded-2xl bg-[#151821] p-4 border border-white/[0.08] shadow-sm">
              <div className="flex items-center gap-2 font-bold text-white mb-1">
                <span className="h-2 w-2 rounded-full bg-[#FF6D00]"></span>
                <span>1 Video</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                <strong className="text-white">9:16 Shorts &amp; Reels</strong><br />
                Auto Caption, Typography, Whiteboard, Compare, Long Video Promo.
              </p>
            </div>

            {/* Rule 2 */}
            <div className="rounded-2xl bg-[#151821] p-4 border border-white/[0.08] shadow-sm">
              <div className="flex items-center gap-2 font-bold text-white mb-1">
                <span className="h-2 w-2 rounded-full bg-[#FF8F00]"></span>
                <span>4 Videos</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                <strong className="text-white">16:9 YouTube Videos</strong><br />
                Image to Video AI, Faceless Video, YouTube Subtitles, Book Summary.
              </p>
            </div>

            {/* Rule 3 */}
            <div className="rounded-2xl bg-[#151821] p-4 border border-white/[0.08] shadow-sm">
              <div className="flex items-center gap-2 font-bold text-white mb-1">
                <span className="h-2 w-2 rounded-full bg-[#FFA726]"></span>
                <span>4 Videos / clip</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                <strong className="text-white">Long Video Clips</strong><br />
                Each AI-generated viral short clip counts as 4 videos.
              </p>
            </div>
          </div>

          {/* Quick Examples */}
          <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-slate-400 text-[11px]">
            <span className="font-bold text-white">Example Output:</span>
            <span className="bg-[#151821] px-2.5 py-1 rounded-lg border border-white/[0.08]"><strong>75 videos</strong> = 75 Shorts OR 18 YouTube videos</span>
            <span className="bg-[#151821] px-2.5 py-1 rounded-lg border border-white/[0.08]"><strong>130 videos</strong> = 130 Shorts OR 32 YouTube videos</span>
            <span className="bg-[#151821] px-2.5 py-1 rounded-lg border border-white/[0.08]"><strong>260 videos</strong> = 260 Shorts OR 65 YouTube videos</span>
          </div>
        </div>

        {/* COMPARISON TABLE SECTION - NORMALIZED DARK THEME */}
        <div className="mt-12 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-black text-white font-sans tracking-tight">
                Detailed Plan Comparison
              </h3>
              <p className="text-xs text-slate-400 font-normal">
                Compare studios, video counts, resolution, and rendering priority across all plans.
              </p>
            </div>

            <button
              onClick={() => setShowTable(!showTable)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-[#0F1117] px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white hover:border-[#FF6D00]/40 transition shadow-sm cursor-pointer"
            >
              <span>{showTable ? 'Hide Table' : 'Show Full Comparison'}</span>
              {showTable ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {showTable && (
            <div className="overflow-x-auto rounded-3xl border border-white/[0.08] bg-[#0F1117] shadow-2xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-[#151821]">
                    <th className="p-4 font-black text-white font-sans">Features &amp; Workflows</th>
                    <th className="p-4 font-black text-slate-300 text-center font-sans">Free Trial</th>
                    <th className="p-4 font-black text-slate-300 text-center font-sans">Starter</th>
                    <th className="p-4 font-black text-[#FF9100] text-center font-sans bg-[#FF6D00]/10">Growth (Popular)</th>
                    <th className="p-4 font-black text-white text-center font-sans">Pro Plan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {COMPARISON_ROWS.map((sec, idx) => (
                    <tr key={idx} className="contents">
                      <tr className="bg-[#151821]/60 border-y border-white/[0.08]">
                        <td colSpan={5} className="px-4 py-2.5 font-black text-[11px] uppercase tracking-wider text-[#FF9100] font-sans">
                          {sec.category}
                        </td>
                      </tr>
                      {sec.items.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-white/[0.02] transition duration-150">
                          <td className="p-3.5 font-semibold text-slate-200 font-sans pl-6">
                            {row.name}
                          </td>

                          {/* Free */}
                          <td className="p-3.5 text-center text-slate-400">
                            {typeof row.free === 'boolean' ? (
                              row.free ? <Check size={16} className="text-emerald-400 mx-auto" strokeWidth={3} /> : <X size={16} className="text-zinc-600 mx-auto" />
                            ) : (
                              <span className="font-bold text-slate-300">{row.free}</span>
                            )}
                          </td>

                          {/* Starter */}
                          <td className="p-3.5 text-center text-slate-300 font-medium">
                            {typeof row.starter === 'boolean' ? (
                              row.starter ? <Check size={16} className="text-[#FF9100] mx-auto" strokeWidth={3} /> : <X size={16} className="text-zinc-600 mx-auto" />
                            ) : (
                              <span className="font-bold text-white">{row.starter}</span>
                            )}
                          </td>

                          {/* Growth */}
                          <td className="p-3.5 text-center bg-[#FF6D00]/5 font-bold text-[#FFA726]">
                            {typeof row.growth === 'boolean' ? (
                              row.growth ? <Check size={16} className="text-[#FF9100] mx-auto" strokeWidth={3} /> : <X size={16} className="text-zinc-600 mx-auto" />
                            ) : (
                              <span className="font-extrabold text-[#FFA726]">{row.growth}</span>
                            )}
                          </td>

                          {/* Pro */}
                          <td className="p-3.5 text-center text-white font-extrabold">
                            {typeof (row as any).pro === 'boolean' ? (
                              (row as any).pro ? <Check size={16} className="text-emerald-400 mx-auto" strokeWidth={3} /> : <X size={16} className="text-zinc-600 mx-auto" />
                            ) : (
                              <span className="font-extrabold text-white">{(row as any).pro}</span>
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
