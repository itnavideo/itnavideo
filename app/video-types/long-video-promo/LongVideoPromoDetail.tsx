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
  HelpCircle,
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
} from 'lucide-react';

export default function LongVideoPromoDetail() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    {
      q: "What is a Long Video Promo, and how does it drive traffic to YouTube videos?",
      a: "A Long Video Promo is a vertical teaser reel (9:16) specifically engineered to promote long-form YouTube videos, podcasts, or webinars. It features a pinned top frame displaying your YouTube thumbnail, ambient background blur, @channel handle badge, and an animated 'Watch Full Video' call-to-action button that converts short-form scrollers into full-video viewers."
    },
    {
      q: "Why is promoting long videos through vertical shorts essential for channel growth?",
      a: "Short-form algorithms (Instagram Reels, YouTube Shorts, TikTok) reach millions of users who may never see your long video in their homepage recommendations. Publishing a high-converting teaser reel acts as a 24/7 billboard, funneling traffic from short-form feeds directly to your main channel."
    },
    {
      q: "Do I need complex video editing software to format vertical trailers?",
      a: "No editing skills or software downloads are needed. Traditional trailer editing requires setting up multi-frame aspect ratios, blurring background video edges, adding text overlays, and keyframing CTA buttons in Premiere Pro. Itnavideo automates the entire promo layout composition in under 30 seconds."
    },
    {
      q: "Can I customize the channel handle badge and CTA button text?",
      a: "Yes! You can enter your exact @ChannelHandle tag, customize call-to-action button text ('Watch Full Episode on YouTube', 'Link in Bio', 'Full Podcast Out Now'), and pick custom accent colors."
    },
    {
      q: "What video clips and thumbnail image formats are supported?",
      a: "Upload any 30-to-90 second highlight MP4/MOV clip alongside your standard 16:9 YouTube thumbnail image (JPG/PNG)."
    },
    {
      q: "What resolution is exported?",
      a: "Exports full 1080p Full HD MP4 files (1080x1920) optimized for Instagram Reels, YouTube Shorts, and TikTok."
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
              href="/dashboard?videoType=long-video-promo"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-purple-500/25 transition hover:brightness-110 active:scale-95"
            >
              <Sparkles size={16} />
              <span>Create Long Video Promo</span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-pink-600/20 via-purple-600/20 to-pink-500/20 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-pink-300 mb-6">
            <Tv size={14} className="text-pink-400" />
            <span>AI Long Video Promo Generator • High-Converting Teasers &amp; CTAs</span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1] max-w-5xl mx-auto">
            Turn Long YouTube Videos Into{' '}
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              High-Converting Vertical Teaser Trailers
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed font-medium max-w-3xl mx-auto">
            Stop letting your long YouTube videos sit at low view counts. Convert key highlights into 9:16 vertical promotional reels complete with pinned YouTube thumbnail frames, @channel handle tags, and animated Watch Full Video CTAs.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard?videoType=long-video-promo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-fuchsia-500 px-8 py-4 text-base font-black text-white shadow-xl shadow-pink-500/20 transition hover:brightness-110 active:scale-95"
            >
              <Play size={18} className="fill-white" />
              <span>Create Promo Teaser Free</span>
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#0E1526] px-8 py-4 text-base font-bold text-slate-200 hover:bg-[#152038] hover:border-purple-500/30 transition"
            >
              <span>View Pricing Plans</span>
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs sm:text-sm font-semibold text-slate-400 border-t border-white/10 pt-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Pinned Top Thumbnail Frame</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>@Channel Handle Badge Tag</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Animated Watch Full Video CTA</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>1080p HD Export</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: THE TRAFFIC FUNNEL REALITY */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#0A0F1D]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-3.5 py-1 text-xs font-bold uppercase text-pink-300">
                <Flame size={14} />
                <span>The Multi-Platform Traffic Strategy</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Why Top YouTubers Use Vertical Teaser Reels for Every Upload
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Producing a 15-minute YouTube documentary or podcast episode takes immense effort—scripting, filming, editing, and thumbnail design. However, relying solely on the YouTube homepage algorithm means missing out on millions of short-form viewers on Instagram Reels, YouTube Shorts, and TikTok.
              </p>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                By publishing a dedicated <strong className="text-white font-semibold">Long Video Promo reel</strong> that showcases your video's biggest hook alongside your thumbnail poster image, you turn short-form feeds into a high-converting acquisition channel.
              </p>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                With the <strong className="text-pink-400 font-semibold">Itnavideo Long Video Promo Generator</strong>, formatting promotional teaser trailers takes under 30 seconds.
              </p>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-[#0E1526] p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                    <BarChart3 size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">10x Link Click-Throughs</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Clear "Watch Full Video on YouTube" callouts drive engaged short-form scrollers to your main video link.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1526] p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <ExternalLink size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Instant Brand Recognition</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Pinning your YouTube thumbnail at the top frame reinforces thumbnail branding across platforms.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1526] p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Zap size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">30-Second Cloud Render</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Upload clip + thumbnail image. The cloud engine composes ambient canvas blurs and CTAs automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE 5 BOTTLENECKS SOLVED */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#070B14]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Solved: The 5 Major Promo Reel Bottlenecks
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-400 mb-6">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">1. Multi-Frame Aspect Ratio Formatting</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Fitting a 16:9 widescreen video and a 16:9 thumbnail into a vertical 9:16 reel frame manually takes 2+ hours in Premiere Pro.
              </p>
              <div className="rounded-xl bg-pink-500/10 border border-pink-500/20 p-3 text-xs font-semibold text-pink-300">
                <strong className="text-white">Itnavideo Solution:</strong> Automatic dual-frame layout engine positions thumbnail &amp; clip perfectly.
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 mb-6">
                <Share2 size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">2. Designing Channel Handle Badges</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Creating custom @Channel tags and social icons in Photoshop before importing into video editors stalls workflow momentum.
              </p>
              <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 p-3 text-xs font-semibold text-purple-300">
                <strong className="text-white">Itnavideo Solution:</strong> Built-in channel handle input rendering crisp glass badges.
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-[#0E1526] p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 mb-6">
                <Sliders size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">3. Ambient Canvas Blur Backgrounds</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Leaving black empty bars around letterboxed videos looks cheap.
              </p>
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs font-semibold text-emerald-300">
                <strong className="text-white">Itnavideo Solution:</strong> Automated gaussian ambient canvas blur fills background edges smoothly.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: FAQ ACCORDION */}
      <section className="py-16 sm:py-24 border-t border-white/10 bg-[#0A0F1D]">
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
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">Create Your Vertical Teaser Reel Free</h2>
          <p className="text-slate-300 text-lg mb-8">Drive 10x traffic to your YouTube videos and podcasts in seconds.</p>
          <Link
            href="/dashboard?videoType=long-video-promo"
            className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-fuchsia-500 px-8 py-4 text-base font-black text-white shadow-xl shadow-purple-500/25 transition hover:brightness-110"
          >
            <Sparkles size={18} />
            <span>Create Promo Teaser Free</span>
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
