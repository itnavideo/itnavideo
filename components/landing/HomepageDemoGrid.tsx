'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

type TemplateCard = {
  n: number;
  title: string;
  input: string;
  desc: string;
  image: string;
  proof: string;
  accent: string;
  href: string;
};

const SHORT_TEMPLATES: TemplateCard[] = [
  {
    n: 1,
    title: 'Auto Caption Video',
    input: 'Video',
    desc: 'Clean, word-synced captions for any talking reel. Pick a style and post.',
    image: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788190064/file_000000005540821181b6095da390b68b_qumuqg.png',
    proof: 'Most used',
    accent: '#2563EB',
    href: '/dashboard?videoType=auto-caption-reel',
  },
  {
    n: 2,
    title: 'Compare Explainer',
    input: 'Audio + 2 images',
    desc: 'Left vs right comparison with a narration and a sticker presenter.',
    image: '/preview/Compare Explainer.png',
    proof: 'Clear decision',
    accent: '#06b6d4',
    href: '/dashboard?videoType=compare-explainer',
  },
  {
    n: 3,
    title: 'Whiteboard Video',
    input: 'Audio or Video',
    desc: 'AI writes key points on a premium corporate board synced to your speech.',
    image: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788190745/file_000000003c2882118520991dc7d2d827_alfyoc.png',
    proof: 'Corporate',
    accent: '#3b82f6',
    href: '/dashboard?videoType=whiteboard-video',
  },
  {
    n: 4,
    title: 'Typography Video',
    input: 'Video',
    desc: 'Bold keywords pop on your talking video the moment you say them.',
    image: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788094218/Typography_Video_sitlxz.png',
    proof: 'Engaging',
    accent: '#a78bfa',
    href: '/dashboard?videoType=typography-video',
  },
  {
    n: 5,
    title: 'Long Video Promo',
    input: 'Video + thumbnail',
    desc: 'Turn a long video into a short vertical teaser that drives the full watch.',
    image: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788190063/file_000000002d508209b398a35503a053e1_uiytox.png',
    proof: 'Promo ready',
    accent: '#f59e0b',
    href: '/dashboard?videoType=long-video-promo',
  },
  {
    n: 6,
    title: 'Multi Images Video',
    input: 'Video + images',
    desc: 'Your images animate in sync with the narration — great for stories.',
    image: '/preview/Multi Images Video.png',
    proof: 'Story format',
    accent: '#ec4899',
    href: '/dashboard?videoType=multi-images-video',
  },
];

const LONG_TEMPLATES: TemplateCard[] = [
  {
    n: 1,
    title: 'Long Caption Pro',
    input: '16:9 · up to 10 min',
    desc: 'Preserve your full landscape video and original audio with timed captions.',
    image: '/visuals/previews/long-caption-pro.png',
    proof: 'Pro',
    accent: '#3b82f6',
    href: '/dashboard?videoType=long-caption-pro',
  },
  {
    n: 2,
    title: 'Long Video Clips',
    input: 'Long video input',
    desc: 'AI picks the best moments from a long video and renders captioned short clips.',
    image: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788190063/file_000000002af082088dc89d221c90dc80_tmf4h8.png',
    proof: 'Repurpose',
    accent: '#06b6d4',
    href: '/dashboard?videoType=long-video-clips',
  },
  {
    n: 3,
    title: 'AI Video Generator',
    input: 'Voiceover / Video / Script',
    desc: 'Turn voiceovers, videos, or scripts into fully produced videos with AI B-roll, music, motion graphics & captions.',
    image: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788190063/file_0000000089c48211b67c16fe3c2636a2_prirg0.png',
    proof: 'Long YT Videos',
    accent: '#38BDF8',
    href: '/dashboard?videoType=ai-video-generator',
  },
  {
    n: 4,
    title: 'AI Audio Cleaner',
    input: 'Long audio input',
    desc: 'AI shows full script in dashboard preview, removes recording mistakes and awkward silences.',
    image: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788190064/file_0000000084e482119c5951ac67c32219_lncnaa.png',
    proof: 'Studio Sound',
    accent: '#eab308',
    href: '/dashboard?videoType=ai-audio-cleaner',
  },
];

function TemplateGrid({ items, ratio, cols }: { items: TemplateCard[]; ratio: string; cols: string }) {
  return (
    <div className={`grid grid-cols-1 gap-8 sm:grid-cols-2 ${cols}`}>
      {items.map((t) => (
        <div key={t.title} className="flex flex-col space-y-4">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-5xl font-black text-blue-500/20 leading-none">
              {String(t.n).padStart(2, '0')}
            </span>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t.title}</span>
          </div>

          <Link
            href={t.href}
            className="group block overflow-hidden rounded-3xl border border-border bg-card shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-slate-400 dark:border-border dark:bg-muted/40 dark:hover:border-border"
          >
            <div className={`relative ${ratio} overflow-hidden bg-muted`}>
              <Image
                src={t.image}
                alt={`${t.title} preview`}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover object-center transition duration-500 group-hover:scale-[1.04]"
              />
              <span
                className="absolute left-4 top-4 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white"
                style={{ backgroundColor: t.accent }}
              >
                {t.proof}
              </span>
            </div>

            <div className="border-t border-border dark:border-border p-5 space-y-2">
              <h3 className="text-sm font-bold text-card-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{t.title}</h3>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t.input}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{t.desc}</p>
              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider transition-all duration-300 group-hover:gap-2.5 pt-1"
                style={{ color: t.accent }}
              >
                <Play size={10} fill="currentColor" /> <span>Use template</span> <ArrowRight size={11} />
              </span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default function HomepageDemoGrid() {
  return (
    <section className="px-4 py-24 sm:px-6 bg-background border-t border-border">
      <div className="mx-auto max-w-7xl relative z-10">
        {/* Section header */}
        <div className="mx-auto mb-20 max-w-3xl text-center space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-500 dark:text-cyan-400 flex items-center justify-center gap-1.5">
            <Sparkles size={11} />
            <span>VIDEO TEMPLATES</span>
          </p>
          <h2 className="text-4xl font-black leading-tight text-foreground sm:text-5xl font-sans tracking-tight">
            Pick a template. <span className="text-blue-500">Upload. Done.</span>
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Each template has its own upload flow, AI pipeline, and output style — no generic one-size-fits-all.
          </p>
        </div>

        {/* Short videos */}
        <div className="mb-20">
          <div className="mb-10 space-y-1">
            <h3 className="text-2xl font-black text-foreground sm:text-3xl font-sans tracking-tight">Short Videos</h3>
            <p className="text-xs text-muted-foreground">9:16 vertical outputs for Instagram, TikTok &amp; YouTube Shorts</p>
          </div>
          <TemplateGrid items={SHORT_TEMPLATES} ratio="aspect-[9/16]" cols="lg:grid-cols-4" />
        </div>

        {/* Long videos */}
        <div>
          <div className="mb-10 space-y-1">
            <h3 className="text-2xl font-black text-foreground sm:text-3xl font-sans tracking-tight">Long Videos</h3>
            <p className="text-xs text-muted-foreground">16:9 tools for YouTube, podcasts &amp; lectures</p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {LONG_TEMPLATES.map((t) => (
              <div key={t.title} className="flex flex-col space-y-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-5xl font-black text-blue-500/20 leading-none">
                    {String(t.n).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t.title}</span>
                </div>

                <Link
                  href={t.href}
                  className="group block overflow-hidden rounded-3xl border border-border bg-card shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-slate-400 dark:border-border dark:bg-muted/40 dark:hover:border-border"
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <Image
                      src={t.image}
                      alt={`${t.title} preview`}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    {/* Play button hover state */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-80 transition group-hover:opacity-100">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-background/60 backdrop-blur-sm border border-border shadow-2xl">
                        <span className="ml-1 border-l-[14px] border-t-[8px] border-b-[8px] border-l-white border-t-transparent border-b-transparent" />
                      </div>
                    </div>

                    <span
                      className="absolute left-4 top-4 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white"
                      style={{ backgroundColor: t.accent }}
                    >
                      {t.proof}
                    </span>

                    <div className="absolute bottom-0 left-0 right-0 p-5 space-y-1 z-10">
                      <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition leading-none">{t.title}</h3>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-200">{t.input}</p>
                    </div>
                  </div>

                  <div className="p-5 space-y-2 border-t border-border dark:border-border">
                    <p className="text-xs leading-relaxed text-muted-foreground">{t.desc}</p>
                    <span
                      className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider transition-all duration-300 group-hover:gap-2.5 pt-1"
                      style={{ color: t.accent }}
                    >
                      <Play size={10} fill="currentColor" /> <span>Use template</span> <ArrowRight size={11} />
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

