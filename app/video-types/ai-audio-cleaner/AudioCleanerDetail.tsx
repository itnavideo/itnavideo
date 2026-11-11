'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ExploreMoreVideoTools from '@/components/landing/ExploreMoreVideoTools';
import {
  Sparkles,
  ArrowRight,
  Mic,
  Zap,
  CheckCircle2,
  Clock,
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
  ShieldCheck,
  Award,
  Layers,
  Headphones,
  Check,
  X,
} from 'lucide-react';

export default function AudioCleanerDetail() {
  const [activeView, setActiveView] = useState<'raw' | 'cleaned' | 'master' | 'transcript'>('cleaned');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    {
      q: "What is the AI Studio Audio Cleaner?",
      a: "The AI Studio Audio Cleaner is an intelligent voice utility that transcribes raw recordings, automatically cuts dead silences greater than 300ms, trims repeated sentence mistakes and retakes, eliminates room echo, and masters vocal audio to 24-bit broadcast standards (-14 LUFS) in 15 seconds."
    },
    {
      q: "What is the 300ms Strict Silence Cutting Standard?",
      a: "Our speech engine identifies every pause or dead-air space exceeding 300 milliseconds (0.30s) across the entire recording. It trims the gap down to a natural 100-millisecond breath pause, producing tight, engaging speech that keeps audience retention high."
    },
    {
      q: "How does the AI detect and trim sentence retakes automatically?",
      a: "Groq Whisper transcribes your voice track with word-level timestamps. Our retake detection algorithm analyzes consecutive sentence pairs; when it identifies a speaker repeating a line to correct a stumble ('let me re-say that', mistried words), it automatically cuts out the bad attempt and preserves the clean final delivery."
    },
    {
      q: "How many credits does the AI Audio Cleaner cost?",
      a: "Cleaning and mastering any voiceover recording up to 5 full minutes (300 seconds) costs strictly 1 credit. There are zero extra charges for 24-bit WAV export or full script transcription."
    },
    {
      q: "Do I need complex DAW software like Audacity, Adobe Audition, or Pro Tools?",
      a: "Zero audio editing skills or software downloads are required. Traditional audio editing forces you to zoom in on raw waveforms, cut individual mouth clicks, and adjust EQ compressors manually—taking 2 to 3 hours per episode. Itnavideo cleans your audio in under 15 seconds."
    },
    {
      q: "Can I review and edit the cuts before downloading?",
      a: "Yes. Our interactive transcript viewer displays every cut in strikethrough red text. You can click any word to listen to its playback and restore any line with a single click."
    },
    {
      q: "Does it remove room echo and background noise?",
      a: "Yes. The AI mastering pipeline applies dynamic noise gating, de-reverb, and a podcast warmth EQ curve to give home-recorded microphones a warm, radio-grade broadcast tone."
    },
    {
      q: "What audio file formats are supported for upload and download?",
      a: "You can upload MP3, WAV, M4A, or AAC audio files up to 5 minutes long. You can download pristine 24-bit studio WAV or high-bitrate 320kbps MP3 audio along with the clean text transcript."
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
    description: 'Clean raw voiceover recordings automatically: 300ms silence trimming, auto sentence retake cutting, and 24-bit studio broadcast mastering.',
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 border-b border-slate-100 bg-gradient-to-b from-slate-50/70 via-white to-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl leading-[1.1] max-w-5xl mx-auto">
            Clean Raw Voiceover Recordings &amp; Auto Cut Sentence Retakes
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal max-w-3xl mx-auto">
            Stop spending hours in Audacity deleting bad takes line by line. Upload raw voiceover audio—AI displays your full script, cuts dead silences over 300ms, trims repeated sentence mistakes, and masters sound to broadcast standards in 15 seconds.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard?videoType=ai-audio-cleaner"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-slate-900 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition active:scale-95"
            >
              <Play size={18} className="fill-white" />
              <span>Clean Audio Free</span>
            </Link>
            <a
              href="#audio-studio"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition"
            >
              <Waves size={18} className="text-amber-600" />
              <span>Explore Waveform Studio</span>
            </a>
          </div>

          {/* Quick trust metrics */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs sm:text-sm font-medium text-slate-500 border-t border-slate-100 pt-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Fast 300ms Silence Trimming</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Automatic Retake &amp; Mistake Cutting</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Broadcast Warmth EQ &amp; De-Reverb</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Strictly 1 Credit (Up to 5m)</span>
            </div>
          </div>
        </div>
      </section>

      {/* AUDIO STUDIO INTERACTIVE */}
      <section id="audio-studio" className="py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Interactive Waveform &amp; Script Inspector
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              See how the 300ms silence threshold and automatic sentence retake detection polish raw vocal recordings.
            </p>
          </div>

          <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl shadow-slate-200/50">
            {/* View Selector Tabs */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
              {[
                { id: 'cleaned', label: '✂️ 300ms Silence Cut', desc: 'Dead air trimmed' },
                { id: 'raw', label: '🎙️ Raw Input (With Pauses)', desc: 'Mistakes & gaps' },
                { id: 'master', label: '📻 Broadcast EQ Master', desc: '-14 LUFS warm vocals' },
                { id: 'transcript', label: '📝 Script Review', desc: 'Interactive word text' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition ${
                    activeView === tab.id
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Audio Studio Screen */}
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6 sm:p-8 text-white shadow-2xl space-y-6">
              {/* Header metrics */}
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-4 gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="font-semibold text-white">voiceover_take_01.wav</span>
                </div>
                <div className="flex items-center gap-4 font-mono">
                  <span>Threshold: 300ms</span>
                  <span>Master: -14 LUFS</span>
                  <span className="text-emerald-400">Time Saved: 42%</span>
                </div>
              </div>

              {/* View 1: 300ms Silence Cut */}
              {activeView === 'cleaned' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-amber-400">⚡ Tight Retention Audio (Pauses &gt; 300ms trimmed to 100ms)</span>
                    <span className="text-slate-400">Duration: 01:04 → 00:44 (-20s cut)</span>
                  </div>
                  {/* Clean waveform */}
                  <div className="h-28 rounded-xl bg-slate-900 border border-slate-800 p-4 flex items-center justify-center gap-1">
                    {[40, 75, 90, 60, 85, 30, 20, 95, 80, 50, 85, 70, 30, 20, 90, 100, 65, 85, 40].map((h, i) => (
                      <div
                        key={i}
                        className={`w-2 rounded-full transition-all ${
                          i === 5 || i === 6 || i === 12 || i === 13
                            ? 'bg-emerald-500/80 h-4'
                            : 'bg-gradient-to-t from-amber-500 to-amber-400'
                        }`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300">
                    Dead air and awkward pauses between sentences were eliminated down to comfortable 100ms breath spaces, dramatically increasing short-form and podcast listener retention.
                  </p>
                </div>
              )}

              {/* View 2: Raw Input (With Pauses) */}
              {activeView === 'raw' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-rose-400">⚠️ Unedited Voiceover (Large Dead Air &amp; Hesitations)</span>
                    <span className="text-slate-400">Duration: 01:04</span>
                  </div>
                  {/* Raw waveform with red gaps */}
                  <div className="h-28 rounded-xl bg-slate-900 border border-slate-800 p-4 flex items-center justify-center gap-1">
                    {[40, 75, 90, 60, 5, 5, 5, 5, 95, 80, 50, 5, 5, 5, 5, 90, 100, 65, 40].map((h, i) => (
                      <div
                        key={i}
                        className={`w-2 rounded-full ${
                          h === 5 ? 'bg-rose-500/60 animate-pulse' : 'bg-slate-600'
                        }`}
                        style={{ height: `${h === 5 ? 15 : h}%` }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-rose-300/90">
                    Highlighted red areas indicate dead silences exceeding 300ms where the speaker paused to breathe, read notes, or hesitate.
                  </p>
                </div>
              )}

              {/* View 3: Broadcast EQ Master */}
              {activeView === 'master' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-emerald-400">✨ Broadcast Mastering (-14 LUFS • De-Reverb • Warmth EQ)</span>
                    <span className="text-slate-400">24-bit Studio WAV</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">De-Reverb</span>
                      <strong className="text-sm text-emerald-400 font-bold">-18dB Echo Cut</strong>
                    </div>
                    <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Warmth Proximity</span>
                      <strong className="text-sm text-amber-400 font-bold">+3.2dB @ 120Hz</strong>
                    </div>
                    <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Broadcast Loudness</span>
                      <strong className="text-sm text-cyan-400 font-bold">-14.1 LUFS</strong>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300">
                    Dynamic noise gate and vocal compression deliver the deep, intimate sound of high-end Shure SM7B studio microphones.
                  </p>
                </div>
              )}

              {/* View 4: Transcript Review */}
              {activeView === 'transcript' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-cyan-400">📝 Interactive Transcript &amp; Retake Detector</span>
                    <span className="text-slate-400">Groq Whisper Transcription</span>
                  </div>
                  <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 text-xs sm:text-sm leading-relaxed space-y-2">
                    <p className="text-slate-400 line-through decoration-rose-500 decoration-2">
                      "In this video, I will show you... wait, let me start over... in this video, I will show you how to..."
                    </p>
                    <p className="text-white font-medium">
                      "In this video, I will show you how to automate your entire video workflow in under 60 seconds without complex editing."
                    </p>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Red strikethrough lines represent automatically detected false starts trimmed from your final audio.
                  </div>
                </div>
              )}

              {/* Studio Footer */}
              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 size={14} />
                  <span>Cloud Processing Done in ~12s</span>
                </div>
                <span>Strictly 1 Credit per Audio File</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: THE AUDIO EDITING PAIN */}
      <section className="py-20 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Why Voiceover Audio Editing Takes 3x Longer Than Recording
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                When recording voiceovers for a YouTube video, podcast, or online course, nobody speaks flawlessly. You stumble over tricky words, pause to read your script, drink water, and repeat lines until you nail the right tone.
              </p>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                Opening Audacity or Adobe Audition, zooming into raw waveforms, finding every mistake take, and deleting dead silences takes hours of tedious manual scrubbing.
              </p>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                The <strong className="text-amber-600 font-semibold">Itnavideo AI Studio Audio Cleaner</strong> automates this completely. Upload raw audio—our cloud engine identifies pauses over 300ms, trims repeated sentence mistakes, and masters sound to broadcast standards in 15 seconds.
              </p>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                    <Scissors size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Automatic Retake Trimming</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Speech AI detects repeated sentence attempts and automatically cuts bad takes, preserving only your best final line.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <Waves size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">300ms Silence Standard</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Trims every pause longer than 300ms down to a natural 100ms breath, creating punchy, high-retention narration.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <Zap size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Strictly 1 Credit</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Clean any voice recording up to 5 minutes (300 seconds) for strictly 1 credit, with lossless 24-bit studio WAV export.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: 6 CORE CAPABILITIES */}
      <section className="py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              6 Built-In Studio Audio Capabilities
            </h2>
            <p className="mt-4 text-slate-600 text-base sm:text-lg">
              Everything needed to turn rough room voiceovers into broadcast-mastered podcast audio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100 mb-5">
                <Clock size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">300ms Silence Trimming</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Identifies every dead silence &gt; 300ms and trims it down to 100ms, eliminating awkward hesitation gaps.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Calibrated for viral creator pacing.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100 mb-5">
                <Scissors size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Sentence Retake Cutting</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Compares consecutive sentences to find stumbles, cutting repeated mistakes and leaving only the pristine final attempt.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Zero manual razor slicing.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 mb-5">
                <Radio size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">De-Reverb &amp; Echo Cut</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Removes hollow room reflections and slapback echoes from untreated bedrooms and home office setups.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Professional dry vocal tone.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 mb-5">
                <Waves size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Podcast Warmth EQ</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Enhances low-end chest resonance (120Hz) while taming harsh sibilance for intimate radio presence.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Radio-grade voice depth.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100 mb-5">
                <FileText size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Interactive Script Review</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Review the full transcribed text. Click any word to hear audio playback, or toggle cuts back on if desired.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Full creative control.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 mb-5">
                <Headphones size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">24-bit Studio WAV Export</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Export lossless 48kHz / 24-bit WAV or high-bitrate 320kbps MP3 audio normalized to YouTube/Spotify standards (-14 LUFS).
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Strictly 1 Credit per audio file.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: STEP BY STEP WORKFLOW */}
      <section className="py-20 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              How It Works in 3 Simple Steps
            </h2>
            <p className="mt-4 text-slate-600 text-base sm:text-lg">
              Clean and master raw audio recordings in under 15 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-3xl font-extrabold text-amber-600 block mb-3">01</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Raw Audio</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Drop your raw voiceover file (MP3, WAV, M4A up to 5 min). Groq Whisper transcribes speech with word timestamps in seconds.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                ✓ Auto transcription &amp; pause detection
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-3xl font-extrabold text-indigo-600 block mb-3">02</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Auto Cut Retakes &amp; Gaps</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  The engine trims all dead air over 300ms down to 100ms and cuts repeated sentence mistakes automatically.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                ✓ Interactive script review included
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-3xl font-extrabold text-emerald-600 block mb-3">03</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Export Studio Master</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Download broadcast-mastered 24-bit WAV or 320kbps MP3 audio (-14 LUFS) ready for podcasts and video editors.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                ✓ Strictly 1 Credit • Processed in ~15s
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: COMPARISON TABLE */}
      <section className="py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              Manual DAW Editing vs. Itnavideo AI Studio Audio Cleaner
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              Why podcasters and voiceover creators eliminate hours of waveform editing.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-5 text-xs font-bold uppercase text-slate-600">Feature</th>
                  <th className="p-5 text-xs font-bold uppercase text-rose-600">Manual Audacity / Audition</th>
                  <th className="p-5 text-xs font-bold uppercase text-emerald-700 bg-emerald-50/60">Itnavideo AI Studio Audio Cleaner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Editing Time per Episode</td>
                  <td className="p-5 text-slate-600">2 to 3 hours of waveform scrubbing</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Under 15 seconds</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Silence Trimming Precision</td>
                  <td className="p-5 text-slate-600">Manual slice &amp; ripple delete per pause</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Strict 300ms threshold auto-trimmed to 100ms</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Retake &amp; Mistake Detection</td>
                  <td className="p-5 text-slate-600">Requires listening to every repeated line</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Auto sentence comparison cuts bad takes</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Broadcast Mastering (-14 LUFS)</td>
                  <td className="p-5 text-slate-600">Complex multi-band compressors &amp; limiters</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Built-in warmth EQ, de-reverb, &amp; normalization</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Cost per Episode</td>
                  <td className="p-5 text-slate-600">$50 – $120 audio engineer fee</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Strictly 1 Credit (Up to 5m)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 5: FAQ ACCORDION */}
      <section className="py-20 border-b border-slate-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
            <p className="mt-3 text-slate-600 text-base">Everything you need to know about AI Audio Cleaning.</p>
          </div>

          <div className="space-y-3">
            {faqData.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                  >
                    <span className="text-base font-bold text-slate-900 pr-4">{faq.q}</span>
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-transform ${isOpen ? 'rotate-180 bg-slate-900 text-white' : ''}`}>
                      <ChevronDown size={16} />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOTTOM ACTION CTA */}
      <section className="py-20 bg-slate-900 text-center text-white">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Clean Your Voiceover Recordings Free
          </h2>
          <p className="text-slate-300 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Cut mistakes, remove silences over 300ms, and master audio to broadcast quality in under 15 seconds.
          </p>
          <Link
            href="/dashboard?videoType=ai-audio-cleaner"
            className="inline-flex items-center gap-2.5 rounded-xl bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-xl hover:bg-slate-100 transition active:scale-95"
          >
            <Sparkles size={18} className="text-amber-600" />
            <span>Clean Audio Free</span>
          </Link>
          <div className="mt-4 text-xs text-slate-400">
            Strictly 1 Credit per Audio File (Up to 5m) • No Credit Card Required
          </div>
        </div>
      </section>

      {/* EXPLORE ALL 14 OTHER VIDEO TOOLS */}
      <ExploreMoreVideoTools currentToolId="audioClean" />
    </div>
  );
}