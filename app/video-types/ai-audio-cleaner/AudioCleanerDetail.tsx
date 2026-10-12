'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Mic,
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
  Volume2,
  Radio,
  Scissors,
  Waves,
} from 'lucide-react';

export default function AudioCleanerDetail() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    {
      q: "What is the AI Studio Audio Cleaner?",
      a: "The AI Studio Audio Cleaner is an intelligent audio utility that transcribes raw voiceover recordings, automatically identifies and cuts sentence retakes ('let me re-say that', mistried words), removes dead silences, eliminates room echo, and masters audio to 24-bit broadcast standards (-14 LUFS)."
    },
    {
      q: "How does the AI detect and cut sentence retakes automatically?",
      a: "Groq Whisper transcribes your full speech recording with word-level precision. Our retake detection algorithm compares consecutive sentence pairs; when it identifies a speaker repeating a line to correct a mistake, it automatically trims out the bad attempt and keeps only the pristine final take."
    },
    {
      q: "Do I need complex DAW audio editing software like Audacity, Adobe Audition, or Pro Tools?",
      a: "No audio editing skills or software downloads are required. Traditional audio editing forces you to zoom in on raw waveforms, cut individual mouth clicks and dead silences, and adjust equalizer channels—taking 3+ hours per episode. Itnavideo cleans and masters long audio in under 15 seconds."
    },
    {
      q: "What audio file formats are supported for upload and export?",
      a: "Upload raw MP3, WAV, M4A, or AAC files up to 10 minutes long. Export pristine 24-bit studio WAV or high-bitrate 320kbps MP3 audio along with the full clean text transcript."
    },
    {
      q: "Does it remove room echo and background HVAC noise?",
      a: "Yes! The AI mastering pipeline applies dynamic noise gating, de-reverb, and a podcast warmth EQ curve to give home-recorded microphones a professional broadcast studio sound."
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
    name: 'Itnavideo AI Studio Audio Cleaner',
    operatingSystem: 'Web-based App',
    applicationCategory: 'MultimediaApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Clean long voiceover recordings automatically: trim sentence retakes, remove dead silences, and master audio to broadcast quality.',
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
              href="/dashboard?videoType=ai-audio-cleaner"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-purple-500/25 transition hover:brightness-110 active:scale-95"
            >
              <Sparkles size={16} />
              <span>Clean Audio Now</span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-amber-500/20 via-purple-600/20 to-pink-500/20 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 mb-6">
            <Mic size={14} className="text-amber-400" />
            <span>AI Studio Audio Cleaner • Auto Cut Retakes &amp; 24-bit Studio Master</span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1] max-w-5xl mx-auto">
            Clean Raw Voiceover Recordings &amp;{' '}
            <span className="bg-gradient-to-r from-amber-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Auto Cut Sentence Retakes
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed font-medium max-w-3xl mx-auto">
            Stop spending hours in Audacity deleting bad takes line by line. Upload raw voiceover audio—AI displays your full script, cuts 30+ sentence retakes, removes dead silences, and masters sound to broadcast standards in 15 seconds.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard?videoType=ai-audio-cleaner"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 via-purple-600 to-pink-500 px-8 py-4 text-base font-black text-white shadow-xl shadow-amber-500/20 transition hover:brightness-110 active:scale-95"
            >
              <Play size={18} className="fill-white" />
              <span>Clean Audio Free</span>
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
              <span>Automatic Retake &amp; Mistake Cutting</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>24-bit Lossless Studio WAV Export</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Broadcast Warmth EQ &amp; De-Reverb</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Full Interactive Script Review</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: THE AUDIO EDITING BOTTLENECK */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#0A0F1D]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase text-amber-300">
                <Flame size={14} />
                <span>The Podcaster &amp; Creator Editing Pain</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Why Voiceover Audio Editing Takes 3x Longer Than Recording
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                When recording a 15-minute voiceover for a YouTube video or podcast, nobody speaks perfectly from start to finish. You stumble over difficult words, cough, pause to drink water, and repeat sentences 2 or 3 times until you hit the right vocal delivery.
              </p>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Manually opening Audacity, zooming into audio waveforms, finding every bad take, and deleting dead silences takes up to 3 hours per episode.
              </p>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                The <strong className="text-amber-400 font-semibold">Itnavideo AI Studio Audio Cleaner</strong> solves this instantly. Upload your raw audio file—Groq Whisper transcribes the recording, detects repeated sentence attempts, trims out mistakes, and delivers studio-mastered audio ready for publication.
              </p>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-[#0E1526] p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Scissors size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">31+ Retakes Cut Automatically</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Speech AI detects repeated sentence attempts and trims bad takes in 1 click.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1526] p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Waves size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Podcast Warmth Equalizer</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Enhances low-end vocal resonance and removes room echo for radio warmth.
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
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">Clean Your Voiceover Recordings Free</h2>
          <p className="text-slate-300 text-lg mb-8">Cut mistakes and master audio in under 15 seconds.</p>
          <Link
            href="/dashboard?videoType=ai-audio-cleaner"
            className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 via-purple-600 to-pink-500 px-8 py-4 text-base font-black text-white shadow-xl shadow-purple-500/25 transition hover:brightness-110"
          >
            <Sparkles size={18} />
            <span>Clean Audio Free</span>
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
