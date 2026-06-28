import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  Clock,
  Gift,
  Instagram,
  Mail,
  Play,
  Send,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Video,
  Youtube,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Promote Itnavideo & Earn Free Video Credits",
  description:
    "Create a video about Itnavideo and earn free video credits. No cash payout — just free access to generate more reels, shorts, and promo videos.",
  openGraph: {
    title: "Promote Itnavideo & Earn Free Video Credits",
    description:
      "Create content promoting Itnavideo. Get free credits to make more reels and shorts. Creator reward program — no cash, just free video access.",
  },
};

const youtubeRewards = [
  { views: "100+", credits: 2, highlight: false },
  { views: "500+", credits: 5, highlight: false },
  { views: "1,000+", credits: 20, highlight: true },
  { views: "5,000+", credits: 50, highlight: true, note: "Manual approval" },
];

const shortsRewards = [
  { views: "10,000+", credits: 5, highlight: false },
  { views: "50,000+", credits: 20, highlight: false },
  { views: "100,000+", credits: 50, highlight: true },
  { views: "500,000+", credits: "Custom", highlight: true, note: "Manual approval" },
];

const steps = [
  {
    step: 1,
    title: "Create a video about Itnavideo",
    description: "Review, tutorial, demo, or 'how I make reels with Itnavideo'",
    icon: Video,
  },
  {
    step: 2,
    title: "Publish it",
    description: "Upload on YouTube, Instagram, TikTok, or YouTube Shorts",
    icon: Play,
  },
  {
    step: 3,
    title: "Send us the proof",
    description: "Share the link + views screenshot + your Itnavideo email",
    icon: Send,
  },
  {
    step: 4,
    title: "Get free credits",
    description: "Credits added to your account after team review",
    icon: Gift,
  },
];

const eligibleContent = [
  "Itnavideo review or walkthrough",
  "Itnavideo tutorial (how to create reels)",
  '"How I made reels using Itnavideo"',
  "Before/after video using Itnavideo",
  "Product demo showing Itnavideo features",
  "Creator explaining how Itnavideo helps",
];

const contentRequirements = [
  "Itnavideo name clearly mentioned",
  "Itnavideo website shown or linked",
  "Itnavideo screen/demo visible",
  "Caption/description includes Itnavideo mention or link",
];

const rules = [
  "No cash payout — credits are only usable on Itnavideo",
  "Credits cannot be withdrawn as money",
  "Fake views, bot views, spam, or copied videos will be rejected",
  "Same video can be rewarded only once per milestone",
  "Duplicate or re-uploaded content may be rejected",
  "Itnavideo team has final approval rights",
  "Credits may expire after 60 days (if we enable expiry later)",
  "Rewards can change anytime during beta/early access",
];

export default function PromoteAndEarnPage() {
  return (
    <main className="bg-[#0B1120] text-white">
      {/* Hero */}
      <section className="px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-mint/20 bg-brand-mint/[0.06] px-4 py-2 text-xs font-bold text-brand-mint">
            <Gift size={14} />
            Creator Rewards Program
          </div>
          <h1 className="text-3xl font-black leading-tight sm:text-5xl md:text-6xl">
            Promote Itnavideo.<br />
            <span className="text-brand-mint">Earn Free Video Credits.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            Create a video about Itnavideo and get free credits to generate more reels, shorts, and promo videos. No cash payout — just free Itnavideo access.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="mailto:rohi@itnavideo.com?subject=Itnavideo%20Promotion%20Credit%20Claim"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-mint px-6 py-3.5 text-sm font-black text-black transition hover:bg-brand-mint/90 hover:shadow-lg hover:shadow-brand-mint/20"
            >
              <Mail size={16} />
              Submit Your Video
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-bold text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.06]"
            >
              How It Works
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* Top Creator Highlight */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-2xl border border-brand-mint/30 bg-gradient-to-br from-brand-mint/[0.08] to-brand-mint/[0.02] p-6 sm:p-8">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-mint/10 blur-3xl" />
            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-brand-mint/10 px-3 py-1.5 text-xs font-bold text-brand-mint">
                <Star size={12} />
                Top Creator Offer
              </div>
              <h2 className="text-xl font-black sm:text-2xl">
                Selected Creators Get <span className="text-brand-mint">20 Free Video Credits</span>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                We personally invite selected creators to promote Itnavideo. If you create and publish one promotional video, you get <strong className="text-white">20 free video credits</strong> — enough to create 20 reels on Itnavideo for free.
              </p>
              <p className="mt-4 text-xs text-zinc-500">
                Interested? Reach out to us and show your channel/page. We select creators based on content quality, not follower count.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-2xl font-black sm:text-3xl">How It Works</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((item) => (
              <div
                key={item.step}
                className="group relative rounded-xl border border-white/8 bg-white/[0.02] p-5 transition hover:border-white/15 hover:bg-white/[0.04]"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-mint/10 text-brand-mint">
                  <item.icon size={20} />
                </div>
                <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Step {item.step}
                </div>
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reward Tables */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-3 text-center text-2xl font-black sm:text-3xl">Earn Credits Based on Views</h2>
          <p className="mx-auto mb-10 max-w-xl text-center text-sm text-zinc-400">
            More views = more free video credits. Rewards are based on actual views on your promotional content.
          </p>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* YouTube Long Videos */}
            <div className="rounded-xl border border-white/8 bg-white/[0.02] overflow-hidden">
              <div className="flex items-center gap-3 border-b border-white/8 bg-red-500/[0.06] px-5 py-4">
                <Youtube size={20} className="text-red-400" />
                <div>
                  <h3 className="text-sm font-black text-white">YouTube Long Videos</h3>
                  <p className="text-[11px] text-zinc-400">Reviews, tutorials, demos</p>
                </div>
              </div>
              <div className="divide-y divide-white/5">
                {youtubeRewards.map((reward) => (
                  <div
                    key={reward.views}
                    className={`flex items-center justify-between px-5 py-3.5 ${reward.highlight ? "bg-brand-mint/[0.03]" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp size={13} className="text-zinc-500" />
                      <span className="text-sm text-zinc-300">
                        <strong className="text-white">{reward.views}</strong> views
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-md px-2.5 py-1 text-xs font-bold ${reward.highlight ? "bg-brand-mint/15 text-brand-mint" : "bg-white/5 text-zinc-300"}`}>
                        {reward.credits} credits
                      </span>
                      {reward.note && (
                        <span className="rounded bg-yellow-500/10 px-1.5 py-0.5 text-[9px] font-bold text-yellow-400">
                          {reward.note}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shorts / Reels / TikTok */}
            <div className="rounded-xl border border-white/8 bg-white/[0.02] overflow-hidden">
              <div className="flex items-center gap-3 border-b border-white/8 bg-cyan-500/[0.06] px-5 py-4">
                <Instagram size={20} className="text-cyan-300" />
                <div>
                  <h3 className="text-sm font-black text-white">Reels / Shorts / TikTok</h3>
                  <p className="text-[11px] text-zinc-400">Short-form promotional content</p>
                </div>
              </div>
              <div className="divide-y divide-white/5">
                {shortsRewards.map((reward) => (
                  <div
                    key={reward.views}
                    className={`flex items-center justify-between px-5 py-3.5 ${reward.highlight ? "bg-brand-mint/[0.03]" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp size={13} className="text-zinc-500" />
                      <span className="text-sm text-zinc-300">
                        <strong className="text-white">{reward.views}</strong> views
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-md px-2.5 py-1 text-xs font-bold ${reward.highlight ? "bg-brand-mint/15 text-brand-mint" : "bg-white/5 text-zinc-300"}`}>
                        {typeof reward.credits === "number" ? `${reward.credits} credits` : reward.credits}
                      </span>
                      {reward.note && (
                        <span className="rounded bg-yellow-500/10 px-1.5 py-0.5 text-[9px] font-bold text-yellow-400">
                          {reward.note}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Eligible Content */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-black sm:text-3xl">What Content Qualifies?</h2>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Eligible Examples */}
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-brand-mint">
                <BadgeCheck size={16} />
                Eligible Video Types
              </h3>
              <ul className="space-y-2.5">
                {eligibleContent.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-zinc-300">
                    <Sparkles size={11} className="mt-0.5 shrink-0 text-brand-mint/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
                <Shield size={16} className="text-zinc-400" />
                Your Video Must Include
              </h3>
              <ul className="space-y-2.5">
                {contentRequirements.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-zinc-300">
                    <BadgeCheck size={11} className="mt-0.5 shrink-0 text-zinc-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[11px] text-zinc-500">
                At least one of the above must be clearly visible in your video.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Claim */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-black sm:text-3xl">How to Claim Credits</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Email */}
            <a
              href="mailto:rohi@itnavideo.com?subject=Itnavideo%20Promotion%20Credit%20Claim"
              className="group rounded-xl border border-white/8 bg-white/[0.02] p-5 transition hover:border-brand-mint/30 hover:bg-brand-mint/[0.03]"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Mail size={18} className="text-blue-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Email Us</h3>
              <p className="mt-1 text-xs text-brand-mint font-mono">rohi@itnavideo.com</p>
              <p className="mt-2 text-[11px] text-zinc-500">Send your video link + views screenshot + Itnavideo account email</p>
            </a>

            {/* Instagram DM */}
            <a
              href="https://www.instagram.com/itnavideo/"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-white/8 bg-white/[0.02] p-5 transition hover:border-cyan-300/30 hover:bg-cyan-500/[0.03]"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
                <Instagram size={18} className="text-cyan-300" />
              </div>
              <h3 className="text-sm font-bold text-white">Instagram DM</h3>
              <p className="mt-1 text-xs text-cyan-300 font-mono">@itnavideo</p>
              <p className="mt-2 text-[11px] text-zinc-500">DM us your video link + views screenshot + Itnavideo email</p>
            </a>
          </div>

          {/* What to send */}
          <div className="mt-6 rounded-xl border border-white/8 bg-zinc-900/50 p-5">
            <h3 className="mb-3 text-sm font-bold text-white">What to include in your message:</h3>
            <ol className="space-y-2 text-xs text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/10 text-[9px] font-bold text-white">1</span>
                Your video/reel link
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/10 text-[9px] font-bold text-white">2</span>
                Screenshot of current views
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/10 text-[9px] font-bold text-white">3</span>
                Your Itnavideo account email
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/10 text-[9px] font-bold text-white">4</span>
                Short message: &ldquo;I promoted Itnavideo and want to claim credits&rdquo;
              </li>
            </ol>
          </div>

          {/* Response time */}
          <div className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-brand-mint/15 bg-brand-mint/[0.04] px-4 py-3">
            <Clock size={14} className="text-brand-mint" />
            <p className="text-xs font-bold text-zinc-300">
              Our team usually reviews and replies within <span className="text-brand-mint">4 hours</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-black sm:text-3xl">Program Rules</h2>
          <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5 sm:p-6">
            <ul className="space-y-3">
              {rules.map((rule) => (
                <li key={rule} className="flex items-start gap-2.5 text-xs leading-relaxed text-zinc-300">
                  <Shield size={11} className="mt-0.5 shrink-0 text-zinc-500" />
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-black sm:text-3xl">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "Is this a cash affiliate program?",
                a: "No. There is no cash payout. You earn free video credits to use on Itnavideo — meaning you can generate more reels and shorts without paying.",
              },
              {
                q: "What are video credits?",
                a: "1 video credit = 1 exported video on Itnavideo. If you earn 20 credits, you can create 20 videos using any template.",
              },
              {
                q: "Can I withdraw credits as money?",
                a: "No. Credits are only usable on Itnavideo to create videos. They cannot be converted to cash.",
              },
              {
                q: "How long until I get my credits?",
                a: "Our team reviews submissions within 4 hours. Once approved, credits are added to your Itnavideo account immediately.",
              },
              {
                q: "Can I claim credits multiple times for the same video?",
                a: "Yes! As your video grows, you can claim the next milestone. For example: claim at 100 views, then again at 500 views, then at 1,000 views.",
              },
              {
                q: "What if my video gets rejected?",
                a: "We only reject videos that don't clearly promote Itnavideo, use fake/bot views, or are spam/duplicate content. If rejected, we'll tell you why.",
              },
              {
                q: "Do credits expire?",
                a: "Currently no. But we may introduce a 60-day expiry in the future. We'll notify you in advance if this changes.",
              },
              {
                q: "Can I become a top creator?",
                a: "Yes! Reach out to us with your channel/page. We select top creators based on content quality and audience engagement, not just follower count.",
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-white/8 bg-white/[0.02] overflow-hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-bold text-white hover:bg-white/[0.03]">
                  {faq.q}
                  <ArrowRight size={14} className="shrink-0 text-zinc-500 transition group-open:rotate-90" />
                </summary>
                <div className="border-t border-white/5 px-5 py-4 text-xs leading-relaxed text-zinc-400">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-2xl rounded-2xl border border-brand-mint/20 bg-gradient-to-br from-brand-mint/[0.06] to-transparent p-8 text-center sm:p-10">
          <h2 className="text-xl font-black sm:text-2xl">Ready to Promote & Earn?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400">
            Create one video about Itnavideo. Show it to your audience. Get free credits to make more content.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="mailto:rohi@itnavideo.com?subject=Itnavideo%20Promotion%20Credit%20Claim"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-mint px-6 py-3 text-sm font-black text-black transition hover:bg-brand-mint/90"
            >
              <Mail size={15} />
              Submit Your Video
            </a>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-bold text-zinc-300 transition hover:bg-white/[0.06]"
            >
              <Zap size={14} />
              Start Creating Videos
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
