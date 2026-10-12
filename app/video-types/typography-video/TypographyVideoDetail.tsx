'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle2,
  Clock,
  HelpCircle,
  Play,
  FileText,
  Sliders,
  ChevronDown,
  BarChart3,
  Type,
  Volume2,
  Flame,
  Award,
} from 'lucide-react';

export default function TypographyVideoDetail() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    {
      q: "What is Kinetic Typography, and why is it so popular on TikTok and Reels?",
      a: "Kinetic Typography is an animation technique where text moves, scales, bounces, and pops in sync with spoken voice audio. Instead of static subtitles, giant high-energy words explode onto the screen alongside camera pulses and punch SFX, capturing maximum visual attention on short-form feeds."
    },
    {
      q: "How does Itnavideo sync kinetic text animations to voice audio automatically?",
      a: "Our rendering engine transcribes your voice track with sub-second accuracy, identifies emphasis keywords and punch beats, and applies kinetic motion effects (pop-in, blitz camera zoom, 3D text depth) in sync with speech waveforms."
    },
    {
      q: "Do I need Adobe After Effects or complex keyframe plugins?",
      a: "No software downloads or After Effects keyframing skills are required. Traditional kinetic typography in After Effects requires setting up hundreds of text layers, camera parent nulls, and motion blur curves. Itnavideo automates the entire kinetic motion pipeline in your web browser."
    },
    {
      q: "Can I customize text fonts, punch sound effects, and casing?",
      a: "Yes! You can choose from viral font presets (bold impact, 3D gold depth, luxury serif, neon glow), adjust punch sound effect volume, select UPPERCASE or natural text casing, and set animation pacing."
    },
    {
      q: "What industries benefit most from Kinetic Typography reels?",
      a: "Real estate agents showcasing luxury property walkthroughs, fitness coaches, motivational speakers, event promoters, music artists, and podcasters looking for high-energy promotional teasers."
    },
    {
      q: "What export formats are supported?",
      a: "Exports full 1080p Full HD MP4 video files optimized for 9:16 vertical reels (Instagram Reels, YouTube Shorts, TikTok) and 16:9 widescreen videos."
    }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Itnavideo Kinetic Typography Video Generator',
    operatingSystem: 'Web-based App',
    applicationCategory: 'MultimediaApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Create high-energy kinetic typography videos with camera pulses, punch sound effects, and viral text animations in seconds.',
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 font-sans selection:bg-purple-500/30 selection:text-purple-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070B14]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-pink-500 text-white font-black shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
              IV
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Itnavideo<span className="text-purple-400">.</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <Link href="/video-types" className="hover:text-purple-400 transition">Video Types</Link>
            <Link href="/faceless-video" className="hover:text-purple-400 transition">Faceless Video</Link>
            <Link href="/auto-caption-generator" className="hover:text-purple-400 transition">Auto Captions</Link>
            <Link href="/pricing" className="hover:text-purple-400 transition">Pricing</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard?videoType=typography-video"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-purple-500/25 transition hover:brightness-110 active:scale-95"
            >
              <Sparkles size={16} />
              <span>Create Typography Video</span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-fuchsia-600/20 via-purple-600/20 to-pink-500/20 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-fuchsia-300 mb-6">
            <Type size={14} className="text-fuchsia-400" />
            <span>AI Kinetic Typography Video Generator • Viral Text Motion &amp; SFX</span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1] max-w-5xl mx-auto">
            Transform Voiceovers Into High-Energy{' '}
            <span className="bg-gradient-to-r from-fuchsia-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Kinetic Typography Videos
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed font-medium max-w-3xl mx-auto">
            Make your words pop off the screen. AI synchronizes giant bold text overlays, camera pulses, 3D depth layers, and punch sound effects directly to speech beats in seconds.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard?videoType=typography-video"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-pink-500 px-8 py-4 text-base font-black text-white shadow-xl shadow-fuchsia-500/20 transition hover:brightness-110 active:scale-95"
            >
              <Play size={18} className="fill-white" />
              <span>Create Kinetic Typography Free</span>
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#0E1526] px-8 py-4 text-base font-bold text-slate-200 hover:bg-[#152038] hover:border-purple-500/30 transition"
            >
              <span>View Pricing Plans</span>
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs sm:text-sm font-semibold text-slate-400 border-t border-white/10 pt-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>0% After Effects Keyframing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Camera Zoom &amp; Pulse FX</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Punch SFX Beat Alignment</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>1080p HD Export</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: THE POWER OF KINETIC TEXT */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#0A0F1D]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-3.5 py-1 text-xs font-bold uppercase text-fuchsia-300">
                <Flame size={14} />
                <span>High-Energy Visual Retention</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Why Kinetic Typography Drives Explosive Engagement
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                In the fast-paced world of short-form video, static text overlays fail to capture viewer attention. <strong className="text-white font-semibold">Kinetic Typography</strong> treats text as an active visual element—scaling, bouncing, and pulsing in exact rhythm with human speech.
              </p>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                When word animation is paired with subtle camera zoom pulses and impact sound effects, the brain experiences continuous visual stimulation. This keeps eye movement anchored to the center of the screen, drastically lowering drop-off rates on TikTok, Instagram Reels, and YouTube Shorts.
              </p>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                With an <strong className="text-fuchsia-400 font-semibold">AI Kinetic Typography Generator</strong>, you can produce viral typography promos in seconds without touching complex motion graphics software.
              </p>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-[#0E1526] p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">
                    <BarChart3 size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Maximum Hook Retention</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Bold word explosions during opening sentences prevent instant swipes in the first 3 seconds.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1526] p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Volume2 size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Punch SFX Audio Beats</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Impact sound effects automatically trigger on key emphasis words for maximum auditory impact.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1526] p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                    <Zap size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Render in ~20 Seconds</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Cloud engine handles all scale keyframes and camera parent nulls automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE 5 BOTTLENECKS SOLVED */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#070B14]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Solved: The 5 Major Kinetic Motion Bottlenecks
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-500/10 text-fuchsia-400 mb-6">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">1. After Effects Keyframe Complexity</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Creating kinetic text scaling, tracking, and rotation keyframes line-by-line takes 6+ hours per 30-second video.
              </p>
              <div className="rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 p-3 text-xs font-semibold text-fuchsia-300">
                <strong className="text-white">Itnavideo Solution:</strong> Automatic text motion keyframing synchronized to audio speech.
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 mb-6">
                <Volume2 size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">2. Manual SFX Beat Alignment</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Lining up punch sound effects manually with text pop-ins requires micro-timeline cutting and volume balancing.
              </p>
              <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 p-3 text-xs font-semibold text-purple-300">
                <strong className="text-white">Itnavideo Solution:</strong> Intelligent punch sound effect trigger placement on emphasis words.
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-400 mb-6">
                <Type size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">3. Font &amp; Layout Formatting</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Balancing text sizes so multi-line sentences fit within phone screen bounds without awkward line wrapping.
              </p>
              <div className="rounded-xl bg-pink-500/10 border border-pink-500/20 p-3 text-xs font-semibold text-pink-300">
                <strong className="text-white">Itnavideo Solution:</strong> 15+ viral font presets with auto-bounding line breaks.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: FAQ ACCORDION */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#0A0F1D]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="rounded-2xl border border-white/10 bg-[#0E1526] overflow-hidden">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  >
                    <span className="text-base sm:text-lg font-bold text-white pr-4">{faq.q}</span>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-purple-400 transition-transform ${isOpen ? 'rotate-180 bg-purple-500/20' : ''}`}>
                      <ChevronDown size={18} />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-white/5 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-20 border-t border-white/10 bg-gradient-to-b from-[#0A0F1D] to-[#070B14] text-center">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">Create Your Kinetic Typography Video Free</h2>
          <p className="text-slate-300 text-lg mb-8">Generate viral kinetic text videos with camera pulses and punch SFX in seconds.</p>
          <Link
            href="/dashboard?videoType=typography-video"
            className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-pink-500 px-8 py-4 text-base font-black text-white shadow-xl shadow-purple-500/25 transition hover:brightness-110"
          >
            <Sparkles size={18} />
            <span>Start Kinetic Typography Free</span>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#050810] py-12 text-xs text-slate-400 text-center">
        <p>© {new Date().getFullYear()} Itnavideo. All rights reserved.</p>
      </footer>
    </div>
  );
}
