'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  Sliders,
  Tv,
  ChevronDown,
  Flame,
  Zap,
  BarChart3,
  Clock,
  Swords,
  Users,
  Award,
  Crown,
  Volume2,
  Layers,
  Smartphone,
  ShieldCheck,
  Check,
  X,
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
      a: "A Compare Explainer video directly evaluates two subjects side-by-side (Product A vs Product B, iPhone vs Android, Gold vs Stocks). The 'VS' format commands the highest buyer intent because audiences searching for comparisons are ready to make a decision. The dual split screen and animated host maintain curiosity until the final winner reveal."
    },
    {
      q: "How does Itnavideo automate dual-column split-screen video creation?",
      a: "Upload your voiceover recording and two subject images. Our cloud engine transcribes the audio, detects comparison timestamps, automatically switches the host's poses (pointing left, pointing right, thinking, winner celebration), overlays stat badges, and renders a 1080p video in 30 seconds."
    },
    {
      q: "How many credits does a Compare Explainer video cost?",
      a: "Every 9:16 vertical Compare Explainer video (up to 90 seconds, 1080x1920 30 FPS MP4) costs strictly 1 credit. There are zero hidden fees for high-definition rendering or animated presenters."
    },
    {
      q: "Do I need Adobe Premiere Pro or After Effects keyframing skills?",
      a: "Zero editing skills are needed. Traditional split-screen comparison videos require manual track layering, mask cutouts, character keyframe animation, and audio beat syncing—taking 4 to 6 hours per video. Itnavideo handles all choreography automatically in the cloud."
    },
    {
      q: "Can I adjust narration pacing and background tension music?",
      a: "Yes. You can set narration pacing from 1.0x natural speed up to 1.25x rapid viral pacing, toggle background tension music, enable boxing ring SFX, and choose between clean 3D presenters and flat vector hosts."
    },
    {
      q: "Is this format effective for affiliate marketing and product reviews?",
      a: "Extremely effective. Affiliate marketers, tech reviewers, and ecommerce creators use Compare Explainer reels to demonstrate product differences, highlight pros and cons, and drive viewers to click affiliate links in their bio or pinned comments."
    },
    {
      q: "What video aspect ratio and resolution are produced?",
      a: "Itnavideo exports 9:16 vertical full HD (1080x1920 at 30 FPS MP4), perfectly framed with safe zones for Instagram Reels, YouTube Shorts, and TikTok."
    },
    {
      q: "Can I choose which product wins the comparison?",
      a: "Yes. In the studio, you select which subject is crowned the winner. When the narration reaches the verdict, the host celebrates and a celebratory gold winner crown with particle bursts highlights the winning product."
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
            Create Side-by-Side Comparison Videos That Drive Viral Decision Views
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal max-w-3xl mx-auto">
            Turn voiceovers and two subject images into high-converting "Product A vs Product B" explainer reels with animated 3D presenters, dynamic pose switching, tension beat soundtracks, and winner celebration reveals.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard?videoType=compare-explainer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-slate-900 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition active:scale-95"
            >
              <Play size={18} className="fill-white" />
              <span>Start Compare Explainer Free</span>
            </Link>
            <a
              href="#character-studio"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition"
            >
              <Users size={18} className="text-amber-600" />
              <span>Explore Animated Presenters</span>
            </a>
          </div>

          {/* Quick trust metrics */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs sm:text-sm font-medium text-slate-500 border-t border-slate-100 pt-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Automated Pose Switching</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Dual-Column Split Layout</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Tension BGM &amp; Winner Reveal</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Strictly 1 Credit (1080p 9:16)</span>
            </div>
          </div>
        </div>
      </section>

      {/* CHARACTER STUDIO PREVIEW INTERACTIVE */}
      <section id="character-studio" className="py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Interactive Presenter &amp; Split-Screen Studio
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              Test how the animated presenter switches gestures between Subject A and Subject B to guide viewer focus across comparison points.
            </p>
          </div>

          <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl shadow-slate-200/50">
            {/* Host Selector */}
            <div className="flex justify-center gap-3 mb-8">
              {CHARACTERS.map((char, idx) => (
                <button
                  key={char.id}
                  onClick={() => setSelectedChar(idx as 0 | 1)}
                  className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition ${
                    selectedChar === idx
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {char.name} ({char.tag})
                </button>
              ))}
            </div>

            {/* Split Screen Mockup */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Left Subject Card */}
              <div className={`md:col-span-3 rounded-2xl p-4 border transition text-center ${
                selectedPose === 'pointingLeft' || selectedPose === 'success'
                  ? 'border-amber-400 bg-amber-50/60 ring-2 ring-amber-400/30'
                  : 'border-slate-200 bg-slate-50'
              }`}>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Subject A</div>
                <div className="h-28 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center p-3 mb-3 shadow-sm">
                  <span className="text-2xl mb-1">💻</span>
                  <span className="text-xs font-bold text-slate-800">MacBook Pro M3</span>
                  <span className="text-[10px] text-slate-500">Apple Silicon</span>
                </div>
                <div className="space-y-1.5 text-[11px] text-left">
                  <div className="flex items-center justify-between text-slate-700">
                    <span>Battery Life</span>
                    <strong className="text-emerald-600 font-semibold">22 Hours</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span>Display</span>
                    <strong className="text-slate-900 font-semibold">Liquid Retina XDR</strong>
                  </div>
                </div>
                {selectedPose === 'success' && (
                  <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-amber-500 text-white px-2.5 py-0.5 text-[11px] font-bold shadow-sm">
                    <Crown size={12} />
                    <span>Winner Verdict</span>
                  </div>
                )}
              </div>

              {/* Center Host Preview */}
              <div className="md:col-span-6 flex flex-col items-center justify-center">
                <div className="relative h-64 sm:h-72 w-56 rounded-2xl bg-gradient-to-b from-amber-50/50 to-slate-100 border border-slate-200 p-4 flex items-center justify-center overflow-hidden shadow-inner">
                  <Image
                    src={currentChar.poses[selectedPose as keyof typeof currentChar.poses] || currentChar.poses.welcome}
                    alt={currentChar.name}
                    width={200}
                    height={260}
                    className="object-contain max-h-full drop-shadow-lg transition-transform duration-300"
                  />
                  <div className="absolute bottom-3 inset-x-3 rounded-lg bg-slate-900/90 backdrop-blur-md px-3 py-1 text-center text-xs font-medium text-amber-300 shadow">
                    Pose: {selectedPose.toUpperCase()}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-500">
                  <Volume2 size={14} className="text-amber-500" />
                  <span>Boxing tension beat auto-ducks during speech</span>
                </div>
              </div>

              {/* Right Subject Card */}
              <div className={`md:col-span-3 rounded-2xl p-4 border transition text-center ${
                selectedPose === 'pointingRight'
                  ? 'border-indigo-400 bg-indigo-50/60 ring-2 ring-indigo-400/30'
                  : 'border-slate-200 bg-slate-50'
              }`}>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Subject B</div>
                <div className="h-28 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center p-3 mb-3 shadow-sm">
                  <span className="text-2xl mb-1">🖥️</span>
                  <span className="text-xs font-bold text-slate-800">ThinkPad X1</span>
                  <span className="text-[10px] text-slate-500">Intel Core Ultra</span>
                </div>
                <div className="space-y-1.5 text-[11px] text-left">
                  <div className="flex items-center justify-between text-slate-700">
                    <span>Battery Life</span>
                    <strong className="text-slate-800 font-semibold">14 Hours</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span>Display</span>
                    <strong className="text-slate-900 font-semibold">OLED 2.8K</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Pose Switching Triggers */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 text-center">
                Click a pose to preview automatic presenter choreography:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  ['welcome', '👋 Welcome Intro'],
                  ['pointingLeft', '👈 Point Left (Card A)'],
                  ['pointingRight', '👉 Point Right (Card B)'],
                  ['thinking', '🤔 Analysis & Debate'],
                  ['success', '👑 Winner Celebration'],
                ].map(([poseKey, label]) => (
                  <button
                    key={poseKey}
                    onClick={() => setSelectedPose(poseKey)}
                    className={`p-2.5 rounded-xl text-xs font-semibold text-center border transition ${
                      selectedPose === poseKey
                        ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: THE POWER OF VS COMPARISON VIDEOS */}
      <section className="py-20 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Why Comparison Videos Capture Highest Intent Audiences
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                When a viewer searches for <strong className="text-slate-900 font-semibold">"iPhone 15 Pro vs Samsung S24 Ultra"</strong>, <strong className="text-slate-900 font-semibold">"Shopify vs WooCommerce"</strong>, or <strong className="text-slate-900 font-semibold">"Stock Investing vs Real Estate"</strong>, they are actively looking for a clear, objective decision.
              </p>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                By presenting information in a dual-column comparison layout with an animated host guiding the viewer point-by-point, you create tension, maintain curiosity, and deliver immediate value that drives viewers to watch until the winner announcement.
              </p>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                With Itnavideo, you produce unlimited comparison reels without spending hours editing multi-track video timelines in Premiere Pro or hiring 3D animators.
              </p>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                    <BarChart3 size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Higher Buyer Intent</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Comparison content attracts viewers near the end of their decision funnel, yielding significantly higher click-through and affiliate conversion rates.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <Zap size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Curiosity Tension Arc</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Boxing tension beats and alternating stat callouts keep viewers hooked to find out which option takes the final crown.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <Clock size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">30-Second Production</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Upload audio and two images. The cloud engine automatically handles keyframing, character motion, and sound effects for strictly 1 credit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE 6 CAPABILITIES SOLVED */}
      <section className="py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              6 Built-In Comparison Production Capabilities
            </h2>
            <p className="mt-4 text-slate-600 text-base sm:text-lg">
              Manual split-screen editing is tedious. Here is how Itnavideo automates the entire workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100 mb-5">
                <Clock size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Automated Split Timelines</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Setting up dual video tracks, cropping borders, aligning text overlays, and keyframing character slides manually takes 4+ hours per video.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Instant dual-column split placement with zero keyframing.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 mb-5">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Presenter Gesture Sync</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Rigging and keyframing 3D avatar gestures to point left, point right, and celebrate winners requires advanced 3D software.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Speech timestamps automatically trigger corresponding host poses.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100 mb-5">
                <Volume2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Boxing Tension Soundtracks</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Sourcing boxing bells, tension swells, and victory fanfare while manually adjusting volume levels creates audio fatigue.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Built-in boxing tension soundtracks with auto-ducking behind speech.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 mb-5">
                <Sliders size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Viral Pacing Multiplier</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Slow audio narration loses viewer interest on short-form platforms like Instagram Reels and YouTube Shorts.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Pacing controls (1.0x natural up to 1.25x viral blitz) speed up delivery seamlessly.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 mb-5">
                <Smartphone size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Safe-Zone Mobile Layout</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Labels or stat callouts often get obscured by TikTok, Shorts, and Reels interface buttons like Like, Comment, and Share.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Mobile-first 9:16 bounds ensure every card and text stays 100% visible.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600 border border-violet-100 mb-5">
                <Award size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Winner Reveal FX</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Creating celebratory crown badges, particle bursts, and winner highlighting requires external graphic design tools.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Automatic winner reveal sequence at the climax of every comparison video.
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
              Produce publishing-ready comparison explainer videos in under 30 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-3xl font-extrabold text-amber-600 block mb-3">01</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Narration Audio</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Record your voiceover explaining the two comparison subjects, or paste your script for automatic speech transcription.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                ✓ Auto transcription &amp; beat detection
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-3xl font-extrabold text-indigo-600 block mb-3">02</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Subject Images</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Upload Left Subject Image (Card A) and Right Subject Image (Card B) along with labels and choose your winner.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                ✓ Auto split-screen positioning
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-3xl font-extrabold text-emerald-600 block mb-3">03</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Export 1080p Video</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Select your presenter host style, enable tension background music, and download a crisp 1080p MP4 reel.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                ✓ Strictly 1 Credit • Cloud Render in ~30s
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
              Traditional Split-Screen vs. Itnavideo Compare Explainer
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              See why creators switch from tedious manual timelines to automated cloud rendering.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-5 text-xs font-bold uppercase text-slate-600">Production Feature</th>
                  <th className="p-5 text-xs font-bold uppercase text-rose-600">Manual Video Editing</th>
                  <th className="p-5 text-xs font-bold uppercase text-emerald-700 bg-emerald-50/60">Itnavideo Compare Explainer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Production Time per Video</td>
                  <td className="p-5 text-slate-600">4 to 6 hours</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Under 30 seconds</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Animated Host Choreography</td>
                  <td className="p-5 text-slate-600">Manual 3D rigging or character keyframing</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Automated speech-synced pose switching</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Tension BGM &amp; Sound FX</td>
                  <td className="p-5 text-slate-600">Manual audio sourcing &amp; volume ducking</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Built-in boxing tension tracks with auto-ducking</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Winner Reveal Celebration</td>
                  <td className="p-5 text-slate-600">Manual motion graphic overlays</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Automatic gold crown badge &amp; particle reveal</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Cost per Video</td>
                  <td className="p-5 text-slate-600">$50 – $150 editor fee</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Strictly 1 Credit</td>
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
            <p className="mt-3 text-slate-600 text-base">Everything you need to know about creating Compare Explainer videos.</p>
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
            Start Creating Compare Explainer Videos Today
          </h2>
          <p className="text-slate-300 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of creators producing high-intent decision reels in seconds with animated presenters and tension soundtracks.
          </p>
          <Link
            href="/dashboard?videoType=compare-explainer"
            className="inline-flex items-center gap-2.5 rounded-xl bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-xl hover:bg-slate-100 transition active:scale-95"
          >
            <Sparkles size={18} className="text-amber-600" />
            <span>Create Compare Video Free</span>
          </Link>
          <div className="mt-4 text-xs text-slate-400">
            Strictly 1 Credit per Video • No Credit Card Required
          </div>
        </div>
      </section>
    </div>
  );
}