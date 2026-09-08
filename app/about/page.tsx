import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Award,
  Video,
  Film,
  Flame,
  Layers,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — The AI Video Engine Built for Creators | Itnavideo",
  description: "Learn how Itnavideo helps creators, educators, and businesses eliminate tedious video timeline editing with automated AI video engines.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white selection:bg-orange-500/30 selection:text-orange-200 pt-20 pb-24 px-4 sm:px-6">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[450px] h-[450px] bg-amber-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl space-y-16">
        {/* ── HERO SECTION ── */}
        <section className="text-center space-y-6 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-bold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>The Itnavideo Philosophy</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-3xl mx-auto leading-[1.12]">
            Built for Creators Who Value{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
              Their Time.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Itnavideo eliminates the exhausting timeline editing — turning raw audio, talking-head recordings, and scripts into studio-grade Reels, YouTube Shorts, and Faceless videos in seconds.
          </p>

          {/* 3 Core Impact Metrics (M3 Elevated Badges) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 max-w-3xl mx-auto text-left">
            <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4.5 backdrop-blur-md">
              <div className="flex items-center gap-2 text-orange-400 mb-1">
                <Clock className="w-5 h-5" />
                <span className="text-xl sm:text-2xl font-black text-white">10x Faster</span>
              </div>
              <p className="text-xs text-zinc-400 font-medium">Turn hours of manual timeline slicing into 2-minute cloud renders.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4.5 backdrop-blur-md">
              <div className="flex items-center gap-2 text-amber-400 mb-1">
                <Zap className="w-5 h-5" />
                <span className="text-xl sm:text-2xl font-black text-white">1-Click AI</span>
              </div>
              <p className="text-xs text-zinc-400 font-medium">Groq Whisper synced subtitles with Roman Hinglish and audio cleanup.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4.5 backdrop-blur-md">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xl sm:text-2xl font-black text-white">100% Studio</span>
              </div>
              <p className="text-xs text-zinc-400 font-medium">Remotion AWS Lambda cloud engine with zero local machine lag.</p>
            </div>
          </div>
        </section>

        {/* ── THE PROBLEM VS THE ITNAVIDEO WAY (CONCISE CONTRAST) ── */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold tracking-widest uppercase text-orange-400">Why It Matters</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Creating content is energizing. Editing it is exhausting.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* The Old Way */}
            <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-400">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">&times;</span>
                <span>The Traditional Way</span>
              </div>
              <ul className="space-y-2.5 text-xs text-zinc-400 leading-relaxed font-medium">
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-600 mt-1.5 shrink-0" />
                  <span>4 to 8 hours spent slicing clips and aligning keyframes in Premiere/CapCut.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-600 mt-1.5 shrink-0" />
                  <span>Manual subtitle typing with awkward line breaks and constant typos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-600 mt-1.5 shrink-0" />
                  <span>Creator burnout: losing an entire day over a single 60-second video.</span>
                </li>
              </ul>
            </div>

            {/* The Itnavideo Way */}
            <div className="rounded-3xl border border-orange-500/30 bg-orange-500/5 p-6 space-y-4 ring-1 ring-orange-500/20">
              <div className="flex items-center gap-2 text-sm font-bold text-orange-400">
                <CheckCircle2 className="w-5 h-5 text-orange-400" />
                <span>The Automated Itnavideo Way</span>
              </div>
              <ul className="space-y-2.5 text-xs text-zinc-300 leading-relaxed font-medium">
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                  <span>Upload audio or script; AI structures scenes and matches curated visuals instantly.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                  <span>Word-level Groq Whisper synced subtitles with automatic Hinglish accuracy.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                  <span>Publish 5x more content with zero editing stress or complex software.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── FOUNDER'S VISION STATEMENT (CONCISE & IMPACTFUL) ── */}
        <section className="rounded-3xl border border-white/10 bg-zinc-900/70 p-7 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Founder&apos;s Vision</span>
            </div>

            <blockquote className="text-xl sm:text-2xl font-black text-white leading-snug">
              &ldquo;Why should creators spend hours editing when their real job is creating meaningful ideas?&rdquo;
            </blockquote>

            <p className="text-sm text-zinc-400 leading-relaxed">
              Founded by <strong className="text-white">Syed Rohi</strong>, Itnavideo was created to bridge the gap between creative ambition and video production friction. Whether you record podcasts, explain concepts, or run a business — we build specialized AI engines so you can produce videos at the speed of thought.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-zinc-400">
              <span className="font-bold text-white">Rohi</span> &bull; <span>Founder, Itnavideo</span> &bull;
              <a href="mailto:rohi@itnavideo.com" className="text-orange-400 hover:underline">
                rohi@itnavideo.com
              </a>
            </div>
          </div>
        </section>

        {/* ── CALL TO ACTION (M3 ORANGE BANNER) ── */}
        <section className="rounded-3xl bg-gradient-to-br from-orange-500/15 via-zinc-900 to-amber-500/10 border border-orange-500/30 p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Ready to Automate Your Video Creation?
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto">
            Choose a video engine, drop your content, and let AI build your next high-retention video.
          </p>
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 text-sm font-black text-white shadow-xl shadow-orange-500/25 transition-all hover:scale-105 hover:opacity-95"
            >
              Start Creating For Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
