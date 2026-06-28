import Link from "next/link";
import { ArrowRight, Check, HelpCircle, ShieldCheck, Sparkles, Zap } from "lucide-react";
import type { Metadata } from "next";
import { PricingCheckoutCards } from "@/components/billing/PricingCheckoutCards";
import { pricingPlans } from "@/lib/billing/plans";

export const metadata: Metadata = {
  title: "Pricing — Simple Video Credits | Itnavideo",
  description: "1 video = 1 credit. Plans from $9/month. Export 1080p MP4, all templates included, no watermark.",
  openGraph: {
    title: "Pricing — Simple Video Credits | Itnavideo",
    description: "1 video = 1 credit. Plans from $9/month. Export 1080p MP4, all templates included, no watermark.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — Simple Video Credits | Itnavideo",
    description: "1 video = 1 credit. Plans from $9/month. Export 1080p MP4, all templates included, no watermark.",
  },
};

export default function PricingPage() {
  return (
    <main className="bg-[#0B1120] text-white">
      {/* Hero */}
      <section className="px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-mint/20 bg-brand-mint/[0.06] px-4 py-2 text-xs font-bold text-brand-mint">
            <Sparkles size={14} />
            Simple pricing
          </div>
          <h1 className="text-3xl font-black leading-tight sm:text-5xl md:text-6xl">
            1 video = 1 credit.<br />
            <span className="text-zinc-400">That&apos;s it.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            Choose a plan, get video credits. Use any template. Export 1080p MP4 ready for Instagram Reels, YouTube Shorts, and TikTok.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 pb-16 sm:px-6">
        <PricingCheckoutCards plans={pricingPlans} />

        {/* Credit explanation */}
        <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-white/8 bg-zinc-900/50 p-5 text-center">
          <p className="text-sm font-bold text-zinc-300">
            Every exported video uses <span className="text-brand-mint">1 credit</span>. Failed renders caused by system issues are not charged.
          </p>
          <p className="mt-2 text-xs text-zinc-500">
            Podcast clips: 3 generated clips = 3 credits. You choose which clips to export.
          </p>
        </div>

        {/* Trust line */}
        <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-4 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-brand-mint/70" />Secure Razorpay checkout</span>
          <span className="flex items-center gap-1.5"><Check size={13} className="text-brand-mint/70" />No watermark</span>
          <span className="flex items-center gap-1.5"><Zap size={13} className="text-brand-mint/70" />Start creating in minutes</span>
        </div>
      </section>

      {/* Compare Plans Table */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-2xl font-black">Compare Plans</h2>
          <div className="overflow-x-auto rounded-xl border border-white/8">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b border-white/8 bg-zinc-900/50">
                  <th className="px-4 py-4 text-left font-bold text-zinc-400">Feature</th>
                  <th className="px-4 py-4 text-center font-black text-white">Starter<br/><span className="text-xs font-bold text-zinc-500">$9/mo</span></th>
                  <th className="px-4 py-4 text-center font-black" style={{ color: 'var(--color-primary-hover)' }}>Creator<br/><span className="text-xs font-bold text-zinc-500">$19/mo</span></th>
                  <th className="px-4 py-4 text-center font-black text-white">Business<br/><span className="text-xs font-bold text-zinc-500">$39/mo</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  ["Monthly video credits", "25", "60", "150"],
                  ["1 video = 1 credit", "✓", "✓", "✓"],
                  ["All 6 production templates", "✓", "✓", "✓"],
                  ["1080p HD export", "✓", "✓", "✓"],
                  ["No watermark", "✓", "✓", "✓"],
                  ["Auto captions", "✓", "✓", "✓"],
                  ["AI template planning", "✓", "✓", "✓"],
                  ["Priority rendering", "—", "✓", "✓"],
                  ["Commercial usage", "—", "—", "✓"],
                  ["Priority queue", "—", "—", "✓"],
                ].map(([feature, starter, creator, business]) => (
                  <tr key={feature} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-zinc-300">{feature}</td>
                    <td className="px-4 py-3 text-center">{starter === "✓" ? <Check size={16} className="mx-auto" style={{ color: '#5F6E8A' }} /> : starter === "—" ? <span style={{ color: '#3D3D4A' }}>—</span> : <span className="font-black text-white">{starter}</span>}</td>
                    <td className="px-4 py-3 text-center">{creator === "✓" ? <Check size={16} className="mx-auto" style={{ color: '#60A5FA' }} /> : creator === "—" ? <span style={{ color: '#3D3D4A' }}>—</span> : <span className="font-black" style={{ color: '#60A5FA' }}>{creator}</span>}</td>
                    <td className="px-4 py-3 text-center">{business === "✓" ? <Check size={16} className="mx-auto" style={{ color: '#22D3EE' }} /> : business === "—" ? <span style={{ color: '#3D3D4A' }}>—</span> : <span className="font-black" style={{ color: '#22D3EE' }}>{business}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-black">Pricing FAQ</h2>
          <div className="grid gap-4">
            {[
              { q: "What is one video credit?", a: "One exported video = one credit. Upload content, choose any template, generate one reel = 1 credit used." },
              { q: "What happens if my render fails?", a: "If a render fails due to a system or server issue, the credit is not charged or gets refunded automatically." },
              { q: "Can I use any template with any plan?", a: "Yes. All 6 production templates are available on every plan including Starter. No templates are locked behind higher tiers." },
              { q: "Do videos have a watermark?", a: "No. All paid plans export clean videos without any Itnavideo watermark." },
              { q: "Can I use the videos commercially?", a: "The Business plan includes commercial usage rights. Starter and Creator are for personal/creator use." },
              { q: "What video formats are supported?", a: "Output is 1080×1920 MP4 at 30fps — ready for Instagram Reels, YouTube Shorts, TikTok, and WhatsApp." },
              { q: "What if I run out of credits?", a: "You can upgrade to a higher plan anytime. Credits refresh monthly with your billing cycle." },
              { q: "When is a credit used?", a: "Preview generation and editing are free. A credit is used only when the final export starts." },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-lg border border-white/8 bg-zinc-900/30 p-5">
                <div className="flex items-start gap-3">
                  <HelpCircle size={16} className="mt-0.5 shrink-0 text-brand-mint/60" />
                  <div>
                    <p className="font-black text-white">{q}</p>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">{a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-4xl rounded-xl border border-white/10 bg-zinc-950 p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-mint">Enterprise</p>
            <h2 className="mt-2 text-2xl font-black">Need custom volume or API access?</h2>
            <p className="mt-2 text-sm text-zinc-400">For agencies, media teams, and high-volume creators.</p>
          </div>
          <Link href="mailto:rohi@itnavideo.com" className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 font-black text-black transition hover:bg-brand-mint sm:mt-0">
            Contact us
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Minimal footer for pricing page */}
      <footer className="border-t border-white/5 px-4 py-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6 text-xs text-zinc-600">
          <Link href="/terms" className="hover:text-white transition">Terms</Link>
          <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
          <Link href="/contact" className="hover:text-white transition">Contact</Link>
          <span>© 2026 Itnavideo Inc.</span>
        </div>
      </footer>
    </main>
  );
}
