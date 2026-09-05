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
    accent: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
];

export default function CreatorRewardsSection() {
  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32 border-t border-border bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_0px,rgba(245,158,11,0.02),transparent_100%)]" />

      <div className="mx-auto max-w-5xl relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/[0.06] px-4 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 backdrop-blur-md">
            <Gift size={13} className="text-amber-500 dark:text-amber-400" />
            <span>CREATOR REWARDS</span>
          </div>
          <h2 className="text-3xl font-black leading-tight text-foreground sm:text-4xl font-sans tracking-tight">
            Promote Itnavideo. <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">Earn Free Video Credits.</span>
          </h2>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground">
            Create a video, reel, or short about Itnavideo. If it gets views, earn free video credits to create more content.
          </p>
        </div>

        {/* Milestone cards */}
        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {milestones.map((item) => (
            <div
              key={item.label}
              className={`rounded-3xl border border-border bg-card p-5 text-center shadow-sm backdrop-blur-md transition hover:border-slate-400 dark:border-border dark:bg-muted/20 dark:hover:border-border`}
            >
              <div className={`mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-2xl ${item.bg}`}>
                <item.icon size={18} className={item.accent} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{item.label}</p>
              <p className="mt-1 text-base font-black text-card-foreground">{item.reward}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Contact + CTA row */}
        <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:justify-between rounded-3xl border border-border bg-card p-6 shadow-sm backdrop-blur-md dark:border-border dark:bg-muted/30">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <p className="text-xs text-card-foreground font-bold">
              Submit your video link + views screenshot to claim credits.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-start mt-2">
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                <Mail size={12} className="text-amber-500 dark:text-amber-400" />
                rohi@itnavideo.com
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                <Instagram size={12} className="text-amber-500 dark:text-amber-400" />
                @itnavideo
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                <Clock size={12} className="text-amber-500 dark:text-amber-400" />
                Reply within 4 hours
              </span>
            </div>
          </div>
          <Link
            href="/promote-and-earn"
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-6 py-3.5 text-xs font-black text-white hover:from-amber-600 hover:to-orange-700 transition duration-300 hover:-translate-y-0.5 shadow-md shadow-orange-500/20"
          >
            See Creator Rewards
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-center text-[10px] text-muted-foreground">
          No cash payout. Credits are only usable on Itnavideo to create videos.
        </p>
      </div>
    </section>
  );
}

