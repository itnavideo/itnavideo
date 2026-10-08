import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  Mail,
  Film,
  Video,
  Wand2,
  Wrench,
  CheckCircle2,
  Clock,
  Layers,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — The AI Video Engine Built for Creators | Itnavideo",
  description:
    "Learn how Itnavideo helps creators turn ideas, media, and scripts into professional videos without the complexity of traditional editing.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#FF6D00]/30 selection:text-white pt-24 sm:pt-28 pb-28 sm:pb-36 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* ── AMBIENT BACKGROUND ATMOSPHERE (BLUEPRINT GRID + RADIAL GLOWS) ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Subtle Blueprint Grid Pattern */}
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:48px_48px]"
          style={{
            WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 20%, black 30%, transparent 90%)",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 20%, black 30%, transparent 90%)",
          }}
        />
        {/* Ambient Warm Orange Spotlights */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#FF6D00]/[0.08] rounded-full blur-[160px]" />
        <div className="absolute top-[50%] left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-[#FF8F00]/[0.05] rounded-full blur-[160px]" />
      </div>

      <div className="relative mx-auto max-w-5xl space-y-20 sm:space-y-28">
        
        {/* ── 1. HERO MANIFESTO ── */}
        <section className="text-center space-y-6 pt-4 sm:pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF6D00]/10 border border-[#FF6D00]/25 text-[#FF9100] text-[11px] font-black tracking-widest uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#FF8F00] animate-pulse" />
            <span>The Itnavideo Mission</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.08] font-sans">
            We are building the video engine for creators who{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726]">
              value their time.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            ItnaVideo is building AI-powered video creation tools that turn ideas, media, and scripts into professional videos — without the complexity of traditional editing.
          </p>
        </section>

        {/* ── 2. THE PROBLEM WE'RE SOLVING ── */}
        <section className="border-t border-white/10 pt-16 sm:pt-20">
          <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left Column: Heading & Context */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#FF9100]">
                The Editorial Shift
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight font-sans">
                The problem we&apos;re solving
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Creating great videos shouldn&apos;t require hours of editing, complicated timelines, or technical expertise.
              </p>
            </div>

            {/* Right Column: 3 Clean Pillars */}
            <div className="lg:col-span-7 space-y-7 pl-0 lg:pl-6 border-l-0 lg:border-l lg:border-white/10">
              
              {/* Pillar 01 */}
              <div className="space-y-2 group">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-sm font-bold text-[#FF8F00] tracking-wider">
                    01 /
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#FFA726] transition-colors font-sans">
                    Less Editing
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-8">
                  Spend less time cutting clips, syncing captions, fixing line breaks, and formatting videos.
                </p>
              </div>

              {/* Pillar 02 */}
              <div className="space-y-2 group">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-sm font-bold text-[#FF8F00] tracking-wider">
                    02 /
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#FFA726] transition-colors font-sans">
                    More Creation
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-8">
                  Focus on your ideas, stories, and audience growth instead of wrestling with repetitive editing tasks.
                </p>
              </div>

              {/* Pillar 03 */}
              <div className="space-y-2 group">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-sm font-bold text-[#FF8F00] tracking-wider">
                    03 /
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#FFA726] transition-colors font-sans">
                    AI That Does the Work
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-8">
                  ItnaVideo automates the repetitive parts of video production while keeping creators fully in creative control.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ── 3. WHAT WE'RE BUILDING (PRODUCT ECOSYSTEM) ── */}
        <section className="border-t border-white/10 pt-16 sm:pt-20 space-y-10">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#FF9100]">
              Product Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-sans tracking-tight">
              One platform. Many ways to create.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              From short-form content and captions to AI-powered video creation and audio tools, ItnaVideo brings multiple creative workflows into one simple platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Category 1 */}
            <div className="rounded-[24px] border border-white/10 bg-[#0F1117] p-6 space-y-3 hover:border-[#FF6D00]/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FF6D00]/10 text-[#FF9100] border border-[#FF6D00]/20">
                <Film size={20} />
              </div>
              <h3 className="text-base font-bold text-white font-sans">Short-Form Videos</h3>
              <p className="text-xs text-[#FFA726] font-semibold">Reels • Shorts • TikTok</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Word-highlight kinetic captions, auto-captions, and viral short clips.
              </p>
            </div>

            {/* Category 2 */}
            <div className="rounded-[24px] border border-white/10 bg-[#0F1117] p-6 space-y-3 hover:border-[#FF6D00]/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FF6D00]/10 text-[#FF9100] border border-[#FF6D00]/20">
                <Video size={20} />
              </div>
              <h3 className="text-base font-bold text-white font-sans">Long-Form Videos</h3>
              <p className="text-xs text-[#FFA726] font-semibold">YouTube • Podcasts • Explainers</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Widescreen subtitles, promo cards, and long-video-to-clips extraction.
              </p>
            </div>

            {/* Category 3 */}
            <div className="rounded-[24px] border border-white/10 bg-[#0F1117] p-6 space-y-3 hover:border-[#FF6D00]/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FF6D00]/10 text-[#FF9100] border border-[#FF6D00]/20">
                <Wand2 size={20} />
              </div>
              <h3 className="text-base font-bold text-white font-sans">AI Video Tools</h3>
              <p className="text-xs text-[#FFA726] font-semibold">Image-to-Video • Faceless • Whiteboard</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Turn scripts and images into narrated visual explainers automatically.
              </p>
            </div>

            {/* Category 4 */}
            <div className="rounded-[24px] border border-white/10 bg-[#0F1117] p-6 space-y-3 hover:border-[#FF6D00]/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FF6D00]/10 text-[#FF9100] border border-[#FF6D00]/20">
                <Wrench size={20} />
              </div>
              <h3 className="text-base font-bold text-white font-sans">Creator Tools</h3>
              <p className="text-xs text-[#FFA726] font-semibold">Captions • Subtitles • Audio Clean</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clean unnecessary pauses and enhance audio quality for studio-grade output.
              </p>
            </div>
          </div>
        </section>

        {/* ── 4. FOUNDER'S NOTE ── */}
        <section className="relative py-12 sm:py-16 border-y border-white/10 overflow-hidden">
          {/* Ambient Glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-orange-500/[0.05] blur-[140px] -z-10" />

          <div className="max-w-3xl mx-auto space-y-8 relative z-10 text-center sm:text-left">
            
            {/* Executive Quote */}
            <blockquote className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-snug font-sans tracking-tight">
              &ldquo;Why should creators spend hours editing when their real job is creating meaningful ideas?&rdquo;
            </blockquote>

            {/* Founder Profile Details */}
            <div className="flex flex-col sm:flex-row items-center gap-5 pt-2">
              {/* Avatar */}
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden border-2 border-[#FF6D00]/50 shadow-xl shadow-[#FF6D00]/20 ring-4 ring-[#FF6D00]/10 bg-[#0F1117] shrink-0">
                <Image
                  src="/founder/founder-rohi.jpg"
                  alt="Syed Rohi — Founder of Itnavideo"
                  fill
                  className="object-cover object-top"
                  sizes="72px"
                  priority
                />
              </div>

              {/* Info & Statement */}
              <div className="space-y-1.5 flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="font-black text-base text-white">Syed Rohi</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs font-semibold text-[#FF9100]">Founder &amp; Architect, Itnavideo</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  We started ItnaVideo from a simple idea: creators shouldn&apos;t have to spend hours fighting with editing software just to publish a great video. Our mission is to make video creation as effortless as typing an idea.
                </p>
              </div>

              {/* Email Link */}
              <div className="shrink-0 pt-2 sm:pt-0">
                <a
                  href="mailto:rohi@itnavideo.com"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-bold text-slate-300 hover:border-[#FF6D00]/50 hover:bg-[#FF6D00]/10 hover:text-[#FFA726] transition"
                >
                  <Mail size={13} className="text-[#FF9100]" />
                  <span>rohi@itnavideo.com</span>
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* ── 5. OUR 3 GUIDING PRINCIPLES ── */}
        <section className="space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#FF9100]">
              Company Values
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-sans">
              Our 3 Guiding Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            
            {/* Principle 01 */}
            <div className="border-t border-white/[0.12] pt-5 space-y-3">
              <span className="font-mono text-xs font-black tracking-widest text-[#FF9100] block">
                01. SPEED
              </span>
              <h3 className="text-xl font-black text-white font-sans">
                Real-Time Creation
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Turn ideas into published 1080p Full HD MP4s in seconds, eliminating rendering delays and heavy software lag.
              </p>
            </div>

            {/* Principle 02 */}
            <div className="border-t border-white/[0.12] pt-5 space-y-3">
              <span className="font-mono text-xs font-black tracking-widest text-[#FF9100] block">
                02. ACCURACY
              </span>
              <h3 className="text-xl font-black text-white font-sans">
                Native Hinglish &amp; Speech
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Subtitles should match how modern creators actually speak. Precision phonetic Roman Hinglish and English transcription without manual typo fixes.
              </p>
            </div>

            {/* Principle 03 */}
            <div className="border-t border-white/[0.12] pt-5 space-y-3">
              <span className="font-mono text-xs font-black tracking-widest text-[#FF9100] block">
                03. SIMPLICITY
              </span>
              <h3 className="text-xl font-black text-white font-sans">
                Power Without Complexity
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Professional video creation should feel simple, even when the technology behind it is sophisticated.
              </p>
            </div>

          </div>
        </section>

        {/* ── 6. WHY ITNAVIDEO? ── */}
        <section className="border-t border-white/10 pt-16 sm:pt-20 space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#FF9100]">
              The Creator Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-sans tracking-tight">
              Built for creators, not editors.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-[24px] border border-white/10 bg-[#0F1117] p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FF6D00]/10 text-[#FF9100] border border-[#FF6D00]/20">
                <Clock size={20} />
              </div>
              <h3 className="text-lg font-bold text-white font-sans">Less Complexity</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                No keyframes, no video tracks, and no overwhelming editing timelines to manage.
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-[#0F1117] p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FF6D00]/10 text-[#FF9100] border border-[#FF6D00]/20">
                <Zap size={20} />
              </div>
              <h3 className="text-lg font-bold text-white font-sans">AI-First Creation</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Let AI handle repetitive subtitle syncing, scene pacing, audio cleanup, and 1080p rendering.
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-[#0F1117] p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FF6D00]/10 text-[#FF9100] border border-[#FF6D00]/20">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="text-lg font-bold text-white font-sans">Professional Results</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Create videos designed and pre-formatted for maximum retention on today&apos;s major platforms.
              </p>
            </div>
          </div>
        </section>

        {/* ── 7. CTA SECTION ── */}
        <section className="text-center space-y-6 pt-12 sm:pt-16 pb-8 border-t border-white/10">
          <h2 className="text-3xl sm:text-5xl font-black text-white font-sans tracking-tight max-w-2xl mx-auto leading-tight">
            Ready to create your first{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726]">
              AI video?
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto font-normal">
            Start creating with ItnaVideo today. No credit card required.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-9 py-4 text-sm font-black text-black shadow-lg shadow-[#FF6D00]/25 transition hover:brightness-110 active:scale-95 cursor-pointer"
            >
              <span>Start Creating Free →</span>
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
