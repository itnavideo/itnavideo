'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  FileText,
  Zap,
  CheckCircle2,
  Clock,
  HelpCircle,
  Play,
  Sliders,
  ChevronDown,
  BarChart3,
  Flame,
  Highlighter,
  Award,
} from 'lucide-react';

export default function VoiceSyncedNotesDetail() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    {
      q: "What is a Voice Synced Notes Explainer Reel?",
      a: "A Voice Synced Notes Explainer Reel transforms lecture audio or spoken notes into clean digital note cards with real-time highlighter strips and sticky note callouts that illuminate line-by-line as words are spoken."
    },
    {
      q: "How does the AI sync note lines to voice audio?",
      a: "Speech AI transcribes your speech recording, organizes sentences into structured note bullet points, and applies glowing highlighter animations synchronized to exact timestamp audio waveforms."
    },
    {
      q: "Do I need graphic design or video editing skills?",
      a: "No design skills are needed. Traditional note reel creation requires manual text box keyframing and color layer masking in Premiere Pro. Itnavideo automates the entire note layout in under 30 seconds."
    },
    {
      q: "What note card themes and highlighter colors are available?",
      a: "Includes Academic Clean Notepad, Dark Code Studio, Glassmorphism Cards, and Sticky Note Yellow/Green/Cyan highlighters."
    },
    {
      q: "What video resolutions are exported?",
      a: "Exports full 1080p Full HD MP4 files (1080x1920 for 9:16 vertical Reels/Shorts and 1920x1080 for 16:9 widescreen)."
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
    name: 'Itnavideo Voice Synced Notes Generator',
    operatingSystem: 'Web-based App',
    applicationCategory: 'MultimediaApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Convert voiceover audio into interactive digital note cards with real-time highlighter animations and sticky note callouts.',
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
              href="/dashboard?videoType=voice-synced-notes"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-purple-500/25 transition hover:brightness-110 active:scale-95"
            >
              <Sparkles size={16} />
              <span>Create Voice Synced Notes</span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-yellow-500/20 via-purple-600/20 to-pink-500/20 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-yellow-300 mb-6">
            <FileText size={14} className="text-yellow-400" />
            <span>AI Voice Synced Notes Generator • Highlighter Strips &amp; Digital Cards</span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1] max-w-5xl mx-auto">
            Transform Voiceovers Into{' '}
            <span className="bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Voice Synced Note Reels
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed font-medium max-w-3xl mx-auto">
            Turn audio lectures, study guides, or advice voiceovers into engaging digital note cards where key phrases illuminate with animated highlighters in real-time.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard?videoType=voice-synced-notes"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-yellow-500 via-purple-600 to-pink-500 px-8 py-4 text-base font-black text-white shadow-xl shadow-yellow-500/20 transition hover:brightness-110 active:scale-95"
            >
              <Play size={18} className="fill-white" />
              <span>Create Voice Synced Notes Free</span>
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
              <span>Speech-Synced Line Highlighting</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Digital Notepad &amp; Glass Cards</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Sticky Note Callouts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>1080p HD Export</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: FAQ ACCORDION */}
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
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">Start Creating Synced Note Reels Today</h2>
          <p className="text-slate-300 text-lg mb-8">Transform lectures and study notes into high-retention video cards in seconds.</p>
          <Link
            href="/dashboard?videoType=voice-synced-notes"
            className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-yellow-500 via-purple-600 to-pink-500 px-8 py-4 text-base font-black text-white shadow-xl shadow-purple-500/25 transition hover:brightness-110"
          >
            <Sparkles size={18} />
            <span>Create Voice Synced Notes Free</span>
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
