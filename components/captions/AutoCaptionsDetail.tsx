'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Play,
  CheckCircle2,
  ArrowRight,
  Clock,
  ShieldCheck,
  Zap,
  BarChart3,
  Users,
  FileText,
  Briefcase,
  Tv,
  ChevronDown,
  Monitor,
  Type,
  Sliders,
  Smartphone,
  Eye,
  Check,
  X,
} from 'lucide-react';
import VideoBeforeAfterCard from './VideoBeforeAfterCard';
import WhiteStairLiveDemoSection from './WhiteStairLiveDemoSection';

export const CAPTION_PAIRS = [
  {
    id: 'doctor',
    label: 'Doctor / Healthcare',
    description: 'Medical explainer with technical terms — clean professional captions',
    beforeSrc: '/videos/auto-captions/doctor-before.mp4',
    afterSrc: '/videos/auto-captions/doctor-after.mp4',
    accentColor: '#0284c7',
  },
  {
    id: 'content-creator',
    label: 'Content Creator',
    description: 'Talking-head creator reel with bold karaoke-style captions',
    beforeSrc: '/videos/auto-captions/content-creator-before.mp4',
    afterSrc: '/videos/auto-captions/content-creator-after.mp4',
    accentColor: '#16a34a',
  },
  {
    id: 'professional-creator',
    label: 'Corporate Presenter',
    description: 'Polished business presenter with studio-clean subtitle style',
    beforeSrc: '/videos/auto-captions/professional-creator-before.mp4',
    afterSrc: '/videos/auto-captions/professional-creator-after.mp4',
    accentColor: '#7c3aed',
  },
  {
    id: 'professional-creator-girl',
    label: 'Coach & Educator',
    description: 'Presenter coaching content with active word highlight captions',
    beforeSrc: '/videos/auto-captions/professional-creator-girl-before.mp4',
    afterSrc: '/videos/auto-captions/professional-creator-girl-after.mp4',
    accentColor: '#db2777',
  },
  {
    id: 'real-estate-advisor',
    label: 'Real Estate Advisor',
    description: 'Property consultant — bold captions that stay readable on busy backgrounds',
    beforeSrc: '/videos/auto-captions/real-estate-advisor-before.mp4',
    afterSrc: '/videos/auto-captions/real-estate-advisor-after.mp4',
    accentColor: '#d97706',
  },
  {
    id: 'traveler',
    label: 'Travel & Lifestyle',
    description: 'Outdoor creator with fast speech — accurate word-level sync',
    beforeSrc: '/videos/auto-captions/traveler-before.mp4',
    afterSrc: '/videos/auto-captions/traveler-after.mp4',
    accentColor: '#059669',
  },
] as const;

export default function AutoCaptionsDetail() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    {
      q: "Why are animated video captions essential for Instagram Reels and YouTube Shorts?",
      a: "Over 85% of social media videos are watched with sound muted in public transit, offices, and late-night scrolling. Adding auto captions ensures viewers immediately understand your hook and narrative without needing sound, doubling average watch time and preventing swipe-away bounces."
    },
    {
      q: "How does the AI Auto Caption Generator transcribe speech with sub-second accuracy?",
      a: "Groq Whisper cloud transcription timestamps every spoken word to the exact millisecond. It calculates the start and end frame for each syllable, allowing our rendering engine to apply real-time karaoke active-word highlights with zero lag."
    },
    {
      q: "How many credits does an Auto Caption Reel cost?",
      a: "Every 9:16 vertical caption reel (up to 90 seconds, 1080x1920 30 FPS MP4) costs strictly 1 credit. There are zero subscription lock-ins or watermark fees."
    },
    {
      q: "Can I customize the caption positions, font sizes, and highlight colors?",
      a: "Yes. You can choose from over 15+ curated subtitle presets (including bold viral bounce, neon glow, minimal clean, and high-contrast backdrops), adjust active word highlight colors (yellow, green, cyan, pink), and set positioning to Top, Center, or Lower-Third."
    },
    {
      q: "Does Itnavideo support Hinglish (Roman script Hindi) and fast conversational dialogue?",
      a: "Yes. Our transcription model is specifically trained on conversational accents, Hinglish (Roman script Hindi), and rapid speech, ensuring technical jargon and colloquial expressions are transcribed clearly without errors."
    },
    {
      q: "Do I need complex video editing software like Premiere Pro or CapCut?",
      a: "No software downloads or editing skills are needed. Everything happens in your web browser. Simply upload your video or audio recording, pick your preferred caption style, and export a crisp 1080p MP4 file in under 30 seconds."
    },
    {
      q: "What video formats and aspect ratios are supported?",
      a: "Itnavideo supports MP4, MOV, WEBM, MP3, WAV, and M4A uploads for 9:16 vertical short-form reels (Instagram Reels, YouTube Shorts, TikTok)."
    },
    {
      q: "Will adding captions increase my video's organic reach and engagement?",
      a: "Yes. Social media algorithms prioritize videos with high completion rates and long watch times. Captions make your videos accessible to deaf and hard-of-hearing viewers, non-native speakers, and silent scrollers, driving higher retention signals."
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
    name: 'Itnavideo AI Auto Caption Generator',
    operatingSystem: 'Web-based App',
    applicationCategory: 'MultimediaApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Generate word-synced animated captions for Instagram Reels, YouTube Shorts, and videos automatically with AI.',
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
            Add Animated Karaoke Subtitles In Seconds, Not Hours
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal max-w-3xl mx-auto">
            Stop typing video captions manually. Transform talking-head recordings, podcast clips, and social media reels with word-synced animated subtitles that double watch time and hold viewer attention.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard?videoType=auto-caption-generator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-slate-900 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition active:scale-95"
            >
              <Play size={18} className="fill-white" />
              <span>Add Captions Free</span>
            </Link>
            <a
              href="#gallery"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition"
            >
              <Eye size={18} className="text-amber-600" />
              <span>See Before &amp; After Examples</span>
            </a>
          </div>

          {/* Quick trust metrics */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs sm:text-sm font-medium text-slate-500 border-t border-slate-100 pt-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Sub-Second Word Sync</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>15+ Viral Caption Styles</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Roman Hinglish &amp; Accent Trained</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Strictly 1 Credit (1080p 9:16)</span>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE INTERACTIVE DEMO STAIR SECTION */}
      <section className="py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Interactive Subtitle Style Engine
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              Test how karaoke highlights, backing boxes, and kinetic animations look across different creator formats.
            </p>
          </div>
          <WhiteStairLiveDemoSection />
        </div>
      </section>

      {/* BEFORE / AFTER COMPARISON GALLERY */}
      <section id="gallery" className="py-20 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Real-World Before &amp; After Showcase
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              Compare plain uncaptioned videos with Itnavideo animated karaoke captions across diverse creator niches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CAPTION_PAIRS.map((pair) => (
              <VideoBeforeAfterCard key={pair.id} pair={pair} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 1: 6 BOTTLENECKS SOLVED */}
      <section className="py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              6 Video Captioning Bottlenecks Solved
            </h2>
            <p className="mt-4 text-slate-600 text-base sm:text-lg">
              Manual subtitle keyframing is agonizing. Here is how Itnavideo makes it effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100 mb-5">
                <Clock size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Zero Manual Typing</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Listening line-by-line, pausing every 3 seconds, and fixing typos takes 45 to 60 minutes for a 1-minute reel in Premiere Pro.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Groq Whisper transcribes speech in under 10 seconds.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 mb-5">
                <Type size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Millisecond Word Sync</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Dragging text boundaries on timelines causes awkward delays where words stay on screen too long or vanish prematurely.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Exact timestamping locks active word highlights to vocal audio.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 mb-5">
                <Smartphone size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">High Mobile Contrast</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Plain white subtitles blend into bright shirts or white walls, becoming completely illegible to viewers on small phone screens.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> High-contrast backing boxes and neon highlights ensure 100% legibility.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100 mb-5">
                <Sliders size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Platform Safe Zones</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Captions placed carelessly get covered by Instagram and TikTok buttons (Like, Share, Comment, Audio Disc).
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Top, Center, and Lower-Third safe zone positioning protects readability.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100 mb-5">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Roman Hinglish Trained</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Generic speech engines fail on regional Indian accents and conversational Hinglish, producing nonsensical spelling errors.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Clean Roman script Hinglish and accent accuracy.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 mb-5">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Strictly 1 Credit</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Third-party tools charge $30/month subscriptions and slap watermarks on free accounts.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Strictly 1 credit per 9:16 reel in 1080p full HD.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: 3-STEP WORKFLOW */}
      <section className="py-20 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              How It Works in 3 Simple Steps
            </h2>
            <p className="mt-4 text-slate-600 text-base sm:text-lg">
              Add viral animated captions to your videos in under 30 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-3xl font-extrabold text-amber-600 block mb-3">01</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Video or Audio</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Drop your talking-head reel, podcast clip, or voiceover recording (MP4, MOV, WAV, MP3).
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                ✓ Groq Whisper transcription
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-3xl font-extrabold text-indigo-600 block mb-3">02</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Pick Caption Style</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Choose from 15+ viral presets, customize active word highlight colors, and set vertical positioning.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                ✓ 15+ animated presets
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-3xl font-extrabold text-emerald-600 block mb-3">03</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Export 1080p Video</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Download a crisp 1080p 9:16 vertical MP4 with burned-in animated subtitles, ready to publish on Reels and Shorts.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                ✓ Strictly 1 Credit • Cloud Render in ~25s
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: COMPARISON TABLE */}
      <section className="py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              Manual Subtitling vs. Itnavideo Auto Caption Generator
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              Why top content creators automate their short-form subtitle workflow.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-5 text-xs font-bold uppercase text-slate-600">Feature</th>
                  <th className="p-5 text-xs font-bold uppercase text-rose-600">Manual Video Editing</th>
                  <th className="p-5 text-xs font-bold uppercase text-emerald-700 bg-emerald-50/60">Itnavideo Auto Caption Generator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Captioning Time per Reel</td>
                  <td className="p-5 text-slate-600">45 to 60 minutes</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Under 25 seconds</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Word-Sync Accuracy</td>
                  <td className="p-5 text-slate-600">Manual timeline razor slicing</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Sub-second speech timestamp synchronization</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Karaoke Word Highlights</td>
                  <td className="p-5 text-slate-600">Requires tedious After Effects expressions</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">15+ pre-built karaoke animations</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Accent &amp; Hinglish Support</td>
                  <td className="p-5 text-slate-600">Generic models make frequent spelling errors</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Optimized for conversational Roman Hinglish</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Cost per Reel</td>
                  <td className="p-5 text-slate-600">$20 – $40 expensive plugin subscription</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Strictly 1 Credit per video</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 4: FAQ ACCORDION */}
      <section className="py-20 border-b border-slate-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
            <p className="mt-3 text-slate-600 text-base">Everything you need to know about AI Auto Captions.</p>
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
            Add Animated Captions to Your Videos Today
          </h2>
          <p className="text-slate-300 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of creators publishing high-retention video reels with word-synced subtitles in seconds.
          </p>
          <Link
            href="/dashboard?videoType=auto-caption-generator"
            className="inline-flex items-center gap-2.5 rounded-xl bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-xl hover:bg-slate-100 transition active:scale-95"
          >
            <Sparkles size={18} className="text-amber-600" />
            <span>Add Captions to My Video Free</span>
          </Link>
          <div className="mt-4 text-xs text-slate-400">
            Strictly 1 Credit per Video (1080p 9:16) • No Credit Card Required
          </div>
        </div>
      </section>
    </div>
  );
}