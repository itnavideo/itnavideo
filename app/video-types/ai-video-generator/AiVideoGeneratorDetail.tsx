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
  Play,
  FileText,
  Sliders,
  ChevronDown,
  BarChart3,
  Flame,
  Type,
  ShieldCheck,
  Award,
  Layers,
  Monitor,
  Smartphone,
  Check,
  X,
  Volume2,
  Tv,
} from 'lucide-react';
import ExploreMoreVideoTools from '@/components/landing/ExploreMoreVideoTools';

export default function AiVideoGeneratorDetail() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    {
      q: 'What is the Itnavideo AI Video Generator, and how does it create complete videos from scratch?',
      a: 'The AI Video Generator transforms raw voiceover audio recordings, talking-head videos, or text scripts into complete 16:9 widescreen YouTube videos and 9:16 vertical shorts. Our AI director transcribes speech with millisecond precision, organizes your content into thematic narrative scenes, pairs each scene with cinematic stock visuals and motion graphics, ducks background music automatically, and renders a 1080p Full HD MP4.',
    },
    {
      q: 'Can I generate both 16:9 widescreen YouTube videos and 9:16 vertical Shorts?',
      a: 'Yes! The AI Video Generator supports both 16:9 horizontal landscape (1920×1080) for long-form YouTube channels and desktop websites, as well as 9:16 vertical portrait (1080×1920) for Instagram Reels, YouTube Shorts, and TikTok.',
    },
    {
      q: 'Do I need my own footage, or does the AI provide visuals and music?',
      a: 'You do not need to provide any visuals. Itnavideo includes a vast cloud library of high-definition royalty-free stock videos, motion graphics, and background music tracks. The AI matches visuals dynamically based on your spoken words and semantic intent.',
    },
    {
      q: 'What is the credit pricing for the AI Video Generator?',
      a: 'For 16:9 widescreen long-form videos (up to 5 minutes / 300 seconds), pricing follows our transparent rule: strictly 1 Min = 1 Credit (1m = 1 credit, 2m = 2 credits, 3m = 3 credits, 4m = 4 credits, up to 5m = 5 credits max). For 9:16 vertical shorts (up to 90 seconds), each video costs strictly 1 Credit.',
    },
    {
      q: 'Can I edit the generated script and scene assets before rendering?',
      a: 'Yes. Before finalizing your render, the interactive studio provides a real-time script review and scene timeline preview where you can modify captions, swap B-roll visual clips, adjust music volume, and change typography presets.',
    },
    {
      q: 'Does it support multi-language speech or Hinglish audio?',
      a: 'Yes. Our Groq Whisper transcription engine flawlessly supports clear English as well as colloquial Hinglish spoken audio, rendering clean Roman script subtitles without garbled characters.',
    },
    {
      q: 'Can I monetize videos created with the AI Video Generator on YouTube?',
      a: 'Yes! All videos rendered on Itnavideo carry full commercial usage rights. All stock clips, fonts, sound effects, and musical tracks are fully cleared for YouTube AdSense monetization, sponsored brand campaigns, and commercial client work.',
    },
    {
      q: 'How does the AI Video Generator ensure viewer retention does not drop during long explanations?',
      a: 'Long videos suffer when the visual presentation remains static for more than 5 seconds. Our AI visual pacing director monitors speech cadences and automatically cuts to fresh stock B-roll clips, motion typography transitions, or visual graphics every 3 to 6 seconds. This rhythm sustains viewer dopamine levels, dramatically improving watch time metrics and algorithmic distribution on YouTube.',
    },
    {
      q: 'How fast does cloud rendering take compared to local video software on a laptop?',
      a: 'Traditional desktop software like Premiere Pro or After Effects requires heavy CPU and GPU rendering that can take 30 to 60 minutes for a 5-minute 1080p video while causing laptops to overheat. Itnavideo executes rendering in the cloud across high-speed parallel workers, delivering your finished Full HD 1080p MP4 in just 60 to 90 seconds without putting any strain on your computer hardware.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-500 selection:text-white">
      {/* ─── 1. HERO SECTION ─── */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 border-b border-slate-100 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,87,34,0.08),rgba(255,255,255,0))]" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
            Turn Voiceovers & Scripts into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000]">
              Cinematic AI Videos
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Generate complete 16:9 YouTube videos and 9:16 vertical shorts from your voice or text scripts. Automated stock B-roll matching, kinetic typography, auto-ducked music, and 1080p cloud rendering in under 2 minutes.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard/ai-video-generator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-8 py-4 text-base font-black text-white shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:brightness-110 active:scale-95 transition-all duration-200"
            >
              <Film size={18} className="fill-white stroke-white" />
              <span>Create AI Video Free</span>
              <ArrowRight size={18} />
            </Link>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-4 text-base font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
            >
              <Play size={16} className="text-slate-500" />
              <span>See How It Works</span>
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold text-slate-500">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              Automated Stock B-Roll Matching
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              Word-Synced Animated Subtitles
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              16:9 Landscape & 9:16 Vertical
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              1080p Full HD Cloud Export
            </span>
          </div>
        </div>
      </section>

      {/* ─── 2. WHAT IS AI VIDEO GENERATOR ─── */}
      <section className="py-16 sm:py-24 border-b border-slate-100 bg-slate-50/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                From Raw Script to Finished Video Without Video Editing Software
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                Producing an engaging video traditionally takes 12 to 20 hours: writing a script, recording audio, finding dozens of stock clips on paid libraries, matching visual cuts to sentence timing, mixing background music, and keyframing subtitles.
              </p>
              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                The <strong>Itnavideo AI Video Generator</strong> automates this entire post-production pipeline in the cloud. It listens to your spoken narration, extracts key visual concepts, paces video cuts dynamically to speech tempo, and delivers television-grade 1080p MP4 exports in minutes.
              </p>
              <div className="mt-8 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-[#FF5722] shrink-0 mt-0.5">
                    <Check size={14} />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-slate-700">
                    <strong>Semantic Visual Matching:</strong> AI analyzes sentence semantics to choose high-resolution B-roll that authentically reinforces your point.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-[#FF5722] shrink-0 mt-0.5">
                    <Check size={14} />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-slate-700">
                    <strong>Cinematic Camera Motion:</strong> Applies smooth pan and zoom curves so still and moving visuals blend seamlessly together.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-[#FF5722] shrink-0 mt-0.5">
                    <Check size={14} />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-slate-700">
                    <strong>Smart Audio Ducking:</strong> Background audio tracks duck smoothly whenever speech is active, maintaining broadcast audio clarity.
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BarChart3 className="text-[#FF5722]" size={20} />
                Traditional Video Creation vs. Itnavideo AI Generator
              </h3>
              <div className="space-y-4 text-sm">
                <div className="rounded-xl border border-red-100 bg-red-50/50 p-4">
                  <div className="font-bold text-red-900 flex items-center gap-2 mb-1">
                    <X size={16} className="text-red-500" />
                    Traditional Agency / Manual Workflow
                  </div>
                  <ul className="list-disc list-inside text-red-700 text-xs sm:text-sm space-y-1 mt-2">
                    <li>$500 to $2,000 per video from editing agencies or freelancers</li>
                    <li>Turnaround times spanning 3 to 7 business days per draft</li>
                    <li>Multiple subscription costs for stock footage, fonts, and music</li>
                    <li>Steep learning curves and high-end GPU computer requirements</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                  <div className="font-bold text-emerald-900 flex items-center gap-2 mb-1">
                    <Check size={16} className="text-emerald-600" />
                    Itnavideo AI Video Generator
                  </div>
                  <ul className="list-disc list-inside text-emerald-700 text-xs sm:text-sm space-y-1 mt-2">
                    <li>Flat credit pricing: 1 Min = 1 Credit (16:9) or 1 Credit (9:16)</li>
                    <li>Complete finished video delivered in under 2 minutes</li>
                    <li>Curated stock footage, typography, and music included at zero extra cost</li>
                    <li>100% cloud-based; runs smoothly in any standard web browser</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. HOW IT WORKS WORKFLOW ─── */}
      <section id="how-it-works" className="py-16 sm:py-24 border-b border-slate-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Create High-Quality Videos in 3 Easy Steps
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            From an initial audio track or script to a publication-ready MP4 file ready for YouTube, courses, and social channels.
          </p>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722] font-black text-lg mb-5">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Upload Audio or Script</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Upload your voiceover recording (MP3, WAV) or paste your written script. The AI transcribes the audio and breaks the narrative into distinct visual scene beats.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722] font-black text-lg mb-5">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Select Visual Style & Aspect Ratio</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Choose 16:9 widescreen for YouTube or 9:16 vertical for Shorts. Select your typography theme, subtitle color highlights, and background music vibe.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722] font-black text-lg mb-5">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Instant Cloud Render</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our distributed cloud rendering engine generates your 1080p Full HD MP4 in minutes. Download immediately with full commercial monetization rights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. CORE FEATURES & CAPABILITIES ─── */}
      <section className="py-16 sm:py-24 border-b border-slate-100 bg-slate-50/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Complete Production Studio in the Cloud
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              Packed with specialized creative controls built for modern video publishing workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#FF5722] mb-4">
                <Film size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Automated Scene Structuring</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                AI detects natural story pauses and cuts scenes every 3 to 6 seconds to keep audience retention high and eliminate visual boredom.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4">
                <Type size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Kinetic Animated Subtitles</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Burned-in word-synced captions with active-word color highlights ensure 100% message retention for viewers watching on mute.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4">
                <Layers size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">High-Definition Stock Library</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Curated library of cinematic 1080p clips covering technology, business, wellness, education, and lifestyle scenarios.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mb-4">
                <Volume2 size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Intelligent Audio Ducking</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Automatically adjusts background music volume so spoken narration is always crisp, clear, and easy to understand.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 mb-4">
                <Tv size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Dual Aspect Ratio Support</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Render in 16:9 landscape for YouTube long-form, or switch to 9:16 vertical for TikTok, Instagram Reels, and Shorts.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4">
                <ShieldCheck size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">100% Commercial Monetization Rights</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                All generated media assets, music, and subtitles are fully cleared for YouTube AdSense, client deliverables, and commercial ads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. WHO IS IT FOR / USE CASES ─── */}
      <section className="py-16 sm:py-24 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Built for High-Velocity Content Creators & Businesses
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              Scale your video output without increasing headcount or spending thousands on editing agencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-slate-200 p-6 sm:p-8 bg-white shadow-xs">
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Award className="text-[#FF5722]" size={20} />
                YouTube Automation & Faceless Creators
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Produce daily documentary explainers, history deep-dives, business case studies, and motivational essays with automated B-roll and kinetic subtitles in minutes.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6 sm:p-8 bg-white shadow-xs">
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <FileText className="text-[#FF5722]" size={20} />
                Course Creators & Digital Educators
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Convert audio lecture notes and curriculum scripts into visual educational modules. Keep students engaged with dynamic visual scene changes and clear on-screen terminology.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6 sm:p-8 bg-white shadow-xs">
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <BarChart3 className="text-[#FF5722]" size={20} />
                SaaS Companies & Growth Marketers
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Generate high-converting product explainers, feature release teasers, and customer case study summaries for landing pages, social advertising, and email newsletters.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6 sm:p-8 bg-white shadow-xs">
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Flame className="text-[#FF5722]" size={20} />
                Agencies & Freelance Media Managers
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Scale your client video deliverables 10x without hiring additional editors. Deliver polished 1080p MP4 videos across multiple accounts at a fraction of traditional production costs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. FAQ ACCORDION ─── */}
      <section className="py-16 sm:py-24 border-b border-slate-100 bg-slate-50/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqData.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-left transition cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-bold text-slate-900 pr-4">{faq.q}</span>
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-transform ${
                        isOpen ? 'rotate-180 bg-orange-100 text-[#FF5722]' : ''
                      }`}
                    >
                      <ChevronDown size={16} />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 7. BOTTOM CONVERSION CTA ─── */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-orange-50 via-amber-50/50 to-orange-50/80 text-center">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
            Create Your First AI Video in 2 Minutes
          </h2>
          <p className="text-slate-600 text-base max-w-xl mx-auto mb-8">
            Upload your audio or paste your script to experience automated scene planning, stock visual matching, and subtitles.
          </p>
          <Link
            href="/dashboard/ai-video-generator"
            className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-8 py-4 text-base font-black text-white shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:brightness-110 active:scale-95 transition-all duration-200"
          >
            <Film size={18} className="fill-white stroke-white" />
            <span>Open AI Video Generator Studio</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ─── 8. EXPLORE ALL 14 OTHER VIDEO TOOLS ─── */}
      <ExploreMoreVideoTools currentToolId="aiVideoGenerator" />
    </div>
  );
}
