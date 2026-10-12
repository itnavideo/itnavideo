'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ArrowRight,
  Layers,
  Crown,
  Play,
  CheckCircle2,
  Sliders,
  Tv,
  HelpCircle,
  Smartphone,
  ChevronDown,
  Flame,
  Zap,
  BarChart3,
  Clock,
  ShieldCheck,
  Award,
  Swords,
  Users,
  FileText,
  Wand2,
} from 'lucide-react';

const CHARACTERS = [
  {
    id: '3d-presenter-man',
    name: '3D Presenter Pro',
    tag: 'Flagship 3D',
    poses: {
      welcome: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-welcome_ouesss.png',
      pointingLeft: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-left_g28jnr.png',
      pointingRight: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-right_k39fsl.png',
      thinking: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-thinking_m92kxs.png',
      success: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-success_p03kll.png',
    },
  },
  {
    id: '2d-presenter-man',
    name: '2D Vector Host',
    tag: 'Flat Vector',
    poses: {
      welcome: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-welcome_ouesss.png',
      pointingLeft: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-left_g28jnr.png',
      pointingRight: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-right_k39fsl.png',
      thinking: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-thinking_m92kxs.png',
      success: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-success_p03kll.png',
    },
  },
];

export default function CompareExplainerDetail() {
  const [selectedChar, setSelectedChar] = useState<0 | 1>(0);
  const [selectedPose, setSelectedPose] = useState<string>('welcome');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const currentChar = CHARACTERS[selectedChar];

  const faqData = [
    {
      q: "What is a Compare Explainer Video, and why does the 'VS' format perform so well?",
      a: "A Compare Explainer video directly evaluates two subjects side-by-side (Product A vs Product B, Concept A vs Concept B, iPhone vs Android, Gold vs Stocks). The 'VS' format is inherently high-intent because audiences actively searching for comparisons are near the end of their decision-making process. The side-by-side split screen with an animated host holds viewer curiosity until the final winner reveal."
    },
    {
      q: "How does Itnavideo automate dual-column split-screen video creation?",
      a: "You simply upload your voiceover recording or script along with two subject images (Subject A and Subject B). Our AI transcribes the audio, detects comparison beats, automatically switches character poses (pointing left, pointing right, thinking, winner celebration), overlays high-contrast stat callouts, and renders a 1080p video with background tension beats."
    },
    {
      q: "Do I need complex keyframing skills in Adobe Premiere Pro or After Effects?",
      a: "Zero editing skills are needed. Traditional split-screen comparison videos require manual track layering, mask cutouts, character keyframe animation, and audio beat syncing—taking 6+ hours per video. Itnavideo handles all character pose switching and split-screen choreography automatically in the cloud."
    },
    {
      q: "Can I adjust narration pacing and background tension music?",
      a: "Yes! You can set narration pacing from 1.0x natural speed to 1.25x rapid viral pacing, toggle background tension music, enable boxing ring SFX, and choose between clean 3D presenters or flat vector hosts."
    },
    {
      q: "Is this video format effective for affiliate marketing and product reviews?",
      a: "Extremely effective. Affiliate marketers, tech reviewers, and ecommerce creators use Compare Explainer reels to demonstrate product differences, highlight pros and cons, and drive viewers to affiliate link callouts."
    },
    {
      q: "What export formats and resolutions are provided?",
      a: "Itnavideo exports full 1080p HD (1080x1920 for 9:16 Instagram Reels, Shorts, TikTok, and 1920x1080 for 16:9 widescreen YouTube videos)."
    }
  ];

  // Schema for Google Rich Snippets
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
    name: 'Itnavideo Compare Explainer Video Generator',
    operatingSystem: 'Web-based App',
    applicationCategory: 'MultimediaApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Create side-by-side Product VS comparison explainer videos with animated 3D presenters and sound effects.',
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
              href="/dashboard?videoType=compare-explainer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-purple-500/25 transition hover:brightness-110 active:scale-95"
            >
              <Sparkles size={16} />
              <span>Create Compare Video</span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-amber-500/15 via-purple-600/20 to-pink-500/15 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 mb-6">
            <Swords size={14} className="text-amber-400" />
            <span>AI Compare Explainer Video Generator • Product VS Format</span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1] max-w-5xl mx-auto">
            Create Side-by-Side Comparison Videos{' '}
            <span className="bg-gradient-to-r from-amber-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              That Drive Viral Decision Views
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed font-medium max-w-3xl mx-auto">
            Turn voiceovers and two subject images into high-converting "Product A vs Product B" explainer reels with animated 3D presenters, dynamic pose switching, tension beat soundtracks, and winner celebration reveals.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard?videoType=compare-explainer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 via-purple-600 to-pink-500 px-8 py-4 text-base font-black text-white shadow-xl shadow-purple-500/20 transition hover:brightness-110 active:scale-95"
            >
              <Play size={18} className="fill-white" />
              <span>Start Compare Explainer Free</span>
            </Link>
            <a
              href="#character-studio"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#0E1526] px-8 py-4 text-base font-bold text-slate-200 hover:bg-[#152038] hover:border-purple-500/30 transition"
            >
              <Users size={18} className="text-purple-400" />
              <span>Explore Animated Presenters</span>
            </a>
          </div>

          {/* Quick trust metrics */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs sm:text-sm font-semibold text-slate-400 border-t border-white/10 pt-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Automated Pose Switching</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Dual-Column Split Layout</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Tension BGM &amp; Winner Reveal</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>1080p HD Export</span>
            </div>
          </div>
        </div>
      </section>

      {/* CHARACTER STUDIO PREVIEW INTERACTIVE */}
      <section id="character-studio" className="py-16 sm:py-20 border-t border-white/10 bg-[#0A0F1D]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-bold uppercase text-purple-300 mb-3">
              <Users size={14} />
              <span>Interactive Character Studio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Meet Your Animated Video Host
            </h2>
            <p className="mt-2 text-slate-300 text-sm sm:text-base">
              Switch between 3D Presenter Pro and 2D Vector Host poses to see how character body language guides viewer attention across subjects.
            </p>
          </div>

          <div className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-[#0E1526] p-6 sm:p-8 shadow-2xl">
            {/* Host Selector */}
            <div className="flex justify-center gap-4 mb-8">
              {CHARACTERS.map((char, idx) => (
                <button
                  key={char.id}
                  onClick={() => setSelectedChar(idx as 0 | 1)}
                  className={`px-6 py-3 rounded-xl font-bold text-sm transition ${
                    selectedChar === idx
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {char.name} ({char.tag})
                </button>
              ))}
            </div>

            {/* Pose Showcase Display */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5 flex justify-center">
                <div className="relative h-64 sm:h-80 w-56 rounded-2xl bg-gradient-to-b from-purple-500/10 to-black/60 border border-white/10 p-4 flex items-center justify-center overflow-hidden">
                  <Image
                    src={currentChar.poses[selectedPose as keyof typeof currentChar.poses] || currentChar.poses.welcome}
                    alt={currentChar.name}
                    width={220}
                    height={280}
                    className="object-contain max-h-full drop-shadow-2xl"
                  />
                  <div className="absolute bottom-3 inset-x-3 rounded-lg bg-black/80 backdrop-blur-md px-3 py-1.5 text-center text-xs font-bold text-purple-300 border border-white/10">
                    Pose: {selectedPose.toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="md:col-span-7 space-y-3">
                <h3 className="text-xl font-bold text-white mb-2">Available Poses &amp; Storytelling Triggers:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['welcome', '👋 Welcome Intro'],
                    ['pointingLeft', '👈 Point Left (Card A)'],
                    ['pointingRight', '👉 Point Right (Card B)'],
                    ['thinking', '🤔 Analysis & Thinking'],
                    ['success', '👑 Winner Celebration'],
                  ].map(([poseKey, label]) => (
                    <button
                      key={poseKey}
                      onClick={() => setSelectedPose(poseKey)}
                      className={`p-3 rounded-xl text-xs font-bold text-left border transition ${
                        selectedPose === poseKey
                          ? 'border-purple-500 bg-purple-500/20 text-white'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: THE POWER OF VS COMPARISON VIDEOS */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#070B14]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase text-amber-300">
                <Flame size={14} />
                <span>High-Intent Viewer Psychology</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Why Comparison Videos Capture Highest Intent Audiences
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                When a viewer searches for <strong className="text-white font-semibold">"iPhone 15 Pro vs Samsung S24 Ultra"</strong>, <strong className="text-white font-semibold">"Shopify vs WooCommerce"</strong>, or <strong className="text-white font-semibold">"Stock Investing vs Real Estate"</strong>, they are not casually browsing—they are actively looking for a clear, objective decision.
              </p>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                By presenting information in a dual-column comparison layout with an animated host guiding the viewer point-by-point, you create tension, maintain curiosity, and deliver immediate value.
              </p>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                With an <strong className="text-amber-400 font-semibold">AI Compare Explainer Video Generator</strong>, you can produce unlimited comparison reels without spending hours editing multi-track video timelines in Premiere Pro or hiring 3D animators.
              </p>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-[#0E1526] p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <BarChart3 size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Higher Conversion Rates</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Comparison content attracts viewers near the end of the buyer funnel, generating higher affiliate click-through rates.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1526] p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Zap size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Curiosity Tension Arc</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Tension background beats keep viewers waiting for the final "Winner Reveal" celebration badge.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1526] p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                    <Clock size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">30-Second Production</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Upload narration audio and 2 images. The cloud engine handles keyframing, character motion, and audio ducking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE 5 BOTTLENECKS SOLVED */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#0A0F1D]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Solved: The 5 Major Comparison Video Bottlenecks
            </h2>
            <p className="mt-4 text-slate-300 text-base sm:text-lg">
              Manual split-screen editing is tedious. Here is how Itnavideo streamlines the entire workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-8 hover:border-purple-500/40 transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-6">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">1. Multi-Track Timeline Layering</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Setting up dual video tracks, cropping borders, aligning text overlays, and keyframing character slides manually takes 4+ hours per video.
              </p>
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs font-semibold text-amber-300">
                <strong className="text-white">Itnavideo Solution:</strong> Automatic dual-column layout engine places images and presenters instantly.
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-8 hover:border-purple-500/40 transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">2. Animating Character Host Poses</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Rigging and keyframing 3D avatar gestures to point left, point right, and celebrate winners requires advanced 3D animation skills.
              </p>
              <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 p-3 text-xs font-semibold text-purple-300">
                <strong className="text-white">Itnavideo Solution:</strong> AI analyzes speech timestamps to switch character poses automatically.
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-8 hover:border-purple-500/40 transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-400 border border-pink-500/20 mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">3. Sound Effects &amp; Tension Beats</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Sourcing boxing ring bells, tension swells, and victory fanfare SFX while manually adjusting volume levels creates audio fatigue.
              </p>
              <div className="rounded-xl bg-pink-500/10 border border-pink-500/20 p-3 text-xs font-semibold text-pink-300">
                <strong className="text-white">Itnavideo Solution:</strong> Built-in boxing tension soundtracks with auto-ducking behind speech narration.
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-8 hover:border-purple-500/40 transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-6">
                <Sliders size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">4. Pacing Control &amp; Speed Alignment</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Slow audio narration loses viewer interest on short-form platforms like Instagram Reels and TikTok.
              </p>
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs font-semibold text-emerald-300">
                <strong className="text-white">Itnavideo Solution:</strong> Built-in pacing controls (1.0x natural to 1.25x viral blitz) speed up delivery effortlessly.
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-8 hover:border-purple-500/40 transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 mb-6">
                <Tv size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">5. Multi-Device Mobile Formatting</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Ensuring text labels and stat callouts fit inside vertical 9:16 phone screens without obscuring app UI buttons.
              </p>
              <div className="rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 p-3 text-xs font-semibold text-fuchsia-300">
                <strong className="text-white">Itnavideo Solution:</strong> Mobile-first 9:16 layout templates with safe-zone typography bounds.
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-8 hover:border-purple-500/40 transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-6">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">6. Winner Reveal Choreography</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Creating custom celebratory crown badges, particle bursts, and winner highlighting effects requires graphic design tools.
              </p>
              <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/20 p-3 text-xs font-semibold text-cyan-300">
                <strong className="text-white">Itnavideo Solution:</strong> Automatic winner reveal sequence at the end of every comparison video.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: STEP BY STEP WORKFLOW */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#070B14]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              How It Works in 3 Simple Steps
            </h2>
            <p className="mt-4 text-slate-300 text-base sm:text-lg">
              Generate publishing-ready comparison explainer videos in under 30 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-8 flex flex-col justify-between">
              <div>
                <span className="text-4xl font-black text-amber-400 block mb-4">01</span>
                <h3 className="text-2xl font-extrabold text-white mb-3">Upload Narration Audio</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Record your voiceover explaining the two comparison subjects, or paste your script to generate AI narration.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-amber-300 font-semibold">
                ✓ Auto transcription &amp; beat detection
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-8 flex flex-col justify-between">
              <div>
                <span className="text-4xl font-black text-purple-400 block mb-4">02</span>
                <h3 className="text-2xl font-extrabold text-white mb-3">Upload Subject Images</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Upload Left Subject Image (Card A) and Right Subject Image (Card B) along with labels and winner selection.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-purple-300 font-semibold">
                ✓ Auto split-screen positioning
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-8 flex flex-col justify-between">
              <div>
                <span className="text-4xl font-black text-pink-400 block mb-4">03</span>
                <h3 className="text-2xl font-extrabold text-white mb-3">Export 1080p Video</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Select your presenter host style, enable tension background music, and download a crisp 1080p MP4 reel.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-pink-300 font-semibold">
                ✓ Cloud render finished in ~30s
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: COMPARISON TABLE */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#0A0F1D]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Traditional Split-Screen vs. Itnavideo AI Compare Explainer
            </h2>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0E1526] shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/40">
                  <th className="p-6 text-sm font-extrabold uppercase text-slate-400">Production Metric</th>
                  <th className="p-6 text-sm font-extrabold uppercase text-red-400">Manual Timeline Editing</th>
                  <th className="p-6 text-sm font-extrabold uppercase text-amber-400 bg-amber-500/10">Itnavideo Compare Explainer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-sm sm:text-base">
                <tr>
                  <td className="p-6 font-bold text-white">Editing Time per Video</td>
                  <td className="p-6 text-slate-300">4 to 6 hours</td>
                  <td className="p-6 font-bold text-emerald-400 bg-amber-500/5">Under 30 seconds</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-white">3D Host Animation</td>
                  <td className="p-6 text-slate-300">Complex keyframing or 3D rigging required</td>
                  <td className="p-6 font-bold text-emerald-400 bg-amber-500/5">Automated gesture pose switching</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-white">Winner Reveal FX</td>
                  <td className="p-6 text-slate-300">Manual graphic design overlays</td>
                  <td className="p-6 font-bold text-emerald-400 bg-amber-500/5">Built-in celebratory winner sequence</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-white">Audio Syncing &amp; BGM</td>
                  <td className="p-6 text-slate-300">Manual volume keyframing &amp; beat cutting</td>
                  <td className="p-6 font-bold text-emerald-400 bg-amber-500/5">Auto tension beat ducking behind speech</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 5: FAQ ACCORDION */}
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
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">Start Creating Compare Explainer Videos Today</h2>
          <p className="text-slate-300 text-lg mb-8">Join thousands of creators producing high-intent decision reels in seconds.</p>
          <Link
            href="/dashboard?videoType=compare-explainer"
            className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 via-purple-600 to-pink-500 px-8 py-4 text-base font-black text-white shadow-xl shadow-purple-500/25 transition hover:brightness-110"
          >
            <Sparkles size={18} />
            <span>Create Compare Video Free</span>
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
