import Link from "next/link";
import { Gift, Mail, Instagram, ArrowRight, TrendingUp, Star, Clock } from "lucide-react";

const milestones = [
  {
    label: "Selected Creators",
    reward: "20 free credits",
    description: "Create 1 promo video",
    icon: Star,
    accent: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
  {
    label: "YouTube Video",
    reward: "20 credits",
    description: "1,000+ views",
    icon: TrendingUp,
    accent: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  {
    label: "Reels / Shorts",
    reward: "20 credits",
    description: "50,000+ views",
    icon: TrendingUp,
    accent: "text-cyan-300",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
];

export default function CreatorRewardsSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-mint/20 bg-brand-mint/[0.06] px-4 py-2 text-xs font-bold text-brand-mint">
            <Gift size={13} />
            Creator Rewards
          </div>
          <h2 className="text-2xl font-black leading-tight sm:text-3xl">
            Promote Itnavideo. <span className="text-brand-mint">Earn Free Video Credits.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
            Create a video, reel, or short about Itnavideo. If it gets views, earn free video credits to create more content.
          </p>
        </div>

        {/* Milestone cards */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {milestones.map((item) => (
            <div
              key={item.label}
              className={`rounded-xl border ${item.border} bg-white/[0.02] p-4 text-center transition hover:bg-white/[0.04]`}
            >
              <div className={`mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${item.bg}`}>
                <item.icon size={17} className={item.accent} />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">{item.label}</p>
              <p className="mt-1 text-lg font-black text-white">{item.reward}</p>
              <p className="mt-0.5 text-xs text-zinc-400">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Contact + CTA row */}
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between rounded-xl border border-white/8 bg-zinc-900/40 px-5 py-4">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <p className="text-xs text-zinc-400">
              Submit your video link + views screenshot to claim credits.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <span className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                <Mail size={11} className="text-emerald-400" />
                rohi@itnavideo.com
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                <Instagram size={11} className="text-cyan-300" />
                @itnavideo
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                <Clock size={11} className="text-brand-mint" />
                Reply within 4 hours
              </span>
            </div>
          </div>
          <Link
            href="/promote-and-earn"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black text-white transition hover:-translate-y-[1px] brand-btn-primary-dark"
          >
            See Creator Rewards
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Disclaimer */}
        <p className="mt-4 text-center text-[10px] text-zinc-600">
          No cash payout. Credits are only usable on Itnavideo to create videos.
        </p>
      </div>
    </section>
  );
}
