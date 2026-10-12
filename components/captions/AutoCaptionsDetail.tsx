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
  HelpCircle,
  Briefcase,
  Tv,
  ChevronDown,
  Monitor,
  Wand2,
  Film,
  Award,
  Type,
  VolumeX,
  Eye,
  Sliders,
  Smartphone,
  Globe,
} from 'lucide-react';
import VideoBeforeAfterCard from './VideoBeforeAfterCard';

export const CAPTION_PAIRS = [
  {
    id: 'doctor',
    label: 'Doctor / Healthcare',
    description: 'Medical explainer with technical terms — clean professional captions',
    beforeSrc: '/videos/auto-captions/doctor-before.mp4',
    afterSrc: '/videos/auto-captions/doctor-after.mp4',
    accentColor: '#38BDF8',
  },
  {
    id: 'content-creator',
    label: 'Content Creator',
    description: 'Talking-head creator reel with bold karaoke-style captions',
    beforeSrc: '/videos/auto-captions/content-creator-before.mp4',
    afterSrc: '/videos/auto-captions/content-creator-after.mp4',
    accentColor: '#22C55E',
  },
  {
    id: 'professional-creator',
    label: 'Professional / Corporate',
    description: 'Polished business presenter with studio-clean subtitle style',
    beforeSrc: '/videos/auto-captions/professional-creator-before.mp4',
    afterSrc: '/videos/auto-captions/professional-creator-after.mp4',
    accentColor: '#A78BFA',
  },
  {
    id: 'professional-creator-girl',
    label: 'Coach / Educator',
    description: 'Female presenter coaching content with highlight captions',
    beforeSrc: '/videos/auto-captions/professional-creator-girl-before.mp4',
    afterSrc: '/videos/auto-captions/professional-creator-girl-after.mp4',
    accentColor: '#F472B6',
  },
  {
    id: 'real-estate-advisor',
    label: 'Real Estate Advisor',
    description: 'Property consultant — bold captions that stay readable on busy backgrounds',
    beforeSrc: '/videos/auto-captions/real-estate-advisor-before.mp4',
    afterSrc: '/videos/auto-captions/real-estate-advisor-after.mp4',
    accentColor: '#F59E0B',
  },
  {
    id: 'traveler',
    label: 'Travel / Lifestyle',
    description: 'Outdoor creator with fast speech — accurate word-level sync',
    beforeSrc: '/videos/auto-captions/traveler-before.mp4',
    afterSrc: '/videos/auto-captions/traveler-after.mp4',
    accentColor: '#34D399',
  },
] as const;

export default function AutoCaptionsDetail() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    {
      q: "Why are video captions essential for Instagram Reels and YouTube Shorts?",
      a: "Over 85% of social media videos are watched on mute or in noise-sensitive environments like public transit, open offices, and late-night scrolling. Adding auto captions ensures viewers immediately understand your hook and narrative without needing sound, increasing watch time and reducing swipe-away rates."
    },
    {
      q: "How does the AI Auto Caption Generator transcribe speech with sub-second accuracy?",
      a: "Our speech recognition engine transcribes audio with word-level timestamping. It calculates the exact start and end times for every spoken word, allowing our rendering engine to apply real-time karaoke active-word highlights as you speak."
    },
    {
      q: "Can I customize the caption positions, font sizes, and highlight colors?",
      a: "Yes! You can choose from over 15+ curated subtitle presets (including bold viral bounce, neon glow, minimal clean, and high-contrast backdrops), adjust active word highlight colors (yellow, green, cyan, pink), and set positioning to Top, Center, or Lower-Third."
    },
    {
      q: "Does Itnavideo support Hinglish (Roman script Hindi) and fast dialogue?",
      a: "Yes. Our transcription model is specifically trained on Indian accents, Hinglish (Roman script Hindi), and rapid conversational speech, ensuring technical jargon and conversational phrasing are transcribed clearly without awkward errors."
    },
    {
      q: "Do I need complex video editing software like Premiere Pro or CapCut?",
      a: "No software downloads or editing skills are needed. Everything happens in your web browser. Simply upload your video or audio recording, pick your preferred caption style, and export a crisp 1080p MP4 file in under 30 seconds."
    },
    {
      q: "What video formats and aspect ratios are supported?",
      a: "Itnavideo supports MP4, MOV, WEBM, MP3, WAV, and M4A uploads across 9:16 Vertical (Reels, Shorts, TikTok) and 16:9 Widescreen (YouTube, LinkedIn, Web) aspect ratios."
    },
    {
      q: "Will adding captions increase my video's organic reach and engagement?",
      a: "Yes. Social media algorithms prioritize videos with high completion rates and long watch times. Captions make your videos accessible to deaf and hard-of-hearing viewers, non-native speakers, and silent scrollers, driving higher retention signals."
    }
  ];

  // Structured Schema for Google Rich Snippets
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
    <div className="min-h-screen bg-[#070B14] text-slate-100 font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      {/* Top Header Navigation */}
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
            <Link href="/use-cases" className="hover:text-purple-400 transition">Use Cases</Link>
            <Link href="/pricing" className="hover:text-purple-400 transition">Pricing</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden sm:inline-flex text-sm font-bold text-slate-300 hover:text-white transition"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard?videoType=auto-caption-generator"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-purple-500/25 transition hover:brightness-110 active:scale-95"
            >
              <Sparkles size={16} />
              <span>Add Captions Free</span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Glow ambient effects */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-emerald-600/15 via-purple-600/20 to-pink-500/15 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Kicker Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 mb-6">
            <Sparkles size={14} className="text-emerald-400" />
            <span>AI Auto Caption Generator • Instagram Reels, Shorts &amp; Videos</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1] max-w-5xl mx-auto">
            Add Animated Karaoke Subtitles{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              In Seconds, Not Hours
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed font-medium max-w-3xl mx-auto">
            Stop typing video captions manually. Transform talking-head recordings, podcast clips, and social media reels with word-synced animated subtitles that double watch time and hold viewer attention.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard?videoType=auto-caption-generator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-purple-600 to-pink-500 px-8 py-4 text-base font-black text-white shadow-xl shadow-emerald-500/20 transition hover:brightness-110 active:scale-95"
            >
              <Play size={18} className="fill-white" />
              <span>Add Captions to My Video Free</span>
            </Link>
            <a
              href="#gallery"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#0E1526] px-8 py-4 text-base font-bold text-slate-200 hover:bg-[#152038] hover:border-purple-500/30 transition"
            >
              <Eye size={18} className="text-purple-400" />
              <span>See Before &amp; After Examples</span>
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs sm:text-sm font-semibold text-slate-400 border-t border-white/10 pt-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>0% Manual Typing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Word-Level Karaoke Sync</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>15+ Viral Caption Styles</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>English &amp; Hinglish Accents</span>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE BEFORE & AFTER GALLERY SHOWCASE */}
      <section id="gallery" className="py-16 sm:py-24 border-t border-white/10 bg-[#080C14] relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-bold uppercase text-purple-300 mb-4">
              <Film size={14} />
              <span>Real Output Comparisons</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              See the Difference: Raw Video vs. Auto Captions
            </h2>
            <p className="mt-3 text-slate-300 text-base sm:text-lg">
              Hover over any video pair to play synchronized audio and witness how word-synced subtitles elevate visual clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CAPTION_PAIRS.map((pair) => (
              <VideoBeforeAfterCard
                key={pair.id}
                label={pair.label}
                description={pair.description}
                beforeSrc={pair.beforeSrc}
                afterSrc={pair.afterSrc}
                accentColor={pair.accentColor}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 1: THE MUTE VIEWING PHENOMENON */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#0A0F1D]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-bold uppercase text-purple-300">
                <VolumeX size={14} />
                <span>The Silent Viewing Reality</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Why 85% of Social Media Videos Are Watched Without Sound
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Modern content consumption has changed fundamentally. Millions of users scroll through Instagram Reels, YouTube Shorts, and TikTok during commutes, open offices, classrooms, libraries, or while relaxing in bed next to a sleeping partner. In these silent environments, <strong className="text-white font-semibold">videos without captions are instantly swiped away.</strong>
              </p>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                When you add dynamic, high-contrast captions to your videos, you eliminate the barrier to entry. Viewers immediately grasp your opening hook, understand your story, and follow complex dialogue without needing to turn on their device audio.
              </p>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Studies show that adding animated captions increases <strong className="text-emerald-400 font-semibold">video completion rates by up to 80%</strong>, drives higher engagement signals to social media algorithms, and expands your audience reach to deaf, hard-of-hearing, and non-native language viewers.
              </p>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-[#0E1526] p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <BarChart3 size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">80% Higher Watch Time</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Animated word highlights act as a visual visual anchor, locking eye movement to the screen and preventing scroll fatigue.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1526] p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Globe size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Global Accessibility</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Clear subtitle overlays allow non-native English speakers to understand fast accents, technical terms, and rapid dialogue.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1526] p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                    <Zap size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Algorithm Reach Boost</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Higher watch completion rate is the #1 metric platforms use to push reels onto the Explore and Shorts feeds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE 5 MAJOR SUBTITLE BOTTLENECK PROBLEMS SOLVED */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#070B14]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Solved: The 5 Major Subtitle Bottlenecks
            </h2>
            <p className="mt-4 text-slate-300 text-base sm:text-lg">
              Manual transcription in traditional video editors is painful and time-consuming. Here is how Itnavideo makes video captioning effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Bottleneck 1 */}
            <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-8 hover:border-purple-500/40 transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-6 group-hover:scale-110 transition-transform">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">1. Manual Word-by-Word Typing</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Listening to audio line-by-line, pausing every 3 seconds, typing out dialogue, and fixing typos takes 45 to 60 minutes for a single 1-minute video reel.
              </p>
              <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 p-3 text-xs font-semibold text-purple-300">
                <strong className="text-white">Itnavideo Solution:</strong> Speech AI transcribes the entire video automatically in under 10 seconds.
              </div>
            </div>

            {/* Bottleneck 2 */}
            <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-8 hover:border-purple-500/40 transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-6 group-hover:scale-110 transition-transform">
                <Type size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">2. Word Alignment &amp; Syncing</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Dragging text boundaries on a multi-track timeline to line up with speech waveforms creates awkward delays where text stays on screen too long or disappears early.
              </p>
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs font-semibold text-emerald-300">
                <strong className="text-white">Itnavideo Solution:</strong> Millisecond-accurate timestamping aligns active word highlights precisely with human speech.
              </div>
            </div>

            {/* Bottleneck 3 */}
            <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-8 hover:border-purple-500/40 transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-400 border border-pink-500/20 mb-6 group-hover:scale-110 transition-transform">
                <Smartphone size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">3. Poor Contrast &amp; Mobile Readability</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Plain white captions blending into bright shirts, white walls, or busy background footage become invisible to viewers on mobile screens.
              </p>
              <div className="rounded-xl bg-pink-500/10 border border-pink-500/20 p-3 text-xs font-semibold text-pink-300">
                <strong className="text-white">Itnavideo Solution:</strong> High-contrast backing boxes, drop shadows, and neon highlight colors guarantee maximum legibility.
              </div>
            </div>

            {/* Bottleneck 4 */}
            <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-8 hover:border-purple-500/40 transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 mb-6 group-hover:scale-110 transition-transform">
                <Sliders size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">4. Awkward Line Breaks &amp; Safe Zones</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Long blocks of text covering the speaker's mouth or sitting too low where Instagram UI buttons (like, share, comment) cover up the words.
              </p>
              <div className="rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 p-3 text-xs font-semibold text-fuchsia-300">
                <strong className="text-white">Itnavideo Solution:</strong> Segmented positioning controls (Top, Center, Lower-Third) protect mobile UI safe zones.
              </div>
            </div>

            {/* Bottleneck 5 */}
            <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-8 hover:border-purple-500/40 transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">5. Hinglish &amp; Accent Misinterpretation</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Generic speech engines struggle with regional accents, conversational Hinglish (Roman script Hindi), and technical jargon, producing nonsensical errors.
              </p>
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs font-semibold text-amber-300">
                <strong className="text-white">Itnavideo Solution:</strong> Speech AI optimized for conversational accents and Roman Hinglish phrasing.
              </div>
            </div>

            {/* Bottleneck 6 */}
            <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-8 hover:border-purple-500/40 transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-6 group-hover:scale-110 transition-transform">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">6. Expensive Plugin Subscriptions</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Third-party captioning plugins charge $20 to $40 per month for basic text overlays while adding heavy watermarks to free renders.
              </p>
              <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/20 p-3 text-xs font-semibold text-cyan-300">
                <strong className="text-white">Itnavideo Solution:</strong> Affordable, transparent pricing with 1080p MP4 exports and full style freedom.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: CAPTION CUSTOMIZATION & STYLE CONTROL */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#0A0F1D]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-bold uppercase text-purple-300">
                <Sliders size={14} />
                <span>Full Creative Freedom</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
                Match Your Unique Brand Aesthetic
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed">
                One size does not fit all. Different video niches call for different visual styles—a doctor explaining medical research needs clean professional subtitles, while a viral creator reel needs bold, pop-in karaoke highlights.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
              <div className="rounded-3xl border border-white/10 bg-[#0E1526] p-8 space-y-4">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white text-sm font-black">1</span>
                  Karaoke Word Highlights
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Words bounce in real-time as they are spoken. Select active highlight colors like bright yellow, neon emerald, cyan glow, or hot pink to command visual attention.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#0E1526] p-8 space-y-4">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white text-sm font-black">2</span>
                  15+ Subtitle Style Presets
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Choose from bold impact headlines, sleek modern slate, glowing viral neon, classic black backdrop boxes, and minimal lower-third strips.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#0E1526] p-8 space-y-4">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-600 text-white text-sm font-black">3</span>
                  Safe-Zone Positioning Controls
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Easily toggle between Top, Center, and Lower-Third placement to ensure text never overlaps critical visual elements or social media UI buttons.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#0E1526] p-8 space-y-4">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-fuchsia-600 text-white text-sm font-black">4</span>
                  Custom Fonts &amp; Text Sizing
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Pick from high-legibility Google Fonts (Montserrat, Inter, Plus Jakarta Sans) and scale font sizes from subtle Small to ultra-bold Extra Large.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: HOW IT WORKS STEP-BY-STEP */}
      <section id="how-it-works" className="py-16 sm:py-24 border-t border-white/10 bg-[#070B14]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              How It Works: 3 Simple Steps
            </h2>
            <p className="mt-4 text-slate-300 text-base sm:text-lg">
              From raw video recording to polished captioned reel in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-8 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-4xl font-black text-emerald-400">01</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <FileText size={20} />
                  </div>
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-3">Upload Video or Audio</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Drop your MP4, MOV, or WEBM video clip, talking-head recording, or audio file into the studio dashboard.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-emerald-300 font-semibold">
                ✓ Ultra-fast cloud audio extraction
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-8 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-4xl font-black text-purple-400">02</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Wand2 size={20} />
                  </div>
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-3">AI Auto Transcription</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Speech AI transcribes speech with word-level timing, generating accurate karaoke subtitle chunks automatically.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-purple-300 font-semibold">
                ✓ Sub-second word alignment
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-8 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-4xl font-black text-pink-400">03</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                    <Smartphone size={20} />
                  </div>
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-3">Style &amp; Export 1080p</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Select your caption style preset, pick highlight colors, and render a pristine 1080p MP4 file ready to publish.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-pink-300 font-semibold">
                ✓ Render completed in ~20 seconds
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: COMPARISON TABLE */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#0A0F1D]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Traditional Editors vs. Itnavideo Auto Caption Generator
            </h2>
            <p className="mt-4 text-slate-300 text-base sm:text-lg">
              Compare manual subtitle creation against automated AI captioning.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0E1526] shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/40">
                  <th className="p-6 text-sm font-extrabold uppercase tracking-wider text-slate-400">Feature / Metric</th>
                  <th className="p-6 text-sm font-extrabold uppercase tracking-wider text-red-400">Manual Video Editors</th>
                  <th className="p-6 text-sm font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10">Itnavideo Auto Caption Generator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-sm sm:text-base">
                <tr>
                  <td className="p-6 font-bold text-white">Time per 60s Video Reel</td>
                  <td className="p-6 text-slate-300">45 to 60 minutes manual typing</td>
                  <td className="p-6 font-bold text-emerald-400 bg-emerald-500/5">Under 20 seconds total</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-white">Word-Level Karaoke Syncing</td>
                  <td className="p-6 text-slate-300">Requires keyframing individual word layers</td>
                  <td className="p-6 font-bold text-emerald-400 bg-emerald-500/5">100% Automated active-word highlights</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-white">Hinglish &amp; Accent Support</td>
                  <td className="p-6 text-slate-300">Frequent transcription errors</td>
                  <td className="p-6 font-bold text-emerald-400 bg-emerald-500/5">Optimized for Roman Hinglish &amp; accents</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-white">Preset Variety</td>
                  <td className="p-6 text-slate-300">Generic static text layers</td>
                  <td className="p-6 font-bold text-emerald-400 bg-emerald-500/5">15+ Viral animated caption styles</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-white">Software Requirements</td>
                  <td className="p-6 text-slate-300">Heavy timeline editor installation</td>
                  <td className="p-6 font-bold text-emerald-400 bg-emerald-500/5">100% Web Browser-based</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 6: MULTI-PLATFORM USE CASES */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#070B14]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Essential for Every Content Format
            </h2>
            <p className="mt-4 text-slate-300 text-base sm:text-lg">
              Drive higher retention across all short-form and long-form video platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="rounded-3xl border border-white/10 bg-[#0E1526] p-8 space-y-4 hover:border-emerald-500/30 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 font-bold text-lg">
                01
              </div>
              <h3 className="text-xl font-extrabold text-white">Instagram Reels &amp; Stories</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Capture silent scrollers with bold karaoke highlights and high-contrast text boxes that pop against busy camera backgrounds.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0E1526] p-8 space-y-4 hover:border-purple-500/30 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 font-bold text-lg">
                02
              </div>
              <h3 className="text-xl font-extrabold text-white">YouTube Shorts &amp; Long Video Clips</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Add lower-third captions to vertical clips to boost average watch duration signals and drive channel subscription growth.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0E1526] p-8 space-y-4 hover:border-pink-500/30 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-400 font-bold text-lg">
                03
              </div>
              <h3 className="text-xl font-extrabold text-white">TikTok &amp; Viral Talking-Head Videos</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Keep fast-paced conversational dialogue readable with bounce animations and dynamic active word highlights.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0E1526] p-8 space-y-4 hover:border-fuchsia-500/30 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-500/10 text-fuchsia-400 font-bold text-lg">
                04
              </div>
              <h3 className="text-xl font-extrabold text-white">Podcasts &amp; Interview Highlights</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Extract key insights from long audio recordings and publish captioned video snippets to promote full podcast episodes.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0E1526] p-8 space-y-4 hover:border-amber-500/30 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 font-bold text-lg">
                05
              </div>
              <h3 className="text-xl font-extrabold text-white">Healthcare, Real Estate &amp; Legal</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Ensure technical terminology, legal terms, and medical advice are presented with clean, professional subtitle typography.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0E1526] p-8 space-y-4 hover:border-cyan-500/30 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 font-bold text-lg">
                06
              </div>
              <h3 className="text-xl font-extrabold text-white">Course Lessons &amp; Tutorials</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Help students retain complex educational information with word-synced subtitles on desktop or mobile learning apps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: FAQ ACCORDION SECTION */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#0A0F1D]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-bold uppercase text-purple-300 mb-4">
              <HelpCircle size={14} />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-slate-300 text-base sm:text-lg">
              Everything you need to know about AI Auto Captions with Itnavideo.
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-[#0E1526] overflow-hidden transition-colors hover:border-purple-500/30"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  >
                    <span className="text-base sm:text-lg font-bold text-white pr-4">
                      {faq.q}
                    </span>
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

      {/* FINAL BOTTOM CTA BANNER */}
      <section className="relative overflow-hidden py-20 lg:py-28 border-t border-white/10 bg-gradient-to-b from-[#0A0F1D] to-[#070B14]">
        <div className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-600/20 via-purple-600/20 to-pink-500/20 blur-[100px]" />

        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase text-emerald-300 mb-6">
            <Award size={14} className="text-emerald-400" />
            <span>Ready to Double Your Video Watch Time?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Add Animated Captions to Your Videos Free
          </h2>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Join thousands of creators, educators, and brands publishing high-retention video reels with word-synced subtitles in seconds.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard?videoType=auto-caption-generator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-purple-600 to-pink-500 px-8 py-4 text-base font-black text-white shadow-xl shadow-emerald-500/20 transition hover:brightness-110 active:scale-95"
            >
              <Sparkles size={18} />
              <span>Add Captions to My Video Free</span>
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#0E1526] px-8 py-4 text-base font-bold text-slate-200 hover:bg-[#152038] transition"
            >
              <span>View Pricing Plans</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#050810] py-12 text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 text-white font-black text-xs">
              IV
            </div>
            <span className="text-sm font-bold text-white">Itnavideo</span>
            <span className="text-slate-500">© {new Date().getFullYear()} Itnavideo. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-medium">
            <Link href="/faceless-video" className="hover:text-slate-200 transition">Faceless Video</Link>
            <Link href="/privacy" className="hover:text-slate-200 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-200 transition">Terms of Service</Link>
            <Link href="/contact" className="hover:text-slate-200 transition">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
