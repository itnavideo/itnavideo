'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Tv,
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
  Type,
  ShieldCheck,
  Award,
} from 'lucide-react';

export default function YouTubeSubtitleDetail() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    {
      q: "What is the YouTube Subtitle Generator (16:9 Landscape Subtitles)?",
      a: "The YouTube Subtitle Generator adds broadcast-quality, burned-in 16:9 horizontal subtitles to YouTube videos, podcasts, and web lectures. It features 9 Tier-1 Western creator typography styles (Ali Abdaal, Vox Documentary, Diary of a CEO, Huberman Lab, MKBHD) with player scrubber safe-zone margins."
    },
    {
      q: "Why are burned-in styled subtitles better than YouTube's default CC button?",
      a: "YouTube's default CC subtitles look generic, are turned off by default for most viewers, and often overlap with player controls or bottom channel popups. Burned-in styled subtitles ensure 100% of viewers see high-contrast, branded captions regardless of device or player settings."
    },
    {
      q: "What are YouTube Player UI Safe Zones?",
      a: "Player UI Safe Zones are calculated bottom margins (e.g. 84px Scrubber Safe, 120px TV Safe) that ensure subtitle text never collides with YouTube's progress bar, volume controls, or title overlays."
    },
    {
      q: "Do I need to upload manual SRT subtitle files?",
      a: "No SRT files are required. You simply upload your 16:9 horizontal MP4/MOV video, and Speech AI transcribes the voice track with word-level timestamp accuracy."
    },
    {
      q: "What Western creator subtitle presets are included?",
      a: "Includes Ali Abdaal Clean Pill, Vox Documentary, Diary of a CEO, Huberman Lab, MrBeast Punch, MKBHD Studio, BBC/Netflix CC, Kurzgesagt, and Lex Fridman."
    },
    {
      q: "What video length and resolution are supported?",
      a: "Supports videos up to 10 minutes in full 1080p Full HD Widescreen (1920x1080)."
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
    name: 'Itnavideo YouTube Subtitle Generator',
    operatingSystem: 'Web-based App',
    applicationCategory: 'MultimediaApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Add broadcast-quality 16:9 landscape subtitles to YouTube videos with Western creator styles and UI safe zones.',
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
              href="/dashboard?videoType=youtube-subtitle-generator"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-purple-500/25 transition hover:brightness-110 active:scale-95"
            >
              <Sparkles size={16} />
              <span>Add Subtitles to YouTube Video</span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-blue-600/20 via-purple-600/20 to-pink-500/20 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-300 mb-6">
            <Tv size={14} className="text-blue-400" />
            <span>AI YouTube Subtitle Generator • 16:9 Landscape &amp; Western Creator Styles</span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1] max-w-5xl mx-auto">
            Broadcast-Quality 16:9 Subtitles for{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              YouTube &amp; Widescreen Videos
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed font-medium max-w-3xl mx-auto">
            Upgrade your landscape YouTube videos with signature creator typography (Ali Abdaal, Vox Documentary, Diary of a CEO, Huberman Lab) complete with UI scrubber safe-zone margins and sub-second speech synchronization.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard?videoType=youtube-subtitle-generator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 px-8 py-4 text-base font-black text-white shadow-xl shadow-blue-500/20 transition hover:brightness-110 active:scale-95"
            >
              <Play size={18} className="fill-white" />
              <span>Generate 16:9 Subtitles Free</span>
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
              <span>9 Western Creator Presets</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>YouTube Scrubber Safe Margins</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>100% Native 16:9 Landscape</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>1080p Widescreen Export</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: WHY STYLED 16:9 SUBTITLES MATTER */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#0A0F1D]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-bold uppercase text-blue-300">
                <Flame size={14} />
                <span>Western Creator Production Standard</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Why Top YouTubers Rely on Burned-In Widescreen Subtitles
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Over 70% of YouTube long-form content is consumed on mobile screens, tablets, and smart TVs in noisy environments. When viewers encounter uncaptioned speech, retention drops dramatically within the first 60 seconds.
              </p>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                While YouTube offers an automated closed captioning (CC) button, default captions look unstyled, often fail to load on embedded players, and frequently overlap with YouTube's progress bar scrubber and channel branding buttons.
              </p>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                The <strong className="text-blue-400 font-semibold">Itnavideo YouTube Subtitle Generator</strong> burns high-contrast, beautifully styled typography directly into your 1920x1080 landscape video file—ensuring every viewer experiences broadcast-quality subtitles.
              </p>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-[#0E1526] p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <BarChart3 size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">40%+ Higher Watch Time</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  High-contrast typography keeps viewer eyes focused, increasing average watch duration.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1526] p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Player Control Protection</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Calculated bottom margin safe zones guarantee captions never obscure scrubber controls.
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
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">Add 16:9 Subtitles to Your YouTube Video Today</h2>
          <p className="text-slate-300 text-lg mb-8">Join thousands of creators delivering broadcast-quality landscape captions in seconds.</p>
          <Link
            href="/dashboard?videoType=youtube-subtitle-generator"
            className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 px-8 py-4 text-base font-black text-white shadow-xl shadow-purple-500/25 transition hover:brightness-110"
          >
            <Sparkles size={18} />
            <span>Generate 16:9 Subtitles Free</span>
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
