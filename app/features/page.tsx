import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Captions,
  Check,
  Film,
  Layers,
  Sparkles,
  Upload,
  Wand2,
  Zap,
  Volume2,
  Tv,
  PenTool,
  Sliders,
  ShieldCheck,
  Flame,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features — Complete AI Video Creation Workflow | Itnavideo",
  description: "Explore Itnavideo's specialized AI video engines: Faceless 16:9 YouTube, Word-by-word Auto Captions, Audio Cleaner, Kinetic Typography, and Whiteboard Explainers.",
  alternates: { canonical: "/features" },
};

const FLAGSHIP_ENGINES = [
  {
    id: "faceless-video",
    title: "Faceless Video (16:9 YouTube)",
    tag: "UP TO 20 MINS",
    tagColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    desc: "Convert podcasts, scripts, and audio into full 16:9 documentary videos with AI scene director, Canva color palettes, and 60+ curated visual assets.",
    icon: Tv,
  },
  {
    id: "auto-caption",
    title: "Auto Captions & Subtitle Studio",
    tag: "GROQ WHISPER",
    tagColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    desc: "Word-by-word kinetic subtitle sync with zero lag. Roman Hinglish & English support with custom font highlights and karaoke styling.",
    icon: Captions,
  },
  {
    id: "audio-clean",
    title: "AI Voice Cleaner & Retake Trimmer",
    tag: "STUDIO VOICE",
    tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    desc: "Automatically remove background noise, room echo, pauses, and voiceover mistakes without distorting your natural tone.",
    icon: Volume2,
  },
  {
    id: "typography-video",
    title: "Kinetic Typography Reels",
    tag: "HIGH RPM",
    tagColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    desc: "High-retention stacked typography combining Serif Italics and heavy modern Sans for real estate, finance, and motivational quotes.",
    icon: Sliders,
  },
  {
    id: "whiteboard-video",
    title: "Whiteboard & Explainer Slides",
    tag: "CORPORATE",
    tagColor: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    desc: "Turn voiceover into clean corporate visual cards with hand-drawn markers, stickman cues, and presentation layouts.",
    icon: PenTool,
  },
  {
    id: "compare-explainer",
    title: "Compare & Before/After Videos",
    tag: "RETENTION",
    tagColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    desc: "Dynamic split-screen reels comparing products, theories, or transformations with synced bottom subtitles.",
    icon: Layers,
  },
];

const AUTOMATED_ITEMS = [
  "Word-by-word subtitle timing via Groq Whisper",
  "AI scene blueprinting from voiceover transcript",
  "60+ Curated Cloudinary ChatGPT visual matching",
  "Sonic SFX sound design (Rise, Pop, Chime, Woosh)",
  "Safe zone padding for Instagram, TikTok & YouTube",
  "1080p full HD rendering on AWS Remotion Lambda",
  "Roman Hinglish & English transcription accuracy",
  "Clean 1-click downloads ready for publishing",
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white selection:bg-orange-500/30 selection:text-orange-200 pt-24 pb-24 px-4 sm:px-6">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[450px] h-[450px] bg-amber-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl space-y-20">
        {/* ── HERO SECTION ── */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-bold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Product Engines &bull; Material 3 Design</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Every AI Video Engine You Need.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
              Zero Blank Timelines.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Upload raw audio, speech, or video. AI transcribes, directs visual scenes, syncs typography, and renders studio-grade MP4s in minutes.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 px-8 py-4 text-sm font-black text-white shadow-xl shadow-orange-500/25 transition-all hover:scale-105 hover:opacity-95"
            >
              Open AI Studio Free <ArrowRight size={16} />
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-900/60 px-7 py-4 text-sm font-bold text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
            >
              View Pricing
            </Link>
          </div>
        </section>

        {/* ── FLAGSHIP VIDEO ENGINES (M3 BENTO GRID) ── */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-orange-400">Core Capabilities</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Specialized AI Video Engines</h2>
            </div>
            <span className="text-xs text-zinc-400">Each with its own dedicated layout and motion pipeline</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FLAGSHIP_ENGINES.map((engine) => {
              const Icon = engine.icon;
              return (
                <div
                  key={engine.id}
                  className="group rounded-3xl border border-white/10 bg-zinc-900/60 p-6 space-y-4 transition-all duration-200 hover:border-orange-500/40 hover:bg-zinc-900 shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400 border border-orange-500/25 transition group-hover:scale-110">
                        <Icon size={20} />
                      </span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${engine.tagColor}`}>
                        {engine.tag}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-orange-300 transition">
                      {engine.title}
                    </h3>

                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {engine.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-zinc-400">Ready in Studio</span>
                    <Link href="/dashboard" className="text-orange-400 font-bold hover:underline inline-flex items-center gap-1">
                      Launch &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 3-STEP STREAMLINED WORKFLOW ── */}
        <section className="rounded-3xl border border-white/10 bg-zinc-900/70 p-6 sm:p-10 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold tracking-wider uppercase text-orange-400">Simple Workflow</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Upload Once. Get Studio Video Back.</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-5 space-y-2">
              <span className="text-xs font-black text-orange-400 font-mono">STEP 01</span>
              <h3 className="text-base font-bold text-white">Pick Engine &amp; Drop Media</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Choose Faceless Video, Auto Captions, or Audio Cleaner and drop your audio or video file.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-5 space-y-2">
              <span className="text-xs font-black text-amber-400 font-mono">STEP 02</span>
              <h3 className="text-base font-bold text-white">AI Directs &amp; Syncs</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Groq Whisper transcribes speech. AI scene blueprints pair narrative beats with curated imagery and SFX.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-5 space-y-2">
              <span className="text-xs font-black text-emerald-400 font-mono">STEP 03</span>
              <h3 className="text-base font-bold text-white">Export &amp; Publish</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Remotion AWS Lambda renders 1080p MP4 in ~2 minutes. Download with zero watermark.
              </p>
            </div>
          </div>
        </section>

        {/* ── WHAT ITNAVIDEO HANDLES AUTOMATICALLY ── */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold tracking-wider uppercase text-orange-400">Hands-Free Automation</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">What Itnavideo handles automatically</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AUTOMATED_ITEMS.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-900/50 px-4.5 py-3.5"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-orange-500/15 text-orange-400">
                  <Check size={14} strokeWidth={3} />
                </span>
                <span className="text-xs font-bold text-zinc-200">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── CALL TO ACTION ── */}
        <section className="rounded-3xl bg-gradient-to-br from-orange-500/20 via-zinc-900 to-amber-500/10 border border-orange-500/30 p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to Stop Editing and Start Directing?
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto leading-relaxed">
            Create high-performing videos in minutes with Itnavideo&apos;s automated AI video engine.
          </p>
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 px-8 py-4 text-sm font-black text-white shadow-xl shadow-orange-500/25 transition-all hover:scale-105 hover:opacity-95"
            >
              Start Creating Now <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
