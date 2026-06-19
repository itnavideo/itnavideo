import { ArrowRight, Check, Film, Image, Mic2, Play, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Long Video Promo Reel — Promote YouTube Videos with AI | Itnavideo',
  description: 'Create premium promo reels for your long YouTube videos. Thumbnail hero card, animated title, CTA, and optional voiceover with captions.',
  alternates: { canonical: '/templates/long-video-promo' },
  openGraph: {
    title: 'Long Video Promo — Turn Thumbnails into Promo Reels',
    description: 'Premium promo reels to drive views to your long-form YouTube content.',
  },
};

const steps = [
  { icon: Image, title: 'Add thumbnail', body: 'Upload your YouTube video thumbnail (16:9).' },
  { icon: Mic2, title: 'Add promo clip', body: 'Short voiceover or video promoting the long video.' },
  { icon: Sparkles, title: 'AI renders promo', body: 'Premium effects, glow borders, animated title, CTA.' },
  { icon: Play, title: 'Post & get views', body: '9:16 promo reel drives traffic to your full video.' },
];

const features = [
  '16:9 thumbnail hero card with glow border',
  'Animated title with blur-to-sharp reveal',
  'Pulsing CTA button (Watch Now)',
  'Key-point chips (Full Guide, Must Watch, etc.)',
  'Blurred thumbnail background with cinematic overlay',
  'Floating light particles + accent glow',
  'Optional promo video/audio section with captions',
  'Premium motion: zoom, pulse, spring physics',
];

const useCases = [
  'YouTube video promotion reels',
  'Course launch announcements',
  'Podcast episode previews',
  'Blog post promotion',
  'Product launch teasers',
  'Webinar registration promos',
];

export default function LongVideoPromoPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-28 pb-12 sm:px-6 md:pt-36 md:pb-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(16,185,129,0.06)_0%,transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
            <Film size={14} />
            Long Video Promo Template
          </span>
          <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Promote Your Long Videos<br />
            <span className="text-emerald-600">With Premium Promo Reels</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-500 sm:text-lg">
            Turn your YouTube thumbnail into a cinematic promo reel. Animated title, glow effects, CTA button, and optional voiceover — all designed to drive viewers to your full video.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/dashboard?template=long-video-promo" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-7 py-4 text-sm font-black text-white shadow-lg shadow-emerald-500/15 transition hover:bg-emerald-600">
              Create Promo Reel <ArrowRight size={16} />
            </Link>
            <Link href="/pricing" className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-6 py-4 text-sm font-black text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50">
              View Pricing
            </Link>
          </div>
          <p className="mt-5 text-xs text-zinc-400">One credit = one reel. Works with any plan.</p>
        </div>
      </section>

      {/* Preview */}
      <section className="bg-zinc-50 px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-wider text-emerald-600">Output Style</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Premium Promo Reel Layout</h2>
            <p className="mt-3 text-zinc-500">Thumbnail hero + animated title + CTA — designed to get clicks.</p>
          </div>
          <div className="mt-10 overflow-hidden rounded-2xl border-2 border-zinc-200 bg-zinc-900 p-6 shadow-lg">
            <div className="space-y-5">
              {/* Thumbnail mock */}
              <div className="relative aspect-video overflow-hidden rounded-xl border-2 border-emerald-500/40 bg-gradient-to-br from-zinc-800 to-zinc-900">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-400/60 bg-black/50">
                    <div className="ml-1 h-0 w-0 border-y-[8px] border-y-transparent border-l-[14px] border-l-emerald-400" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 right-2 text-center text-xs font-bold text-zinc-500">YOUR THUMBNAIL (16:9)</div>
              </div>
              {/* Title mock */}
              <h3 className="text-center text-2xl font-black text-white">Complete Guide to Domain & Hosting</h3>
              {/* Chips */}
              <div className="flex flex-wrap justify-center gap-2">
                {['Full Guide', 'Step-by-Step', 'Real Example', 'Must Watch'].map((chip) => (
                  <span key={chip} className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400">{chip}</span>
                ))}
              </div>
              {/* CTA */}
              <div className="text-center">
                <span className="inline-block rounded-full bg-emerald-500 px-6 py-3 text-sm font-black text-black">Watch Full Video →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-wider text-emerald-600">Process</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Thumbnail In. Promo Reel Out.</h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Icon size={18} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Step {i + 1}</p>
                  <h3 className="mt-1 text-sm font-black">{step.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-zinc-500">{step.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-zinc-50 px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-wider text-emerald-600">Features</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Premium Promo Effects</h2>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-white p-4">
                <Check size={16} className="shrink-0 text-emerald-500" />
                <span className="text-sm font-bold">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-wider text-emerald-600">Use Cases</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Perfect For</h2>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((uc) => (
              <div key={uc} className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-white p-4">
                <Zap size={14} className="shrink-0 text-emerald-500" />
                <span className="text-sm font-bold">{uc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-50 px-4 py-16 sm:px-6 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black sm:text-4xl">Drive Views to Your Long Videos</h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-600">
            Stop losing views because nobody scrolls to your video. Create a 30-second promo reel that grabs attention on Instagram, YouTube Shorts, and TikTok.
          </p>
          <Link href="/dashboard?template=long-video-promo" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 text-sm font-black text-white shadow-lg shadow-emerald-500/15 transition hover:bg-emerald-600">
            Create Your Promo Reel <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
