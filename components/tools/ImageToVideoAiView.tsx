'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Film,
  Sparkles,
  Layers,
  Sliders,
  Music,
  Zap,
  CheckCircle2,
  Clock,
  Coins,
  Cpu,
  Download,
  HelpCircle,
  Play,
  Pause,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  MonitorPlay,
  ExternalLink,
  Tv,
  Image as ImageIcon,
  Workflow,
  Sparkle
} from 'lucide-react';

const SPECIFICATIONS = [
  { label: 'Aspect Ratio', value: '16:9 Widescreen (1920 × 1080)', icon: Tv },
  { label: 'Frame Rate', value: '30 FPS Cinema Fluid', icon: Film },
  { label: 'Transitions', value: 'Crossfade, Flash, Whip Pan, Jump Cut', icon: Sliders },
  { label: 'Max Video Length', value: 'Up to 15 Minutes', icon: Clock },
  { label: 'Audio Ingestion', value: 'MP3, WAV, M4A, AAC', icon: Music },
  { label: 'Image Limit', value: 'Unlimited Photos / Stills', icon: ImageIcon },
  { label: 'Motion Engine', value: 'Remotion 2.5D Ken Burns', icon: Cpu },
  { label: 'Pricing Model', value: '1 min = 2 Credits', icon: Coins },
];

const CORE_FEATURES = [
  {
    icon: Film,
    title: 'Scene Flow & Script Sync',
    desc: 'High-precision Speech AI transcription detects complete sentence boundaries and natural speaker pauses, automatically slicing the voiceover into coherent visual scenes.',
    chip: 'Speech AI',
    accent: 'bg-violet-50 text-violet-700 border-violet-200',
  },
  {
    icon: Sliders,
    title: 'Cinematic Scene Transitions',
    desc: 'Choose between Smooth Crossfade, Cinematic Flash, High-Energy Whip Pan, or Clean Jump Cut for television-grade visual transitions between photo scenes.',
    chip: 'Transitions',
    accent: 'bg-pink-50 text-pink-700 border-pink-200',
  },
  {
    icon: Cpu,
    title: 'Ken Burns Camera Motion',
    desc: 'Smooth 1.0x to 1.18x dynamic zoom in, zoom out, and horizontal panning brings every still image to life with authentic documentary camera movement.',
    chip: '2.5D Motion',
    accent: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    icon: Layers,
    title: '2.5D Parallax Subtitles',
    desc: 'Floating glassmorphic subtitle pills with spring-damped physics and high-contrast ambient drop shadows, ensuring 100% legibility on any scene background.',
    chip: 'Glassmorphic',
    accent: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    icon: Music,
    title: 'Intelligent Audio Ducking',
    desc: 'AI dynamically attenuates background music during speech bursts and restores volume during narrative pauses, creating broadcast-quality audio mixes.',
    chip: 'Auto-Ducking',
    accent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    icon: ImageIcon,
    title: 'Unlimited Stills & Smart Fallback',
    desc: 'Upload 5, 20, or 100 photos. If you have fewer photos than scenes, our curated visual library automatically matches the context with relevant high-res imagery.',
    chip: 'Smart Library',
    accent: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  },
  {
    icon: Zap,
    title: 'Cloud 30 FPS Rendering',
    desc: 'Multi-threaded cloud rendering processes long-form videos in seconds without dropping frames, stutter, or consuming your local laptop hardware.',
    chip: 'Cloud Render',
    accent: 'bg-rose-50 text-rose-700 border-rose-200',
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Upload Audio Narration',
    desc: 'Drop your voiceover, podcast clip, or story narration in MP3, WAV, or M4A (up to 15 minutes supported).',
  },
  {
    step: '02',
    title: 'Provide Images or Use AI Stills',
    desc: 'Upload your own photo collection or let the system curate high-definition visual assets aligned with your script.',
  },
  {
    step: '03',
    title: 'AI Matches Scenes & Camera Motion',
    desc: 'Speech AI slices scenes per line of thought, assigns Ken Burns pan & zoom paths, and layers 2.5D subtitles.',
  },
  {
    step: '04',
    title: 'Export 1080p Cinematic Video',
    desc: 'Preview the video instantly in browser, then render a crisp 16:9 MP4 ready for YouTube, LinkedIn, or TV.',
  },
];

const FAQS = [
  {
    q: 'How many images can I upload for a single video?',
    a: 'There is zero limit on image uploads! You can upload 5, 25, or 100+ images. The AI maps them sequentially to your script’s scene markers. If you upload fewer images than scenes, the system automatically loops or supplements them with high-definition curated visuals.',
  },
  {
    q: 'What is the maximum video duration supported?',
    a: 'Image to Video AI supports up to 15 minutes of continuous audio narration and video generation at full 1080p 30 FPS using our distributed cloud rendering pipeline.',
  },
  {
    q: 'How does Ken Burns motion work?',
    a: 'Ken Burns is an authentic cinematic technique that introduces gradual scaling (from 1.0x to 1.18x) and horizontal or vertical camera drift. Each scene receives an alternating camera path (e.g. pan left + zoom in, pan right + zoom out) to prevent visual fatigue.',
  },
  {
    q: 'Can I add background music and sound effects?',
    a: 'Yes! You can pick from our royalty-free cinematic music library or upload your own track. The system features automatic audio ducking, lowering music levels when the narrator speaks and swelling during dramatic transitions.',
  },
  {
    q: 'How much does rendering cost?',
    a: '1 minute of rendered 1080p 16:9 video costs 2 credits. New accounts receive complimentary starter credits to test and create their first video completely free.',
  },
];

export default function ImageToVideoAiView() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-violet-100 selection:text-violet-900">
      {/* Background Ambient Tonal Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-violet-400/10 blur-3xl" />
        <div className="absolute top-96 left-0 h-[600px] w-[600px] rounded-full bg-indigo-300/10 blur-3xl" />
        <div className="absolute bottom-40 right-10 h-[500px] w-[500px] rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      {/* 1. M3 HERO SECTION */}
      <section className="relative px-4 pb-16 pt-24 sm:px-6 sm:pb-24 sm:pt-32">
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          {/* M3 Assist Chip */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-50/80 px-4 py-1.5 text-xs font-bold text-violet-800 shadow-xs backdrop-blur-md">
            <Sparkles size={14} className="text-violet-600 animate-pulse" />
            <span>Material 3 Motion Engine • 16:9 Widescreen • Scene Transitions &amp; Pacing</span>
          </div>

          {/* M3 Display Headline */}
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Image to Video AI<br />
            <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Turn Voiceovers &amp; Photos into 16:9 Cinematic Videos
            </span>
          </h1>

          {/* M3 Body Large */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Upload your voiceover narration and any collection of images. Our AI synchronizes scenes per line of thought, applies continuous Ken Burns camera pan &amp; zoom, layers 2.5D parallax subtitles, and balances audio ducking automatically.
          </p>

          {/* M3 Action Row */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard?videoType=image-to-video-ai"
              className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/35 active:translate-y-0"
            >
              <MonitorPlay size={18} />
              Open Image to Video Studio
              <ArrowRight size={16} />
            </Link>

            <a
              href="#workflow"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]"
            >
              <Workflow size={16} />
              See How It Works
            </a>
          </div>

          {/* Micro Trust Metadata */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" />
              1 min video = 2 credits
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" />
              No image count limits
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" />
              Free trial on signup
            </span>
          </div>

          {/* M3 Hero Showcase Elevated Card */}
          <div className="relative mt-12 overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-3 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-5">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-950">
              <img
                src="/visuals/heroimages/imagetovideoai.hero.png"
                alt="Image to Video AI 16:9 Cinematic Video Output Showcase"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

              {/* M3 Floating Assist Badges on Preview */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/90 px-3 py-1 font-bold text-slate-900 backdrop-blur-md shadow-xs">
                    ✦ 2.5D Subtitles
                  </span>
                  <span className="rounded-full bg-violet-900/90 px-3 py-1 font-bold text-violet-200 backdrop-blur-md shadow-xs">
                    ✦ Ken Burns 1.18x Zoom
                  </span>
                  <span className="hidden sm:inline-block rounded-full bg-indigo-900/90 px-3 py-1 font-bold text-indigo-200 backdrop-blur-md shadow-xs">
                    ✦ Auto Audio Ducking
                  </span>
                </div>
                <span className="rounded-full bg-emerald-500/90 px-3 py-1 font-bold text-white shadow-xs">
                  Full 1080p 30 FPS
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SYSTEM WORKFLOW & ARCHITECTURE INFOGRAPHIC */}
      <section id="workflow" className="relative px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-violet-700">
                  <Sparkle size={13} />
                  System Pipeline &amp; Architecture
                </span>
                <h2 className="text-xl font-black text-slate-900 sm:text-2xl mt-1">
                  How Image to Video AI Operates Behind the Scenes
                </h2>
              </div>
              <span className="self-start rounded-full bg-slate-100 px-3.5 py-1 text-xs font-semibold text-slate-600">
                Cloud Render Engine
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-2">
              <img
                src="https://storage.googleapis.com/itnavideo-media-assets/ChatGPT_Image_Sep_7_2026_04_53_04_PM_grkkjj.png"
                alt="Image to Video AI System Workflow and Background Architecture"
                className="w-full rounded-xl object-contain shadow-xs"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. M3 CORE FEATURES GRID */}
      <section className="relative px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100/70 px-3.5 py-1 text-xs font-bold text-violet-800">
              M3 Expressive Capabilities
            </span>
            <h2 className="mt-3 text-2xl font-black text-slate-900 sm:text-4xl">
              Engineered for Cinematic Storytelling
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600 sm:text-base">
              Every detail — from narrative pause detection to camera motion easing — is designed to keep viewers watching till the last second.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CORE_FEATURES.map((feature, idx) => {
              const Icon = feature?.icon || Sparkles;
              return (
                <div
                  key={idx}
                  className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-violet-300 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`inline-flex rounded-2xl p-3 border ${feature.accent}`}>
                        <Icon size={22} />
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600">
                        {feature.chip}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-violet-700 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. M3 STEP-BY-STEP WORKFLOW TIMELINE */}
      <section className="relative px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xs sm:p-12">
            <div className="text-center mb-12">
              <span className="text-xs font-black uppercase tracking-wider text-violet-700">
                Simple 4-Step Process
              </span>
              <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                From Raw Narration to Completed 16:9 Video
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {HOW_IT_WORKS_STEPS.map((step, idx) => (
                <div
                  key={idx}
                  className="relative flex flex-col rounded-2xl border border-slate-100 bg-slate-50/60 p-5"
                >
                  <span className="text-3xl font-black text-violet-600/30">
                    {step.step}
                  </span>
                  <h3 className="mt-2 text-base font-bold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. M3 TECHNICAL SPECIFICATIONS MATRIX */}
      <section className="relative px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xs sm:p-10">
            <h2 className="text-xl font-black text-slate-900 sm:text-2xl mb-6">
              Technical Specifications &amp; Engine Capabilities
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SPECIFICATIONS.map((spec, idx) => {
                const Icon = spec?.icon || Sparkles;
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                  >
                    <div className="rounded-xl bg-violet-100/70 p-2 text-violet-700">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        {spec.label}
                      </p>
                      <p className="mt-0.5 text-xs font-bold text-slate-900">
                        {spec.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 6. M3 FREQUENTLY ASKED QUESTIONS */}
      <section className="relative px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-wider text-violet-700">
              Clear Answers
            </span>
            <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-slate-900 hover:text-violet-700"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp size={18} className="text-slate-400 shrink-0 ml-2" />
                    ) : (
                      <ChevronDown size={18} className="text-slate-400 shrink-0 ml-2" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="border-t border-slate-100 px-5 pb-5 pt-3 text-sm leading-relaxed text-slate-600">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. M3 FLOATING BOTTOM CALL TO ACTION */}
      <section className="relative px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 p-8 sm:p-12 text-white shadow-xl shadow-violet-500/15">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold text-white backdrop-blur-md">
                ✦ 15-Minute Production Scale
              </span>
              <h2 className="mt-4 text-2xl font-black sm:text-4xl leading-tight">
                Ready to Generate Your Next 16:9 Cinematic Video?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-violet-100 leading-relaxed">
                Upload your voiceover narration and photos now. Experience automatic sentence cutting, Ken Burns camera motion, and 2.5D parallax subtitles in under 2 minutes.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/dashboard?videoType=image-to-video-ai"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-slate-950 shadow-md transition-all hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MonitorPlay size={18} className="text-violet-600" />
                  Launch Image to Video AI
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-4 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20"
                >
                  View Credit Packs
                </Link>
              </div>
            </div>

            {/* Background Decorative Rings */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full border border-white/10 bg-white/5 blur-2xl" />
          </div>
        </div>
      </section>
    </div>
  );
}
