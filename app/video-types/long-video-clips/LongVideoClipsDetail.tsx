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
  Scissors,
  Layers,
  Award,
  ChevronDown,
  BarChart3,
  Video,
  UploadCloud,
  Wand2,
  DownloadCloud,
  Check,
  X,
  Smartphone,
  Flame,
  ShieldCheck,
  Users,
  Mic,
  Tv,
} from 'lucide-react';

export default function LongVideoClipsDetail() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeClipIndex, setActiveClipIndex] = useState(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const sampleClips = [
    {
      title: 'The 3-Second Retention Rule',
      timestamp: '14:22 - 15:08',
      score: '98/100',
      duration: '46s',
      quote: 'If you do not hook the viewer in the first 1.2 seconds, 90% swipe away.',
    },
    {
      title: 'Why 85% of Viewers Watch on Mute',
      timestamp: '32:10 - 32:58',
      score: '95/100',
      duration: '48s',
      quote: 'Sound-off viewers require bold karaoke subtitles that command attention.',
    },
    {
      title: 'The $14M Real Estate Pipeline',
      timestamp: '48:05 - 48:45',
      score: '92/100',
      duration: '40s',
      quote: 'Kinetic typography behind the agent generated multi-million inquiries.',
    },
  ];

  const faqData = [
    {
      q: 'What is the AI Long Video to Clips Generator?',
      a: 'The Itnavideo Long Video to Clips Generator is an AI-powered repurposing engine that scans long-form horizontal videos (such as podcasts, webinars, keynotes, and interviews up to 2 hours) to detect high-interest viral hooks, automatically crops and reframes speakers into 9:16 vertical video, and renders word-synced animated subtitles.',
    },
    {
      q: 'How does the AI detect which moments are viral hooks?',
      a: 'Our speech intelligence engine transcribes the audio with millisecond accuracy, evaluates emotional inflection, identifies curiosity questions, tracks cadence spikes, and pinpoints standalone thought blocks (30 to 60 seconds) that are proven to perform on TikTok, YouTube Shorts, and Instagram Reels.',
    },
    {
      q: 'How does 9:16 vertical reframing handle horizontal speaker footage?',
      a: 'The engine automatically detects the active speaker face and keeps them centered in the 9:16 vertical frame. If multiple guests are conversing, it smoothly shifts focus to whoever is speaking or applies a clean ambient blurred background so nothing gets awkwardly cropped out.',
    },
    {
      q: 'What is the credit cost for generating clips?',
      a: 'Long Video Clips operate on a predictable 1 Credit per Clip policy (1 clip = 1 credit, 5 clips = 5 credits). You can upload recordings up to 2 hours long without any extra surcharge.',
    },
    {
      q: 'What video file formats and maximum lengths can I upload?',
      a: 'You can upload MP4, MOV, or WebM files up to 2 hours (120 minutes) long, or provide audio tracks. Uploads are processed on high-speed cloud infrastructure.',
    },
    {
      q: 'Are the animated subtitles customizable?',
      a: 'Yes. You can choose from multiple kinetic subtitle presets (including MrBeast-style bold karaoke, clean minimal white, and high-contrast yellow highlights), toggle custom emojis, and edit any text in the transcript before rendering.',
    },
    {
      q: 'What resolution and frame rate do the exported clips have?',
      a: 'Every clip is exported in pristine 1080p Full HD (1080×1920) at 30 or 60 FPS, ready to upload directly to YouTube Shorts, Instagram Reels, and TikTok without watermarks on paid plans.',
    },
    {
      q: 'Do I get commercial rights for monetized channels and client projects?',
      a: 'Yes! All videos generated on Itnavideo include full commercial rights. You own the content 100% and can monetize it on YouTube, TikTok, Facebook, or deliver it to agency clients.',
    },
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
    name: 'Itnavideo Long Video to Clips Generator',
    operatingSystem: 'Web-based Cloud Platform',
    applicationCategory: 'MultimediaApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Transform up to 2 hours of podcasts and webinars into viral 9:16 vertical short clips with AI hook detection and kinetic subtitles.',
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#FF5722]/20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />

      {/* ─── 1. HERO SECTION (NO EYEBROW BADGES — CLEAN ENTERPRISE BRAND) ─── */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 border-b border-slate-100 bg-gradient-to-b from-[#FFFBF9] via-white to-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Main Headline */}
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl md:text-7xl leading-[1.12] max-w-5xl mx-auto font-sans">
            Turn Long Videos &amp; Podcasts Into{' '}
            <span className="bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] bg-clip-text text-transparent">
              Viral Shorts in Seconds
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal max-w-3xl mx-auto">
            Upload up to 2 hours of raw interviews, webinars, or long YouTube videos. AI automatically scans for the highest-retention hooks, reframes speakers into vertical 9:16, and adds word-synced animated subtitles.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard/long-video-clips"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-8 py-4 text-base font-black text-white shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:brightness-110 active:scale-95 transition-all duration-200"
            >
              <Sparkles size={18} className="fill-white stroke-white" />
              <span>Harvest Viral Clips Free</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-xs"
            >
              <span>View Pricing &amp; Packs</span>
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold text-slate-500 border-t border-slate-100 pt-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#FF5722]" />
              <span>1 Credit / Clip</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#FF5722]" />
              <span>Up to 2 Hours Input</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#FF5722]" />
              <span>Auto 9:16 Face Framing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#FF5722]" />
              <span>1080p Full HD MP4</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. INTERACTIVE STUDIO SHOWCASE (VISUAL MOCKUP) ─── */}
      <section className="py-16 sm:py-24 bg-slate-50/70 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              How the AI Clip Engine Works in Real Time
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Upload long footage and let AI detect peak viral moments, cut standalone shorts, and add subtitles.
            </p>
          </div>

          {/* Mockup Container */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-8 shadow-xl shadow-slate-200/50">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Left Column: Source Long Video Inspector */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500">Source Video</span>
                    <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">1h 42m Podcast</span>
                  </div>
                  <div className="aspect-video rounded-xl bg-slate-900 text-white flex flex-col justify-between p-3 relative overflow-hidden">
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span>Full Episode #142.mp4</span>
                      <span className="text-emerald-400 font-bold">● Transcribed</span>
                    </div>
                    {/* Simulated Waveform with Highlighted Cuts */}
                    <div className="h-10 flex items-center gap-1 px-2 bg-slate-800/80 rounded-lg">
                      <div className="w-1/4 h-3 bg-slate-600 rounded-sm" />
                      <div className="w-1/6 h-7 bg-[#FF5722] rounded-sm animate-pulse" title="Hook #1 detected" />
                      <div className="w-1/5 h-2 bg-slate-600 rounded-sm" />
                      <div className="w-1/6 h-8 bg-[#FF5722] rounded-sm" title="Hook #2 detected" />
                      <div className="w-1/4 h-3 bg-slate-600 rounded-sm" />
                    </div>
                    <span className="text-[10px] text-slate-400">3 High-Yield Viral Hooks Extracted</span>
                  </div>
                </div>

                {/* Candidate Clips Selector */}
                <div className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500 block px-1">Detected Viral Clips</span>
                  {sampleClips.map((clip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveClipIndex(idx)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        activeClipIndex === idx
                          ? 'border-[#FF5722] bg-orange-50/50 shadow-sm'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{clip.title}</span>
                        <span className="text-[11px] font-black text-[#FF5722]">{clip.score}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1 font-medium">
                        <span>{clip.timestamp}</span>
                        <span>·</span>
                        <span>{clip.duration}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: 9:16 Vertical Preview Card */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl text-white">
                <span className="text-xs font-black uppercase tracking-wider text-orange-400 mb-3">
                  📱 Generated 9:16 Social Reel (1080×1920)
                </span>
                
                {/* 9:16 Phone Canvas */}
                <div className="w-[240px] sm:w-[260px] aspect-[9/16] rounded-2xl bg-slate-800 border-2 border-white/10 shadow-2xl relative overflow-hidden flex flex-col justify-between p-4">
                  {/* Top Hook Banner */}
                  <div className="rounded-xl bg-black/60 backdrop-blur-md px-3 py-1.5 border border-white/10 text-center">
                    <p className="text-[11px] font-black text-amber-300 uppercase tracking-wide">
                      ⚡ {sampleClips[activeClipIndex].title}
                    </p>
                  </div>

                  {/* Active Speaker Visual Graphic */}
                  <div className="my-auto text-center space-y-2">
                    <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-tr from-[#FF5722] to-amber-400 flex items-center justify-center shadow-lg text-2xl">
                      🎙️
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                      AI Active Face Centered
                    </span>
                  </div>

                  {/* Kinetic Karaoke Subtitles Overlay */}
                  <div className="rounded-xl bg-black/70 backdrop-blur-md p-3 text-center border border-white/10">
                    <p className="text-xs font-black leading-snug">
                      &ldquo;<span className="text-yellow-300">{sampleClips[activeClipIndex].quote}</span>&rdquo;
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Ready to export at 1080p 60 FPS • 1 Credit</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. HOW IT WORKS (3 SIMPLE STEPS) ─── */}
      <section className="py-16 sm:py-24 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              How It Works in 3 Simple Steps
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Repurpose hours of footage into weeks of short-form social content without touching a timeline editor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#FF5722] font-black text-lg mb-5 border border-orange-200/60">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Upload Your Long Video</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Upload any horizontal MP4 or MOV file up to 2 hours long. Our cloud pipeline extracts and transcribes audio with millisecond accuracy.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#FF5722] font-black text-lg mb-5 border border-orange-200/60">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Detects Viral Moments</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Speech AI scores curiosity spikes and extracts 30–60s standalone clips, tracking the active speaker face inside vertical 9:16.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#FF5722] font-black text-lg mb-5 border border-orange-200/60">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Export 1080p Shorts</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Review generated clips, fine-tune subtitle styles if desired, and download social-ready 1080p Full HD MP4 files with 1 credit per clip.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. CORE CAPABILITIES (6 FEATURE CARDS) ─── */}
      <section className="py-16 sm:py-24 bg-slate-50/60 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Built for High-Growth Creator Channels &amp; Agencies
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Everything you need to extract 10x output from every long-form episode or webinar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722] mb-4">
                <Flame size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">AI Viral Hook Detection</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluates sentence emotional punch and questions so you never miss high-retention moments.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722] mb-4">
                <Smartphone size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Smart 9:16 Face Centering</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automatically tracks and centers the speaker in the vertical canvas without manual pan keyframing.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722] mb-4">
                <Sparkles size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Word-Level Karaoke Subtitles</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Word-synced animated subtitles keep sound-off viewers engaged and reduce swipe-away rates.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722] mb-4">
                <Clock size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Up to 2-Hour Inputs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Accepts full-length interviews, keynotes, and live streams without requiring pre-cutting.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722] mb-4">
                <Scissors size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Predictable 1 Credit / Clip</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pay only for the clips you extract. Zero monthly waste, and credits never expire on packs.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722] mb-4">
                <Zap size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Ultra-Fast Cloud Rendering</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                High-performance AWS Lambda cloud rendering delivers 1080p MP4 exports in under 30 seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. WHO IS IT BUILT FOR (CREATOR USE CASES) ─── */}
      <section className="py-16 sm:py-24 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Who Uses Long Video to Clips?
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Engineered for busy creators and agencies who need daily short-form content.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 mb-3">
                <Mic size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Podcasters</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Turn a 1-hour interview into 10+ teaser reels that drive thousands of listeners back to the full episode.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-3">
                <Tv size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">YouTubers</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Double your channel views with YouTube Shorts algorithm recommendations without filming separate content.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mb-3">
                <Users size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Coaches &amp; Educators</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Repurpose client Q&amp;As and masterclasses into bite-sized authoritative tips that attract new students.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-3">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Marketing Agencies</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deliver 50+ branded shorts each month across all client accounts at a fraction of freelance editor costs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. COMPARISON MATRIX (MANUAL EDITING VS ITNAVIDEO) ─── */}
      <section className="py-16 sm:py-24 bg-slate-50/70 border-b border-slate-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Manual Timeline Editing vs. Itnavideo AI
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              See why creators are replacing tedious timeline scrubbing with instant AI harvesting.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-slate-200 bg-slate-100/70 text-slate-700">
                  <tr>
                    <th className="p-4 font-bold">Feature / Capability</th>
                    <th className="p-4 font-bold text-rose-600">Manual Video Editor</th>
                    <th className="p-4 font-bold text-[#FF5722]">Itnavideo AI Studio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-4 font-semibold text-slate-900">Hook Detection</td>
                    <td className="p-4 text-slate-500">Manual scrubbing for 2–3 hours</td>
                    <td className="p-4 font-bold text-emerald-600">Automatic AI Hook Scoring</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-900">Vertical 9:16 Reframing</td>
                    <td className="p-4 text-slate-500">Manual keyframing &amp; panning</td>
                    <td className="p-4 font-bold text-emerald-600">Automatic Speaker Face Centering</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-900">Subtitle Alignment</td>
                    <td className="p-4 text-slate-500">Manual word timing &amp; cuts</td>
                    <td className="p-4 font-bold text-emerald-600">Word-Level Millisecond Sync</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-900">Cost Per Clip</td>
                    <td className="p-4 text-slate-500">$30 – $100 per clip</td>
                    <td className="p-4 font-bold text-emerald-600">1 Credit (~$0.40 on packs)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-900">Turnaround Speed</td>
                    <td className="p-4 text-slate-500">2 to 4 business days</td>
                    <td className="p-4 font-bold text-emerald-600">Under 60 Seconds</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. FAQ ACCORDION ─── */}
      <section className="py-16 sm:py-24 border-b border-slate-100">
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
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-transform ${isOpen ? 'rotate-180 bg-orange-100 text-[#FF5722]' : ''}`}>
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

      {/* ─── 8. BOTTOM HIGH-IMPACT ACTION BANNER ─── */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-orange-50 via-amber-50/50 to-orange-50/80 text-center">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
            Start Repurposing Your Long Videos Today
          </h2>
          <p className="text-slate-600 text-base max-w-xl mx-auto mb-8">
            Extract viral 9:16 Shorts from your podcasts and webinars in under 60 seconds.
          </p>
          <Link
            href="/dashboard/long-video-clips"
            className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-8 py-4 text-base font-black text-white shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:brightness-110 active:scale-95 transition-all duration-200"
          >
            <Sparkles size={18} className="fill-white stroke-white" />
            <span>Open Long Video Clips Studio Free</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
