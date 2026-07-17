import Link from "next/link";
import { ArrowRight, HelpCircle, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { PricingCheckoutCards } from "@/components/billing/PricingCheckoutCards";
import { pricingPlans } from "@/lib/billing/plans";
import { getRegionalPlanDisplayPrices } from "@/lib/billing/region";

export const metadata: Metadata = {
  title: "Pricing — Simple Plans for AI Video Creation | Itnavideo",
  description: "Start free with 1 AI video, then upgrade to Pro or Business for more videos, no watermark, and priority rendering. Enterprise plans available for teams.",
  openGraph: {
    title: "Pricing — Simple Plans for AI Video Creation | Itnavideo",
    description: "Free, Pro, Business, and Enterprise plans for creators, businesses, and agencies.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — Simple Plans for AI Video Creation | Itnavideo",
    description: "Free, Pro, Business, and Enterprise plans for creators, businesses, and agencies.",
  },
};

export default async function PricingPage() {
  const { proPrice, businessPrice } = await getRegionalPlanDisplayPrices();
  const displayPrices: Record<string, string> = { pro: proPrice, business: businessPrice };

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
            Plans for every stage,<br />
            <span className="text-zinc-400">from first video to full team.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            Start free. Upgrade when you're ready for more videos, no watermark, and priority rendering.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 pb-16 sm:px-6">
        <PricingCheckoutCards plans={pricingPlans} displayPrices={displayPrices} />
      </section>

      {/* FAQ */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-black">Pricing FAQ</h2>
          <div className="grid gap-4">
            {[
              { q: "What do I get on the Free plan?", a: "One AI video with a watermark, so you can try Itnavideo before upgrading." },
              { q: "What happens if my render fails?", a: "If a render fails due to a system or server issue, it does not count against your monthly video limit." },
              { q: "Can I use any video type with Pro or Business?", a: "Yes. All available video templates are included; Business also unlocks premium templates and early access to new features." },
              { q: "Do paid plans have a watermark?", a: "No. Pro and Business exports have no Itnavideo watermark." },
              { q: "What if I need more than the Business plan offers?", a: "Contact sales for an Enterprise plan with custom usage, API access, and dedicated support." },
              { q: "When does my monthly limit reset?", a: "Your plan renews on the same date each month based on your activation date." },
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
