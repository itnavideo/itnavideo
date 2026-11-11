'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Columns,
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
  Laptop,
} from 'lucide-react';
import ExploreMoreVideoTools from '@/components/landing/ExploreMoreVideoTools';

export default function SplitScreenExplainerDetail() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    {
      q: 'What is a Split Screen Explainer Video, and why is it effective for short-form content?',
      a: 'A Split Screen Explainer Video divides the 9:16 vertical viewport into two synchronized interactive panels: typically a presenter or creator webcam on the top or bottom half, and a live software demo, PDF document, mobile app screencast, or reaction footage on the other half. It allows viewers to connect with the speaker’s human facial expressions while simultaneously understanding visual proof and data points.',
    },
    {
      q: 'How does Itnavideo synchronize presenter speech with the companion demo screen?',
      a: 'Our AI speech intelligence transcribes your voiceover with millisecond accuracy, detects key demonstration milestones, and synchronizes the audio track across both panels. As you say "Look at this metric" or "Here is the code block", the companion panel can highlight or pan smoothly to the exact area of interest.',
    },
    {
      q: 'What media formats can I upload for the two split screen panels?',
      a: 'You can upload video recordings (MP4, MOV, WEBM) or high-resolution images (PNG, JPG) for either panel. For example, you can pair a talking head webcam clip with a screencast video, a mobile app recording, a financial chart, or a presentation slide.',
    },
    {
      q: 'What is the duration limit and credit pricing for Split Screen Explainers?',
      a: 'Split Screen Explainer videos follow our transparent short-form standard: strictly 1 Credit per render (1080×1920 30 FPS Full HD vertical MP4). Media files longer than 90 seconds are automatically accepted; our system seamlessly extracts the first 90 seconds (0:00 to 1:30) for cloud rendering.',
    },
    {
      q: 'Does it include word-highlighted animated captions?',
      a: 'Yes! High-contrast, word-synced animated subtitles are placed within social media safe zones, ensuring your captions are completely readable without obscuring either the presenter or the demonstration footage.',
    },
    {
      q: 'Can I customize border dividers, brand colors, and panel ratios?',
      a: 'Yes. In the studio, you can adjust panel splits (50/50 equal split, 60/40 presenter focus, or 40/60 demo focus), add glowing neon divider lines, choose brand accent colors, and toggle subtle background music.',
    },
    {
      q: 'Can I monetize these videos on TikTok, Instagram Reels, and YouTube Shorts?',
      a: 'Absolutely. You retain 100% full commercial rights to all generated videos. There are zero watermarks, and all background assets are fully cleared for social media monetization and commercial ad spend.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-500 selection:text-white">
      {/* ─── 1. HERO SECTION ─── */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 border-b border-slate-100 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,87,34,0.08),rgba(255,255,255,0))]" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
            Create Multi-Frame{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000]">
              Split Screen Explainer Videos
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Combine talking-head camera recordings with software screencasts, product demos, or reaction footage in a synchronized 9:16 vertical layout with animated subtitles and brand borders.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard/split-screen-explainer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-8 py-4 text-base font-black text-white shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:brightness-110 active:scale-95 transition-all duration-200"
            >
              <Columns size={18} className="fill-white stroke-white" />
              <span>Create Split Explainer Free</span>
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
              Dual-Panel Synchronization
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              Animated Word Subtitles
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              Presenter & Demo Ratios
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              9:16 Vertical 1080p MP4
            </span>
          </div>
        </div>
      </section>

      {/* ─── 2. WHAT IS SPLIT SCREEN EXPLAINER ─── */}
      <section className="py-16 sm:py-24 border-b border-slate-100 bg-slate-50/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                The Most Engaging Format for SaaS Demos & Tutorials
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                When explaining software features, coding walkthroughs, or physical products, showing only a screen recording feels impersonal and dry. Conversely, showing only a talking head forces viewers to imagine what you are describing.
              </p>
              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                The <strong>Split Screen Explainer Video</strong> unites both perspectives in one synchronized frame. Your audience sees your genuine emotion and vocal passion while simultaneously following your mouse cursor, code editor, or product demonstration in real-time.
              </p>
              <div className="mt-8 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-[#FF5722] shrink-0 mt-0.5">
                    <Check size={14} />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-slate-700">
                    <strong>Zero Track Layering Hassle:</strong> No tedious scaling, cropping, or positioning keyframes in Premiere Pro. Itnavideo auto-formats both panels into vertical 9:16 perfection.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-[#FF5722] shrink-0 mt-0.5">
                    <Check size={14} />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-slate-700">
                    <strong>Smart Dynamic Focus:</strong> Subtle pulsing border accents draw the viewer’s eye between speaker and screen as the narrative develops.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-[#FF5722] shrink-0 mt-0.5">
                    <Check size={14} />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-slate-700">
                    <strong>Subtitles That Never Collide:</strong> Centered captions sit right on the dividing line with calibrated contrast backdrops.
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BarChart3 className="text-[#FF5722]" size={20} />
                Traditional Multi-Track Editing vs. Itnavideo Split Studio
              </h3>
              <div className="space-y-4 text-sm">
                <div className="rounded-xl border border-red-100 bg-red-50/50 p-4">
                  <div className="font-bold text-red-900 flex items-center gap-2 mb-1">
                    <X size={16} className="text-red-500" />
                    Manual Multi-Track Video Editing
                  </div>
                  <ul className="list-disc list-inside text-red-700 text-xs sm:text-sm space-y-1 mt-2">
                    <li>Hours spent aligning two asynchronous video tracks and audio waveforms</li>
                    <li>Manual cropping and mask adjustments that stretch or distort UI elements</li>
                    <li>Inconsistent subtitle placement covering either the speaker or the UI demo</li>
                    <li>Heavy rendering lag when compositing dual 4K/1080p source streams</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                  <div className="font-bold text-emerald-900 flex items-center gap-2 mb-1">
                    <Check size={16} className="text-emerald-600" />
                    Itnavideo Split Screen Explainer
                  </div>
                  <ul className="list-disc list-inside text-emerald-700 text-xs sm:text-sm space-y-1 mt-2">
                    <li>Instant cloud layout assembly in under 45 seconds</li>
                    <li>Intelligent content-aware fitting preserves UI readability without stretching</li>
                    <li>Subtitles placed strictly inside safe zone divider strips</li>
                    <li>1 Credit flat pricing per 9:16 vertical render</li>
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
            Create a Split Explainer in 3 Steps
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Produce high-converting split-screen tutorials and product showcases without complex timeline editing.
          </p>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722] font-black text-lg mb-5">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Upload Speaker & Demo</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Upload your talking-head camera recording along with your screen capture, software recording, or reference image. Long files are supported; the first 90 seconds are automatically used.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722] font-black text-lg mb-5">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Configure Split Layout</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Choose top/bottom or dual-panel arrangements, select divider line style (clean slate, glowing orange, or neon mint), and pick your caption font preset.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722] font-black text-lg mb-5">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Download Ready Reel</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our cloud engine renders your final video in crisp 1080×1920 30 FPS MP4 format, perfectly optimized for Instagram Reels, TikTok, and YouTube Shorts.
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
              Engineered for Clarity and Conversion
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              Everything you need to deliver high-impact technical demonstrations and educational walkthroughs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#FF5722] mb-4">
                <Columns size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Dynamic Split Screen Layouts</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Choose between 50/50 balanced splits, 60/40 presenter dominance, or 40/60 demo dominance tailored to your narrative focus.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4">
                <Type size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Synchronized Subtitle Strip</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                High-contrast captions position neatly along the divider line, ensuring both screens stay 100% visible and uncluttered.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4">
                <Laptop size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Screencast Clarity Preservation</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                High-bitrate cloud processing preserves fine text, code syntax, and small UI buttons on recorded screen panels.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mb-4">
                <Layers size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Custom Border Aesthetics</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Personalize divider lines with studio slate borders, vibrant orange gradients, or glowing neon accents that match your brand.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 mb-4">
                <Zap size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Audio Track Leveling</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Intelligently balances microphone audio with system screencast audio, eliminating sudden volume spikes or muffled narration.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4">
                <Smartphone size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Native Vertical 9:16 Optimization</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Designed specifically for mobile viewport viewing habits, ensuring critical information remains within thumb safe areas.
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
              Perfect for High-Signal Educational Content
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              Deliver actionable knowledge where viewers need to see both the instructor and the workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-slate-200 p-6 sm:p-8 bg-white shadow-xs">
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Award className="text-[#FF5722]" size={20} />
                SaaS Founders & Developer Advocates
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Showcase new feature releases, terminal commands, or dashboard shortcuts. Connect with your technical audience by showing your live reaction alongside actual software workflows.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6 sm:p-8 bg-white shadow-xs">
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <FileText className="text-[#FF5722]" size={20} />
                Educators & Tutorial Creators
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Teach design tricks in Figma, formula walkthroughs in Excel, or code debugging in VS Code. Students understand complex steps faster when seeing instructor prompts synchronized to the screen.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6 sm:p-8 bg-white shadow-xs">
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Flame className="text-[#FF5722]" size={20} />
                Reaction & Commentary Channels
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                React to trending news articles, corporate keynote speeches, or industry controversies. The split view keeps your live facial reactions front and center alongside the source material.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6 sm:p-8 bg-white shadow-xs">
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <BarChart3 className="text-[#FF5722]" size={20} />
                Financial Analysts & Crypto Researchers
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Walk through trading charts, quarterly earnings reports, or market breakdowns. Explain intricate financial patterns with total visual clarity on mobile devices.
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
            Build Engaging Split Screen Videos in Minutes
          </h2>
          <p className="text-slate-600 text-base max-w-xl mx-auto mb-8">
            Pair your talking-head camera with live screencasts, apps, or slides with automatic subtitle synchronization.
          </p>
          <Link
            href="/dashboard/split-screen-explainer"
            className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-8 py-4 text-base font-black text-white shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:brightness-110 active:scale-95 transition-all duration-200"
          >
            <Columns size={18} className="fill-white stroke-white" />
            <span>Open Split Screen Explainer Studio</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ─── 8. EXPLORE ALL 14 OTHER VIDEO TOOLS ─── */}
      <ExploreMoreVideoTools currentToolId="splitScreen" />
    </div>
  );
}

