'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Video,
  Play,
  CheckCircle2,
  ArrowRight,
  Clock,
  ShieldCheck,
  Layers,
  Zap,
  BarChart3,
  Users,
  BookOpen,
  FileText,
  Music,
  HelpCircle,
  Briefcase,
  Tv,
  Check,
  X,
  ChevronDown,
  Monitor,
  Wand2,
  Film,
  Flame,
  Award,
} from 'lucide-react';

export default function FacelessVideoDetail() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    {
      q: "What is a faceless video, and how does it help creators grow channels?",
      a: "A faceless video is a high-quality production where the creator does not appear on camera. Instead of relying on a talking head, faceless videos communicate through compelling voiceover narration, curated stock B-roll, dynamic animations, cinematic studio backgrounds, and synchronized subtitles. It helps creators publish consistently without camera anxiety, expensive lighting gear, or time-consuming filming schedules."
    },
    {
      q: "How does Itnavideo generate a 16:9 widescreen video from audio or a script?",
      a: "You simply upload your voiceover audio recording (MP3, WAV, or M4A) or paste your video script. Itnavideo transcribes the audio with word-level precision, analyzes the core themes and pacing of your narrative, matches relevant visual scenes from our high-definition stock asset library, overlays subtle Ken Burns panning animations, adds studio vignette backgrounds, ducked background music, timed sound effects, and renders a 1080p full HD widescreen video."
    },
    {
      q: "Do I need complex video editing software like Premiere Pro or DaVinci Resolve?",
      a: "Not at all. Traditional editing software requires hundreds of hours to learn timeline cuts, keyframe animations, audio ducking, and color grading. Itnavideo handles all technical editing automatically in the cloud. You get professional Vox-style documentary graphics, typography scenes, and lower-third captions with zero manual editing."
    },
    {
      q: "How much time can I save using an AI Faceless Video Generator?",
      a: "Traditional video editing for a 10-minute documentary or finance explainer takes between 8 to 15 hours of manual work—searching for stock footage, cutting clips, lining up captions, and rendering. With Itnavideo, the entire production process takes under 2 minutes. You can turn your script into a finished HD video in one sitting."
    },
    {
      q: "Is Faceless Video suitable for business owners and working professionals?",
      a: "Absolutely. Busy professionals, agency founders, and consultants often lack the time to record videos or manage production teams. Faceless videos allow businesses to convert blog posts, research reports, case studies, and training materials into engaging YouTube videos and social assets without disrupting their daily work schedule."
    },
    {
      q: "Can I customize the visual style, background themes, and captions?",
      a: "Yes. You have full control over studio background themes (such as clean white, dark obsidian, midnight slate, or brand vignettes), caption typography, font highlights, background music volume, and sound effect toggles to match your personal brand aesthetic."
    },
    {
      q: "What video aspect ratios and resolutions are supported?",
      a: "Faceless Video is optimized specifically for 16:9 Full HD Widescreen (1920x1080) for YouTube long-form content, desktop presentations, and web streaming, as well as 9:16 Vertical (1080x1920) for YouTube Shorts, Instagram Reels, and TikTok."
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
    name: 'Itnavideo AI Faceless Video Generator',
    operatingSystem: 'Web-based App',
    applicationCategory: 'MultimediaApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Transform voiceovers and scripts into 1080p 16:9 widescreen YouTube videos with curated stock B-roll, studio backgrounds, and karaoke subtitles.',
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

      {/* Top Header Banner */}
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
            <Link href="/use-cases" className="hover:text-purple-400 transition">Use Cases</Link>
            <Link href="/pricing" className="hover:text-purple-400 transition">Pricing</Link>
            <Link href="/docs" className="hover:text-purple-400 transition">Documentation</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden sm:inline-flex text-sm font-bold text-slate-300 hover:text-white transition"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard?videoType=faceless-video"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-purple-500/25 transition hover:brightness-110 active:scale-95"
            >
              <Sparkles size={16} />
              <span>Create Faceless Video</span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Glow ambient effects */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-purple-600/20 via-fuchsia-500/15 to-pink-500/10 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Kicker Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-purple-300 mb-6">
              <Sparkles size={14} className="text-purple-400" />
              <span>AI Faceless Video Generator • 16:9 Widescreen &amp; 9:16 Shorts</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1]">
              Create High-Yield YouTube Videos{' '}
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                Without Showing Your Face
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed font-medium max-w-3xl mx-auto">
              Turn your voiceovers, podcast clips, or raw scripts into complete, documentary-grade 1080p widescreen YouTube videos in under 2 minutes. No video editing experience required.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard?videoType=faceless-video"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 px-8 py-4 text-base font-black text-white shadow-xl shadow-purple-500/25 transition hover:brightness-110 active:scale-95"
              >
                <span>Start Generating Free</span>
                <ArrowRight size={18} />
              </Link>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#0E1526] px-8 py-4 text-base font-bold text-slate-200 hover:bg-[#152038] hover:border-purple-500/30 transition"
              >
                <Play size={18} className="text-purple-400 fill-purple-400/20" />
                <span>See How It Works</span>
              </a>
            </div>

            {/* Quick trust metrics */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs sm:text-sm font-semibold text-slate-400 border-t border-white/10 pt-8">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>Zero Editing Software Needed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>Auto Stock B-Roll &amp; Visuals</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>Word-Synced Karaoke Captions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>1080p HD Export</span>
              </div>
            </div>
          </div>

          {/* Video Player Preview Mockup */}
          <div className="mt-14 relative mx-auto max-w-5xl rounded-[28px] border border-white/10 bg-[#0E1526] p-3 shadow-2xl shadow-purple-900/20">
            <div className="relative aspect-video w-full overflow-hidden rounded-[20px] bg-black">
              {/* Mockup Header bar */}
              <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-5 py-3 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono font-bold text-slate-300">1920x1080 • Vox Style Documentary Scene</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3 py-1 text-[11px] font-bold text-purple-300 border border-purple-500/30">
                  <Monitor size={12} />
                  <span>16:9 Widescreen</span>
                </div>
              </div>

              {/* Dynamic Poster Image */}
              <Image
                src="https://storage.googleapis.com/itnavideo-media-assets/file_0000000089c48211b67c16fe3c2636a2_prirg0.png"
                alt="AI Faceless Video Generator 16:9 YouTube Widescreen Studio Preview"
                width={1920}
                height={1080}
                className="h-full w-full object-cover"
                priority
              />

              {/* Overlay Play Button Sheen */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] group cursor-pointer">
                <Link
                  href="/dashboard?videoType=faceless-video"
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-2xl shadow-purple-500/50 group-hover:scale-110 transition-transform"
                >
                  <Play size={32} className="ml-1 fill-white" />
                </Link>
              </div>

              {/* Mock Subtitle Strip */}
              <div className="absolute bottom-6 inset-x-0 z-20 flex justify-center px-8">
                <div className="rounded-xl bg-black/85 border border-white/10 px-6 py-2.5 text-center text-sm sm:text-base font-extrabold text-white shadow-2xl backdrop-blur-md">
                  <span className="text-yellow-400">AUTOMATED PIPELINE:</span> Generate Vox documentary videos in seconds.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: THE RISE OF FACELESS VIDEO CREATION */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#0A0F1D]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-bold uppercase text-purple-300">
                <Flame size={14} />
                <span>The Creator Economy Shift</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Why Faceless Channels Are Dominating YouTube and Social Media
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Over the past three years, a quiet revolution has taken place across YouTube, TikTok, and social media platforms. Some of the fastest-growing channels in finance, history, technology, true crime, personal development, and business analysis have one thing in common: <strong className="text-white font-semibold">the creator never shows their face on camera.</strong>
              </p>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Audiences today prioritize <strong className="text-purple-300 font-semibold">pacing, narrative clarity, engaging visual storytelling, and high-quality audio</strong> over watching someone sit behind a desk talking into a microphone. Channels like Vox, SunnyV2, MagnatesMedia, and ColdFusion have proven that cinematic B-roll, kinetic typography, and structured graphics hold viewer retention far better than traditional talking-head videos.
              </p>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                With an <strong className="text-white font-semibold">AI Faceless Video Generator</strong>, you no longer need to spend thousands of dollars on cameras, ring lights, acoustics, or professional editing teams. You can turn your knowledge, voice recordings, or researched scripts into publishing-ready videos that compete directly with major media houses.
              </p>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-[#0E1526] p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <BarChart3 size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Higher Audience Retention</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Dynamic B-roll changes every 3 to 6 seconds keep viewer attention locked, drastically lowering drop-off rates compared to static talking-head clips.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1526] p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">100% Privacy &amp; Anonymity</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Build a scalable media brand or secondary income stream without sacrificing your personal privacy or appearing publicly on camera.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1526] p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                    <Zap size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">10x Production Speed</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Produce multiple full-length 16:9 widescreen videos per week instead of spending 15 hours editing a single video file manually.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE 5 BIGGEST BOTTLENECK PROBLEMS SOLVED */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#070B14]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Solved: The 5 Major Bottlenecks Stopping You From Publishing
            </h2>
            <p className="mt-4 text-slate-300 text-base sm:text-lg">
              Creating professional long-form YouTube videos used to require complex skills and massive time commitments. Here is how Itnavideo eliminates every barrier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Bottleneck 1 */}
            <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-8 hover:border-purple-500/40 transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-6 group-hover:scale-110 transition-transform">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">1. Exhausting Production Hours</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Manual video editing in Premiere Pro or Final Cut requires cutting clips, adjusting keyframes, matching audio waveforms, and designing lower thirds—consuming 10+ hours per video.
              </p>
              <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 p-3 text-xs font-semibold text-purple-300">
                <strong className="text-white">Itnavideo Solution:</strong> Upload audio and let AI assemble the full 16:9 widescreen video in under 2 minutes.
              </div>
            </div>

            {/* Bottleneck 2 */}
            <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-8 hover:border-purple-500/40 transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 mb-6 group-hover:scale-110 transition-transform">
                <Film size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">2. Sourcing High-Quality Stock Assets</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Searching dozens of stock photography sites for relevant B-roll clips and paying expensive monthly stock subscription fees stalls creative momentum.
              </p>
              <div className="rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 p-3 text-xs font-semibold text-fuchsia-300">
                <strong className="text-white">Itnavideo Solution:</strong> Automatic semantic matching selects relevant high-definition visuals based on your narrative context.
              </div>
            </div>

            {/* Bottleneck 3 */}
            <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-8 hover:border-purple-500/40 transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-400 border border-pink-500/20 mb-6 group-hover:scale-110 transition-transform">
                <Tv size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">3. Camera Anxiety &amp; Gear Costs</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Buying 4K cameras, studio lighting, teleprompters, and microphones can easily cost over $2,000, while many creators simply dislike appearing on camera.
              </p>
              <div className="rounded-xl bg-pink-500/10 border border-pink-500/20 p-3 text-xs font-semibold text-pink-300">
                <strong className="text-white">Itnavideo Solution:</strong> 100% faceless workflow. Voice narration + AI visual direction delivers studio-quality output.
              </div>
            </div>

            {/* Bottleneck 4 */}
            <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-8 hover:border-purple-500/40 transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-6 group-hover:scale-110 transition-transform">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">4. Subtitle Alignment &amp; Typography</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Manually typing subtitles and syncing them word-by-word with audio spikes transcription costs and leads to boring, static text overlays.
              </p>
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs font-semibold text-emerald-300">
                <strong className="text-white">Itnavideo Solution:</strong> Word-synced karaoke subtitles with yellow active word highlights rendered in real-time.
              </div>
            </div>

            {/* Bottleneck 5 */}
            <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-8 hover:border-purple-500/40 transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-6 group-hover:scale-110 transition-transform">
                <Music size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">5. Audio Ducking &amp; Sound Design</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Balancing background music volume so it doesn't drown out voiceover audio or adding subtle sound effects requires advanced audio engineering skills.
              </p>
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs font-semibold text-amber-300">
                <strong className="text-white">Itnavideo Solution:</strong> Automated background music ducking lowers volume during speech and swells seamlessly during pauses.
              </div>
            </div>

            {/* Bottleneck 6 */}
            <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-8 hover:border-purple-500/40 transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-6 group-hover:scale-110 transition-transform">
                <Briefcase size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">6. Busy Work &amp; Business Schedules</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Working professionals and founders struggle to find time between client meetings, daily jobs, and operational tasks to record or edit video content.
              </p>
              <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/20 p-3 text-xs font-semibold text-cyan-300">
                <strong className="text-white">Itnavideo Solution:</strong> Record audio on your smartphone during free time, upload to Itnavideo, and publish high-converting content effortlessly.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: DESIGNED FOR WORKING PROFESSIONALS & BUSY CREATORS */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#0A0F1D]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-bold uppercase text-purple-300">
                <Users size={14} />
                <span>Empowering Busy Professionals &amp; Content Entrepreneurs</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
                Turn Ideas into Revenue-Generating Content Without Giving Up Your Day Job
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed">
                Many of the most successful digital products, YouTube channels, and educational brands are run by people with full-time careers. However, traditional video creation demands a full-time commitment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
              <div className="rounded-3xl border border-white/10 bg-[#0E1526] p-8 space-y-4">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white text-sm font-black">1</span>
                  For Full-Time Employees &amp; Side Hustlers
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  If you work 40 hours a week, spending 15 hours editing a single YouTube video on weekends quickly leads to burnout. With Itnavideo, you can dictate your ideas or script into a voice recorder app on your commute, upload the audio file in the evening, and receive a complete 1080p 16:9 widescreen video ready for upload.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#0E1526] p-8 space-y-4">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-600 text-white text-sm font-black">2</span>
                  For Agency Owners &amp; Business Consultants
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Repurpose client case studies, industry analysis reports, and blog articles into educational YouTube videos. Establishing video authority builds organic trust with potential high-ticket clients without needing a dedicated video production department.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#0E1526] p-8 space-y-4">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-fuchsia-600 text-white text-sm font-black">3</span>
                  For Educators, Podcasters &amp; Writers
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Transform audio podcast episodes or newsletter essays into visually rich video explainers. Keep your audience engaged with dynamic split-screen statistics, quote callouts, and clean studio backgrounds.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#0E1526] p-8 space-y-4">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white text-sm font-black">4</span>
                  For Niche Faceless YouTube Operators
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Scale multiple niche YouTube channels in finance, history, self-improvement, or tech. Consistent publishing schedules are the #1 key to YouTube algorithm growth—Itnavideo makes daily or weekly publishing realistic.
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
              How It Works: From Audio to 1080p Widescreen Video in 3 Simple Steps
            </h2>
            <p className="mt-4 text-slate-300 text-base sm:text-lg">
              No timelines, no keyframes, no rendering crashes. A streamlined pipeline engineered for speed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-8 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-4xl font-black text-purple-400">01</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <FileText size={20} />
                  </div>
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-3">Upload Voiceover or Script</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Drop your recorded voiceover audio file (MP3, WAV, M4A up to 20 minutes) or type in your narration script.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-purple-300 font-semibold">
                ✓ Ultra-fast Groq Whisper transcription
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-8 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-4xl font-black text-fuchsia-400">02</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">
                    <Wand2 size={20} />
                  </div>
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-3">AI Visual &amp; Scene Choreography</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Itnavideo analyzes story beats, selects matching high-definition stock B-roll, applies Ken Burns motion effects, sets up studio vignette backgrounds, and ducks background music behind narration.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-fuchsia-300 font-semibold">
                ✓ Vox documentary scenes + auto sound effects
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-8 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-4xl font-black text-pink-400">03</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                    <Video size={20} />
                  </div>
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-3">Instant Cloud Render &amp; Export</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Export full 1080p 60FPS high-definition MP4 video optimized for YouTube 16:9 widescreen or social media platforms.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-pink-300 font-semibold">
                ✓ AWS cloud rendering in under 60 seconds
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: COMPARISON TABLE - TRADITIONAL PRODUCTION VS ITNAVIDEO */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#0A0F1D]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Traditional Production vs. Itnavideo AI Faceless Pipeline
            </h2>
            <p className="mt-4 text-slate-300 text-base sm:text-lg">
              Compare manual video editing workflows against automated AI cloud rendering.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0E1526] shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/40">
                  <th className="p-6 text-sm font-extrabold uppercase tracking-wider text-slate-400">Production Metric</th>
                  <th className="p-6 text-sm font-extrabold uppercase tracking-wider text-red-400">Traditional Editing Software</th>
                  <th className="p-6 text-sm font-extrabold uppercase tracking-wider text-purple-400 bg-purple-500/10">Itnavideo AI Faceless Generator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-sm sm:text-base">
                <tr>
                  <td className="p-6 font-bold text-white">Average Editing Time (10m Video)</td>
                  <td className="p-6 text-slate-300">8 to 15 hours of timeline work</td>
                  <td className="p-6 font-bold text-emerald-400 bg-purple-500/5">Under 2 minutes total</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-white">Technical Skill Required</td>
                  <td className="p-6 text-slate-300">High (Keyframing, timeline cuts, audio mixing)</td>
                  <td className="p-6 font-bold text-emerald-400 bg-purple-500/5">Zero (Click &amp; generate)</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-white">Stock Asset Sourcing</td>
                  <td className="p-6 text-slate-300">Manual search &amp; paid monthly subscriptions</td>
                  <td className="p-6 font-bold text-emerald-400 bg-purple-500/5">Automated AI stock matching</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-white">Subtitles &amp; Captions</td>
                  <td className="p-6 text-slate-300">Manual typing or paid transcription plugins</td>
                  <td className="p-6 font-bold text-emerald-400 bg-purple-500/5">Word-synced karaoke highlights built-in</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-white">Hardware Requirements</td>
                  <td className="p-6 text-slate-300">Expensive editing PC or Mac with dedicated GPU</td>
                  <td className="p-6 font-bold text-emerald-400 bg-purple-500/5">100% Web-based (Runs in any browser)</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-white">Camera &amp; Studio Lighting</td>
                  <td className="p-6 text-slate-300">Required for talking-head formats ($1,500+)</td>
                  <td className="p-6 font-bold text-emerald-400 bg-purple-500/5">Not required ($0 gear cost)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 6: PRACTICAL USE CASES & CHANNEL NICHES */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#070B14]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Proven Niche Channels Built with Faceless Videos
            </h2>
            <p className="mt-4 text-slate-300 text-base sm:text-lg">
              Explore how creators across popular categories build audience trust and long-term brand equity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="rounded-3xl border border-white/10 bg-[#0E1526] p-8 space-y-4 hover:border-purple-500/30 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 font-bold text-lg">
                01
              </div>
              <h3 className="text-xl font-extrabold text-white">Documentary &amp; History</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Cover historical events, geopolitical analysis, and deep-dive documentaries with archival B-roll, dark vignette backgrounds, and dramatic narration.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0E1526] p-8 space-y-4 hover:border-fuchsia-500/30 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-500/10 text-fuchsia-400 font-bold text-lg">
                02
              </div>
              <h3 className="text-xl font-extrabold text-white">Finance &amp; Personal Investing</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Explain stock market trends, banking updates, real estate strategies, and economic news using clean stat cards and chart graphics.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0E1526] p-8 space-y-4 hover:border-pink-500/30 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-400 font-bold text-lg">
                03
              </div>
              <h3 className="text-xl font-extrabold text-white">Tech Explainers &amp; SaaS Demos</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Break down artificial intelligence tools, software updates, and tech hardware breakdowns with high-tech grid aesthetics and screen overlays.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0E1526] p-8 space-y-4 hover:border-emerald-500/30 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 font-bold text-lg">
                04
              </div>
              <h3 className="text-xl font-extrabold text-white">Book Summaries &amp; Lessons</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Distill best-selling non-fiction books, psychology insights, and business philosophy into digestible chapter-based visual guides.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0E1526] p-8 space-y-4 hover:border-amber-500/30 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 font-bold text-lg">
                05
              </div>
              <h3 className="text-xl font-extrabold text-white">Crime &amp; Mystery Storytelling</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Narrate real-life mysteries, investigative cases, and suspense stories using atmosphere-rich visual pacing and sound design.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0E1526] p-8 space-y-4 hover:border-cyan-500/30 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 font-bold text-lg">
                06
              </div>
              <h3 className="text-xl font-extrabold text-white">Corporate Training &amp; Onboarding</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Convert internal company policy documentation, training handbooks, and client onboarding decks into clear, standardized video lessons.
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
              Everything you need to know about AI Faceless Video creation with Itnavideo.
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
        <div className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-500/20 blur-[100px]" />

        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-bold uppercase text-purple-300 mb-6">
            <Award size={14} className="text-purple-400" />
            <span>Ready to Publish Your Next Faceless Video?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Start Turning Your Ideas into HD YouTube Videos Today
          </h2>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Join thousands of creators, educators, and business owners building high-retention video channels without spending hours on complex video editing software.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard?videoType=faceless-video"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 px-8 py-4 text-base font-black text-white shadow-xl shadow-purple-500/25 transition hover:brightness-110 active:scale-95"
            >
              <Sparkles size={18} />
              <span>Create Your First Video Free</span>
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
            <Link href="/privacy" className="hover:text-slate-200 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-200 transition">Terms of Service</Link>
            <Link href="/contact" className="hover:text-slate-200 transition">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
