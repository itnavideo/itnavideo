import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart, Lightbulb, Sparkles, Target, Users, Zap } from "lucide-react";

export const metadata = {
  title: "About Itnavideo — Our Story | AI Video Platform",
  description: "Itnavideo helps creators, businesses, and educators turn raw content into ready-to-post reels. Built from a real creator pain.",
};

export default function AboutPage() {
  return (
    <main className="bg-[#050506] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-28 sm:px-6 sm:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(124,58,237,0.04)_0%,transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="mb-6 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">About Itnavideo</p>
          <h1 className="text-4xl font-black leading-tight sm:text-5xl md:text-7xl">
            AI video banana ab editing nahi,<br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">direction dena hai.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-300">
            Itnavideo helps creators, businesses, and educators turn raw audio, video, or ideas into polished reels — without spending hours on timeline editing. Upload your content. AI handles the rest.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-2xl bg-brand-mint px-8 py-4 text-base font-black text-black transition hover:bg-white">
              Start Creating <ArrowRight size={16} />
            </Link>
            <Link href="/pricing" className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900/40 px-7 py-4 text-sm font-bold text-zinc-300 transition hover:text-white">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <Target className="mx-auto mb-6 text-brand-mint" size={32} />
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">Our Mission</p>
          <h2 className="text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
            Help creators and businesses turn raw content into ready-to-post reels — without hours of editing.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400">
            Every day, millions of creators have good ideas, strong messages, and valuable knowledge. But turning that into polished short-form video still takes too much time. Itnavideo reduces that gap.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="border-y border-white/8 bg-zinc-950/50 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Sparkles className="mb-5 text-brand-mint" size={28} />
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">The Problem We Solve</p>
              <h2 className="text-3xl font-black leading-tight sm:text-4xl">
                Good content gets stuck because editing is hard.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-zinc-300">
                Creators, educators, small businesses, and startup teams often have great raw content — a teaching video, a product showcase, a voice note, a podcast episode. But converting that into a polished Instagram Reel or YouTube Short requires:
              </p>
              <ul className="mt-5 space-y-3 text-sm text-zinc-400">
                <li className="flex items-start gap-3"><span className="mt-1 text-rose-400">✗</span> Hours of timeline editing</li>
                <li className="flex items-start gap-3"><span className="mt-1 text-rose-400">✗</span> Learning complex software (Premiere, CapCut, DaVinci)</li>
                <li className="flex items-start gap-3"><span className="mt-1 text-rose-400">✗</span> Manual subtitle timing and styling</li>
                <li className="flex items-start gap-3"><span className="mt-1 text-rose-400">✗</span> Finding the right visual layout for each format</li>
                <li className="flex items-start gap-3"><span className="mt-1 text-rose-400">✗</span> Repeating the same process for every single reel</li>
              </ul>
            </div>
            <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-8">
              <Zap className="mb-5 text-brand-mint" size={28} />
              <h3 className="text-2xl font-black">Itnavideo&apos;s Answer</h3>
              <p className="mt-4 text-base leading-relaxed text-zinc-300">
                Upload once. Choose a video type. Get a reel back in 2-3 minutes. AI handles transcription, captions, layout, timing, visuals, and export. You direct, AI edits.
              </p>
              <div className="mt-6 grid gap-3">
                {["6 production video types for focused reel formats", "AI captions synced to speech", "9:16 vertical MP4 ready to post", "No editing skills required", "Works for English and Hinglish"].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm font-bold text-zinc-200">
                    <span className="text-brand-mint">✓</span> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Believe */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <Heart className="mx-auto mb-6 text-brand-mint" size={28} />
          <p className="mb-4 text-center text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">What We Believe</p>
          <h2 className="text-center text-3xl font-black sm:text-4xl">Our principles</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              { title: "Good content should not stay stuck", desc: "If you have knowledge or a message, editing should not be the bottleneck." },
              { title: "Creators should direct, not edit", desc: "Spend time on ideas and decisions, not on timeline dragging and subtitle timing." },
              { title: "AI should handle the repetitive work", desc: "Transcription, layout, captions, timing, export — these should be automated." },
              { title: "Small creators deserve pro output", desc: "Premium-looking reels should not require expensive tools or dedicated editors." },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-white/8 bg-zinc-900/30 p-6">
                <Lightbulb className="mb-3 text-brand-mint/70" size={20} />
                <h3 className="text-lg font-black text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Uses It */}
      <section className="border-y border-white/8 bg-zinc-950/50 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <Users className="mx-auto mb-6 text-brand-mint" size={28} />
          <p className="mb-4 text-center text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">Built For</p>
          <h2 className="text-center text-3xl font-black sm:text-4xl">Creators, businesses, and educators</h2>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {[
              "Content creators - fast reels, captions, and social posts",
              "YouTube creators - short promos for long-form videos",
              "Educators - comparison and whiteboard explainer reels",
              "Small businesses - simple promo videos without manual editing",
              "Coaches and consultants - educational creator videos",
              "Agencies - repeatable client reels with consistent quality",
              "Personal brands - talking videos with stronger typography",
              "Career creators - Hinglish and English short-form explainers",
            ].map((item) => (
              <div key={item} className="rounded-lg border border-white/8 bg-white/[0.03] px-5 py-4 text-sm font-semibold text-zinc-200">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Note */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-xl border border-white/10 bg-zinc-900/40 p-8 sm:p-10">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">From the Founder</p>
          <h2 className="text-2xl font-black sm:text-3xl">A note from the builder</h2>
          <blockquote className="mt-6 text-base leading-relaxed text-zinc-300 italic border-l-4 border-brand-mint/40 pl-5">
            &quot;Itnavideo started from a simple frustration: making short videos should not require hours of editing. I wanted a tool where users can upload raw content and get a polished reel back without learning Premiere Pro or spending on editors. That&apos;s what we&apos;re building.&quot;
          </blockquote>
          <div className="mt-6 flex items-center gap-4">
            <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-brand-mint/30">
              <Image src="/founder/syed-mohammed-rohi.webp" alt="Syed Mohammed Rohi" width={48} height={48} className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="font-black text-white">Syed Mohammed Rohi</p>
              <p className="text-xs text-zinc-500">Founder, Itnavideo</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black">Ready to create your first reel?</h2>
          <p className="mt-4 text-base text-zinc-400">No editing skills needed. Upload content, choose a video type, get a video.</p>
          <Link href="/dashboard" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-brand-mint px-8 py-4 text-base font-black text-black transition hover:bg-white">
            Start Creating Free <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="border-t border-white/5 px-4 py-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6 text-xs text-zinc-600">
          <Link href="/terms" className="hover:text-white transition">Terms</Link>
          <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
          <Link href="/contact" className="hover:text-white transition">Contact</Link>
          <Link href="/careers" className="hover:text-white transition">Careers</Link>
          <span>© 2026 Itnavideo Inc.</span>
        </div>
      </footer>
    </main>
  );
}
