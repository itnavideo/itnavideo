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
  Flame,
  Scissors,
  Layers,
  Award,
} from 'lucide-react';

export default function LongVideoClipsDetail() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    {
      q: "What is an AI Long Video Clips Generator (Long Video to Shorts)?",
      a: "An AI Long Video Clips Generator automatically scans long video files (podcasts, webinars, interviews, lectures up to 2 hours) to detect high-energy viral hooks, cuts key 30-to-60 second clips, reframes horizontal footage into 9:16 vertical format, and adds word-synced animated subtitles."
    },
    {
      q: "How does Itnavideo detect viral hook moments in long videos?",
      a: "Our speech analysis engine transcribes the audio, evaluates sentence emotional weight, identifies controversial or intriguing statements, tracks speaking cadence spikes, and isolates complete self-contained thought clips."
    },
    {
      q: "Do I need to manually scrub through hours of footage to set start and end timestamps?",
      a: "No manual scrubbing is needed. The AI automatically harvests 3 to 5 standalone short clips per upload, complete with top hook teaser banners and active word highlights."
    },
    {
      q: "What input video formats and lengths are supported?",
      a: "Upload long MP4 or MOV video files up to 2 hours long, or paste video storage links."
    },
    {
      q: "How does vertical reframing work for landscape speaker videos?",
      a: "The engine centers the primary speaker face inside the vertical 9:16 canvas or applies ambient blurred top/bottom borders to preserve full landscape visibility."
    },
    {
      q: "What export options are provided?",
      a: "Download individual 1080p vertical MP4 clips optimized for YouTube Shorts, Instagram Reels, and TikTok."
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
    name: 'Itnavideo Long Video Clips Generator',
    operatingSystem: 'Web-based App',
    applicationCategory: 'MultimediaApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'AI identifies viral moments from long videos and cuts captioned 9:16 vertical short clips in seconds.',
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
              href="/dashboard?videoType=long-video-clips"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-purple-500/25 transition hover:brightness-110 active:scale-95"
            >
              <Sparkles size={16} />
              <span>Clip Long Video Now</span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-emerald-500/20 via-purple-600/20 to-pink-500/20 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 mb-6">
            <Scissors size={14} className="text-emerald-400" />
            <span>AI Long Video Clips Generator • Turn Podcasts into 10x Viral Shorts</span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1] max-w-5xl mx-auto">
            Turn Hours of Long Video Into{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Viral Captioned Short Clips
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed font-medium max-w-3xl mx-auto">
            Stop watching hours of raw podcast or webinar footage to find good moments. AI identifies viral hook sentences, cuts standalone short clips, reframes speaker faces to 9:16, and adds animated captions automatically.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard?videoType=long-video-clips"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-purple-600 to-pink-500 px-8 py-4 text-base font-black text-white shadow-xl shadow-purple-500/20 transition hover:brightness-110 active:scale-95"
            >
              <Play size={18} className="fill-white" />
              <span>Harvest Viral Clips Free</span>
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
              <span>AI Hook Score Detection</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Automatic 9:16 Speaker Re-framing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Word-Level Karaoke Subtitles</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>1080p HD Export</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: REPURPOSING VALUE */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#0A0F1D]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold uppercase text-emerald-300">
                <Flame size={14} />
                <span>10x Content Multiplier</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Unlock 10x Content Output From Your Long Videos
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                If you host podcasts, record webinars, or film long YouTube videos, you are sitting on a goldmine of unharvested short-form content. However, manual clip cutting is a massive bottleneck—requiring hours of timestamp logging, video cropping, and subtitle alignment.
              </p>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                The <strong className="text-white font-semibold">Itnavideo Long Video Clips Generator</strong> acts as your personal AI video editor. Upload a long recording, and the AI evaluates speech cadence and emotional hooks to extract 3 to 5 standalone short clips automatically.
              </p>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-[#0E1526] p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <BarChart3 size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Save 15+ Hours Weekly</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Eliminate manual timeline cutting and timestamp logging completely.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1526] p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Zap size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Automated Face Centering</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  AI keeps the active speaker centered in vertical 9:16 framing automatically.
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
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">Start Repurposing Your Long Videos Free</h2>
          <p className="text-slate-300 text-lg mb-8">Harvest viral short clips from podcasts and webinars in seconds.</p>
          <Link
            href="/dashboard?videoType=long-video-clips"
            className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-purple-600 to-pink-500 px-8 py-4 text-base font-black text-white shadow-xl shadow-purple-500/25 transition hover:brightness-110"
          >
            <Sparkles size={18} />
            <span>Clip Long Video Free</span>
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
