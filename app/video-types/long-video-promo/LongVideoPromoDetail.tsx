'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Tv,
  Zap,
  CheckCircle2,
  Clock,
  Play,
  FileText,
  Sliders,
  ChevronDown,
  BarChart3,
  Flame,
  Award,
  Share2,
  Film,
  ExternalLink,
  ShieldCheck,
  Layers,
  Smartphone,
  Eye,
  Check,
  X,
} from 'lucide-react';

export default function LongVideoPromoDetail() {
  const [activeElement, setActiveElement] = useState<'thumbnail' | 'clip' | 'handle' | 'cta'>('thumbnail');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    {
      q: "What is a Long Video Promo (Vertical Teaser Reel)?",
      a: "A Long Video Promo is a 9:16 vertical teaser reel specifically engineered to drive short-form scrollers to your long-form YouTube videos, podcasts, or webinars. It pins your YouTube thumbnail at the top, plays your most exciting video clip in the center with ambient canvas blurs, and displays your @channel handle and an animated 'Watch Full Video' CTA."
    },
    {
      q: "Why is promoting long videos through vertical reels essential for YouTube growth?",
      a: "Short-form algorithms (Instagram Reels, YouTube Shorts, TikTok) reach vast audiences who may never see your long video in their homepage recommendations. Publishing a high-converting teaser reel acts as a 24/7 billboard, funneling traffic from short-form feeds directly to your main channel."
    },
    {
      q: "How many credits does a Long Video Promo video cost?",
      a: "Every Long Video Promo reel (up to 90 seconds, 1080x1920 30 FPS MP4) costs strictly 1 credit. There are zero extra charges for full HD rendering or custom branding."
    },
    {
      q: "Do I need complex video editing software like Premiere Pro or CapCut?",
      a: "Zero editing skills are needed. Traditional trailer editing requires setting up multi-frame aspect ratios, blurring background video edges, adding text overlays, and keyframing CTA buttons manually—taking 2+ hours per promo. Itnavideo automates the entire layout in under 30 seconds."
    },
    {
      q: "Can I customize the channel handle badge and CTA button text?",
      a: "Yes. You can enter your exact @ChannelHandle, customize button copy ('Watch Full Video on YouTube', 'Full Episode Out Now', 'Link in Bio'), and choose custom color themes."
    },
    {
      q: "What video clips and thumbnail image formats are supported?",
      a: "You can upload any 30-to-90 second highlight MP4 or MOV video clip alongside your standard 16:9 YouTube thumbnail image (JPG or PNG)."
    },
    {
      q: "Are the buttons and text safe from TikTok and Instagram UI overlays?",
      a: "Yes. All frames, badges, and CTA buttons are positioned inside platform safe zones, ensuring TikTok, Reels, and Shorts interface icons (Like, Share, Comment, Audio Disc) never cover your callouts."
    },
    {
      q: "What export format and resolution are provided?",
      a: "Videos are exported in full 1080p HD (1080x1920 at 30 FPS MP4), perfectly framed for Instagram Reels, YouTube Shorts, and TikTok."
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
    name: 'Itnavideo Long Video Promo Generator',
    operatingSystem: 'Web-based App',
    applicationCategory: 'MultimediaApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Convert long YouTube videos and podcasts into high-converting vertical trailer teasers with thumbnail callouts and watch CTAs.',
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-rose-100 selection:text-rose-900">
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
            Turn Long YouTube Videos Into High-Converting Vertical Teaser Trailers
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal max-w-3xl mx-auto">
            Stop letting your long YouTube videos sit at low view counts. Convert key highlights into 9:16 vertical promotional reels complete with pinned YouTube thumbnail frames, @channel handle tags, and animated Watch Full Video CTAs.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard?videoType=long-video-promo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-slate-900 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition active:scale-95"
            >
              <Play size={18} className="fill-white" />
              <span>Create Promo Teaser Free</span>
            </Link>
            <a
              href="#promo-studio"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition"
            >
              <Smartphone size={18} className="text-rose-600" />
              <span>Explore 9:16 Layout Studio</span>
            </a>
          </div>

          {/* Quick trust metrics */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs sm:text-sm font-medium text-slate-500 border-t border-slate-100 pt-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Pinned Top Thumbnail Frame</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>@Channel Handle Badge Tag</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Animated Watch Full Video CTA</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Strictly 1 Credit (1080p 9:16)</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROMO STUDIO INTERACTIVE */}
      <section id="promo-studio" className="py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Interactive 9:16 Promo Teaser Studio
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              Explore how dual-frame layout composition funnels short-form viewers to your full YouTube video.
            </p>
          </div>

          <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl shadow-slate-200/50">
            {/* Element Selector Tabs */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
              {[
                { id: 'thumbnail', label: '🖼️ Pinned Thumbnail', desc: 'Top 16:9 cover frame' },
                { id: 'clip', label: '🎬 Center Teaser Clip', desc: 'Video highlight + blur' },
                { id: 'handle', label: '🏷️ @Channel Badge', desc: 'Creator branding' },
                { id: 'cta', label: '🚀 Watch Full Video CTA', desc: 'High-converting button' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveElement(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition ${
                    activeElement === tab.id
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 9:16 Phone Frame Mockup */}
            <div className="max-w-xs mx-auto aspect-[9/16] rounded-3xl bg-slate-950 border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between p-4 relative text-white">
              {/* Dynamic ambient blur background */}
              <div className="absolute inset-0 bg-gradient-to-b from-rose-950/40 via-purple-950/30 to-slate-950" />

              {/* 1. Top Pinned YouTube Thumbnail */}
              <div className={`relative z-10 rounded-xl overflow-hidden border p-2 transition ${
                activeElement === 'thumbnail'
                  ? 'border-rose-400 bg-rose-500/20 ring-2 ring-rose-400/40'
                  : 'border-white/10 bg-black/40'
              }`}>
                <div className="aspect-video w-full rounded-lg bg-gradient-to-tr from-rose-600 to-amber-500 flex flex-col justify-between p-2.5 shadow-md">
                  <span className="self-start rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                    New YouTube Video
                  </span>
                  <div>
                    <span className="text-xs font-black text-white leading-tight block">
                      HOW I SCALED TO $100K/MO
                    </span>
                    <span className="text-[9px] text-white/90">Full Documentary Out Now</span>
                  </div>
                </div>
              </div>

              {/* 2. Center Video Highlight Clip */}
              <div className={`relative z-10 rounded-xl overflow-hidden border p-2 my-auto transition ${
                activeElement === 'clip'
                  ? 'border-indigo-400 bg-indigo-500/20 ring-2 ring-indigo-400/40'
                  : 'border-white/10 bg-black/40'
              }`}>
                <div className="aspect-video w-full rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center relative overflow-hidden">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                    <Play size={18} className="fill-white translate-x-0.5" />
                  </div>
                  <div className="absolute bottom-2 inset-x-2 flex items-center justify-between text-[9px] text-slate-300">
                    <span className="font-mono">Teaser Clip</span>
                    <span className="font-mono">00:45</span>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Handle & CTA */}
              <div className="relative z-10 space-y-2.5 pt-2">
                {/* 3. Channel Handle Badge */}
                <div className={`rounded-lg p-2 text-center border transition ${
                  activeElement === 'handle'
                    ? 'border-amber-400 bg-amber-500/20 ring-2 ring-amber-400/40'
                    : 'border-white/10 bg-black/50'
                }`}>
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-white">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px]">▶</span>
                    <span>@creatorstudio</span>
                    <span className="text-[10px] text-slate-400">• YouTube</span>
                  </div>
                </div>

                {/* 4. Watch Full Video CTA */}
                <div className={`rounded-xl p-1 text-center transition ${
                  activeElement === 'cta' ? 'ring-2 ring-rose-400' : ''
                }`}>
                  <div className="w-full rounded-lg bg-gradient-to-r from-rose-600 to-amber-500 py-2.5 text-center text-xs font-black text-white shadow-lg flex items-center justify-center gap-1.5">
                    <span>Watch Full Episode on YouTube</span>
                    <ExternalLink size={12} />
                  </div>
                </div>
              </div>

              {/* Bottom Safe Zone Indicator */}
              <div className="absolute bottom-1 inset-x-2 text-center text-[8px] text-slate-500 font-mono">
                100% Platform Safe Zones Guaranteed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: THE TRAFFIC FUNNEL STRATEGY */}
      <section className="py-20 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Why Top YouTubers Use Vertical Teaser Reels for Every Upload
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                Producing a high-quality YouTube documentary, podcast, or tutorial takes hours of scripting, filming, and editing. However, relying solely on YouTube homepage recommendations means ignoring millions of potential viewers active on Instagram Reels, Shorts, and TikTok.
              </p>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                Publishing a dedicated <strong className="text-slate-900 font-semibold">Long Video Promo reel</strong> that pairs your best hook with your YouTube thumbnail turns short-form feeds into a non-stop traffic acquisition funnel.
              </p>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                With Itnavideo, composing and rendering professional vertical promo trailers takes under 30 seconds for strictly 1 credit.
              </p>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                    <BarChart3 size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">10x Link Click-Throughs</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Prominent "Watch Full Video on YouTube" callouts convert casual scrollers into high-retention long-form viewers.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                    <Eye size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Thumbnail Reinforcement</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Displaying your YouTube thumbnail reinforces brand familiarity when viewers browse their desktop homepages later.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <Zap size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Strictly 1 Credit</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Fair flat rate. Render vertical promo reels up to 90 seconds in 1080p full HD for strictly 1 credit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: 6 CORE CAPABILITIES */}
      <section className="py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              6 Built-In Promo Teaser Capabilities
            </h2>
            <p className="mt-4 text-slate-600 text-base sm:text-lg">
              Everything needed to format multi-frame promotional reels without manual keyframe work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100 mb-5">
                <Smartphone size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Dual-Frame 9:16 Layout</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Positions your 16:9 thumbnail and 16:9 video highlight into a vertical reel with zero ugly cropping.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Automated aspect ratio harmony.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 mb-5">
                <Layers size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Ambient Canvas Blur</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Fills letterbox background edges with soft, dynamic color glow derived from your video frames.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Zero plain black borders.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100 mb-5">
                <Share2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Verified @Channel Badges</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Renders a crisp frosted-glass channel badge with YouTube icon and subscriber count tag.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Consistent creator branding.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 mb-5">
                <ExternalLink size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">High-Converting CTAs</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Animated button with gradient shine effects prompts viewers to watch the full episode on YouTube.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Boosts bio link traffic.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100 mb-5">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Platform Safe Zones</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Carefully calculated margins prevent TikTok and Instagram UI buttons from obscuring your thumbnail or CTA.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> 100% visible on every device.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 mb-5">
                <Clock size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Strictly 1 Credit</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Produce promotional trailers up to 90 seconds in 1080p full HD for strictly 1 credit.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Cloud render in ~30 seconds.
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
              Produce vertical YouTube promotional reels in under 30 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-3xl font-extrabold text-rose-600 block mb-3">01</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Video Clip</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Upload your 30s to 90s video highlight clip (MP4 or MOV). This acts as the high-retention teaser.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                ✓ Auto aspect framing &amp; volume balance
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-3xl font-extrabold text-amber-600 block mb-3">02</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Thumbnail &amp; Handle</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Upload your 16:9 YouTube thumbnail image and type your @ChannelHandle to brand your promo.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                ✓ Auto ambient canvas background blur
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-3xl font-extrabold text-emerald-600 block mb-3">03</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Export 1080p 9:16 Video</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Download a crisp 1080p vertical reel with animated CTA buttons, ready to publish on Shorts, Reels, and TikTok.
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
              Manual Video Editing vs. Itnavideo Long Video Promo
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              Why top YouTube creators automate their vertical teaser workflow.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-5 text-xs font-bold uppercase text-slate-600">Feature</th>
                  <th className="p-5 text-xs font-bold uppercase text-rose-600">Manual Video Editing</th>
                  <th className="p-5 text-xs font-bold uppercase text-emerald-700 bg-emerald-50/60">Itnavideo Long Video Promo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Editing Time per Teaser</td>
                  <td className="p-5 text-slate-600">2 to 3 hours in Premiere Pro</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Under 30 seconds</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Dual-Frame Aspect Ratio Alignment</td>
                  <td className="p-5 text-slate-600">Manual track nesting, cropping, and masks</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Automated multi-frame layout engine</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Ambient Background Glow</td>
                  <td className="p-5 text-slate-600">Duplicate video track + heavy gaussian blur filter</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Instant GPU ambient canvas blur</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Channel Badge &amp; CTA Buttons</td>
                  <td className="p-5 text-slate-600">Manual Photoshop export &amp; motion keyframing</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Built-in glass badges &amp; animated CTAs</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Cost per Video</td>
                  <td className="p-5 text-slate-600">$40 – $90 editor fee</td>
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
            <p className="mt-3 text-slate-600 text-base">Everything you need to know about Long Video Promo reels.</p>
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
            Create Your Vertical Teaser Reel Today
          </h2>
          <p className="text-slate-300 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Drive 10x traffic to your YouTube videos and podcasts in seconds with automated 9:16 promotional reels.
          </p>
          <Link
            href="/dashboard?videoType=long-video-promo"
            className="inline-flex items-center gap-2.5 rounded-xl bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-xl hover:bg-slate-100 transition active:scale-95"
          >
            <Sparkles size={18} className="text-rose-600" />
            <span>Create Promo Teaser Free</span>
          </Link>
          <div className="mt-4 text-xs text-slate-400">
            Strictly 1 Credit per Video • No Credit Card Required
          </div>
        </div>
      </section>
    </div>
  );
}