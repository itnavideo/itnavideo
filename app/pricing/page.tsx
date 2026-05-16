import Link from "next/link";
import { ArrowRight, BadgeCheck, Check, Cpu, Film, ShieldCheck, Sparkles, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | Itnavideo",
  description: "Simple pricing for AI audio-first videos, captions, and exports.",
};

const plans = [
  {
    name: "Starter",
    price: "$0",
    description: "For testing audio-first Shorts.",
    features: ["2 free videos", "720p previews", "Basic captions", "Audio-only MVP", "Media uploads paused"],
    button: "Start free",
    href: "/signup",
    locked: false,
    popular: false,
  },
  {
    name: "Launch",
    price: "$9",
    description: "For new creators who want an affordable monthly plan.",
    features: ["20 videos per month", "1080p exports", "English subtitles", "Audio-first workflow", "No watermark"],
    button: "Locked until Stripe approval",
    href: "/billing",
    locked: true,
    popular: false,
  },
  {
    name: "Creator",
    price: "$19",
    description: "For creators posting consistently across platforms.",
    features: ["50 videos per month", "1080p exports", "Karaoke subtitles", "Private asset library", "SFX suggestions", "No watermark"],
    button: "Locked until Stripe approval",
    href: "/billing",
    locked: true,
    popular: true,
  },
  {
    name: "Studio",
    price: "$49",
    description: "For agencies, brands, and teams.",
    features: ["150 videos per month", "1080p exports", "Priority rendering", "Advanced director logic", "Team-ready workflows", "Long-form beta access"],
    button: "Locked until Stripe approval",
    href: "/billing",
    locked: true,
    popular: false,
  },
];

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
            Start with your voice and generate a typography-first Short. Paid upgrades are staged behind approval while the working 720p demo stays live.
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
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
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
                <span className="text-zinc-500"> / month</span>
              </div>
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm leading-6 text-zinc-300">
                    <Check className="mt-1 shrink-0 text-brand-mint" size={17} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`mt-9 inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-4 font-black transition ${
                  plan.locked
                    ? "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
                    : plan.popular
                      ? "bg-brand-mint text-black hover:bg-white"
                      : "bg-white text-black hover:bg-brand-mint"
                }`}
              >
                {plan.button}
                <ArrowRight size={17} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-7xl gap-6 rounded-lg border border-white/10 bg-zinc-950 p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">Enterprise</p>
            <h2 className="text-3xl font-black">Need custom AI video workflows?</h2>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-400">
              For agencies, media teams, and high-volume creators: custom rendering pipelines, API access, team workflows, private asset libraries, and priority support.
            </p>
          </div>
          <Link href="mailto:sales@itnavideo.com" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white px-6 py-4 font-black text-black transition hover:bg-brand-mint">
            Contact sales
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
