'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
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
  Award,
  Tv,
} from 'lucide-react';

export default function BookSummaryDetail() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    {
      q: "What is an AI Book Summary Video Generator?",
      a: "An AI Book Summary Video Generator converts book review voiceovers and key quotes into cinematic 16:9 widescreen videos complete with 3D book cover reveals, animated chapter transition cards, kinetic note highlights, and focus background music."
    },
    {
      q: "How does Itnavideo structure book summaries into chapters automatically?",
      a: "Our engine analyzes your narration transcript, detects chapter transition triggers (e.g., 'Chapter 1: The Habit Loop', 'Principle 2: Deep Work'), and automatically places chapter banner cards and quote overlays."
    },
    {
      q: "Do I need graphic design or 3D modeling skills for book covers?",
      a: "No 3D modeling skills are required. Simply upload any book cover image (JPG/PNG), and the engine renders a 3D book tilt animation with lighting shimmers."
    },
    {
      q: "What music and background styles are available?",
      a: "Includes lo-fi focus beats, ambient acoustic guitar, tech minimalism, and clean dark studio backgrounds."
    },
    {
      q: "What video length and aspect ratios are supported?",
      a: "Supports up to 10-minute 16:9 widescreen YouTube videos (1920x1080) and 9:16 vertical short-form reels."
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
    name: 'Itnavideo Book Summary Video Generator',
    operatingSystem: 'Web-based App',
    applicationCategory: 'MultimediaApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Transform book review audio into cinematic 16:9 widescreen videos with 3D book covers, chapter cards, and kinetic notes.',
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
              href="/dashboard?videoType=book-summary"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-purple-500/25 transition hover:brightness-110 active:scale-95"
            >
              <Sparkles size={16} />
              <span>Create Book Summary Video</span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-500/20 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-300 mb-6">
            <BookOpen size={14} className="text-indigo-400" />
            <span>AI Book Summary Video Generator • 3D Cover Displays &amp; Kinetic Notes</span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1] max-w-5xl mx-auto">
            Turn Book Summaries &amp; Voiceovers Into{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Cinematic 16:9 Widescreen Videos
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed font-medium max-w-3xl mx-auto">
            Run a successful book review YouTube channel without spending 40 hours per video. Upload your voiceover and book cover image to generate 3D book tilt animations, chapter transition cards, quote callouts, and lo-fi focus BGM automatically.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard?videoType=book-summary"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-8 py-4 text-base font-black text-white shadow-xl shadow-indigo-500/20 transition hover:brightness-110 active:scale-95"
            >
              <Play size={18} className="fill-white" />
              <span>Create Book Summary Free</span>
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
              <span>3D Book Cover Reveal Engine</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Animated Chapter Transition Cards</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Kinetic Quote Highlight Overlays</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>1080p Widescreen Export</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: THE BOOK CHANNEL OPPORTUNITY */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#0A0F1D]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-bold uppercase text-indigo-300">
                <Flame size={14} />
                <span>Evergreen Knowledge Niche</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Why Non-Fiction Book Summaries Generate High CPM &amp; Lifetime Views
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Book summary videos for titles like <strong className="text-white font-semibold">"Atomic Habits"</strong>, <strong className="text-white font-semibold">"Rich Dad Poor Dad"</strong>, or <strong className="text-white font-semibold">"The Psychology of Money"</strong> attract highly educated, high-intent audiences. Because these topics are timeless, book summary channels build long-term passive traffic.
              </p>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                However, creating custom 2D/3D animations for every chapter breakdown manually is exhausting.
              </p>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                The <strong className="text-indigo-400 font-semibold">Itnavideo Book Summary Generator</strong> automates 3D book cover displays, kinetic quote callouts, and chapter transitions in under 60 seconds.
              </p>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-[#0E1526] p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <BarChart3 size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Evergreen Channel Traffic</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Book review content stays relevant for years, generating steady ad revenue.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1526] p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Zap size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">60-Second Production</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Upload audio + book cover image. Cloud engine handles 3D tilt &amp; kinetic notes.
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
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">Start Your Book Summary Channel Free</h2>
          <p className="text-slate-300 text-lg mb-8">Generate 16:9 widescreen book review videos in under 60 seconds.</p>
          <Link
            href="/dashboard?videoType=book-summary"
            className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-8 py-4 text-base font-black text-white shadow-xl shadow-purple-500/25 transition hover:brightness-110"
          >
            <Sparkles size={18} />
            <span>Create Book Summary Free</span>
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
