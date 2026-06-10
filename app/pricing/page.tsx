import Link from "next/link";
import { ArrowRight, Cpu, Film, ShieldCheck, Sparkles, Zap } from "lucide-react";
import type { Metadata } from "next";
import { PricingCheckoutCards } from "@/components/billing/PricingCheckoutCards";
import { pricingPlans } from "@/lib/billing/plans";

export const metadata: Metadata = {
  title: "Pricing | Itnavideo",
  description: "Simple pricing for Video Explainer reels and exports.",
};

const proof = [
  { label: "Voice analysis", icon: Cpu },
  { label: "Timeline JSON", icon: Film },
  { label: "Fast rendering", icon: Zap },
  { label: "Secure workspace", icon: ShieldCheck },
];

export default function PricingPage() {
  return (
    <main className="bg-[#050506] text-white">
      <section className="brand-surface px-6 pb-20 pt-32">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-lg border border-brand-mint/20 bg-brand-mint/10 px-3 py-2 text-sm font-bold text-brand-mint">
            <Sparkles size={16} />
            Pricing
          </div>
          <h1 className="mx-auto max-w-4xl text-5xl font-black leading-tight md:text-7xl">
            Pricing for creators who publish more.
          </h1>
          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-zinc-300">
            Start with ₹9 for one real first video, then upgrade when you are ready to publish more. Plans are sized around real AI, secure rendering, storage, retries, and maintenance costs.
          </p>

          <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-4">
            {proof.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-lg border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm font-bold text-zinc-300">
                  <Icon className="mx-auto mb-2 text-brand-mint" size={18} />
                  {item.label}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <PricingCheckoutCards plans={pricingPlans} />
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto mb-6 grid max-w-7xl gap-4 rounded-lg border border-amber-200/18 bg-amber-200/[0.055] p-6 md:grid-cols-3">
          {[
            ["₹9 test", "1 first video, max 1 minute, 1080p export, no subscription."],
            ["Cost-aware", "Plans include AI planning, transcription, secure rendering, storage, retries, and upkeep."],
            ["Current checkout", "Razorpay checkout is live in INR for domestic and enabled international card payments. PayPal and foreign-currency pricing can be added later."],
          ].map(([label, body]) => (
            <div key={label}>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-100">{label}</p>
              <p className="mt-2 text-sm font-bold leading-6 text-zinc-200">{body}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto grid max-w-7xl gap-6 rounded-lg border border-white/10 bg-zinc-950 p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">Enterprise</p>
            <h2 className="text-3xl font-black">Need custom AI video workflows?</h2>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-400">
              For agencies, media teams, and high-volume creators: team workflows, API access, priority support, template tuning, and custom render capacity.
            </p>
          </div>
          <Link href="mailto:rohi@itnavideo.com" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white px-6 py-4 font-black text-black transition hover:bg-brand-mint">
            Contact sales
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
