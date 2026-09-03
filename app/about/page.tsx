import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle2,
  XCircle,
  Video,
  Layers,
  ShieldCheck,
  Award,
  Type,
  PenTool,
  Clock,
  Target,
  Rocket,
  Users,
  Film,
  LucideIcon
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Us | Itnavideo - AI Video Automation Engine",
  description: "Learn how Itnavideo helps creators, real estate agents, educators, and businesses eliminate tedious video timeline editing with automated AI video engines.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Us | Itnavideo",
    description: "The automated AI video engine built for modern creators & businesses.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Itnavideo",
    description: "Spent less time editing and more time creating meaningful content.",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-24 selection:bg-blue-200 pt-16">
      {/* ── HERO HEADER ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200/80 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold tracking-wide uppercase mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Reinventing Video Creation</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.12]">
            The Automated AI Video Engine Built for <span className="text-blue-600">Creators & Businesses</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl font-medium text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Itnavideo turns raw audio, talking-head recordings, and scripts into publish-ready viral Reels, YouTube Shorts, and Explainer videos in seconds — eliminating hours of manual timeline editing.
          </p>

          {/* Key Stat Badges */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
              <Clock className="w-6 h-6 text-blue-600 mb-2" />
              <div className="text-2xl sm:text-3xl font-black text-slate-900">10x Faster</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">Video Output Speed</div>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
              <Zap className="w-6 h-6 text-amber-5 AP-500 text-amber-500 mb-2" />
              <div className="text-2xl sm:text-3xl font-black text-slate-900">1-Click AI</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">Auto Captions & Formatting</div>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
              <ShieldCheck className="w-6 h-6 text-emerald-600 mb-2" />
              <div className="text-2xl sm:text-3xl font-black text-slate-900">100% Studio</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">Quality Render Engine</div>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
              <Users className="w-6 h-6 text-indigo-600 mb-2" />
              <div className="text-2xl sm:text-3xl font-black text-slate-900">Zero Skills</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">Editing Experience Needed</div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 mt-16 space-y-20">

        {/* ── SECTION 1: WHAT IS ITNAVIDEO? ───────────────────────────────── */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 tracking-wider uppercase">
                <Target className="w-4 h-4" />
                <span>What Is Itnavideo?</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                An end-to-end AI video studio designed for maximum impact.
              </h2>
              <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
                Itnavideo is an intelligent video rendering platform that automates the hardest parts of content creation: speech transcription, motion typography, slide layout, caption timing, and visual formatting.
              </p>
              <p className="text-slate-600 text-base font-medium leading-relaxed">
                Whether you record face-cam reels, narrate educational audio, market real estate listings, or run business promo campaigns — Itnavideo delivers polished, high-engagement videos ready for social media.
              </p>
            </div>

            <div className="w-full md:w-72 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg space-y-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                  <Rocket className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold opacity-80 uppercase tracking-wider">Mission</div>
                  <div className="text-lg font-bold">Focus On Ideas</div>
                </div>
              </div>
              <p className="text-xs font-medium text-blue-100 leading-relaxed">
                "Our mission is to help creators spend 90% less time editing and 100% more time sharing meaningful ideas with the world."
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: THE PROBLEM VS THE ITNAVIDEO WAY ─────────────────────── */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 tracking-wider uppercase">
              <Layers className="w-4 h-4" />
              <span>Why We Built It</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Creating content is easy. <span className="text-blue-600">Editing it is tedious.</span>
            </h2>
            <p className="text-slate-600 font-medium text-base">
              See why creators and businesses are switching from manual timelines to automated AI workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Old Way */}
            <div className="bg-red-50/40 border border-red-200/70 rounded-3xl p-8 space-y-6">
              <div className="flex items-center gap-3 text-red-700 font-bold text-lg">
                <XCircle className="w-6 h-6 text-red-500" />
                <span>The Traditional Editing Way</span>
              </div>
              <ul className="space-y-3.5 text-sm font-semibold text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-400 mt-2 shrink-0" />
                  <span>Spending 4 to 8 hours slicing video footage frame-by-frame on complex timeline software.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-400 mt-2 shrink-0" />
                  <span>Manually typing and aligning captions word-by-word with constant spelling mistakes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-400 mt-2 shrink-0" />
                  <span>Hunting for royalty-free graphics, stickers, motion backgrounds, and font pairs.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-400 mt-2 shrink-0" />
                  <span>Creator burnout: spending an entire day trying to complete a single 60-second reel.</span>
                </li>
              </ul>
            </div>

            {/* The Itnavideo Way */}
            <div className="bg-blue-50/50 border border-blue-200/80 rounded-3xl p-8 space-y-6 shadow-xs">
              <div className="flex items-center gap-3 text-blue-800 font-bold text-lg">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
                <span>The Automated Itnavideo Way</span>
              </div>
              <ul className="space-y-3.5 text-sm font-semibold text-slate-800">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <span>Upload audio or video and let Groq Whisper AI transcribe speech instantly with clean Hinglish support.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <span>Automated kinetic typography, executive whiteboard slides, and luxury subtitle formatting.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <span>Pre-indexed asset timeline and render engine built specifically for high social media retention.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <span>Publish 5x more content with zero editing stress or expensive software subscriptions.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: WHAT'S INSIDE / CORE WORKFLOWS ─────────────────────── */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 tracking-wider uppercase">
              <Film className="w-4 h-4" />
              <span>Specialized Workflows</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything you need in one platform.
            </h2>
            <p className="text-slate-600 font-medium text-base">
              Itnavideo includes specialized render engines tailored for different content formats.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-3 hover:border-blue-300 transition">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Type className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Kinetic Typography Reels</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                High-end stacked typography mixing Serif Italics & Heavy ALL-CAPS for real estate agents, luxury brands, and motivational creators.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-3 hover:border-blue-300 transition">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Auto Captions & Subtitles</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Groq Whisper transcription with support for English and Roman Hinglish. Fresh captions for every upload with custom highlights.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-3 hover:border-blue-300 transition">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <PenTool className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Whiteboard & Corporate Video</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Turns voiceover audio into clean corporate slide cards with marker highlights, badges, and professional presentation typography.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-3 hover:border-blue-300 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Film className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Long Video Promo & Clips</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Extracts key highlights from long podcasts, webinars, and interviews to generate engaging short-form promo clips.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-3 hover:border-blue-300 transition">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Compare & Multi-Image Shorts</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Side-by-side breakdowns, before/after visual showcases, and image-based story videos designed for high retention.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-3 hover:border-blue-300 transition">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">AWS Remotion Lambda Engine</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Cloud-based rendering infrastructure that generates crisp, high-bitrate MP4 videos directly in AWS without slowing down your browser.
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: FOUNDER'S STORY & VISION (NO PHOTO) ────────────────── */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 tracking-wider uppercase">
              <Award className="w-4 h-4" />
              <span>Founder's Vision</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
              "Why should creators spend hours editing when their real job is creating good content?"
            </h2>

            <div className="space-y-4 text-slate-300 font-medium text-base leading-relaxed">
              <p>
                Founded by <strong className="text-white">Rohi</strong>, Itnavideo was born out of observing how rapidly video content was evolving across Instagram and YouTube.
              </p>
              <p>
                New formats were constantly popping up — from auto-captioned reels and compare explainers to whiteboard corporate videos and luxury kinetic typography. But while content ideas were flowing fast, the editing barrier was holding people back.
              </p>
              <p>
                Recording a video might take 15 minutes, but cutting clips, timing captions, selecting font styles, and arranging timeline elements was taking hours. For founders, working professionals, real estate agents, and creators running a business, editing became a massive bottleneck.
              </p>
              <p className="text-white font-semibold text-lg pt-2 border-t border-slate-800">
                That is the core promise of Itnavideo: You focus on creating the content. Itnavideo takes care of the editing.
              </p>
            </div>

            <div className="pt-4 flex items-center gap-4 text-xs text-slate-400 font-bold tracking-wide uppercase">
              <span>Rohi — Founder, Itnavideo</span>
              <span>•</span>
              <a href="mailto:rohi@itnavideo.com" className="text-blue-400 hover:underline">rohi@itnavideo.com</a>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: CALL TO ACTION ────────────────────────────────────── */}
        <section className="text-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-10 sm:p-14 shadow-lg space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Ready to Automate Your Video Creation?
          </h2>
          <p className="text-blue-100 text-base sm:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Join thousands of creators, real estate agents, educators, and businesses creating high-performing videos with zero editing hassle.
          </p>
          <div className="pt-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-extrabold text-blue-700 shadow-md transition hover:bg-slate-100 hover:scale-105"
            >
              Start Creating For Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
