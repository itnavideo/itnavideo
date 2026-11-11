'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
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
  ZoomIn,
  Volume2,
  Scissors,
  Check,
  X,
  Smartphone,
  Smile,
} from 'lucide-react';
import ExploreMoreVideoTools from '@/components/landing/ExploreMoreVideoTools';

export default function AiShortsPolisherDetail() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    {
      q: 'What is the AI Shorts Polisher, and how does it make vertical videos go viral?',
      a: 'The AI Shorts Polisher turns raw, single-take vertical camera recordings into high-converting Instagram Reels, YouTube Shorts, and TikToks. The algorithm algorithmically increases viewer retention through instant animated karaoke subtitles, rapid camera punch-in zooms, kinetic emojis, retention sound effects (whooshes, dings, pops), and automatic silence trimming.',
    },
    {
      q: 'Can I upload videos longer than 90 seconds?',
      a: 'Yes! In accordance with Itnavideo’s universal upload standard, videos of any length (1 minute, 2 minutes, 3 minutes) are accepted without rejection. Our system automatically extracts the first 90 seconds (0:00 to 1:30) for cloud transcription, timeline pacing, and vertical 9:16 rendering.',
    },
    {
      q: 'How does the AI determine active-word highlights and animated captions?',
      a: 'Groq Whisper cloud transcription timestamps every spoken syllable to the millisecond. Our Remotion rendering engine dynamically applies active-word color highlights (such as Sunset Yellow, Emerald Mint, or Neon Orange) at the exact split-second the word is spoken, creating the popular MrBeast and Alex Hormozi caption style.',
    },
    {
      q: 'What is the credit cost for an AI Shorts Polisher video?',
      a: 'Every 9:16 vertical short video (up to 90 seconds, 1080×1920 at 30 FPS Full HD MP4) costs strictly 1 Credit. There are no watermark fees or forced monthly lock-in subscriptions.',
    },
    {
      q: 'Does it automatically remove silent pauses and awkward hesitations?',
      a: 'Yes. Our smart speech filter identifies pauses longer than 350 milliseconds and trims dead air automatically without causing harsh audio clipping or video stutter.',
    },
    {
      q: 'Does it support English and Hinglish audio?',
      a: 'Yes! Whether your vertical video is recorded in natural English or conversational Hinglish, our speech intelligence transcribes every word accurately into clean Roman script with zero garbled characters.',
    },
    {
      q: 'Can I choose different subtitle animations and emoji styles?',
      a: 'Yes. In the studio, you can select from classic Hormozi bold subtitles, modern clean TikTok minimalist typography, colorful glowing neon badges, and toggle automatic contextual emoji inserts.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-500 selection:text-white">
      {/* ─── 1. HERO SECTION ─── */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 border-b border-slate-100 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,87,34,0.08),rgba(255,255,255,0))]" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
            Turn Raw Phone Videos into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000]">
              Viral Reels & Shorts
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Boost watch time by 300% on Instagram Reels, YouTube Shorts, and TikTok. Itnavideo automatically adds dynamic zoom cuts, animated karaoke captions, kinetic emojis, and sound effects to your vertical videos.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard/ai-shorts-polisher"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-8 py-4 text-base font-black text-white shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:brightness-110 active:scale-95 transition-all duration-200"
            >
              <Zap size={18} className="fill-white stroke-white" />
              <span>Polish Vertical Short Free</span>
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
              Animated Karaoke Subtitles
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              Dynamic Zoom Punch-Ins
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              Auto Silence Trimmer
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              9:16 Vertical 1080p MP4
            </span>
          </div>
        </div>
      </section>

      {/* ─── 2. WHAT IS AI SHORTS POLISHER ─── */}
      <section className="py-16 sm:py-24 border-b border-slate-100 bg-slate-50/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Why 90% of Raw Phone Videos Get Swiped Away
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                On TikTok and Instagram Reels, you have less than 1.5 seconds to hook a viewer before they swipe down. If your video starts with a breath pause, has no visual movement, or lacks animated text, viewer drop-off is immediate.
              </p>
              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                The <strong>AI Shorts Polisher</strong> transforms ordinary smartphone selfie clips into studio-produced viral short-form assets. It automatically trims your initial inhale, zooms the camera right into your face on your hook statement, pops up high-contrast animated subtitles, and layers punchy audio sound effects.
              </p>
              <div className="mt-8 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-[#FF5722] shrink-0 mt-0.5">
                    <Check size={14} />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-slate-700">
                    <strong>Hormozi-Style Captions:</strong> Words highlight in vibrant yellow and green with kinetic spring animations as you speak them.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-[#FF5722] shrink-0 mt-0.5">
                    <Check size={14} />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-slate-700">
                    <strong>Auto Zoom Beats:</strong> Digital push-ins alternate every 3 to 5 seconds to reset visual boredom.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-[#FF5722] shrink-0 mt-0.5">
                    <Check size={14} />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-slate-700">
                    <strong>Pop Sound Effects:</strong> Subtle audio swooshes and dings emphasize your most important points.
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BarChart3 className="text-[#FF5722]" size={20} />
                Raw Mobile Recording vs. Itnavideo Shorts Polisher
              </h3>
              <div className="space-y-4 text-sm">
                <div className="rounded-xl border border-red-100 bg-red-50/50 p-4">
                  <div className="font-bold text-red-900 flex items-center gap-2 mb-1">
                    <X size={16} className="text-red-500" />
                    Unedited Raw Video
                  </div>
                  <ul className="list-disc list-inside text-red-700 text-xs sm:text-sm space-y-1 mt-2">
                    <li>35% average watch time; viewers swipe away within 3 seconds</li>
                    <li>Awkward breathing pauses and hesitant silences between thoughts</li>
                    <li>No subtitles; inaudible to 85% of mobile users browsing on mute</li>
                    <li>Monotonous static camera angle creates visual fatigue</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                  <div className="font-bold text-emerald-900 flex items-center gap-2 mb-1">
                    <Check size={16} className="text-emerald-600" />
                    Itnavideo AI Shorts Polisher
                  </div>
                  <ul className="list-disc list-inside text-emerald-700 text-xs sm:text-sm space-y-1 mt-2">
                    <li>75%+ completion rate and repeatable algorithmic recommendation</li>
                    <li>Zero dead air — fast, punchy pacing from first millisecond to last</li>
                    <li>Word-highlighted karaoke captions readable on any phone screen</li>
                    <li>Dynamic zoom punch-ins maintain constant viewer dopamine</li>
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
            Polish Any Short in 3 Simple Steps
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Zero complex mobile video editing apps or timeline keyframing. Drop your video and let the AI do the heavy lifting.
          </p>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722] font-black text-lg mb-5">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Upload Vertical Video</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Drop your selfie recording, podcast excerpt, or vertical clip (MP4, MOV). Any duration is supported; the first 90 seconds are automatically trimmed and processed.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722] font-black text-lg mb-5">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Choose Caption Preset</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Select your favorite subtitle aesthetic: bold Hormozi yellow, clean white minimalist, neon green glow, or multi-color word bounce with auto emojis.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722] font-black text-lg mb-5">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Export 1080p MP4</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Render in under 45 seconds via cloud processing. Download your Full HD 9:16 vertical video ready to post directly to Instagram, TikTok, and YouTube Shorts.
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
              Designed for Short-Form Viral Mechanics
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              Every feature is tuned to maximize algorithmic watch time, save rates, and audience shares.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#FF5722] mb-4">
                <Type size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Karaoke Word Synchronization</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Millisecond-precise word timing highlights each word precisely when spoken for hypnotic, effortless reading comprehension.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4">
                <ZoomIn size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Cadenced Digital Zoom Punch-Ins</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Switches between 1.0x wide and 1.15x close-up framing at natural conversational pivots to eliminate visual monotony.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4">
                <Scissors size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Automated Silence Trimming</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Cuts breath sounds and silent thinking pauses automatically so the pacing feels rapid, crisp, and high-energy.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mb-4">
                <Smile size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Kinetic Emojis & Icon Pops</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Contextual animated emojis pop up over key nouns and emotive reactions to catch the eye of fast-scrolling mobile users.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 mb-4">
                <Volume2 size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">SFX Sound Effect Accents</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Adds subtle whoosh, mouse-click, bell, and pop audio cues on subtitle transitions to keep headphone listeners fully engaged.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4">
                <Smartphone size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Mobile Safe Zone Margins</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Captions and visual elements are strictly positioned inside TikTok and Reels UI safe zones, ensuring likes, comments, and captions never cover your text.
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
              Built for Fast-Paced Short-Form Creators
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              Eliminate the friction between recording an idea and publishing it to thousands of viewers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-slate-200 p-6 sm:p-8 bg-white shadow-xs">
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Award className="text-[#FF5722]" size={20} />
                Daily TikTok & Reels Creators
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Record 3 to 5 quick thoughts on your phone in the morning. Run them through the AI Shorts Polisher to add subtitles and zoom cuts in minutes, and maintain a consistent daily posting streak without burnout.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6 sm:p-8 bg-white shadow-xs">
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Flame className="text-[#FF5722]" size={20} />
                Fitness, Life & Business Coaches
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Deliver authoritative advice and rapid tips. High-contrast karaoke captions highlight key action items, ensuring viewers grasp your message even with muted phone volume at work or transit.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6 sm:p-8 bg-white shadow-xs">
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <BarChart3 className="text-[#FF5722]" size={20} />
                E-Commerce Brands & Founders
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Turn unboxing clips, founder stories, and customer reviews into high-converting organic Reels and paid Spark Ads with punchy on-screen motion and sound accents.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6 sm:p-8 bg-white shadow-xs">
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <FileText className="text-[#FF5722]" size={20} />
                Agency Social Media Managers
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Batch-process clients raw phone footage into polished, brand-aligned short-form content in seconds, scaling client deliverables without hiring extra video editors.
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
            Turn Your Next Phone Clip into a Viral Short
          </h2>
          <p className="text-slate-600 text-base max-w-xl mx-auto mb-8">
            Upload your vertical video and see animated subtitles, zoom cuts, and sound effects applied in 45 seconds.
          </p>
          <Link
            href="/dashboard/ai-shorts-polisher"
            className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-8 py-4 text-base font-black text-white shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:brightness-110 active:scale-95 transition-all duration-200"
          >
            <Zap size={18} className="fill-white stroke-white" />
            <span>Open AI Shorts Polisher Studio</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ─── 8. EXPLORE ALL 14 OTHER VIDEO TOOLS ─── */}
      <ExploreMoreVideoTools currentToolId="aiShortsPolisher" />
    </div>
  );
}

