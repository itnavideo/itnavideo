'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Film,
  Sparkles,
  Layers,
  Sliders,
  Music,
  Zap,
  CheckCircle2,
  Clock,
  Coins,
  Cpu,
  Download,
  HelpCircle,
  Play,
  Pause,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Type,
  Building2,
  Home,
  Crown,
  Eye,
  Workflow,
  Sparkle,
  BadgeCheck,
  Volume2
} from 'lucide-react';

interface TypographyStyleCard {
  id: string;
  name: string;
  category: 'real-estate' | 'viral' | 'editorial';
  description: string;
  font: string;
  badge: string;
  videoUrl: string;
  posterUrl: string;
  accent: string;
}

const TYPOGRAPHY_STYLES: TypographyStyleCard[] = [
  {
    id: 'realtor-behind-subject',
    name: 'Realtor 3D Gold Depth',
    category: 'real-estate',
    description: 'Giant hero words in Cormorant Garamond with 24k metallic gold shimmer layered behind the walking agent, flanked by glowing glass badges.',
    font: 'Cormorant Garamond 700 + Tenor Sans',
    badge: '3D Behind Subject',
    videoUrl: 'https://storage.googleapis.com/itnavideo-media-assets/Demo-Videos/Typography-Demo-Videos/Video-80725_aiv5eg.mp4',
    posterUrl: 'https://storage.googleapis.com/itnavideo-media-assets/Demo-Videos/Typography-Demo-Videos/Video-80725_aiv5eg.jpg',
    accent: 'from-amber-400 to-yellow-600',
  },
  {
    id: 'luxury-listing-stats',
    name: 'Luxury Listing Stats & Specs',
    category: 'real-estate',
    description: '3-tier architectural stat slam: Delicate serif italic hook + massive Archivo Black numbers ($2.5M, 240 DAYS) + tracked property details.',
    font: 'Archivo Black 900 + Cormorant Italic',
    badge: 'Architectural Stats',
    videoUrl: 'https://storage.googleapis.com/itnavideo-media-assets/Demo-Videos/Typography-Demo-Videos/Video-30713_i60mvm.mp4',
    posterUrl: 'https://storage.googleapis.com/itnavideo-media-assets/Demo-Videos/Typography-Demo-Videos/Video-30713_i60mvm.jpg',
    accent: 'from-amber-500 to-orange-600',
  },
  {
    id: 'architectural-tour',
    name: 'Architectural Villa Walkthrough',
    category: 'real-estate',
    description: 'High-fashion Italiana Didone serif titles with delicate gold hairline divider rules (── TORONTO ──) and minimalist modern caps.',
    font: 'Italiana 400 + Tenor Sans',
    badge: 'Penthouse & Villa',
    videoUrl: 'https://storage.googleapis.com/itnavideo-media-assets/Demo-Videos/Typography-Demo-Videos/Video-1475_vqqclf.mp4',
    posterUrl: 'https://storage.googleapis.com/itnavideo-media-assets/Demo-Videos/Typography-Demo-Videos/Video-1475_vqqclf.jpg',
    accent: 'from-yellow-500 to-amber-700',
  },
  {
    id: 'realtor-punch-quotes',
    name: 'Realtor Authority & Mindset',
    category: 'real-estate',
    description: 'Platinum silver metallic gradient hook paired with heavy italic authority punchline (DON’T SAY, WAITING COSTS YOU) for agent reels.',
    font: 'Playfair Display Italic + Inter Tight',
    badge: 'Authority Reel',
    videoUrl: 'https://storage.googleapis.com/itnavideo-media-assets/Walking_into_new_territory_is_all_about_asking_the_right_questions_And_of_course_collaborating_dxwggb.mp4',
    posterUrl: 'https://storage.googleapis.com/itnavideo-media-assets/Walking_into_new_territory_is_all_about_asking_the_right_questions_And_of_course_collaborating_dxwggb.jpg',
    accent: 'from-slate-400 to-zinc-600',
  },
  {
    id: 'dubai-gold',
    name: 'Dubai Gold 3D Kinetic',
    category: 'viral',
    description: 'Rich warm metallic 3D extrusions with ambient light sweep, designed for wealth, crypto, and premium lifestyle videos.',
    font: 'Cinzel Decorative + Syne 800',
    badge: 'Luxury Viral',
    videoUrl: 'https://storage.googleapis.com/itnavideo-media-assets/Ask_yourself_this_question.Are_you_regretting_your_mistakes..._or_learning_from_them_%EF%B8%8F_d9ekcx.mp4',
    posterUrl: 'https://storage.googleapis.com/itnavideo-media-assets/Ask_yourself_this_question.Are_you_regretting_your_mistakes..._or_learning_from_them_%EF%B8%8F_d9ekcx.jpg',
    accent: 'from-amber-400 to-amber-600',
  },
  {
    id: 'm3-floating-dock',
    name: 'Material 3 Floating Dock',
    category: 'viral',
    description: 'Clean Google Material 3 floating frosted card with dynamic word pill tracking and smooth spring transitions.',
    font: 'Inter / Roboto Flex',
    badge: 'Material 3 Tech',
    videoUrl: 'https://storage.googleapis.com/itnavideo-media-assets/Demo-Videos/Typography-Demo-Videos/Video-98200_f7hpxi.mp4',
    posterUrl: 'https://storage.googleapis.com/itnavideo-media-assets/Demo-Videos/Typography-Demo-Videos/Video-98200_f7hpxi.jpg',
    accent: 'from-violet-500 to-indigo-600',
  },
];

const LUXURY_FONTS = [
  { name: 'Cormorant Garamond', style: 'Bold 700 & Italic 600', usage: '3D Behind-Subject hero & listing hooks', cdn: 'Cloudinary CDN woff2' },
  { name: 'Cinzel Decorative', style: 'Classical Serif 700', usage: 'Architectural estate titles & luxury monuments', cdn: 'Cloudinary CDN woff2' },
  { name: 'Playfair Display', style: 'High-Fashion Italic 700', usage: 'Editorial punchlines & mindset quotes', cdn: 'Cloudinary CDN woff2' },
  { name: 'Prata', style: 'Didone Serif 400', usage: 'Modern villa & architectural showcases', cdn: 'Cloudinary CDN woff2' },
  { name: 'Italiana', style: 'Italian Luxury Serif 400', usage: 'Penthouse walkthroughs & minimalist elegance', cdn: 'Cloudinary CDN woff2' },
  { name: 'Tenor Sans', style: 'Architectural Sans 400', usage: 'Letter-spaced property specs & clean details', cdn: 'Cloudinary CDN woff2' },
  { name: 'Archivo Black', style: 'Heavy Display 900', usage: 'Massive stat slams ($2.5M, 240 DAYS, 4,500 SQ FT)', cdn: 'Cloudinary CDN woff2' },
  { name: 'Syne', style: 'Geometric Heavy 800', usage: 'Modern viral creator hooks', cdn: 'Cloudinary CDN woff2' },
];

const SPECIFICATIONS = [
  { label: 'Aspect Ratio', value: '9:16 Vertical (1080 × 1920)', icon: Smartphone },
  { label: 'Frame Rate', value: '60 FPS Ultra-Smooth', icon: Film },
  { label: 'Max Video Length', value: 'Up to 15 Minutes', icon: Clock },
  { label: 'Input Formats', value: 'MP4, MOV, MP3, WAV', icon: Music },
  { label: 'Luxury Fonts', value: '8 CDN Architectural Fonts', icon: Type },
  { label: 'Motion Engine', value: 'Remotion Spring Kinetics', icon: Cpu },
  { label: 'Audio AI', value: 'Speech AI + Motion Sync', icon: Zap },
  { label: 'Export Pricing', value: '1 Credit per Render', icon: Coins },
];

const FAQS = [
  {
    q: 'How does 3D text behind subject work?',
    a: 'Our typography engine integrates depth-layering techniques. In real estate videos, the giant hero word (like "PENTHOUSE" or "CLIENTS") appears positioned in 3D space behind the walking realtor with realistic shadow falloff and metallic gold reflectivity.',
  },
  {
    q: 'Can I render up to 15-minute long videos?',
    a: 'Yes! Whether you are making a 30-second Instagram Reel or a full 15-minute video presentation, our Google Cloud rendering pipeline processes the entire kinetic typography sequence with zero frame drops.',
  },
  {
    q: 'Does it automatically detect numbers and real estate prices?',
    a: 'Yes. Our AI phrasing planner identifies numerical metrics (e.g. "$2.45M", "240 days on market", "4,800 sq ft") and automatically assigns them to the high-contrast Archivo Black stat slam tier with preceding italic hooks.',
  },
  {
    q: 'Are the 8 luxury fonts included for commercial use?',
    a: 'All 8 luxury fonts (Cormorant Garamond, Cinzel Decorative, Italiana, Tenor Sans, Archivo Black, etc.) are licensed open-source fonts hosted on high-speed CDN, fully approved for commercial real estate marketing, client work, and monetized social channels.',
  },
  {
    q: 'What is the rendering speed?',
    a: 'Typical 30-60 second reels render in approximately 15-25 seconds on our multi-threaded Google Cloud cluster, delivering an immediate download link and instant web preview.',
  },
];

export default function TypographyVideoDetail() {
  const [activeTab, setActiveTab] = useState<'all' | 'real-estate' | 'viral'>('all');
  const [selectedStyle, setSelectedStyle] = useState<TypographyStyleCard>(TYPOGRAPHY_STYLES[0]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const filteredStyles = activeTab === 'all'
    ? TYPOGRAPHY_STYLES
    : TYPOGRAPHY_STYLES.filter((s) => s.category === activeTab);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Background Ambient Tonal Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute top-96 left-0 h-[600px] w-[600px] rounded-full bg-orange-300/10 blur-3xl" />
        <div className="absolute bottom-40 right-10 h-[500px] w-[500px] rounded-full bg-violet-400/10 blur-3xl" />
      </div>

      {/* 1. M3 HERO SECTION */}
      <section className="relative px-4 pb-16 pt-24 sm:px-6 sm:pb-24 sm:pt-32">
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          {/* M3 Assist Chip */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200/90 bg-amber-50/80 px-4 py-1.5 text-xs font-bold text-amber-900 shadow-xs backdrop-blur-md">
            <Crown size={14} className="text-amber-600 animate-pulse" />
            <span>🏡 Real Estate &amp; Creator Kinetic Typography • 9:16 Vertical • 60 FPS • Up to 15 Min</span>
          </div>

          {/* M3 Display Headline */}
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Kinetic Typography AI Video Maker<br />
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
              3D Text Behind Subject, Listing Stats &amp; Viral Kinetic Reels
            </span>
          </h1>

          {/* M3 Body Large */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Turn your talking videos, quotes, and property walkthroughs into viral 9:16 reels. Features 8 luxury architectural fonts, 3D text depth behind moving subjects, and listing statistics popping on screen to the exact millisecond you speak.
          </p>

          {/* M3 Action Row */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard?videoType=typography-video"
              className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-amber-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-500/35 active:translate-y-0"
            >
              <Sparkles size={18} />
              Open Typography Studio
              <ArrowRight size={16} />
            </Link>

            <a
              href="#styles"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]"
            >
              <Eye size={16} />
              Explore Real Estate Styles
            </a>
          </div>

          {/* Micro Trust Metadata */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" />
              1 Credit per Render
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" />
              8 Luxury Architectural Fonts
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" />
              Up to 15 Min Length
            </span>
          </div>

          {/* M3 Hero Showcase Elevated Reel Card */}
          <div className="relative mx-auto mt-12 max-w-sm overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-3 shadow-[0_25px_70px_rgba(0,0,0,0.08)]">
            <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-slate-950">
              <video
                src={selectedStyle.videoUrl}
                poster={selectedStyle.posterUrl}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              {/* Floating Real Estate Glass Badge */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-slate-900 backdrop-blur-md shadow-xs">
                  {selectedStyle.badge}
                </span>
                <span className="rounded-full bg-amber-500/90 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                  60 FPS
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-left pointer-events-none">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  {selectedStyle.name}
                </p>
                <p className="text-[11px] text-slate-200 line-clamp-2 mt-0.5">
                  {selectedStyle.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. M3 INTERACTIVE STYLES GALLERY */}
      <section id="styles" className="relative px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/70 px-3.5 py-1 text-xs font-bold text-amber-900">
              <Sparkle size={13} />
              Verified Demo Reels &amp; Archetypes
            </span>
            <h2 className="mt-3 text-2xl font-black text-slate-900 sm:text-4xl">
              Dedicated Real Estate &amp; High-Impact Styles
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600 sm:text-base">
              Built specifically to match the pacing, font weights, and depth effects of luxury realtors and viral creators.
            </p>

            {/* M3 Segmented Filter Chips */}
            <div className="mt-6 inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                  activeTab === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Styles ({TYPOGRAPHY_STYLES.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('real-estate')}
                className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                  activeTab === 'real-estate'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🏡 Real Estate (4)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('viral')}
                className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                  activeTab === 'viral'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔥 Viral &amp; M3 Tech (2)
              </button>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStyles.map((style) => {
              const isSelected = selectedStyle.id === style.id;
              return (
                <div
                  key={style.id}
                  onClick={() => setSelectedStyle(style)}
                  className={`group cursor-pointer overflow-hidden rounded-3xl border bg-white p-4 transition-all duration-200 hover:-translate-y-1 ${
                    isSelected
                      ? 'border-amber-500 shadow-md ring-2 ring-amber-500/20'
                      : 'border-slate-200/80 shadow-xs hover:border-amber-300 hover:shadow-md'
                  }`}
                >
                  <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-slate-950 mb-4">
                    <video
                      src={style.videoUrl}
                      poster={style.posterUrl}
                      muted
                      loop
                      playsInline
                      onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play().catch(() => {})}
                      onMouseLeave={(e) => (e.currentTarget as HTMLVideoElement).pause()}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="rounded-full bg-slate-900/80 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                        {style.badge}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                    {style.name}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 line-clamp-2">
                    {style.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-500">
                      {style.font}
                    </span>
                    <span className="font-bold text-amber-600 group-hover:translate-x-0.5 transition-transform">
                      Preview →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. M3 8 LUXURY REAL ESTATE FONTS SHOWCASE */}
      <section className="relative px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xs sm:p-12">
            <div className="text-center mb-10">
              <span className="text-xs font-black uppercase tracking-wider text-amber-700">
                Official Typography CDN
              </span>
              <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                8 Luxury Real Estate &amp; Architectural Fonts
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
                Hosted directly on Cloudinary CDN in high-performance woff2 format with complete normal and native italic support.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {LUXURY_FONTS.map((font, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-5 hover:border-amber-200 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-slate-900">
                        {font.name}
                      </h4>
                      <span className="rounded-full bg-amber-100/80 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                        {font.style}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                      {font.usage}
                    </p>
                  </div>
                  <div className="mt-3 text-[10px] font-mono text-slate-400">
                    CDN: {font.cdn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. M3 STEP-BY-STEP WORKFLOW TIMELINE */}
      <section className="relative px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xs sm:p-12">
            <div className="text-center mb-10">
              <span className="text-xs font-black uppercase tracking-wider text-amber-700">
                3-Step Creation Pipeline
              </span>
              <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                From Video Recording to Viral Kinetic Typography
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-6">
                <span className="text-3xl font-black text-amber-500/30">01</span>
                <h3 className="mt-2 text-base font-bold text-slate-900">
                  Upload Video or Speech
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Drop your talking-head reel, agent tour, or podcast audio clip (up to 15 minutes supported).
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-6">
                <span className="text-3xl font-black text-amber-500/30">02</span>
                <h3 className="mt-2 text-base font-bold text-slate-900">
                  Pick Real Estate Style
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Choose 3D Behind-Subject, Listing Stats, Architectural Tour, or Punch Quotes. AI automatically detects prices and metrics.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-6">
                <span className="text-3xl font-black text-amber-500/30">03</span>
                <h3 className="mt-2 text-base font-bold text-slate-900">
                  Export 1080p 60 FPS Reel
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Preview live in your browser and render on Google Cloud in ~20 seconds with synced sound cues and spring physics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. M3 TECHNICAL SPECIFICATIONS MATRIX */}
      <section className="relative px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xs sm:p-10">
            <h2 className="text-xl font-black text-slate-900 sm:text-2xl mb-6">
              Technical Specifications &amp; Kinetic Engine
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SPECIFICATIONS.map((spec, idx) => {
                const Icon = spec?.icon || Sparkles;
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                  >
                    <div className="rounded-xl bg-amber-100/70 p-2 text-amber-700">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        {spec.label}
                      </p>
                      <p className="mt-0.5 text-xs font-bold text-slate-900">
                        {spec.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 6. M3 FREQUENTLY ASKED QUESTIONS */}
      <section className="relative px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-wider text-amber-700">
              Clear Answers
            </span>
            <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-slate-900 hover:text-amber-700"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp size={18} className="text-slate-400 shrink-0 ml-2" />
                    ) : (
                      <ChevronDown size={18} className="text-slate-400 shrink-0 ml-2" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="border-t border-slate-100 px-5 pb-5 pt-3 text-sm leading-relaxed text-slate-600">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. M3 FLOATING BOTTOM CALL TO ACTION */}
      <section className="relative px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-8 sm:p-12 text-white shadow-xl shadow-amber-500/15">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold text-white backdrop-blur-md">
                ✦ 15-Minute Video Scale
              </span>
              <h2 className="mt-4 text-2xl font-black sm:text-4xl leading-tight">
                Ready to Create Viral Real Estate &amp; Kinetic Reels?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-amber-50 leading-relaxed">
                Upload your video or narration track now. Experience automatic word timing, 3D text behind subject, and luxury listing stats in seconds.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/dashboard?videoType=typography-video"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-slate-950 shadow-md transition-all hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles size={18} className="text-amber-600" />
                  Launch Typography Studio
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-4 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20"
                >
                  View Credit Packs
                </Link>
              </div>
            </div>

            {/* Background Decorative Rings */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full border border-white/10 bg-white/5 blur-2xl" />
          </div>
        </div>
      </section>
    </div>
  );
}
