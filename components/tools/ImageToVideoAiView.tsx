'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Film,
  Zap,
  CheckCircle2,
  Clock,
  HelpCircle,
  Play,
  FileText,
  Sliders,
  ChevronDown,
  BarChart3,
  Flame,
  Image as ImageIcon,
  Cpu,
  Tv,
} from 'lucide-react';

export default function ImageToVideoAiView() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    {
      q: "What is Image to Video AI, and how does it convert photos into cinematic videos?",
      a: "Image to Video AI transforms still photos and voiceover audio into cinematic 16:9 widescreen videos. Our rendering engine applies Ken Burns pan and zoom camera motion, crossfade transitions, 2.5D parallax subtitles, and background music auto-ducking in real-time."
    },
    {
      q: "How does the AI synchronize image duration to spoken audio?",
      a: "Speech AI transcribes your voice track with sub-second accuracy, identifies sentence boundaries and natural pauses, and automatically calculates the exact frame duration for each photo scene so visual cuts feel natural."
    },
    {
      q: "Do I need video editing experience to create photo slideshow videos?",
      a: "Zero editing skills are needed. Traditional slideshow editing requires setting keyframes for pan/zoom camera curves, cropping image aspect ratios, and aligning transition points manually—taking 4+ hours per video. Itnavideo handles all motion keyframing in the cloud."
    },
    {
      q: "Can I upload unlimited photos for long documentary videos?",
      a: "Yes! You can upload as many images as needed to match your voiceover length up to 15 minutes long."
    },
    {
      q: "What transitions and camera motion styles are available?",
      a: "Features Ken Burns Slow Pan, Zoom In, Zoom Out, Crossfade, Flash Cut, Whip Pan, and 2.5D Parallax subtitle overlays."
    },
    {
      q: "What export formats are supported?",
      a: "Exports full 1080p Full HD Widescreen MP4 files (1920x1080 at 30 FPS)."
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
    name: 'Itnavideo Image to Video AI Generator',
    operatingSystem: 'Web-based App',
    applicationCategory: 'MultimediaApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Transform voiceover audio and photos into cinematic 16:9 widescreen videos with Ken Burns camera motion and transitions.',
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
              href="/dashboard?videoType=imageToVideoAi"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-purple-500/25 transition hover:brightness-110 active:scale-95"
            >
              <Sparkles size={16} />
              <span>Create Image to Video</span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-purple-600/20 via-pink-600/20 to-fuchsia-500/20 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-purple-300 mb-6">
            <ImageIcon size={14} className="text-purple-400" />
            <span>AI Image to Video Generator • Ken Burns Motion &amp; Parallax Subtitles</span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1] max-w-5xl mx-auto">
            Transform Photos &amp; Voiceovers Into{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
              16:9 Widescreen Cinematic Videos
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed font-medium max-w-3xl mx-auto">
            Turn static photos and voiceover narration into broadcast-grade 1080p videos with dynamic Ken Burns pan/zoom motion, crossfade transitions, 2.5D parallax subtitles, and ambient background music.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard?videoType=imageToVideoAi"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-500 px-8 py-4 text-base font-black text-white shadow-xl shadow-purple-500/20 transition hover:brightness-110 active:scale-95"
            >
              <Play size={18} className="fill-white" />
              <span>Convert Images to Video Free</span>
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
              <span>Ken Burns 2.5D Camera Panning</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Speech-Sync Scene Pacing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Cinematic Crossfade Transitions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>1080p Widescreen Export</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: THE STORYTELLING REVOLUTION */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#0A0F1D]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-bold uppercase text-purple-300">
                <Flame size={14} />
                <span>Cinematic Documentaries Made Easy</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Why Static Slideshows Lose Viewers (And How Ken Burns Fixes It)
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Static photo slideshows feel flat and dated. When a video displays still images without motion, viewer brain engagement drops immediately—resulting in high bounce rates on YouTube documentaries and course modules.
              </p>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                The famous <strong className="text-white font-semibold">Ken Burns motion effect</strong> slow-pans and zooms across still photographs, mimicking a live documentary camera operator.
              </p>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                With <strong className="text-purple-300 font-semibold">Itnavideo Image to Video AI</strong>, you simply upload your voiceover and photos. The cloud engine calculates exact sentence timing and applies camera motion curves automatically.
              </p>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-[#0E1526] p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <BarChart3 size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Documentary Production Quality</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Smooth camera motion curves give static image channels television-grade production polish.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1526] p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                    <Zap size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">45-Second Cloud Render</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Cloud engine handles all camera scale keyframes and crossfade transitions in under 45 seconds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FAQ ACCORDION */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#070B14]">
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
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">Convert Your Photos Into Video Today</h2>
          <p className="text-slate-300 text-lg mb-8">Join thousands of creators producing 16:9 cinematic videos in seconds.</p>
          <Link
            href="/dashboard?videoType=imageToVideoAi"
            className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-500 px-8 py-4 text-base font-black text-white shadow-xl shadow-purple-500/25 transition hover:brightness-110"
          >
            <Sparkles size={18} />
            <span>Convert Images to Video Free</span>
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
